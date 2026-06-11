import { Request, Response } from 'express';
import { uploadToStorage, deleteFromStorage, ensureBucket } from '../lib/supabase';
import multer from 'multer';

const BUCKET = 'fisioterapia-cms';

// Multer em memória
const storage = multer.memoryStorage();

export const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
  fileFilter: (_req, file, cb) => {
    const allowed = [
      'image/jpeg', 'image/jpg', 'image/png', 'image/webp',
      'image/gif', 'image/heic', 'image/heif',
      'video/mp4', 'video/webm', 'video/mov', 'video/quicktime',
    ];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`Tipo não suportado: ${file.mimetype}. Use JPG, PNG, WebP ou MP4.`));
    }
  },
});

// ============================================================
// POST /api/upload — upload único
// ============================================================
export const uploadFile = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ error: 'Nenhum arquivo enviado.' });
      return;
    }

    await ensureBucket(BUCKET);

    const file     = req.file;
    const isVideo  = file.mimetype.startsWith('video/');
    const folder   = isVideo ? 'videos' : 'images';
    const ext      = (file.originalname.split('.').pop() || 'jpg').toLowerCase();
    const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${ext}`;

    const publicUrl = await uploadToStorage(BUCKET, fileName, file.buffer, file.mimetype);

    res.status(201).json({
      message: 'Upload realizado com sucesso!',
      url:     publicUrl,
      tipo:    isVideo ? 'video' : 'image',
      nome:    file.originalname,
      tamanho: file.size,
    });
  } catch (error: unknown) {
    console.error('Erro no upload:', error);
    const message = error instanceof Error ? error.message : 'Erro interno no upload.';
    res.status(500).json({ error: message });
  }
};

// ============================================================
// POST /api/upload/batch — upload em lote (múltiplos arquivos)
// ============================================================
export const uploadBatch = async (req: Request, res: Response): Promise<void> => {
  try {
    const files = req.files as Express.Multer.File[];
    if (!files || files.length === 0) {
      res.status(400).json({ error: 'Nenhum arquivo enviado.' });
      return;
    }

    await ensureBucket(BUCKET);

    const results: { nome: string; url: string; tipo: string; tamanho: number; erro?: string }[] = [];

    for (const file of files) {
      try {
        const isVideo  = file.mimetype.startsWith('video/');
        const folder   = isVideo ? 'videos' : 'images';
        const ext      = (file.originalname.split('.').pop() || 'jpg').toLowerCase();
        const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${ext}`;
        const url      = await uploadToStorage(BUCKET, fileName, file.buffer, file.mimetype);
        results.push({ nome: file.originalname, url, tipo: isVideo ? 'video' : 'image', tamanho: file.size });
      } catch (e) {
        results.push({
          nome:    file.originalname,
          url:     '',
          tipo:    'error',
          tamanho: file.size,
          erro:    e instanceof Error ? e.message : 'Falha no upload',
        });
      }
    }

    const ok    = results.filter(r => !r.erro);
    const fail  = results.filter(r => r.erro);

    res.status(200).json({
      message: `${ok.length} de ${files.length} arquivo(s) enviados com sucesso.`,
      results,
      total: files.length, sucesso: ok.length, falhas: fail.length,
    });
  } catch (error: unknown) {
    console.error('Erro no batch upload:', error);
    const message = error instanceof Error ? error.message : 'Erro interno.';
    res.status(500).json({ error: message });
  }
};

// ============================================================
// DELETE /api/upload — deletar arquivo do Storage
// ============================================================
export const deleteFile = async (req: Request, res: Response): Promise<void> => {
  try {
    const { path } = req.body;
    if (!path) { res.status(400).json({ error: 'Path é obrigatório.' }); return; }
    await deleteFromStorage(BUCKET, path);
    res.json({ message: 'Arquivo deletado com sucesso!' });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Erro ao deletar.';
    res.status(500).json({ error: message });
  }
};