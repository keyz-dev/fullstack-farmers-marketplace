const express = require("express");
const {
  upload,
  handleCloudinaryUpload,
  formatFilePaths,
} = require("../middleware/multer");
const { authenticateUser, authorizeRoles } = require("../middleware/auth");
const { validate } = require("../middleware/validate");
const {
  adminReviewSchema,
  applicationUpdateSchema,
} = require("../validation/applicationValidation");
const applicationController = require("../controller/application/index");

const router = express.Router();

// Submit farmer application
router.post(
  "/farmer",
  authenticateUser,
  authorizeRoles(["client", "incomplete_farmer"]),
  upload.fields([
    { name: "profilePhoto", maxCount: 1 },
    { name: "farmPhotos", maxCount: 10 },
    { name: "documents", maxCount: 10 },
  ]),
  handleCloudinaryUpload,
  formatFilePaths,
  applicationController.submitFarmerApplication
);

// Submit delivery agent application
router.post(
  "/delivery-agent",
  authenticateUser,
  authorizeRoles(["client", "incomplete_delivery_agent"]),
  upload.fields([
    { name: "profilePhoto", maxCount: 1 },
    { name: "vehiclePhotos", maxCount: 10 },
    { name: "documents", maxCount: 10 },
  ]),
  handleCloudinaryUpload,
  formatFilePaths,
  applicationController.submitDeliveryAgentApplication
);

// Get user's own applications
router.get("/my", authenticateUser, applicationController.getMyApplications);

// Get applications by user ID (admin only)
router.get(
  "/user/:userId",
  authenticateUser,
  authorizeRoles(["admin"]),
  applicationController.getApplicationsByUserId
);

// Get single application
router.get("/:id", authenticateUser, applicationController.getApplication);

// Update application (user can update their own pending/rejected application)
router.put(
  "/:id",
  authenticateUser,
  validate(applicationUpdateSchema),
  applicationController.updateApplication
);

// Delete application (user can delete their own pending/rejected application)
router.delete(
  "/:id",
  authenticateUser,
  applicationController.deleteApplication
);

// ==================== ADMIN-ONLY ROUTES ====================

// Get all applications with filtering (admin only)
router.get(
  "/",
  authenticateUser,
  authorizeRoles(["admin"]),
  applicationController.getAllApplications
);

// Get application statistics (admin only)
router.get(
  "/stats",
  authenticateUser,
  authorizeRoles(["admin"]),
  applicationController.getApplicationStats
);

// Get single application details (with type)
router.get(
  "/:type/:id",
  authenticateUser,
  authorizeRoles(["admin"]),
  applicationController.getApplication
);

// Review application (approve/reject/suspend) - admin only
router.put(
  "/:type/:id/review",
  authenticateUser,
  authorizeRoles(["admin"]),
  validate(adminReviewSchema),
  applicationController.reviewApplication
);

module.exports = router;
