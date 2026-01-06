import { create } from 'zustand';
import { progressService, UserProgress } from '@/services/progressService';

interface ProgressState {
  userProgress: UserProgress | null;
  isLoading: boolean;
  error: string | null;
  
  loadUserProgress: () => Promise<void>;
  completeLesson: (lessonId: string, score?: number) => Promise<{ xpEarned: number; isFirstCompletion: boolean }>;
  clearError: () => void;
}

export const useProgressStore = create<ProgressState>((set) => ({
  userProgress: null,
  isLoading: false,
  error: null,

  loadUserProgress: async () => {
    set({ isLoading: true, error: null });
    try {
      const userProgress = await progressService.getUserProgress();
      set({ userProgress, isLoading: false });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Ошибка загрузки прогресса';
      set({ error: errorMessage, isLoading: false });
    }
  },

  completeLesson: async (lessonId: string, score?: number) => {
    set({ isLoading: true, error: null });
    try {
      const result = await progressService.completeLesson(lessonId, score);
      
      // Обновляем прогресс пользователя
      const userProgress = await progressService.getUserProgress();
      set({ userProgress, isLoading: false });
      
      return { xpEarned: result.xpEarned, isFirstCompletion: result.isFirstCompletion };
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Ошибка завершения урока';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  clearError: () => set({ error: null }),
}));
