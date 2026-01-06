import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { User } from '../models/User';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt';
import { AuthRequest } from '../middleware/auth';

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, name } = req.body;

    // Валидация
    if (!email || !password || !name) {
      res.status(400).json({ 
        success: false,
        message: 'Все поля обязательны для заполнения' 
      });
      return;
    }

    if (password.length < 6) {
      res.status(400).json({ 
        success: false,
        message: 'Пароль должен содержать минимум 6 символов' 
      });
      return;
    }

    // Проверка существующего пользователя
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      res.status(400).json({ 
        success: false,
        message: 'Пользователь с таким email уже существует' 
      });
      return;
    }

    // Хеширование пароля
    const hashedPassword = await bcrypt.hash(password, 10);

    // Создание пользователя
    const user = await User.create({
      email: email.toLowerCase(),
      password: hashedPassword,
      name,
    });

    // Генерация токенов
    const accessToken = generateAccessToken({ 
      userId: user._id.toString(), 
      email: user.email 
    });
    const refreshToken = generateRefreshToken({ 
      userId: user._id.toString(), 
      email: user.email 
    });

    res.status(201).json({
      success: true,
      message: 'Регистрация успешна',
      data: {
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          level: user.level,
          xp: user.xp,
          streak: user.streak,
        },
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    console.error('Ошибка регистрации:', error);
    res.status(500).json({ 
      success: false,
      message: 'Ошибка сервера при регистрации' 
    });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Валидация
    if (!email || !password) {
      res.status(400).json({ 
        success: false,
        message: 'Email и пароль обязательны' 
      });
      return;
    }

    // Поиск пользователя
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      res.status(401).json({ 
        success: false,
        message: 'Неверный email или пароль' 
      });
      return;
    }

    // Проверка пароля
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(401).json({ 
        success: false,
        message: 'Неверный email или пароль' 
      });
      return;
    }

    // Генерация токенов
    const accessToken = generateAccessToken({ 
      userId: user._id.toString(), 
      email: user.email 
    });
    const refreshToken = generateRefreshToken({ 
      userId: user._id.toString(), 
      email: user.email 
    });

    res.status(200).json({
      success: true,
      message: 'Вход выполнен успешно',
      data: {
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          level: user.level,
          xp: user.xp,
          streak: user.streak,
        },
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    console.error('Ошибка входа:', error);
    res.status(500).json({ 
      success: false,
      message: 'Ошибка сервера при входе' 
    });
  }
};

export const refresh = async (req: Request, res: Response): Promise<void> => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      res.status(400).json({ 
        success: false,
        message: 'Refresh token не предоставлен' 
      });
      return;
    }

    // Проверка refresh token
    const decoded = verifyRefreshToken(refreshToken);

    // Генерация новых токенов
    const newAccessToken = generateAccessToken({ 
      userId: decoded.userId, 
      email: decoded.email 
    });
    const newRefreshToken = generateRefreshToken({ 
      userId: decoded.userId, 
      email: decoded.email 
    });

    res.status(200).json({
      success: true,
      message: 'Токены обновлены',
      data: {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      },
    });
  } catch (error) {
    console.error('Ошибка обновления токена:', error);
    res.status(401).json({ 
      success: false,
      message: 'Недействительный refresh token' 
    });
  }
};

export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.userId).select('-password');

    if (!user) {
      res.status(404).json({ 
        success: false,
        message: 'Пользователь не найден' 
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: {
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          level: user.level,
          xp: user.xp,
          streak: user.streak,
          lastActivityDate: user.lastActivityDate,
          createdAt: user.createdAt,
        },
      },
    });
  } catch (error) {
    console.error('Ошибка получения профиля:', error);
    res.status(500).json({ 
      success: false,
      message: 'Ошибка сервера' 
    });
  }
};
