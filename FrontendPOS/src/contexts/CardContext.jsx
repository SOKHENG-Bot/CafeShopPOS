import { createContext } from "react"
import { useState } from "react";

const CartContext = createContext(undefined);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  const addToCart = (item, notes = "") => {
    setCart((prev) => {
      // Check if the item is already added
      const existing_item = prev.find((i) => i.id === item.id && i.notes === notes);
      if (existing_item) {
        return prev.map((i) =>
          i.id === item.id && i.notes === notes ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1, notes }]
    })
  }

  // Clear all items that had add to Cart
  const clearCart = () => {
    setCart([]);
  }

  // Remove one item from Cart
  const removeFromCart = (itemId) => {
    setCart((prev) => prev.filter((item) => item.id !== itemId));
  };

  // Status of items that have added to Cart
  const updateQuantity = (itemId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    setCart((prev) => prev.map((item) => (item.id === itemId ? { ...item, quantity } : item))
    );
  };

  const totalItemAdded = () => {

  }

  const cartSubTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartPriceTotal = cartSubTotal;

  const values = {
    cart,
    clearCart,
    addToCart,
    removeFromCart,
    updateQuantity,
    totalItemAdded,
    cartPriceTotal,
    cartSubTotal,
  }

  return (
    <CartContext.Provider value={values}>
      {children}
    </CartContext.Provider>
  )
}

export { CartContext };
