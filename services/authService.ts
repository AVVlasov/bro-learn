import { apiClient } from './api';
import * as SecureStore from 'expo-secure-store';

export interface RegisterData {
  email: string;
  password: string;
  name: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  level: number;
  xp: number;
  streak: number;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export const authService = {
  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await apiClient.post('/auth/register', data);
    const { user, accessToken, refreshToken } = response.data.data;

    await SecureStore.setItemAsync('accessToken', accessToken);
    await SecureStore.setItemAsync('refreshToken', refreshToken);

    return { user, accessToken, refreshToken };
  },

  login: async (data: LoginData): Promise<AuthResponse> => {
    console.log('[AUTH] Попытка входа:', { email: data.email });
    try {
      const response = await apiClient.post('/auth/login', data);
      console.log('[AUTH] Ответ сервера:', response.data);
      const { user, accessToken, refreshToken } = response.data.data;

      await SecureStore.setItemAsync('accessToken', accessToken);
      await SecureStore.setItemAsync('refreshToken', refreshToken);
      console.log('[AUTH] Токены сохранены, пользователь:', user);

      return { user, accessToken, refreshToken };
    } catch (error: any) {
      console.log('[AUTH] Ошибка входа:', error.message);
      console.log('[AUTH] Response status:', error.response?.status);
      console.log('[AUTH] Response data:', error.response?.data);
      throw error;
    }
  },

  logout: async (): Promise<void> => {
    await SecureStore.deleteItemAsync('accessToken');
    await SecureStore.deleteItemAsync('refreshToken');
  },

  getMe: async (): Promise<User> => {
    const response = await apiClient.get('/auth/me');
    return response.data.data.user;
  },

  isAuthenticated: async (): Promise<boolean> => {
    const token = await SecureStore.getItemAsync('accessToken');
    return !!token;
  },
};
