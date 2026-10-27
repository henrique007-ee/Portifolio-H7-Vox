import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';
import type { 
  Project, 
  ServiceItem, 
  Testimonial, 
  Brand, 
  BackstageItem, 
  SiteSettings, 
  BriefingLead,
  CategoryItem,
  VisualIdentityProject,
  VisitorNotification,
  VisitorStats,
  SimulatorConfig,
  BudgetSimulationLead
} from './src/types';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 3000;
const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'database.json');

// Ensure data folder exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

interface DatabaseSchema {
  settings: SiteSettings;
  projects: Project[];
  categories: CategoryItem[];
  services: ServiceItem[];
  testimonials: Testimonial[];
  brands: Brand[];
  backstage: BackstageItem[];
  leads: BriefingLead[];
  visualIdentities: VisualIdentityProject[];
  visitorNotifications: VisitorNotification[];
  adminPasswordHash: string;
  simulatorConfig: SimulatorConfig;
  budgetSimulations: BudgetSimulationLead[];
}

const defaultAdminPassword = 'Endson0711@';
function hashPassword(pass: string): string {
  return crypto.createHash('sha256').update(pass.trim()).digest('hex');
}

const initialCategories: CategoryItem[] = [
  { id: 'cat-1', name: 'Eventos', order: 1, active: true },
  { id: 'cat-2', name: 'Shows', order: 2, active: true },
  { id: 'cat-3', name: 'Storymaker e real time', order: 3, active: true },
  { id: 'cat-4', name: 'Reels e redes sociais', order: 4, active: true },
  { id: 'cat-5', name: 'Comunicação política', order: 5, active: true },
  { id: 'cat-6', name: 'Publicidade e marcas', order: 6, active: true },
  { id: 'cat-7', name: 'Filmmaker e captação', order: 7, active: true },
  { id: 'cat-8', name: 'Fotografia e bastidores', order: 8, active: true },
  { id: 'cat-9', name: 'Identidades visuais', order: 9, active: true },
];

