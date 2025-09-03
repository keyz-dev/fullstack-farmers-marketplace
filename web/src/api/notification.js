import api from "./index";

export const notificationApi = {
  // Get notification count
  getNotificationCount: async () => {
    const response = await api.get("/notification/count");
    return response.data;
  },

  // Get notification categories for user role
  getNotificationCategories: async () => {
    const response = await api.get("/notification/categories");
    return response.data;
  },

  // Get all notifications for user
  getUserNotifications: async (params = {}) => {
    const response = await api.get("/notification", { params });
    return response.data;
  },

  // Create a notification (admin only)
  createNotification: async (notificationData) => {
    const response = await api.post("/notification", notificationData);
    return response.data;
  },

  // Mark notification as read
  markAsRead: async (notificationId) => {
    const response = await api.patch(`/notification/${notificationId}/read`);
    return response.data;
  },

  // Mark all notifications as read
  markAllAsRead: async () => {
    const response = await api.patch("/notification/mark-all-read");
    return response.data;
  },

  // Delete a notification
  deleteNotification: async (notificationId) => {
    const response = await api.delete(`/notification/${notificationId}`);
    return response.data;
  },
};
