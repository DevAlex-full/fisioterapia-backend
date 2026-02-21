import { Router } from 'express';
import { login, me, changePassword } from '../controllers/auth.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

// POST /api/auth/login → Login do admin
router.post('/login', login);

// GET /api/auth/me → Dados do admin logado (protegido)
router.get('/me', authMiddleware, me);

// PUT /api/auth/change-password → Alterar senha (protegido)
router.put('/change-password', authMiddleware, changePassword);

export default router;