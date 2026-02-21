import { Router } from 'express';
import { getSettings, updateSettings } from '../controllers/settings.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

// GET /api/settings → Público
router.get('/', getSettings);

// PUT /api/settings → Admin
router.put('/', authMiddleware, updateSettings);

export default router;