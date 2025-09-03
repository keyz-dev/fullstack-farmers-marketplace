// screens/CategoriesScreen.js
import React from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useFocusEffect } from "@react-navigation/native";
import { ChevronLeft, ShoppingCart } from "lucide-react-native";

import { useCategories } from "../stateManagement/contexts"; // Adjust path
import { Header, CategoryCard } from "../components"; // Adjust path
import styles from "./styles/categories.style.js";

const CategoriesScreen = () => {
  const navigation = useNavigation();
  const { categories, isLoading, error, fetchAllCategories } = useCategories();

  // Refresh categories when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      fetchAllCategories();
    }, [])
  );

  const renderItem = ({ item }) => (
    <View style={styles.cardContainer}>
      <CategoryCard
        item={item}
        style={{ width: "100%", marginRight: 0 }}
        onPress={() =>
          navigation.navigate("ProductsList", {
            categoryId: item._id,
            categoryName: item.name,
          })
        }
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Custom Header */}
      <Header title="Categories" />

      {/* Categories Grid */}
      {isLoading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#34d399" />
        </View>
      ) : error ? (
        <View style={styles.loaderContainer}>
          <Text style={styles.errorText}>Failed to load categories.</Text>
        </View>
      ) : (
        <FlatList
          data={categories}
          renderItem={renderItem}
          keyExtractor={(item) => item._id}
          numColumns={2} // This creates the two-column grid
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
          columnWrapperStyle={styles.row}
        />
      )}
    </SafeAreaView>
  );
};

export default CategoriesScreen;
