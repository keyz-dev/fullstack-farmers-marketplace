import React, { useState } from "react";
// CORRECTED LINE: Added Platform to the import list
import {
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useAuth } from "../../stateManagement/contexts";
import { useNavigation } from "@react-navigation/native";
import styles from "./styles/register.style.js";
import { Button, Input } from "../../components";
import { PickerInput, ImagePickerInput } from "../../components";
import { Formik } from "formik";
import * as Yup from "yup";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { SIZES, COLORS } from "../../constants";
import { LocateFixed } from "lucide-react-native";
import { useCurrentLocation } from "../../utils/useCurrentLocation";
import { handleClientSignUp } from "../../utils/handleClientRegister";

const SignUpSchema = Yup.object().shape({
  name: Yup.string()
    .min(3, "Name must be at least 3 characters")
    .required("Name is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  phone: Yup.string()
    .min(9, "Invalid phone number")
    .required("Phone number is required"),
  address: Yup.string().required("Address is required"),
  whatsapp: Yup.string()
    .min(9, "Invalid whatsapp number")
    .required("Whatsapp number is required"),
  dob: Yup.date().required("Date of birth is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Confirm password is required"),
  gender: Yup.string().oneOf(["male", "female"]).required("Gender is required"),
  addressCoordinates: Yup.object().nullable(),
  avatar: Yup.string().nullable(),
});

const ClientRegister = () => {
  const [obsecureText, setObsecureText] = useState(true);
  const navigation = useNavigation();
  const { register, loading } = useAuth();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [showUseLocation, setShowUseLocation] = useState(false);

  const handleUseCurrentLocation = async (setFieldValue) => {
    try {
      const { formattedAddress, latitude, longitude } =
        await useCurrentLocation(setShowUseLocation, setIsLoadingLocation);
      setFieldValue("address", formattedAddress);
      setFieldValue("addressCoordinates", {
        lat: latitude,
        lng: longitude,
      });
    } catch (error) {
      Alert.alert(
        "Error",
        "Could not fetch location. Please check your network and location settings."
      );
    }
  };

  const handleSubmit = async (values) => {
    await handleClientSignUp(values, register);
  };

  return (
    <KeyboardAvoidingView
      style={{
        flex: 1,
        justifyContent: "center",
        backgroundColor: COLORS.lightWhite,
      }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      {/* ScrollView makes the content scrollable */}
      <Text style={styles.title}>Create Your Account</Text>

      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Formik
          initialValues={{
            name: "",
            email: "",
            phone: "",
            address: "",
            whatsapp: "",
            dob: "",
            password: "",
            confirmPassword: "",
            gender: "",
            avatar: null,
            addressCoordinates: null,
          }}
          validationSchema={SignUpSchema}
          onSubmit={handleSubmit}
        >
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            errors,
            isValid,
            touched,
            setFieldValue,
          }) => (
            // This View is now inside the ScrollView
            <View>
              <ImagePickerInput
                imageUri={values.avatar}
                onImageSelect={(uri) => setFieldValue("avatar", uri)}
              />

              <Input
                label="Full Name"
                placeholder="Enter your full name"
                materialIconName="account-outline"
                onChangeText={handleChange("name")}
                onBlur={handleBlur("name")}
                value={values.name}
                touched={touched.name}
                errors={errors.name}
              />
              <Input
                label="Email"
                placeholder="Enter your email"
                materialIconName="email-outline"
                onChangeText={handleChange("email")}
                onBlur={handleBlur("email")}
                value={values.email}
                touched={touched.email}
                errors={errors.email}
              />
              <Input
                label="Phone Number"
                placeholder="Enter your phone number"
                materialIconName="phone-outline"
                onChangeText={handleChange("phone")}
                onBlur={handleBlur("phone")}
                value={values.phone}
                keyboardType="numeric"
                touched={touched.phone}
                errors={errors.phone}
              />
              <Input
                label="Whatsapp Number"
                placeholder="Enter your whatsapp number"
                materialIconName="whatsapp"
                onChangeText={handleChange("whatsapp")}
                onBlur={handleBlur("whatsapp")}
                value={values.whatsapp}
                keyboardType="numeric"
                touched={touched.whatsapp}
                errors={errors.whatsapp}
              />
              <View style={{ position: "relative" }}>
                <Input
                  label="Address"
                  placeholder="Enter your complete address"
                  materialIconName="map-marker-outline"
                  onChangeText={handleChange("address")}
                  onBlur={() =>
                    setTimeout(() => setShowUseLocation(false), 200)
                  } // Hide button on blur
                  onFocus={() => setShowUseLocation(true)} // Show button on focus
                  value={values.address}
                  touched={touched.address}
                  errors={errors.address}
                  inputStyles={{ height: 80 }}
                  multiline
                />
                {showUseLocation && (
                  <TouchableOpacity
                    onPress={() => handleUseCurrentLocation(setFieldValue)}
                    style={styles.useLocationButton}
                  >
                    <LocateFixed color={COLORS.primary} size={18} />
                    <Text style={styles.useLocationText}>
                      Use current location
                    </Text>
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

              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  borderWidth: 1,
                  borderColor: COLORS.border,
                  borderRadius: 8,
                  padding: 15,
                  marginVertical: 10,
                }}
                onPress={() => setShowDatePicker(true)}
              >
                <MaterialCommunityIcons
                  name="calendar"
                  size={20}
                  color={COLORS.gray}
                  style={{ marginRight: 10 }}
                />
                <Text
                  style={{
                    fontFamily: "regular",
                    fontSize: SIZES.small,
                    color: COLORS.gray,
                  }}
                >
                  {values.dob
                    ? values.dob.toDateString()
                    : "Select Date of Birth"}
                </Text>
              </TouchableOpacity>

              {showDatePicker && (
                <DateTimePicker
                  value={values.dob || new Date()}
                  mode="date"
                  display="default"
                  onChange={(event, selectedDate) => {
                    setShowDatePicker(false);
                    if (selectedDate) {
                      setFieldValue("dob", selectedDate);
                    }
                  }}
                  maximumDate={new Date()}
                />
              )}

              <Input
                label="Password"
                secureText={obsecureText}
                placeholder="Enter your password"
                materialIconName="lock-outline"
                onChangeText={handleChange("password")}
                onBlur={handleBlur("password")}
                value={values.password}
                touched={touched.password}
                errors={errors.password}
              >
                <TouchableOpacity
                  onPress={() => setObsecureText(!obsecureText)}
                >
                  <MaterialCommunityIcons
                    name={obsecureText ? "eye-outline" : "eye-off-outline"}
                    size={18}
                    color={COLORS.placeholder}
                  />
                </TouchableOpacity>
              </Input>

              <Input
                label="Confirm Password"
                secureText={obsecureText}
                placeholder="Enter your confirm password"
                materialIconName="lock-outline"
                onChangeText={handleChange("confirmPassword")}
                onBlur={handleBlur("confirmPassword")}
                value={values.confirmPassword}
                touched={touched.confirmPassword}
                errors={errors.confirmPassword}
              >
                <TouchableOpacity
                  onPress={() => setObsecureText(!obsecureText)}
                >
                  <MaterialCommunityIcons
                    name={obsecureText ? "eye-outline" : "eye-off-outline"}
                    size={18}
                    color={COLORS.placeholder}
                  />
                </TouchableOpacity>
              </Input>

              <PickerInput
                label="Gender"
                selectedValue={values.gender}
                onValueChange={(itemValue) =>
                  setFieldValue("gender", itemValue)
                }
                items={[
                  { label: "Male", value: "male" },
                  { label: "Female", value: "female" },
                ]}
                touched={touched.gender}
                errors={errors.gender}
                materialIconName="gender-male-female"
              />

              <Button
                handler={handleSubmit}
                text={"SIGN UP"}
                isValid={isValid}
                loader={loading}
                disabled={loading}
              />

              <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                <Text style={styles.linkText}>
                  Already have an account? Login
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </Formik>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default ClientRegister;
