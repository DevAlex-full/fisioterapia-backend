import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/procedimentos → Público
export const getProcedimentos = async (_req: Request, res: Response): Promise<void> => {
  try {
    const procedimentos = await prisma.procedimento.findMany({
      where: { ativo: true },
      orderBy: { ordem: 'asc' },
    });
    res.json(procedimentos);
  } catch (error) {
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

// GET /api/procedimentos/all → Admin
export const getAllProcedimentos = async (_req: Request, res: Response): Promise<void> => {
  try {
    const procedimentos = await prisma.procedimento.findMany({ orderBy: { ordem: 'asc' } });
    res.json(procedimentos);
  } catch (error) {
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

// POST /api/procedimentos → Admin
export const createProcedimento = async (req: Request, res: Response): Promise<void> => {
  try {
    const { nome, ordem } = req.body;

    if (!nome) {
      res.status(400).json({ error: 'Nome é obrigatório.' });
      return;
    }

    const procedimento = await prisma.procedimento.create({
      data: { nome, ordem: ordem || 0 },
    });

    res.status(201).json({ message: 'Procedimento criado com sucesso!', procedimento });
  } catch (error) {
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

// PUT /api/procedimentos/:id → Admin
export const updateProcedimento = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { nome, ordem, ativo } = req.body;

    const exists = await prisma.procedimento.findUnique({ where: { id } });
    if (!exists) {
      res.status(404).json({ error: 'Procedimento não encontrado.' });
      return;
    }

    const procedimento = await prisma.procedimento.update({
      where: { id },
      data: {
        ...(nome !== undefined && { nome }),
        ...(ordem !== undefined && { ordem }),
        ...(ativo !== undefined && { ativo }),
      },
    });

    res.json({ message: 'Procedimento atualizado!', procedimento });
  } catch (error) {
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

// DELETE /api/procedimentos/:id → Admin
export const deleteProcedimento = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const exists = await prisma.procedimento.findUnique({ where: { id } });
    if (!exists) {
      res.status(404).json({ error: 'Procedimento não encontrado.' });
      return;
    }
    await prisma.procedimento.delete({ where: { id } });
    res.json({ message: 'Procedimento deletado com sucesso!' });
  } catch (error) {
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};