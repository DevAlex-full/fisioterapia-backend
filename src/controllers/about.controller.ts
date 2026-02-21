import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/about → Público
export const getAbout = async (_req: Request, res: Response): Promise<void> => {
  try {
    let about = await prisma.about.findFirst({ where: { ativo: true } });

    if (!about) {
      about = await prisma.about.create({ data: {} });
    }

    res.json(about);
  } catch (error) {
    console.error('Erro ao buscar about:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

// PUT /api/about → Admin
export const updateAbout = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      nome, titulo, descricao1, descricao2, fotoUrl,
      anosExp, pacientes, satisfacao, especializacoes,
      crefito, especialidade,
    } = req.body;

    let about = await prisma.about.findFirst();
    if (!about) {
      about = await prisma.about.create({ data: {} });
    }

    const updated = await prisma.about.update({
      where: { id: about.id },
      data: {
        ...(nome !== undefined && { nome }),
        ...(titulo !== undefined && { titulo }),
        ...(descricao1 !== undefined && { descricao1 }),
        ...(descricao2 !== undefined && { descricao2 }),
        ...(fotoUrl !== undefined && { fotoUrl }),
        ...(anosExp !== undefined && { anosExp: Number(anosExp) }),
        ...(pacientes !== undefined && { pacientes: Number(pacientes) }),
        ...(satisfacao !== undefined && { satisfacao: Number(satisfacao) }),
        ...(especializacoes !== undefined && { especializacoes: Number(especializacoes) }),
        ...(crefito !== undefined && { crefito }),
        ...(especialidade !== undefined && { especialidade }),
      },
    });

    res.json({ message: 'About atualizado com sucesso!', about: updated });
  } catch (error) {
    console.error('Erro ao atualizar about:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};