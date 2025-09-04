import api from "./index";

// Notification API functions
export const notificationAPI = {
  // Get notifications with pagination and filtering
  getNotifications: async (filters = {}) => {
    const response = await api.get("/notification", { params: filters });
    return response.data.data;
  },

  // Get unread notification count
  getUnreadCount: async () => {
    const response = await api.get("/notification/unread-count");
    return response.data.data;
  },

  // Mark notification as read
  markAsRead: async (notificationId) => {
    const response = await api.put(`/notification/${notificationId}/read`);
    return response.data.data;
  },

  // Mark all notifications as read
  markAllAsRead: async () => {
    const response = await api.put("/notification/mark-all-read");
    return response.data;
  },

  // Delete a notification
  deleteNotification: async (notificationId) => {
    const response = await api.delete(`/notification/${notificationId}`);
    return response.data;
  },

  // Clear all notifications
  clearAllNotifications: async () => {
    const response = await api.delete("/notification/clear-all");
    return response.data;
  },

  // Get notification statistics
  getNotificationStats: async () => {
    const response = await api.get("/notification/stats");
    return response.data.data;
  },
};
