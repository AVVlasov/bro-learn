import { Response } from 'express';
import { Achievement, UserAchievement } from '../models/Achievement';
import { User } from '../models/User';
import { AuthRequest } from '../middleware/auth';

export const getAllAchievements = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const achievements = await Achievement.find();
    const userAchievements = await UserAchievement.find({ userId: req.userId });
    
    const unlockedIds = new Set(userAchievements.map(ua => ua.achievementId.toString()));

    const achievementsWithStatus = achievements.map(achievement => ({
      id: achievement._id,
      title: achievement.title,
      description: achievement.description,
      icon: achievement.icon,
      type: achievement.type,
      requirement: achievement.requirement,
      xpReward: achievement.xpReward,
      unlocked: unlockedIds.has(achievement._id.toString()),
    }));

    res.status(200).json({
      success: true,
      data: { achievements: achievementsWithStatus },
    });
  } catch (error) {
    console.error('Ошибка получения достижений:', error);
    res.status(500).json({ 
      success: false,
      message: 'Ошибка сервера' 
    });
  }
};

export const checkAndUnlockAchievements = async (userId: string): Promise<void> => {
  try {
    const user = await User.findById(userId);
    if (!user) return;

    const achievements = await Achievement.find();
    const userAchievements = await UserAchievement.find({ userId });
    const unlockedIds = new Set(userAchievements.map(ua => ua.achievementId.toString()));

    for (const achievement of achievements) {
      if (unlockedIds.has(achievement._id.toString())) continue;

      let shouldUnlock = false;

      switch (achievement.type) {
        case 'xp':
          shouldUnlock = user.xp >= achievement.requirement;
          break;
        case 'streak':
          shouldUnlock = user.streak >= achievement.requirement;
          break;
        // Другие типы достижений можно добавить здесь
      }

      if (shouldUnlock) {
        await UserAchievement.create({
          userId,
          achievementId: achievement._id,
        });

        // Начисляем XP за достижение
        user.xp += achievement.xpReward;
        await user.save();
      }
    }
  } catch (error) {
    console.error('Ошибка проверки достижений:', error);
  }
};
