import { Text, View, TextInput } from "react-native";
import React from "react";
import styles from "./styles/input.style.js";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { COLORS } from "../constants";

const Input = ({
  label = "",
  placeholder = "",
  materialIconName = "",
  onFocus,
  onBlur,
  value,
  onChangeText,
  touched,
  errors,
  labelStyles = {},
  wrapperStyles = {},
  inputWrapperStyles = {},
  iconStyles = {},
  inputStyles = {},
  secureText = false,
  children,
}) => {
  return (
    <View style={styles.wrapper(wrapperStyles)}>
      {label != "" && <Text style={styles.label(labelStyles)}>{label}</Text>}
      <View
        style={styles.inputWrapper(
          touched ? COLORS.primary : COLORS.border,
          inputWrapperStyles
        )}
      >
        {materialIconName != "" && (
          <MaterialCommunityIcons
            name={materialIconName}
            size={20}
            color={COLORS.placeholder}
            style={styles.iconStyle(iconStyles)}
          />
        )}

        <TextInput
          secureTextEntry={secureText}
          placeholder={placeholder}
          onFocus={onFocus}
          onBlur={onBlur}
          value={value}
          onChangeText={onChangeText}
          autoCapitalize="none"
          autoCorrect={false}
          style={{ flex: 1, ...inputStyles }}
        />

        {children}
      </View>

      {touched && errors && <Text style={styles.errorMessage}> {errors}</Text>}
    </View>
  );
};

export default Input;
