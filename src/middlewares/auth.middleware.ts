import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Extende o tipo Request para incluir o admin
export interface AuthRequest extends Request {
  admin?: {
    id: string;
    email: string;
  };
}

interface JwtPayload {
  id: string;
  email: string;
  iat: number;
  exp: number;
}

// ============================================================
// MIDDLEWARE — Verifica token JWT
// ============================================================
export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ error: 'Token não fornecido. Acesso negado.' });
      return;
    }

    const token = authHeader.split(' ')[1];
    const secret = process.env.JWT_SECRET!;

    if (!secret) {
      res.status(500).json({ error: 'Configuração de segurança inválida.' });
      return;
    }

    const decoded = jwt.verify(token, secret) as JwtPayload;

    req.admin = {
      id: decoded.id,
      email: decoded.email,
    };

    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({ error: 'Token expirado. Faça login novamente.' });
      return;
    }
    res.status(401).json({ error: 'Token inválido.' });
  }
};