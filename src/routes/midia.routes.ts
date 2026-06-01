import { Router } from 'express';
import {
  getMidias,
  getMidiaDestaque,
  getAllMidias,
  createMidia,
  updateMidia,
  reorderMidias,
  deleteMidia,
} from '../controllers/midia.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

// Rotas públicas
router.get('/',          getMidias);
router.get('/destaque',  getMidiaDestaque);

// Rotas admin
router.get('/all',           authMiddleware, getAllMidias);
router.post('/',             authMiddleware, createMidia);
router.put('/reorder',       authMiddleware, reorderMidias);
router.put('/:id',           authMiddleware, updateMidia);
router.delete('/:id',        authMiddleware, deleteMidia);

export default router;