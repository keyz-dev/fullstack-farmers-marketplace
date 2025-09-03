import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CART_KEY = 'user_cart'
const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // Load cart from storage on mount
  useEffect(() => {
    const loadCart = async () => {
      try {
        const storedCart = await AsyncStorage.getItem(CART_KEY);
        if (storedCart) setCartItems(JSON.parse(storedCart));
      } catch (e) {
        console.error('Failed to load cart', e);
      }
    };
    loadCart();
  }, []);

  // Save cart to storage whenever it changes
  useEffect(() => {
    const saveCart = async () => {
      try {
        await AsyncStorage.setItem(CART_KEY, JSON.stringify(cartItems));
      } catch (e) {
        console.error('Failed to save cart', e);
      }
    };
    saveCart();
  }, [cartItems]);

    // Derived value: number of distinct items in cart
  const cartCount = useMemo(() => cartItems.length, [cartItems]);

  // Add product to cart or update quantity if it exists
  const addToCart = (product, quantity = 1) => {
    setCartItems((prevItems) => {
      const itemIndex = prevItems.findIndex(item => item.product._id === product._id);
      if (itemIndex > -1) {
        // Update quantity
        const updatedItems = [...prevItems];
        updatedItems[itemIndex].quantity += quantity;
        return updatedItems;
      }
      // Add new item
      return [...prevItems, { product, quantity }];
    });
  };

  // Remove product from cart
  const removeFromCart = (productId) => {
    setCartItems((prevItems) => prevItems.filter(item => item.product._id !== productId));
  };

  // Update quantity of a product
  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems((prevItems) =>
      prevItems.map(item =>
        item.product._id === productId ? { ...item, quantity } : item
      )
    );
  };

  // Calculate total price
  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + item.product.price * item.quantity, 0);
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      cartCount,
      setCartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      getTotalPrice,
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
