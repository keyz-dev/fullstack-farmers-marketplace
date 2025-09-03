const Application = require("../models/application");
const User = require("../models/user");
const Notification = require("../models/notification");
const emailService = require("../services/emailService");
const { BadRequestError, NotFoundError } = require("../utils/errors");
const wrapAsync = require("../error_handler/AsyncError");
const { handleFileUploads } = require("../utils/documentUtil");

// Helper function to create notifications
const createNotification = async (
  userId,
  type,
  title,
  message,
  relatedId = null,
  relatedModel = "Application",
  priority = "medium"
) => {
  try {
    const notification = await Notification.create({
      user: userId,
      type,
      title,
      message,
      priority,
      relatedId,
      relatedModel,
      category: "applications",
    });

    // Emit real-time notification if socket is available
    if (global.io) {
      global.io.to(`user-${userId}`).emit("notification:new", {
        notification: {
          _id: notification._id,
          type: notification.type,
          title: notification.title,
          message: notification.message,
          priority: notification.priority,
          isRead: notification.isRead,
          createdAt: notification.createdAt,
          relatedId: notification.relatedId,
          relatedModel: notification.relatedModel,
        },
      });
    }

    return notification;
  } catch (error) {
    console.error("Error creating notification:", error);
    // Don't fail the main operation if notification fails
  }
};

// Helper function to notify admins
const notifyAdmins = async (notificationType, title, message, relatedId) => {
  try {
    const admins = await User.find({ role: "admin" });
    for (const admin of admins) {
      await createNotification(
        admin._id,
        notificationType,
        title,
        message,
        relatedId,
        "Application",
        "high"
      );
    }
  } catch (error) {
    console.error("Error notifying admins:", error);
    // Don't fail the main operation if admin notification fails
  }
};

// Submit application (Step 2 of registration)
exports.submitApplication = wrapAsync(async (req, res, next) => {
  try {
    const { applicationType, agreedToTerms } = req.body;

    if (
      !applicationType ||
      !["farmer", "delivery_agent"].includes(applicationType)
    ) {
      return next(new BadRequestError("Invalid application type"));
    }

    if (!agreedToTerms || agreedToTerms !== "true") {
      return next(
        new BadRequestError("You must agree to the terms and conditions")
      );
    }

    // Parse JSON fields
    let applicationData = {};
    try {
      if (req.body.applicationData) {
        applicationData = JSON.parse(req.body.applicationData);
      }
    } catch (error) {
      return next(new BadRequestError("Invalid application data format"));
    }

    // Check if user already has an active application
    const activeApplication = await Application.findOne({
      userId: req.rootUser._id,
      applicationType,
      status: { $in: ["pending", "under_review", "approved"] },
    });

    if (activeApplication) {
      return next(
        new BadRequestError(
          "You already have an active application. Please wait for the current application to be processed or contact support if you need to make changes."
        )
      );
    }

    // Get the latest application version for this user
    const latestApplication = await Application.findOne({
      userId: req.rootUser._id,
      applicationType,
    }).sort({ applicationVersion: -1 });

    const nextVersion = latestApplication
      ? latestApplication.applicationVersion + 1
      : 1;

    // Handle file uploads using the same pattern as hair marketplace
    const uploadedFiles = await handleFileUploads(
      req.files,
      req.body.documentNames
    );

    // Clear the document names from body
    delete req.body.documentNames;

    // Validate required documents based on application type
    const requiredDocuments = getRequiredDocuments(applicationType);
    const uploadedDocumentTypes =
      uploadedFiles.documents?.map((doc) => doc.documentName) || [];

    const missingDocuments = requiredDocuments.filter(
      (doc) => !uploadedDocumentTypes.includes(doc)
    );
    if (missingDocuments.length > 0) {
      return next(
        new BadRequestError(
          `Missing required documents: ${missingDocuments.join(", ")}`
        )
      );
    }

    // Create application
    const applicationData = {
      userId: req.rootUser._id,
      applicationType,
      applicationData,
      agreedToTerms: req.body.agreedToTerms === "true",
      applicationVersion: nextVersion,
      ...uploadedFiles,
    };

    const application = await Application.create(applicationData);

    // Update user role to pending
    const pendingRole = `pending_${applicationType}`;
    await User.findByIdAndUpdate(req.rootUser._id, { role: pendingRole });

    // Create notification for user
    await createNotification(
      req.rootUser._id,
      "application_submitted",
      "Application Submitted Successfully",
      `Your ${applicationType} application has been submitted and is under review.`,
      application._id
    );

    // Send confirmation email to user
    try {
      await emailService.sendApplicationSubmittedEmail(
        application,
        req.rootUser
      );
    } catch (emailError) {
      console.error(
        "Failed to send application confirmation email:",
        emailError
      );
      // Don't fail the request if email fails
    }

    // Notify admins
    await notifyAdmins(
      "system_announcement",
      `New ${applicationType} Application`,
      `A new ${applicationType} application has been submitted by ${req.rootUser.name}.`,
      application._id
    );

    res.status(201).json({
      success: true,
      message: `${applicationType} application submitted successfully`,
      data: {
        applicationId: application._id,
        status: application.status,
        applicationVersion: application.applicationVersion,
      },
    });
  } catch (error) {
    next(error);
  }
});

