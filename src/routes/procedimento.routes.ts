import { Router } from 'express';
import {
  getProcedimentos,
  getAllProcedimentos,
  createProcedimento,
  updateProcedimento,
  deleteProcedimento,
} from '../controllers/procedimento.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.get('/',       getProcedimentos);
router.get('/all',    authMiddleware, getAllProcedimentos);
router.post('/',      authMiddleware, createProcedimento);
router.put('/:id',    authMiddleware, updateProcedimento);
router.delete('/:id', authMiddleware, deleteProcedimento);

export default router;