import { Router } from 'express';
import {
  getDepoimentos,
  getAllDepoimentos,
  createDepoimento,
  updateDepoimento,
  deleteDepoimento,
} from '../controllers/depoimento.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.get('/',     getDepoimentos);
router.get('/all',  authMiddleware, getAllDepoimentos);
router.post('/',    authMiddleware, createDepoimento);
router.put('/:id',  authMiddleware, updateDepoimento);
router.delete('/:id', authMiddleware, deleteDepoimento);

export default router;