import { apiClient } from './api';

export interface Course {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  order: number;
  totalLessons: number;
  completedLessons: number;
  progressPercentage: number;
  estimatedHours: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export interface Lesson {
  id: string;
  title: string;
  type: 'theory' | 'quiz' | 'practice' | 'flashcard';
  order: number;
  xpReward: number;
  estimatedMinutes: number;
  isCompleted: boolean;
  score?: number;
}

export interface Module {
  id: string;
  title: string;
  description: string;
  order: number;
  isLocked: boolean;
  requiredXP: number;
  lessons: Lesson[];
  progressPercentage: number;
  totalLessons: number;
  completedLessons: number;
}

export interface CourseDetail {
  course: {
    id: string;
    title: string;
    description: string;
    icon: string;
    color: string;
    difficulty: string;
    estimatedHours: number;
  };
  modules: Module[];
}

export interface LessonDetail {
  lesson: {
    id: string;
    title: string;
    type: string;
    content?: string;
    imageUrl?: string;
    videoUrl?: string;
    quizQuestions?: Array<{
      question: string;
      options: Array<{ text: string; isCorrect: boolean }>;
      explanation?: string;
    }>;
    practiceSteps?: string[];
    flashcards?: Array<{ front: string; back: string }>;
    xpReward: number;
    estimatedMinutes: number;
  };
  progress: {
    isCompleted: boolean;
    score?: number;
    attempts: number;
  };
}

export const courseService = {
  getAllCourses: async (): Promise<Course[]> => {
    try {
      console.log('[COURSE_SERVICE] Запрос курсов...');
      const response = await apiClient.get('/courses');
      console.log('[COURSE_SERVICE] Ответ получен, статус:', response.status);
      console.log('[COURSE_SERVICE] Структура ответа:', JSON.stringify(response.data).substring(0, 300));
      const courses = response.data.data.courses;
      console.log('[COURSE_SERVICE] Курсов получено:', courses?.length || 0);
      return courses;
    } catch (error: any) {
      console.error('[COURSE_SERVICE] Ошибка при получении курсов:', error.message);
      console.error('[COURSE_SERVICE] Response:', error.response?.data);
      throw error;
    }
  },

  getCourseById: async (courseId: string): Promise<CourseDetail> => {
    const response = await apiClient.get(`/courses/${courseId}`);
    return response.data.data;
  },

  getLessonById: async (lessonId: string): Promise<LessonDetail> => {
    const response = await apiClient.get(`/courses/lessons/${lessonId}`);
    return response.data.data;
  },
};
