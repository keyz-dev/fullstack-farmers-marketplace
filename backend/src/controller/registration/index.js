const clientRegistrationController = require("./client");
const initiateRegistration = require("./initiateRegistration");

module.exports = {
  ...clientRegistrationController,
  ...initiateRegistration,
};
