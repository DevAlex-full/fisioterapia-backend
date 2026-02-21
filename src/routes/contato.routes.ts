import { Router } from 'express';
import { getContato, updateContato } from '../controllers/contato.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.get('/', getContato);
router.put('/', authMiddleware, updateContato);

export default router;