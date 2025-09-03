import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Home, ProductDetails, NewRivals, Categories } from "../screens";

const Stack = createNativeStackNavigator();

const HomeStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Main " component={Home} />
      <Stack.Screen
        name="ProductsList"
        component={NewRivals}
        options={{ tabBarVisible: false }}
      />
      <Stack.Screen
        name="ProductDetails"
        component={ProductDetails}
        options={{ tabBarVisible: false }}
      />
      <Stack.Screen
        name="Categories"
        component={Categories}
        options={{ tabBarVisible: false }}
      />
    </Stack.Navigator>
  );
};

export default HomeStack;
