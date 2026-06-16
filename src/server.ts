import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';

import authRoutes         from './routes/auth.routes';
import heroRoutes         from './routes/hero.routes';
import aboutRoutes        from './routes/about.routes';
import servicosRoutes     from './routes/servicos.routes';
import depoimentosRoutes  from './routes/depoimentos.routes';
import blogRoutes         from './routes/blog.routes';
import faqRoutes          from './routes/faq.routes';
import instagramRoutes    from './routes/instagram.routes';
import contatoRoutes      from './routes/contato.routes';
import procedimentoRoutes from './routes/procedimento.routes';
import settingsRoutes     from './routes/settings.routes';
import uploadRoutes       from './routes/upload.routes';
import midiaRoutes        from './routes/midia.routes';

dotenv.config();

const app  = express();
const PORT = process.env.PORT || 3001;

// Rate limiting: Login — 10 tentativas / 15 min por IP
const loginLimiter = rateLimit({
  windowMs:        15 * 60 * 1000,
  max:             10,
  standardHeaders: true,
  legacyHeaders:   false,
  message:         { error: 'Muitas tentativas de login. Aguarde 15 minutos.' },
  skip:            (req) => req.method !== 'POST',
});

// Rate limiting: Geral — 300 req / min por IP
const generalLimiter = rateLimit({
  windowMs: 60 * 1000,
  max:      300,
  message:  { error: 'Muitas requisições. Tente novamente em instantes.' },
});

app.use(cors({
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:5173',
    'https://deborasantiago.com',
  ],
  credentials:    true,
  methods:        ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(generalLimiter);

// Health check — sem expor NODE_ENV
app.get('/health', (_req, res) => {
  res.json({
    status:    'OK',
    message:   'API Fisioterapia Débora Santiago — Online',
    timestamp: new Date().toISOString(),
    version:   '2.0.0',
  });
});

// Rotas
app.use('/api/auth',          loginLimiter, authRoutes);
app.use('/api/hero',          heroRoutes);
app.use('/api/about',         aboutRoutes);
app.use('/api/servicos',      servicosRoutes);
app.use('/api/depoimentos',   depoimentosRoutes);
app.use('/api/blog',          blogRoutes);
app.use('/api/faq',           faqRoutes);
app.use('/api/instagram',     instagramRoutes);
app.use('/api/contato',       contatoRoutes);
app.use('/api/procedimentos', procedimentoRoutes);
app.use('/api/settings',      settingsRoutes);
app.use('/api/upload',        uploadRoutes);
app.use('/api/midia',         midiaRoutes);

// 404
app.use((_req, res) => {
  res.status(404).json({ error: 'Rota não encontrada.' });
});

app.listen(PORT, () => {
  console.log(`✅ Servidor rodando na porta ${PORT}`);
});

export default app;