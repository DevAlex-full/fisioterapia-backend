import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/contato → Público
export const getContato = async (_req: Request, res: Response): Promise<void> => {
  try {
    let contato = await prisma.contatoInfo.findFirst({ where: { ativo: true } });

    if (!contato) {
      contato = await prisma.contatoInfo.create({ data: {} });
    }

    res.json(contato);
  } catch (error) {
    console.error('Erro ao buscar contato:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

// PUT /api/contato → Admin
export const updateContato = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      telefone, whatsapp, email, instagram, instagramUrl,
      endereco, bairro, cidade, cep,
      horarioSemana, horarioSabado, mensagemWpp,
    } = req.body;

    let contato = await prisma.contatoInfo.findFirst();
    if (!contato) {
      contato = await prisma.contatoInfo.create({ data: {} });
    }

    const updated = await prisma.contatoInfo.update({
      where: { id: contato.id },
      data: {
        ...(telefone !== undefined && { telefone }),
        ...(whatsapp !== undefined && { whatsapp }),
        ...(email !== undefined && { email }),
        ...(instagram !== undefined && { instagram }),
        ...(instagramUrl !== undefined && { instagramUrl }),
        ...(endereco !== undefined && { endereco }),
        ...(bairro !== undefined && { bairro }),
        ...(cidade !== undefined && { cidade }),
        ...(cep !== undefined && { cep }),
        ...(horarioSemana !== undefined && { horarioSemana }),
        ...(horarioSabado !== undefined && { horarioSabado }),
        ...(mensagemWpp !== undefined && { mensagemWpp }),
      },
    });

    res.json({ message: 'Contato atualizado com sucesso!', contato: updated });
  } catch (error) {
    console.error('Erro ao atualizar contato:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};