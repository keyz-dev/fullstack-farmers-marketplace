import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Image, StyleSheet } from 'react-native';
import Modal from 'react-native-modal';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants';

const PaymentModal = ({ visible, onClose, onSubmit }) => {
  const [step, setStep] = useState(1);
  const [method, setMethod] = useState('momo');
  const [phone, setPhone] = useState('');

  const handleContinue = () => setStep(2);

  const handlePay = () => {
    onSubmit({ method, phone });
    setStep(1);
    setPhone('');
  };

  return (
    <Modal
      isVisible={visible}
      onBackdropPress={onClose}
      style={styles.bottomModal}
      backdropOpacity={0.3}
      avoidKeyboard
    >
      <View style={styles.modalContent}>
        {step === 1 ? (
          <>
            <Text style={styles.title}>Choose payment method</Text>
            <TouchableOpacity
              style={[styles.paymentCard, method === 'momo' && styles.selectedCard]}
              onPress={() => setMethod('momo')}
            >
              <Image source={require('../assets/images/mtn.webp')} style={styles.paymentImage} />
              <Text style={styles.paymentText}>MTN MoMo</Text>
              {method === 'momo' && <Ionicons name="checkmark-circle" color={COLORS.primary} size={22} />}
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.paymentCard, method === 'om' && styles.selectedCard]}
              onPress={() => setMethod('om')}
            >
              <Image source={require('../assets/images/orange.webp')} style={styles.paymentImage} />
              <Text style={styles.paymentText}>Orange Money</Text>
              {method === 'om' && <Ionicons name="checkmark-circle" color={COLORS.primary} size={22} />}
            </TouchableOpacity>
            <TouchableOpacity style={styles.continueBtn} onPress={handleContinue}>
              <Text style={styles.continueText}>Continue</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <Text style={styles.title}>Enter your {method === 'momo' ? 'MTN MoMo' : 'Orange Money'} number</Text>
            <TextInput
              style={styles.input}
              placeholder="Phone number"
              keyboardType="phone-pad"
              value={phone}
              onChangeText={setPhone}
            />
            <TouchableOpacity style={styles.continueBtn} onPress={handlePay}>
              <Text style={styles.continueText}>Pay & Place Order</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  bottomModal: { justifyContent: 'flex-end', margin: 0 },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    padding: 24,
    minHeight: 320,
  },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 18, color: COLORS.primary },
  paymentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f6f6f6',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  selectedCard: {
    borderColor: COLORS.primary,
    backgroundColor: '#e3f6f2',
  },
  paymentImage: { width: 36, height: 24, marginRight: 12 },
  paymentText: { fontSize: 16, flex: 1 },
  continueBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 18,
  },
  continueText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  input: {
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 18,
    marginTop: 12,
    backgroundColor: '#f6f6f6',
  },
});

export default PaymentModal;