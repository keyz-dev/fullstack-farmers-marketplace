const Application = require("../../models/application");
const ApplicationService = require("../../services/applicationService");
const wrapAsync = require("../../error_handler/AsyncError");
const { BadRequestError, NotFoundError } = require("../../utils/errors");

/**
 * Get single application with details
 */
exports.getApplication = wrapAsync(async (req, res, next) => {
  try {
    const { id } = req.params;

    const application = await ApplicationService.getApplicationById(id);

    res.status(200).json({
      success: true,
      data: application,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * Get applications by user ID
 */
exports.getApplicationsByUserId = wrapAsync(async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { applicationType } = req.query;

    const applications = await ApplicationService.getApplicationsByUserId(
      userId,
      applicationType
    );

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
 * Get user's own applications
 */
exports.getMyApplications = wrapAsync(async (req, res, next) => {
  try {
    const userId = req.rootUser._id;
    const { applicationType } = req.query;

    const applications = await ApplicationService.getApplicationsByUserId(
      userId,
      applicationType
    );

    res.status(200).json({
      success: true,
      count: applications.length,
      data: applications,
    });
  } catch (error) {
    next(error);
  }
});

// ==================== APPLICATION MANAGEMENT ====================

/**
 * Update application (user can update their own pending application)
 */
exports.updateApplication = wrapAsync(async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.rootUser._id;
    const updateData = req.body;

    // Check if application exists and belongs to user
    const application = await Application.findById(id);
    if (!application) {
      throw new NotFoundError("Application not found");
    }

    if (application.userId.toString() !== userId) {
      throw new BadRequestError("You can only update your own application");
    }

    // Check if application can be updated
    if (!["pending", "rejected"].includes(application.status)) {
      throw new BadRequestError(
        "Application cannot be updated in its current status"
      );
    }

    // Update application
    const updatedApplication = await Application.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate("userId", "name email phone avatar");

    res.status(200).json({
      success: true,
      message: "Application updated successfully",
      data: updatedApplication,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * Delete application (user can delete their own pending/rejected application)
 */
exports.deleteApplication = wrapAsync(async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.rootUser._id;

    // Check if application exists and belongs to user
    const application = await Application.findById(id);
    if (!application) {
      throw new NotFoundError("Application not found");
    }

    if (application.userId.toString() !== userId) {
      throw new BadRequestError("You can only delete your own application");
    }

    // Check if application can be deleted
    if (!["pending", "rejected"].includes(application.status)) {
      throw new BadRequestError(
        "Application cannot be deleted in its current status"
      );
    }

    // Soft delete by setting isActive to false
    await Application.findByIdAndUpdate(id, { isActive: false });

    res.status(200).json({
      success: true,
      message: "Application deleted successfully",
    });
  } catch (error) {
    next(error);
  }
});
