const Notification = require("../models/notification");

// Helper function to get notification category based on type
const getNotificationCategory = (type) => {
  const categoryMap = {
    // Client notifications
    order_confirmation: "orders",
    order_shipped: "orders",
    order_delivered: "orders",
    order_cancelled: "orders",
    booking_confirmed: "bookings",
    booking_reminder: "bookings",
    booking_cancelled: "bookings",
    payment_successful: "payments",
    payment_failed: "payments",
    account_verification: "account",
    password_reset: "account",

    // Vendor notifications
    new_order_received: "orders",
    order_status_update: "orders",
    new_booking_request: "bookings",
    booking_confirmed_by_client: "bookings",
    booking_cancelled_by_client: "bookings",
    payment_received: "payments",
    product_approved: "vendor_applications",
    product_rejected: "vendor_applications",
    service_approved: "vendor_applications",
    service_rejected: "vendor_applications",
    vendor_application_approved: "vendor_applications",
    vendor_application_rejected: "vendor_applications",
    vendor_account_suspended: "account",
    vendor_account_reactivated: "account",

    // Admin notifications
    vendor_application_submitted: "vendor_applications",
    vendor_application_reviewed: "vendor_applications",
    vendor_application_approved: "vendor_applications",
    vendor_application_rejected: "vendor_applications",
    new_user_registered: "system",
    order_dispute_reported: "orders",
    booking_dispute_reported: "bookings",
    system_alert: "system",
    platform_maintenance: "system",
    security_alert: "system",
    user_reported: "system",
    vendor_reported: "system",

    // General notifications
    system: "system",
    promotion: "promotions",
    announcement: "promotions",
  };

  return categoryMap[type] || "system";
};

// Helper function to get target role based on notification type
const getTargetRole = (type) => {
  const roleMap = {
    // Client-specific
    order_confirmation: "client",
    order_shipped: "client",
    order_delivered: "client",
    order_cancelled: "client",
    booking_confirmed: "client",
    booking_reminder: "client",
    booking_cancelled: "client",
    payment_successful: "client",
    payment_failed: "client",
    account_verification: "client",
    password_reset: "client",

    // Vendor-specific
    new_order_received: "vendor",
    order_status_update: "vendor",
    new_booking_request: "vendor",
    booking_confirmed_by_client: "vendor",
    booking_cancelled_by_client: "vendor",
    payment_received: "vendor",
    product_approved: "vendor",
    product_rejected: "vendor",
    service_approved: "vendor",
    service_rejected: "vendor",
    vendor_application_approved: "vendor",
    vendor_application_rejected: "vendor",
    vendor_account_suspended: "vendor",
    vendor_account_reactivated: "vendor",

    // Admin-specific
    vendor_application_submitted: "admin",
    vendor_application_reviewed: "admin",
    vendor_application_approved: "admin",
    vendor_application_rejected: "admin",
    new_user_registered: "admin",
    order_dispute_reported: "admin",
    booking_dispute_reported: "admin",
    system_alert: "admin",
    platform_maintenance: "admin",
    security_alert: "admin",
    user_reported: "admin",
    vendor_reported: "admin",

    // General (all roles)
    system: "all",
    promotion: "all",
    announcement: "all",
  };

  return roleMap[type] || "all";
};

// Create a notification with proper role-based categorization
const createRoleBasedNotification = async (notificationData) => {
  const {
    user,
    type,
    title,
    message,
    relatedId,
    relatedModel,
    priority = "medium",
  } = notificationData;

  const category = getNotificationCategory(type);
  const targetRole = getTargetRole(type);

  const notification = await Notification.create({
    user,
    type,
    title,
    message,
    relatedId,
    relatedModel,
    priority,
    category,
    targetRole,
  });

  return notification;
};

// Create notifications for multiple users based on role
const createNotificationsForRole = async (notificationData, userRole) => {
  const {
    type,
    title,
    message,
    relatedId,
    relatedModel,
    priority = "medium",
  } = notificationData;

  const category = getNotificationCategory(type);
  const targetRole = getTargetRole(type);

  // Only create if the target role matches or is "all"
  if (targetRole !== "all" && targetRole !== userRole) {
    return null;
  }

  const notification = await Notification.create({
    user: notificationData.user,
    type,
    title,
    message,
    relatedId,
    relatedModel,
    priority,
    category,
    targetRole,
  });

  return notification;
};

// Create system-wide notifications (for all users)
const createSystemNotification = async (notificationData) => {
  const {
    type,
    title,
    message,
    priority = "medium",
    userIds = [], // Array of user IDs to notify
  } = notificationData;

  const category = getNotificationCategory(type);
  const targetRole = getTargetRole(type);

  const notifications = [];

  for (const userId of userIds) {
    const notification = await Notification.create({
      user: userId,
      type,
      title,
      message,
      priority,
      category,
      targetRole,
    });
    notifications.push(notification);
  }

  return notifications;
};

module.exports = {
  createRoleBasedNotification,
  createNotificationsForRole,
  createSystemNotification,
  getNotificationCategory,
  getTargetRole,
};
