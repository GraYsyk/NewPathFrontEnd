import { createContext, useState, useContext, useEffect } from "react";
import React from 'react';
import axios from "axios";

const CartContext = createContext<CartContextType | null>(null);

const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  if (!token) return {};
  return { headers: { Authorization: `Bearer ${token}` } };
};

export function CartProvider({children}: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn] = useState(!!localStorage.getItem("token"));
  const [cartError, setCartError] = useState<CartError | null>(null);

  const totalPrice = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);

  // Helper
  const showError = (msg: string, item: CartItem | null = null) => {
    setCartError({ msg, item });
    setTimeout(() => setCartError(null), 8000);
  };

  const clearError = () => setCartError(null);

  //API
  const fetchCart = async () => {
    try {
      const res = await axios.get("/api/cart", getAuthHeader());
      setCart(res.data);
    } catch (err) {
      console.error("Failed to fetch cart:", err);
    }
  };

  // Effects
  useEffect(() => {
    if (isLoggedIn) {
      fetchCart();
    } else {
      const local = localStorage.getItem("cart");
      if (local) setCart(JSON.parse(local));
    }
  }, []);

  useEffect(() => {
    if (!isLoggedIn) {
      localStorage.setItem("cart", JSON.stringify(cart));
    }
  }, [cart]);

  //Actions
  const addToCart = async (item: CartItem) => {
    if (isLoggedIn) {
      try {
        await axios.post(
          "/api/cart/add",
          { itemId: item.id, size: item.size, color: item.color, quantity: item.quantity },
          getAuthHeader()
        );
        await fetchCart();
        setIsOpen(true);
      } catch (err) {
        const error = err as any;
        const msg = error.response?.data?.message || "Failed to add to cart";
        showError(msg, item);
      }
      return;
    }

    setCart((prev) => {
      const existing = prev.find(
        (i) => i.id === item.id && i.size === item.size && i.color === item.color
      );
      const currentQty = existing?.quantity ?? 0;
      const newQty = currentQty + item.quantity;

      if (item.stockQuantity && newQty > item.stockQuantity) {
        showError("Not enough items in stock", item);
        return prev;
      }

      if (existing) {
        return prev.map((i) => (i === existing ? { ...i, quantity: newQty } : i));
      }
      return [...prev, item];
    });

    setIsOpen(true);
  };

  const removeFromCart = async (cartItemId: number | null, id: number, color: string, size: string) => {
    if (isLoggedIn) {
      try {
        await axios.delete(`/api/cart/${cartItemId}`, getAuthHeader());
        await fetchCart();
      } catch (err) {
        console.error("Failed to remove from cart:", err);
      }
      return;
    }

    setCart((prev) =>
      prev.filter((i) => !(i.id === id && i.color === color && i.size === size))
    );
  };

  const updateQuantity = async ( cartItemId: number | null,
                                id: number,
                                color: string,
                                size: string, 
                                quantity: number
  ) => {
    if (isLoggedIn && cartItemId) {
      try {
        await axios.put(`/api/cart/${cartItemId}`, { quantity }, getAuthHeader());
        await fetchCart();
      } catch (err) {
        console.error("Failed to update quantity:", err);
      }
      return;
    }

    if (quantity < 1) {
      removeFromCart(null, id, color, size);
      return;
    }

    setCart((prev) => {
      const existing = prev.find(
        (i) => i.id === id && i.color === color && i.size === size
      );
      if (existing?.stockQuantity && quantity > existing.stockQuantity) return prev;

      return prev.map((i) =>
        i.id === id && i.color === color && i.size === size ? { ...i, quantity } : i
      );
    });
  };

  return (
    <CartContext.Provider
      value={{ cart, isOpen, setIsOpen, addToCart, removeFromCart, updateQuantity, totalPrice, fetchCart, cartError, setCartError, clearError }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext) as CartContextType;