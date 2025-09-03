import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const roles = [
  { label: 'Client', screen: 'ClientRegister', color: '#4a90e2' },
  { label: 'Vendor', screen: 'VendorRegister', color: '#f5a623' },
  { label: 'Delivery Agent', screen: 'DeliveryRegister', color: '#50e3c2' },
];

const RoleSelectionScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Account Type</Text>
      <View style={styles.cardsContainer}>
        {roles.map(({ label, screen, color }) => (
          <TouchableOpacity
            key={label}
            style={[styles.card, { backgroundColor: color }]}
            onPress={() => navigation.navigate(screen)}
            activeOpacity={0.8}
          >
            <Text style={styles.cardText}>{label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20, backgroundColor: '#f9f9f9' },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 40, color: '#333' },
  cardsContainer: { width: width * 0.8 },
  card: {
    paddingVertical: 25,
    borderRadius: 15,
    marginVertical: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  cardText: { fontSize: 22, fontWeight: '600', color: '#fff' },
});

export default RoleSelectionScreen;
