const express = require("express");
const { upload, handleCloudinaryUpload,
    handleUploadError,
    formatFilePaths, } = require("../middleware/multer");
const { createuser, loginin } = require("../controller/auth");

const router = express.Router();

router.post("/register", upload.single("avatar"), handleCloudinaryUpload, formatFilePaths, handleUploadError, createuser);
router.post("/login", loginin);

module.exports = router;
