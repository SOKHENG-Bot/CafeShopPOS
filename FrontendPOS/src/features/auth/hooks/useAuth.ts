/** React Hooks using TanStack Query for Auth State Management **/

// import { queryClient } from '@/app/queryClient'; // Never use queryClient from app folder (It work only in server side like Next.js)
import { queryKeys } from '@/app/queryClient';
import { LoginResponse } from '../types';
import { authApi, tokenManager } from '../api/authApi';
import { useNavigate } from '@tanstack/react-router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const useUser = () => {
  return useQuery({
    queryKey: queryKeys.auth.user,
    queryFn: authApi.getCurrentUser,
    enabled: !!tokenManager.getToken(),
    retry: false,
  });
};

export const useLogin = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.login,
    onSuccess: (data: LoginResponse): void => {
      tokenManager.setToken(data.token.access);
      tokenManager.setRefreshToken(data.token.refresh);
      queryClient.setQueryData(queryKeys.auth.user, data.user);
      navigate({ to: '/home' });
    },
  });
};

export const useLogout = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.logout,
    onSuccess: (): void => {
      tokenManager.removeToken();
      tokenManager.setRefreshToken('');
      queryClient.clear();
      navigate({ to: '/login' });
    },
  });
};

export const useAuth = () => {
  const { data: user, isLoading } = useUser();
  const { mutate: logout } = useLogout();

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    logout,
  };
};
