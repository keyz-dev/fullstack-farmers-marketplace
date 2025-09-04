const express = require("express");
const {
  upload,
  handleCloudinaryUpload,
  handleUploadError,
  formatFilePaths,
} = require("../middleware/multer");
const registrationController = require("../controller/registration");
const authController = require("../controller/auth");
const { authenticateUser } = require("../middleware/auth");

const router = express.Router();

router.post(
  "/register/client",
  upload.single("avatar"),
  handleCloudinaryUpload,
  formatFilePaths,
  handleUploadError,
  registrationController.registerClient
);

// Admin registration (simple, no documents)
router.post(
  "/register/admin",
  upload.single("avatar"),
  handleCloudinaryUpload,
  formatFilePaths,
  handleUploadError,
  registrationController.registerAdmin
);

// Google OAuth sign up
router.post("/google-signup", authController.googleSignUp);

// Initiate doctor registration (basic user info only)
router.post(
  "/register/:role/initiate",
  upload.single("avatar"),
  handleCloudinaryUpload,
  formatFilePaths,
  handleUploadError,
  registrationController.initiateRegistration
);

router.post("/login", authController.login);

// Google OAuth login (sign in only, no account creation)
router.post("/google-login", authController.googleLogin);

// ==================== EMAIL VERIFICATION ROUTES ====================

// Verify email with code
router.post("/verify-email", authController.verifyEmail);

// Resend verification email
router.post("/resend-verification", authController.resendVerificationEmail);

// ==================== PASSWORD RESET ROUTES ====================

// Forgot password
router.post("/forgot-password", authController.forgotPassword);

// Reset password (requires reset token middleware)
router.post("/reset-password", authController.resetPassword);

// ==================== TOKEN VERIFICATION ====================

// Verify authentication token
router.get("/verify-token", authenticateUser, authController.verifyToken);

module.exports = router;
