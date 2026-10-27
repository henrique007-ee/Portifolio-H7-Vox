export type ProjectCategory = string;

export interface CategoryItem {
  id: string;
  name: string;
  order: number;
  active: boolean;
}

export interface Project {
  id: string;
  title: string;
  client: string;
  brandId?: string;
  category: ProjectCategory;
  year: string;
  description: string;
  thumbnail: string;
  videoUrl?: string;
  videoType: 'youtube' | 'vimeo' | 'direct' | 'instagram' | 'embed' | 'placeholder';
  instagramUrl?: string;
  instagramCode?: string;
  externalLink?: string;
  services: string[];
  credits?: string;
  results?: string;
  order: number;
  featured: boolean;
  published: boolean;
  aspectRatio: '16:9' | '9:16';
  likesCount?: number;
  viewsCount?: number;
  metricsUpdatedAt?: string;
  inTrash?: boolean;
  deletedAt?: string;
}

export interface ColorSwatch {
  name: string;
  hex: string;
}

export interface TypographySpec {
  role: string;
  family: string;
  sample?: string;
}

export interface VisualIdentityProject {
  id: string;
  title: string;
  client: string;
  year: string;
  description: string;
  concept?: string;
  coverImage: string;
  logoMain?: string;
  logoVariations?: string[];
  colorPalette?: ColorSwatch[];
  typography?: TypographySpec[];
  graphicElements?: string[];
  images: string[];
  externalLink?: string;
  order: number;
  featured: boolean;
  published: boolean;
  inTrash?: boolean;
  deletedAt?: string;
}

export interface ServiceItem {
  id: string;
  code: string;
  title: string;
  description: string;
  image?: string;
  deliverables: string[];
  whatsappMessage: string;
  order: number;
  active: boolean;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  text: string;
  avatar?: string;
  projectTitle?: string;
  projectId?: string;
  rating?: number;
  published: boolean;
}

export interface Brand {
  id: string;
  name: string;
  logo?: string;
  logoUrl?: string;
  website?: string;
  description?: string;
  relatedProjects?: string[];
  order: number;
  active: boolean;
  inTrash?: boolean;
  deletedAt?: string;
}

export interface BackstageItem {
  id: string;
  title: string;
  mediaType: 'image' | 'video';
  mediaUrl: string;
  caption?: string;
  tag: string;
  order: number;
  published?: boolean;
  inTrash?: boolean;
  deletedAt?: string;
}

export interface StatMetric {
  label: string;
  value: string;
  detail?: string;
}

export interface VisitorNotification {
  id: string;
  timestamp: string;
  path: string;
  referrer?: string;
  deviceType: 'mobile' | 'desktop' | 'tablet';
  read: boolean;
  ipHash?: string;
}

export interface VisitorStats {
  totalVisits: number;
  visitsToday: number;
  visitsLast7Days: number;
  deviceBreakdown: {
    mobile: number;
    desktop: number;
    tablet: number;
  };
  topPages: {
    path: string;
    count: number;
  }[];
}

export interface SiteSettings {
  brandName: string;
  ownerName: string;
  roleSubtitle: string;
  heroTitle: string;
  heroSubtitle: string;
  heroLead: string;
  heroVideoUrl: string;
  aboutTitle: string;
  aboutBio: string;
  aboutPhoto: string;
  aboutPhilosophy: string;
  whatsappNumber: string;
  defaultWhatsappMessage: string;
  instagramHandle: string;
  instagramUrl: string;
  email: string;
  location: string;
  logoUrl: string;
  logoOriginalUrl: string;
  showMetrics: boolean;
  metrics: StatMetric[];
  showBrands: boolean;
  showTestimonials: boolean;
  visitorWebhookUrl?: string;
}

export interface BriefingLead {
  id: string;
  name: string;
  companyOrProject: string;
  service: string;
  estimatedDate?: string;
  description: string;
  createdAt: string;
  status: 'novo' | 'em_contato' | 'fechado';
}

export interface SimulatorPackage {
  id: string;
  name: string;
  videoCount: number;
  cardCount: number;
  price: number;
  description?: string;
  active: boolean;
}

export interface SimulatorStandalonePrices {
  cardPrice: number;       // default: R$ 25
  carouselPrice: number;   // default: R$ 40
  videoPrice: number;      // default: R$ 100
}

export interface SimulatorEventPrices {
  photo5Price: number;         // default: R$ 20 (5 fotos)
  photo10Price: number;        // default: R$ 40 (10 fotos)
  singleVideoPrice: number;    // default: R$ 120 (vídeo individual)
  collectiveVideoPrice: number;// default: R$ 150 (vídeo coletivo)
}

export interface SimulatorCustomAddon {
  id: string;
  title: string;
  price: number;
  unitLabel: string;
  description?: string;
  active: boolean;
}

export interface SimulatorConfig {
  packages: SimulatorPackage[];
  standalonePrices: SimulatorStandalonePrices;
  eventPrices: SimulatorEventPrices;
  politicsRateMultiplier?: number;
  customAddons: SimulatorCustomAddon[];
  formulaNotes?: string;
}

export interface BudgetSimulationLead {
  id: string;
  createdAt: string;
  clientName: string;
  companyName?: string;
  instagram?: string;
  city?: string;
  eventDate?: string;
  observations?: string;
  categories: string[];
  packageSelected?: string;
  packagePrice?: number;
  standaloneItems: { name: string; quantity: number; unitPrice?: number; total?: number }[];
  addonItems: { name: string; quantity: number; unitPrice?: number; total?: number }[];
  customDescription?: string;
  estimatedTotal: number | null; // null if requires custom evaluation
  status: 'estimado' | 'sob_avaliacao';
  whatsappSent?: boolean;
}

