const ApplicationService = require("../../services/applicationService");
const wrapAsync = require("../../error_handler/AsyncError");
const { BadRequestError } = require("../../utils/errors");

/**
 * Get all applications (admin only)
 */
exports.getAllApplications = wrapAsync(async (req, res, next) => {
  try {
    const { applicationType, status, userId } = req.query;
    const filters = {};

    if (applicationType) filters.applicationType = applicationType;
    if (status) filters.status = status;
    if (userId) filters.userId = userId;

    const applications = await ApplicationService.getAllApplications(filters);

    res.status(200).json({
      success: true,
      count: applications.length,
      data: applications,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * Review application (approve/reject)
 */
exports.reviewApplication = wrapAsync(async (req, res, next) => {
  try {
    const { status, remarks, rejectionReason, documentReviews } = req.body;
    const { id } = req.params;
    const adminUserId = req.user.userId;

    // Validate required fields
    if (!status || !["approved", "rejected", "suspended"].includes(status)) {
      throw new BadRequestError(
        "Status must be either 'approved', 'rejected', or 'suspended'"
      );
    }

    if (status === "rejected" && !rejectionReason?.trim()) {
      throw new BadRequestError("Rejection reason is required");
    }

    if (status === "suspended" && !remarks?.trim()) {
      throw new BadRequestError("Suspension reason is required");
    }

    // Prepare review data
    const reviewData = {
      remarks,
      rejectionReason,
      reviewNotes: remarks,
    };

    // Add document reviews if provided
    if (documentReviews) {
      if (documentReviews.approvedDocuments) {
        reviewData.approvedDocuments = documentReviews.approvedDocuments;
      }
      if (documentReviews.rejectedDocuments) {
        reviewData.rejectedDocuments = documentReviews.rejectedDocuments;
      }
    }

    const updatedApplication = await ApplicationService.updateApplicationStatus(
      id,
      status,
      adminUserId,
      reviewData
    );

    res.status(200).json({
      success: true,
      message: `Application ${status} successfully`,
      data: updatedApplication,
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

    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    next(error);
  }
});
