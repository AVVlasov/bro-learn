import { create } from 'zustand';
import { authService, User } from '@/services/authService';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loadUser: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true, // Начинаем с true, чтобы избежать редиректа до загрузки
  isAuthenticated: false,
  error: null,

  login: async (email: string, password: string) => {
    console.log('[STORE] Login начат:', email);
    set({ isLoading: true, error: null });
    try {
      const { user } = await authService.login({ email, password });
      console.log('[STORE] Login успешен:', user);
      set({ user, isAuthenticated: true, isLoading: false });
    } catch (error: any) {
      console.log('[STORE] Login ошибка:', error);
      const errorMessage = error.response?.data?.message || 'Ошибка входа';
      console.log('[STORE] Error message:', errorMessage);
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  register: async (name: string, email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const { user } = await authService.register({ name, email, password });
      set({ user, isAuthenticated: true, isLoading: false });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Ошибка регистрации';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      await authService.logout();
      set({ user: null, isAuthenticated: false, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
    }
  },

  loadUser: async () => {
    set({ isLoading: true });
    try {
      const isAuth = await authService.isAuthenticated();
      if (isAuth) {
        const user = await authService.getMe();
        set({ user, isAuthenticated: true, isLoading: false });
      } else {
        set({ isLoading: false });
      }
    } catch (error) {
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },

  clearError: () => set({ error: null }),
}));
