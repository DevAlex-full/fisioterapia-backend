import { Router } from 'express';
import { getFAQ, getAllFAQ, createFAQ, updateFAQ, deleteFAQ } from '../controllers/faq.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.get('/',       getFAQ);
router.get('/all',    authMiddleware, getAllFAQ);
router.post('/',      authMiddleware, createFAQ);
router.put('/:id',    authMiddleware, updateFAQ);
router.delete('/:id', authMiddleware, deleteFAQ);

export default router;