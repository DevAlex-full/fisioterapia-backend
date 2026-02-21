import { Request, Response } from 'express';
import { uploadToStorage, deleteFromStorage } from '../lib/supabase';
import multer from 'multer';

// Multer em memória (não salva em disco)
const storage = multer.memoryStorage();

export const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
  fileFilter: (_req, file, cb) => {
    const allowed = [
      'image/jpeg', 'image/png', 'image/webp', 'image/gif',
      'video/mp4', 'video/webm', 'video/mov',
    ];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Tipo de arquivo não suportado. Use imagens ou vídeos.'));
    }
  },
});

// ============================================================
// POST /api/upload → Admin — faz upload para o Supabase Storage
// ============================================================
export const uploadFile = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ error: 'Nenhum arquivo enviado.' });
      return;
    }

    const file = req.file;
    const isVideo = file.mimetype.startsWith('video/');
    const bucket = isVideo ? 'videos' : 'images';

    // Gera nome único
    const ext = file.originalname.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${ext}`;
    const path = `${bucket}/${fileName}`;

    const publicUrl = await uploadToStorage(
      'fisioterapia-cms', // nome do bucket no Supabase
      path,
      file.buffer,
      file.mimetype
    );

    res.status(201).json({
      message: 'Upload realizado com sucesso!',
      url: publicUrl,
      tipo: isVideo ? 'video' : 'image',
      nome: file.originalname,
      tamanho: file.size,
    });
  } catch (error: unknown) {
    console.error('Erro no upload:', error);
    const message = error instanceof Error ? error.message : 'Erro no upload';
    res.status(500).json({ error: message });
  }
};

// ============================================================
// DELETE /api/upload → Admin — deleta arquivo do Storage
// ============================================================
export const deleteFile = async (req: Request, res: Response): Promise<void> => {
  try {
    const { path } = req.body;

    if (!path) {
      res.status(400).json({ error: 'Path do arquivo é obrigatório.' });
      return;
    }

    await deleteFromStorage('fisioterapia-cms', path);
    res.json({ message: 'Arquivo deletado com sucesso!' });
  } catch (error: unknown) {
    console.error('Erro ao deletar arquivo:', error);
    const message = error instanceof Error ? error.message : 'Erro ao deletar';
    res.status(500).json({ error: message });
  }
};