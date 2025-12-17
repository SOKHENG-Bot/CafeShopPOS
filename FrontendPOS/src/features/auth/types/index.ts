/** Auth Feature - TypeScript Types **/

export interface User {
  id: string;
  username: string;
  is_superuser: string;
  createdAt?: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: {
    access: string;
    refresh: string;
  };
}

export interface AuthState {
  user: User | null; ///null when not logged in
  isAuthenticated: boolean;
  isLoading: boolean;
}