// Get application status
exports.getApplicationStatus = wrapAsync(async (req, res, next) => {
  try {
    const { applicationType } = req.params;

    if (!["farmer", "delivery_agent"].includes(applicationType)) {
      return next(new BadRequestError("Invalid application type"));
    }

    const application = await Application.findOne({
      userId: req.rootUser._id,
      applicationType,
    })
      .sort({ applicationVersion: -1 })
      .select(
        "status adminReview submittedAt approvedAt rejectedAt applicationVersion"
      );

    if (!application) {
      return res.status(200).json({
        success: true,
        data: { status: "not_submitted" },
      });
    }

    res.status(200).json({
      success: true,
      data: application,
    });
  } catch (error) {
    next(error);
  }
});

// Get application history
exports.getApplicationHistory = wrapAsync(async (req, res, next) => {
  try {
    const { applicationType } = req.params;

    if (!["farmer", "delivery_agent"].includes(applicationType)) {
      return next(new BadRequestError("Invalid application type"));
    }

    const applications = await Application.find({
      userId: req.rootUser._id,
      applicationType,
    })
      .sort({ applicationVersion: -1 })
      .select(
        "status adminReview submittedAt approvedAt rejectedAt applicationVersion createdAt"
      );

    res.status(200).json({
      success: true,
      data: {
        applications,
        totalApplications: applications.length,
        latestApplication: applications[0] || null,
      },
    });
  } catch (error) {
    next(error);
  }
});

// Admin: Get all applications with filtering and pagination
exports.getAllApplications = wrapAsync(async (req, res, next) => {
  try {
    const { status, applicationType, page = 1, limit = 10, search } = req.query;

    const filter = { isActive: true };
    if (status) filter.status = status;
    if (applicationType) filter.applicationType = applicationType;

    if (search) {
      filter.$or = [
        { "applicationData.farmName": { $regex: search, $options: "i" } },
        { "applicationData.businessName": { $regex: search, $options: "i" } },
        { "applicationData.shopName": { $regex: search, $options: "i" } },
      ];
    }

    const applications = await Application.find(filter)
      .populate("userId", "name email phone avatar")
      .populate("adminReview.reviewedBy", "name")
      .sort({ createdAt: -1, applicationVersion: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Application.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: {
        applications,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalApplications: total,
        },
      },
    });
  } catch (error) {
    next(error);
  }
});

// Admin: Get single application
exports.getApplication = wrapAsync(async (req, res, next) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate("userId", "name email phone avatar address dob gender")
      .populate("adminReview.reviewedBy", "name email");

    if (!application) {
      return next(new NotFoundError("Application not found"));
    }

    res.status(200).json({
      success: true,
      data: application,
    });
  } catch (error) {
    next(error);
  }
});

