const Application = require("../models/application");
const User = require("../models/user");
const { BadRequestError, NotFoundError } = require("../utils/errors");
const { sendVerificationEmail } = require("../utils/sendVerificationEmail");

class ApplicationService {
  /**
   * Initiate farmer application (creates draft application)
   */
  static async initiateRegistration(userData, avatar, userRole) {
    const { email, ...otherUserData } = userData;

    // Check if user already exists, for mongodb
    let user = await User.findOne({ email });
    if (user) throw new BadRequestError("User already exists with this email");

    // Create user with incomplete_userRole role
    user = await User.create({
      ...otherUserData,
      email,
      avatar,
      role: `incomplete_${userRole}`,
      authProvider: "local",
      emailVerified: false,
      isApproved: false,
      isActive: true,
    });

    // Send verification email

    try {
      await sendVerificationEmail(user, email, user.name);
    } catch (err) {
      await user.destroy();
      throw new BadRequestError(err.message);
    }

    return {
      user: { id: user.id, email: user.email },
      message: "Registration initiated. Please verify your email to continue.",
    };
  }

  // ==================== FARMER APPLICATION SERVICE ====================

  /**
   * Submit farmer application
   */
  static async submitFarmerApplication(userId, applicationData, uploadedFiles) {
    try {
      // Check if user already has an active farmer application
      const activeApplication = await Application.findOne({
        userId,
        applicationType: "farmer",
        status: { $in: ["pending", "under_review", "approved"] },
      });

      if (activeApplication) {
        throw new BadRequestError(
          "You already have an active farmer application. Please wait for the current application to be processed or contact support if you need to make changes."
        );
      }

      // Get the latest application version for this user
      const latestApplication = await Application.findOne({
        userId,
        applicationType: "farmer",
      }).sort({ applicationVersion: -1 });

      const nextVersion = latestApplication
        ? latestApplication.applicationVersion + 1
        : 1;

      // Create application data
      const application = await Application.create({
        userId,
        applicationType: "farmer",
        applicationVersion: nextVersion,
        agreedToTerms: applicationData.agreedToTerms === "true",
        marketingConsent: applicationData.marketingConsent === "true",

        // Farmer-specific fields
        farmName: applicationData.farmName,
        farmType: applicationData.farmType,
        farmDescription: applicationData.farmDescription,
        farmSize: applicationData.farmSize,
        farmingExperience: applicationData.farmingExperience,
        farmAddress: applicationData.farmAddress,
        contactInfo: applicationData.contactInfo,
        paymentMethods: applicationData.paymentMethods,
        shipping: applicationData.shipping,

        // Media and documents
        farmPhotos: uploadedFiles.farmPhotos || [],
        documents: uploadedFiles.documents || [],
        profilePhoto: uploadedFiles.profilePhoto || null,
      });

      // Update user role to pending
      await User.findByIdAndUpdate(userId, { role: "pending_farmer" });

      return application;
    } catch (error) {
      throw error;
    }
  }

  // ==================== DELIVERY AGENT APPLICATION SERVICE ====================

  /**
   * Submit delivery agent application
   */
  static async submitDeliveryAgentApplication(
    userId,
    applicationData,
    uploadedFiles
  ) {
    try {
      // Check if user already has an active delivery agent application
      const activeApplication = await Application.findOne({
        userId,
        applicationType: "delivery_agent",
        status: { $in: ["pending", "under_review", "approved"] },
      });

      if (activeApplication) {
        throw new BadRequestError(
          "You already have an active delivery agent application. Please wait for the current application to be processed or contact support if you need to make changes."
        );
      }

      // Get the latest application version for this user
      const latestApplication = await Application.findOne({
        userId,
        applicationType: "delivery_agent",
      }).sort({ applicationVersion: -1 });

      const nextVersion = latestApplication
        ? latestApplication.applicationVersion + 1
        : 1;

      // Create application data
      const application = await Application.create({
        userId,
        applicationType: "delivery_agent",
        applicationVersion: nextVersion,
        agreedToTerms: applicationData.agreedToTerms === "true",

        // Delivery agent-specific fields
        businessName: applicationData.businessName,
        vehicleType: applicationData.vehicleType,
        serviceAreas: applicationData.serviceAreas,
        operatingHours: applicationData.operatingHours,
        deliveryPreferences: applicationData.deliveryPreferences,
        businessAddress: applicationData.businessAddress,
        contactInfo: applicationData.contactInfo,
        paymentMethods: applicationData.paymentMethods,

        // Media and documents
        vehiclePhotos: uploadedFiles.vehiclePhotos || [],
        documents: uploadedFiles.documents || [],
        profilePhoto: uploadedFiles.profilePhoto || null,
      });

      // Update user role to pending
      await User.findByIdAndUpdate(userId, { role: "pending_delivery_agent" });

      return application;
    } catch (error) {
      throw error;
    }
  }

