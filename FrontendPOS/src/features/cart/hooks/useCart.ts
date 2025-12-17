import type { MenuItem } from '@/features/menu';
import { useCartStore } from '../stores/cartStore';

export const useCart = () => {
  const store = useCartStore();

  /* AddMenuItem function - add item from menu-items endpoint to cart */
  const AddMenuItem = (menuItem: MenuItem) => {
    store.addItem({
      id: `cart-${menuItem.id}-${Date.now()}`, // Generate unique cart item ID
      menuItemId: menuItem.id,
      name: menuItem.name,
      price: menuItem.price,
      image: menuItem.image,
    });
  };

  return {
    ...store, // items, itemCount, total, addItem, removeItem
    AddMenuItem,
  };
};
