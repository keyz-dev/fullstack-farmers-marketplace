const Application = require("../models/application");
const User = require("../models/user");
const Notification = require("../models/notification");
const emailService = require("./emailService");
const { BadRequestError, NotFoundError } = require("../utils/errors");
const wrapAsync = require("../error_handler/AsyncError");

class ApplicationService {
  // Helper function to create notifications
  static async createNotification(
    userId,
    type,
    title,
    message,
    relatedId = null,
    relatedModel = "Application",
    priority = "medium"
  ) {
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
  }

  // Helper function to notify admins
  static async notifyAdmins(notificationType, title, message, relatedId) {
    try {
      const admins = await User.find({ role: "admin" });
      for (const admin of admins) {
        await this.createNotification(
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
  }

  // Step 1: Initiate registration (basic info only)
  static async initiateRegistration(userData, avatar = null, role = null) {
    const { email, ...otherUserData } = userData;

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      throw new BadRequestError(
        `User already exists with this email: ${email}`
      );
    }

    // Create user with incomplete role
    const incompleteRole = `incomplete_${role}`;
    user = new User({
      ...otherUserData,
      email,
      avatar,
      role: incompleteRole,
    });

    await user.save();

    // Send verification email
    try {
      await emailService.sendWelcomeEmail(user);
    } catch (err) {
      console.error("Failed to send welcome email:", err);
      // Don't fail the main operation if email fails
    }

    return {
      user: { id: user._id, email: user.email, role: user.role },
      message: `${role} registration initiated. Please complete your application.`,
    };
  }

  // Step 2: Submit application with documents
  static async submitApplication(
    userId,
    applicationType,
    applicationData,
    uploadedFiles,
    agreedToTerms
  ) {
    // Validate user exists and has correct role
    const user = await User.findById(userId);
    if (!user) {
      throw new NotFoundError("User not found");
    }

    const expectedRole = `incomplete_${applicationType}`;
    if (user.role !== expectedRole) {
      throw new BadRequestError(
        `User must have ${expectedRole} role to submit application`
      );
    }

    // Check if user already has a pending application
    const existingApplication = await Application.findByUserAndType(
      userId,
      applicationType
    );
    if (existingApplication && existingApplication.status === "pending") {
      throw new BadRequestError("You already have a pending application");
    }

    // Validate required documents based on application type
    const requiredDocuments = this.getRequiredDocuments(applicationType);
    const uploadedDocumentTypes =
      uploadedFiles.documents?.map((doc) => doc.documentName) || [];

    const missingDocuments = requiredDocuments.filter(
      (doc) => !uploadedDocumentTypes.includes(doc)
    );
    if (missingDocuments.length > 0) {
      throw new BadRequestError(
        `Missing required documents: ${missingDocuments.join(", ")}`
      );
    }

    // Create application
    const application = new Application({
      userId,
      applicationType,
      applicationData,
      documents: uploadedFiles.documents || [],
      agreedToTerms,
      metadata: {
        submissionMethod: "mobile_app",
      },
    });

    await application.save();

    // Update user role to pending
    const pendingRole = `pending_${applicationType}`;
    user.role = pendingRole;
    await user.save();

    // Create notification for user
    await this.createNotification(
      userId,
      "application_submitted",
      "Application Submitted Successfully",
      `Your ${applicationType} application has been submitted and is under review.`,
      application._id
    );

    // Send email notification to user
    try {
      await emailService.sendApplicationSubmittedEmail(application, user);
    } catch (emailError) {
      console.error("Failed to send application submission email:", emailError);
    }

    // Notify admins
    await this.notifyAdmins(
      "system_announcement",
      `New ${applicationType} Application`,
      `A new ${applicationType} application has been submitted by ${user.name}.`,
      application._id
    );

    return {
      application: { id: application._id, status: application.status },
      message: `${applicationType} application submitted successfully. Your application is under review.`,
    };
  }

  // Get required documents for application type
  static getRequiredDocuments(applicationType) {
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

  // Admin: Get all applications with filtering and pagination
  static async getAllApplications(options = {}) {
    const {
      page = 1,
      limit = 10,
      status,
      applicationType,
      search,
      sortBy = "submittedAt",
      sortOrder = "desc",
    } = options;

    const query = { isActive: true };

    // Add status filter
    if (status && status !== "all") {
      query.status = status;
    }

    // Add application type filter
    if (applicationType && applicationType !== "all") {
      query.applicationType = applicationType;
    }

    // Add search filter
    if (search) {
      query.$or = [
        { "applicationData.farmName": { $regex: search, $options: "i" } },
        { "applicationData.businessName": { $regex: search, $options: "i" } },
      ];
    }

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === "desc" ? -1 : 1;

    const applications = await Application.find(query)
      .populate("userId", "name email phone avatar")
      .sort(sortOptions)
      .limit(limit)
      .skip((page - 1) * limit);

    const total = await Application.countDocuments(query);

    return {
      applications,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // Admin: Get application by ID
  static async getApplicationById(applicationId) {
    const application = await Application.findById(applicationId)
      .populate("userId", "name email phone avatar address dob gender")
      .populate("adminReview.reviewedBy", "name email");

    if (!application) {
      throw new NotFoundError("Application not found");
    }

    return application;
  }

  // Admin: Review application
  static async reviewApplication(applicationId, adminId, reviewData) {
    const {
      status,
      remarks,
      rejectionReason,
      suspensionReason,
      documentReviews,
    } = reviewData;

    const application = await Application.findById(applicationId);
    if (!application) {
      throw new NotFoundError("Application not found");
    }

    if (!application.canBeReviewed()) {
      throw new BadRequestError(
        "Application cannot be reviewed in its current status"
      );
    }

    // Update application status
    application.status = status;
    application.adminReview = {
      reviewedBy: adminId,
      reviewedAt: new Date(),
      remarks,
      rejectionReason,
      suspensionReason,
    };

    // Update document verification status if provided
    if (documentReviews && Array.isArray(documentReviews)) {
      for (const docReview of documentReviews) {
        const document = application.documents.id(docReview.documentId);
        if (document) {
          document.isApproved = docReview.isApproved;
          document.verificationNotes = docReview.notes;
          document.verifiedAt = new Date();
          document.verifiedBy = adminId;
        }
      }
    }

    await application.save();

    // Update user role based on decision
    const user = await User.findById(application.userId);
    if (user) {
      switch (status) {
        case "approved":
          user.role = application.applicationType;
          await user.save();
          break;
        case "rejected":
          user.role = "client"; // Reset to client role
          await user.save();
          break;
        case "suspended":
          // Keep current role but mark as suspended
          break;
      }
    }

    // Create notification for user
    const notificationType = `application_${status}`;
    const notificationTitle = `Application ${
      status.charAt(0).toUpperCase() + status.slice(1)
    }`;
    let notificationMessage = `Your ${application.applicationType} application has been ${status}.`;

    if (status === "rejected" && rejectionReason) {
      notificationMessage += ` Reason: ${rejectionReason}`;
    }

    await this.createNotification(
      application.userId,
      notificationType,
      notificationTitle,
      notificationMessage,
      application._id
    );

    // Send email notification
    try {
      if (status === "approved") {
        await emailService.sendApplicationApprovedEmail(application, user);
      } else if (status === "rejected") {
        await emailService.sendApplicationRejectedEmail(
          application,
          user,
          rejectionReason
        );
      }
    } catch (emailError) {
      console.error("Failed to send application status email:", emailError);
    }

    return {
      application,
      message: `Application ${status} successfully`,
    };
  }

  // Get application statistics
  static async getApplicationStats() {
    const stats = await Application.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: { type: "$applicationType", status: "$status" },
          count: { $sum: 1 },
        },
      },
    ]);

    const formattedStats = {
      total: 0,
      byType: { farmer: 0, delivery_agent: 0 },
      byStatus: {
        pending: 0,
        under_review: 0,
        approved: 0,
        rejected: 0,
        suspended: 0,
      },
    };

    stats.forEach((stat) => {
      const { type, status } = stat._id;
      formattedStats.total += stat.count;
      formattedStats.byType[type] += stat.count;
      formattedStats.byStatus[status] += stat.count;
    });

    return formattedStats;
  }

  // Get user's application history
  static async getUserApplications(userId) {
    return await Application.find({ userId, isActive: true }).sort({
      createdAt: -1,
    });
  }

  // Get user's current application
  static async getUserCurrentApplication(userId, applicationType) {
    return await Application.findByUserAndType(userId, applicationType);
  }
}

module.exports = ApplicationService;
