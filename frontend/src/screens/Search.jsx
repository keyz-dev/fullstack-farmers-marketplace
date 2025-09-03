import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Image,
} from "react-native";
import React, { useState, useCallback, useEffect, useRef } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import styles from "./styles/search.style.js";
import { COLORS } from "../constants";
import { SearchComponent } from "../components/index";
import { useProducts } from "../stateManagement/contexts";
import { ProductCardView, SearchTile } from "../components/products";

const Search = () => {
  const { searchResults, searchProducts, loading, error } = useProducts();
  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState("");

  const performSearch = () => {
    console.log("Searching");
    searchProducts({ keyword, category });

    console.log("Finished searching");
  };

  return (
    <SafeAreaView>
      <SearchComponent
        keyword={keyword}
        setKeyword={setKeyword}
        category={category}
        setCategory={setCategory}
        performSearch={performSearch}
        autoFocus={true}
        rearIcon="search"
      />
      {searchResults.length === 0 ? (
        <View>
          <Image
            source={require("../assets/images/Pose23.png")}
            style={styles.searchImage}
          />
        </View>
      ) : (
        <View>
          <FlatList
            data={searchResults}
            keyExtractor={(item) => item._id.toString()}
            renderItem={({ item }) => <SearchTile product={item} />}
          />
        </View>
      )}
    </SafeAreaView>
  );
};

export default Search;
