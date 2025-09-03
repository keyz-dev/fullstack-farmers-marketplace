import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const FavoritesTile = ({ product, onRemove }) => {
  return (
    <View style={styles.container}>
      <Image
        source={{ uri: product.images?.[0]?.url || "https://www.aaronfaber.com/wp-content/uploads/2017/03/product-placeholder-wp.jpg" }}
        style={styles.image}
      />
      <View style={styles.details}>
        <Text style={styles.name}>{product.name}</Text>
        <Text style={styles.price}>${product.price.toFixed(2)}</Text>
      </View>
      <TouchableOpacity onPress={() => onRemove(product._id)} style={styles.removeBtn}>
        <Ionicons name="trash-outline" size={24} color="red" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flexDirection: 'row', padding: 10, alignItems: 'center', borderBottomWidth: 1, borderColor: '#ccc' },
  image: { width: 80, height: 80, borderRadius: 8 },
  details: { flex: 1, marginLeft: 10 },
  name: { fontSize: 16, fontFamily: 'bold' },
  price: { fontSize: 14, color: '#888', fontFamily: 'regular', marginTop: 4 },
  removeBtn: { padding: 8 },
});

export default FavoritesTile;
