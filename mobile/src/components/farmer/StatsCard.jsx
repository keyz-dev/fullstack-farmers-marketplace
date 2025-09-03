import { StyleSheet, Text, View } from "react-native";
import React from "react";
import styles from "./styles/stats.style";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../../constants";

const StatsCard = ({ title, value, icon, color = COLORS.primary }) => {
  return (
    <View style={[styles.statsCard, { borderLeftColor: color }]}>
      <View style={styles.statsContent}>
        <View style={styles.statsText}>
          <Text style={styles.statsValue}>{value}</Text>
          <Text style={styles.statsTitle}>{title}</Text>
        </View>
        <Ionicons name={icon} size={24} color={color} />
      </View>
    </View>
  );
};
export default StatsCard;
