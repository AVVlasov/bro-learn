import { Router } from 'express';
import { getAllAchievements } from '../controllers/achievementController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.use(authMiddleware);

router.get('/', getAllAchievements);

export default router;
