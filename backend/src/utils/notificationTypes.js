/**
 * Notification Types Constants for Biggy Platform
 * 
 * This file defines all notification types used in our agricultural platform.
 * Adapted from consultation reference but tailored for our farmer/client/delivery system.
 */

// Order-related notifications
const ORDER_TYPES = {
  ORDER_PLACED: "order_placed",
  ORDER_CONFIRMED: "order_confirmed", 
  ORDER_PROCESSING: "order_processing",
  ORDER_SHIPPED: "order_shipped",
  ORDER_DELIVERED: "order_delivered",
  ORDER_CANCELLED: "order_cancelled",
  ORDER_DISPUTED: "order_disputed",
  ORDER_REFUNDED: "order_refunded",
};

// Payment notifications
const PAYMENT_TYPES = {
  PAYMENT_SUCCESSFUL: "payment_successful",
  PAYMENT_FAILED: "payment_failed", 
  PAYMENT_PENDING: "payment_pending",
  PAYMENT_REFUNDED: "payment_refunded",
  PAYMENT_DISPUTED: "payment_disputed",
  PAYMENT_RECEIVED: "payment_received",
};

// Application notifications (farmer/delivery agent applications)
const APPLICATION_TYPES = {
  APPLICATION_SUBMITTED: "application_submitted",
  APPLICATION_APPROVED: "application_approved",
  APPLICATION_REJECTED: "application_rejected", 
  APPLICATION_UNDER_REVIEW: "application_under_review",
  APPLICATION_DOCUMENTS_REQUIRED: "application_documents_required",
  APPLICATION_RESUBMITTED: "application_resubmitted",
  APPLICATION_CANCELLED: "application_cancelled",
};

// Farmer-specific notifications
const FARMER_TYPES = {
  NEW_ORDER_RECEIVED: "new_order_received",
  ORDER_STATUS_UPDATE: "order_status_update",
  PRODUCT_APPROVED: "product_approved",
  PRODUCT_REJECTED: "product_rejected",
  FARMER_ACCOUNT_SUSPENDED: "farmer_account_suspended",
  FARMER_ACCOUNT_REACTIVATED: "farmer_account_reactivated",
  HARVEST_REMINDER: "harvest_reminder",
  SEASONAL_PROMOTION: "seasonal_promotion",
};

// Delivery agent notifications
const DELIVERY_TYPES = {
  DELIVERY_ASSIGNED: "delivery_assigned",
  DELIVERY_COMPLETED: "delivery_completed",
  DELIVERY_FAILED: "delivery_failed",
  DELIVERY_RESCHEDULED: "delivery_rescheduled",
  DELIVERY_AGENT_ACCOUNT_SUSPENDED: "delivery_agent_account_suspended",
  DELIVERY_AGENT_ACCOUNT_REACTIVATED: "delivery_agent_account_reactivated",
};

// Client notifications
const CLIENT_TYPES = {
  ACCOUNT_VERIFICATION: "account_verification",
  PASSWORD_RESET: "password_reset",
  PROFILE_UPDATED: "profile_updated",
  WISHLIST_ITEM_AVAILABLE: "wishlist_item_available",
  PRICE_DROP_ALERT: "price_drop_alert",
  SEASONAL_OFFER: "seasonal_offer",
};

// Admin notifications
const ADMIN_TYPES = {
  FARMER_APPLICATION_SUBMITTED: "farmer_application_submitted",
  DELIVERY_APPLICATION_SUBMITTED: "delivery_application_submitted",
  NEW_USER_REGISTERED: "new_user_registered",
  ORDER_DISPUTE_REPORTED: "order_dispute_reported",
  SYSTEM_ALERT: "system_alert",
  PLATFORM_MAINTENANCE: "platform_maintenance",
  SECURITY_ALERT: "security_alert",
  USER_REPORTED: "user_reported",
  FARMER_REPORTED: "farmer_reported",
  DELIVERY_AGENT_REPORTED: "delivery_agent_reported",
};

// System notifications
const SYSTEM_TYPES = {
  SYSTEM_ANNOUNCEMENT: "system_announcement",
  SYSTEM_MAINTENANCE: "system_maintenance",
  SYSTEM_UPDATE: "system_update",
  SECURITY_ALERT: "security_alert",
  FEATURE_ANNOUNCEMENT: "feature_announcement",
  GENERAL: "general",
};

