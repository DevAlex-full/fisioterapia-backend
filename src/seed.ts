import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...\n');

  // ============================================================
  // ADMIN
  // ============================================================
  const adminEmail    = process.env.ADMIN_EMAIL    || 'admin@deborasantiago.com.br';
  const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@123456';

  const existingAdmin = await prisma.admin.findUnique({ where: { email: adminEmail } });

  if (!existingAdmin) {
    const hash = await bcrypt.hash(adminPassword, 12);
    await prisma.admin.create({
      data: { email: adminEmail, password: hash, nome: 'Débora Santiago' },
    });
    console.log(`✅ Admin criado: ${adminEmail}`);
  } else {
    console.log(`⚠️  Admin já existe: ${adminEmail}`);
  }

  // ============================================================
  // HERO
  // ============================================================
  const heroExists = await prisma.hero.findFirst();
  if (!heroExists) {
    await prisma.hero.create({
      data: {
        titulo:        'Recuperação',
        subtitulo:     'Extraordinária',
        descricao:     'Fisioterapia especializada que transforma sua recuperação pós-cirúrgica em uma experiência rápida, segura e confortável.',
        badge:         'Especialista em Pós-Operatório',
        ctaPrimario:   'Agendar Avaliação Gratuita',
        ctaSecundario: 'Conhecer Tratamentos',
      },
    });
    console.log('✅ Hero criado');
  }

  // ============================================================
  // ABOUT
  // ============================================================
  const aboutExists = await prisma.about.findFirst();
  if (!aboutExists) {
    await prisma.about.create({
      data: {
        nome:           'Débora Santiago',
        titulo:         'Conheça a Especialista',
        descricao1:     'Sou fisioterapeuta especializada em pós-operatório de cirurgias plásticas, com mais de 10 anos de experiência e formação avançada em drenagem linfática e técnicas de reabilitação dermato-funcional.',
        descricao2:     'Minha missão é proporcionar uma recuperação segura, rápida e confortável, potencializando os resultados da sua cirurgia através de protocolos personalizados e atendimento humanizado.',
        anosExp:        10,
        pacientes:      500,
        satisfacao:     98,
        especializacoes: 15,
        crefito:        'CREFITO-3',
        especialidade:  'Especialista Dermato-Funcional',
      },
    });
    console.log('✅ About criado');
  }

  // ============================================================
  // SERVIÇOS
  // ============================================================
  const servicosCount = await prisma.servico.count();
  if (servicosCount === 0) {
    const servicos = [
      {
        titulo:    'Drenagem Linfática',
        descricao: 'Técnica especializada que utiliza movimentos suaves e rítmicos para reduzir edemas, acelerar a recuperação e eliminar toxinas do organismo.',
        icone:     '💆‍♀️',
        beneficios: ['Reduz inchaço em até 70%', 'Acelera cicatrização', 'Melhora circulação', 'Desintoxica o organismo'],
        duracao:   '60 min',
        cor:       'from-purple-400 to-purple-600',
        ordem:     1,
      },
      {
        titulo:    'Ultrassom Terapêutico',
        descricao: 'Tecnologia de ponta que utiliza ondas sonoras para regeneração tecidual profunda, alívio de dores e aceleração da cicatrização.',
        icone:     '🔊',
        beneficios: ['Regeneração profunda', 'Tratamento indolor', 'Resultados rápidos', 'Recuperação acelerada'],
        duracao:   '45 min',
        cor:       'from-blue-400 to-blue-600',
        ordem:     2,
      },
      {
        titulo:    'Radiofrequência',
        descricao: 'Tecnologia avançada que estimula a produção de colágeno, promove firmeza da pele e melhora significativamente a circulação local.',
        icone:     '⚡',
        beneficios: ['Firmeza da pele', 'Estimula colágeno', 'Efeito lifting', 'Rejuvenescimento'],
        duracao:   '50 min',
        cor:       'from-orange-400 to-orange-600',
        ordem:     3,
      },
      {
        titulo:    'Mobilização Cicatricial',
        descricao: 'Técnicas manuais especializadas para melhorar qualidade, flexibilidade e aparência de cicatrizes, prevenindo aderências.',
        icone:     '✋',
        beneficios: ['Cicatrizes suaves', 'Maior mobilidade', 'Menos aderências', 'Melhora estética'],
        duracao:   '40 min',
        cor:       'from-green-400 to-green-600',
        ordem:     4,
      },
      {
        titulo:    'Exercícios Terapêuticos',
        descricao: 'Programa personalizado de exercícios para fortalecimento muscular, ganho de mobilidade e recuperação funcional completa.',
        icone:     '💪',
        beneficios: ['Fortalecimento', 'Prevenção', 'Autonomia', 'Resultados duradouros'],
        duracao:   '55 min',
        cor:       'from-red-400 to-red-600',
        ordem:     5,
      },
      {
        titulo:    'Orientações Pós-Operatórias',
        descricao: 'Acompanhamento completo e individualizado com orientações detalhadas para uma recuperação segura, rápida e sem complicações.',
        icone:     '📋',
        beneficios: ['Recuperação segura', 'Suporte 24/7', 'Melhores resultados', 'Tranquilidade total'],
        duracao:   '30 min',
        cor:       'from-pink-400 to-pink-600',
        ordem:     6,
      },
    ];

    for (const servico of servicos) {
      await prisma.servico.create({ data: servico });
    }
    console.log('✅ Serviços criados (6)');
  }

  // ============================================================
  // DEPOIMENTOS
  // ============================================================
  const depCount = await prisma.depoimento.count();
  if (depCount === 0) {
    const depoimentos = [
      {
        nome:         'Maria Silva',
        procedimento: 'Abdominoplastia',
        texto:        'A Débora foi essencial na minha recuperação! Profissional extremamente competente, atenciosa e dedicada. Meu pós-operatório foi tranquilo graças ao acompanhamento dela. Recomendo de olhos fechados!',
        rating:       5,
        fotoUrl:      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80',
        ordem:        1,
      },
      {
        nome:         'Ana Paula Costa',
        procedimento: 'Mamoplastia',
        texto:        'Excelente profissional! As sessões de drenagem foram fundamentais para reduzir o inchaço rapidamente. Técnica impecável e atendimento humanizado. Super recomendo o trabalho da Débora!',
        rating:       5,
        fotoUrl:      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80',
        ordem:        2,
      },
      {
        nome:         'Juliana Santos',
        procedimento: 'Lipoaspiração',
        texto:        'Fiquei impressionada com o resultado! A Débora tem mãos de fada e um conhecimento impressionante. Minha recuperação foi muito mais rápida do que eu esperava. Profissional nota 1000!',
        rating:       5,
        fotoUrl:      'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=100&q=80',
        ordem:        3,
      },
      {
        nome:         'Carla Mendes',
        procedimento: 'Lifting Facial',
        texto:        'Profissional incrível! Super atenciosa, pontual e eficiente. As técnicas que ela usa realmente fazem diferença. Minha pele ficou linda e a recuperação foi perfeita. Gratidão eterna!',
        rating:       5,
        fotoUrl:      'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100&q=80',
        ordem:        4,
      },
    ];

    for (const dep of depoimentos) {
      await prisma.depoimento.create({ data: dep });
    }
    console.log('✅ Depoimentos criados (4)');
  }

  // ============================================================
  // FAQ
  // ============================================================
  const faqCount = await prisma.fAQ.count();
  if (faqCount === 0) {
    const faqs = [
      { pergunta: 'Quando devo iniciar a fisioterapia pós-cirúrgica?',          resposta: 'Geralmente entre 3 a 7 dias após a cirurgia, dependendo da orientação do seu cirurgião.', ordem: 1 },
      { pergunta: 'Quantas sessões são necessárias?',                            resposta: 'Geralmente são recomendadas entre 10 a 20 sessões para resultados ótimos e duradouros.', ordem: 2 },
      { pergunta: 'A drenagem linfática dói?',                                   resposta: 'Não! A técnica é suave, relaxante e indolor. Muitos pacientes adormecem durante a sessão.', ordem: 3 },
      { pergunta: 'Qual a diferença no resultado com fisioterapia?',             resposta: 'A fisioterapia acelera em até 70% a recuperação, reduz edemas e hematomas, previne complicações.', ordem: 4 },
      { pergunta: 'Posso fazer fisioterapia em qualquer tipo de cirurgia plástica?', resposta: 'Sim! A fisioterapia é indicada para praticamente todos os procedimentos.', ordem: 5 },
      { pergunta: 'Aceita convênios médicos?',                                   resposta: 'Trabalhamos com diversos convênios. Entre em contato para verificar se o seu plano está incluso.', ordem: 6 },
    ];

    for (const faq of faqs) {
      await prisma.fAQ.create({ data: faq });
    }
    console.log('✅ FAQs criados (6)');
  }

  // ============================================================
  // PROCEDIMENTOS
  // ============================================================
  const procCount = await prisma.procedimento.count();
  if (procCount === 0) {
    const procedimentos = [
      'Abdominoplastia', 'Lipoaspiração', 'Mamoplastia', 'Rinoplastia',
      'Lifting Facial', 'Blefaroplastia', 'Lipoescultura', 'Prótese de Silicone',
      'Gluteoplastia', 'Otoplastia',
    ];
    for (let i = 0; i < procedimentos.length; i++) {
      await prisma.procedimento.create({ data: { nome: procedimentos[i], ordem: i + 1 } });
    }
    console.log('✅ Procedimentos criados (10)');
  }

  // ============================================================
  // CONTATO
  // ============================================================
  const contatoExists = await prisma.contatoInfo.findFirst();
  if (!contatoExists) {
    await prisma.contatoInfo.create({
      data: {
        telefone:      '(11) 96035-4728',
        whatsapp:      '5511960354728',
        email:         'deborabueno_2@hotmail.com',
        instagram:     '@debora.santiago.fisio',
        instagramUrl:  'https://www.instagram.com/debora.santiago.fisio/',
        endereco:      'Rua Tabapuã, 474 - conjunto 98',
        bairro:        'Itaim Bibi',
        cidade:        'São Paulo - SP',
        cep:           'CEP: 04533-001',
        horarioSemana: 'Segunda a Sexta: 8h às 18h',
        horarioSabado: 'Sábado: 8h às 12h',
        mensagemWpp:   'Olá! Gostaria de agendar uma avaliação de fisioterapia pós-cirúrgica.',
      },
    });
    console.log('✅ Contato criado');
  }

  // ============================================================
  // SITE SETTINGS
  // ============================================================
  const settingsExists = await prisma.siteSettings.findFirst();
  if (!settingsExists) {
    await prisma.siteSettings.create({
      data: {
        nomeClinica:   'Débora Santiago',
        corPrimaria:   '#D4AF7A',
        corSecundaria: '#8B7355',
        corTexto:      '#5D4E37',
        metaTitle:     'Débora Santiago | Fisioterapia Pós-Operatória',
        metaDesc:      'Fisioterapia especializada em pós-operatório de cirurgias plásticas em São Paulo.',
        whatsappFloat: true,
        whatsappMsg:   'Olá! Vim pelo site e gostaria de saber mais sobre os serviços.',
      },
    });
    console.log('✅ Site Settings criado');
  }

  // ============================================================
  // INSTAGRAM POSTS
  // ============================================================
  const instaCount = await prisma.instagramPost.count();
  if (instaCount === 0) {
    const posts = [
      { url: 'https://www.instagram.com/reel/DFD2Kw-xliC/', mediaUrl: '/videos/dia-do-medico.mp4', tipo: 'video', posterUrl: '/images/outubro-rosa.jpg', legenda: 'Nos bastidores da cirurgia', ordem: 1, ativo: true },
      { url: 'https://www.instagram.com/p/DPHPhyYgBxn/',   mediaUrl: '/videos/linfatica.mp4',     tipo: 'video', posterUrl: '/images/linfatica.jpeg',   legenda: 'Drenagem linfática pós-operatória', ordem: 2, ativo: true },
      { url: 'https://www.instagram.com/p/DPoP0VrAOde/',   mediaUrl: '/images/outubro-rosa.jpg',  tipo: 'image', posterUrl: null,                       legenda: 'Outubro Rosa', ordem: 3, ativo: true },
      { url: 'https://www.instagram.com/p/DPvjeL1DcH6/',   mediaUrl: '/videos/transformacao.mp4', tipo: 'video', posterUrl: '/images/outubro-rosa.jpg',  legenda: 'Transformação pós-operatória', ordem: 4, ativo: true },
    ];
    for (const post of posts) {
      await prisma.instagramPost.create({ data: post });
    }
    console.log('✅ Instagram Posts criados (4)');
  }

  // ============================================================
  // BLOG POSTS
  // ============================================================
  const blogCount = await prisma.blogPost.count();
  if (blogCount === 0) {
    const blogPosts = [
      {
        titulo:    '5 Dicas Essenciais para Recuperação Pós-Cirúrgica',
        slug:      '5-dicas-essenciais-recuperacao-pos-cirurgica',
        excerpt:   'Descubra as melhores práticas para uma recuperação rápida e segura após sua cirurgia plástica.',
        conteudo:  'A recuperação pós-cirúrgica é uma fase fundamental para garantir os melhores resultados...',
        imagemUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800&q=80',
        autor:     'Débora Santiago',
        readTime:  '5 min',
        publicado: true,
        destaque:  true,
        tags:      ['recuperação', 'dicas', 'pós-operatório'],
      },
      {
        titulo:    'Drenagem Linfática: Como Funciona e Benefícios',
        slug:      'drenagem-linfatica-como-funciona-beneficios',
        excerpt:   'Entenda como a drenagem linfática pode acelerar sua recuperação e reduzir edemas.',
        conteudo:  'A drenagem linfática manual é uma das técnicas mais importantes no pós-operatório...',
        imagemUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=800&q=80',
        autor:     'Débora Santiago',
        readTime:  '7 min',
        publicado: true,
        destaque:  false,
        tags:      ['drenagem linfática', 'edema', 'técnica'],
      },
      {
        titulo:    'Quando Iniciar a Fisioterapia Pós-Operatória',
        slug:      'quando-iniciar-fisioterapia-pos-operatoria',
        excerpt:   'Saiba o momento ideal para começar seu tratamento fisioterapêutico.',
        conteudo:  'Uma das perguntas mais frequentes das nossas pacientes é: quando devo iniciar a fisioterapia...',
        imagemUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80',
        autor:     'Débora Santiago',
        readTime:  '4 min',
        publicado: true,
        destaque:  false,
        tags:      ['fisioterapia', 'início', 'pós-operatório'],
      },
    ];

    for (const post of blogPosts) {
      await prisma.blogPost.create({ data: post });
    }
    console.log('✅ Blog Posts criados (3)');
  }

  // ============================================================
  // MÍDIAS
  // ============================================================
  const midiaCount = await prisma.midia.count();
  if (midiaCount === 0) {
    const midias = [
      { titulo: 'Clínica - Recepção',           url: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&q=80', tipo: 'image', categoria: 'clinica',    ordem: 1, destaque: true },
      { titulo: 'Sessão de Drenagem',            url: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=800&q=80', tipo: 'image', categoria: 'resultados', ordem: 2, destaque: true },
      { titulo: 'Tratamento com Ultrassom',      url: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800&q=80', tipo: 'image', categoria: 'resultados', ordem: 3, destaque: false },
      { titulo: 'Consultório Especializado',     url: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&q=80', tipo: 'image', categoria: 'clinica',    ordem: 4, destaque: false },
    ];

    for (const midia of midias) {
      await prisma.midia.create({ data: midia });
    }
    console.log('✅ Mídias criadas (4)');
  }

  // ============================================================
  console.log('\n🎉 Seed concluído com sucesso!');
  console.log(`\n🔐 Acesso ao Admin:\n   Email: ${adminEmail}\n   Senha: ${adminPassword}`);
}

main()
  .catch((e) => {
    console.error('❌ Erro no seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });