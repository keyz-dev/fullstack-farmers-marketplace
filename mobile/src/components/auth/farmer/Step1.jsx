import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import styles from "../../../screens/auth/styles/farmer.style.js";
import { PickerInput, ImagePickerInput, Input } from "../../index.js";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { COLORS } from "../../../constants";

const Step1 = ({ formik }) => {
  const [obscureText, setObscureText] = React.useState(true);
  const [showDatePicker, setShowDatePicker] = React.useState(false);

  return (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Basic Information</Text>

      <ImagePickerInput
        imageUri={formik.values.avatar}
        onImageSelect={(uri) => formik.setFieldValue("avatar", uri)}
        label="profile picture"
      />

      <Input
        label="Full Name"
        placeholder="Enter your full name"
        materialIconName="account-outline"
        onChangeText={formik.handleChange("name")}
        onBlur={formik.handleBlur("name")}
        value={formik.values.name}
        touched={formik.touched.name}
        errors={formik.errors.name}
      />

      <Input
        label="Email"
        placeholder="Enter your email"
        materialIconName="email-outline"
        onChangeText={formik.handleChange("email")}
        onBlur={formik.handleBlur("email")}
        value={formik.values.email}
        touched={formik.touched.email}
        errors={formik.errors.email}
        keyboardType="email-address"
      />

      <Input
        label="Phone Number"
        placeholder="Enter your phone number"
        materialIconName="phone-outline"
        onChangeText={formik.handleChange("phone")}
        onBlur={formik.handleBlur("phone")}
        value={formik.values.phone}
        touched={formik.touched.phone}
        errors={formik.errors.phone}
        keyboardType="phone-pad"
      />

      <Input
        label="WhatsApp Number"
        placeholder="Enter your WhatsApp number"
        materialIconName="whatsapp"
        onChangeText={formik.handleChange("whatsapp")}
        onBlur={formik.handleBlur("whatsapp")}
        value={formik.values.whatsapp}
        touched={formik.touched.whatsapp}
        errors={formik.errors.whatsapp}
        keyboardType="phone-pad"
      />

      <Input
        label="Password"
        secureText={obscureText}
        placeholder="Enter your password"
        materialIconName="lock-outline"
        onChangeText={formik.handleChange("password")}
        onBlur={formik.handleBlur("password")}
        value={formik.values.password}
        touched={formik.touched.password}
        errors={formik.errors.password}
      >
        <TouchableOpacity onPress={() => setObscureText(!obscureText)}>
          <MaterialCommunityIcons
            name={obscureText ? "eye-outline" : "eye-off-outline"}
            size={18}
            color={COLORS.placeholder}
          />
        </TouchableOpacity>
      </Input>

      <Input
        label="Confirm Password"
        secureText={obscureText}
        placeholder="Confirm your password"
        materialIconName="lock-outline"
        onChangeText={formik.handleChange("confirmPassword")}
        onBlur={formik.handleBlur("confirmPassword")}
        value={formik.values.confirmPassword}
        touched={formik.touched.confirmPassword}
        errors={formik.errors.confirmPassword}
      >
        <TouchableOpacity onPress={() => setObscureText(!obscureText)}>
          <MaterialCommunityIcons
            name={obscureText ? "eye-outline" : "eye-off-outline"}
            size={18}
            color={COLORS.placeholder}
          />
        </TouchableOpacity>
      </Input>

      <PickerInput
        label="Gender"
        selectedValue={formik.values.gender}
        onValueChange={(value) => formik.setFieldValue("gender", value)}
        items={[
          { label: "Male", value: "male" },
          { label: "Female", value: "female" },
        ]}
        touched={formik.touched.gender}
        errors={formik.errors.gender}
        materialIconName="gender-male-female"
      />

      <TouchableOpacity
        style={styles.dateButton}
        onPress={() => setShowDatePicker(true)}
      >
        <MaterialCommunityIcons
          name="calendar"
          size={20}
          color={COLORS.gray}
          style={{ marginRight: 10 }}
        />
        <Text style={styles.dateText}>
          {formik.values.dob
            ? formik.values.dob.toDateString()
            : "Select Date of Birth"}
        </Text>
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          value={formik.values.dob || new Date()}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate) {
              formik.setFieldValue("dob", selectedDate);
            }
          }}
          maximumDate={new Date()}
        />
      )}
    </View>
  );
};

export default Step1;
