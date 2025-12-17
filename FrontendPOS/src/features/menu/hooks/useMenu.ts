/** Menu Feature - TanStack Query Hooks **/

import { queryKeys } from '@/app/queryClient';
import { menuApi } from '../api/menuApi';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { MenuFilters } from '../types';

/* Hook to fetch all menu items with optional filter */
export const useMenuItems = (filters?: MenuFilters) => {
  return useQuery({
    queryKey: [...queryKeys.menu.items, filters],
    queryFn: () => menuApi.getMenuItems(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/* Hook to fetch a single menu item by ID */
export const useMenuItem = (id: string) => {
  return useQuery({
    queryKey: [...queryKeys.menu.item, id],
    queryFn: () => menuApi.getMenuItem(id),
    enabled: !!id, // Only fetch if id exists
  });
};

/* Hook to fetch all menu categories */
export const useMenuCategories = () => {
  return useQuery({
    queryKey: queryKeys.menu.categories,
    queryFn: () => menuApi.getCategories(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

/* Hook to fetch menu items by category ID */
export const useMenuItemsByCategory = (categoryId: string) => {
  return useQuery({
    queryKey: [...queryKeys.menu.category, categoryId],
    queryFn: () => menuApi.getItemsByCategory(categoryId),
    enabled: !!categoryId, // Only fetch if categoryId exists
  });
};

export const useCreateMenuItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: menuApi.createMenuItem,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.menu.items });
    },
  });
};

export const useUpdateMenuItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, formData }: { id: string; formData: FormData }) =>
      menuApi.updateMenuItem(id, formData),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.menu.items });
    },
  });
};

export const useRemoveMenuItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: menuApi.deleteMenuItem,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.menu.items });
    },
  });
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: menuApi.createCategory,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.menu.categories });
    },
  });
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, name }: { id: string; name: string }) =>
      menuApi.updateCategory(id, name),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.menu.categories });
    },
  });
};

export const useRemoveCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: menuApi.deleteCategory,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.menu.categories });
    },
  });
};
