// utils/formatUserData.js

const { formatImageUrl } = require("../imageUtils.js");

/**
 * Formats a Mongoose user document into a clean, role-specific object for API responses.
 *
 * @param {object} user - The Mongoose user document.
 * @returns {object} A clean object with fields appropriate for the user's role.
 */
const formatUserData = (user) => {
  try {
    // 1. Define the base information shared by ALL users.
    const baseData = {
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      gender: user.gender,
      address: user.address,
      dob: user.dob,
      role: user.role,
      avatar: formatImageUrl(user.avatar),
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      emailVerified: user.emailVerified || false,
      isActive: user.isActive !== undefined ? user.isActive : true,
      isVerified: user.isVerified !== undefined ? user.isVerified : false,
      authProvider: user.authProvider || "local",
    };

    // 2. Use a switch statement to add role-specific fields.
    switch (user.role) {
      case "farmer":
        return {
          ...baseData,
          farmName: user.farmName,
          farmType: user.farmType,
          shopDescription: user.shopDescription,
          shopAddress: user.shopAddress,
          produceTypes: user.produceTypes,
          deliveryRadiusKm: user.deliveryRadiusKm,
          payment: user.payment,
        };

      case "delivery_agent":
        return {
          ...baseData,
          vehicleType: user.vehicleType,
          maxDeliveryDistanceKm: user.maxDeliveryDistanceKm,
          deliveryZone: user.deliveryZone,
          currentLocation: user.currentLocation,
          isAvailable: user.isAvailable,
        };

      case "admin":
        // Admins get all base data plus some extra privileges
        return {
          ...baseData,
          // You could add admin-specific fields here if any
        };

      case "client":
      case "incomplete_farmer":
      case "incomplete_delivery_agent":
      case "pending_farmer":
      case "pending_delivery_agent":
      default:
        // These roles just get the base data.
        return baseData;
    }
  } catch (error) {
    console.error("Error formatting user data:", error);
    return {
      _id: user._id,
      name: user.name || "Unknown User",
      email: user.email || "",
      role: user.role || "client",
      isActive: user.isActive !== undefined ? user.isActive : true,
      isVerified: user.isVerified !== undefined ? user.isVerified : false,
    };
  }
};

/**
 * Formats user data for authentication responses (login, token verification)
 * @param {object} user - The Mongoose user document.
 * @returns {object} Formatted user data for auth responses.
 */
const formatUserDataForAuth = (user) => {
  try {
    return {
      id: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
      avatar: formatImageUrl(user.avatar),
      emailVerified: user.emailVerified || false,
      isActive: user.isActive !== undefined ? user.isActive : true,
    };
  } catch (error) {
    console.error("Error formatting user data for auth:", error);
    return {
      id: user._id,
      email: user.email || "",
      name: user.name || "Unknown User",
      role: user.role || "client",
    };
  }
};

/**
 * Formats user data for public profiles (minimal information)
 * @param {object} user - The Mongoose user document.
 * @returns {object} Formatted user data for public viewing.
 */
const formatUserDataForPublic = (user) => {
  try {
    const baseData = {
      id: user._id,
      name: user.name,
      avatar: formatImageUrl(user.avatar),
      role: user.role,
    };

    // Add role-specific public information
    switch (user.role) {
      case "farmer":
        return {
          ...baseData,
          farmName: user.farmName,
          farmType: user.farmType,
          shopDescription: user.shopDescription,
        };

      case "delivery_agent":
        return {
          ...baseData,
          businessName: user.businessName,
          vehicleType: user.vehicleType,
        };

      default:
        return baseData;
    }
  } catch (error) {
    console.error("Error formatting user data for public:", error);
    return {
      id: user._id,
      name: user.name || "Unknown User",
      role: user.role || "client",
    };
  }
};

module.exports = {
  formatUserData,
  formatUserDataForAuth,
  formatUserDataForPublic,
};
