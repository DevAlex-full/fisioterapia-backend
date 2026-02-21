import { Router } from 'express';
import {
  getPosts,
  getAllPosts,
  getPostBySlug,
  createPost,
  updatePost,
  deletePost,
} from '../controllers/blog.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.get('/',         getPosts);
router.get('/all',      authMiddleware, getAllPosts);
router.get('/:slug',    getPostBySlug);
router.post('/',        authMiddleware, createPost);
router.put('/:id',      authMiddleware, updatePost);
router.delete('/:id',   authMiddleware, deletePost);

export default router;