import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ScrollView,
} from "react-native";
import { Button } from "../../components";
import { Formik } from "formik";

import {
  ProgressBar,
  Step1,
  Step2,
  Step3,
  Step4,
  Step1Schema,
  Step2Schema,
  Step3Schema,
  Step4Schema,
} from "../../components/auth/farmer";

import styles from "./styles/farmer.style.js";
import { handleFarmerSignUp } from "../../utils/handleFarmerRegister";

import {
  useAuth,
  AuthProvider,
} from "../../stateManagement/contexts/AuthContext";

const FarmerRegistrationContent = ({ navigation }) => {
  const { register } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 1: Basic Info
    name: "",
    email: "",
    phone: "",
    whatsapp: "",
    password: "",
    confirmPassword: "",
    gender: "",
    dob: new Date(),
    avatar: null,
    role: "farmer",

    // Step 2: Location
    address: "",
    addressCoordinates: { lat: 3.848, lng: 11.502 },
    locationZone: "",

    // Step 3: Farm Details
    farmName: "",
    websiteURL: "",
    shopDescription: "",
    produceTypes: [],
    shopAddress: "",
    shopCoordinates: { lat: 3.848, lng: 11.502 }, // Default to Yaoundé
    deliveryRadiusKm: 10,

    // Step 4: Payment Details
    paymentMethod: "",
    accountNumber: "",
    accountName: "",
  });

  const getValidationSchema = () => {
    switch (currentStep) {
      case 1:
        return Step1Schema;
      case 2:
        return Step2Schema;
      case 3:
        return Step3Schema;
      case 4:
        return Step4Schema;
      default:
        return Step1Schema;
    }
  };

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFinalSubmit = async (finalData) => {
    try {
      // create the payment object
      const payment = {
        method: finalData.paymentMethod,
        accountNumber: finalData.accountNumber,
        accountName: finalData.accountName,
      };

      // add the payment object to the final data
      finalData.payment = payment;

      // remove the payment method, account number, and account name from the final data
      delete finalData.paymentMethod;
      delete finalData.accountNumber;
      delete finalData.accountName;

      await handleFarmerSignUp(finalData, register, navigation);
    } catch (error) {
      Alert.alert("Error", "Registration failed. Please try again.");
    }
  };

  const renderCurrentStep = (formik) => {
    switch (currentStep) {
      case 1:
        return <Step1 formik={formik} />;
      case 2:
        return <Step2 formik={formik} />;
      case 3:
        return <Step3 formik={formik} />;
      case 4:
        return <Step4 formik={formik} />;
      default:
        return <Step1 formik={formik} />;
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ProgressBar currentStep={currentStep} />

      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Formik
          initialValues={formData}
          validationSchema={getValidationSchema()}
          onSubmit={(values) => {
            if (currentStep === 4) {
              handleFinalSubmit(values);
            } else {
              handleNext(values);
            }
          }}
          enableReinitialize
        >
          {(formik) => (
            <View>
              {renderCurrentStep(formik)}

              <View style={styles.buttonContainer}>
                {currentStep > 1 && (
                  <TouchableOpacity
                    style={styles.previousButton}
                    onPress={handleBack}
                  >
                    <Text style={styles.previousButtonText}>Previous</Text>
                  </TouchableOpacity>
                )}

                <Button
                  handler={formik.handleSubmit}
                  text={currentStep === 4 ? "COMPLETE" : "NEXT"}
                  isValid={formik.isValid}
                  loader={false}
                  additionalStyles={styles.nextButton}
                />
              </View>
            </View>
          )}
        </Formik>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const FarmerRegistration = ({ navigation }) => {
  return (
    <AuthProvider>
      <FarmerRegistrationContent navigation={navigation} />
    </AuthProvider>
  );
};

export default FarmerRegistration;
