import { CartContext } from '../contexts/CardContext';
import { useContext } from 'react';

export const useCartContext = () => {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
