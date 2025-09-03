import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Linking,
} from "react-native";
import styles from "./styles/productDetails.style.js";
import { Ionicons, SimpleLineIcons } from "@expo/vector-icons";
import { COLORS, SIZES } from "../constants";
import { useCart, useFavorites } from "../stateManagement/contexts";

const ProductDetails = ({ route, navigation }) => {
  const { product } = route.params;

  const { addToCart, cartItems, removeFromCart } = useCart();
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();

  const toggleFavorite = () => {
    if (isFavorite(product._id)) {
      removeFromFavorites(product._id);
    } else {
      addToFavorites(product);
    }
  };

  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const addQuantity = () => {
    setQuantity(quantity + 1);
  };
  const reduceQuantity = () => {
    quantity > 1 && setQuantity(quantity - 1);
  };

  const inCart = cartItems.some((item) => item.product._id === product._id);
  const favorite = isFavorite(product._id);

  const iconName = favorite ? "heart" : "heart-outline";
  const cartButtonText = inCart ? "cart" : "cart-outline";

  // Get all available images
  const images = product.images && product.images.length > 0 ? product.images : [];
  const currentImage = images[selectedImageIndex] || null;

  const handleImageSelect = (index) => {
    setSelectedImageIndex(index);
  };

  return (
    <View style={styles.container}>
      <View style={styles.upperRow}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.favoriteIcon}
        >
          <Ionicons name="chevron-back" size={30} />
        </TouchableOpacity>
        <TouchableOpacity onPress={toggleFavorite} style={styles.favoriteIcon}>
          <Ionicons name={iconName} size={30} color={COLORS.primary} />
        </TouchableOpacity>
      </View>
      
      {currentImage ? (
        <Image 
          source={{ uri: currentImage }} 
          style={styles.image}
          onError={(error) => {
            console.error('Product image loading error:', error);
          }}
        />
      ) : (
        <View style={[styles.image, { 
          backgroundColor: '#f0f0f0', 
          justifyContent: 'center', 
          alignItems: 'center' 
        }]}>
          <Ionicons name="image-outline" size={80} color="#999" />
          <Text style={{ color: '#999', marginTop: 10 }}>No Image Available</Text>
        </View>
      )}

      {/* Thumbnail Gallery */}
      {images.length > 1 && (
        <View style={styles.thumbnailContainer}>
          <FlatList
            data={images}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.thumbnailList}
            renderItem={({ item, index }) => (
              <TouchableOpacity
                style={[
                  styles.thumbnail,
                  selectedImageIndex === index && styles.selectedThumbnail
                ]}
                onPress={() => handleImageSelect(index)}
              >
                <Image
                  source={{ uri: item }}
                  style={styles.thumbnailImage}
                  resizeMode="cover"
                  onError={(error) => {
                    console.error('Thumbnail image loading error:', error);
                  }}
                />
                {selectedImageIndex === index && (
                  <View style={styles.selectedIndicator}>
                    <Ionicons name="checkmark-circle" size={16} color={COLORS.primary} />
                  </View>
                )}
              </TouchableOpacity>
            )}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
      )}

      {/* Info section */}
      <ScrollView style={styles.details} showsVerticalScrollIndicator={false}>
        <View style={styles.titleRow}>
          <Text style={styles.name}>{product.name}</Text>
          <View style={styles.priceWrapper}>
            <Text style={styles.price}>${product.price}</Text>
          </View>
        </View>

        <View style={styles.ratingRow}>
          <View style={styles.rating}>
            {[1, 2, 3, 4, 5].map((item) => (
              <Ionicons
                key={item}
                name="star"
                size={20}
                color={item <= product.rating ? "gold" : COLORS.gray2}
              />
            ))}

            <Text style={styles.ratingText}>({product.rating})</Text>
          </View>

          <View style={styles.rating}>
            <TouchableOpacity onPress={addQuantity}>
              <SimpleLineIcons name="plus" size={20} />
            </TouchableOpacity>

            <Text style={styles.ratingText}>{quantity}</Text>

            <TouchableOpacity onPress={reduceQuantity}>
              <SimpleLineIcons name="minus" size={20} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.descriptionWrapper}>
          <Text style={styles.descriptionTitle}>Description</Text>
          <Text style={styles.description}>{product.description}</Text>
        </View>

        {/* Vendor Information */}
        <View style={styles.vendorWrapper}>
          <Text style={styles.vendorTitle}>Vendor Information</Text>
          <View style={styles.vendorCard}>
            <View style={styles.vendorInfo}>
              <View style={styles.vendorAvatar}>
                <Ionicons name="person-circle" size={40} color={COLORS.primary} />
              </View>
              <View style={styles.vendorDetails}>
                <Text style={styles.vendorName}>
                  {product.vendor?.name || product.vendor?.firstName || "Vendor"}
                </Text>
                <Text style={styles.vendorLocation}>
                  <Ionicons name="location-outline" size={14} color={COLORS.gray} />
                  {" "}{product.locationZone || "Location not specified"}
                </Text>
                {product.vendor?.rating && (
                  <View style={styles.vendorRating}>
                    <Ionicons name="star" size={14} color="gold" />
                    <Text style={styles.vendorRatingText}>
                      {product.vendor.rating.toFixed(1)} ({product.vendor.reviewCount || 0} reviews)
                    </Text>
                  </View>
                )}
              </View>
            </View>
            
            {/* Contact Buttons */}
            <View style={styles.contactButtons}>
              {product.vendor?.whatsapp && (
                <TouchableOpacity
                  style={styles.whatsappButton}
                  onPress={() => {
                    const phoneNumber = product.vendor.whatsapp.replace(/\s/g, '');
                    const whatsappUrl = `whatsapp://send?phone=${phoneNumber}&text=Hi! I'm interested in your product: ${product.name}`;
                    Linking.openURL(whatsappUrl);
                  }}
                >
                  <Ionicons name="logo-whatsapp" size={20} color={COLORS.white} />
                  <Text style={styles.whatsappButtonText}>Contact via WhatsApp</Text>
                </TouchableOpacity>
              )}
              
              {product.vendor?.phone && (
                <TouchableOpacity
                  style={styles.callButton}
                  onPress={() => {
                    const phoneNumber = product.vendor.phone.replace(/\s/g, '');
                    Linking.openURL(`tel:${phoneNumber}`);
                  }}
                >
                  <Ionicons name="call" size={20} color={COLORS.white} />
                  <Text style={styles.callButtonText}>Call Vendor</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>

        <View styles={{ marginBottom: SIZES.small }}>
          <View style={styles.location}>
            <Ionicons name="location-outline" size={20} />
            <Text>Yaounde, Cameroon</Text>
          </View>
        </View>
      </ScrollView>

      <TouchableOpacity
        onPress={() => {
          inCart ? removeFromCart(product._id) : addToCart(product);
        }}
        style={!inCart ? styles.addButton : styles.removeButton}
      >
        {inCart ? (
          <Text style={styles.removeButtonText}>Remove from Cart</Text>
        ) : (
          <Text style={styles.addButtonText}>Add to Cart</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default ProductDetails;
