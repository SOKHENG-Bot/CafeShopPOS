import { useContext } from 'react';
import { MenuContext } from '../contexts/MenuContext';

export const useMenuContext = () => {
  const context = useContext(MenuContext);

  if (!context) {
    throw new Error('useMenu must be used within a MenuProvider');
  }
  return context;
};
