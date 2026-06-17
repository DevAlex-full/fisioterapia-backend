import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// ============================================================
// GET /api/settings → Público
// ============================================================
export const getSettings = async (_req: Request, res: Response): Promise<void> => {
  try {
    let settings = await prisma.siteSettings.findFirst();

    if (!settings) {
      settings = await prisma.siteSettings.create({ data: {} });
    }

    res.json(settings);
  } catch (error: any) {
    // FIX: log detalhado da causa real (antes só logava o objeto genérico).
    // Se a tabela "site_settings" não existir no banco, o Prisma lança um
    // erro com código P2021 ("table does not exist") — isso aparecerá
    // explicitamente nos logs do Render a partir de agora.
    console.error('❌ Erro ao buscar settings:', {
      message: error?.message,
      code:    error?.code,
      meta:    error?.meta,
    });

    // Se for erro de tabela ausente, devolve mensagem clara ao invés de 500 genérico.
    if (error?.code === 'P2021') {
      res.status(503).json({
        error: 'Tabela de configurações ainda não foi criada no banco. Rode "npx prisma db push" no backend.',
        code:  'TABLE_NOT_FOUND',
      });
      return;
    }

    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

// ============================================================
// PUT /api/settings → Admin
// ============================================================
export const updateSettings = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      nomeClinica,
      logoUrl,
      faviconUrl,
      corPrimaria,
      corSecundaria,
      corTexto,
      metaTitle,
      metaDesc,
      googleAnalytics,
      pixelFacebook,
      whatsappFloat,
      whatsappMsg,
    } = req.body;

    let settings = await prisma.siteSettings.findFirst();
    if (!settings) {
      settings = await prisma.siteSettings.create({ data: {} });
    }

    const updated = await prisma.siteSettings.update({
      where: { id: settings.id },
      data: {
        ...(nomeClinica     !== undefined && { nomeClinica }),
        ...(logoUrl         !== undefined && { logoUrl }),
        ...(faviconUrl      !== undefined && { faviconUrl }),
        ...(corPrimaria     !== undefined && { corPrimaria }),
        ...(corSecundaria   !== undefined && { corSecundaria }),
        ...(corTexto        !== undefined && { corTexto }),
        ...(metaTitle       !== undefined && { metaTitle }),
        ...(metaDesc        !== undefined && { metaDesc }),
        ...(googleAnalytics !== undefined && { googleAnalytics }),
        ...(pixelFacebook   !== undefined && { pixelFacebook }),
        ...(whatsappFloat   !== undefined && { whatsappFloat: Boolean(whatsappFloat) }),
        ...(whatsappMsg     !== undefined && { whatsappMsg }),
      },
    });

    res.json({ message: 'Configurações atualizadas com sucesso!', settings: updated });
  } catch (error: any) {
    console.error('❌ Erro ao atualizar settings:', {
      message: error?.message,
      code:    error?.code,
      meta:    error?.meta,
    });

    if (error?.code === 'P2021') {
      res.status(503).json({
        error: 'Tabela de configurações ainda não foi criada no banco. Rode "npx prisma db push" no backend.',
        code:  'TABLE_NOT_FOUND',
      });
      return;
    }

    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};