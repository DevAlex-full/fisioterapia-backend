import { Router } from 'express';
import { uploadFile, deleteFile, upload } from '../controllers/upload.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

// POST /api/upload → Admin (com multer)
router.post('/', authMiddleware, upload.single('file'), uploadFile);

// DELETE /api/upload → Admin
router.delete('/', authMiddleware, deleteFile);

export default router;