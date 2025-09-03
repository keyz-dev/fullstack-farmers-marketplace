import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../../api/config";
import { useAuth } from "./AuthContext";

const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
  const { user, token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({});

  // Fetch customer orders
  const fetchCustomerOrders = async (isRefresh = false) => {
    if (!user || user.role !== 'customer') return;
    
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      const response = await api.get('/orders/customer', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        setOrders(response.data.orders);
        setStats(response.data.stats || {});
      } else {
        setError(response.data.message || 'Failed to fetch orders');
      }
    } catch (error) {
      console.error('Error fetching customer orders:', error);
      setError('Failed to load orders. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Fetch farmer orders
  const fetchFarmerOrders = async (isRefresh = false) => {
    if (!user || user.role !== 'farmer') return;
    
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      const response = await api.get('/orders/farmer', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        setOrders(response.data.orders);
        setStats(response.data.stats || {});
      } else {
        setError(response.data.message || 'Failed to fetch orders');
      }
    } catch (error) {
      console.error('Error fetching farmer orders:', error);
      setError('Failed to load orders. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Create new order (customer)
  const createOrder = async (orderData) => {
    try {
      setLoading(true);
      const response = await api.post('/order/create', orderData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        // Refresh orders to get the updated list
        await fetchCustomerOrders();
        return { success: true, order: response.data.order };
      } else {
        throw new Error(response.data.message || 'Failed to create order');
      }
    } catch (error) {
      console.error('Error creating order:', error);
      throw new Error(error.response?.data?.message || error.message || 'Failed to create order');
    } finally {
      setLoading(false);
    }
  };

  // Update order status (farmer)
  const updateOrderStatus = async (orderId, status) => {
    try {
      setLoading(true);
      const response = await api.put(`/orders/${orderId}/status`, { status }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        // Refresh orders to get the updated list
        await fetchFarmerOrders();
        return { success: true, order: response.data.order };
      } else {
        throw new Error(response.data.message || 'Failed to update order status');
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      throw new Error(error.response?.data?.message || error.message || 'Failed to update order status');
    } finally {
      setLoading(false);
    }
  };

  // Cancel order (customer)
  const cancelOrder = async (orderId) => {
    try {
      setLoading(true);
      const response = await api.put(`/orders/${orderId}/cancel`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        // Refresh orders to get the updated list
        await fetchCustomerOrders();
        return { success: true, order: response.data.order };
      } else {
        throw new Error(response.data.message || 'Failed to cancel order');
      }
    } catch (error) {
      console.error('Error canceling order:', error);
      throw new Error(error.response?.data?.message || error.message || 'Failed to cancel order');
    } finally {
      setLoading(false);
    }
  };

  // Get order by ID
  const getOrderById = async (orderId) => {
    try {
      setLoading(true);
      const response = await api.get(`/orders/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        return response.data.order;
      } else {
        throw new Error(response.data.message || 'Failed to fetch order');
      }
    } catch (error) {
      console.error('Error fetching order:', error);
      throw new Error(error.response?.data?.message || error.message || 'Failed to fetch order');
    } finally {
      setLoading(false);
    }
  };

  // Filter orders by status
  const getFilteredOrders = (status) => {
    if (!status || status === 'all') return orders;
    return orders.filter(order => order.status.toLowerCase() === status.toLowerCase());
  };

  // Get order statistics
  const getOrderStats = () => {
    if (user?.role === 'customer') {
      return {
        total: orders.length,
        completed: orders.filter(order => order.status === 'completed').length,
        pending: orders.filter(order => ['pending', 'processing', 'shipped'].includes(order.status)).length,
        cancelled: orders.filter(order => order.status === 'cancelled').length,
      };
    } else if (user?.role === 'farmer') {
      return {
        total: orders.length,
        pending: orders.filter(order => order.status === 'pending').length,
        processing: orders.filter(order => order.status === 'processing').length,
        completed: orders.filter(order => order.status === 'completed').length,
        cancelled: orders.filter(order => order.status === 'cancelled').length,
      };
    }
    return {};
  };

  // Initialize orders based on user role
  useEffect(() => {
    if (user) {
      if (user.role === 'customer') {
        fetchCustomerOrders();
      } else if (user.role === 'farmer') {
        fetchFarmerOrders();
      }
    }
  }, [user]);

  return (
    <OrderContext.Provider
      value={{
        // State
        orders,
        loading,
        error,
        refreshing,
        stats,

        // Actions
        fetchCustomerOrders,
        fetchFarmerOrders,
        createOrder,
        updateOrderStatus,
        cancelOrder,
        getOrderById,
        getFilteredOrders,
        getOrderStats,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
}; 