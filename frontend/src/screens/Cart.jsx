import React, { useState } from "react";
import styles from "./styles/cart.style.js";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  FlatList,
  Text,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  TextInput,
} from "react-native";
import { useCart, useOrders, useAuth } from "../stateManagement/contexts";
import CartTile from "../components/cart/CartTile";
import { Header } from "../components";
import { COLORS } from "../constants";
import { Ionicons } from "@expo/vector-icons";
import PaymentModal from "./PaymentModal";
import SuccessModal from "./SuccessModal";
import { useNavigation } from "@react-navigation/native";

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, getTotalPrice, setCartItems } = useCart();
  const { createOrder, loading: orderLoading } = useOrders();
  const { user } = useAuth();
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [discountCode, setDiscountCode] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const navigation = useNavigation();

  const handleApplyDiscount = () => {
    if (discountCode.toLowerCase() === "save10") {
      setDiscountAmount(getTotalPrice() * 0.1);
      Alert.alert("Success", "Discount code applied!");
    } else {
      setDiscountAmount(0);
      Alert.alert("Invalid Code", "The discount code is not valid.");
    }
  };

  const finalTotal = getTotalPrice() - discountAmount;

  const handleCheckout = () => {
    if (!user) {
      Alert.alert("Login Required", "Please login to place an order");
      return;
    }
    if (cartItems.length === 0) {
      Alert.alert("Empty Cart", "Your cart is empty. Add some items before checkout.");
      return;
    }
    setShowPaymentModal(true);
  };

  const handlePaymentSubmit = async ({ method, phone }) => {
    setShowPaymentModal(false);
    setCheckoutLoading(true);

    console.log("cartItems", cartItems);
    
    try {
      const orderData = {
        orderItems: cartItems.map(item => ({
          product: item.product._id,
          quantity: item.quantity,
          price: item.product.price
        })),
        totalAmount: finalTotal,
        shippingAddress: user.address || "Default Address",
        paymentMethod: method === 'momo' ? 'MTN MoMo' : 'Orange Money',
        phoneNumber: phone,
      };
      const result = await createOrder(orderData);
      if (result.success) {
        setShowSuccessModal(true);
      } else {
        Alert.alert("Order Error", result.message || "Failed to place order.");
      }
    } catch (error) {
      Alert.alert("Checkout Error", error.message || "Failed to place order.");
    } finally {
      setCheckoutLoading(false);
    }
  };

  const handleSuccessClose = () => {
    setShowSuccessModal(false);
    setCartItems([]);
    navigation.navigate("Home Screen");
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header title={"Shopping Cart"} />
      
      {cartItems.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Your Cart is Empty</Text>
          <Text style={styles.emptySubtext}>Looks like you haven't added anything to your cart yet.</Text>
        </View>
      ) : (
        <>
          <FlatList
            data={cartItems}
            keyExtractor={(item) => item.product._id}
            renderItem={({ item }) => (
              <CartTile
                item={item}
                onRemove={removeFromCart}
                onQuantityChange={updateQuantity}
              />
            )}
            style={styles.cartList}
            contentContainerStyle={styles.listContent}
          />

          <View style={styles.checkoutSection}>
            <View style={styles.discountRow}>
              <TextInput
                placeholder="Discount Code"
                value={discountCode}
                onChangeText={setDiscountCode}
                style={styles.discountInput}
              />
              <TouchableOpacity style={styles.discountButton} onPress={handleApplyDiscount}>
                <Ionicons name="checkmark-sharp" size={24} color={COLORS.white} />
              </TouchableOpacity>
            </View>

            <View style={styles.summaryContainer}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Subtotal</Text>
                <Text style={styles.summaryValue}>${getTotalPrice().toFixed(2)}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Discount</Text>
                <Text style={[styles.summaryValue, { color: COLORS.primary }]}>
                  -${discountAmount.toFixed(2)}
                </Text>
              </View>
            </View>

            <View style={styles.totalContainer}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalAmount}>${finalTotal.toFixed(2)}</Text>
            </View>
            
            <TouchableOpacity 
              style={[styles.checkoutButton, (checkoutLoading || orderLoading) && styles.checkoutButtonDisabled]}
              onPress={handleCheckout}
              disabled={checkoutLoading || orderLoading}
            >
              {checkoutLoading || orderLoading ? (
                <ActivityIndicator size="small" color={COLORS.white} />
              ) : (
                <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
              )}
            </TouchableOpacity>
          </View>
        </>
      )}
      <PaymentModal
        visible={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        onSubmit={handlePaymentSubmit}
      />
      <SuccessModal
        visible={showSuccessModal}
        onClose={handleSuccessClose}
      />
    </SafeAreaView>
  );
};

export default Cart;