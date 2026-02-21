import { Router } from 'express';
import { getAbout, updateAbout } from '../controllers/about.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

// GET /api/about → Público
router.get('/', getAbout);

// PUT /api/about → Admin
router.put('/', authMiddleware, updateAbout);

export default router;