// Admin: Review application
exports.reviewApplication = wrapAsync(async (req, res, next) => {
  try {
    const { status, remarks, rejectionReason, documentReviews } = req.body;

    if (
      !["approved", "rejected", "suspended", "under_review"].includes(status)
    ) {
      return next(new BadRequestError("Invalid status"));
    }

    if (status === "rejected" && !rejectionReason) {
      return next(new BadRequestError("Rejection reason is required"));
    }

    const application = await Application.findById(req.params.id).populate(
      "userId",
      "name email"
    );

    if (!application) {
      return next(new NotFoundError("Application not found"));
    }

    // Update application status and admin review
    const updateData = {
      status: status,
      adminReview: {
        reviewedBy: req.rootUser._id,
        reviewedAt: new Date(),
        remarks: remarks,
      },
    };

    if (status === "approved") {
      updateData.approvedAt = new Date();

      // Create notification for user
      await createNotification(
        application.userId._id,
        "application_approved",
        "Application Approved!",
        `Congratulations! Your ${application.applicationType} application has been approved.`,
        application._id
      );

      // Send approval email to user
      try {
        await emailService.sendApplicationApprovedEmail(
          application,
          application.userId,
          remarks
        );
      } catch (emailError) {
        console.error("Failed to send application approval email:", emailError);
      }
    } else if (status === "rejected") {
      updateData.rejectedAt = new Date();
      updateData.adminReview.rejectionReason = rejectionReason;

      // Create notification for user
      await createNotification(
        application.userId._id,
        "application_rejected",
        "Application Update",
        `Your ${application.applicationType} application requires attention. Please check the details for more information.`,
        application._id
      );

      // Send rejection email to user
      try {
        await emailService.sendApplicationRejectedEmail(
          application,
          application.userId,
          rejectionReason,
          remarks
        );
      } catch (emailError) {
        console.error(
          "Failed to send application rejection email:",
          emailError
        );
      }
    } else if (status === "under_review") {
      // Create notification for user when application is under review
      await createNotification(
        application.userId._id,
        "application_reviewed",
        "Application Under Review",
        `Your ${application.applicationType} application is now under review. We'll notify you once a decision is made.`,
        application._id
      );
    }

    // Handle document reviews if provided (same pattern as hair marketplace)
    if (documentReviews && documentReviews.length > 0) {
      for (const docReview of documentReviews) {
        try {
          // Update the specific document in the array
          const updateResult = await Application.updateOne(
            {
              _id: application._id,
              "documents._id": docReview.documentId,
            },
            {
              $set: {
                "documents.$.isApproved": docReview.isApproved,
                "documents.$.adminRemarks": docReview.remarks,
              },
            }
          );

          if (updateResult.matchedCount === 0) {
            console.error(
              "Document not found for update:",
              docReview.documentId
            );
            // Try alternative matching by documentName as fallback
            const fallbackResult = await Application.updateOne(
              {
                _id: application._id,
                "documents.documentName": docReview.documentId,
              },
              {
                $set: {
                  "documents.$.isApproved": docReview.isApproved,
                  "documents.$.adminRemarks": docReview.remarks,
                },
              }
            );

            if (fallbackResult.matchedCount === 0) {
              console.error(
                "Document not found even with fallback:",
                docReview.documentId
              );
            }
          }
        } catch (error) {
          console.error("Error updating document review:", error);
        }
      }
    }

    const updatedApplication = await Application.findByIdAndUpdate(
      application._id,
      updateData,
      { new: true }
    ).populate("userId", "name email");

    res.status(200).json({
      success: true,
      message: `Application ${status} successfully`,
      data: updatedApplication,
    });
  } catch (error) {
    next(error);
  }
});

// Admin: Get application statistics
exports.getApplicationStats = wrapAsync(async (req, res, next) => {
  try {
    const [total, pending, approved, rejected] = await Promise.all([
      Application.countDocuments({ isActive: true }),
      Application.countDocuments({ status: "pending", isActive: true }),
      Application.countDocuments({ status: "approved", isActive: true }),
      Application.countDocuments({ status: "rejected", isActive: true }),
    ]);

    res.status(200).json({
      success: true,
      data: {
        stats: {
          total,
          pending,
          approved,
          rejected,
        },
      },
    });
  } catch (error) {
    next(error);
  }
});

// Helper function to get required documents for application type
function getRequiredDocuments(applicationType) {
  const commonDocuments = ["national_id", "profile_photo"];

  switch (applicationType) {
    case "farmer":
      return [...commonDocuments, "farm_license", "land_ownership"];
    case "delivery_agent":
      return [
        ...commonDocuments,
        "drivers_license",
        "vehicle_registration",
        "vehicle_insurance",
      ];
    default:
      return commonDocuments;
  }
}
