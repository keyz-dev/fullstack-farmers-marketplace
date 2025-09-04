const Joi = require("joi");

// Create notification validation schema
const createNotificationSchema = Joi.object({
  user: Joi.string().required(),
  type: Joi.string().required(),
  title: Joi.string().required(),
  message: Joi.string().required(),
  priority: Joi.string().valid("low", "medium", "high", "urgent").default("medium"),
  category: Joi.string().valid(
    "applications",
    "orders", 
    "payments",
    "system",
    "promotions",
    "account"
  ).optional(),
  relatedId: Joi.string().optional(),
  relatedModel: Joi.string().valid("Application", "Order", "Product", "User", "Payment").optional(),
  expiresAt: Joi.date().optional(),
});

// Bulk notification validation schema
const bulkNotificationSchema = Joi.object({
  notifications: Joi.array().items(
    Joi.object({
      user: Joi.string().required(),
      type: Joi.string().required(),
      title: Joi.string().required(),
      message: Joi.string().required(),
      priority: Joi.string().valid("low", "medium", "high", "urgent").default("medium"),
      category: Joi.string().valid(
        "applications",
        "orders",
        "payments", 
        "system",
        "promotions",
        "account"
      ).optional(),
      relatedId: Joi.string().optional(),
      relatedModel: Joi.string().valid("Application", "Order", "Product", "User", "Payment").optional(),
      expiresAt: Joi.date().optional(),
    })
  ).min(1).required(),
});

// Mark notification as read validation schema
const markAsReadSchema = Joi.object({
  id: Joi.string().required(),
});

// Get notifications query validation schema
const getNotificationsSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
  isRead: Joi.boolean().optional(),
  type: Joi.string().optional(),
  priority: Joi.string().valid("low", "medium", "high", "urgent").optional(),
  category: Joi.string().valid(
    "applications",
    "orders",
    "payments",
    "system", 
    "promotions",
    "account"
  ).optional(),
  search: Joi.string().optional(),
});

// Get notifications by category validation schema
const getNotificationsByCategorySchema = Joi.object({
  category: Joi.string().valid(
    "applications",
    "orders",
    "payments",
    "system",
    "promotions", 
    "account"
  ).required(),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
});

// Cleanup old notifications validation schema
const cleanupNotificationsSchema = Joi.object({
  daysOld: Joi.number().integer().min(1).max(365).default(90),
});

module.exports = {
  createNotificationSchema,
  bulkNotificationSchema,
  markAsReadSchema,
  getNotificationsSchema,
  getNotificationsByCategorySchema,
  cleanupNotificationsSchema,
};
