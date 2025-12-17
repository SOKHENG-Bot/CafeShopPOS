import { apiClient } from '@/lib/api/client';
import type { InventoryItem, CreateInventoryItem } from '../types';

export const inventoryApi = {
  getInventoryItems: async (): Promise<InventoryItem[]> => {
    const { data } = await apiClient.get(`/api/inventory/items/`);
    return data;
  },

  getInventoryItem: async (id: string): Promise<InventoryItem> => {
    const { data } = await apiClient.get(`/api/inventory/items/${id}`);
    return data;
  },

  createInventoryItem: async (
    createData: CreateInventoryItem
  ): Promise<InventoryItem> => {
    const { data } = await apiClient.post<InventoryItem>(
      `/api/inventory/items/`,
      createData,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    return data;
  },

  updateInventoryItem: async (
    id: string,
    updateData: CreateInventoryItem
  ): Promise<InventoryItem> => {
    const { data } = await apiClient.patch<InventoryItem>(
      `/api/inventory/items/${id}/`,
      updateData,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    return data;
  },

  removeInventoryItem: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/inventory/items/${id}/`);
  },
};
