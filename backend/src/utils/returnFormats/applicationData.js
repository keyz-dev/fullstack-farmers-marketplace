const { formatImageUrl } = require("../imageUtils");

/**
 * Format application document data for API responses
 * @param {Object} document - Document object from application
 * @returns {Object} Formatted document data
 */
const formatApplicationDocument = (document) => {
  if (!document) return null;

  return {
    id: document._id || document.id,
    documentType: document.documentType,
    originalName: document.originalName,
    documentName: document.documentName,
    fileName: document.originalName || document.documentName, // Frontend expects fileName
    fileType: document.fileType,
    mimeType: document.fileType, // Frontend expects mimeType
    size: document.size,
    fileSize: document.size, // Frontend expects fileSize
    url: formatImageUrl(document.url), // Format file URL for serving
    fileUrl: formatImageUrl(document.url), // Frontend expects fileUrl
    adminRemarks: document.adminRemarks,
    isApproved: document.isApproved,
    verifiedAt: document.verifiedAt,
    verifiedBy: document.verifiedBy,
    verificationNotes: document.verificationNotes,
    uploadedAt: document.uploadedAt,
  };
};

/**
 * Format application user data for API responses
 * @param {Object} user - User model instance
 * @returns {Object} Formatted user data
 */
const formatApplicationUser = (user) => {
  if (!user) return null;

  return {
    id: user._id || user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    avatar: formatImageUrl(user.avatar), // Format avatar URL
    role: user.role,
  };
};

/**
 * Format admin review data for application responses
 * @param {Object} adminReview - Admin review object
 * @returns {Object} Formatted admin review data
 */
const formatAdminReview = (adminReview) => {
  if (!adminReview) return null;

  return {
    reviewedBy: adminReview.reviewedBy,
    reviewedAt: adminReview.reviewedAt,
    remarks: adminReview.remarks,
    rejectionReason: adminReview.rejectionReason,
    suspensionReason: adminReview.suspensionReason,
    approvedDocuments: adminReview.approvedDocuments || [],
    rejectedDocuments: adminReview.rejectedDocuments || [],
    reviewNotes: adminReview.reviewNotes,
  };
};

/**
 * Format farmer-specific application data
 * @param {Object} application - Application object
 * @returns {Object} Formatted farmer application data
 */
const formatFarmerApplicationData = (application) => {
  if (!application) return null;

  return {
    id: application._id,
    userId: application.userId,
    applicationType: application.applicationType,
    status: application.status,
    applicationVersion: application.applicationVersion,

    // Farmer-specific fields
    farmName: application.farmName,
    farmType: application.farmType,
    farmDescription: application.farmDescription,
    farmSize: application.farmSize,
    farmingExperience: application.farmingExperience,
    farmAddress: application.farmAddress,
    farmPhotos:
      application.farmPhotos?.map((photo) => formatImageUrl(photo)) || [],

    // Common fields
    contactInfo: application.contactInfo || [],
    paymentMethods: application.paymentMethods || [],
    shipping: application.shipping,
    documents:
      application.documents?.map((doc) => formatApplicationDocument(doc)) || [],
    profilePhoto: formatImageUrl(application.profilePhoto),

    // Admin review
    adminReview: formatAdminReview(application.adminReview),

    // Timestamps
    submittedAt: application.submittedAt,
    reviewedAt: application.reviewedAt,
    approvedAt: application.approvedAt,
    rejectedAt: application.rejectedAt,
    suspendedAt: application.suspendedAt,
    createdAt: application.createdAt,
    updatedAt: application.updatedAt,

    // Performance metrics
    rating: application.rating,
    totalReviews: application.totalReviews,
    totalSales: application.totalSales,
    totalOrders: application.totalOrders,

    // Metadata
    agreedToTerms: application.agreedToTerms,
    marketingConsent: application.marketingConsent,
    isActive: application.isActive,
  };
};

/**
 * Format delivery agent-specific application data
 * @param {Object} application - Application object
 * @returns {Object} Formatted delivery agent application data
 */
