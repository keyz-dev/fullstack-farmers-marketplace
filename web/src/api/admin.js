import api from ".";


export const adminApi = {
  // Get all applications with filtering and pagination
  async getApplications(params) {
    const response = await api.get("/admin/applications", { params });
    return response.data.data; // Access the nested data property
  },
  
  // Get application statistics
  async getApplicationStats() {
    const response = await api.get("/admin/applications/stats");
    return response.data.data; // Access the nested data property
  },
  
  // Get single application with details
  async getApplication(id) {
    const response = await api.get(`/admin/applications/${id}`);
    return response.data.data; // Access the nested data property
  },
  
  // Review application (approve/reject)
  async reviewApplication(id, reviewData) {
    const response = await api.put(
      `/admin/applications/${id}/review`,
      reviewData
    );
    return response.data;
  }
}
