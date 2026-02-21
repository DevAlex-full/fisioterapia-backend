import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/servicos → Público
export const getServicos = async (_req: Request, res: Response): Promise<void> => {
  try {
    const servicos = await prisma.servico.findMany({
      where: { ativo: true },
      orderBy: { ordem: 'asc' },
    });
    res.json(servicos);
  } catch (error) {
    console.error('Erro ao buscar serviços:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

// GET /api/servicos/all → Admin (inclui inativos)
export const getAllServicos = async (_req: Request, res: Response): Promise<void> => {
  try {
    const servicos = await prisma.servico.findMany({
      orderBy: { ordem: 'asc' },
    });
    res.json(servicos);
  } catch (error) {
    console.error('Erro ao buscar todos os serviços:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

// POST /api/servicos → Admin
export const createServico = async (req: Request, res: Response): Promise<void> => {
  try {
    const { titulo, descricao, icone, beneficios, duracao, preco, cor, ordem } = req.body;

    if (!titulo || !descricao) {
      res.status(400).json({ error: 'Título e descrição são obrigatórios.' });
      return;
    }

    const servico = await prisma.servico.create({
      data: {
        titulo,
        descricao,
        icone: icone || '💆‍♀️',
        beneficios: beneficios || [],
        duracao: duracao || '60 min',
        preco: preco || 'Consulte',
        cor: cor || 'from-purple-400 to-purple-600',
        ordem: ordem || 0,
      },
    });

    res.status(201).json({ message: 'Serviço criado com sucesso!', servico });
  } catch (error) {
    console.error('Erro ao criar serviço:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

// PUT /api/servicos/:id → Admin
export const updateServico = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { titulo, descricao, icone, beneficios, duracao, preco, cor, ordem, ativo } = req.body;

    const exists = await prisma.servico.findUnique({ where: { id } });
    if (!exists) {
      res.status(404).json({ error: 'Serviço não encontrado.' });
      return;
    }

    const servico = await prisma.servico.update({
      where: { id },
      data: {
        ...(titulo !== undefined && { titulo }),
        ...(descricao !== undefined && { descricao }),
        ...(icone !== undefined && { icone }),
        ...(beneficios !== undefined && { beneficios }),
        ...(duracao !== undefined && { duracao }),
        ...(preco !== undefined && { preco }),
        ...(cor !== undefined && { cor }),
        ...(ordem !== undefined && { ordem }),
        ...(ativo !== undefined && { ativo }),
      },
    });

    res.json({ message: 'Serviço atualizado com sucesso!', servico });
  } catch (error) {
    console.error('Erro ao atualizar serviço:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

// DELETE /api/servicos/:id → Admin
export const deleteServico = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const exists = await prisma.servico.findUnique({ where: { id } });
    if (!exists) {
      res.status(404).json({ error: 'Serviço não encontrado.' });
      return;
    }

    await prisma.servico.delete({ where: { id } });
    res.json({ message: 'Serviço deletado com sucesso!' });
  } catch (error) {
    console.error('Erro ao deletar serviço:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};