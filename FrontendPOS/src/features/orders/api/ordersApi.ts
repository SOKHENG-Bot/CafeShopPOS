/** Orders API Functions to Reuqest/Respone to Backend **/

import { apiClient } from '@/lib/api/client';
import type { CreateOrderData, Order } from '../types';

export const ordersApi = {
  /* get single order function */
  getOrder: async (id: string): Promise<Order> => {
    const { data } = await apiClient.get<Order>(`/api/orders/${id}`);
    return data;
  },

  /* get orders function */
  getOrders: async (): Promise<Order[]> => {
    const { data } = await apiClient.get<Order[]>(`/api/orders/`);
    return data;
  },

  /* create order function */
  createOrder: async (createData: CreateOrderData): Promise<Order> => {
    const { data } = await apiClient.post<Order>(`/api/orders/`, createData);
    return data;
  },

  /* update order function */
  updateOrder: async (id: string, status: Order['status']): Promise<Order> => {
    const { data } = await apiClient.patch<Order>(`/api/orders/${id}/`, {
      status,
    });
    return data;
  },

  /* cancel order function */
  deleteOrder: async (id: string): Promise<Order> => {
    const { data } = await apiClient.delete<Order>(`/api/orders/${id}/`);
    return data;
  },
};
