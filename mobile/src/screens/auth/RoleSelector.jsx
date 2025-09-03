// screens/RoleSelectionScreen.js
import React, { useState } from "react";
import { SafeAreaView, View, Text, TouchableOpacity } from "react-native";
import { User, Tractor, Truck } from "lucide-react-native";
import { RoleCard } from "../../components";
import styles from "./styles/role.style";

const ROLES = [
  {
    id: "client",
    label: "Client",
    page: "ClientRegister",
    icon: <User />,
  },
  {
    id: "farmer",
    label: "Farmer",
    page: "FarmerRegister",
    icon: <Tractor />,
  },
  {
    id: "delivery",
    label: "Delivery Agent",
    page: "DeliveryRegister",
    icon: <Truck />,
  },
];

const RoleSelectionScreen = ({ navigation }) => {
  const [selectedRole, setSelectedRole] = useState(null);

  const handleContinue = () => {
    if (selectedRole) {
      navigation.navigate(selectedRole.page);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Please select your role</Text>
          <Text style={styles.subtitle}>
            This helps us customize your experience and show you relevant
            information.
          </Text>
        </View>

        <View style={styles.roleContainer}>
          {ROLES.map((role) => (
            <RoleCard
              key={role.id}
              icon={role.icon}
              label={role.label}
              isSelected={selectedRole === role}
              onPress={() => setSelectedRole(role)}
            />
          ))}
        </View>

        <View style={styles.footer}>
          <TouchableOpacity
            onPress={handleContinue}
            style={[styles.button, !selectedRole && styles.buttonDisabled]}
            disabled={!selectedRole}
          >
            <Text style={styles.buttonText}>Continue</Text>
          </TouchableOpacity>

          <View style={styles.dotsContainer}>
            <View style={[styles.dot, styles.dotInactive]} />
            <View style={[styles.dot, styles.dotActive]} />
            <View style={[styles.dot, styles.dotInactive]} />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default RoleSelectionScreen;
