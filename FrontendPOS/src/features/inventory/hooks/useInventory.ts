import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { inventoryApi } from '../api/inventoryApi';
import { queryKeys } from '@/app/queryClient';
import type { CreateInventoryItem } from '../types';

/* Hook to fetch all inventory list */
export const useInventoryItems = () => {
  return useQuery({
    queryKey: queryKeys.inventory.items,
    queryFn: () => inventoryApi.getInventoryItems(),
    staleTime: 5 * 60 * 1000,
  });
};

/* Hook to fetch a single inventory by ID */
export const useInventoryItem = (id: string) => {
  return useQuery({
    queryKey: [...queryKeys.inventory.items, id],
    queryFn: () => inventoryApi.getInventoryItem(id),
    enabled: !!id,
  });
};

export const useCreateInventoryItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: inventoryApi.createInventoryItem,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.inventory.items });
    },
  });
};

export const useUpdateInventoryItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      updateData,
    }: {
      id: string;
      updateData: CreateInventoryItem;
    }) => inventoryApi.updateInventoryItem(id, updateData),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.inventory.items });
    },
  });
};

export const useRemoveInventoryItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: inventoryApi.removeInventoryItem,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.inventory.items });
    },
  });
};
