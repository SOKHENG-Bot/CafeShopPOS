/** Orders Feature - Types **/

export interface OrderItem {
  price: number;
  menu_item: string;
  quantity: number;
}

export interface Order {
  id: string;
  order_number: string;
  total: number;
  items: OrderItem[];
  status: 'pending' | 'preparing' | 'completed' | 'cancelled';
  created_at: string;
  // paymentMethod?: 'cash' | 'card' | 'mobile';
}

export interface CreateOrderData {
  total: number;
  items: OrderItem[];
  // paymentMethod?: 'cash' | 'card' | 'mobile';
}
