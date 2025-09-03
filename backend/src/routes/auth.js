const express = require("express");
const {
  upload,
  handleCloudinaryUpload,
  handleUploadError,
  formatFilePaths,
} = require("../middleware/multer");
const registrationController = require("../controller/registration");
const authController = require("../controller/auth");

const router = express.Router();

router.post(
  "/register",
  upload.single("avatar"),
  handleCloudinaryUpload,
  formatFilePaths,
  handleUploadError,
  registrationController.registerClient
);
router.post("/login", authController.login);

module.exports = router;
