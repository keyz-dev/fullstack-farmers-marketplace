// import
const express = require('express');
const {
  readallproducts,
  createproduct,
  updateproduct,
  removeproduct,
  addProductImage,
  deleteProductImage,
  readsingleproduct,
  getProductsByZone,
  getFarmerProducts,
  compareProducts,
  readBestSellers,
  readNewArrivals,
} = require('../controller/product');

const { authenticateUser, authorizeRoles } = require('../middleware/auth');
const { upload, handleCloudinaryUpload, formatFilePaths } = require('../middleware/multer');

const router = express.Router();

router.post('/create', authenticateUser, authorizeRoles('farmer'), upload.array('productImages', 10), handleCloudinaryUpload, formatFilePaths, createproduct);

router.get('/all', readallproducts);
router.get('/best-sellers', readBestSellers);
router.get('/new-arrivals', readNewArrivals);
router.get('/get/:id', readsingleproduct);

// Farmer routes
router.get('/myproducts', authenticateUser, authorizeRoles('farmer'), getFarmerProducts);

router.put('/update/:_id', authenticateUser, authorizeRoles('farmer'), upload.array('productImages', 10), handleCloudinaryUpload, formatFilePaths, updateproduct);
router.delete('/:id', authenticateUser, authorizeRoles('farmer'), removeproduct);
router.put('/image/:id', authenticateUser, authorizeRoles('farmer'), upload.single('productImage'), handleCloudinaryUpload, formatFilePaths, addProductImage);
router.delete('/image/:id', authenticateUser, authorizeRoles('farmer'), deleteProductImage);
router.route('/products/zone/:zone').get(getProductsByZone);
router.route('/products/compare').get(compareProducts);




module.exports = router;