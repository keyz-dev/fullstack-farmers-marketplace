const Category = require("../models/category");
const Product = require("../models/product");
const { BadRequestError, NotFoundError } = require("../utils/errors");
const wrapAsync = require("../error_handler/AsyncError");
const formatCategoryData = require("../utils/returnFormats/categoryData");
// to Create category

const addCategory = wrapAsync(async (req, res, next) => {
  const { name, description } = req.body;
  if (!name || !description) {
    return next(new BadRequestError("some of the input fields is missing", 404));
  }
  let image;
  if (!req.file) {
    return next(new NotFoundError("category image not found", 404));
  }

  image = req.file.path;

  const category = await Category.create({
    name,
    description,
    image,
  });

  res.status(200).json({
    success: true,
    message: "Category Created Successfully",
    data: formatCategoryData(category),
  });
});

// to read  the category
const readsinglecategory = wrapAsync(async (req, res, next) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    return next(new NotFoundError("category not found", 404));
  }
  res.status(200).json({ success: true, category: formatCategoryData(category) });
});

// to update the category
const updateCategory = wrapAsync(async (req, res, next) => {
  let category = await Category.findById(req.params.id);

  if (!category) {
    return next(new NotFoundError("category not found", 404));
  }

  const { name, description } = req.body;

  if (name) category.name = name;
  if (description) category.description = description;

  if (!req.file) {
    return next(new NotFoundError("category image not found", 404));
  }

  image = req.file.path;

  await category.save();

  res.status(200).json({
    success: true,
    message: "Category Updated Successfully",
    data: formatCategoryData(category),
  });
});

// get all category
const getAllCategories = wrapAsync(async (req, res, next) => {
  const categories = await Category.find({});

  res.status(200).json({
    success: true,
    data: categories.map((category) => formatCategoryData(category)),
  });
});

const deleteCategory = wrapAsync(async (req, res, next) => {
  const category = await Category.findById(req.params.id);
  if (!category) return next(new NotFoundError("Category Not Found", 404));
  const products = await Product.find({ category: category.id });

  for (let i = 0; i < products.length; i++) {
    const product = products[i];
    product.category = undefined;
    await product.save();
  }

  await category.deleteOne();

  res.status(200).json({
    success: true,
    message: "Category Deleted Successfully",
  });
});

module.exports = {
  addCategory,
  readsinglecategory,
  updateCategory,
  getAllCategories,
  deleteCategory,
};