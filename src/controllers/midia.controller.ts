import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// ============================================================
// GET /api/midia → Público (só ativas)
// ============================================================
export const getMidias = async (req: Request, res: Response): Promise<void> => {
  try {
    const { categoria, tipo } = req.query;

    const midias = await prisma.midia.findMany({
      where: {
        ativo: true,
        ...(categoria ? { categoria: String(categoria) } : {}),
        ...(tipo ? { tipo: String(tipo) } : {}),
      },
      orderBy: [{ ordem: 'asc' }, { createdAt: 'desc' }],
    });

    res.json(midias);
  } catch (error) {
    console.error('Erro ao buscar mídias:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

// ============================================================
// GET /api/midia/destaque → Público (só destaques)
// ============================================================
export const getMidiaDestaque = async (_req: Request, res: Response): Promise<void> => {
  try {
    const midias = await prisma.midia.findMany({
      where: { ativo: true, destaque: true },
      orderBy: { ordem: 'asc' },
    });
    res.json(midias);
  } catch (error) {
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

// ============================================================
// GET /api/midia/all → Admin (todas, incluindo inativas)
// ============================================================
export const getAllMidias = async (req: Request, res: Response): Promise<void> => {
  try {
    const { categoria, tipo } = req.query;

    const midias = await prisma.midia.findMany({
      where: {
        ...(categoria ? { categoria: String(categoria) } : {}),
        ...(tipo ? { tipo: String(tipo) } : {}),
      },
      orderBy: [{ ordem: 'asc' }, { createdAt: 'desc' }],
    });

    res.json(midias);
  } catch (error) {
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

// ============================================================
// POST /api/midia → Admin
// ============================================================
export const createMidia = async (req: Request, res: Response): Promise<void> => {
  try {
    const { titulo, descricao, url, tipo, categoria, ordem, destaque } = req.body;

    if (!titulo || !url) {
      res.status(400).json({ error: 'Título e URL são obrigatórios.' });
      return;
    }

    const tiposValidos = ['image', 'video'];
    const categoriasValidas = ['geral', 'resultados', 'clinica', 'instagram'];

    if (tipo && !tiposValidos.includes(tipo)) {
      res.status(400).json({ error: 'Tipo inválido. Use: image ou video.' });
      return;
    }

    if (categoria && !categoriasValidas.includes(categoria)) {
      res.status(400).json({ error: 'Categoria inválida. Use: geral, resultados, clinica ou instagram.' });
      return;
    }

    const midia = await prisma.midia.create({
      data: {
        titulo,
        descricao: descricao || null,
        url,
        tipo: tipo || 'image',
        categoria: categoria || 'geral',
        ordem: ordem ?? 0,
        destaque: destaque ?? false,
      },
    });

    res.status(201).json({ message: 'Mídia criada com sucesso!', midia });
  } catch (error) {
    console.error('Erro ao criar mídia:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

// ============================================================
// PUT /api/midia/:id → Admin
// ============================================================
export const updateMidia = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { titulo, descricao, url, tipo, categoria, ordem, destaque, ativo } = req.body;

    const exists = await prisma.midia.findUnique({ where: { id } });
    if (!exists) {
      res.status(404).json({ error: 'Mídia não encontrada.' });
      return;
    }

    const midia = await prisma.midia.update({
      where: { id },
      data: {
        ...(titulo !== undefined && { titulo }),
        ...(descricao !== undefined && { descricao }),
        ...(url !== undefined && { url }),
        ...(tipo !== undefined && { tipo }),
        ...(categoria !== undefined && { categoria }),
        ...(ordem !== undefined && { ordem }),
        ...(destaque !== undefined && { destaque }),
        ...(ativo !== undefined && { ativo }),
      },
    });

    res.json({ message: 'Mídia atualizada com sucesso!', midia });
  } catch (error) {
    console.error('Erro ao atualizar mídia:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

// ============================================================
// PUT /api/midia/reorder → Admin (reordenar em lote)
// ============================================================
export const reorderMidias = async (req: Request, res: Response): Promise<void> => {
  try {
    const { items } = req.body as { items: { id: string; ordem: number }[] };

    if (!Array.isArray(items)) {
      res.status(400).json({ error: 'items deve ser um array de { id, ordem }.' });
      return;
    }

    await Promise.all(
      items.map(({ id, ordem }) =>
        prisma.midia.update({ where: { id }, data: { ordem } })
      )
    );

    res.json({ message: 'Ordem atualizada com sucesso!' });
  } catch (error) {
    console.error('Erro ao reordenar mídias:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

// ============================================================
// DELETE /api/midia/:id → Admin
// ============================================================
export const deleteMidia = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const exists = await prisma.midia.findUnique({ where: { id } });
    if (!exists) {
      res.status(404).json({ error: 'Mídia não encontrada.' });
      return;
    }

    await prisma.midia.delete({ where: { id } });
    res.json({ message: 'Mídia deletada com sucesso!' });
  } catch (error) {
    console.error('Erro ao deletar mídia:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};