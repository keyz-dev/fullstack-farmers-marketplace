// Export all return format utilities
const userData = require("./userData");
const applicationData = require("./applicationData");
const registrationData = require("./registrationData");
const orderData = require("./orderData");
const productData = require("./productData");
const categoryData = require("./categoryData");

module.exports = {
  ...userData,
  ...applicationData,
  ...registrationData,
  ...orderData,
  ...productData,
  ...categoryData,
};
