import { View, Text } from "react-native";
import React from "react";
import styles from "./styles/product-card.style";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../../constants";
import { TouchableOpacity } from "react-native";
import { Image } from "react-native";

const ProductCard = ({ product, onUpdate, onDelete }) => (
  <View style={styles.productCard}>
    <View style={styles.productImageContainer}>
      {product.images && product.images.length > 0 ? (
        <Image
          source={{ uri: product.images[0] }}
          style={styles.productImage}
          resizeMode="cover"
          onError={(error) => {
            console.error('Product image loading error:', error);
          }}
        />
      ) : (
        <View style={styles.noImageContainer}>
          <Ionicons name="image-outline" size={40} color={COLORS.gray} />
        </View>
      )}
      <View style={styles.stockBadge}>
        <Text
          style={[
            styles.stockText,
            { color: product.stock > 0 ? COLORS.success : COLORS.error },
          ]}
        >
          {product.stock > 0
            ? `${product.stock} ${product.unit}`
            : "Out of Stock"}
        </Text>
      </View>
    </View>

    <View style={styles.productInfo}>
      <Text style={styles.productName} numberOfLines={2}>
        {product.name}
      </Text>
      <Text style={styles.productCategory}>
        {product.category?.name || "No Category"}
      </Text>
      <Text style={styles.productPrice}>
        ${product.price.toFixed(2)}/{product.unit}
      </Text>

      <View style={styles.productStats}>
        <View style={styles.ratingContainer}>
          <Ionicons name="star" size={14} color={COLORS.warning} />
          <Text style={styles.ratingText}>{product.rating.toFixed(1)}</Text>
        </View>
        <Text style={styles.productDate}>
          Added {new Date(product.createdAt).toLocaleDateString()}
        </Text>
      </View>
    </View>

    <View style={styles.productActions}>
      <TouchableOpacity
        style={[styles.actionButton, styles.editButton]}
        onPress={() => onUpdate(product)}
      >
        <Ionicons name="pencil" size={16} color={COLORS.white} />
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.actionButton, styles.deleteButton]}
        onPress={() => onDelete(product._id)}
      >
        <Ionicons name="trash" size={16} color={COLORS.white} />
      </TouchableOpacity>
    </View>
  </View>
);

export default ProductCard;
