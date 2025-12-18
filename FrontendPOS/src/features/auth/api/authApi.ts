/** Auth API Functions to Reuqest/Respone to Backend **/

import { apiClient } from '@/lib/api/client';
import { LoginCredentials, LoginResponse, User } from '../types';

/* collection of auth-related to API function */
export const authApi = {
  login: async (credential: LoginCredentials): Promise<LoginResponse> => {
    const { data } = await apiClient.post<LoginResponse>(
      '/auth/login/',
      credential
    );
    return data;
  },

  logout: async (): Promise<void> => {
    const refreshToken = tokenManager.getRefreshToken();

    if (!refreshToken) {
      throw new Error('No refresh token found');
    }

    await apiClient.post('/auth/logout/', {
      refresh: refreshToken,
    });
  },

  getCurrentUser: async (): Promise<User> => {
    const { data } = await apiClient.get<User>('/auth/me/');
    return data;
  },

  refreshToken: async (refresh: string): Promise<{ access: string }> => {
    const { data } = await apiClient.post<{ access: string }>(
      '/auth/token/refresh/',
      { refresh }
    );
    return data;
  },
};

/* localStorage helper for auth token */
export const tokenManager = {
  getToken: (): string | null => localStorage.getItem('authToken'),
  setToken: (access: string): void => localStorage.setItem('authToken', access),
  removeToken: (): void => localStorage.removeItem('authToken'),
  getRefreshToken: (): string | null => localStorage.getItem('refreshToken'),
  setRefreshToken: (refresh: string): void =>
    localStorage.setItem('refreshToken', refresh),
  removeRefreshToken: (): void => localStorage.removeItem('refreshToken'),
};
