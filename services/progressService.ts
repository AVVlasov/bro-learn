import { apiClient } from './api';

export interface UserProgress {
  user: {
    id: string;
    name: string;
    email: string;
    level: number;
    xp: number;
    streak: number;
    lastActivityDate: string;
  };
  stats: {
    totalLessonsCompleted: number;
    xpToNextLevel: number;
    currentLevelProgress: number;
  };
}

export interface CompleteLessonResponse {
  progress: {
    isCompleted: boolean;
    score?: number;
    attempts: number;
  };
  xpEarned: number;
  isFirstCompletion: boolean;
}

export const progressService = {
  completeLesson: async (lessonId: string, score?: number): Promise<CompleteLessonResponse> => {
    const response = await apiClient.post(`/progress/lessons/${lessonId}/complete`, { score });
    return response.data.data;
  },

  getUserProgress: async (): Promise<UserProgress> => {
    const response = await apiClient.get('/progress/me');
    return response.data.data;
  },

  getCourseProgress: async (courseId: string) => {
    const response = await apiClient.get(`/progress/courses/${courseId}`);
    return response.data.data;
  },
};
