import { View, Text, TouchableOpacity, Image } from "react-native";
import React, { useState } from "react";
import styles from "./styles/productCardView.style.js";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../../constants";
import { useNavigation } from "@react-navigation/native";
import { useCart, useFavorites } from "../../stateManagement/contexts";

const ProductCardView = ({ product }) => {
  const { addToCart, cartItems, removeFromCart } = useCart();
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();

  const toggleFavorite = () => {
    if (isFavorite(product._id)) {
      removeFromFavorites(product._id);
    } else {
      addToFavorites(product);
    }
  };

  console.log("\n\nproduct\n\n", product);

  const inCart = cartItems.some((item) => item.product._id === product._id);
  const favorite = isFavorite(product._id);

  const iconName = favorite ? "heart" : "heart-outline";
  const cartIconName = inCart ? "cart" : "cart-outline";

  const image = product.images && product.images.length > 0 ? product.images[0] : null;

  const navigation = useNavigation();
  const handlePress = () => {
    navigation.navigate("ProductDetails", { product });
  };

  return (
    <TouchableOpacity onPress={handlePress}>
      <View style={styles.container}>
        <View style={styles.imageContainer}>
          {image ? (
            <Image
              source={{ uri: image }}
              resizeMode="cover"
              style={{ aspectRatio: 1 }}
              onError={(error) => {
                console.error('Image loading error:', error);
              }}
            />
          ) : (
            <View style={{ 
              aspectRatio: 1, 
              backgroundColor: '#f0f0f0', 
              justifyContent: 'center', 
              alignItems: 'center' 
            }}>
              <Ionicons name="image-outline" size={40} color="#999" />
            </View>
          )}
          <TouchableOpacity
            onPress={toggleFavorite}
            style={styles.favoriteIcon}
          >
            <Ionicons name={iconName} size={26} color={COLORS.primary} />
          </TouchableOpacity>
        </View>

        <View style={styles.details}>
          <Text style={styles.productName} numberOfLines={1}>
            {product.name}
          </Text>
          <View style={styles.productDetails}>
            <Text style={styles.productPrice}>${product.price}</Text>
            <TouchableOpacity
              onPress={() => {
                inCart ? removeFromCart(product._id) : addToCart(product);
              }}
            >
              <Ionicons name={cartIconName} size={28} color={COLORS.primary} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ProductCardView;
