const ApplicationService = require("../../services/applicationService");
const wrapAsync = require("../../error_handler/AsyncError");
const { BadRequestError } = require("../../utils/errors");
const { farmerApplicationSchema } = require("../../validation/userValidation");
const { cleanUpFileImages } = require("../../utils/imageCleanup");
const { handleFileUploads } = require("../../utils/documentUtil");
const NotificationService = require("../../services/notificationService");
const emailService = require("../../services/emailService");
const logger = require("../../utils/logger");

/**
 * Submit farmer application
 */
exports.submitFarmerApplication = wrapAsync(async (req, res, next) => {
  try {
    // Parse form data before validation (following consultation reference pattern)
    req.body.contactInfo = JSON.parse(req.body.contactInfo || "[]");
    req.body.farmAddress = JSON.parse(req.body.farmAddress || "{}");
    req.body.paymentMethods = JSON.parse(req.body.paymentMethods || "[]");
    req.body.farmSize = JSON.parse(req.body.farmSize || "{}");
    req.body.shipping = JSON.parse(req.body.shipping || "{}");
    req.body.documentNames = req.body.documentNames
      ? Array.isArray(req.body.documentNames)
        ? req.body.documentNames
        : [req.body.documentNames]
      : [];

    // Validate the parsed data
    const { error } = farmerApplicationSchema.validate(req.body);
    if (error) {
      throw new BadRequestError(error.details[0].message);
    }
    let uploadedFiles = {};
    if (req.files) {
      uploadedFiles = await handleFileUploads(
        req.files,
        req.body.documentNames
      );
    }

    // Clear the document names from body
    delete req.body.documentNames;

    const application = await ApplicationService.submitFarmerApplication(
      req.rootUser._id,
      req.body,
      uploadedFiles
    );

    // Create notification for user
    await NotificationService.notifyUserAboutApplicationStatus(
      req.rootUser._id,
      "submitted",
      "farmer",
      application._id
    );

    // Notify admins
    await NotificationService.notifyAdmins(
      "farmer_application_submitted",
      "New Farmer Application",
      `A new farmer application has been submitted by ${req.rootUser.name}.`,
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
      logger.error(
        "Failed to send application confirmation email:",
        emailError
      );
    }

    res.status(201).json({
      success: true,
      message: "Farmer application submitted successfully",
      data: application,
    });
  } catch (error) {
    await cleanUpFileImages(req);
    next(error);
  }
});
