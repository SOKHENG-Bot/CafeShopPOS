/** Cart Store using Zustand (It like Context in React) **/

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartStore } from '../types';

export const useCartStore = create<CartStore>()(
  /* persist middlewae - automatically saves to localStorage */
  persist(
    (set, get) => ({
      /* Initial State */
      items: [],
      itemCount: 0,
      total: 0,

      /* Add function - add item to cart or increase quantity */
      addItem: (item) => {
        const { items } = get();
        const exitingItem = items.find((i) => i.menuItemId === item.menuItemId);

        if (exitingItem) {
          /* Check if item already added to cart then increase quantity by 1 */
          set({
            items: items.map((i) =>
              i.menuItemId === item.menuItemId
                ? { ...i, quantity: i.quantity + 1 }
                : i
            ),
          });
        } else {
          /* If not have added item then set quantity to 1 */
          set({
            items: [...items, { ...item, quantity: 1 }],
          });
        }
        /* recalculate totals after added */
        get().recalculateTotals();
      },

      /* Remove funtion */
      removeItem: (menuItemId) => {
        set({
          items: get().items.filter((i) => i.menuItemId !== menuItemId),
        });
        get().recalculateTotals();
      },

      /* Update function - update quantity of the item in cart */
      updateQuantity: (menuItemId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(menuItemId);
          return;
        }
        set({
          items: get().items.map((i) =>
            i.menuItemId === menuItemId ? { ...i, quantity } : i
          ),
        });
        get().recalculateTotals();
      },

      /* Clear function - set empty cart */
      clearCart: () => {
        set({ items: [], itemCount: 0, total: 0 });
      },

      /* isInCart function - to check if item already in cart */
      isInCart: (menuItemId) => {
        return get().items.some((i) => i.menuItemId === menuItemId);
      },

      /* getItemQuantity function - get current quantity of menu item in cart */
      getItemQuantity: (menuItemId) => {
        const item = get().items.find((i) => i.menuItemId === menuItemId);
        return item?.quantity || 0;
      },

      /* recalculate funtion - update item count and total base on items array */
      recalculateTotals: () => {
        const { items } = get();
        const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
        0;
        const total = items.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        );
        set({ itemCount, total });
      },
    }),
    {
      name: 'cart-storage', // localStorage key
    }
  )
);
