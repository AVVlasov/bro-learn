import express, { Application } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDatabase } from './config/database';
import authRoutes from './routes/authRoutes';
import courseRoutes from './routes/courseRoutes';
import progressRoutes from './routes/progressRoutes';
import achievementRoutes from './routes/achievementRoutes';

// Загрузка переменных окружения
dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Базовый роут для проверки работы сервера
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'BroLearn API работает',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/achievements', achievementRoutes);

// Подключение к базе данных и запуск сервера
const startServer = async () => {
  try {
    await connectDatabase();
    
    app.listen(Number(PORT), '0.0.0.0', () => {
      console.log(`🚀 Сервер запущен на 0.0.0.0:${PORT}`);
      console.log(`📍 Health check: http://localhost:${PORT}/health`);
    });
  } catch (error) {
    console.error('❌ Ошибка запуска сервера:', error);
    process.exit(1);
  }
};

startServer();

export default app;
