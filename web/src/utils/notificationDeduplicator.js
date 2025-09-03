/**
 * Notification Deduplication Service
 * Prevents duplicate notifications from multiple sources
 */

class NotificationDeduplicator {
  constructor() {
    if (NotificationDeduplicator.instance) {
      return NotificationDeduplicator.instance;
    }

    this.recentNotifications = new Map();
    this.DEDUPLICATION_WINDOW = 5000; // 5 seconds

    NotificationDeduplicator.instance = this;
  }

  static getInstance() {
    if (!NotificationDeduplicator.instance) {
      NotificationDeduplicator.instance = new NotificationDeduplicator();
    }
    return NotificationDeduplicator.instance;
  }

  generateKey(notification) {
    const { type, reference, userId, message } = notification;
    return `${type}:${reference || ""}:${userId || ""}:${
      message?.substring(0, 50) || ""
    }`;
  }

  shouldShow(notification) {
    const key = this.generateKey(notification);
    const now = Date.now();
    const lastShown = this.recentNotifications.get(key);

    // If notification was shown recently, don't show again
    if (lastShown && now - lastShown < this.DEDUPLICATION_WINDOW) {
      console.log(`🚫 Blocking duplicate notification: ${key}`);
      return false;
    }

    // Record this notification
    this.recentNotifications.set(key, now);

    // Cleanup old entries periodically
    this.cleanup();

    console.log(`✅ Allowing notification: ${key}`);
    return true;
  }

  cleanup() {
    const now = Date.now();
    const keysToDelete = [];

    this.recentNotifications.forEach((timestamp, key) => {
      if (now - timestamp > this.DEDUPLICATION_WINDOW * 2) {
        keysToDelete.push(key);
      }
    });

    keysToDelete.forEach((key) => {
      this.recentNotifications.delete(key);
    });
  }

  clear() {
    this.recentNotifications.clear();
  }
}

export const notificationDeduplicator = NotificationDeduplicator.getInstance();

// Helper function for easy use
export const shouldShowNotification = (type, message, reference, userId) => {
  return notificationDeduplicator.shouldShow({
    type,
    message,
    reference,
    userId,
  });
};
