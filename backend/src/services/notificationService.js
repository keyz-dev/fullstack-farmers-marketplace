const Notification = require("../models/notification");
const User = require("../models/user");

class NotificationService {
  /**
   * Create a user-specific notification
   */
  static async createNotification(data) {
    try {
      const notification = await Notification.create(data);

      // Emit real-time notification if socket is available
      if (global.io) {
        global.io.to(`user-${data.user}`).emit("notification:new", {
          notification: {
            _id: notification._id,
            type: notification.type,
            title: notification.title,
            message: notification.message,
            priority: notification.priority,
            isRead: notification.isRead,
            createdAt: notification.createdAt,
            relatedId: notification.relatedId,
            relatedModel: notification.relatedModel,
          },
        });
      }

      return notification;
    } catch (error) {
      console.error("Error creating notification:", error);
      throw error;
    }
  }

  /**
   * Create multiple notifications for multiple users
   */
  static async createBulkNotifications(notifications) {
    try {
      const createdNotifications = await Notification.insertMany(notifications);
      return createdNotifications;
    } catch (error) {
      console.error("Error creating bulk notifications:", error);
      throw error;
    }
  }

  /**
   * Create a system notification (broadcast)
   */
  static async createSystemNotification(data) {
    try {
      const systemNotification = await Notification.create({
        ...data,
        category: "system",
        targetRole: "all",
      });
      return systemNotification;
    } catch (error) {
      console.error("Error creating system notification:", error);
      throw error;
    }
  }

  /**
   * Create an activity log entry
   */
  static async createActivityLog(data) {
    try {
      // This would be implemented with an ActivityLog model
      console.log("Activity log:", data);
      return { success: true };
    } catch (error) {
      console.error("Error creating activity log:", error);
      throw error;
    }
  }

  /**
   * Get user notifications with pagination
   */
  static async getUserNotifications(userId, options = {}) {
    const {
      page = 1,
      limit = 20,
      isRead = null,
      category = null,
      type = null,
    } = options;

    const where = { user: userId };

    if (isRead !== null) where.isRead = isRead;
    if (category) where.category = category;
    if (type) where.type = type;

    try {
      const notifications = await Notification.find(where)
        .sort({ createdAt: -1 })
        .limit(parseInt(limit))
        .skip((page - 1) * limit);

      const total = await Notification.countDocuments(where);

      return {
        notifications,
        total,
        page: parseInt(page),
        totalPages: Math.ceil(total / limit),
      };
    } catch (error) {
      console.error("Error fetching user notifications:", error);
      throw error;
    }
  }

  /**
   * Get recent activity logs
   */
  static async getRecentActivity(options = {}) {
    const {
      page = 1,
      limit = 50,
      activityType = null,
      userId = null,
    } = options;

    try {
      // This would be implemented with an ActivityLog model
      return {
        activityLogs: [],
        total: 0,
        page: parseInt(page),
        totalPages: 0,
      };
    } catch (error) {
      console.error("Error fetching recent activity:", error);
      throw error;
    }
  }

  /**
   * Mark notification as read
   */
  static async markAsRead(notificationId, userId) {
    try {
      const notification = await Notification.findOne({
        _id: notificationId,
        user: userId,
      });

      if (!notification) {
        throw new Error("Notification not found");
      }

      await notification.updateOne({ isRead: true });
      return notification;
    } catch (error) {
      console.error("Error marking notification as read:", error);
      throw error;
    }
  }

  /**
   * Mark all user notifications as read
   */
  static async markAllAsRead(userId) {
    try {
      await Notification.updateMany(
        { user: userId, isRead: false },
        { isRead: true }
      );
      return { success: true };
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      throw error;
    }
  }

  /**
   * Get unread notification count for user
   */
  static async getUnreadCount(userId) {
    try {
      const count = await Notification.countDocuments({
        user: userId,
        isRead: false,
      });
      return count;
    } catch (error) {
      console.error("Error getting unread count:", error);
      throw error;
    }
  }

