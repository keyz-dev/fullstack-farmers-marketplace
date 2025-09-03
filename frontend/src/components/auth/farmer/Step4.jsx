import React from "react";
import { View, Text } from "react-native";
import { PickerInput, Input } from "../../index.js";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { COLORS } from "../../../constants";
import styles from "../../../screens/auth/styles/farmer.style.js";
import { paymentMethods } from "../../../constants/farmer_auth.js";

const Step4 = ({ formik }) => {
  return (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Payment Details</Text>

      <PickerInput
        label="Payment Method"
        selectedValue={formik.values.paymentMethod}
        onValueChange={(value) => formik.setFieldValue("paymentMethod", value)}
        items={paymentMethods}
        touched={formik.touched.paymentMethod}
        errors={formik.errors.paymentMethod}
        materialIconName="cash"
      />

      <Input
        label="Account Number"
        placeholder="Enter your account number"
        materialIconName="credit-card-outline"
        onChangeText={formik.handleChange("accountNumber")}
        onBlur={formik.handleBlur("accountNumber")}
        value={formik.values.accountNumber}
        touched={formik.touched.accountNumber}
        errors={formik.errors.accountNumber}
        keyboardType="numeric"
      />

      <Input
        label="Account Name"
        placeholder="Enter account holder name"
        materialIconName="account-outline"
        onChangeText={formik.handleChange("accountName")}
        onBlur={formik.handleBlur("accountName")}
        value={formik.values.accountName}
        touched={formik.touched.accountName}
        errors={formik.errors.accountName}
      />

      <View style={styles.termsContainer}>
        <MaterialCommunityIcons
          name="information-outline"
          size={20}
          color={COLORS.primary}
        />
        <Text style={styles.termsText}>
          By completing registration, you agree to our Terms of Service and
          Privacy Policy.
        </Text>
      </View>
    </View>
  );
};

export default Step4;
