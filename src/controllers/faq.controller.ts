import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/faq → Público
export const getFAQ = async (_req: Request, res: Response): Promise<void> => {
  try {
    const faqs = await prisma.fAQ.findMany({
      where: { ativo: true },
      orderBy: { ordem: 'asc' },
    });
    res.json(faqs);
  } catch (error) {
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

// GET /api/faq/all → Admin
export const getAllFAQ = async (_req: Request, res: Response): Promise<void> => {
  try {
    const faqs = await prisma.fAQ.findMany({ orderBy: { ordem: 'asc' } });
    res.json(faqs);
  } catch (error) {
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

// POST /api/faq → Admin
export const createFAQ = async (req: Request, res: Response): Promise<void> => {
  try {
    const { pergunta, resposta, ordem } = req.body;

    if (!pergunta || !resposta) {
      res.status(400).json({ error: 'Pergunta e resposta são obrigatórias.' });
      return;
    }

    const faq = await prisma.fAQ.create({
      data: { pergunta, resposta, ordem: ordem || 0 },
    });

    res.status(201).json({ message: 'FAQ criado com sucesso!', faq });
  } catch (error) {
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

// PUT /api/faq/:id → Admin
export const updateFAQ = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { pergunta, resposta, ordem, ativo } = req.body;

    const exists = await prisma.fAQ.findUnique({ where: { id } });
    if (!exists) {
      res.status(404).json({ error: 'FAQ não encontrado.' });
      return;
    }

    const faq = await prisma.fAQ.update({
      where: { id },
      data: {
        ...(pergunta !== undefined && { pergunta }),
        ...(resposta !== undefined && { resposta }),
        ...(ordem !== undefined && { ordem }),
        ...(ativo !== undefined && { ativo }),
      },
    });

    res.json({ message: 'FAQ atualizado com sucesso!', faq });
  } catch (error) {
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

// DELETE /api/faq/:id → Admin
export const deleteFAQ = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const exists = await prisma.fAQ.findUnique({ where: { id } });
    if (!exists) {
      res.status(404).json({ error: 'FAQ não encontrado.' });
      return;
    }
    await prisma.fAQ.delete({ where: { id } });
    res.json({ message: 'FAQ deletado com sucesso!' });
  } catch (error) {
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};