import api from "./index";

export const adminUserApi = {
  // Get all users with pagination, filtering, and search
  getAllUsers: async (params = {}) => {
    const response = await api.get("/adminUser", { params });
    return response.data;
  },

  // Get user statistics
  getUserStats: async () => {
    const response = await api.get("/adminUser/stats");
    return response.data;
  },

  // Get single user by ID
  getUserById: async (userId) => {
    const response = await api.get(`/adminUser/${userId}`);
    return response.data;
  },

  // Update user
  updateUser: async (userId, userData) => {
    const response = await api.put(`/adminUser/${userId}`, userData);
    return response.data;
  },

  // Delete user
  deleteUser: async (userId) => {
    const response = await api.delete(`/adminUser/${userId}`);
    return response.data;
  },

  // Toggle user active status
  toggleUserStatus: async (userId) => {
    const response = await api.patch(`/adminUser/${userId}/toggle-status`);
    return response.data;
  },

  // Verify user email
  verifyUser: async (userId) => {
    const response = await api.patch(`/adminUser/${userId}/verify`);
    return response.data;
  },
};
