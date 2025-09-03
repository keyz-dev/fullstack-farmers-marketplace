const User = require("../models/user");
const { BadRequestError, NotFoundError } = require("../utils/errors");

class RegistrationService {
  /**
   * Register new client (customer)
   */
  static async registerClient(userData) {
    try {
      // Check if user already exists
      const existingUser = await User.findOne({ email: userData.email });
      if (existingUser) {
        throw new BadRequestError("User with this email already exists");
      }

      // Create new user
      const user = await User.create({
        ...userData,
        role: "client",
      });

      return user;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = RegistrationService;
