const ApplicationService = require("../../services/applicationService");
const wrapAsync = require("../../error_handler/AsyncError");
const { BadRequestError } = require("../../utils/errors");
const { formatApplicationsData, formatApplicationStats, formatApplicationData } = require("../../utils/returnFormats/applicationData");
const NotificationService = require("../../services/notificationService");

/**
 * Get all applications with filtering and pagination (admin only)
 */
exports.getAllApplications = wrapAsync(async (req, res, next) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      status, 
      applicationType, 
      search 
    } = req.query;

    const filters = {};

    if (applicationType) filters.applicationType = applicationType;
    if (status) filters.status = status;
    if (search) filters.search = search;

    // Use existing getAllApplications method
    const applications = await ApplicationService.getAllApplications(filters);

    // Apply pagination manually
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const paginatedApplications = applications.slice(skip, skip + parseInt(limit));
    const totalApplications = applications.length;
    const totalPages = Math.ceil(totalApplications / parseInt(limit));

    // Format the data using return format util
    const formattedApplications = formatApplicationsData(paginatedApplications);

    res.status(200).json({
      success: true,
      data: {
        applications: formattedApplications,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalApplications,
          limit: parseInt(limit)
        }
      }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * Review application (approve/reject) with document reviews and notifications
 */
exports.reviewApplication = wrapAsync(async (req, res, next) => {
  try {
    const { status, remarks, rejectionReason, documentReviews } = req.body;
    const { id } = req.params;
    const adminUserId = req.authUser.userId;

    // Validate required fields
    if (!status || !["approved", "rejected", "under_review"].includes(status)) {
      throw new BadRequestError(
        "Status must be either 'approved', 'rejected', or 'under_review'"
      );
    }

    if (status === "rejected" && !rejectionReason?.trim()) {
      throw new BadRequestError("Rejection reason is required");
    }

    // Get the application first to access user info
    const application = await ApplicationService.getApplicationById(id);
    if (!application) {
      throw new BadRequestError("Application not found");
    }

    // Prepare review data
    const reviewData = {
      remarks,
      rejectionReason,
      reviewNotes: remarks,
    };

    // Handle document reviews if provided
    if (documentReviews && documentReviews.length > 0) {
      reviewData.documentReviews = documentReviews;
    }

    // Update application status
    const updatedApplication = await ApplicationService.updateApplicationStatus(
      id,
      status,
      adminUserId,
      reviewData
    );

    // Send notifications based on status
    await sendApplicationReviewNotifications(
      application,
      status,
      remarks,
      rejectionReason
    );

    // Format the response data
    const formattedApplication = formatApplicationData(updatedApplication);

    res.status(200).json({
      success: true,
      message: `Application ${status} successfully`,
      data: formattedApplication,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * Send notifications for application review
 */
const sendApplicationReviewNotifications = async (
  application,
  status,
  remarks,
  rejectionReason
) => {
  try {
    const applicationType = application.applicationType;
    const businessName = application.farmName || application.businessName || "Application";
    const userId = application.userId._id || application.userId;

    let notificationType, title, message, priority;

    switch (status) {
      case "approved":
        notificationType = `${applicationType}_application_approved`;
        title = "Application Approved!";
        message = `Congratulations! Your ${applicationType} application for "${businessName}" has been approved. You can now access ${applicationType} features.`;
        priority = "high";
        break;

      case "rejected":
        notificationType = `${applicationType}_application_rejected`;
        title = "Application Update";
        message = `Your ${applicationType} application for "${businessName}" requires attention. Please check the details for more information.`;
        priority = "high";
        break;

      case "under_review":
        notificationType = `${applicationType}_application_under_review`;
        title = "Application Under Review";
        message = `Your ${applicationType} application for "${businessName}" is now under review. We'll notify you once a decision is made.`;
        priority = "medium";
        break;

      default:
        return;
    }

    // Create notification for the user
    await NotificationService.createNotification({
      user: userId,
      type: notificationType,
      title,
      message,
      priority,
      category: "applications",
      relatedId: application._id,
      relatedModel: "Application",
      actionData: {
        actionType: "view_application",
        actionUrl: `/applications/${application._id}`,
        actionText: "View Application",
      },
    });

    console.log(`✅ Notification sent to user ${userId} for application ${status}`);
  } catch (error) {
    console.error("Error sending application review notifications:", error);
    // Don't fail the main operation if notification fails
  }
};

/**
 * Get single application details (admin only)
 */
exports.getApplication = wrapAsync(async (req, res, next) => {
  try {
    const { id } = req.params;
    const application = await ApplicationService.getApplicationById(id);

    // Format the application data using return format util
    const formattedApplication = formatApplicationData(application);

    res.status(200).json({
      success: true,
      data: formattedApplication,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * Get application statistics (admin only)
 */
exports.getApplicationStats = wrapAsync(async (req, res, next) => {
  try {
    const stats = await ApplicationService.getApplicationStats();

    // Format the stats using return format util
    const formattedStats = formatApplicationStats(stats);

    res.status(200).json({
      success: true,
      data: {
        stats: formattedStats
      }
    });
  } catch (error) {
    next(error);
  }
});