  // ==================== APPLICATION MANAGEMENT ====================

  /**
   * Get all applications with optional filtering
   */
  static async getAllApplications(filters = {}) {
    try {
      const query = { isActive: true };

      if (filters.applicationType) {
        query.applicationType = filters.applicationType;
      }

      if (filters.status) {
        query.status = filters.status;
      }

      if (filters.userId) {
        query.userId = filters.userId;
      }

      const applications = await Application.find(query)
        .populate("userId", "name email phone avatar")
        .populate("adminReview.reviewedBy", "name")
        .sort({ submittedAt: -1 });

      return applications;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get single application by ID
   */
  static async getApplicationById(applicationId) {
    try {
      const application = await Application.findById(applicationId)
        .populate("userId", "name email phone avatar")
        .populate("adminReview.reviewedBy", "name");

      if (!application) {
        throw new NotFoundError("Application not found");
      }

      return application;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get applications by user ID
   */
  static async getApplicationsByUserId(userId, applicationType = null) {
    try {
      const query = { userId, isActive: true };

      if (applicationType) {
        query.applicationType = applicationType;
      }

      const applications = await Application.find(query)
        .populate("adminReview.reviewedBy", "name")
        .sort({ submittedAt: -1 });

      return applications;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update application status
   */
  static async updateApplicationStatus(
    applicationId,
    status,
    adminUserId,
    reviewData = {}
  ) {
    try {
      const application = await Application.findById(applicationId);

      if (!application) {
        throw new NotFoundError("Application not found");
      }

      // Check if application can be updated
      if (!application.canBeReviewed() && status !== "suspended") {
        throw new BadRequestError(
          "Application cannot be updated in its current status"
        );
      }

      // Prepare update data
      const updateData = {
        status,
        "adminReview.reviewedBy": adminUserId,
        "adminReview.reviewedAt": new Date(),
      };

      // Add review-specific data
      if (reviewData.remarks) {
        updateData["adminReview.remarks"] = reviewData.remarks;
      }

      if (reviewData.rejectionReason) {
        updateData["adminReview.rejectionReason"] = reviewData.rejectionReason;
      }

      if (reviewData.suspensionReason) {
        updateData["adminReview.suspensionReason"] =
          reviewData.suspensionReason;
      }

      if (reviewData.approvedDocuments) {
        updateData["adminReview.approvedDocuments"] =
          reviewData.approvedDocuments;
      }

      if (reviewData.rejectedDocuments) {
        updateData["adminReview.rejectedDocuments"] =
          reviewData.rejectedDocuments;
      }

      if (reviewData.reviewNotes) {
        updateData["adminReview.reviewNotes"] = reviewData.reviewNotes;
      }

      // Update application
      const updatedApplication = await Application.findByIdAndUpdate(
        applicationId,
        updateData,
        { new: true, runValidators: true }
      ).populate("userId", "name email phone avatar");

      // Update user role based on application status
      if (status === "approved") {
        const newRole =
          application.applicationType === "farmer"
            ? "farmer"
            : "delivery_agent";
        await User.findByIdAndUpdate(application.userId, { role: newRole });
      } else if (status === "rejected") {
        const newRole =
          application.applicationType === "farmer"
            ? "incomplete_farmer"
            : "incomplete_delivery_agent";
        await User.findByIdAndUpdate(application.userId, { role: newRole });
      }

      return updatedApplication;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get application statistics
   */
  static async getApplicationStats() {
    try {
      const stats = await Application.aggregate([
        {
          $group: {
            _id: {
              applicationType: "$applicationType",
              status: "$status",
            },
            count: { $sum: 1 },
          },
        },
      ]);

      return stats;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = ApplicationService;
