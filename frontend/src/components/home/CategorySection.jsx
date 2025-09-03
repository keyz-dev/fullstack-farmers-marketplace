// components/home/HomeCategories.js
import React, { useMemo } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useCategories } from "../../stateManagement/contexts";
import CategoryCard from "../CategoryCard";

// Helper function to shuffle an array (Fisher-Yates shuffle)
const shuffleArray = (array) => {
  if (array.length === 0) return [];
  let currentIndex = array.length,
    randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }
  return array;
};

const CategorySection = () => {
  const navigation = useNavigation();
  const { categories, loading, error } = useCategories();

  // Memoize the random categories so they don't change on every re-render
  const randomCategories = useMemo(() => {
    if (categories.length > 0 && !loading) {
      return shuffleArray([...categories]).slice(0, 4);
    }
    return [];
  }, [categories, loading]);

  const renderItem = ({ item }) => (
    <CategoryCard
      item={item}
      onPress={() =>
        navigation.navigate("ProductsList", {
          categoryId: item._id,
          categoryName: item.name,
        })
      }
    />
  );

  if (error) {
    return <Text style={styles.errorText}>Failed to load categories.</Text>;
  }

  return (
    <View style={styles.container}>
      {/* Section Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Categories</Text>
        <TouchableOpacity onPress={() => navigation.navigate("Categories")}>
          <Text style={styles.seeAll}>See all</Text>
        </TouchableOpacity>
      </View>

      {/* Categories List */}
      {loading ? (
        <ActivityIndicator
          size="large"
          color="#34d399"
          style={{ height: 100 }}
        />
      ) : (
        <FlatList
          data={randomCategories}
          renderItem={renderItem}
          keyExtractor={(item) => item._id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
    paddingLeft: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingRight: 16,
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1f2937",
  },
  seeAll: {
    fontSize: 14,
    fontWeight: "600",
    color: "#34d399", // A nice green color
  },
  listContainer: {
    paddingRight: 16,
  },
  errorText: {
    textAlign: "center",
    color: "red",
    marginVertical: 20,
  },
});

export default CategorySection;