// Promotion and marketing notifications
const PROMOTION_TYPES = {
  SEASONAL_PROMOTION: "seasonal_promotion",
  FARMER_PROMOTION: "farmer_promotion",
  CLIENT_PROMOTION: "client_promotion",
  DELIVERY_PROMOTION: "delivery_promotion",
  NEWSLETTER: "newsletter",
  SPECIAL_OFFER: "special_offer",
};

// Combine all types
const NOTIFICATION_TYPES = {
  ...ORDER_TYPES,
  ...PAYMENT_TYPES,
  ...APPLICATION_TYPES,
  ...FARMER_TYPES,
  ...DELIVERY_TYPES,
  ...CLIENT_TYPES,
  ...ADMIN_TYPES,
  ...SYSTEM_TYPES,
  ...PROMOTION_TYPES,
};

// Priority levels
const PRIORITY_LEVELS = {
  LOW: "low",
  MEDIUM: "medium", 
  HIGH: "high",
  URGENT: "urgent",
};

// Helper function to validate notification type
const isValidNotificationType = (type) => {
  return Object.values(NOTIFICATION_TYPES).includes(type);
};

// Helper function to get notification category
const getNotificationCategory = (type) => {
  if (Object.values(ORDER_TYPES).includes(type)) return "orders";
  if (Object.values(PAYMENT_TYPES).includes(type)) return "payments";
  if (Object.values(APPLICATION_TYPES).includes(type)) return "applications";
  if (Object.values(FARMER_TYPES).includes(type)) return "applications"; // Farmer notifications are application-related
  if (Object.values(DELIVERY_TYPES).includes(type)) return "applications"; // Delivery notifications are application-related
  if (Object.values(CLIENT_TYPES).includes(type)) return "account";
  if (Object.values(ADMIN_TYPES).includes(type)) return "system";
  if (Object.values(SYSTEM_TYPES).includes(type)) return "system";
  if (Object.values(PROMOTION_TYPES).includes(type)) return "promotions";
  return "system";
};

// Helper function to get default priority for notification type
const getDefaultPriority = (type) => {
  const urgentTypes = [
    NOTIFICATION_TYPES.SECURITY_ALERT,
    NOTIFICATION_TYPES.PAYMENT_FAILED,
    NOTIFICATION_TYPES.ORDER_DISPUTED,
    NOTIFICATION_TYPES.DELIVERY_FAILED,
  ];

  const highPriorityTypes = [
    NOTIFICATION_TYPES.ORDER_PLACED,
    NOTIFICATION_TYPES.APPLICATION_APPROVED,
    NOTIFICATION_TYPES.APPLICATION_REJECTED,
    NOTIFICATION_TYPES.NEW_ORDER_RECEIVED,
    NOTIFICATION_TYPES.DELIVERY_ASSIGNED,
    NOTIFICATION_TYPES.ACCOUNT_VERIFICATION,
  ];

  if (urgentTypes.includes(type)) return PRIORITY_LEVELS.URGENT;
  if (highPriorityTypes.includes(type)) return PRIORITY_LEVELS.HIGH;
  return PRIORITY_LEVELS.MEDIUM;
};

// Helper function to get target role for notification type
const getTargetRole = (type) => {
  const clientTypes = [
    ...Object.values(ORDER_TYPES),
    ...Object.values(PAYMENT_TYPES),
    ...Object.values(CLIENT_TYPES),
    ...Object.values(PROMOTION_TYPES),
  ];

  const farmerTypes = [
    ...Object.values(FARMER_TYPES),
    ...Object.values(APPLICATION_TYPES),
  ];

  const deliveryTypes = [
    ...Object.values(DELIVERY_TYPES),
    ...Object.values(APPLICATION_TYPES),
  ];

  const adminTypes = [
    ...Object.values(ADMIN_TYPES),
  ];

  if (clientTypes.includes(type)) return "client";
  if (farmerTypes.includes(type)) return "farmer";
  if (deliveryTypes.includes(type)) return "delivery_agent";
  if (adminTypes.includes(type)) return "admin";
  return "all"; // System notifications for all roles
};

module.exports = {
  NOTIFICATION_TYPES,
  PRIORITY_LEVELS,
  ORDER_TYPES,
  PAYMENT_TYPES,
  APPLICATION_TYPES,
  FARMER_TYPES,
  DELIVERY_TYPES,
  CLIENT_TYPES,
  ADMIN_TYPES,
  SYSTEM_TYPES,
  PROMOTION_TYPES,
  isValidNotificationType,
  getNotificationCategory,
  getDefaultPriority,
  getTargetRole,
};
