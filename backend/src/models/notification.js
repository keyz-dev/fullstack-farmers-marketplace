const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    // User who receives the notification
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // Notification type
    type: {
      type: String,
      required: true,
    },

    // Notification title
    title: {
      type: String,
      required: true,
      maxlength: 200,
    },

    // Notification message
    message: {
      type: String,
      required: true,
      maxlength: 1000,
    },

    // Priority level
    priority: {
      type: String,
      enum: ["low", "medium", "high", "urgent"],
      default: "medium",
    },

    // Category for grouping
    category: {
      type: String,
      enum: [
        "applications",
        "orders",
        "payments",
        "system",
        "promotions",
        "account",
      ],
      default: "system",
    },

    // Related data for context
    relatedId: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "relatedModel",
    },

    // Model type for relatedId
    relatedModel: {
      type: String,
      enum: ["Application", "Order", "Product", "User", "Payment"],
    },

    // Read status
    isRead: {
      type: Boolean,
      default: false,
      index: true,
    },

    // Read timestamp
    readAt: Date,

    // Action data (for actionable notifications)
    actionData: {
      actionType: String, // 'view_application', 'review_order', etc.
      actionUrl: String, // Deep link or route
      actionText: String, // Button text
    },

    // Expiration (for time-sensitive notifications)
    expiresAt: Date,

    // Delivery status
    deliveryStatus: {
      email: { type: Boolean, default: false },
      push: { type: Boolean, default: false },
      sms: { type: Boolean, default: false },
    },

    // Metadata
    metadata: {
      ipAddress: String,
      userAgent: String,
      platform: String, // 'mobile_app', 'web_admin', 'web_consumer'
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for performance
notificationSchema.index({ user: 1, isRead: 1 });
notificationSchema.index({ user: 1, createdAt: -1 });
notificationSchema.index({ type: 1 });
notificationSchema.index({ category: 1 });
notificationSchema.index({ expiresAt: 1 });
notificationSchema.index({ "deliveryStatus.push": 1 });

// Instance methods
notificationSchema.methods.markAsRead = function () {
  this.isRead = true;
  this.readAt = new Date();
  return this.save();
};

notificationSchema.methods.isExpired = function () {
  if (!this.expiresAt) return false;
  return new Date() > this.expiresAt;
};

notificationSchema.methods.canExpire = function () {
  return this.expiresAt !== undefined;
};

// Static methods
notificationSchema.statics.findUnreadByUser = function (userId, limit = 50) {
  return this.find({ user: userId, isRead: false })
    .sort({ createdAt: -1 })
    .limit(limit);
};

notificationSchema.statics.findByUserAndCategory = function (
  userId,
  category,
  limit = 50
) {
  return this.find({ user: userId, category })
    .sort({ createdAt: -1 })
    .limit(limit);
};

notificationSchema.statics.markAllAsRead = function (userId) {
  return this.updateMany(
    { user: userId, isRead: false },
    { isRead: true, readAt: new Date() }
  );
};

notificationSchema.statics.getUnreadCount = function (userId) {
  return this.countDocuments({ user: userId, isRead: false });
};

// Pre-save middleware
notificationSchema.pre("save", function (next) {
  // Set default category based on type if not provided
  if (!this.category) {
    if (this.type.includes("application")) {
      this.category = "applications";
    } else if (this.type.includes("order")) {
      this.category = "orders";
    } else if (this.type.includes("payment")) {
      this.category = "payments";
    } else if (this.type.includes("system")) {
      this.category = "system";
    }
  }

  next();
});

module.exports = mongoose.model("Notification", notificationSchema);
