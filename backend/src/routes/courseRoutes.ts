import { Router } from 'express';
import { getAllCourses, getCourseById, getLessonById } from '../controllers/courseController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.use(authMiddleware);

router.get('/', getAllCourses);
router.get('/:courseId', getCourseById);
router.get('/lessons/:lessonId', getLessonById);

export default router;
