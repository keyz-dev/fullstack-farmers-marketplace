const express = require("express");
const { authenticateUser } = require("../middleware/auth");
const { validate } = require("../middleware/validate");
const registrationController = require("../controller/registration");

const router = express.Router();

// ==================== REGISTRATION ROUTES ====================

// Client registration (no authentication required)
router.post("/client", registrationController.registerClient);

// ==================== APPLICATION INITIATION ROUTES ====================

// Initiate farmer registration (creates user account + draft application)
router.post("/farmer", registrationController.initiateFarmerRegistration);

// Initiate delivery agent registration (creates user account + draft application)
router.post(
  "/delivery-agent",
  registrationController.initiateDeliveryAgentRegistration
);

// ==================== APPLICATION REQUIREMENTS & ELIGIBILITY ====================

// Get application requirements for a specific type (no authentication required)
router.get(
  "/requirements/:applicationType",
  registrationController.getApplicationRequirements
);

// Check if user can apply for a specific application type (requires authentication)
router.get(
  "/eligibility/:applicationType",
  authenticateUser,
  registrationController.checkApplicationEligibility
);

module.exports = router;
