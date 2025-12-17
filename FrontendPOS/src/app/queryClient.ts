/** TanStack Query Client Configuration **/

import { QueryClient } from '@tanstack/react-query';

/* Create QueryClient with default configuration */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes - data stays fresh
      gcTime: 10 * 60 * 1000, // 10 minutes - garbage collection time (formerly cacheTime)
      retry: 1, // Retry failed requests once
      refetchOnWindowFocus: false, // Don't refetch when window regains focus
    },
    mutations: {
      retry: 0, // Don't retry mutations
    },
  },
});

/* Centralized query keys for type safety */
export const queryKeys = {
  auth: {
    user: ['auth', 'user'],
    session: ['auth', 'session'],
  },
  menu: {
    items: ['menu', 'items'],
    item: ['menu', 'item'],
    categories: ['menu', 'categories'],
    category: ['menu', 'category'],
    search: ['menu', 'search'],
  },
  cart: {
    items: ['cart', 'items'],
  },
  orders: {
    list: ['orders', 'list'],
    detail: ['orders', 'detail'],
  },
  inventory: {
    items: ['inventory', 'items'],
  },
} as const;
