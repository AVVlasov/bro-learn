import { Response } from 'express';
import { Progress } from '../models/Progress';
import { User } from '../models/User';
import { Lesson } from '../models/Lesson';
import { Module } from '../models/Module';
import { AuthRequest } from '../middleware/auth';

const XP_PER_LEVEL = 100;

const calculateLevel = (xp: number): number => {
  return Math.floor(xp / XP_PER_LEVEL) + 1;
};

const updateUserStreak = async (userId: string): Promise<void> => {
  const user = await User.findById(userId);
  if (!user) return;

  const now = new Date();
  const lastActivity = new Date(user.lastActivityDate);
  const daysDiff = Math.floor((now.getTime() - lastActivity.getTime()) / (1000 * 60 * 60 * 24));

  if (daysDiff === 0) {
    // Активность в тот же день - не меняем streak
    return;
  } else if (daysDiff === 1) {
    // Активность на следующий день - увеличиваем streak
    user.streak += 1;
  } else {
    // Пропущено больше дня - сбрасываем streak
    user.streak = 1;
  }

  user.lastActivityDate = now;
  await user.save();
};

export const completeLesson = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { lessonId } = req.params;
    const { score } = req.body;

    const lesson = await Lesson.findById(lessonId).populate('moduleId');
    if (!lesson) {
      res.status(404).json({ 
        success: false,
        message: 'Урок не найден' 
      });
      return;
    }

    const module = await Module.findById(lesson.moduleId);
    if (!module) {
      res.status(404).json({ 
        success: false,
        message: 'Модуль не найден' 
      });
      return;
    }

    // Проверяем существующий прогресс
    let progress = await Progress.findOne({
      userId: req.userId,
      lessonId: lesson._id,
    });

    const isFirstCompletion = !progress || !progress.isCompleted;

    if (progress) {
      progress.isCompleted = true;
      progress.score = score || progress.score;
      progress.attempts += 1;
      progress.completedAt = new Date();
    } else {
      progress = await Progress.create({
        userId: req.userId,
        lessonId: lesson._id,
        moduleId: module._id,
        courseId: module.courseId,
        isCompleted: true,
        score,
        attempts: 1,
        completedAt: new Date(),
      });
    }

    await progress.save();

    // Начисляем XP только при первом прохождении
    let xpEarned = 0;
    if (isFirstCompletion) {
      xpEarned = lesson.xpReward;
      const user = await User.findById(req.userId);
      if (user) {
        user.xp += xpEarned;
        user.level = calculateLevel(user.xp);
        await user.save();
        await updateUserStreak(req.userId!);
      }
    }

    res.status(200).json({
      success: true,
      message: 'Урок завершен',
      data: {
        progress: {
          isCompleted: progress.isCompleted,
          score: progress.score,
          attempts: progress.attempts,
        },
        xpEarned,
        isFirstCompletion,
      },
    });
  } catch (error) {
    console.error('Ошибка завершения урока:', error);
    res.status(500).json({ 
      success: false,
      message: 'Ошибка сервера' 
    });
  }
};

export const getUserProgress = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) {
      res.status(404).json({ 
        success: false,
        message: 'Пользователь не найден' 
      });
      return;
    }

    const totalCompleted = await Progress.countDocuments({
      userId: req.userId,
      isCompleted: true,
    });

    const xpToNextLevel = XP_PER_LEVEL - (user.xp % XP_PER_LEVEL);
    const currentLevelProgress = (user.xp % XP_PER_LEVEL) / XP_PER_LEVEL * 100;

    res.status(200).json({
      success: true,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          level: user.level,
          xp: user.xp,
          streak: user.streak,
          lastActivityDate: user.lastActivityDate,
        },
        stats: {
          totalLessonsCompleted: totalCompleted,
          xpToNextLevel,
          currentLevelProgress: Math.round(currentLevelProgress),
        },
      },
    });
  } catch (error) {
    console.error('Ошибка получения прогресса:', error);
    res.status(500).json({ 
      success: false,
      message: 'Ошибка сервера' 
    });
  }
};

export const getCourseProgress = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { courseId } = req.params;

    const modules = await Module.find({ courseId });
    const moduleIds = modules.map(m => m._id);

    const completedLessons = await Progress.find({
      userId: req.userId,
      moduleId: { $in: moduleIds },
      isCompleted: true,
    }).populate('lessonId');

    const totalLessons = await Lesson.countDocuments({
      moduleId: { $in: moduleIds },
    });

    const progressPercentage = totalLessons > 0 
      ? Math.round((completedLessons.length / totalLessons) * 100) 
      : 0;

    res.status(200).json({
      success: true,
      data: {
        courseId,
        totalLessons,
        completedLessons: completedLessons.length,
        progressPercentage,
      },
    });
  } catch (error) {
    console.error('Ошибка получения прогресса курса:', error);
    res.status(500).json({ 
      success: false,
      message: 'Ошибка сервера' 
    });
  }
};
