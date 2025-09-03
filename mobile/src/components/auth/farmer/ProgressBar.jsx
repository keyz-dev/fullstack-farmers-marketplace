import React from "react";
import { View, Text } from "react-native";
import styles from "../../../screens/auth/styles/farmer.style.js";

const ProgressBar = ({ currentStep }) => {
  return (
    <View style={styles.progressContainer}>
      {[1, 2, 3, 4].map((step, index) => (
        <View key={index} style={styles.progressStep}>
          <View
            style={[
              styles.progressCircle,
              step <= currentStep ? styles.activeStep : styles.inactiveStep,
            ]}
          >
            <Text
              style={[
                styles.progressText,
                step <= currentStep ? styles.activeText : styles.inactiveText,
              ]}
            >
              {step}
            </Text>
          </View>
          {step < 4 && (
            <View
              style={[
                styles.progressLine,
                step < currentStep ? styles.activeLine : styles.inactiveLine,
              ]}
            />
          )}
        </View>
      ))}
    </View>
  );
};

export default ProgressBar;