  /**
   * Get active system notifications for user role
   */
  static async getActiveSystemNotifications(userRole) {
    try {
      const systemNotifications = await Notification.find({
        category: "system",
        isActive: true,
        $or: [{ targetRole: "all" }, { targetRole: userRole }],
      }).sort({ createdAt: -1 });

      return systemNotifications;
    } catch (error) {
      console.error("Error fetching system notifications:", error);
      throw error;
    }
  }

  /**
   * Notify admins about new applications
   */
  static async notifyAdmins(notificationType, title, message, relatedId) {
    try {
      const admins = await User.find({ role: "admin" });

      const notifications = [];
      for (const admin of admins) {
        const notification = await this.createNotification({
          user: admin._id,
          type: notificationType,
          title,
          message,
          priority: "high",
          relatedId,
          relatedModel: "Application",
          category: "applications",
        });
        notifications.push(notification);
      }

      // Also emit to admin room for real-time notifications
      if (global.io) {
        global.io.to("admin-room").emit("notification:new", {
          notification: {
            type: notificationType,
            title,
            message,
            priority: "high",
            relatedId,
            relatedModel: "Application",
          },
        });
      }

      return notifications;
    } catch (error) {
      console.error("Error notifying admins:", error);
      // Don't fail the main operation if admin notification fails
    }
  }

  /**
   * Notify user about application status changes
   */
  static async notifyUserAboutApplicationStatus(
    userId,
    status,
    applicationType,
    applicationId,
    additionalInfo = {}
  ) {
    try {
      let title, message, notificationType;

      switch (status) {
        case "submitted":
          title = "Application Submitted Successfully";
          message = `Your ${applicationType} application has been submitted and is under review.`;
          notificationType = "application_submitted";
          break;
        case "under_review":
          title = "Application Under Review";
          message = `Your ${applicationType} application is now under review. We'll notify you once a decision is made.`;
          notificationType = "application_reviewed";
          break;
        case "approved":
          title = "Application Approved!";
          message = `Congratulations! Your ${applicationType} application has been approved. You can now activate your account.`;
          notificationType = "application_approved";
          break;
        case "rejected":
          title = "Application Update";
          message = `Your ${applicationType} application requires attention. ${
            additionalInfo.rejectionReason
              ? `Reason: ${additionalInfo.rejectionReason}`
              : ""
          }`;
          notificationType = "application_rejected";
          break;
        case "resubmitted":
          title = "Application Resubmitted";
          message = `Your ${applicationType} application has been resubmitted and is under review.`;
          notificationType = "application_resubmitted";
          break;
        case "cancelled":
          title = "Application Cancelled";
          message = `Your ${applicationType} application has been cancelled.`;
          notificationType = "application_cancelled";
          break;
        default:
          title = "Application Status Update";
          message = `Your ${applicationType} application status has been updated.`;
          notificationType = "application_status_update";
      }

      const notification = await this.createNotification({
        user: userId,
        type: notificationType,
        title,
        message,
        priority:
          status === "approved" || status === "rejected" ? "high" : "medium",
        relatedId: applicationId,
        relatedModel: "Application",
        category: "applications",
      });

      return notification;
    } catch (error) {
      console.error("Error notifying user about application status:", error);
      // Don't fail the main operation if notification fails
    }
  }

  /**
   * Clean up old notifications
   */
  static async cleanupOldNotifications(daysOld = 90) {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysOld);

      const result = await Notification.deleteMany({
        createdAt: { $lt: cutoffDate },
        isRead: true,
        category: { $ne: "system" }, // Don't delete system notifications
      });

      return {
        deletedCount: result.deletedCount,
        message: `Cleaned up ${result.deletedCount} old notifications`,
      };
    } catch (error) {
      console.error("Error cleaning up old notifications:", error);
      throw error;
    }
  }
}

module.exports = NotificationService;
