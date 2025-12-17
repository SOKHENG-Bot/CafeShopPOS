/** Menu API Functions to Reuqest/Respone to Backend **/

import { apiClient } from '@/lib/api/client';
import type { MenuCategory, MenuFilters, MenuItem } from '../types';

export const menuApi = {
  /* Get all menu items with optional filters */
  getMenuItems: async (filters?: MenuFilters): Promise<MenuItem[]> => {
    const { data } = await apiClient.get<MenuItem[]>('/api/menus/items/', {
      params: filters,
    });
    return data;
  },

  /* Get a single menu item by ID */
  getMenuItem: async (id: string): Promise<MenuItem> => {
    const { data } = await apiClient.get<MenuItem>(`/api/menus/items/${id}`);
    return data;
  },

  /* Get all menu categories */
  getCategories: async (): Promise<MenuCategory[]> => {
    const { data } = await apiClient.get<MenuCategory[]>(
      '/api/menus/categories/'
    );
    return data;
  },

  /* Get menu items by category ID */
  getItemsByCategory: async (categoryId: string): Promise<MenuItem[]> => {
    const { data } = await apiClient.get<MenuItem[]>(
      `/api/menus/categories/${categoryId}/`
    );
    return data;
  },

  /* create menu item function */
  createMenuItem: async (formData: FormData): Promise<MenuItem> => {
    const { data } = await apiClient.post<MenuItem>(
      `/api/menus/items/`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return data;
  },

  /* update menu item function */
  updateMenuItem: async (id: string, formData: FormData): Promise<MenuItem> => {
    const { data } = await apiClient.patch<MenuItem>(
      `/api/menus/items/${id}/`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return data;
  },

  /* cancel menu item function */
  deleteMenuItem: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/menus/items/${id}/`);
  },

  /* create category function */
  createCategory: async (name: string): Promise<MenuCategory> => {
    const { data } = await apiClient.post<MenuCategory>(
      `/api/menus/categories/`,
      { name },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    return data;
  },

  /* update category function */
  updateCategory: async (id: string, name: string): Promise<MenuCategory> => {
    const { data } = await apiClient.patch<MenuCategory>(
      `/api/menus/categories/${id}/`,
      { name },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    return data;
  },

  /* cancel category function */
  deleteCategory: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/menus/categories/${id}/`);
  },
};
