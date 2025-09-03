import React, { useEffect, useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import {
  Login,
  FarmerRegistration,
  ClientRegister,
  DeliveryRegister,
  RoleSelectionScreen,
} from "../screens/auth";

import {
  Onboarding,
  Landing,
  NewRivals,
  Home,
  ProductDetails,
  Cart,
} from "../screens";

import AsyncStorage from "@react-native-async-storage/async-storage";

const Stack = createNativeStackNavigator();

const AuthStack = () => {
  const [isFirstLaunch, setIsFirstLaunch] = useState(null);

  useEffect(() => {
    const checkFirstLaunch = async () => {
      const appData = await AsyncStorage.getItem("isFirstLaunch");
      if (appData == null) {
        setIsFirstLaunch(true);
        await AsyncStorage.setItem("isFirstLaunch", "false");
      } else {
        setIsFirstLaunch(false);
      }
    };
    checkFirstLaunch();
  }, []);

  return (
    isFirstLaunch != null && (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isFirstLaunch && (
          <Stack.Screen name="Onboarding" component={Onboarding} />
        )}
        <Stack.Screen name="Landing" component={Landing} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="RoleSelection" component={RoleSelectionScreen} />
        <Stack.Screen name="ClientRegister" component={ClientRegister} />
        <Stack.Screen name="FarmerRegister" component={FarmerRegistration} />
        <Stack.Screen name="DeliveryRegister" component={DeliveryRegister} />
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
          name="Cart"
          component={Cart}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="Home" component={Home} />
      </Stack.Navigator>
    )
  );
};

export default AuthStack;
