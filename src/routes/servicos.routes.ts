import { Router } from 'express';
import {
  getServicos,
  getAllServicos,
  createServico,
  updateServico,
  deleteServico,
} from '../controllers/servico.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

// GET /api/servicos → Público
router.get('/', getServicos);

// GET /api/servicos/all → Admin
router.get('/all', authMiddleware, getAllServicos);

// POST /api/servicos → Admin
router.post('/', authMiddleware, createServico);

// PUT /api/servicos/:id → Admin
router.put('/:id', authMiddleware, updateServico);

// DELETE /api/servicos/:id → Admin
router.delete('/:id', authMiddleware, deleteServico);

export default router;