import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  FlatList,
  RefreshControl,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { Loader } from "../../components";
import { COLORS } from "../../constants";
import { useAuth } from "../../stateManagement/contexts/AuthContext";
import styles from "./styles/home.style";
import { useProducts } from "../../stateManagement/contexts/ProductContext";
import { handleDeleteProduct } from "../../utils/handleDeleteProduct";
import { ProductCard, StatsCard } from "../../components/farmer";

const FarmerProductsDashboard = ({ navigation }) => {
  const { user } = useAuth();
  const {
    fetchFarmerProducts,
    products,
    stats,
    loading,
    error,
    refreshing,
    deleteProduct,
  } = useProducts();

  useFocusEffect(
    useCallback(() => {
      fetchFarmerProducts();
    }, [])
  );

  useEffect(() => {
    console.log("useEffect is fetching products");
    fetchFarmerProducts();
  }, []);

  const onRefresh = () => {
    fetchFarmerProducts(true);
  };

  const handleDeleteRequest = (productId) => {
    handleDeleteProduct(productId, deleteProduct);
  };

  const handleUpdateProduct = (product) => {
    navigation.navigate("EditProduct", { product });
  };

  if (!error && !loading) {
    console.log(products);
  }

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="storefront-outline" size={80} color={COLORS.gray} />
      <Text style={styles.emptyTitle}>No Products Yet</Text>
      <Text style={styles.emptySubtitle}>
        Start building your product catalog by adding your first product
      </Text>
      <TouchableOpacity
        style={styles.addProductButton}
        onPress={() => navigation.navigate("AddProduct")}
      >
        <Ionicons name="add" size={20} color={COLORS.white} />
        <Text style={styles.addProductButtonText}>Add Your First Product</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return <Loader />;
  }

  if (error || !products) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => fetchFarmerProducts()}
        >
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.welcomeText}>Welcome back, {user?.name}!</Text>
          <Text style={styles.headerSubtitle}>
            Manage your products and track your sales
          </Text>
        </View>

        {products.length > 0 && (
          <>
            {/* Stats Section */}
            <View style={styles.statsSection}>
              <Text style={styles.sectionTitle}>Quick Stats</Text>
              <View style={styles.statsGrid}>
                <StatsCard
                  title="Total Products"
                  value={stats.totalProducts || 0}
                  icon="cube-outline"
                  color={COLORS.primary}
                />
                <StatsCard
                  title="Total Value"
                  value={`$${(stats.totalValue || 0).toFixed(0)}`}
                  icon="cash-outline"
                  color={COLORS.success}
                />
                <StatsCard
                  title="Low Stock"
                  value={stats.lowStockItems || 0}
                  icon="warning-outline"
                  color={COLORS.warning}
                />
                <StatsCard
                  title="Avg Rating"
                  value={
                    stats.averageRating ? stats.averageRating.toFixed(1) : "0.0"
                  }
                  icon="star-outline"
                  color={COLORS.info}
                />
              </View>
            </View>

            {/* Products Section */}
            <View style={styles.productsSection}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Your Products</Text>
                <TouchableOpacity
                  style={styles.addButton}
                  onPress={() => navigation.navigate("AddProduct")}
                >
                  <Ionicons name="add" size={20} color={COLORS.primary} />
                  <Text style={styles.addButtonText}>Add Product</Text>
                </TouchableOpacity>
              </View>

              <FlatList
                data={products}
                renderItem={({ item }) => (
                  <ProductCard
                    product={item}
                    onUpdate={handleUpdateProduct}
                    onDelete={handleDeleteRequest}
                  />
                )}
                keyExtractor={(item) => item._id}
                numColumns={1}
                scrollEnabled={false}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
              />
            </View>
          </>
        )}

        {products.length === 0 && renderEmptyState()}
      </ScrollView>
    </View>
  );
};

export default FarmerProductsDashboard;
