import { createContext, useState, useContext } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const totalPrice = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const addToCart = (item) => {
    setCart(prev => {
      const existing = prev.find(i =>
        i.id === item.id &&
        i.size === item.size &&
        i.color === item.color
      );

      if (existing) {
        return prev.map(i =>
          i === existing
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
        );
      }

      return [...prev, item];
    });
  };

  const removeFromCart = (id, color, size) => {
    setCart(prev => prev.filter(i =>
      !(i.id === id && i.color === color && i.size === size)
    ));
  };

  const updateQuantity = (id, color, size, quantity) => {
    if (quantity < 1) {
      removeFromCart(id, color, size)
      return
    }
    setCart(prev => prev.map(i =>
      i.id === id && i.color === color && i.size === size
        ? { ...i, quantity }
        : i
    ))
  }

  return (
    <CartContext.Provider value={{ cart, isOpen, setIsOpen, addToCart, removeFromCart, updateQuantity, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext)