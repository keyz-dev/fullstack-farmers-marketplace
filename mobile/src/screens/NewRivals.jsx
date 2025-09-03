import React from "react";
import styles from "./styles/newRival.style.js";
import { SafeAreaView } from "react-native-safe-area-context";
import { Header } from "../components";
import { ProductList } from "../components/products";
import { useRoute, useNavigation } from "@react-navigation/native";

const NewRivals = () => {
  const route = useRoute();
  const navigation = useNavigation();

  const { categoryId, categoryName } = route.params || {};
  const headerText = categoryName
    ? categoryName.charAt(0).toUpperCase() + categoryName.slice(1)
    : "Products";


  return (
    <SafeAreaView style={styles.container}>
      <Header title={headerText} />
      <ProductList categoryId={categoryId} headerText={headerText} />
    </SafeAreaView>
  );
};

export default NewRivals;
