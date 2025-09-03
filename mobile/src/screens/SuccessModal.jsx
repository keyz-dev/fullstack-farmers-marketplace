import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Modal from 'react-native-modal';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants';

const SuccessModal = ({ visible, onClose }) => (
  <Modal isVisible={visible} onBackdropPress={onClose} style={{ justifyContent: 'center', alignItems: 'center' }}>
    <View style={{
      backgroundColor: '#fff',
      borderRadius: 18,
      padding: 32,
      alignItems: 'center',
      width: 300,
    }}>
      <Ionicons name="checkmark-circle" size={60} color={COLORS.success} />
      <Text style={{ fontSize: 20, fontWeight: 'bold', marginVertical: 16, color: COLORS.primary }}>
        Order placed successfully!
      </Text>
      <TouchableOpacity onPress={onClose} style={{
        backgroundColor: COLORS.primary,
        borderRadius: 10,
        paddingVertical: 12,
        paddingHorizontal: 32,
        marginTop: 10,
      }}>
        <Text style={{ color: '#fff', fontSize: 16 }}>Go to Home</Text>
      </TouchableOpacity>
    </View>
  </Modal>
);

export default SuccessModal;
