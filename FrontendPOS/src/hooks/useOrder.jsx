import { OrderContext } from '../contexts/OrderContext';
import { useContext } from 'react';

export const useOrderContext = () => {
  const context = useContext(OrderContext);

  if (!context) {
    throw new Error('useOrder must be used within a OrderProvider');
  }
  return context;
};
