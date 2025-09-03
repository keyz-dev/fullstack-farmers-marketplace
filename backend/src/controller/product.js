const Product = require("../models/product");
const { BadRequestError, NotFoundError } = require("../utils/errors");
const wrapAsync = require("../error_handler/AsyncError");
const getDataUri = require("../utils/dataUri");
const cloudinary = require("cloudinary");
const { formatImageUrl } = require("../utils/imageUtils.js");
const { createProductSchema } = require("../validation/productValidation");
// to Create product
const { cleanUpInstanceImages, deleteImage } = require("../utils/imageCleanup.js");

const formatProductData = (product) => {
  const formattedProduct = {
    ...product._doc,
    images: product.images.map((image) => formatImageUrl(image)),
  };

  // Format vendor avatar if vendor is populated
  if (product.vendor && product.vendor.avatar) {
    formattedProduct.vendor = {
      ...formattedProduct.vendor,
      avatar: formatImageUrl(product.vendor.avatar)
    };
  }

  // Format category image if category is populated
  if (product.category && product.category.image) {
    formattedProduct.category = {
      ...formattedProduct.category,
      image: formatImageUrl(product.category.image)
    };
  }

  return formattedProduct;
};

const createproduct = wrapAsync(async (req, res, next) => {
  console.log("creating product...\n")
  console.log(req.body)
  const { value, error } = createProductSchema.validate(req.body);

  if (error) {
    return next(new BadRequestError(error.details[0].message));
  }
  if (!req.files || req.files.length === 0) {
    return next(new NotFoundError("product image not found"));
  }
  
  // Extract image paths from the uploaded files array
  let images = req.files.map(file => file.path);

  const product = await Product.create({
    ...value,
    images,
    vendor: req.rootUser._id,
  });

  await product.populate("category");
  await product.populate("vendor");

  res.status(200).json({
    success: true,
    message: "Product Created Successfully",
    data: formatProductData(product),
  });
});

// to read all the product
const readallproducts = wrapAsync(async (req, res) => {
  const { limit, category } = req.query;

  const query = {};

  if (category !== undefined || category == "") {
    query.category = category;
  }

  const products = await Product.find(query)
    .populate("category")
    .populate("vendor")
    .limit(limit ? parseInt(limit) : 30);

  let data = [];

  products.forEach((product, index) => {
    data.push(formatProductData(product));
  });

  console.log("products fetched successfully...\n")
  console.log(data)

  res.status(200).json({
    success: true,
    data,
  });
});

const searchproducts = wrapAsync(async (req, res) => {
  const { keyword, category } = req.query;
  const query = {
    name: {
      $regex: keyword ? keyword : "",
      $options: "i",
    },
  };

  if (category !== undefined || category == "") {
    query.category = category;
  }

  const products = await Product.find(query)
    .populate("category")
    .populate("vendor");

  let data = [];
  if (products) {
    data = products.map((product) => formatProductData(product));
  }

  res.status(200).json({
    success: true,
    data,
  });
});

// Get Best Sellers
const readBestSellers = wrapAsync(async (req, res, next) => {
  const bestSellers = await Product.find()
    .sort({ rating: -1 })
    .limit(6)
    .populate("category")
    .populate("vendor");

  let data = [];
  if (bestSellers) {
    data = bestSellers.map((product) => formatProductData(product));
  }

  res.json({
    success: true,
    data,
  });
});

const readNewArrivals = wrapAsync(async (req, res, next) => {
  const products = await Product.find()
    .sort({ createdAt: -1 })
    .populate("category")
    .populate("vendor")
    .limit(10);

  let data = [];
  if (products) {
    data = products.map((product) => formatProductData(product));
  }

  res.json({
    success: true,
    data,
  });
});

// to read  the product
const readsingleproduct = wrapAsync(async (req, res, next) => {
  const product = await Product.findById(req.params._id)
    .populate("category")
    .populate("vendor");
  if (!product) {
    return next(new NotFoundError("product not found"));
  }
  res.status(200).json({ 
    success: true, 
    product: formatProductData(product) 
  });
});

