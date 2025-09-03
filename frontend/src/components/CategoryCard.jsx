// components/CategoryCard.js
import React from "react";
import { TouchableOpacity, Text, Image, StyleSheet, View } from "react-native";

const CategoryCard = ({ item, onPress, style }) => {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.container, style]}>
      <Image
        source={{ uri: item.image }}
        style={styles.image}
        resizeMode="cover"
      />
      <Text style={styles.name}>{item.name}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#e0f2e9", // Light green background
    borderRadius: 20,
    padding: 10,
    height: 150,
    width: 150, // Fixed size for the home screen version
    marginRight: 12,
  },
  image: {
    width: "100%",
    height: "80%",
    borderRadius: 10,
    marginBottom: 8,
  },
  name: {
    fontSize: 12,
    fontFamily: "bold",
    color: "#333",
    textAlign: "center",
  },
});

export default CategoryCard;
