import { Text, View, TouchableOpacity, Image } from "react-native";
import React from "react";
import styles from "./styles/searchTile.style.js";
import { useNavigation } from "@react-navigation/native";

const SearchTile = ({ product }) => {
  const navigation = useNavigation();
  const imageUrl = product.images[0].url;
  const productCategory = product.category.name;
  return (
    <View>
      <TouchableOpacity
        style={styles.container}
        onPress={() => navigation.navigate("ProductDetails", { product })}
      >
        <View style={styles.image}>
          <Image source={{ uri: imageUrl }} style={styles.productImg} />
        </View>

        <View style={styles.textContainer}>
          <Text style={styles.productTitle}>{product.name}</Text>
          <Text style={styles.category}>{productCategory}</Text>
          <Text style={styles.category}>$ {product.price}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default SearchTile;
