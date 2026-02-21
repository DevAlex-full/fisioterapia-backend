import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/instagram → Público
export const getInstagramPosts = async (_req: Request, res: Response): Promise<void> => {
  try {
    const posts = await prisma.instagramPost.findMany({
      where: { ativo: true },
      orderBy: { ordem: 'asc' },
    });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

// GET /api/instagram/all → Admin
export const getAllInstagramPosts = async (_req: Request, res: Response): Promise<void> => {
  try {
    const posts = await prisma.instagramPost.findMany({ orderBy: { ordem: 'asc' } });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

// POST /api/instagram → Admin
export const createInstagramPost = async (req: Request, res: Response): Promise<void> => {
  try {
    const { url, mediaUrl, tipo, posterUrl, legenda, ordem } = req.body;

    if (!url || !mediaUrl) {
      res.status(400).json({ error: 'URL e mídia são obrigatórios.' });
      return;
    }

    const post = await prisma.instagramPost.create({
      data: {
        url,
        mediaUrl,
        tipo: tipo || 'image',
        posterUrl: posterUrl || null,
        legenda: legenda || null,
        ordem: ordem || 0,
      },
    });

    res.status(201).json({ message: 'Post criado com sucesso!', post });
  } catch (error) {
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

// PUT /api/instagram/:id → Admin
export const updateInstagramPost = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { url, mediaUrl, tipo, posterUrl, legenda, ordem, ativo } = req.body;

    const exists = await prisma.instagramPost.findUnique({ where: { id } });
    if (!exists) {
      res.status(404).json({ error: 'Post não encontrado.' });
      return;
    }

    const post = await prisma.instagramPost.update({
      where: { id },
      data: {
        ...(url !== undefined && { url }),
        ...(mediaUrl !== undefined && { mediaUrl }),
        ...(tipo !== undefined && { tipo }),
        ...(posterUrl !== undefined && { posterUrl }),
        ...(legenda !== undefined && { legenda }),
        ...(ordem !== undefined && { ordem }),
        ...(ativo !== undefined && { ativo }),
      },
    });

    res.json({ message: 'Post atualizado com sucesso!', post });
  } catch (error) {
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

// DELETE /api/instagram/:id → Admin
export const deleteInstagramPost = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const exists = await prisma.instagramPost.findUnique({ where: { id } });
    if (!exists) {
      res.status(404).json({ error: 'Post não encontrado.' });
      return;
    }
    await prisma.instagramPost.delete({ where: { id } });
    res.json({ message: 'Post deletado com sucesso!' });
  } catch (error) {
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};