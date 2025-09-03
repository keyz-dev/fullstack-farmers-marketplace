// components/ImagePickerInput.js
import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { UploadCloud } from "lucide-react-native"; // Using a modern icon
import { COLORS, SIZES } from "../constants";

const ImagePickerInput = ({
  imageUri,
  onImageSelect,
  label = "profile picture",
}) => {
  const handlePickImage = async () => {
    // Request permission to access the media library
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Denied",
        "Sorry, we need camera roll permissions to make this work!"
      );
      return;
    }

    // Launch the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
      allowsMultipleSelection: false,
    });

    if (!result.canceled) {
      onImageSelect(result.assets[0].uri);
    }
  };

  return (
    <TouchableOpacity onPress={handlePickImage} style={styles.container}>
      {imageUri ? (
        <Image 
          source={{ uri: imageUri }} 
          style={styles.previewImage}
          onError={(error) => {
            console.error('ImagePickerInput: Image loading error:', error);
          }}
        />
      ) : (
        <View style={styles.placeholder}>
          <UploadCloud color={COLORS.primary} size={40} strokeWidth={1.5} />
          <Text style={styles.placeholderText}>
            Drop or <Text style={styles.uploadText}>Upload</Text>
          </Text>
          <Text style={styles.placeholderSubText}>{label}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 120,
    width: 120,
    borderRadius: SIZES.small,
    borderWidth: 2,
    borderColor: COLORS.lightGray,
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f9fafb",
    alignSelf: "center",
    marginBottom: 10,
    overflow: "hidden",
  },
  placeholder: {
    alignItems: "center",
    justifyContent: "center",
  },
  placeholderText: {
    marginTop: 6,
    fontSize: 14,
    color: COLORS.gray,
    fontWeight: "500",
  },
  uploadText: {
    color: COLORS.primary,
    fontWeight: "bold",
  },
  placeholderSubText: {
    fontSize: 12,
    color: COLORS.gray,
  },
  previewImage: {
    width: "100%",
    height: "100%",
  },
});

export default ImagePickerInput;
