// navigation/FarmerStack.jsx
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// Import all screens related to the farmer's product management
import {
  MyProductsScreen,
  AddProductForm,
} from "../screens/farmer";

const Stack = createNativeStackNavigator();

const FarmerStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="MyProducts"
      // You can define a consistent header style for this whole stack
      screenOptions={{
        headerShown: false,
        headerStyle: { backgroundColor: "#fff" },
        headerShadowVisible: false,
        headerTitleAlign: "center",
      }}
    >
      <Stack.Screen
        name="MyProducts"
        component={MyProductsScreen}
        options={{ title: "My Products" }} // Set the header title
      />
      <Stack.Screen
        name="AddProduct"
        component={AddProductForm}
        options={{ title: "Add New Product" }}
      />
      <Stack.Screen
        name="EditProduct"
        component={AddProductForm}
        options={{ title: "Edit Product" }}
      />
    </Stack.Navigator>
  );
};

export default FarmerStack;
