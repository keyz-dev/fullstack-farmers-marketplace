const NotificationService = require("../services/notificationService");
const { BadRequestError, NotFoundError } = require("../utils/errors");

/**
 * Get user notifications with pagination and filtering
 * GET /api/notifications
 */
exports.getNotifications = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 20,
      isRead = null,
      type = null,
      priority = null,
      category = null,
      search = null,
    } = req.query;

    const userId = req.authUser._id;
    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      isRead: isRead !== null ? isRead === "true" : null,
      type,
      priority,
      category,
    };

    // Add search functionality if needed
    if (search) {
      options.search = search;
    }

    const result = await NotificationService.getUserNotifications(userId, options);

    res.status(200).json({
      success: true,
      data: {
        notifications: result.notifications,
        pagination: {
          currentPage: result.page,
          totalPages: result.totalPages,
          totalItems: result.total,
          itemsPerPage: parseInt(limit),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get unread notification count
 * GET /api/notifications/unread-count
 */
exports.getUnreadCount = async (req, res, next) => {
  try {
    const userId = req.authUser._id;
    const unreadCount = await NotificationService.getUnreadCount(userId);

    res.status(200).json({
      success: true,
      data: { unreadCount },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Mark notification as read
 * PUT /api/notifications/:id/read
 */
exports.markAsRead = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.authUser._id;

    const notification = await NotificationService.markAsRead(id, userId);

    res.status(200).json({
      success: true,
      data: { notification },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Mark all notifications as read
 * PUT /api/notifications/mark-all-read
 */
exports.markAllAsRead = async (req, res, next) => {
  try {
    const userId = req.authUser._id;

    await NotificationService.markAllAsRead(userId);

    res.status(200).json({
      success: true,
      message: "All notifications marked as read",
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete a notification
 * DELETE /api/notifications/:id
 */
exports.deleteNotification = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.authUser._id;

    const Notification = require("../models/notification");
    const notification = await Notification.findOne({
      _id: id,
      user: userId,
    });

    if (!notification) {
      return next(new NotFoundError("Notification not found"));
    }

    await notification.deleteOne();

    res.status(200).json({
      success: true,
      message: "Notification deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Clear all notifications for user
 * DELETE /api/notifications/clear-all
 */
exports.clearAllNotifications = async (req, res, next) => {
  try {
    const userId = req.authUser._id;

    const Notification = require("../models/notification");
    await Notification.deleteMany({ user: userId });

    res.status(200).json({
      success: true,
      message: "All notifications cleared",
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get notification statistics
 * GET /api/notifications/stats
 */
exports.getNotificationStats = async (req, res, next) => {
  try {
    const userId = req.authUser._id;

    const Notification = require("../models/notification");
    
    const [total, unread, urgent, high] = await Promise.all([
      Notification.countDocuments({ user: userId }),
      Notification.countDocuments({ user: userId, isRead: false }),
      Notification.countDocuments({
        user: userId,
        priority: "urgent",
        isRead: false,
      }),
      Notification.countDocuments({
        user: userId,
        priority: "high",
        isRead: false,
      }),
    ]);

    res.status(200).json({
      success: true,
      data: {
        total,
        unread,
        urgent,
        high,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get notifications by category
 * GET /api/notifications/category/:category
 */
exports.getNotificationsByCategory = async (req, res, next) => {
  try {
    const { category } = req.params;
    const { page = 1, limit = 20 } = req.query;
    const userId = req.authUser._id;

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      category,
    };

    const result = await NotificationService.getUserNotifications(userId, options);

    res.status(200).json({
      success: true,
      data: {
        notifications: result.notifications,
        pagination: {
          currentPage: result.page,
          totalPages: result.totalPages,
          totalItems: result.total,
          itemsPerPage: parseInt(limit),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get system notifications for user role
 * GET /api/notifications/system
 */
exports.getSystemNotifications = async (req, res, next) => {
  try {
    const userRole = req.authUser.role;

    const systemNotifications = await NotificationService.getActiveSystemNotifications(userRole);

    res.status(200).json({
      success: true,
      data: { notifications: systemNotifications },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create a notification (admin only)
 * POST /api/notifications
 */
exports.createNotification = async (req, res, next) => {
  try {
    const { createNotificationSchema } = require("../validation/notificationValidation");
    const { error } = createNotificationSchema.validate(req.body);
    if (error) return next(new BadRequestError(error.details[0].message));

    const {
      user,
      type,
      title,
      message,
      priority = "medium",
      category,
      relatedId,
      relatedModel,
      expiresAt,
    } = req.body;

    const notificationData = {
      user,
      type,
      title,
      message,
      priority,
      category,
      relatedId,
      relatedModel,
      expiresAt,
    };

    const notification = await NotificationService.createNotification(notificationData);

    res.status(201).json({
      success: true,
      data: { notification },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create bulk notifications (admin only)
 * POST /api/notifications/bulk
 */
exports.createBulkNotifications = async (req, res, next) => {
  try {
    const { bulkNotificationSchema } = require("../validation/notificationValidation");
    const { error } = bulkNotificationSchema.validate(req.body);
    if (error) return next(new BadRequestError(error.details[0].message));

    const { notifications } = req.body;

    const createdNotifications = await NotificationService.createBulkNotifications(notifications);

    res.status(201).json({
      success: true,
      data: { 
        notifications: createdNotifications,
        count: createdNotifications.length 
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Clean up old notifications (admin only)
 * DELETE /api/notifications/cleanup
 */
exports.cleanupOldNotifications = async (req, res, next) => {
  try {
    const { daysOld = 90 } = req.query;

    const result = await NotificationService.cleanupOldNotifications(parseInt(daysOld));

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};