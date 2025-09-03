// components/PickerInput.js
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { SIZES, COLORS } from "../constants";

const PickerInput = ({
  label,
  selectedValue,
  onValueChange,
  items,
  touched,
  errors,
  materialIconName,
  wrapperStyles,
}) => {
  return (
    <View style={wrapperStyles}>
      <Text style={styles.label}>{label}</Text>
      <View
        style={[
          styles.inputWrapper,
          touched && errors ? styles.errorWrapper : {},
        ]}
      >
        <MaterialCommunityIcons
          name={materialIconName}
          size={20}
          color={COLORS.gray}
          style={styles.iconStyle}
        />
        <Picker
          selectedValue={selectedValue}
          onValueChange={onValueChange}
          style={styles.picker}
          dropdownIconColor={COLORS.primary}
        >
          <Picker.Item
            label={`-- Select ${label.toLowerCase()} --`}
            value=""
            style={styles.pickerItem}
          />
          {items.map((item) => (
            <Picker.Item
              key={item.value}
              label={item.label}
              value={item.value}
              style={styles.pickerItem}
            />
          ))}
        </Picker>
      </View>
      {touched && errors && <Text style={styles.errorMessage}>{errors}</Text>}
    </View>
  );
};

// Use the same styles as the Input component for consistency
const styles = StyleSheet.create({
  label: {
    fontFamily: "regular",
    fontSize: SIZES.small,
    marginBottom: 5,
    marginEnd: 5,
    textAlign: "right",
  },
  inputWrapper: {
    borderColor: COLORS.offwhite,
    backgroundColor: COLORS.lightWhite,
    borderWidth: 1,
    height: 55,
    borderRadius: SIZES.small,
    flexDirection: "row",
    alignItems: "center",
  },
  errorWrapper: {
    borderColor: "red",
  },
  iconStyle: {
    marginHorizontal: 10,
  },
  picker: {
    flex: 1,
    height: "100%",
    color: COLORS.primary,
  },
  pickerItem: {
    fontFamily: "regular",
    fontSize: SIZES.medium,
  },
  errorMessage: {
    color: "red",
    fontFamily: "regular",
    marginTop: 5,
    marginLeft: 5,
    fontSize: SIZES.xSmall,
  },
});

export default PickerInput;
