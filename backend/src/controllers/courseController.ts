import { Response } from 'express';
import { Course } from '../models/Course';
import { Module } from '../models/Module';
import { Lesson } from '../models/Lesson';
import { Progress } from '../models/Progress';
import { AuthRequest } from '../middleware/auth';

export const getAllCourses = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const courses = await Course.find({ isActive: true }).sort({ order: 1 });

    // Получаем прогресс пользователя для каждого курса
    const coursesWithProgress = await Promise.all(
      courses.map(async (course) => {
        const totalLessons = await Lesson.countDocuments({
          moduleId: { $in: await Module.find({ courseId: course._id }).distinct('_id') }
        });

        const completedLessons = await Progress.countDocuments({
          userId: req.userId,
          courseId: course._id,
          isCompleted: true,
        });

        const progressPercentage = totalLessons > 0 
          ? Math.round((completedLessons / totalLessons) * 100) 
          : 0;

        return {
          id: course._id,
          title: course.title,
          description: course.description,
          icon: course.icon,
          color: course.color,
          order: course.order,
          totalLessons,
          completedLessons,
          progressPercentage,
          estimatedHours: course.estimatedHours,
          difficulty: course.difficulty,
        };
      })
    );

    res.status(200).json({
      success: true,
      data: { courses: coursesWithProgress },
    });
  } catch (error) {
    console.error('Ошибка получения курсов:', error);
    res.status(500).json({ 
      success: false,
      message: 'Ошибка сервера' 
    });
  }
};

export const getCourseById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { courseId } = req.params;

    const course = await Course.findById(courseId);
    if (!course) {
      res.status(404).json({ 
        success: false,
        message: 'Курс не найден' 
      });
      return;
    }

    const modules = await Module.find({ courseId }).sort({ order: 1 });

    const modulesWithProgress = await Promise.all(
      modules.map(async (module) => {
        const lessons = await Lesson.find({ moduleId: module._id }).sort({ order: 1 });

        const lessonsWithProgress = await Promise.all(
          lessons.map(async (lesson) => {
            const progress = await Progress.findOne({
              userId: req.userId,
              lessonId: lesson._id,
            });

            return {
              id: lesson._id,
              title: lesson.title,
              type: lesson.type,
              order: lesson.order,
              xpReward: lesson.xpReward,
              estimatedMinutes: lesson.estimatedMinutes,
              isCompleted: progress?.isCompleted || false,
              score: progress?.score,
            };
          })
        );

        const completedCount = lessonsWithProgress.filter(l => l.isCompleted).length;
        const progressPercentage = lessons.length > 0 
          ? Math.round((completedCount / lessons.length) * 100) 
          : 0;

        return {
          id: module._id,
          title: module.title,
          description: module.description,
          order: module.order,
          isLocked: module.isLocked,
          requiredXP: module.requiredXP,
          lessons: lessonsWithProgress,
          progressPercentage,
          totalLessons: lessons.length,
          completedLessons: completedCount,
        };
      })
    );

    res.status(200).json({
      success: true,
      data: {
        course: {
          id: course._id,
          title: course.title,
          description: course.description,
          icon: course.icon,
          color: course.color,
          difficulty: course.difficulty,
          estimatedHours: course.estimatedHours,
        },
        modules: modulesWithProgress,
      },
    });
  } catch (error) {
    console.error('Ошибка получения курса:', error);
    res.status(500).json({ 
      success: false,
      message: 'Ошибка сервера' 
    });
  }
};

export const getLessonById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { lessonId } = req.params;

    const lesson = await Lesson.findById(lessonId).populate('moduleId');
    if (!lesson) {
      res.status(404).json({ 
        success: false,
        message: 'Урок не найден' 
      });
      return;
    }

    const progress = await Progress.findOne({
      userId: req.userId,
      lessonId: lesson._id,
    });

    res.status(200).json({
      success: true,
      data: {
        lesson: {
          id: lesson._id,
          title: lesson.title,
          type: lesson.type,
          content: lesson.content,
          imageUrl: lesson.imageUrl,
          videoUrl: lesson.videoUrl,
          quizQuestions: lesson.quizQuestions,
          practiceSteps: lesson.practiceSteps,
          flashcards: lesson.flashcards,
          xpReward: lesson.xpReward,
          estimatedMinutes: lesson.estimatedMinutes,
        },
        progress: {
          isCompleted: progress?.isCompleted || false,
          score: progress?.score,
          attempts: progress?.attempts || 0,
        },
      },
    });
  } catch (error) {
    console.error('Ошибка получения урока:', error);
    res.status(500).json({ 
      success: false,
      message: 'Ошибка сервера' 
    });
  }
};
