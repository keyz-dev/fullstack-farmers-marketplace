import {
  View,
  Text,
  FlatList,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import React from "react";
import styles from "./styles/productRow.style.js";
import { COLORS, SIZES } from "../../constants";
import ProductCardView from "./ProductCardView";
import { Loader } from "../index";
import { useProducts } from "../../stateManagement/contexts";

const ProductRow = () => {
  const { bestSellers, loading, error } = useProducts();

  // Check if products exist and are valid
  const hasProducts = bestSellers && bestSellers.length > 0;

  return (
    <View style={styles.container}>
      {loading ? (
        <Loader />
      ) : error ? (
        <Text style={{ color: 'red', textAlign: 'center', padding: 20 }}>
          {error.toString()}
        </Text>
      ) : !hasProducts ? (
        <Text style={{ textAlign: 'center', padding: 20, color: '#666' }}>
          No products available
        </Text>
      ) : (
        <FlatList
          data={bestSellers}
          renderItem={({ item }) => <ProductCardView product={item} />}
          keyExtractor={(item) => item._id?.toString() || Math.random().toString()}
          numColumns={2}
          contentContainerStyle={{
            paddingHorizontal: 10,
            paddingBottom: 120,
            paddingTop: SIZES.medium,
          }}
          columnWrapperStyle={{
            gap: SIZES.medium, // Replaces columnGap
          }}
          ItemSeparatorComponent={() => (
            <View style={{ height: SIZES.medium }} />
          )} // This replaces rowGap
        />
      )}
    </View>
  );
};

export default ProductRow;
