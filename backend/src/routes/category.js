const express = require('express');

const {
  addCategory,
  readsinglecategory,
  updateCategory,
  getAllCategories,
  deleteCategory,
} = require('../controller/category');

const { upload, handleCloudinaryUpload, formatFilePaths } = require('../middleware/multer');
const { authenticateUser, authorizeRoles } = require('../middleware/auth');

const router = express.Router();

// router.post('/', authenticateUser, authorizeRoles('admin'), upload.single('categoryImage'), addCategory);

router.get('/', getAllCategories);

router.get('/:_id', readsinglecategory);
router.put('/admin/:_id', authenticateUser, authorizeRoles('admin'), upload.single('categoryImage'), updateCategory);

router.delete(
  '/:_id',
  authenticateUser,
  authorizeRoles('admin'),
  deleteCategory
);

module.exports = router;