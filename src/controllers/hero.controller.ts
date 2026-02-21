import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/hero → Público
export const getHero = async (_req: Request, res: Response): Promise<void> => {
  try {
    let hero = await prisma.hero.findFirst({ where: { ativo: true } });

    if (!hero) {
      // Cria registro padrão se não existir
      hero = await prisma.hero.create({ data: {} });
    }

    res.json(hero);
  } catch (error) {
    console.error('Erro ao buscar hero:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

// PUT /api/hero → Protegido (admin)
export const updateHero = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      titulo, subtitulo, descricao, videoUrl,
      posterUrl, badge, ctaPrimario, ctaSecundario,
    } = req.body;

    let hero = await prisma.hero.findFirst();

    if (!hero) {
      hero = await prisma.hero.create({ data: {} });
    }

    const updated = await prisma.hero.update({
      where: { id: hero.id },
      data: {
        ...(titulo !== undefined && { titulo }),
        ...(subtitulo !== undefined && { subtitulo }),
        ...(descricao !== undefined && { descricao }),
        ...(videoUrl !== undefined && { videoUrl }),
        ...(posterUrl !== undefined && { posterUrl }),
        ...(badge !== undefined && { badge }),
        ...(ctaPrimario !== undefined && { ctaPrimario }),
        ...(ctaSecundario !== undefined && { ctaSecundario }),
      },
    });

    res.json({ message: 'Hero atualizado com sucesso!', hero: updated });
  } catch (error) {
    console.error('Erro ao atualizar hero:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};