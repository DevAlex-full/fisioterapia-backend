import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AuthRequest } from '../middlewares/auth.middleware';

const prisma = new PrismaClient();

// ============================================================
// LOGIN
// ============================================================
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: 'Email e senha são obrigatórios.' });
      return;
    }

    const admin = await prisma.admin.findUnique({ where: { email } });

    if (!admin) {
      res.status(401).json({ error: 'Credenciais inválidas.' });
      return;
    }

    const senhaCorreta = await bcrypt.compare(password, admin.password);

    if (!senhaCorreta) {
      res.status(401).json({ error: 'Credenciais inválidas.' });
      return;
    }

    const token = jwt.sign(
      { id: admin.id, email: admin.email },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login realizado com sucesso!',
      token,
      admin: {
        id: admin.id,
        email: admin.email,
        nome: admin.nome,
      },
    });
  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

// ============================================================
// VERIFICAR TOKEN (me)
// ============================================================
export const me = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const admin = await prisma.admin.findUnique({
      where: { id: req.admin!.id },
      select: { id: true, email: true, nome: true, createdAt: true },
    });

    if (!admin) {
      res.status(404).json({ error: 'Admin não encontrado.' });
      return;
    }

    res.json({ admin });
  } catch (error) {
    console.error('Erro ao buscar admin:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

// ============================================================
// ALTERAR SENHA
// ============================================================
export const changePassword = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { senhaAtual, novaSenha } = req.body;

    if (!senhaAtual || !novaSenha) {
      res.status(400).json({ error: 'Senha atual e nova senha são obrigatórias.' });
      return;
    }

    if (novaSenha.length < 8) {
      res.status(400).json({ error: 'Nova senha deve ter no mínimo 8 caracteres.' });
      return;
    }

    const admin = await prisma.admin.findUnique({ where: { id: req.admin!.id } });

    if (!admin) {
      res.status(404).json({ error: 'Admin não encontrado.' });
      return;
    }

    const senhaCorreta = await bcrypt.compare(senhaAtual, admin.password);

    if (!senhaCorreta) {
      res.status(401).json({ error: 'Senha atual incorreta.' });
      return;
    }

    const hash = await bcrypt.hash(novaSenha, 12);

    await prisma.admin.update({
      where: { id: req.admin!.id },
      data: { password: hash },
    });

    res.json({ message: 'Senha alterada com sucesso!' });
  } catch (error) {
    console.error('Erro ao alterar senha:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};