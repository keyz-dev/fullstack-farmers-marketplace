import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Switch,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { COLORS } from "../../constants";
import { useAuth } from "../../stateManagement/contexts/AuthContext";
import styles from "./styles/add-product.style";
import { useCategories } from "../../stateManagement/contexts/CategoryContext";
import { useProducts } from "../../stateManagement/contexts/ProductContext";
import { ImagePickerInput } from "../../components";

const AddProductForm = ({ navigation, route }) => {
  const {
    categories,
    fetchAllCategories,
    loading: categoriesLoading,
    error: categoriesError,
  } = useCategories();
  const { user } = useAuth();
  const {
    createProduct,
    updateProduct,
    loading: productsLoading,
    error: productsError,
  } = useProducts();

  const isEditing = route?.params?.product;
  const existingProduct = route?.params?.product;

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    unit: "kg",
    category: "",
    isDeliverable: true,
    deliveryRadiusKm: user?.deliveryRadiusKm?.toString() || "10",
    locationZone: user?.locationZone || "",
  });

  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const unitOptions = [
    "kg",
    "g",
    "pieces",
    "dozen",
    "liters",
    "ml",
    "bunches",
    "bags",
  ];

  useEffect(() => {
    let isMounted = true;
    
    const initializeForm = async () => {
      try {
        if (isMounted) {
          await fetchAllCategories();
          if (isEditing && existingProduct) {
            populateFormForEditing();
          }
        }
      } catch (error) {
        console.error('AddProductForm: Error in useEffect:', error);
      }
    };

    initializeForm();

    return () => {
      isMounted = false;
    };
  }, []);

  // Add a useEffect to track images state changes
  useEffect(() => {
    // Track images state changes if needed
  }, [images]);

  const populateFormForEditing = () => {
    setFormData({
      name: existingProduct.name || "",
      description: existingProduct.description || "",
      price: existingProduct.price?.toString() || "",
      stock: existingProduct.stock?.toString() || "",
      unit: existingProduct.unit || "kg",
      category: existingProduct.category?._id || "",
      isDeliverable: existingProduct.isDeliverable ?? true,
      deliveryRadiusKm: existingProduct.deliveryRadiusKm?.toString() || "10",
      locationZone: existingProduct.locationZone || "",
    });

    // Set existing images (you might need to handle this based on your image storage)
    if (existingProduct.images && existingProduct.images.length > 0) {
      setImages(
        existingProduct.images.map((img) => ({ uri: img, isExisting: true }))
      );
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Product name is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Product description is required";
    }

    if (!formData.price || parseFloat(formData.price) <= 0) {
      newErrors.price = "Please enter a valid price";
    }

    if (!formData.stock || parseInt(formData.stock) < 0) {
      newErrors.stock = "Please enter a valid stock quantity";
    }

    if (!formData.category) {
      newErrors.category = "Please select a category";
    }

    if (
      formData.deliveryRadiusKm &&
      parseFloat(formData.deliveryRadiusKm) < 0
    ) {
      newErrors.deliveryRadiusKm = "Delivery radius must be positive";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const removeImage = (index) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      Alert.alert("Validation Error", "Please fix the errors and try again");
      return;
    }

    // Check if at least one image is selected
    if (images.length === 0) {
      Alert.alert("Image Required", "Please add at least one product image");
      return;
    }

    setLoading(true);
    // format the images

    try {
      const submitData = new FormData();

      // Add form data
      Object.keys(formData).forEach((key) => {
        if (formData[key] !== undefined && formData[key] !== null && key !== "images") {
          submitData.append(key, formData[key]);
        }
      });

      // Add new images
      images.forEach((image, index) => {
        if (image.isNew) {
          // Handle image file with better validation - similar to avatar handling
          const filename = image.uri.split("/").pop();
          const match = /\.(\w+)$/.exec(filename);
          const type = match ? `image/${match[1]}` : "image/jpeg";

          const imageFile = {
            uri: image.uri,
            type: type,
            name: filename,
          };

          submitData.append("productImages", imageFile);
        }
      });

      let result;
      if (isEditing) {
        result = await updateProduct(existingProduct._id, submitData);
      } else {
        result = await createProduct(submitData);
      }

      Alert.alert(
        "Success",
        `Product ${isEditing ? "updated" : "added"} successfully!`,
        [
          {
            text: "OK",
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error) {
      console.error("Error submitting product:", error);
      Alert.alert(
        "Error",
        error.message || `Failed to ${isEditing ? "update" : "add"} product. Please try again.`
      );
    } finally {
      setLoading(false);
    }
  };

  const handleAddImage = (uri) => {
    try {
      // Simple state update without complex logic
      const newImage = { uri, isNew: true };
      setImages(prevImages => {
        const updated = [...prevImages, newImage];
        return updated;
      });
    } catch (error) {
      console.error('Error in handleAddImage:', error);
    }
  };

  const updateFormData = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  return (
    <KeyboardAwareScrollView
      style={styles.container}
      enableOnAndroid={true}
      extraScrollHeight={20}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {isEditing ? "Edit Product" : "Add New Product"}
          </Text>
          <View style={styles.placeholder} />
        </View>

        <View style={styles.formContainer}>
          {/* Product Images */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Product Images</Text>
            <Text style={styles.sectionSubtitle}>
              Add up to 5 high-quality images
            </Text>

            {/* File Picker at the top */}
            {images.length < 5 && (
              <View style={styles.imagePickerContainer}>
                <ImagePickerInput
                  imageUri={null}
                  onImageSelect={handleAddImage}
                  label="Add Image"
                />
              </View>
            )}

            {/* Image Previews at the bottom */}
            {images.length > 0 && (
              <View style={styles.imagePreviewSection}>
                <Text style={styles.previewTitle}>Selected Images ({images.length}/5)</Text>
                <View style={styles.imageGrid}>
                  {images.map((image, index) => (
                    <View key={index} style={styles.imagePreviewCard}>
                      <Image
                        source={{ uri: image.uri }}
                        style={styles.imagePreview}
                        resizeMode="cover"
                        onError={(error) => {
                          console.error('Image loading error:', error);
                        }}
                      />
                      <TouchableOpacity
                        style={styles.removeImageButton}
                        onPress={() => removeImage(index)}
                      >
                        <Ionicons
                          name="close-circle"
                          size={20}
                          color={COLORS.error}
                        />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </View>

          {/* Basic Info */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Basic Information</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Product Name *</Text>
              <TextInput
                style={[styles.textInput, errors.name && styles.inputError]}
                value={formData.name}
                onChangeText={(value) => updateFormData("name", value)}
                placeholder="Enter product name"
                placeholderTextColor={COLORS.gray}
              />
              {errors.name && (
                <Text style={styles.errorText}>{errors.name}</Text>
              )}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Description *</Text>
              <TextInput
                style={[
                  styles.textArea,
                  errors.description && styles.inputError,
                ]}
                value={formData.description}
                onChangeText={(value) => updateFormData("description", value)}
                placeholder="Describe your product..."
                placeholderTextColor={COLORS.gray}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
              {errors.description && (
                <Text style={styles.errorText}>{errors.description}</Text>
              )}
            </View>

            <View style={styles.row}>
              <View
                style={[styles.inputGroup, styles.flex1, styles.marginRight]}
              >
                <Text style={styles.inputLabel}>Price *</Text>
                <TextInput
                  style={[styles.textInput, errors.price && styles.inputError]}
                  value={formData.price}
                  onChangeText={(value) => updateFormData("price", value)}
                  placeholder="0.00"
                  placeholderTextColor={COLORS.gray}
                  keyboardType="numeric"
                />
                {errors.price && (
                  <Text style={styles.errorText}>{errors.price}</Text>
                )}
              </View>

              <View style={[styles.inputGroup, styles.flex1]}>
                <Text style={styles.inputLabel}>Stock Quantity *</Text>
                <TextInput
                  style={[styles.textInput, errors.stock && styles.inputError]}
                  value={formData.stock}
                  onChangeText={(value) => updateFormData("stock", value)}
                  placeholder="0"
                  placeholderTextColor={COLORS.gray}
                  keyboardType="numeric"
                />
                {errors.stock && (
                  <Text style={styles.errorText}>{errors.stock}</Text>
                )}
              </View>
            </View>

            <View style={styles.row}>
              <View
                style={[styles.inputGroup, styles.flex1, styles.marginRight]}
              >
                <Text style={styles.inputLabel}>Unit</Text>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={formData.unit}
                    onValueChange={(value) => updateFormData("unit", value)}
                    style={styles.picker}
                  >
                    {unitOptions.map((unit) => (
                      <Picker.Item key={unit} label={unit} value={unit} />
                    ))}
                  </Picker>
                </View>
              </View>

              <View style={[styles.inputGroup, styles.flex1]}>
                <Text style={styles.inputLabel}>Category *</Text>
                <View
                  style={[
                    styles.pickerContainer,
                    errors.category && styles.inputError,
                  ]}
                >
                  {categoriesLoading ? (
                    <ActivityIndicator size="small" color={COLORS.primary} />
                  ) : (
                    <Picker
                      selectedValue={formData.category}
                      onValueChange={(value) =>
                        updateFormData("category", value)
                      }
                      style={styles.picker}
                    >
                      <Picker.Item label="Select Category" value="" />
                      {categories.map((category) => (
                        <Picker.Item
                          key={category._id}
                          label={category.name}
                          value={category._id}
                        />
                      ))}
                    </Picker>
                  )}
                </View>
                {errors.category && (
                  <Text style={styles.errorText}>{errors.category}</Text>
                )}
              </View>
            </View>
          </View>

          {/* Delivery Options */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Delivery Options</Text>

            <View style={styles.switchRow}>
              <Text style={styles.switchLabel}>Offer Delivery</Text>
              <Switch
                value={formData.isDeliverable}
                onValueChange={(value) =>
                  updateFormData("isDeliverable", value)
                }
                trackColor={{ false: COLORS.gray2, true: COLORS.primary }}
                thumbColor={formData.isDeliverable ? COLORS.white : COLORS.gray}
              />
            </View>

            {formData.isDeliverable && (
              <>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Delivery Radius (km)</Text>
                  <TextInput
                    style={[
                      styles.textInput,
                      errors.deliveryRadiusKm && styles.inputError,
                    ]}
                    value={formData.deliveryRadiusKm}
                    onChangeText={(value) =>
                      updateFormData("deliveryRadiusKm", value)
                    }
                    placeholder="10"
                    placeholderTextColor={COLORS.gray}
                    keyboardType="numeric"
                  />
                  {errors.deliveryRadiusKm && (
                    <Text style={styles.errorText}>
                      {errors.deliveryRadiusKm}
                    </Text>
                  )}
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Location Zone</Text>
                  <TextInput
                    style={styles.textInput}
                    value={formData.locationZone}
                    onChangeText={(value) =>
                      updateFormData("locationZone", value)
                    }
                    placeholder="e.g., Downtown, North District"
                    placeholderTextColor={COLORS.gray}
                  />
                </View>
              </>
            )}
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            style={[
              styles.submitButton,
              loading && styles.submitButtonDisabled,
            ]}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color={COLORS.white} />
            ) : (
              <>
                <Ionicons
                  name={isEditing ? "checkmark" : "add"}
                  size={20}
                  color={COLORS.white}
                />
                <Text style={styles.submitButtonText}>
                  {isEditing ? "Update Product" : "Add Product"}
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAwareScrollView>
  );
};

export default AddProductForm;
