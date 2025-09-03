import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import React from "react";
import { COLORS, SIZES } from "../constants";
import { Ionicons } from "@expo/vector-icons";
import { Loader } from "./Loader";

const Button = ({
  handler,
  text,
  isValid,
  frontIcon = null,
  iconStyle = {},
  endIcon = null,
  loader = false,
  additionalStyles = {},
  additionalTextStyles = {},
  disabled = false,
}) => {
  return (
    <TouchableOpacity
      onPress={handler}
      disabled={disabled}
      style={styles.btnStyle(
        additionalStyles,
        isValid ? COLORS.primary : COLORS.gray
      )}
    >
      {loader ? (
        <Loader />
      ) : (
        frontIcon && <Ionicons name={frontIcon} size={24} style={iconStyle} />
      )}
      <Text style={styles.btnText(additionalTextStyles)}>{text}</Text>
      {endIcon && <Ionicons name={endIcon} size={24} style={iconStyle} />}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  btnStyle: (additionalStyles, backgroundColor) => ({
    height: 50,
    width: "100%",
    marginVertical: 20,
    backgroundColor: backgroundColor,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    ...additionalStyles,
  }),
  btnText: (additionalTextStyles) => ({
    fontFamily: "bold",
    color: COLORS.white,
    fontSize: SIZES.medium + 2,
    ...additionalTextStyles,
  }),
});

export default Button;
