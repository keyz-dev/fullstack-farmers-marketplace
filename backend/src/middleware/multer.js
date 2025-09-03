require("dotenv").config();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const { uploadToCloudinary } = require("../utils/cloudinary");
const { BadRequestError } = require("../utils/errors");

const inProduction = process.env.NODE_ENV === "production";

// Ensure upload directories exist (only for development)
const createUploadDirs = () => {
  if (inProduction) return;

  const dirs = [
    "uploads",
    "uploads/avatars",
    "uploads/products",
    "uploads/categories",
    "uploads/icons",
    "uploads/posts/images",
    "uploads/farmers",
    "uploads/farmers/logos",
    "uploads/farmers/covers",
    "uploads/farmers/photos",
    "uploads/farmers/documents",
    "uploads/delivery_agents",
    "uploads/delivery_agents/documents",
  ];

  dirs.forEach((dir) => {
    const dirPath = path.join(process.cwd(), "src", dir);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
  });
};

// Determine subdirectory based on file fieldname
const getUploadSubDir = (fieldname) => {
  switch (fieldname) {
    case "avatar":
      return "avatars";
    case "products":
      return "products";
    case "categoryImage":
      return "categories";
    case "icon":
      return "icons";
    case "productImage":
    case "productImages":
      return "products";
    case "farmerLogo":
      return "farmers/logos";
    case "farmerCover":
      return "farmers/covers";
    case "farmerPhotos":
      return "farmers/photos";
    case "farmerDocument":
      return "farmers/documents";
    case "deliveryAgentDocument":
      return "delivery_agents/documents";
    default:
      return "misc";
  }
};

// Helper for Cloudinary folder
function getCloudinaryFolder(fieldname) {
  return getUploadSubDir(fieldname) || "misc";
}

// Create directories on startup (only in development)
createUploadDirs();

// --- Multer Storage Config ---
const storage = inProduction
  ? multer.memoryStorage()
  : multer.diskStorage({
      destination: (req, file, cb) => {
        const subDir = getUploadSubDir(file.fieldname);
        file.folderName = subDir;
        const uploadDir = path.join(__dirname, "../uploads", subDir);
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
      },
      filename: (req, file, cb) => {
        const uniqueId = uuidv4();
        const ext = path.extname(file.originalname);
        cb(null, `${uniqueId}${ext}`);
      },
    });

// --- File Filter ---
const fileFilter = (req, file, cb) => {
  // Allow images for most uploads
  const imageExtensions = /\.(jpg|jpeg|png|gif|webp|svg|ico|avif)$/;
  // Allow documents for vendor uploads
  const documentExtensions = /\.(pdf|doc|docx|txt|jpg|jpeg|png|webp)$/;

  if (file.fieldname === "documents") {
    if (!file.originalname.match(documentExtensions)) {
      return cb(
        new BadRequestError(
          "Only PDF, DOC, DOCX, TXT, and image files are allowed for documents!"
        ),
        false
      );
    }
  } else {
    if (!file.originalname.match(imageExtensions)) {
      return cb(new BadRequestError("Only image files are allowed!"), false);
    }
  }

  cb(null, true);
};

// --- Multer Instance ---
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB for videos
    files: 10, // Max 10 files
  },
});

// --- Middleware: Cloudinary Upload (production) ---
const handleCloudinaryUpload = async (req, res, next) => {
  if (!inProduction) return next();

  try {
    if (!req.file && !req.files) return next();

    // Handle single file upload (upload.single)
    if (req.file) {
      const folderName = getCloudinaryFolder(req.file.fieldname);
      req.file.folderName = folderName;

      // Determine resource type based on file mimetype
      const uploadOptions = {
        folder: folderName,
        resource_type: "auto",
      };

      const result = await uploadToCloudinary(req.file.buffer, uploadOptions);
      req.file.path = result.secure_url;
    }

    // Handle multiple files
    else if (req.files) {
      // Case 1: req.files is an array (from upload.array)
      if (Array.isArray(req.files)) {
        const uploadPromises = req.files.map((file) => {
          const folderName = getCloudinaryFolder(file.fieldname);
          file.folderName = folderName;

          // Determine resource type based on file mimetype
          const uploadOptions = {
            folder: folderName,
            resource_type: "auto",
          };

          return uploadToCloudinary(file.buffer, uploadOptions);
        });

        const results = await Promise.all(uploadPromises);

        req.files = results.map((result, index) => ({
          ...req.files[index],
          path: result.secure_url,
          public_id: result.public_id,
        }));
      }
      // Case 2: req.files is an object (from upload.fields)
      else if (typeof req.files === "object" && req.files !== null) {
        const uploadedFiles = {};
        const fieldPromises = Object.keys(req.files).map(async (fieldname) => {
          const filesInField = req.files[fieldname];

          const uploadPromises = filesInField.map((file) => {
            const folderName = getCloudinaryFolder(file.fieldname);
            file.folderName = folderName;
            const uploadOptions = {
              folder: folderName,
              resource_type: "auto",
            };
            return uploadToCloudinary(file.buffer, uploadOptions);
          });

          const results = await Promise.all(uploadPromises);

          uploadedFiles[fieldname] = results.map((result, index) => ({
            ...filesInField[index],
            path: result.secure_url,
            public_id: result.public_id,
          }));
        });

        await Promise.all(fieldPromises);
        req.files = uploadedFiles;
      }
    }

    next();
  } catch (error) {
    next(error);
  }
};

// --- Middleware: Format File Paths for Response ---
const formatFilePaths = (req, res, next) => {
  if (req.file) {
    if (!inProduction) {
      req.file.path = `/uploads/${req.file.folderName}/${path.basename(
        req.file.path
      )}`;
    }
  }
  if (req.files && Object.keys(req.files).length > 0 && !inProduction) {
    Object.keys(req.files).forEach((key) => {
      if (Array.isArray(req.files[key])) {
        req.files[key] = req.files[key].map((file) => {
          if (!inProduction) {
            file.path = `/uploads/${file.folderName}/${path.basename(
              file.path
            )}`;
          }
          file.path = file.path.replace(/\\/g, "/");
          return file;
        });
      } else {
        req.files[key].path = `/uploads/${
          req.files[key].folderName
        }/${path.basename(req.files[key].path)}`;
      }
    });
  }
  next();
};

// --- Middleware: Handle Multer Errors ---
const handleUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return next(
        new BadRequestError("File size too large. Maximum size is 5MB.")
      );
    }
    return next(new BadRequestError(err.message));
  }
  next(err);
};

// --- Exports ---
module.exports = {
  upload,
  handleCloudinaryUpload,
  handleUploadError,
  formatFilePaths,
};
