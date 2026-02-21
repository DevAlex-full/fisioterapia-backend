import { Router } from 'express';
import { getHero, updateHero } from '../controllers/hero.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

// GET /api/hero → Público (site consome)
router.get('/', getHero);

// PUT /api/hero → Protegido (admin edita)
router.put('/', authMiddleware, updateHero);

export default router;