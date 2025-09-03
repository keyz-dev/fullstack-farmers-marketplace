const adminController = require("./admin");
const baseController = require("./base");
const farmerController = require("./farmer");
const deliveryAgentController = require("./deliveryAgent");

module.exports = {
  ...adminController,
  ...baseController,
  ...farmerController,
  ...deliveryAgentController,
};
