import { Router } from 'express';
import {
  getInstagramPosts,
  getAllInstagramPosts,
  createInstagramPost,
  updateInstagramPost,
  deleteInstagramPost,
} from '../controllers/instagram.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.get('/',       getInstagramPosts);
router.get('/all',    authMiddleware, getAllInstagramPosts);
router.post('/',      authMiddleware, createInstagramPost);
router.put('/:id',    authMiddleware, updateInstagramPost);
router.delete('/:id', authMiddleware, deleteInstagramPost);

export default router;