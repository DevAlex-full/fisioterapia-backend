import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/depoimentos → Público
export const getDepoimentos = async (_req: Request, res: Response): Promise<void> => {
  try {
    const depoimentos = await prisma.depoimento.findMany({
      where: { ativo: true },
      orderBy: { ordem: 'asc' },
    });
    res.json(depoimentos);
  } catch (error) {
    console.error('Erro ao buscar depoimentos:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

// GET /api/depoimentos/all → Admin
export const getAllDepoimentos = async (_req: Request, res: Response): Promise<void> => {
  try {
    const depoimentos = await prisma.depoimento.findMany({ orderBy: { ordem: 'asc' } });
    res.json(depoimentos);
  } catch (error) {
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

// POST /api/depoimentos → Admin
export const createDepoimento = async (req: Request, res: Response): Promise<void> => {
  try {
    const { nome, procedimento, texto, rating, fotoUrl, ordem } = req.body;

    if (!nome || !procedimento || !texto) {
      res.status(400).json({ error: 'Nome, procedimento e texto são obrigatórios.' });
      return;
    }

    const depoimento = await prisma.depoimento.create({
      data: {
        nome,
        procedimento,
        texto,
        rating: rating || 5,
        fotoUrl: fotoUrl || null,
        ordem: ordem || 0,
      },
    });

    res.status(201).json({ message: 'Depoimento criado com sucesso!', depoimento });
  } catch (error) {
    console.error('Erro ao criar depoimento:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

// PUT /api/depoimentos/:id → Admin
export const updateDepoimento = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { nome, procedimento, texto, rating, fotoUrl, ordem, ativo } = req.body;

    const exists = await prisma.depoimento.findUnique({ where: { id } });
    if (!exists) {
      res.status(404).json({ error: 'Depoimento não encontrado.' });
      return;
    }

    const depoimento = await prisma.depoimento.update({
      where: { id },
      data: {
        ...(nome !== undefined && { nome }),
        ...(procedimento !== undefined && { procedimento }),
        ...(texto !== undefined && { texto }),
        ...(rating !== undefined && { rating }),
        ...(fotoUrl !== undefined && { fotoUrl }),
        ...(ordem !== undefined && { ordem }),
        ...(ativo !== undefined && { ativo }),
      },
    });

    res.json({ message: 'Depoimento atualizado com sucesso!', depoimento });
  } catch (error) {
    console.error('Erro ao atualizar depoimento:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

// DELETE /api/depoimentos/:id → Admin
export const deleteDepoimento = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const exists = await prisma.depoimento.findUnique({ where: { id } });
    if (!exists) {
      res.status(404).json({ error: 'Depoimento não encontrado.' });
      return;
    }
    await prisma.depoimento.delete({ where: { id } });
    res.json({ message: 'Depoimento deletado com sucesso!' });
  } catch (error) {
    console.error('Erro ao deletar depoimento:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};