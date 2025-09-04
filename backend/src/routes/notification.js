const express = require("express");
const {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  clearAllNotifications,
  getNotificationStats,
  getNotificationsByCategory,
  getSystemNotifications,
  createNotification,
  createBulkNotifications,
  cleanupOldNotifications,
} = require("../controller/notification");
const { authenticateUser, authorizeRoles } = require("../middleware/auth");
const {
  createNotificationSchema,
  bulkNotificationSchema,
  markAsReadSchema,
  getNotificationsSchema,
  getNotificationsByCategorySchema,
  cleanupNotificationsSchema,
} = require("../validation/notificationValidation");

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticateUser);

// ==================== USER ROUTES ====================

/**
 * GET /api/notifications
 * Get user notifications with pagination and filtering
 */
router.get("/", getNotifications);

/**
 * GET /api/notifications/unread-count
 * Get unread notification count
 */
router.get("/unread-count", getUnreadCount);

/**
 * GET /api/notifications/stats
 * Get notification statistics
 */
router.get("/stats", getNotificationStats);

/**
 * GET /api/notifications/system
 * Get system notifications for user role
 */
router.get("/system", getSystemNotifications);

/**
 * GET /api/notifications/category/:category
 * Get notifications by category
 */
router.get("/category/:category", getNotificationsByCategory);

/**
 * PUT /api/notifications/:id/read
 * Mark a notification as read
 */
router.put("/:id/read", markAsRead);

/**
 * PUT /api/notifications/mark-all-read
 * Mark all notifications as read
 */
router.put("/mark-all-read", markAllAsRead);

/**
 * DELETE /api/notifications/:id
 * Delete a notification
 */
router.delete("/:id", deleteNotification);

/**
 * DELETE /api/notifications/clear-all
 * Clear all notifications for user
 */
router.delete("/clear-all", clearAllNotifications);

// ==================== ADMIN ROUTES ====================

/**
 * POST /api/notifications
 * Create a notification (admin only)
 */
router.post(
  "/",
  authorizeRoles(["admin"]),
  createNotification
);

/**
 * POST /api/notifications/bulk
 * Create bulk notifications (admin only)
 */
router.post(
  "/bulk",
  authorizeRoles(["admin"]),
  createBulkNotifications
);

/**
 * DELETE /api/notifications/cleanup
 * Clean up old notifications (admin only)
 */
router.delete(
  "/cleanup",
  authorizeRoles(["admin"]),
  cleanupOldNotifications
);

module.exports = router;