// to update the product
const updateproduct = wrapAsync(async (req, res, next) => {
  let product = await Product.findById(req.params._id);

  if (!product) {
    return next(new NotFoundError("product not found"));
  }

  const updateFields = { ...req.body };

  // Handle numeric fields
  if (updateFields.price) updateFields.price = parseFloat(updateFields.price);
  if (updateFields.stock) updateFields.stock = parseInt(updateFields.stock);
  if (updateFields.deliveryRadiusKm) updateFields.deliveryRadiusKm = parseFloat(updateFields.deliveryRadiusKm);
  if (updateFields.isDeliverable) updateFields.isDeliverable = updateFields.isDeliverable === 'true';

  // Handle new images
  if (req.files && req.files.length > 0) {
    const newImages = req.files.map(file => file.path);
    updateFields.images = [...(product.images || []), ...newImages];
  }

  Object.assign(product, updateFields);
  await product.save();
  await product.populate('category');

  res.status(200).json({
    success: true,
    message: "Product Updated Successfully",
    data: formatProductData(product),
  });
});

// add Product Image
const addProductImage = wrapAsync(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) return next(new NotFoundError("Product not found"));

  if (!req.file) return next(new BadRequestError("Please add image"));

  // Use the file path from multer middleware (already processed by handleCloudinaryUpload)
  const imagePath = req.file.path;
  
  product.images.push(imagePath);
  await product.save();

  res.status(200).json({
    success: true,
    message: "Image Added Successfully",
  });
});

const deleteProductImage = wrapAsync(async (req, res, next) => {
  const imageIndex = parseInt(req.query.imageIndex);

  if (imageIndex === undefined || imageIndex < 0) {
    return next(new BadRequestError("Please provide valid image index"));
  }
  
  const product = await Product.findById(req.params.id);

  if (!product) return next(new NotFoundError("Product not found"));

  if (imageIndex >= product.images.length) {
    return next(new BadRequestError("Image index out of range"));
  }

  // Get the image path to delete
  const imageToDelete = product.images[imageIndex];

  // Delete the image from storage
  await deleteImage(imageToDelete);

  // Remove from product images array
  product.images.splice(imageIndex, 1);

  await product.save();

  res.status(200).json({
    success: true,
    message: "Image Deleted Successfully",
  });
});

// to delete product
const removeproduct = wrapAsync(async (req, res, next) => {
  let product = await Product.findById(req.params._id).populate("category");
  if (!product) {
    return next(new NotFoundError("product not found"));
  }

  await cleanUpInstanceImages(product);

  await product.deleteOne();
  res.status(200).json({
    success: true,
    message: "Product Deleted Successfully",
  });
});

// to Admin Products
const getAdminProducts = wrapAsync(async (req, res, next) => {
  const products = await Product.find({})
    .populate("category")
    .populate("vendor");

  const outOfStock = products.filter((i) => i.stock === 0);

  res.status(200).json({
    success: true,
    data: products.map((product) => formatProductData(product)),
    outOfStock: outOfStock.length,
    inStock: products.length - outOfStock.length,
  });
});

// get Products by zone

const getProductsByZone = wrapAsync(async (req, res, next) => {
  const { zone } = req.query;

  const products = await Product.find({ zone })
    .populate("category")
    .populate("vendor");

  res.status(200).json({
    success: true,
    data: products.map((product) => formatProductData(product)),
  });
});

// get Farmer Products

const getFarmerProducts = wrapAsync(async (req, res, next) => {
  console.log("fetching farmers products...\n")

  const farmerId = req.rootUser._id;

  const products = await Product.find({ vendor: farmerId })
    .populate('category', 'name')
    .populate('vendor')
    .sort({ createdAt: -1 });

  // Calculate basic stats
  const stats = {
    totalProducts: products.length,
    totalValue: products.reduce((sum, product) => sum + (product.price * product.stock), 0),
    lowStockItems: products.filter(product => product.stock < 10).length,
    outOfStockItems: products.filter(product => product.stock === 0).length,
    averageRating: products.length > 0
      ? products.reduce((sum, product) => sum + product.rating, 0) / products.length
      : 0
  };

  res.status(200).json({
    success: true,
    data: {
      products: products.map((product) => formatProductData(product)),
      stats
    }
  });
});

// compare products
const compareProducts = wrapAsync(async (req, res, next) => {
  const { products } = req.query;

  const compareProducts = await Product.find({ _id: { $in: products } })
    .populate("category")
    .populate("vendor");

  res.status(200).json({
    success: true,
    data: compareProducts.map((product) => formatProductData(product)),
  });
});

module.exports = {
  createproduct,
  readallproducts,
  readsingleproduct,
  removeproduct,
  updateproduct,
  getAdminProducts,
  addProductImage,
  deleteProductImage,
  readBestSellers,
  readNewArrivals,
  searchproducts,
  getProductsByZone,
  getFarmerProducts,
  compareProducts,
};
