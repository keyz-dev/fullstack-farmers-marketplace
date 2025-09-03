// Step2.jsx
import React, { useState } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { LocateFixed } from "lucide-react-native";
import styles from "../../../screens/auth/styles/farmer.style.js";
import { PickerInput, Input } from "../../index.js";
import { COLORS } from "../../../constants";
import { locationZones } from "../../../constants/farmer_auth.js";
import { useCurrentLocation } from "../../../utils/useCurrentLocation";
import { Alert } from "react-native";

const Step2 = ({ formik }) => {
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [showUseLocation, setShowUseLocation] = useState(false);
  const [isLoadingShopLocation, setIsLoadingShopLocation] = useState(false);
  const [showUseShopLocation, setShowUseShopLocation] = useState(false);

  const handleUseCurrentLocation = async (field, setIsLoading, setShowUse) => {
    try {
      const { formattedAddress, latitude, longitude } =
        await useCurrentLocation(setShowUse, setIsLoading);
      formik.setFieldValue(field, formattedAddress);
      formik.setFieldValue(`${field}Coordinates`, {
        lat: latitude,
        lng: longitude,
      });
    } catch (error) {
      Alert.alert(
        "Error",
        "Could not fetch location. Please check your network and location settings."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Location Information</Text>

      {/* Address Input with "Use Current Location" feature */}
      <View style={{ position: "relative" }}>
        <Input
          label="Address"
          placeholder="Enter your complete address"
          materialIconName="map-marker-outline"
          onChangeText={formik.handleChange("address")}
          onBlur={() => setTimeout(() => setShowUseLocation(false), 200)} // Hide button on blur
          onFocus={() => setShowUseLocation(true)} // Show button on focus
          value={formik.values.address}
          touched={formik.touched.address}
          errors={formik.errors.address}
          inputStyles={{ height: 80 }}
          multiline
        />
        {showUseLocation && (
          <TouchableOpacity
            onPress={() =>
              handleUseCurrentLocation(
                "address",
                setIsLoadingLocation,
                setShowUseLocation
              )
            }
            style={styles.useLocationButton}
          >
            <LocateFixed color={COLORS.primary} size={18} />
            <Text style={styles.useLocationText}>Use current location</Text>
          </TouchableOpacity>
        )}
      </View>
      {isLoadingLocation && (
        <ActivityIndicator
          size="large"
          color={COLORS.primary}
          style={{ marginVertical: 10 }}
        />
      )}

      <View style={{ position: "relative" }}>
        <Input
          label="Shop Address"
          placeholder="Enter your complete address of your shop"
          materialIconName="map-marker-outline"
          onChangeText={formik.handleChange("shopAddress")}
          onBlur={() => setTimeout(() => setShowUseShopLocation(false), 200)} // Hide button on blur
          onFocus={() => setShowUseShopLocation(true)} // Show button on focus
          value={formik.values.shopAddress}
          touched={formik.touched.shopAddress}
          errors={formik.errors.shopAddress}
          inputStyles={{ height: 80 }}
          multiline
        />
        {showUseShopLocation && (
          <TouchableOpacity
            onPress={() =>
              handleUseCurrentLocation(
                "shopAddress",
                setIsLoadingShopLocation,
                setShowUseShopLocation
              )
            }
            style={styles.useLocationButton}
          >
            <LocateFixed color={COLORS.primary} size={18} />
            <Text style={styles.useLocationText}>Use current location</Text>
          </TouchableOpacity>
        )}
      </View>

      {isLoadingShopLocation && (
        <ActivityIndicator
          size="large"
          color={COLORS.primary}
          style={{ marginVertical: 10 }}
        />
      )}

      <PickerInput
        label="Location Zone"
        selectedValue={formik.values.locationZone}
        onValueChange={(value) => formik.setFieldValue("locationZone", value)}
        items={locationZones}
        touched={formik.touched.locationZone}
        errors={formik.errors.locationZone}
        materialIconName="map-outline"
      />
    </View>
  );
};

export default Step2;
