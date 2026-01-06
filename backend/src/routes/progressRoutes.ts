import { Router } from 'express';
import { completeLesson, getUserProgress, getCourseProgress } from '../controllers/progressController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.use(authMiddleware);

router.post('/lessons/:lessonId/complete', completeLesson);
router.get('/me', getUserProgress);
router.get('/courses/:courseId', getCourseProgress);

export default router;
