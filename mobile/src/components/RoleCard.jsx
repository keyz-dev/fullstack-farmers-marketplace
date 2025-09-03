// components/RoleCard.js
import React from "react";
import { TouchableOpacity, Text, StyleSheet, View } from "react-native";
import { COLORS } from "../constants";

const RoleCard = ({ icon, label, isSelected, onPress }) => {
  // Conditionally choose styles based on the isSelected prop
  const cardStyle = isSelected
    ? [styles.card, styles.cardSelected]
    : styles.card;
  const textStyle = isSelected
    ? [styles.label, styles.labelSelected]
    : styles.label;
  const iconColor = isSelected ? COLORS.primary : COLORS.placeholder;

  return (
    <TouchableOpacity onPress={onPress} style={cardStyle}>
      <View style={styles.iconContainer}>
        {React.cloneElement(icon, { color: iconColor, size: 32 })}
      </View>
      <Text style={textStyle}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1, // Allows cards to take up equal space
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
    paddingHorizontal: 10,
    borderWidth: 2,
    borderColor: "#f3f4f6", // Light gray border
    borderRadius: 12,
    backgroundColor: "#f9fafb",
    minHeight: 120,
  },
  cardSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.lightPrimary,
  },
  iconContainer: {
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    textAlign: "center",
    fontFamily: "medium",
    color: COLORS.placeholder,
  },
  labelSelected: {
    color: COLORS.primary,
  },
});

export default RoleCard;