const initialDatabase: DatabaseSchema = {
  adminPasswordHash: hashPassword(defaultAdminPassword),
  settings: {
    brandName: 'H7.VOX',
    ownerName: 'Endson Henrique',
    roleSubtitle: 'EDITOR DE VÍDEO • FILMMAKER • STORYMAKER • IDENTIDADE VISUAL',
    heroTitle: 'IMAGENS QUE MARCAM.\nHISTÓRIAS QUE CONECTAM.',
    heroSubtitle: 'H7.VOX • PRODUÇÃO AUDIOVISUAL',
    heroLead: 'Transformo ideias, momentos e marcas em experiências visuais que merecem ser vistas.',
    heroVideoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-cameraman-filming-in-a-studio-setting-41585-large.mp4',
    aboutTitle: 'Por trás de cada vídeo, existe alguém que acredita no poder de uma boa história.',
    aboutBio: 'Sou Endson Henrique, profissional da área audiovisual com atuação em edição de vídeos, filmmaker, storymaker, captação e identidades visuais.\n\nMeu trabalho é transformar ideias, momentos e histórias em conteúdos que comunicam de verdade. Cada projeto tem uma intenção, e meu papel é encontrar a melhor forma de colocá-la em imagem.',
    aboutPhoto: '',
    aboutPhilosophy: 'Meu trabalho une criatividade, atenção aos detalhes e compreensão do objetivo de cada conteúdo. Do corte seco ao ritmo da trilha, cada escolha visual tem uma intenção estratégica.',
    whatsappNumber: '5581985476681',
    defaultWhatsappMessage: 'Olá, Endson! Conheci seu portfólio H7.VOX e gostaria de conversar sobre um projeto audiovisual.',
    instagramHandle: 'h7.vox',
    instagramUrl: 'https://www.instagram.com/h7.vox/',
    email: 'endsonhenrique13@gmail.com',
    location: 'Pernambuco, Brasil',
    logoUrl: '/assets/logo_web.png',
    logoOriginalUrl: '/assets/aistudio/minha_logo_7050a17d.png',
    showMetrics: true,
    metrics: [
      { label: 'PROJETOS REALIZADOS', value: '80+', detail: 'Produções entregues' },
      { label: 'EVENTOS', value: '+30', detail: 'Coberturas e festivais' },
      { label: 'VISUALIZAÇÕES', value: '+1M', detail: 'Alcance somado' },
    ],
    showBrands: true,
    showTestimonials: false,
    visitorWebhookUrl: ''
  },
  visualIdentities: [],
  visitorNotifications: [],
  categories: initialCategories,
  services: [
    {
      id: 'srv-1',
      code: '01',
      title: 'Edição de Vídeo',
      description: 'Transformo gravações em vídeos dinâmicos, com ritmo, narrativa, cortes precisos e recursos visuais que ajudam a manter a atenção do público.',
      deliverables: [
        'Reels e vídeos verticais para redes sociais',
        'Vídeos institucionais e corporativos',
        'Vídeos para campanhas promocionais',
        'Edição e pós-produção de eventos',
        'Color grading e tratamento de áudio',
        'Motion graphics e legendagem dinâmica'
      ],
      whatsappMessage: 'Olá, Endson! Gostaria de saber mais sobre o serviço de Edição de Vídeo para meu projeto.',
      order: 1,
      active: true,
    },
    {
      id: 'srv-2',
      code: '02',
      title: 'Storymaker para Eventos',
      description: 'Registro os principais momentos de eventos e transformo a experiência em conteúdo para os stories, com agilidade, criatividade e atenção aos detalhes.',
      deliverables: [
        'Cobertura de eventos em tempo real (real time)',
        'Stories com cortes rápidos e design dinâmico',
        'Bastidores e making of exclusivo',
        'Conteúdo personalizado para artistas e palestrantes',
        'Entrega rápida durante o próprio evento'
      ],
      whatsappMessage: 'Olá, Endson! Tenho interesse na cobertura como Storymaker para meu evento.',
      order: 2,
      active: true,
    },
    {
      id: 'srv-3',
      code: '03',
      title: 'Filmmaker e Direção',
      description: 'Captação e construção audiovisual para transformar ideias em vídeos com identidade, intenção e alta qualidade cinematográfica.',
      deliverables: [
        'Vídeos comerciais e publicitários',
        'Filmes institucionais e documentais',
        'Captação com equipamentos profissionais 4K',
        'Direção de cena e iluminação estratégica',
        'Produção audiovisual completa'
      ],
      whatsappMessage: 'Olá, Endson! Gostaria de solicitar uma proposta para Filmmaker / Produção Audiovisual.',
      order: 3,
      active: true,
    },
    {
      id: 'srv-4',
      code: '04',
      title: 'Fotografia e Captação',
      description: 'Registro visual de momentos, pessoas, produtos e eventos, com foco na construção de imagens que valorizem cada projeto e marca.',
      deliverables: [
        'Fotografia de eventos e shows',
        'Ensaios fotográficos profissionais',
        'Fotografia corporativa e executiva',
        'Tratamento de cor e entrega em alta resolução'
      ],
      whatsappMessage: 'Olá, Endson! Gostaria de falar sobre Fotografia e Captação visual.',
      order: 4,
      active: true,
    },
    {
      id: 'srv-5',
      code: '05',
      title: 'Comunicação Política',
      description: 'Produção e edição de conteúdo audiovisual estratégico para agentes públicos, lideranças, mandatos e projetos políticos.',
      deliverables: [
        'Edição de vídeos para prestação de contas',
        'Cobertura dinâmica de agendas e comícios',
        'Vídeos curtos de posicionamento para redes',
        'Storymaker em mobilizações e plenárias',
        'Adequação de tom e narrativa estratégica'
      ],
      whatsappMessage: 'Olá, Endson! Gostaria de conversar sobre produção audiovisual para Comunicação Política.',
      order: 5,
      active: true,
    }
  ],
  projects: [],
  testimonials: [],
  brands: [],
  backstage: [
    {
      id: 'bk-1',
      title: 'Setup de Iluminação e Câmera',
      mediaType: 'image',
      mediaUrl: 'https://images.unsplash.com/photo-1533750516457-a7f992034fec?auto=format&fit=crop&w=800&q=80',
      caption: 'Estruturação de iluminação de recorte e lente 35mm para entrevista institucional.',
      tag: 'Captação',
      order: 1,
      published: true
    },
    {
      id: 'bk-2',
      title: 'Fluxo de Edição e Timeline Multicam',
      mediaType: 'image',
      mediaUrl: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=800&q=80',
      caption: 'Organização de canais de áudio, trilhas sincronizadas e marcação de beats na timeline.',
      tag: 'Pós-Produção',
      order: 2,
      published: true
    },
    {
      id: 'bk-3',
      title: 'Storymaker em Ação no Palco',
      mediaType: 'image',
      mediaUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80',
      caption: 'Captação em tempo real com estabilização e envio imediato para a equipe de redes sociais.',
      tag: 'Storymaker',
      order: 3,
      published: true
    },
    {
      id: 'bk-4',
      title: 'Color Grading & Monitor de Referência',
      mediaType: 'image',
      mediaUrl: 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=800&q=80',
      caption: 'Tratamento de cor primária e LUTs personalizadas para garantir uniformidade estética.',
      tag: 'Color Grading',
      order: 4,
      published: true
    }
  ],
  leads: [],
  simulatorConfig: {
    packages: [
      {
        id: 'pkg-1',
        name: '2 Vídeos',
        videoCount: 2,
        cardCount: 0,
        price: 200,
        description: 'Edição de 2 vídeos com cortes dinâmicos, ritmo, cor e áudio.',
        active: true
      },
      {
        id: 'pkg-2',
        name: '4 Vídeos',
        videoCount: 4,
        cardCount: 0,
        price: 300,
        description: 'Edição de 4 vídeos com alta retenção para redes sociais.',
        active: true
      },
      {
        id: 'pkg-3',
        name: '6 Vídeos',
        videoCount: 6,
        cardCount: 0,
        price: 600,
        description: 'Edição de 6 vídeos com narrativa consistente e assertiva.',
        active: true
      }
    ],
    standalonePrices: {
      cardPrice: 25,
      carouselPrice: 40,
      videoPrice: 100
    },
    eventPrices: {
      photo5Price: 20,
      photo10Price: 40,
      singleVideoPrice: 120,
      collectiveVideoPrice: 150
    },
    politicsRateMultiplier: 1.5,
    customAddons: [
      {
        id: 'add-1',
        title: 'Card estático para redes sociais',
        price: 25,
        unitLabel: 'unidade',
        description: 'Design de post estático alinhado à sua identidade visual.',
        active: true
      },
      {
        id: 'add-2',
        title: 'Carrossel estratégico',
        price: 40,
        unitLabel: 'unidade',
        description: 'Carrossel de alto engajamento com narrativa e design slide a slide.',
        active: true
      },
      {
        id: 'add-3',
        title: 'Vídeo avulso adicional',
        price: 100,
        unitLabel: 'vídeo',
        description: 'Edição completa com cortes, trilha, cor e legendagem dinâmica.',
        active: true
      },
      {
        id: 'add-4',
        title: 'Pacote com 5 fotos de evento tratadas',
        price: 20,
        unitLabel: 'pacote 5 fotos',
        description: 'Tratamento de cor e entrega em alta definição.',
        active: true
      },
      {
        id: 'add-5',
        title: 'Vídeo individual para evento',
        price: 120,
        unitLabel: 'vídeo',
        description: 'Foco individualizado (artista, palestrante ou homenageado).',
        active: true
      },
      {
        id: 'add-6',
        title: 'Vídeo coletivo para evento',
        price: 150,
        unitLabel: 'vídeo',
        description: 'Aftermovie geral com captação do público, ambiente e destaques.',
        active: true
      }
    ],
    formulaNotes: 'Regras de Cálculo H7.VOX: Pacotes de vídeos definem o valor base (sem cards inclusos; cards são adicionados avulsos conforme escolha). Comunicação política possui precificação diferenciada/estratégica com taxa diferenciada (fator 1.5x). Itens extras além do pacote são cobrados individualmente. Serviços sem regra de preço requerem avaliação personalizada sem valor inventado.'
  },
  budgetSimulations: []
};

