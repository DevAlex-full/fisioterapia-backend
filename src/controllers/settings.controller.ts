import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/settings → Público
export const getSettings = async (_req: Request, res: Response): Promise<void> => {
  try {
    let settings = await prisma.siteSettings.findFirst();

    if (!settings) {
      settings = await prisma.siteSettings.create({ data: {} });
    }

    res.json(settings);
  } catch (error) {
    console.error('Erro ao buscar settings:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

// PUT /api/settings → Admin
export const updateSettings = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      nomeClinica, logoUrl, corPrimaria, corSecundaria,
      corTexto, metaTitle, metaDesc, googleAnalytics, pixelFacebook,
    } = req.body;

    let settings = await prisma.siteSettings.findFirst();
    if (!settings) {
      settings = await prisma.siteSettings.create({ data: {} });
    }

    const updated = await prisma.siteSettings.update({
      where: { id: settings.id },
      data: {
        ...(nomeClinica !== undefined && { nomeClinica }),
        ...(logoUrl !== undefined && { logoUrl }),
        ...(corPrimaria !== undefined && { corPrimaria }),
        ...(corSecundaria !== undefined && { corSecundaria }),
        ...(corTexto !== undefined && { corTexto }),
        ...(metaTitle !== undefined && { metaTitle }),
        ...(metaDesc !== undefined && { metaDesc }),
        ...(googleAnalytics !== undefined && { googleAnalytics }),
        ...(pixelFacebook !== undefined && { pixelFacebook }),
      },
    });

    res.json({ message: 'Configurações atualizadas com sucesso!', settings: updated });
  } catch (error) {
    console.error('Erro ao atualizar settings:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};