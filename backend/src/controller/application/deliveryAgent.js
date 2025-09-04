
const ApplicationService = require("../../services/applicationService");
const wrapAsync = require("../../error_handler/AsyncError");
const { BadRequestError } = require("../../utils/errors");
const {
  deliveryAgentApplicationSchema,
} = require("../../validation/userValidation");
const { cleanUpFileImages } = require("../../utils/imageCleanup");
const { handleFileUploads } = require("../../utils/documentUtil");
const NotificationService = require("../../services/notificationService");
const emailService = require("../../services/emailService");
const logger = require("../../utils/logger");

/**
 * Submit delivery agent application
 */
exports.submitDeliveryAgentApplication = wrapAsync(async (req, res, next) => {
  try {
    // Parse form data before validation (following consultation reference pattern)
    req.body.contactInfo = JSON.parse(req.body.contactInfo || "[]");
    req.body.businessAddress = JSON.parse(req.body.businessAddress || "{}");
    req.body.paymentMethods = JSON.parse(req.body.paymentMethods || "[]");
    req.body.operatingHours = JSON.parse(req.body.operatingHours || "[]");
    req.body.deliveryPreferences = JSON.parse(
      req.body.deliveryPreferences || "{}"
    );
    req.body.serviceAreas = req.body.serviceAreas
      ? Array.isArray(req.body.serviceAreas)
        ? req.body.serviceAreas
        : [req.body.serviceAreas]
      : [];
    req.body.documentNames = req.body.documentNames
      ? Array.isArray(req.body.documentNames)
        ? req.body.documentNames
        : [req.body.documentNames]
      : [];

    let uploadedFiles = {};
    if (req.files) {
      uploadedFiles = await handleFileUploads(
        req.files,
        req.body.documentNames
      );
    }

    // Validate the parsed data
    const { error } = deliveryAgentApplicationSchema.validate(req.body);
    if (error) {
      throw new BadRequestError(error.details[0].message);
    }

    // Clear the document names from body
    delete req.body.documentNames;

    const application = await ApplicationService.submitDeliveryAgentApplication(
      req.authUser._id,
      req.body,
      uploadedFiles
    );

    // Create notification for user

    await NotificationService.notifyUserAboutApplicationStatus(
      req.authUser._id,
      "submitted",
      "delivery_agent",
      application._id
    );

    // Notify admins

    await NotificationService.notifyAdmins(
      "delivery_agent_application_submitted",
      "New Delivery Agent Application",
      `A new delivery agent application has been submitted by ${req.authUser.name}.`,
      application._id
    );

    // Send confirmation email to user

    try {
      await emailService.sendApplicationSubmittedEmail(
        application,
        req.authUser
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
      message: "Delivery agent application submitted successfully",
      data: application,
    });
  } catch (error) {
    await cleanUpFileImages(req);
    next(error);
  }
});
