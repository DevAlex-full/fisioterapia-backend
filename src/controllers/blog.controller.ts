import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import slugify from 'slugify';

const prisma = new PrismaClient();

// GET /api/blog → Público (só publicados)
export const getPosts = async (_req: Request, res: Response): Promise<void> => {
  try {
    const posts = await prisma.blogPost.findMany({
      where: { publicado: true },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true, titulo: true, slug: true, excerpt: true,
        imagemUrl: true, autor: true, readTime: true,
        destaque: true, tags: true, createdAt: true,
      },
    });
    res.json(posts);
  } catch (error) {
    console.error('Erro ao buscar posts:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

// GET /api/blog/all → Admin (todos)
export const getAllPosts = async (_req: Request, res: Response): Promise<void> => {
  try {
    const posts = await prisma.blogPost.findMany({ orderBy: { createdAt: 'desc' } });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

// GET /api/blog/:slug → Público
export const getPostBySlug = async (req: Request, res: Response): Promise<void> => {
  try {
    const { slug } = req.params;
    const post = await prisma.blogPost.findUnique({
      where: { slug, publicado: true },
    });

    if (!post) {
      res.status(404).json({ error: 'Post não encontrado.' });
      return;
    }

    res.json(post);
  } catch (error) {
    console.error('Erro ao buscar post:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

// POST /api/blog → Admin
export const createPost = async (req: Request, res: Response): Promise<void> => {
  try {
    const { titulo, excerpt, conteudo, imagemUrl, autor, readTime, publicado, destaque, tags } = req.body;

    if (!titulo || !conteudo) {
      res.status(400).json({ error: 'Título e conteúdo são obrigatórios.' });
      return;
    }

    const slug = slugify(titulo, { lower: true, strict: true, locale: 'pt' });

    // Verifica slug duplicado
    const existing = await prisma.blogPost.findUnique({ where: { slug } });
    const finalSlug = existing ? `${slug}-${Date.now()}` : slug;

    const post = await prisma.blogPost.create({
      data: {
        titulo,
        slug: finalSlug,
        excerpt: excerpt || '',
        conteudo,
        imagemUrl: imagemUrl || null,
        autor: autor || 'Débora Santiago',
        readTime: readTime || '5 min',
        publicado: publicado || false,
        destaque: destaque || false,
        tags: tags || [],
      },
    });

    res.status(201).json({ message: 'Post criado com sucesso!', post });
  } catch (error) {
    console.error('Erro ao criar post:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

// PUT /api/blog/:id → Admin
export const updatePost = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { titulo, excerpt, conteudo, imagemUrl, autor, readTime, publicado, destaque, tags } = req.body;

    const exists = await prisma.blogPost.findUnique({ where: { id } });
    if (!exists) {
      res.status(404).json({ error: 'Post não encontrado.' });
      return;
    }

    // Atualiza slug se título mudou
    let slug = exists.slug;
    if (titulo && titulo !== exists.titulo) {
      const newSlug = slugify(titulo, { lower: true, strict: true, locale: 'pt' });
      const duplicate = await prisma.blogPost.findFirst({
        where: { slug: newSlug, NOT: { id } },
      });
      slug = duplicate ? `${newSlug}-${Date.now()}` : newSlug;
    }

    const post = await prisma.blogPost.update({
      where: { id },
      data: {
        ...(titulo !== undefined && { titulo, slug }),
        ...(excerpt !== undefined && { excerpt }),
        ...(conteudo !== undefined && { conteudo }),
        ...(imagemUrl !== undefined && { imagemUrl }),
        ...(autor !== undefined && { autor }),
        ...(readTime !== undefined && { readTime }),
        ...(publicado !== undefined && { publicado }),
        ...(destaque !== undefined && { destaque }),
        ...(tags !== undefined && { tags }),
      },
    });

    res.json({ message: 'Post atualizado com sucesso!', post });
  } catch (error) {
    console.error('Erro ao atualizar post:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

// DELETE /api/blog/:id → Admin
export const deletePost = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const exists = await prisma.blogPost.findUnique({ where: { id } });
    if (!exists) {
      res.status(404).json({ error: 'Post não encontrado.' });
      return;
    }
    await prisma.blogPost.delete({ where: { id } });
    res.json({ message: 'Post deletado com sucesso!' });
  } catch (error) {
    console.error('Erro ao deletar post:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};