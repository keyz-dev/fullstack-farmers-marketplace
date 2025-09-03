import React from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Lock } from "lucide-react-native";

// --- Import your custom button and constants ---
import Button from "../components/Button";
import { COLORS } from "../constants";
import styles from "./styles/landing.style.js";

// --- ASSETS ---
const logoImage = require("../assets/images/logo.png");
const backgroundImage = require("../assets/images/landing-background.jpg");

const Landing = ({ navigation }) => {
  const onLogin = () => navigation.navigate("Login");
  const onCreateAccount = () => navigation.navigate("RoleSelection");
  const onSkip = () => navigation.navigate("Home");

  return (
    <SafeAreaView style={styles.container}>
      {/* <StatusBar barStyle="light-content" /> */}

      <View style={styles.topContainer}>
        <Image
          source={backgroundImage}
          style={styles.backgroundImage}
          resizeMode="cover"
        />
        <LinearGradient
          colors={["transparent", "rgba(255,255,255,0.8)", "#FFFFFF"]}
          style={styles.gradient}
        />
        <View style={styles.topIconContainer}>
          <Lock color="white" size={16} />
        </View>
      </View>

      <View style={styles.bottomContainer}>
        <View style={styles.content}>
          <Image source={logoImage} style={styles.logo} resizeMode="contain" />
          <Text style={styles.title}>Powering Farmers. Enabling Earners.</Text>
        </View>

        <View style={styles.buttonContainer}>
          <Button
            handler={onLogin}
            text="Login"
            isValid={true}
            additionalStyles={{
              height: 55,
            }}
          />

          <Button
            handler={onCreateAccount}
            text="Create New Account"
            isValid={true}
            additionalStyles={{
              backgroundColor: COLORS.white,
              borderWidth: 1,
              borderColor: COLORS.lightGray,
              marginTop: 0,
              height: 55,
            }}
            additionalTextStyles={{
              color: COLORS.primary,
            }}
          />

          <TouchableOpacity onPress={onSkip} style={styles.skipButton}>
            <Text style={styles.skipText}>Skip for now</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Landing;
