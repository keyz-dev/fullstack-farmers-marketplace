import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../../constants';

const CartTile = ({ item, onRemove, onQuantityChange }) => {
  const { product, quantity } = item;

  const placeholderAddress = "https://www.aaronfaber.com/wp-content/uploads/2017/03/product-placeholder-wp.jpg";

  const productImage = product.images && product.images.length > 0 ? product.images[0] : placeholderAddress;
  const productName = product?.name || "Unknown Product";
  const productPrice = product?.price || 0;

  return (
    <View style={styles.container}>
      <Image 
        source={{ uri: productImage }} 
        style={styles.image}
        onError={(error) => console.error('Cart item image loading error:', error)}
      />
      <View style={styles.details}>
        <Text style={styles.name} numberOfLines={2}>{productName}</Text>
        <Text style={styles.price}>${productPrice.toFixed(2)}</Text>
        <View style={styles.quantityContainer}>
          <TouchableOpacity 
            onPress={() => onQuantityChange(product._id, quantity - 1)}
            disabled={quantity <= 1}
            style={styles.quantityButton}
          >
            <Ionicons 
              name="remove" 
              size={18} 
              color={quantity <= 1 ? COLORS.gray2 : COLORS.black} 
            />
          </TouchableOpacity>
          <Text style={styles.quantity}>{quantity}</Text>
          <TouchableOpacity 
            onPress={() => onQuantityChange(product._id, quantity + 1)}
            style={styles.quantityButton}
          >
            <Ionicons name="add" size={18} color={COLORS.black} />
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity onPress={() => onRemove(product._id)} style={styles.removeBtn}>
        <Ionicons name="trash-outline" size={22} color={COLORS.error} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.medium,
    padding: SIZES.small,
    marginBottom: SIZES.small,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: SIZES.small,
  },
  details: {
    flex: 1,
    marginLeft: SIZES.medium,
    justifyContent: 'space-between',
  },
  name: {
    fontFamily: 'semibold',
    fontSize: SIZES.medium,
    color: COLORS.black,
    marginBottom: 4,
  },
  price: {
    fontFamily: 'bold',
    fontSize: SIZES.medium,
    color: COLORS.primary,
    marginVertical: SIZES.xSmall,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SIZES.xSmall,
  },
  quantityButton: {
    backgroundColor: COLORS.lightWhite,
    borderRadius: 50,
    padding: SIZES.xSmall,
    borderWidth: 1,
    borderColor: COLORS.gray2,
  },
  quantity: {
    marginHorizontal: SIZES.medium,
    fontFamily: 'bold',
    fontSize: SIZES.medium,
  },
  removeBtn: {
    padding: SIZES.xSmall,
    marginLeft: SIZES.small,
  },
});

export default CartTile;