const formatDeliveryAgentApplicationData = (application) => {
  if (!application) return null;

  return {
    id: application._id,
    userId: application.userId,
    applicationType: application.applicationType,
    status: application.status,
    applicationVersion: application.applicationVersion,

    // Delivery agent-specific fields
    businessName: application.businessName,
    vehicleType: application.vehicleType,
    serviceAreas: application.serviceAreas || [],
    operatingHours: application.operatingHours || [],
    deliveryPreferences: application.deliveryPreferences,
    businessAddress: application.businessAddress,
    vehiclePhotos:
      application.vehiclePhotos?.map((photo) => formatImageUrl(photo)) || [],

    // Common fields
    contactInfo: application.contactInfo || [],
    paymentMethods: application.paymentMethods || [],
    documents:
      application.documents?.map((doc) => formatApplicationDocument(doc)) || [],
    profilePhoto: formatImageUrl(application.profilePhoto),

    // Admin review
    adminReview: formatAdminReview(application.adminReview),

    // Timestamps
    submittedAt: application.submittedAt,
    reviewedAt: application.reviewedAt,
    approvedAt: application.approvedAt,
    rejectedAt: application.rejectedAt,
    suspendedAt: application.suspendedAt,
    createdAt: application.createdAt,
    updatedAt: application.updatedAt,

    // Performance metrics
    rating: application.rating,
    totalReviews: application.totalReviews,
    totalDeliveries: application.totalDeliveries,
    totalEarnings: application.totalEarnings,
    isAvailable: application.isAvailable,
    currentLocation: application.currentLocation,

    // Metadata
    agreedToTerms: application.agreedToTerms,
    isActive: application.isActive,
  };
};

/**
 * Format unified application data for API responses
 * @param {Object} application - Application model instance
 * @returns {Object} Formatted application data
 */
const formatApplicationData = (application) => {
  if (!application) return null;

  // Use type-specific formatting
  if (application.applicationType === "farmer") {
    return formatFarmerApplicationData(application);
  } else if (application.applicationType === "delivery_agent") {
    return formatDeliveryAgentApplicationData(application);
  }

  // Fallback for unknown types
  return {
    id: application._id,
    userId: application.userId,
    applicationType: application.applicationType,
    status: application.status,
    applicationVersion: application.applicationVersion,
    submittedAt: application.submittedAt,
    createdAt: application.createdAt,
    updatedAt: application.updatedAt,
  };
};

/**
 * Format array of applications for API responses
 * @param {Array} applications - Array of Application model instances
 * @returns {Array} Formatted applications array
 */
const formatApplicationsData = (applications) => {
  if (!applications || !Array.isArray(applications)) return [];

  return applications.map((application) => formatApplicationData(application));
};

/**
 * Format application statistics to match consultation_reference format
 * @param {Object} stats - Statistics object
 * @returns {Object} Formatted statistics
 */
const formatApplicationStats = (stats) => {
  if (!stats || !Array.isArray(stats)) {
    return {
      total: 0,
      pending: 0,
      approved: 0,
      rejected: 0
    };
  }

  const formattedStats = {
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0
  };

  stats.forEach((stat) => {
    const { status, count } = stat._id;
    const countValue = stat.count || 0;

    formattedStats.total += countValue;

    // Map our statuses to consultation_reference format
    if (status === 'pending' || status === 'under_review') {
      formattedStats.pending += countValue;
    } else if (status === 'approved') {
      formattedStats.approved += countValue;
    } else if (status === 'rejected') {
      formattedStats.rejected += countValue;
    }
  });

  return formattedStats;
};

/**
 * Format application requirements
 * @param {Object} requirements - Requirements object
 * @returns {Object} Formatted requirements
 */
const formatApplicationRequirements = (requirements) => {
  if (!requirements) return null;

  return {
    applicationType: requirements.applicationType,
    requiredDocuments: requirements.requiredDocuments || [],
    requiredFields: requirements.requiredFields || {},
    optionalFields: requirements.optionalFields || {},
    estimatedProcessingTime: requirements.estimatedProcessingTime,
    nextSteps: requirements.nextSteps || [],
  };
};

/**
 * Format application eligibility
 * @param {Object} eligibility - Eligibility object
 * @returns {Object} Formatted eligibility
 */
const formatApplicationEligibility = (eligibility) => {
  if (!eligibility) return null;

  return {
    canApply: eligibility.canApply,
    reason: eligibility.reason,
    existingApplication: eligibility.existingApplication,
    userRole: eligibility.userRole,
    requirements: formatApplicationRequirements(eligibility.requirements),
  };
};

module.exports = {
  formatApplicationData,
  formatApplicationsData,
  formatApplicationStats,
  formatApplicationDocument,
  formatApplicationUser,
  formatAdminReview,
  formatFarmerApplicationData,
  formatDeliveryAgentApplicationData,
  formatApplicationRequirements,
  formatApplicationEligibility,
};
