import { FlatList, View, Text } from "react-native";
import React, { useEffect } from "react";
import styles from "./styles/productList.style.js";
import { Loader } from "../";
import ProductCardView from "./ProductCardView";
import { useProducts } from "../../stateManagement/contexts";

const ProductList = ({ categoryId, headerText }) => {
  const { products, loading, error, fetchAllProducts } = useProducts();

  useEffect(() => {
    fetchAllProducts({ category: categoryId });
  }, [categoryId]);

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return (
      <Text style={{ color: "red", fontFamily: "semibold" }}>
        Failed to load products.
      </Text>
    );
  }

  // Check if products array is empty or null/undefined
  if (!products || products.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No {headerText.toLowerCase()} yet</Text>
        <Text style={styles.emptySubText}>
          Check back later for new {headerText.toLowerCase()} in this category
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={products}
        numColumns={2}
        renderItem={({ item }) => <ProductCardView product={item} />}
        keyExtractor={(item) => item._id.toString()}
        contentContainerStyle={styles.container}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
};

export default ProductList;
