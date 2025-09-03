import { API_BASE_URL } from '../config';
import AsyncStorage from '@react-native-async-storage/async-storage';

class FarmerProductsAPI {
    constructor() {
        this.baseURL = API_BASE_URL;
    }

    // Get auth token from storage
    async getAuthToken() {
        try {
            const token = await AsyncStorage.getItem('token');
            return token;
        } catch (error) {
            console.error('Error getting auth token:', error);
            return null;
        }
    }

    // Make authenticated request
    async makeRequest(endpoint, options = {}) {
        try {
            const token = await this.getAuthToken();
            const defaultHeaders = {
                'Content-Type': 'application/json',
                'Authorization': token ? `Bearer ${token}` : '',
            };

            // For FormData, remove Content-Type to let browser set boundary
            if (options.body instanceof FormData) {
                delete defaultHeaders['Content-Type'];
            }

            const config = {
                ...options,
                headers: {
                    ...defaultHeaders,
                    ...options.headers,
                },
            };

            const response = await fetch(`${this.baseURL}${endpoint}`, config);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || `HTTP error! status: ${response.status}`);
            }

            return data;
        } catch (error) {
            console.error('API Request Error:', error);
            throw error;
        }
    }

    // Get farmer's products with stats
    async getFarmerProducts() {
        try {
            return await this.makeRequest('/product/myproducts', {
                method: 'GET',
            });
        } catch (error) {
            return {
                success: false,
                message: error.message || 'Failed to fetch products',
            };
        }
    }

    // Add new product
    async addProduct(productData) {
        try {
            return await this.makeRequest('/product/create', {
                method: 'POST',
                body: productData, // FormData object
            });
        } catch (error) {
            return {
                success: false,
                message: error.message || 'Failed to add product',
            };
        }
    }

    // Update existing product
    async updateProduct(productId, productData) {
        try {
            return await this.makeRequest(`/product/${productId}`, {
                method: 'PUT',
                body: productData, // FormData object
            });
        } catch (error) {
            return {
                success: false,
                message: error.message || 'Failed to update product',
            };
        }
    }

    // Delete product
    async deleteProduct(productId) {
        try {
            return await this.makeRequest(`/product/${productId}`, {
                method: 'DELETE',
            });
        } catch (error) {
            return {
                success: false,
                message: error.message || 'Failed to delete product',
            };
        }
    }

    // Get categories for dropdown
    async getCategories() {
        try {
            return await this.makeRequest('/categories', {
                method: 'GET',
            });
        } catch (error) {
            return {
                success: false,
                message: error.message || 'Failed to fetch categories',
            };
        }
    }

    // Get single product details
    async getProduct(productId) {
        try {
            return await this.makeRequest(`/product/${productId}`, {
                method: 'GET',
            });
        } catch (error) {
            return {
                success: false,
                message: error.message || 'Failed to fetch product',
            };
        }
    }

    // Update product stock
    async updateProductStock(productId, newStock) {
        try {
            return await this.makeRequest(`/product/${productId}/stock`, {
                method: 'PUT',
                body: JSON.stringify({ stock: newStock }),
            });
        } catch (error) {
            return {
                success: false,
                message: error.message || 'Failed to update stock',
            };
        }
    }

    // Toggle product availability
    async toggleProductDelivery(productId, isDeliverable) {
        try {
            return await this.makeRequest(`/product/${productId}/delivery`, {
                method: 'PUT',
                body: JSON.stringify({ isDeliverable }),
            });
        } catch (error) {
            return {
                success: false,
                message: error.message || 'Failed to update delivery status',
            };
        }
    }

    // Get product sales analytics (if you implement this later)
    async getProductAnalytics(productId, timeRange = '30d') {
        try {
            return await this.makeRequest(
                `/product/${productId}/analytics?range=${timeRange}`,
                {
                    method: 'GET',
                }
            );
        } catch (error) {
            return {
                success: false,
                message: error.message || 'Failed to fetch analytics',
            };
        }
    }

    // Search products (for farmer's own products)
    async searchFarmerProducts(query) {
        try {
            return await this.makeRequest(
                `/product/myproducts/search?q=${encodeURIComponent(query)}`,
                {
                    method: 'GET',
                }
            );
        } catch (error) {
            return {
                success: false,
                message: error.message || 'Failed to search products',
            };
        }
    }

    // Bulk update products
    async bulkUpdateProducts(updates) {
        try {
            return await this.makeRequest('/product/myproducts/bulk-update', {
                method: 'PUT',
                body: JSON.stringify({ updates }),
            });
        } catch (error) {
            return {
                success: false,
                message: error.message || 'Failed to bulk update products',
            };
        }
    }
}

// Export singleton instance
export const farmerProductsAPI = new FarmerProductsAPI();
