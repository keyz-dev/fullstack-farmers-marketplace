import { View, Text, TouchableOpacity, TextInput } from "react-native";
import React from "react";
import styles from "./styles/welcome.style.js";
import { COLORS, SIZES } from "../../constants";
import { useNavigation } from "@react-navigation/native";
import { SearchComponent } from "../index";

const Welcome = () => {
  const navigation = useNavigation();
  const handleSearch = () => {
    navigation.navigate("Search");
  };

  return (
    <View>
      <View style={styles.container}>
        <Text style={styles.welcomeText(COLORS.black, SIZES.xSmall)}>
          Discover Your
        </Text>
        <Text style={styles.welcomeText(COLORS.primary, 0)}>Farm Products</Text>
      </View>

      <SearchComponent
        handleSearch={handleSearch}
        frontIcon="search"
        rearIcon="filter"
      />
    </View>
  );
};

export default Welcome;
