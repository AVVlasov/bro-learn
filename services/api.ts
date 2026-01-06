import axios, { AxiosInstance, AxiosError } from 'axios';
import * as SecureStore from 'expo-secure-store';

import { Platform } from 'react-native';

// Используем IP хоста для Android эмулятора
const API_URL = Platform.select({
  android: 'http://192.168.0.11:3000/api',
  ios: 'http://localhost:3000/api',
  default: 'http://localhost:3000/api',
});

console.log('[API] Platform:', Platform.OS);
console.log('[API] API_URL:', API_URL);

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor для добавления токена
    this.client.interceptors.request.use(
      async (config) => {
        console.log('[API] Request:', config.method?.toUpperCase(), config.baseURL, config.url);
        const token = await SecureStore.getItemAsync('accessToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor для обработки ошибок
    this.client.interceptors.response.use(
      (response) => {
        console.log('[API] Response:', response.config.method?.toUpperCase(), response.config.url, 'Status:', response.status);
        return response;
      },
      async (error: AxiosError) => {
        console.error('[API] Error:', error.message, 'Status:', error.response?.status);
        console.error('[API] Error data:', error.response?.data);
        if (error.response?.status === 401) {
          // Попытка обновить токен
          try {
            const refreshToken = await SecureStore.getItemAsync('refreshToken');
            if (refreshToken) {
              const response = await axios.post(`${API_URL}/auth/refresh`, {
                refreshToken,
              });

              const { accessToken, refreshToken: newRefreshToken } = response.data.data;
              
              await SecureStore.setItemAsync('accessToken', accessToken);
              await SecureStore.setItemAsync('refreshToken', newRefreshToken);

              // Повторяем оригинальный запрос
              if (error.config) {
                error.config.headers.Authorization = `Bearer ${accessToken}`;
                return this.client.request(error.config);
              }
            }
          } catch (refreshError) {
            // Если обновление токена не удалось, очищаем токены
            await SecureStore.deleteItemAsync('accessToken');
            await SecureStore.deleteItemAsync('refreshToken');
          }
        }
        return Promise.reject(error);
      }
    );
  }

  public getClient(): AxiosInstance {
    return this.client;
  }
}

export const apiClient = new ApiClient().getClient();
