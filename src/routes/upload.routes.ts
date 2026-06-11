import { Router } from 'express';
import { uploadFile, uploadBatch, deleteFile, upload } from '../controllers/upload.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

// Upload único
router.post('/',       authMiddleware, upload.single('file'),          uploadFile);

// Upload em lote (até 20 arquivos)
router.post('/batch',  authMiddleware, upload.array('files', 20),      uploadBatch);

// Deletar arquivo
router.delete('/',     authMiddleware, deleteFile);

export default router;