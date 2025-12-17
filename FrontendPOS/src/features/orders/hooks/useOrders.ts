/** Orders Hooks using TanStack Query **/

// import { queryClient } from '@/app/queryClient'; // Never use queryClient from app folder (It work only in server side like Next.js)
import { queryKeys } from '@/app/queryClient';
import { ordersApi } from '../api/ordersApi';
import { useCart } from '@/features/cart/hooks/useCart';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export const useOrder = (id: string) => {
  return useQuery({
    queryKey: [...queryKeys.orders.detail, id],
    queryFn: () => ordersApi.getOrder(id),
    enabled: !!id, // Only fetch if ID provided
  });
};

export const useOrders = () => {
  return useQuery({
    queryKey: queryKeys.orders.list,
    queryFn: ordersApi.getOrders,
    refetchInterval: 30000, // auto-fetch every 30s
  });
};

export const useCreateOrder = () => {
  const { clearCart } = useCart();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ordersApi.createOrder,

    onSuccess: () => {
      clearCart();
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.list });
    },
  });
};

export const useUpdateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      ordersApi.updateOrder(id, status as any),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.list });
    },
  });
};

export const useCancelOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ordersApi.deleteOrder,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.list });
    },
  });
};
