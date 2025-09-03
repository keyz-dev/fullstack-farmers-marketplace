const RegistrationService = require("../../services/registrationService");
const NotificationService = require("../../services/notificationService");
const { clientRegistrationSchema } = require("../../validation/userValidation");
const { BadRequestError } = require("../../utils/errors");
const emailService = require("../../services/emailService");
const wrapAsync = require("../../error_handler/AsyncError");

// ==================== CLIENT REGISTRATION CONTROLLER ====================

/**
 * Register new client (customer)
 */
exports.registerClient = wrapAsync(async (req, res, next) => {
  try {
    // Validate the registration data
    const { error } = clientRegistrationSchema.validate(req.body);
    if (error) {
      throw new BadRequestError(error.details[0].message);
    }

    // Use the registration service for client registration
    const user = await RegistrationService.registerClient(req.body);

    // Create welcome notification for user
    await NotificationService.notifyUserAboutApplicationStatus(
      user._id,
      "registered",
      "client",
      null
    );

    // Send welcome email to user
    try {
      await emailService.sendWelcomeEmail(user);
    } catch (emailError) {
      console.error("Failed to send welcome email:", emailError);
      // Don't fail the request if email fails
    }

    res.status(201).json({
      success: true,
      message: "Client registration successful",
      data: {
        userId: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
});
