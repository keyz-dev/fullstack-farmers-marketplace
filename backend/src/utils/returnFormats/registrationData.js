const { formatImageUrl } = require("../imageUtils");
const { formatUserData, formatUserDataForAuth } = require("./userData");
const { formatApplicationData } = require("./applicationData");

/**
 * Format client registration response
 * @param {Object} user - User model instance
 * @returns {Object} Formatted registration response
 */
const formatClientRegistrationResponse = (user) => {
  if (!user) return null;

  return {
    success: true,
    message: "Client registration successful",
    data: {
      user: formatUserDataForAuth(user),
      nextSteps: ["Complete your profile", "Browse products", "Start shopping"],
    },
  };
};

/**
 * Format farmer registration initiation response
 * @param {Object} user - User model instance
 * @param {Object} application - Application model instance
 * @returns {Object} Formatted registration response
 */
const formatFarmerRegistrationResponse = (user, application) => {
  if (!user || !application) return null;

  return {
    success: true,
    message: "Farmer registration initiated successfully",
    data: {
      user: formatUserDataForAuth(user),
      application: {
        id: application._id,
        type: application.applicationType,
        status: application.status,
        version: application.applicationVersion,
      },
      nextSteps: [
        "Complete your farm information",
        "Upload farm photos",
        "Provide required documents",
        "Set up payment methods",
        "Submit your application for review",
      ],
    },
  };
};

/**
 * Format delivery agent registration initiation response
 * @param {Object} user - User model instance
 * @param {Object} application - Application model instance
 * @returns {Object} Formatted registration response
 */
const formatDeliveryAgentRegistrationResponse = (user, application) => {
  if (!user || !application) return null;

  return {
    success: true,
    message: "Delivery agent registration initiated successfully",
    data: {
      user: formatUserDataForAuth(user),
      application: {
        id: application._id,
        type: application.applicationType,
        status: application.status,
        version: application.applicationVersion,
      },
      nextSteps: [
        "Complete your business information",
        "Upload vehicle photos",
        "Provide required documents",
        "Set up payment methods",
        "Submit your application for review",
      ],
    },
  };
};

/**
 * Format application requirements response
 * @param {Object} requirements - Requirements object
 * @returns {Object} Formatted requirements response
 */
const formatApplicationRequirementsResponse = (requirements) => {
  if (!requirements) return null;

  return {
    success: true,
    data: {
      applicationType: requirements.applicationType,
      requiredDocuments: requirements.requiredDocuments || [],
      requiredFields: requirements.requiredFields || {},
      optionalFields: requirements.optionalFields || {},
      estimatedProcessingTime: requirements.estimatedProcessingTime,
      nextSteps: requirements.nextSteps || [],
    },
  };
};

/**
 * Format application eligibility response
 * @param {Object} eligibility - Eligibility object
 * @returns {Object} Formatted eligibility response
 */
const formatApplicationEligibilityResponse = (eligibility) => {
  if (!eligibility) return null;

  return {
    success: true,
    data: {
      canApply: eligibility.canApply,
      reason: eligibility.reason,
      existingApplication: eligibility.existingApplication,
      userRole: eligibility.userRole,
      requirements: eligibility.requirements,
    },
  };
};

/**
 * Format login response with application context
 * @param {Object} user - User model instance
 * @param {Object} application - Application model instance (optional)
 * @param {String} token - JWT token
 * @returns {Object} Formatted login response
 */
const formatLoginResponse = (user, application, token) => {
  if (!user) return null;

  const response = {
    success: true,
    message: "Login successful",
    data: {
      user: formatUserDataForAuth(user),
      token,
    },
  };

  // Add application context if available
  if (application) {
    response.data.application = {
      id: application._id,
      type: application.applicationType,
      status: application.status,
      version: application.applicationVersion,
    };
  }

  return response;
};

/**
 * Format email verification response
 * @param {Object} user - User model instance
 * @param {String} token - JWT token
 * @returns {Object} Formatted email verification response
 */
const formatEmailVerificationResponse = (user, token) => {
  if (!user) return null;

  const response = {
    success: true,
    message: "Email verified successfully",
    data: {
      user: formatUserData(user),
      token,
    },
  };

  // Add application context if available
  if (application) {
    response.data.application = {
      id: application._id,
      type: application.applicationType,
      status: application.status,
      version: application.applicationVersion,
    };
  }

  return response;
};

/**
 * Format Google OAuth response
 * @param {Object} user - User model instance
 * @param {String} token - JWT token
 * @param {String} message - Success message
 * @returns {Object} Formatted Google OAuth response
 */
const formatGoogleOAuthResponse = (user, token, message) => {
  if (!user) return null;

  const response = {
    success: true,
    message: message || "Google authentication successful",
    data: {
      user: formatUserData(user),
      token,
    },
  };

  // Add application context if available
  if (application) {
    response.data.application = {
      id: application._id,
      type: application.applicationType,
      status: application.status,
      version: application.applicationVersion,
    };
  }

  return response;
};

module.exports = {
  formatClientRegistrationResponse,
  formatFarmerRegistrationResponse,
  formatDeliveryAgentRegistrationResponse,
  formatApplicationRequirementsResponse,
  formatApplicationEligibilityResponse,
  formatLoginResponse,
  formatEmailVerificationResponse,
  formatGoogleOAuthResponse,
};
