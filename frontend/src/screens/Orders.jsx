import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  Image,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../constants';
import { useAuth } from '../stateManagement/contexts';
import { useOrders } from '../stateManagement/contexts/OrderContext';
import { Loader } from '../components';

const Orders = () => {
  const { user } = useAuth();
  const {
    orders,
    loading,
    error,
    refreshing,
    stats,
    fetchCustomerOrders,
    fetchFarmerOrders,
    updateOrderStatus,
    cancelOrder,
    getFilteredOrders,
    getOrderStats,
  } = useOrders();

  const [selectedTab, setSelectedTab] = useState('all');

  // Customer tabs
  const customerTabs = [
    { id: 'all', label: 'All Orders' },
    { id: 'completed', label: 'Completed' },
    { id: 'uncompleted', label: 'Uncompleted' },
  ];

  // Farmer tabs
  const farmerTabs = [
    { id: 'all', label: 'All Orders' },
    { id: 'pending', label: 'Pending' },
    { id: 'processing', label: 'Processing' },
    { id: 'completed', label: 'Completed' },
  ];

  const tabs = user?.role === 'farmer' ? farmerTabs : customerTabs;

  useEffect(() => {
    if (user) {
      if (user.role === 'customer') {
        fetchCustomerOrders();
      } else if (user.role === 'farmer') {
        fetchFarmerOrders();
      }
    }
  }, [user]);

  const onRefresh = () => {
    if (user?.role === 'customer') {
      fetchCustomerOrders(true);
    } else if (user?.role === 'farmer') {
      fetchFarmerOrders(true);
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return COLORS.warning;
      case 'processing':
        return COLORS.primary;
      case 'shipped':
        return COLORS.info;
      case 'completed':
        return COLORS.success;
      case 'cancelled':
        return COLORS.error;
      default:
        return COLORS.gray;
    }
  };

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'time-outline';
      case 'processing':
        return 'sync-outline';
      case 'shipped':
        return 'car-outline';
      case 'completed':
        return 'checkmark-circle-outline';
      case 'cancelled':
        return 'close-circle-outline';
      default:
        return 'help-outline';
    }
  };

  const getFilteredOrdersForDisplay = () => {
    if (user?.role === 'customer') {
      if (selectedTab === 'completed') {
        return orders.filter(order => order.status === 'completed');
      } else if (selectedTab === 'uncompleted') {
        return orders.filter(order => order.status !== 'completed' && order.status !== 'cancelled');
      }
    } else if (user?.role === 'farmer') {
      if (selectedTab === 'all') return orders;
      return orders.filter(order => order.status.toLowerCase() === selectedTab);
    }
    return orders;
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      Alert.alert('Success', 'Order status updated successfully');
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const handleCancelOrder = async (orderId) => {
    Alert.alert(
      'Cancel Order',
      'Are you sure you want to cancel this order?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes',
          style: 'destructive',
          onPress: async () => {
            try {
              await cancelOrder(orderId);
              Alert.alert('Success', 'Order cancelled successfully');
            } catch (error) {
              Alert.alert('Error', error.message);
            }
          },
        },
      ]
    );
  };

  const renderOrderItem = ({ item }) => (
    <View style={styles.orderCard}>
      <View style={styles.orderHeader}>
        <Text style={styles.orderId}>Order #{item.orderNumber}</Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Ionicons name={getStatusIcon(item.status)} size={16} color={COLORS.white} />
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>

      <View style={styles.orderInfo}>
        <Text style={styles.orderDate}>
          {new Date(item.createdAt).toLocaleDateString()}
        </Text>
        <Text style={styles.orderTotal}>Total: ${item.totalAmount}</Text>
      </View>

      <View style={styles.productPreview}>
        {item.items.slice(0, 3).map((orderItem, index) => (
          <View key={index} style={styles.productItem}>
            <Image
              source={{ uri: orderItem.product.images[0]?.url }}
              style={styles.productImage}
              resizeMode="cover"
            />
            <Text style={styles.productName} numberOfLines={1}>
              {orderItem.product.name}
            </Text>
            <Text style={styles.productQuantity}>x{orderItem.quantity}</Text>
          </View>
        ))}
        {item.items.length > 3 && (
          <View style={styles.moreItems}>
            <Text style={styles.moreItemsText}>+{item.items.length - 3}</Text>
          </View>
        )}
      </View>

      <View style={styles.orderActions}>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionButtonText}>View Details</Text>
        </TouchableOpacity>
        
        {user?.role === 'farmer' && item.status === 'pending' && (
          <TouchableOpacity 
            style={[styles.actionButton, styles.acceptButton]}
            onPress={() => handleStatusUpdate(item._id, 'processing')}
          >
            <Text style={styles.acceptButtonText}>Accept Order</Text>
          </TouchableOpacity>
        )}

        {user?.role === 'farmer' && item.status === 'processing' && (
          <TouchableOpacity 
            style={[styles.actionButton, styles.shipButton]}
            onPress={() => handleStatusUpdate(item._id, 'shipped')}
          >
            <Text style={styles.shipButtonText}>Mark Shipped</Text>
          </TouchableOpacity>
        )}

        {user?.role === 'customer' && ['pending', 'processing'].includes(item.status) && (
          <TouchableOpacity 
            style={[styles.actionButton, styles.cancelButton]}
            onPress={() => handleCancelOrder(item._id)}
          >
            <Text style={styles.cancelButtonText}>Cancel Order</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  const renderStats = () => {
    const orderStats = getOrderStats();
    
    if (user?.role === 'customer') {
      return (
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{orderStats.total}</Text>
            <Text style={styles.statLabel}>Total Orders</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{orderStats.completed}</Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{orderStats.pending}</Text>
            <Text style={styles.statLabel}>Pending</Text>
          </View>
        </View>
      );
    } else if (user?.role === 'farmer') {
      return (
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{orderStats.total}</Text>
            <Text style={styles.statLabel}>Total Orders</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{orderStats.pending}</Text>
            <Text style={styles.statLabel}>Pending</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{orderStats.processing}</Text>
            <Text style={styles.statLabel}>Processing</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{orderStats.completed}</Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>
        </View>
      );
    }
    return null;
  };

  if (loading && !refreshing) {
    return <Loader />;
  }

  const filteredOrders = getFilteredOrdersForDisplay();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          {user?.role === 'farmer' ? 'Orders Received' : 'My Orders'}
        </Text>
      </View>

      {renderStats()}

      <View style={styles.tabContainer}>
        <FlatList
          horizontal
          data={tabs}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.tab,
                selectedTab === item.id && styles.activeTab,
              ]}
              onPress={() => setSelectedTab(item.id)}
            >
              <Text
                style={[
                  styles.tabText,
                  selectedTab === item.id && styles.activeTabText,
                ]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          )}
          showsHorizontalScrollIndicator={false}
        />
      </View>

      <FlatList
        data={filteredOrders}
        renderItem={renderOrderItem}
        keyExtractor={(item) => item._id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="bag-outline" size={80} color={COLORS.gray} />
            <Text style={styles.emptyTitle}>No Orders Yet</Text>
            <Text style={styles.emptySubtitle}>
              {user?.role === 'farmer' 
                ? 'You haven\'t received any orders yet'
                : 'You haven\'t placed any orders yet'
              }
            </Text>
          </View>
        }
        contentContainerStyle={styles.listContainer}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.lightWhite,
  },
  header: {
    padding: SIZES.medium,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  headerTitle: {
    fontSize: SIZES.large,
    fontFamily: 'bold',
    color: COLORS.black,
  },
  statsContainer: {
    flexDirection: 'row',
    padding: SIZES.medium,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    padding: SIZES.small,
  },
  statNumber: {
    fontSize: SIZES.large,
    fontFamily: 'bold',
    color: COLORS.primary,
  },
  statLabel: {
    fontSize: SIZES.small,
    fontFamily: 'medium',
    color: COLORS.gray,
    marginTop: 4,
  },
  tabContainer: {
    backgroundColor: COLORS.white,
    paddingVertical: SIZES.small,
  },
  tab: {
    paddingHorizontal: SIZES.medium,
    paddingVertical: SIZES.small,
    marginHorizontal: SIZES.small,
    borderRadius: SIZES.small,
  },
  activeTab: {
    backgroundColor: COLORS.primary,
  },
  tabText: {
    fontSize: SIZES.medium,
    fontFamily: 'medium',
    color: COLORS.gray,
  },
  activeTabText: {
    color: COLORS.white,
  },
  listContainer: {
    padding: SIZES.medium,
  },
  orderCard: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.medium,
    padding: SIZES.medium,
    marginBottom: SIZES.medium,
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.small,
  },
  orderId: {
    fontSize: SIZES.medium,
    fontFamily: 'bold',
    color: COLORS.black,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SIZES.small,
    paddingVertical: 4,
    borderRadius: SIZES.small,
  },
  statusText: {
    fontSize: SIZES.small,
    fontFamily: 'medium',
    color: COLORS.white,
    marginLeft: 4,
  },
  orderInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SIZES.small,
  },
  orderDate: {
    fontSize: SIZES.small,
    fontFamily: 'regular',
    color: COLORS.gray,
  },
  orderTotal: {
    fontSize: SIZES.small,
    fontFamily: 'bold',
    color: COLORS.primary,
  },
  productPreview: {
    flexDirection: 'row',
    marginBottom: SIZES.medium,
  },
  productItem: {
    alignItems: 'center',
    marginRight: SIZES.medium,
    width: 60,
  },
  productImage: {
    width: 50,
    height: 50,
    borderRadius: SIZES.small,
    marginBottom: 4,
  },
  productName: {
    fontSize: SIZES.small,
    fontFamily: 'medium',
    color: COLORS.black,
    textAlign: 'center',
  },
  productQuantity: {
    fontSize: SIZES.small,
    fontFamily: 'regular',
    color: COLORS.gray,
  },
  moreItems: {
    width: 50,
    height: 50,
    borderRadius: SIZES.small,
    backgroundColor: COLORS.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  moreItemsText: {
    fontSize: SIZES.small,
    fontFamily: 'bold',
    color: COLORS.gray,
  },
  orderActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    paddingVertical: SIZES.small,
    paddingHorizontal: SIZES.medium,
    borderRadius: SIZES.small,
    borderWidth: 1,
    borderColor: COLORS.primary,
    marginHorizontal: SIZES.small,
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: SIZES.small,
    fontFamily: 'medium',
    color: COLORS.primary,
  },
  acceptButton: {
    backgroundColor: COLORS.primary,
  },
  acceptButtonText: {
    fontSize: SIZES.small,
    fontFamily: 'medium',
    color: COLORS.white,
  },
  shipButton: {
    backgroundColor: COLORS.info,
    borderColor: COLORS.info,
  },
  shipButtonText: {
    fontSize: SIZES.small,
    fontFamily: 'medium',
    color: COLORS.white,
  },
  cancelButton: {
    backgroundColor: COLORS.error,
    borderColor: COLORS.error,
  },
  cancelButtonText: {
    fontSize: SIZES.small,
    fontFamily: 'medium',
    color: COLORS.white,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: SIZES.xxLarge,
  },
  emptyTitle: {
    fontSize: SIZES.large,
    fontFamily: 'bold',
    color: COLORS.black,
    marginTop: SIZES.medium,
  },
  emptySubtitle: {
    fontSize: SIZES.medium,
    fontFamily: 'regular',
    color: COLORS.gray,
    textAlign: 'center',
    marginTop: SIZES.small,
  },
});

export default Orders;