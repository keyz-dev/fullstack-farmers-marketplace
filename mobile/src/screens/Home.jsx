import { TouchableOpacity, Text, View, ScrollView } from "react-native";
import React, { useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import styles from "./styles/home.style.js";
import { Ionicons } from "@expo/vector-icons";
import { Welcome, Heading } from "../components/home";
import { ProductRow } from "../components/products";
import { useNavigation } from "@react-navigation/native";
import { useAuth, useProducts } from "../stateManagement/contexts";
import { CategorySection } from "../components/home";

const Home = () => {
  const { user } = useAuth();
  const { fetchBestSellers, fetchNewArrivals } = useProducts();
  const navigation = useNavigation();

  // Refresh products when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      fetchBestSellers();
      fetchNewArrivals();
    }, [])
  );

  return (
    <View>
      {/* AppBar */}
      <View style={styles.appBarWrapper}>
        <View style={styles.appBar}>
          <Ionicons name="location-outline" size={24}></Ionicons>
          <Text style={styles.location}>
            {user?.address || "Your Location"}
          </Text>
          <View style={{ alignItems: "flex-end" }}>
            <TouchableOpacity onPress={() => navigation.openDrawer()}>
              <Ionicons name="menu" size={24} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <ScrollView>
        <Welcome />
        <CategorySection />
        <Heading title={"Best Sellers"} />
        <ProductRow />
      </ScrollView>
    </View>
  );
};

export default Home;
