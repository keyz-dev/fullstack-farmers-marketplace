import api from "./index";

const URL_PREFIX = "/applications";

export const applicationsAPI = {
  // Vendor application/setup
  getApplications: async () => {
    const response = await api.get(`${URL_PREFIX}/profile`);
    return response.data;
  },

  getVendorSetupStatus: async () => {
    const response = await api.get(`${URL_PREFIX}/setup/status`);
    return response.data;
  },

  // Admin: Get all vendor applications
  getVendorApplications: async (params = {}) => {
    const response = await api.get(`${URL_PREFIX}/applications`, { params });
    return response.data;
  },

  // Admin: Get vendor application stats
  getVendorApplicationStats: async () => {
    try {
      const response = await api.get(`${URL_PREFIX}/applications/stats`);
      return response.data;
    } catch (error) {
      console.error("Error fetching vendor application stats:", error);
      throw error;
    }
  },

  // Admin: Get single vendor application
  getVendorApplication: async (id) => {
    const response = await api.get(`${URL_PREFIX}/applications/${id}`);
    return response.data;
  },

  // Admin: Review vendor application
  reviewVendorApplication: async (id, reviewData) => {
    const response = await api.put(
      `${URL_PREFIX}/applications/${id}/review`,
      reviewData
    );
    return response.data;
  },

  // Vendor dashboard operations (for later)
  getVendorDashboard: async () => {
    const response = await api.get(`${URL_PREFIX}/dashboard`);
    return response.data;
  },

  getVendorProducts: async (params = {}) => {
    const response = await api.get(`${URL_PREFIX}/products`, { params });
    return response.data;
  },

  getVendorOrders: async (params = {}) => {
    const response = await api.get(`${URL_PREFIX}/orders`, { params });
    return response.data;
  },

  getVendorAnalytics: async (params = {}) => {
    const { type, range, limit } = params;
    let url = `${URL_PREFIX}Analytics/${type}`;
    const queryParams = new URLSearchParams();

    if (range) queryParams.append("range", range);
    if (limit) queryParams.append("limit", limit);

    if (queryParams.toString()) {
      url += `?${queryParams.toString()}`;
    }

    const response = await api.get(url);
    return response.data;
  },

  // Payment configuration
  updatePaymentConfig: async (data) => {
    const response = await api.put(`${URL_PREFIX}/payment-config`, data);
    return response.data;
  },

  // Vendor activation
  checkActivationEligibility: async () => {
    const response = await api.get(`${URL_PREFIX}/activation/eligibility`);
    return response.data;
  },

  activateVendorAccount: async () => {
    const response = await api.post(`${URL_PREFIX}/activation/activate`);
    return response.data;
  },

  getPaymentConfig: async () => {
    const response = await api.get(`${URL_PREFIX}/payment-config`);
    return response.data;
  },

  // Document management
  uploadDocument: async (documentType, file) => {
    const formData = new FormData();
    formData.append("documentType", documentType);
    formData.append("document", file);

    const response = await api.post(`${URL_PREFIX}/documents`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  getDocuments: async () => {
    const response = await api.get(`${URL_PREFIX}/documents`);
    return response.data;
  },

  deleteDocument: async (documentId) => {
    const response = await api.delete(`${URL_PREFIX}/documents/${documentId}`);
    return response.data;
  },
};
