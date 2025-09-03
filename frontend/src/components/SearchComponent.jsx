import { View, Text, TouchableOpacity, TextInput } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { COLORS, SIZES } from "../constants";
import { Feather, Ionicons } from "@expo/vector-icons";
import styles from "./styles/search.style.js";

const SearchComponent = ({ handleSearch, autoFocus = false }) => {
  const inputRef = useRef(null);
  const [searchText, setSearchText] = useState("");

  const performSearch = () => {
    // perform search logic here
  };

  useEffect(() => {
    if (autoFocus) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [autoFocus]);

  return (
    <View style={styles.searchContainer}>
      <TouchableOpacity>
        <Feather
          name="search"
          size={24}
          color={COLORS.gray}
          style={styles.searchIcon}
        />
      </TouchableOpacity>
      <View style={styles.searchWrapper}>
        <TextInput
          ref={inputRef}
          value={searchText}
          onChangeText={setSearchText}
          style={styles.searchInput}
          onPress={handleSearch}
          placeholder="what are you looking for?"
        />
      </View>

      <View>
        <TouchableOpacity style={styles.searchBtn} onPress={performSearch}>
          <Ionicons
            name="camera-outline"
            size={SIZES.xLarge}
            color={COLORS.white}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SearchComponent;
