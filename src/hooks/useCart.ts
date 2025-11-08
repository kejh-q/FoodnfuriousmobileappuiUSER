import { useState, useEffect } from "react";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  cafe: string;
  notes?: string;
}

const CART_KEY = "um_eats_cart_";

export function useCart(userId?: string) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Load cart from localStorage when userId changes
  useEffect(() => {
    if (userId) {
      const savedCart = localStorage.getItem(CART_KEY + userId);
      if (savedCart) {
        try {
          const parsed = JSON.parse(savedCart);
          setCartItems(parsed);
        } catch (error) {
          console.error("Error loading cart:", error);
          setCartItems([]);
        }
      } else {
        // New user - start with empty cart
        setCartItems([]);
      }
    } else {
      // No user logged in - clear cart
      setCartItems([]);
    }
  }, [userId]);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (userId && cartItems) {
      localStorage.setItem(CART_KEY + userId, JSON.stringify(cartItems));
    }
  }, [cartItems, userId]);

  const addToCart = (item: Omit<CartItem, "quantity">, quantity: number = 1) => {
    setCartItems((prev) => {
      // Check if the same item with same notes exists
      const existingItem = prev.find((i) => i.id === item.id && i.notes === item.notes);
      
      if (existingItem) {
        // Update quantity if item with same notes already exists
        return prev.map((i) =>
          i.id === item.id && i.notes === item.notes
            ? { ...i, quantity: i.quantity + quantity }
            : i
        );
      } else {
        // Add new item (or same item with different notes)
        return [...prev, { ...item, quantity }];
      }
    });
  };

  const removeFromCart = (itemId: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== itemId));
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
    } else {
      setCartItems((prev) =>
        prev.map((item) =>
          item.id === itemId ? { ...item, quantity } : item
        )
      );
    }
  };

  const clearCart = () => {
    setCartItems([]);
    if (userId) {
      localStorage.removeItem(CART_KEY + userId);
    }
  };

  const clearCafeItems = (cafeName: string) => {
    setCartItems((prev) => prev.filter((item) => item.cafe !== cafeName));
  };

  const getCartCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getCafeItems = (cafeName: string) => {
    return cartItems.filter((item) => item.cafe === cafeName);
  };

  const getCafes = () => {
    const cafes = new Set(cartItems.map((item) => item.cafe));
    return Array.from(cafes);
  };

  return {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    clearCafeItems,
    cartCount: getCartCount(),
    cartTotal: getCartTotal(),
    getCafeItems,
    getCafes,
  };
}
