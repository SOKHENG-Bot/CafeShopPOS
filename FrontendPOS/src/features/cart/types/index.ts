/** Cart Feature - TypeScript Types **/

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  menuItemId: string;
}

export interface Cart {
  items: CartItem[];
  total: number;
  itemCount: number;
}

export interface CartStore extends Cart {
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (menuItemId: string) => void;
  updateQuantity: (menuItemId: string, quantity: number) => void;
  clearCart: () => void;
  isInCart: (menuItemId: string) => boolean;
  getItemQuantity: (menuItemId: string) => number;
  recalculateTotals: () => void;
}
