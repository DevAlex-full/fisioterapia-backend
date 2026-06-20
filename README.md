# Débora Santiago - Backend

API REST responsável pelo gerenciamento completo do site institucional e painel administrativo da clínica Débora Santiago.

## Sobre o Projeto

Backend desenvolvido para fornecer autenticação, gerenciamento de conteúdo e integração com banco de dados para o sistema administrativo da clínica.

## Tecnologias Utilizadas

* Node.js
* Express
* TypeScript
* Prisma ORM
* PostgreSQL
* Supabase
* JWT
* Bcrypt
* Multer

## Funcionalidades

### Autenticação

* Login administrativo
* JWT Authentication
* Middleware de proteção
* Controle de sessão

### Gerenciamento de Conteúdo

* Hero
* Sobre
* Serviços
* Procedimentos
* Depoimentos
* FAQ
* Blog
* Instagram
* Configurações
* Galeria de mídias

### Uploads

* Upload de imagens
* Upload de vídeos
* Integração Supabase Storage

## Segurança

### Implementado

* Hash de senha com Bcrypt
* JWT Authentication
* Rate Limit
* Rotas protegidas
* Prisma ORM (proteção contra SQL Injection)
* Sanitização de conteúdo
* RLS (Row Level Security)
* Policies de acesso no Supabase
* Storage protegido

### Auditoria de Segurança

O sistema passou por auditoria completa contemplando:

* Backend
* Frontend
* Banco de Dados
* Storage
* Supabase
* RLS
* Policies
* Uploads
* Autenticação

## Banco de Dados

### PostgreSQL (Supabase)

Principais entidades:

* Admins
* Hero
* About
* Serviços
* Procedimentos
* Depoimentos
* FAQ
* Blog Posts
* Instagram Posts
* Site Settings
* Midias

## Instalação

```bash
npm install
```

## Ambiente de Desenvolvimento

```bash
npm run dev
```

## Build de Produção

```bash
npm run build
```

## Autor

Alex Bueno

Desenvolvedor Full Stack
