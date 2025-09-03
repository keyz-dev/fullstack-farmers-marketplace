import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Image,
} from "react-native";
// import DateTimePicker from '@react-native-community/datetimepicker';
import { useAuth } from "../../stateManagement/contexts";
import { COLORS, SIZES } from "../../constants";

const DeliveryRegister = ({ navigation }) => {
  const { register, loading } = useAuth();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    gender: "",
    dob: new Date(),
    vehicleType: "",
  });

  const handleChange = (key, value) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async () => {
    if (
      !form.name ||
      !form.email ||
      !form.password ||
      !form.gender ||
      !form.vehicleType
    ) {
      Alert.alert("Error", "Please fill all required fields");
      return;
    }

    try {
      // await register({ ...form, role: 'delivery' });
      Alert.alert("Success", "Registration successful");
      navigation.navigate("Login");
    } catch (err) {
      Alert.alert("Error", err.response?.data?.message || err.message);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <Image
        source={require("../../assets/images/onboarding-bg-removebg-preview.png")}
        style={{ height: "40%", resizeMode: "contain", alignSelf: "center" }}
      />

      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Register as Delivery Agent</Text>

        <TextInput
          style={styles.input}
          placeholder="Name"
          value={form.name}
          onChangeText={(v) => handleChange("name", v)}
        />

        <TextInput
          style={styles.input}
          placeholder="Email"
          keyboardType="email-address"
          autoCapitalize="none"
          value={form.email}
          onChangeText={(v) => handleChange("email", v)}
        />

        <TextInput
          style={styles.input}
          placeholder="Phone"
          keyboardType="phone-pad"
          value={form.phone}
          onChangeText={(v) => handleChange("phone", v)}
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          value={form.password}
          onChangeText={(v) => handleChange("password", v)}
        />

        <TextInput
          style={styles.input}
          placeholder="Gender (male/female)"
          value={form.gender}
          onChangeText={(v) => handleChange("gender", v)}
        />

        <Text style={styles.label}>Date of Birth</Text>
        {/* <DateTimePicker value={form.dob} mode="date" display="default" onChange={(e, date) => date && handleChange('dob', date)} style={{ marginBottom: 20 }} /> */}

        <TextInput
          style={styles.input}
          placeholder="Vehicle Type"
          value={form.vehicleType}
          onChangeText={(v) => handleChange("vehicleType", v)}
        />

        <TouchableOpacity
          style={[styles.button, loading && { opacity: 0.7 }]}
          onPress={handleSubmit}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? "Registering..." : "Register"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: "#f9f9f9" },
  container: { padding: 30, paddingBottom: 50 },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 30,
    color: "#333",
    textAlign: "center",
  },
  input: {
    backgroundColor: "#fff",
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 10,
    fontSize: 16,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  label: { marginBottom: 6, fontWeight: "600", color: "#555" },
  button: {
    backgroundColor: COLORS.primary,
    paddingVertical: 15,
    borderRadius: 30,
    marginTop: 10,
    alignItems: "center",
    shadowColor: COLORS.primary,
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 5,
  },
  buttonText: { color: "#fff", fontSize: 18, fontWeight: "600" },
});

export default DeliveryRegister;