// Database helper functions
function readDatabase(): DatabaseSchema {
  try {
    if (!fs.existsSync(DB_FILE)) {
      fs.writeFileSync(DB_FILE, JSON.stringify(initialDatabase, null, 2), 'utf-8');
      return initialDatabase;
    }
    const data = fs.readFileSync(DB_FILE, 'utf-8');
    const parsed = JSON.parse(data);
    const merged: DatabaseSchema = { ...initialDatabase, ...parsed };

    // Upgrade legacy default password hash to the new requested password Endson0711@
    if (!merged.adminPasswordHash || merged.adminPasswordHash === hashPassword('h7vox-admin-2026')) {
      merged.adminPasswordHash = hashPassword(defaultAdminPassword);
    }

    // Ensure official settings are set if empty or old placeholder
    if (!merged.settings.whatsappNumber || merged.settings.whatsappNumber === '5581999999999') {
      merged.settings.whatsappNumber = '5581985476681';
    }
    if (!merged.settings.instagramUrl) {
      merged.settings.instagramUrl = 'https://www.instagram.com/h7.vox/';
    }
    if (!merged.settings.email || merged.settings.email === 'contato@h7vox.com.br') {
      merged.settings.email = 'endsonhenrique13@gmail.com';
    }
    if (!merged.settings.logoUrl) {
      merged.settings.logoUrl = '/assets/logo_web.png';
    }
    if (!merged.settings.logoOriginalUrl) {
      merged.settings.logoOriginalUrl = '/assets/aistudio/minha_logo_7050a17d.png';
    }
    if (!merged.categories || merged.categories.length === 0) {
      merged.categories = initialCategories;
    }
    if (!merged.visualIdentities) {
      merged.visualIdentities = [];
    }
    if (!merged.visitorNotifications) {
      merged.visitorNotifications = [];
    }
    if (!merged.simulatorConfig) {
      merged.simulatorConfig = initialDatabase.simulatorConfig;
    }
    if (!merged.budgetSimulations) {
      merged.budgetSimulations = [];
    }
    return merged;
  } catch (err) {
    console.error('Error reading database, falling back to initial:', err);
    return initialDatabase;
  }
}

function writeDatabase(data: DatabaseSchema): boolean {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Error writing database:', err);
    return false;
  }
}

// Helper to validate and parse Instagram links
export function parseInstagramUrl(urlStr: string): { valid: boolean; code?: string; cleanUrl?: string; embedUrl?: string; error?: string } {
  if (!urlStr || typeof urlStr !== 'string') {
    return { valid: false, error: 'A URL do Instagram é obrigatória.' };
  }
  const clean = urlStr.trim();
  // Match reel, p, or tv
  const match = clean.match(/(?:https?:\/\/)?(?:www\.)?instagram\.com\/(?:reel|p|tv)\/([A-Za-z0-9_-]+)/i);
  if (!match || !match[1]) {
    return {
      valid: false,
      error: 'Link inválido. Insira uma URL válida de Reel ou publicação do Instagram (ex: https://www.instagram.com/reel/C3abc123/ ou https://www.instagram.com/p/C3abc123/).'
    };
  }
  const code = match[1];
  const cleanUrl = `https://www.instagram.com/reel/${code}/`;
  const embedUrl = `https://www.instagram.com/p/${code}/embed/`;
  return { valid: true, code, cleanUrl, embedUrl };
}

// Session tokens store in memory
const activeSessions = new Set<string>();

function generateSessionToken(): string {
  const token = crypto.randomBytes(32).toString('hex');
  activeSessions.add(token);
  return token;
}

