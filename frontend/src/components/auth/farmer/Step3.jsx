import React, { useRef, useState, useEffect } from "react";
import { View, Text, TextInput } from "react-native";
import { Input } from "../../index.js";
import { produceOptions } from "../../../constants/farmer_auth";
import Slider from "@react-native-community/slider";
import MapView, { Marker } from "react-native-maps";
import { TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { COLORS, SIZES } from "../../../constants";
import styles from "../../../screens/auth/styles/farmer.style.js";
import { Crosshair, Nature } from "lucide-react-native";

const Step3 = ({ formik }) => {
  const mapRef = useRef(null);

  // State to manage the map's visible area for a better UX
  const [mapRegion, setMapRegion] = useState({
    latitude: formik.values.shopCoordinates.lat || 6.369, // Default to Cameroon if no coords yet
    longitude: formik.values.shopCoordinates.lng || 9.9693,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  // Function to re-center the map on the marker
  const goToMarker = () => {
    mapRef.current.animateToRegion(
      {
        ...formik.values.shopCoordinates,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      },
      1000
    ); // Animate over 1 second
  };

  // Update map region when coordinates change from another source (like dragging)
  useEffect(() => {
    setMapRegion((prev) => ({
      ...prev,
      latitude: formik.values.shopCoordinates.lat,
      longitude: formik.values.shopCoordinates.lng,
    }));
  }, [formik.values.shopCoordinates]);

  return (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Farm Details</Text>

      <Input
        label="Farm Name"
        placeholder="Enter your farm name"
        materialIconName="nature"
        onChangeText={formik.handleChange("farmName")}
        onBlur={formik.handleBlur("farmName")}
        value={formik.values.farmName}
        touched={formik.touched.farmName}
        errors={formik.errors.farmName}
      />

      <Input
        label="Website URL (Optional)"
        placeholder="https://yourfarm.com"
        materialIconName="web"
        onChangeText={formik.handleChange("websiteURL")}
        onBlur={formik.handleBlur("websiteURL")}
        value={formik.values.websiteURL}
        touched={formik.touched.websiteURL}
        errors={formik.errors.websiteURL}
        keyboardType="url"
      />

      <View style={styles.inputWrapper}>
        <Text
          style={{
            fontFamily: "regular",
            fontSize: SIZES.small,
            marginBottom: 5,
            marginEnd: 5,
            textAlign: "right",
          }}
        >
          Shop Description
        </Text>
        <TextInput
          style={styles.textArea}
          placeholder="Describe your farm and what you offer..."
          multiline
          numberOfLines={4}
          onChangeText={formik.handleChange("shopDescription")}
          onBlur={formik.handleBlur("shopDescription")}
          value={formik.values.shopDescription}
        />
      </View>

      <View style={styles.inputWrapper}>
        <Text style={styles.label}>Produce Types</Text>
        <View style={styles.checkboxContainer}>
          {produceOptions.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={styles.checkboxItem}
              onPress={() => {
                const currentTypes = formik.values.produceTypes || [];
                const newTypes = currentTypes.includes(option.value)
                  ? currentTypes.filter((type) => type !== option.value)
                  : [...currentTypes, option.value];
                formik.setFieldValue("produceTypes", newTypes);
              }}
            >
              <MaterialCommunityIcons
                name={
                  formik.values.produceTypes?.includes(option.value)
                    ? "checkbox-marked"
                    : "checkbox-blank-outline"
                }
                size={24}
                color={COLORS.primary}
              />
              <Text style={styles.checkboxLabel}>{option.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.inputWrapper}>
        <Text style={styles.label}>
          Delivery Radius: {formik.values.deliveryRadiusKm} km
        </Text>
        <View style={styles.sliderContainer}>
          <Text style={styles.sliderLabel}>1 km</Text>
          <Slider
            style={styles.slider}
            minimumValue={1}
            maximumValue={50}
            value={formik.values.deliveryRadiusKm}
            onValueChange={(value) =>
              formik.setFieldValue("deliveryRadiusKm", Math.round(value))
            }
            minimumTrackTintColor={COLORS.primary}
            maximumTrackTintColor={COLORS.lightGray}
            thumbStyle={{ backgroundColor: COLORS.primary }}
          />
          <Text style={styles.sliderLabel}>50 km</Text>
        </View>
      </View>

      <View style={styles.mapWrapper}>
        <View style={styles.mapHeader}>
          <Text style={styles.label}>Shop Location</Text>
          <TouchableOpacity onPress={goToMarker} style={styles.recenterButton}>
            <Crosshair color={COLORS.primary} size={18} />
            <Text style={styles.recenterText}>Center on Pin</Text>
          </TouchableOpacity>
        </View>
        <MapView
          ref={mapRef}
          style={styles.map}
          region={mapRegion} // Use state for the region
          onRegionChangeComplete={setMapRegion} // Update region when user pans/zooms
          onPress={(event) => {
            // Allow tapping to set location
            const { latitude, longitude } = event.nativeEvent.coordinate;
            formik.setFieldValue("shopCoordinates", {
              lat: latitude,
              lng: longitude,
            });
          }}
        >
          <Marker
            coordinate={{
              latitude: formik.values.shopCoordinates.lat,
              longitude: formik.values.shopCoordinates.lng,
            }}
            title="Your Shop Location"
            draggable
            onDragEnd={(event) => {
              // Update on drag
              const { latitude, longitude } = event.nativeEvent.coordinate;
              formik.setFieldValue("shopCoordinates", {
                lat: latitude,
                lng: longitude,
              });
            }}
          />
        </MapView>
      </View>
    </View>
  );
};

export default Step3;