function authMiddleware(req: express.Request, res: express.Response, next: express.NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Não autorizado. Faça login no painel.' });
  }
  const token = authHeader.substring(7);
  if (!activeSessions.has(token)) {
    return res.status(401).json({ error: 'Sessão expirada ou inválida.' });
  }
  next();
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '15mb' }));

  // --- Static assets from public folder ---
  const publicDir = path.join(__dirname, 'public');
  if (fs.existsSync(publicDir)) {
    app.use(express.static(publicDir));
  }

  // --- Ensure Uploads Directory for PC file uploads ---
  const uploadsDir = path.join(publicDir, 'uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  // --- File Upload API (Direct from PC) ---
  app.post('/api/upload', authMiddleware, (req, res) => {
    try {
      const { data, filename } = req.body;
      if (!data || typeof data !== 'string') {
        return res.status(400).json({ error: 'Nenhum dado de arquivo enviado.' });
      }

      // Check for base64 data url
      const matches = data.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
      if (!matches || matches.length !== 3) {
        return res.status(400).json({ error: 'Formato de imagem inválido. Selecione um arquivo JPG, PNG, WEBP ou SVG.' });
      }

      const mimeType = matches[1];
      const base64Data = matches[2];
      const buffer = Buffer.from(base64Data, 'base64');

      let ext = 'jpg';
      if (mimeType.includes('png')) ext = 'png';
      else if (mimeType.includes('webp')) ext = 'webp';
      else if (mimeType.includes('gif')) ext = 'gif';
      else if (mimeType.includes('svg')) ext = 'svg';

      const prefix = filename ? filename.toLowerCase().replace(/[^a-z0-9]/g, '-').slice(0, 20) : 'foto';
      const safeName = `${prefix}-${Date.now()}-${crypto.randomBytes(4).toString('hex')}.${ext}`;
      const filePath = path.join(uploadsDir, safeName);

      fs.writeFileSync(filePath, buffer);
      const fileUrl = `/uploads/${safeName}`;

      return res.json({ success: true, url: fileUrl, filename: safeName });
    } catch (err: any) {
      console.error('Erro no upload de arquivo:', err);
      return res.status(500).json({ error: 'Falha ao salvar imagem enviada do computador.' });
    }
  });

  // --- Auth APIs ---
  app.post('/api/auth/login', (req, res) => {
    const { password } = req.body;
    if (!password) {
      return res.status(400).json({ error: 'Senha é obrigatória' });
    }
    const db = readDatabase();
    const providedHash = hashPassword(password);
    if (providedHash === db.adminPasswordHash || password === defaultAdminPassword) {
      const token = generateSessionToken();
      return res.json({ success: true, token, ownerName: db.settings.ownerName });
    }
    return res.status(401).json({ error: 'Senha incorreta.' });
  });

  app.get('/api/auth/verify', (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.json({ valid: false });
    }
    const token = authHeader.substring(7);
    return res.json({ valid: activeSessions.has(token) });
  });

  app.post('/api/auth/change-password', authMiddleware, (req, res) => {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword || newPassword.length < 6) {
      return res.status(400).json({ error: 'Nova senha deve ter pelo menos 6 caracteres.' });
    }
    const db = readDatabase();
    if (hashPassword(currentPassword) !== db.adminPasswordHash && currentPassword !== defaultAdminPassword) {
      return res.status(401).json({ error: 'Senha atual incorreta.' });
    }
    db.adminPasswordHash = hashPassword(newPassword);
    writeDatabase(db);
    return res.json({ success: true, message: 'Senha atualizada com sucesso!' });
  });

  // --- Instagram Link Validation & Metadata API ---
  app.post('/api/instagram/validate', async (req, res) => {
    const { url } = req.body;
    const parsed = parseInstagramUrl(url);
    if (!parsed.valid) {
      return res.status(400).json({ error: parsed.error });
    }

    let thumbnail = '';
    let author = 'h7.vox';
    let title = '';

    // Attempt to resolve official oEmbed thumbnail without fragile scraping
    try {
      const oembedUrl = `https://api.instagram.com/oembed/?url=${encodeURIComponent(parsed.cleanUrl!)}`;
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 3000);
      const oRes = await fetch(oembedUrl, { signal: controller.signal });
      clearTimeout(timeout);
      if (oRes.ok) {
        const oData = await oRes.json();
        thumbnail = oData.thumbnail_url || '';
        author = oData.author_name || 'h7.vox';
        title = oData.title || '';
      }
    } catch {
      // Graceful fallback - code & embedUrl are valid
    }

    return res.json({
      ...parsed,
      thumbnail,
      author,
      title
    });
  });

  // --- Categories APIs ---
  app.get('/api/categories', (_req, res) => {
    const db = readDatabase();
    const activeOnly = _req.query.all !== 'true';
    let cats = db.categories || initialCategories;
    if (activeOnly) {
      cats = cats.filter(c => c.active);
    }
    cats.sort((a, b) => a.order - b.order);
    return res.json(cats);
  });

  app.put('/api/categories', authMiddleware, (req, res) => {
    const db = readDatabase();
    if (!Array.isArray(req.body)) {
      return res.status(400).json({ error: 'Array de categorias esperado' });
    }
    db.categories = req.body;
    writeDatabase(db);
    return res.json(db.categories);
  });

  // --- Public & Admin Project APIs ---
  app.get('/api/projects', (req, res) => {
    const db = readDatabase();
    const isFull = req.query.admin === 'true';
    const isTrash = req.query.trash === 'true';

    let projects = db.projects;
    if (isTrash) {
      projects = projects.filter(p => p.inTrash);
      projects.sort((a, b) => (new Date(b.deletedAt || 0).getTime()) - (new Date(a.deletedAt || 0).getTime()));
      return res.json(projects);
    }

    // Default: exclude trashed projects
    projects = projects.filter(p => !p.inTrash);
    if (!isFull) {
      projects = projects.filter(p => p.published);
    }
    projects.sort((a, b) => a.order - b.order);
    return res.json(projects);
  });

  app.get('/api/projects/trash', authMiddleware, (_req, res) => {
    const db = readDatabase();
    const trash = db.projects
      .filter(p => p.inTrash)
      .sort((a, b) => (new Date(b.deletedAt || 0).getTime()) - (new Date(a.deletedAt || 0).getTime()));
    return res.json(trash);
  });

  app.get('/api/projects/:id', (req, res) => {
    const db = readDatabase();
    const project = db.projects.find(p => p.id === req.params.id);
    if (!project) {
      return res.status(404).json({ error: 'Projeto não encontrado' });
    }
    return res.json(project);
  });

  // Create Project
  app.post('/api/projects', authMiddleware, (req, res) => {
    const db = readDatabase();

    let videoType = req.body.videoType || 'direct';
    let videoUrl = req.body.videoUrl || '';
    let instagramUrl = req.body.instagramUrl || '';
    let instagramCode = req.body.instagramCode || '';

    // If Instagram URL is provided, validate and parse
    if (videoType === 'instagram' || instagramUrl || (videoUrl && videoUrl.includes('instagram.com'))) {
      const urlToParse = instagramUrl || videoUrl;
      const parsed = parseInstagramUrl(urlToParse);
      if (parsed.valid && parsed.code) {
        videoType = 'instagram';
        instagramCode = parsed.code;
        instagramUrl = parsed.cleanUrl!;
        videoUrl = parsed.cleanUrl!;
      }
    }

    const newProject: Project = {
      id: 'proj-' + Date.now(),
      title: req.body.title || 'Novo Projeto',
      client: req.body.client || '',
      brandId: req.body.brandId || undefined,
      category: req.body.category || 'Eventos',
      year: req.body.year || String(new Date().getFullYear()),
      description: req.body.description || '',
      thumbnail: req.body.thumbnail || '/assets/logo_web.png',
      videoUrl,
      videoType,
      instagramUrl,
      instagramCode,
      externalLink: req.body.externalLink || (videoType === 'instagram' ? instagramUrl : ''),
      services: Array.isArray(req.body.services) ? req.body.services : [],
      credits: req.body.credits || '',
      results: req.body.results || '',
      order: Number(req.body.order) || (db.projects.length + 1),
      featured: Boolean(req.body.featured),
      published: req.body.published !== undefined ? Boolean(req.body.published) : true,
      aspectRatio: req.body.aspectRatio === '9:16' ? '9:16' : '16:9',
      inTrash: false
    };

    db.projects.push(newProject);
    writeDatabase(db);
    return res.status(201).json(newProject);
  });

  // Update Project
  app.put('/api/projects/:id', authMiddleware, (req, res) => {
    const db = readDatabase();
    const index = db.projects.findIndex(p => p.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ error: 'Projeto não encontrado' });
    }

    let videoType = req.body.videoType ?? db.projects[index].videoType;
    let videoUrl = req.body.videoUrl ?? db.projects[index].videoUrl;
    let instagramUrl = req.body.instagramUrl ?? db.projects[index].instagramUrl;
    let instagramCode = req.body.instagramCode ?? db.projects[index].instagramCode;

    if (videoType === 'instagram' || (videoUrl && videoUrl.includes('instagram.com'))) {
      const urlToParse = instagramUrl || videoUrl;
      const parsed = parseInstagramUrl(urlToParse);
      if (parsed.valid && parsed.code) {
        videoType = 'instagram';
        instagramCode = parsed.code;
        instagramUrl = parsed.cleanUrl!;
        videoUrl = parsed.cleanUrl!;
      }
    }

    db.projects[index] = {
      ...db.projects[index],
      ...req.body,
      videoType,
      videoUrl,
      instagramUrl,
      instagramCode,
      id: req.params.id, // Immutable ID
    };
    writeDatabase(db);
    return res.json(db.projects[index]);
  });

  // Move Project to Trash (Soft Delete)
  app.post('/api/projects/:id/trash', authMiddleware, (req, res) => {
    const db = readDatabase();
    const project = db.projects.find(p => p.id === req.params.id);
    if (!project) {
      return res.status(404).json({ error: 'Projeto não encontrado.' });
    }
    project.inTrash = true;
    project.deletedAt = new Date().toISOString();
    writeDatabase(db);
    return res.json({ success: true, message: 'Projeto movido para a lixeira com sucesso.', project });
  });

  // Restore Project from Trash
  app.post('/api/projects/:id/restore', authMiddleware, (req, res) => {
    const db = readDatabase();
    const project = db.projects.find(p => p.id === req.params.id);
    if (!project) {
      return res.status(404).json({ error: 'Projeto não encontrado na lixeira.' });
    }
    project.inTrash = false;
    delete project.deletedAt;
    writeDatabase(db);
    return res.json({ success: true, message: 'Projeto restaurado com sucesso.', project });
  });

  // Permanent Delete Project
  app.delete('/api/projects/:id/permanent', authMiddleware, (req, res) => {
    const db = readDatabase();
    const exists = db.projects.some(p => p.id === req.params.id);
    if (!exists) {
      return res.status(404).json({ error: 'Projeto não encontrado para exclusão definitiva.' });
    }
    db.projects = db.projects.filter(p => p.id !== req.params.id);
    writeDatabase(db);
    return res.json({ success: true, message: 'Projeto excluído definitivamente do banco de dados.' });
  });

  // Empty Entire Trash
  app.post('/api/projects/trash/empty', authMiddleware, (_req, res) => {
    const db = readDatabase();
    const count = db.projects.filter(p => p.inTrash).length;
    db.projects = db.projects.filter(p => !p.inTrash);
    writeDatabase(db);
    return res.json({ success: true, message: `${count} projeto(s) removido(s) definitivamente da lixeira.` });
  });

  // Real Delete Project from Database (Permanent Removal)
  app.delete('/api/projects/:id', authMiddleware, (req, res) => {
    const db = readDatabase();
    const projectIndex = db.projects.findIndex(p => p.id === req.params.id);
    if (projectIndex === -1) {
      return res.status(404).json({ error: 'Projeto não encontrado para exclusão.' });
    }
    const deletedProject = db.projects[projectIndex];
    
    // Remove project completely from database
    db.projects = db.projects.filter(p => p.id !== req.params.id);
    writeDatabase(db);

    return res.json({ 
      success: true, 
      message: `Projeto "${deletedProject.title}" excluído com sucesso do banco de dados.`,
      deletedId: req.params.id,
      deletedTitle: deletedProject.title
    });
  });

  // --- Services APIs ---
  app.get('/api/services', (_req, res) => {
    const db = readDatabase();
    const services = db.services.filter(s => s.active).sort((a, b) => a.order - b.order);
    return res.json(services);
  });

  app.get('/api/services/all', authMiddleware, (_req, res) => {
    const db = readDatabase();
    return res.json(db.services);
  });

  app.put('/api/services', authMiddleware, (req, res) => {
    const db = readDatabase();
    if (Array.isArray(req.body)) {
      db.services = req.body;
      writeDatabase(db);
      return res.json(db.services);
    }
    return res.status(400).json({ error: 'Formato inválido. Esperado array de serviços.' });
  });

  // --- Testimonials APIs ---
  app.get('/api/testimonials', (_req, res) => {
    const db = readDatabase();
    const testimonials = db.testimonials.filter(t => t.published);
    return res.json(testimonials);
  });

  app.get('/api/testimonials/all', authMiddleware, (_req, res) => {
    const db = readDatabase();
    return res.json(db.testimonials);
  });

  app.post('/api/testimonials', authMiddleware, (req, res) => {
    const db = readDatabase();
    const item: Testimonial = {
      id: 'test-' + Date.now(),
      name: req.body.name || '',
      role: req.body.role || '',
      company: req.body.company || '',
      text: req.body.text || '',
      avatar: req.body.avatar || '',
      projectTitle: req.body.projectTitle || '',
      rating: Number(req.body.rating) || 5,
      published: req.body.published !== undefined ? Boolean(req.body.published) : true,
    };
    db.testimonials.push(item);
    writeDatabase(db);
    return res.status(201).json(item);
  });

  app.put('/api/testimonials/:id', authMiddleware, (req, res) => {
    const db = readDatabase();
    const idx = db.testimonials.findIndex(t => t.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Não encontrado' });
    db.testimonials[idx] = { ...db.testimonials[idx], ...req.body, id: req.params.id };
    writeDatabase(db);
    return res.json(db.testimonials[idx]);
  });

  app.delete('/api/testimonials/:id', authMiddleware, (req, res) => {
    const db = readDatabase();
    db.testimonials = db.testimonials.filter(t => t.id !== req.params.id);
    writeDatabase(db);
    return res.json({ success: true });
  });

  // --- Brands APIs with Relationship Inspection & Safe Deletion ---
  app.get('/api/brands', (_req, res) => {
    const db = readDatabase();
    const brands = db.brands.filter(b => b.active && !b.inTrash).sort((a, b) => a.order - b.order);
    return res.json(brands);
  });

  app.get('/api/brands/all', authMiddleware, (_req, res) => {
    const db = readDatabase();
    return res.json(db.brands.sort((a, b) => a.order - b.order));
  });

  // Check which projects are using a brand
  app.get('/api/brands/:id/check-usage', authMiddleware, (req, res) => {
    const db = readDatabase();
    const brand = db.brands.find(b => b.id === req.params.id);
    if (!brand) return res.status(404).json({ error: 'Marca não encontrada.' });

    const usingProjects = db.projects.filter(
      p => !p.inTrash && (p.brandId === brand.id || p.client.trim().toLowerCase() === brand.name.trim().toLowerCase())
    );

    return res.json({
      brand,
      inUse: usingProjects.length > 0,
      projectCount: usingProjects.length,
      projectTitles: usingProjects.map(p => p.title),
      projects: usingProjects.map(p => ({ id: p.id, title: p.title }))
    });
  });

  app.post('/api/brands', authMiddleware, (req, res) => {
    const db = readDatabase();
    const logoVal = req.body.logo || req.body.logoUrl || '';
    const newBrand: Brand = {
      id: 'brand-' + Date.now(),
      name: req.body.name || 'Nova Marca',
      logo: logoVal,
      logoUrl: logoVal,
      website: req.body.website || '',
      description: req.body.description || '',
      order: Number(req.body.order) || (db.brands.length + 1),
      active: req.body.active !== undefined ? Boolean(req.body.active) : true,
      inTrash: false
    };
    db.brands.push(newBrand);
    writeDatabase(db);
    return res.status(201).json(newBrand);
  });

  app.put('/api/brands/:id', authMiddleware, (req, res) => {
    const db = readDatabase();
    const idx = db.brands.findIndex(b => b.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Marca não encontrada.' });
    const logoVal = req.body.logo !== undefined ? req.body.logo : req.body.logoUrl !== undefined ? req.body.logoUrl : db.brands[idx].logo;
    db.brands[idx] = { 
      ...db.brands[idx], 
      ...req.body, 
      logo: logoVal,
      logoUrl: logoVal,
      id: req.params.id 
    };
    writeDatabase(db);
    return res.json(db.brands[idx]);
  });

  app.put('/api/brands', authMiddleware, (req, res) => {
    const db = readDatabase();
    if (Array.isArray(req.body)) {
      db.brands = req.body;
      writeDatabase(db);
      return res.json(db.brands);
    }
    return res.status(400).json({ error: 'Array esperado' });
  });

  // Delete Brand with Relationship Verification
  app.delete('/api/brands/:id', authMiddleware, (req, res) => {
    const db = readDatabase();
    const brand = db.brands.find(b => b.id === req.params.id);
    if (!brand) return res.status(404).json({ error: 'Marca não encontrada.' });

    const unlink = req.query.unlink === 'true' || req.body?.unlink === true;
    const force = req.query.force === 'true' || req.body?.force === true;

    // Check usage in active projects
    const usingProjects = db.projects.filter(
      p => !p.inTrash && (p.brandId === brand.id || p.client.trim().toLowerCase() === brand.name.trim().toLowerCase())
    );

    if (usingProjects.length > 0 && !unlink && !force) {
      return res.status(409).json({
        error: `Esta marca está vinculada a ${usingProjects.length} projeto(s) do portfólio.`,
        inUse: true,
        projectCount: usingProjects.length,
        projectTitles: usingProjects.map(p => p.title),
      });
    }

    // If unlink requested, remove references from projects without deleting the projects
    if (unlink && usingProjects.length > 0) {
      db.projects.forEach(p => {
        if (p.brandId === brand.id) {
          p.brandId = undefined;
        }
      });
    }

    db.brands = db.brands.filter(b => b.id !== req.params.id);
    writeDatabase(db);
    return res.json({ 
      success: true, 
      message: 'Marca removida com sucesso.',
      unlinkedCount: unlink ? usingProjects.length : 0 
    });
  });

  // --- Backstage APIs ---
  app.get('/api/backstage', (_req, res) => {
    const db = readDatabase();
    return res.json(db.backstage.sort((a, b) => a.order - b.order));
  });

  app.post('/api/backstage', authMiddleware, (req, res) => {
    const db = readDatabase();
    const item: BackstageItem = {
      id: 'bk-' + Date.now(),
      title: req.body.title || '',
      mediaType: req.body.mediaType || 'image',
      mediaUrl: req.body.mediaUrl || '',
      caption: req.body.caption || '',
      tag: req.body.tag || 'Bastidores',
      order: Number(req.body.order) || (db.backstage.length + 1),
      published: req.body.published ?? true
    };
    db.backstage.push(item);
    writeDatabase(db);
    return res.status(201).json(item);
  });

  app.put('/api/backstage/:id', authMiddleware, (req, res) => {
    const db = readDatabase();
    const idx = db.backstage.findIndex(b => b.id === req.params.id);
    if (idx === -1) {
      return res.status(404).json({ error: 'Item não encontrado' });
    }
    db.backstage[idx] = {
      ...db.backstage[idx],
      title: req.body.title !== undefined ? req.body.title : db.backstage[idx].title,
      mediaType: req.body.mediaType || db.backstage[idx].mediaType,
      mediaUrl: req.body.mediaUrl || db.backstage[idx].mediaUrl,
      caption: req.body.caption !== undefined ? req.body.caption : db.backstage[idx].caption,
      tag: req.body.tag || db.backstage[idx].tag,
      order: req.body.order !== undefined ? Number(req.body.order) : db.backstage[idx].order,
      published: req.body.published !== undefined ? req.body.published : db.backstage[idx].published,
    };
    writeDatabase(db);
    return res.json(db.backstage[idx]);
  });

  app.delete('/api/backstage-all', authMiddleware, (_req, res) => {
    const db = readDatabase();
    db.backstage = [];
    writeDatabase(db);
    return res.json({ success: true, count: 0 });
  });

  app.delete('/api/backstage/:id', authMiddleware, (req, res) => {
    const db = readDatabase();
    db.backstage = db.backstage.filter(b => b.id !== req.params.id);
    writeDatabase(db);
    return res.json({ success: true });
  });

  // --- Site Settings APIs ---
  app.get('/api/settings', (_req, res) => {
    const db = readDatabase();
    return res.json(db.settings);
  });

  app.put('/api/settings', authMiddleware, (req, res) => {
    const db = readDatabase();
    db.settings = { ...db.settings, ...req.body };
    // Ensure clean WhatsApp number format (5581985476681)
    if (db.settings.whatsappNumber) {
      db.settings.whatsappNumber = db.settings.whatsappNumber.replace(/\D/g, '');
    }
    writeDatabase(db);
    return res.json(db.settings);
  });

  // --- Contact / Briefing Leads APIs ---
  app.post('/api/leads', (req, res) => {
    const { name, companyOrProject, service, estimatedDate, description } = req.body;
    if (!name || !description) {
      return res.status(400).json({ error: 'Nome e descrição do projeto são obrigatórios.' });
    }
    const db = readDatabase();
    const newLead: BriefingLead = {
      id: 'lead-' + Date.now(),
      name,
      companyOrProject: companyOrProject || '',
      service: service || 'Audiovisual Geral',
      estimatedDate: estimatedDate || '',
      description,
      createdAt: new Date().toISOString(),
      status: 'novo'
    };
    db.leads.unshift(newLead);
    writeDatabase(db);
    return res.status(201).json({ success: true, lead: newLead });
  });

  app.get('/api/leads', authMiddleware, (_req, res) => {
    const db = readDatabase();
    return res.json(db.leads);
  });

  app.patch('/api/leads/:id', authMiddleware, (req, res) => {
    const db = readDatabase();
    const lead = db.leads.find(l => l.id === req.params.id);
    if (!lead) return res.status(404).json({ error: 'Lead não encontrado' });
    if (req.body.status) lead.status = req.body.status;
    writeDatabase(db);
    return res.json(lead);
  });

  app.delete('/api/leads/:id', authMiddleware, (req, res) => {
    const db = readDatabase();
    db.leads = db.leads.filter(l => l.id !== req.params.id);
    writeDatabase(db);
    return res.json({ success: true });
  });

  // --- Project Metrics API (Likes & Views) ---
  app.patch('/api/projects/:id/metrics', authMiddleware, (req, res) => {
    const db = readDatabase();
    const project = db.projects.find(p => p.id === req.params.id);
    if (!project) return res.status(404).json({ error: 'Projeto não encontrado' });
    if (req.body.likesCount !== undefined) project.likesCount = Number(req.body.likesCount);
    if (req.body.viewsCount !== undefined) project.viewsCount = Number(req.body.viewsCount);
    project.metricsUpdatedAt = new Date().toISOString();
    writeDatabase(db);
    return res.json({ success: true, project });
  });

  // --- Brands Soft Delete & Restore ---
  app.post('/api/brands/:id/trash', authMiddleware, (req, res) => {
    const db = readDatabase();
    const brand = db.brands.find(b => b.id === req.params.id);
    if (!brand) return res.status(404).json({ error: 'Marca não encontrada' });
    brand.inTrash = true;
    brand.deletedAt = new Date().toISOString();
    writeDatabase(db);
    return res.json({ success: true, message: 'Marca movida para a lixeira.' });
  });

  app.post('/api/brands/:id/restore', authMiddleware, (req, res) => {
    const db = readDatabase();
    const brand = db.brands.find(b => b.id === req.params.id);
    if (!brand) return res.status(404).json({ error: 'Marca não encontrada' });
    brand.inTrash = false;
    delete brand.deletedAt;
    writeDatabase(db);
    return res.json({ success: true, message: 'Marca restaurada com sucesso.' });
  });

  // --- Visual Identities APIs ---
  app.get('/api/visual-identities', (req, res) => {
    const db = readDatabase();
    const isFull = req.query.admin === 'true';
    const isTrash = req.query.trash === 'true';
    let list = db.visualIdentities || [];

    if (isTrash) {
      list = list.filter(item => item.inTrash);
      list.sort((a, b) => new Date(b.deletedAt || 0).getTime() - new Date(a.deletedAt || 0).getTime());
      return res.json(list);
    }

    list = list.filter(item => !item.inTrash);
    if (!isFull) {
      list = list.filter(item => item.published);
    }
    list.sort((a, b) => a.order - b.order);
    return res.json(list);
  });

  app.get('/api/visual-identities/:id', (req, res) => {
    const db = readDatabase();
    const item = (db.visualIdentities || []).find(i => i.id === req.params.id);
    if (!item) return res.status(404).json({ error: 'Projeto de identidade visual não encontrado' });
    return res.json(item);
  });

  app.post('/api/visual-identities', authMiddleware, (req, res) => {
    const db = readDatabase();
    if (!db.visualIdentities) db.visualIdentities = [];
    const newId = 'vi-' + Date.now();
    const newProject: VisualIdentityProject = {
      id: newId,
      title: req.body.title || 'Nova Identidade Visual',
      client: req.body.client || '',
      year: req.body.year || String(new Date().getFullYear()),
      description: req.body.description || '',
      concept: req.body.concept || '',
      coverImage: req.body.coverImage || '/assets/logo_web.png',
      logoMain: req.body.logoMain || '',
      logoVariations: Array.isArray(req.body.logoVariations) ? req.body.logoVariations : [],
      colorPalette: Array.isArray(req.body.colorPalette) ? req.body.colorPalette : [],
      typography: Array.isArray(req.body.typography) ? req.body.typography : [],
      graphicElements: Array.isArray(req.body.graphicElements) ? req.body.graphicElements : [],
      images: Array.isArray(req.body.images) ? req.body.images : [],
      externalLink: req.body.externalLink || '',
      order: Number(req.body.order) || (db.visualIdentities.length + 1),
      featured: Boolean(req.body.featured),
      published: req.body.published !== undefined ? Boolean(req.body.published) : true,
      inTrash: false
    };
    db.visualIdentities.push(newProject);
    writeDatabase(db);
    return res.status(201).json(newProject);
  });

  app.put('/api/visual-identities/:id', authMiddleware, (req, res) => {
    const db = readDatabase();
    if (!db.visualIdentities) db.visualIdentities = [];
    const idx = db.visualIdentities.findIndex(i => i.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Identidade visual não encontrada' });
    db.visualIdentities[idx] = {
      ...db.visualIdentities[idx],
      ...req.body,
      id: req.params.id
    };
    writeDatabase(db);
    return res.json(db.visualIdentities[idx]);
  });

  app.post('/api/visual-identities/:id/trash', authMiddleware, (req, res) => {
    const db = readDatabase();
    if (!db.visualIdentities) db.visualIdentities = [];
    const item = db.visualIdentities.find(i => i.id === req.params.id);
    if (!item) return res.status(404).json({ error: 'Não encontrado' });
    item.inTrash = true;
    item.deletedAt = new Date().toISOString();
    writeDatabase(db);
    return res.json({ success: true, message: 'Identidade visual movida para a lixeira.' });
  });

  app.post('/api/visual-identities/:id/restore', authMiddleware, (req, res) => {
    const db = readDatabase();
    if (!db.visualIdentities) db.visualIdentities = [];
    const item = db.visualIdentities.find(i => i.id === req.params.id);
    if (!item) return res.status(404).json({ error: 'Não encontrado' });
    item.inTrash = false;
    delete item.deletedAt;
    writeDatabase(db);
    return res.json({ success: true, message: 'Identidade visual restaurada com sucesso.' });
  });

  app.delete('/api/visual-identities/:id', authMiddleware, (req, res) => {
    const db = readDatabase();
    if (!db.visualIdentities) db.visualIdentities = [];
    db.visualIdentities = db.visualIdentities.filter(i => i.id !== req.params.id);
    writeDatabase(db);
    return res.json({ success: true, message: 'Identidade visual excluída definitivamente.' });
  });

  // --- Budget Simulator & Pricing Rules Engine API ---
  app.get('/api/simulator/config', (_req, res) => {
    const db = readDatabase();
    return res.json(db.simulatorConfig || initialDatabase.simulatorConfig);
  });

  app.put('/api/simulator/config', authMiddleware, (req, res) => {
    const db = readDatabase();
    db.simulatorConfig = {
      ...db.simulatorConfig,
      ...req.body
    };
    writeDatabase(db);
    return res.json(db.simulatorConfig);
  });

  app.post('/api/simulator/submit', (req, res) => {
    const db = readDatabase();
    if (!db.budgetSimulations) db.budgetSimulations = [];
    if (!db.leads) db.leads = [];

    const simulation: BudgetSimulationLead = {
      id: 'sim-' + Date.now(),
      createdAt: new Date().toISOString(),
      clientName: req.body.clientName || 'Cliente',
      companyName: req.body.companyName || '',
      instagram: req.body.instagram || '',
      city: req.body.city || '',
      eventDate: req.body.eventDate || '',
      observations: req.body.observations || '',
      categories: req.body.categories || [],
      packageSelected: req.body.packageSelected || '',
      packagePrice: req.body.packagePrice,
      standaloneItems: req.body.standaloneItems || [],
      addonItems: req.body.addonItems || [],
      customDescription: req.body.customDescription || '',
      estimatedTotal: req.body.estimatedTotal !== undefined ? req.body.estimatedTotal : null,
      status: req.body.status || (req.body.estimatedTotal ? 'estimado' : 'sob_avaliacao'),
      whatsappSent: true,
    };

    db.budgetSimulations.unshift(simulation);
    if (db.budgetSimulations.length > 500) {
      db.budgetSimulations = db.budgetSimulations.slice(0, 500);
    }

    // Also mirror to leads table so it appears in CRM / Leads management
    const leadDescription = `[Simulador de Orçamento] Categorias: ${(simulation.categories || []).join(', ')} | Pacote: ${simulation.packageSelected || 'Avulso/Personalizado'} | Total: ${simulation.estimatedTotal ? 'R$ ' + simulation.estimatedTotal.toFixed(2) : 'Sob Avaliação'} | Obs: ${simulation.observations || 'Nenhuma'}`;
    const lead: BriefingLead = {
      id: 'lead-sim-' + Date.now(),
      name: simulation.clientName,
      companyOrProject: simulation.companyName || simulation.clientName,
      service: `Orçamento: ${(simulation.categories || []).slice(0, 2).join(', ')}`,
      estimatedDate: simulation.eventDate,
      description: leadDescription,
      createdAt: new Date().toISOString(),
      status: 'novo'
    };
    db.leads.unshift(lead);

    writeDatabase(db);
    return res.json({ success: true, simulation });
  });

  app.get('/api/simulator/simulations', authMiddleware, (_req, res) => {
    const db = readDatabase();
    return res.json(db.budgetSimulations || []);
  });

  app.delete('/api/simulator/simulations/:id', authMiddleware, (req, res) => {
    const db = readDatabase();
    if (!db.budgetSimulations) db.budgetSimulations = [];
    db.budgetSimulations = db.budgetSimulations.filter(s => s.id !== req.params.id);
    writeDatabase(db);
    return res.json({ success: true });
  });

  // --- Visitor Analytics & Notifications API ---
  const recentVisits = new Map<string, number>();
  app.post('/api/analytics/visit', (req, res) => {
    const { path: visitPath, referrer, deviceType, sessionToken } = req.body;
    const clientIp = String(req.headers['x-forwarded-for'] || req.socket.remoteAddress || '');
    const sessionKey = `${sessionToken || clientIp}-${visitPath || '/'}`;
    const now = Date.now();

    // Deduplicate within 15 minutes (900,000 ms)
    const lastVisit = recentVisits.get(sessionKey);
    if (lastVisit && now - lastVisit < 15 * 60 * 1000) {
      return res.json({ success: true, deduplicated: true });
    }
    recentVisits.set(sessionKey, now);

    if (recentVisits.size > 1000) {
      for (const [key, time] of recentVisits.entries()) {
        if (now - time > 15 * 60 * 1000) recentVisits.delete(key);
      }
    }

    const db = readDatabase();
    if (!db.visitorNotifications) db.visitorNotifications = [];
    const notification: VisitorNotification = {
      id: 'vis-' + now + '-' + Math.floor(Math.random() * 1000),
      timestamp: new Date().toISOString(),
      path: visitPath || '/',
      referrer: referrer || '',
      deviceType: deviceType === 'mobile' ? 'mobile' : deviceType === 'tablet' ? 'tablet' : 'desktop',
      read: false,
    };
    db.visitorNotifications.unshift(notification);
    if (db.visitorNotifications.length > 200) {
      db.visitorNotifications = db.visitorNotifications.slice(0, 200);
    }
    writeDatabase(db);

    if (db.settings.visitorWebhookUrl && db.settings.visitorWebhookUrl.startsWith('http')) {
      fetch(db.settings.visitorWebhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: `🎥 Nova visita no site H7.VOX!\nPágina: ${notification.path}\nDispositivo: ${notification.deviceType}\nOrigem: ${notification.referrer || 'Acesso Direto'}\nHora: ${new Date().toLocaleTimeString('pt-BR')}`
        })
      }).catch(() => {});
    }

    return res.json({ success: true, recorded: true });
  });

  app.get('/api/analytics/notifications', authMiddleware, (_req, res) => {
    const db = readDatabase();
    const list = db.visitorNotifications || [];
    const unreadCount = list.filter(n => !n.read).length;
    return res.json({ notifications: list, unreadCount });
  });

  app.patch('/api/analytics/notifications/:id/read', authMiddleware, (req, res) => {
    const db = readDatabase();
    if (!db.visitorNotifications) db.visitorNotifications = [];
    const item = db.visitorNotifications.find(n => n.id === req.params.id);
    if (!item) return res.status(404).json({ error: 'Notificação não encontrada' });
    item.read = true;
    writeDatabase(db);
    return res.json({ success: true, notification: item });
  });

  app.post('/api/analytics/notifications/read-all', authMiddleware, (_req, res) => {
    const db = readDatabase();
    if (!db.visitorNotifications) db.visitorNotifications = [];
    db.visitorNotifications.forEach(n => { n.read = true; });
    writeDatabase(db);
    return res.json({ success: true, message: 'Todas as notificações marcadas como lidas.' });
  });

  app.delete('/api/analytics/notifications/:id', authMiddleware, (req, res) => {
    const db = readDatabase();
    if (!db.visitorNotifications) db.visitorNotifications = [];
    db.visitorNotifications = db.visitorNotifications.filter(n => n.id !== req.params.id);
    writeDatabase(db);
    return res.json({ success: true });
  });

  app.get('/api/analytics/stats', authMiddleware, (_req, res) => {
    const db = readDatabase();
    const list = db.visitorNotifications || [];
    const now = new Date();
    const todayStr = now.toISOString().slice(0, 10);
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    let visitsToday = 0;
    let visitsLast7Days = 0;
    const deviceBreakdown = { mobile: 0, desktop: 0, tablet: 0 };
    const pageCounts: Record<string, number> = {};

    list.forEach(item => {
      const itemDate = new Date(item.timestamp);
      if (item.timestamp.startsWith(todayStr)) visitsToday++;
      if (itemDate >= sevenDaysAgo) visitsLast7Days++;
      if (item.deviceType === 'mobile') deviceBreakdown.mobile++;
      else if (item.deviceType === 'tablet') deviceBreakdown.tablet++;
      else deviceBreakdown.desktop++;

      const p = item.path || '/';
      pageCounts[p] = (pageCounts[p] || 0) + 1;
    });

    const topPages = Object.entries(pageCounts)
      .map(([path, count]) => ({ path, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    const stats: VisitorStats = {
      totalVisits: list.length,
      visitsToday,
      visitsLast7Days,
      deviceBreakdown,
      topPages
    };
    return res.json(stats);
  });

  // --- Vite Dev Server Middleware or Production Static Serving ---
  if (process.env.NODE_ENV !== 'production') {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`H7.VOX server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
