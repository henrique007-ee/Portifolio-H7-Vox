import React, { useState, useEffect, useMemo } from 'react';
import {
  Scissors,
  Zap,
  Film,
  Calendar,
  Instagram,
  Award,
  Camera,
  Palette,
  TrendingUp,
  HelpCircle,
  Plus,
  Minus,
  Check,
  ChevronRight,
  ChevronLeft,
  MessageCircle,
  ArrowRight,
  Clock,
  User,
  Building,
  MapPin,
  RefreshCw,
  Sparkles,
  Info
} from 'lucide-react';
import { api } from '../services/api';
import { OFFICIAL_CONTACTS } from '../config/contacts';
import { Section3DShowcase } from './Section3DShowcase';
import { SectionAmbient3DBackground } from './VisualEffects';
import type { SiteSettings, SimulatorConfig, SimulatorPackage } from '../types';

interface BudgetSimulatorProps {
  settings: SiteSettings;
}

interface CategoryOption {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  suggestsDate?: boolean;
}

const CATEGORY_OPTIONS: CategoryOption[] = [
  {
    id: 'edicao_videos',
    title: 'Edição de vídeos',
    description: 'Cortes dinâmicos, ritmo assertivo, cor cinematográfica e sound design para alta retenção.',
    icon: Scissors,
  },
  {
    id: 'storymaker',
    title: 'Storymaker e conteúdo em tempo real',
    description: 'Cobertura ágil com entrega de stories dinâmicos e reels durante o próprio evento.',
    icon: Zap,
    suggestsDate: true,
  },
  {
    id: 'filmmaker',
    title: 'Filmmaker e captação',
    description: 'Direção e captação de vídeo com equipamento profissional e estética cinematográfica.',
    icon: Film,
    suggestsDate: true,
  },
  {
    id: 'cobertura_eventos',
    title: 'Cobertura de eventos',
    description: 'Registro completo de festivais, shows, conferências, celebrações e pós-eventos.',
    icon: Calendar,
    suggestsDate: true,
  },
  {
    id: 'reels_redes',
    title: 'Reels e redes sociais',
    description: 'Vídeos verticais de alto impacto pensados para o algoritmo do Instagram e TikTok.',
    icon: Instagram,
  },
  {
    id: 'comunicacao_politica',
    title: 'Comunicação política',
    description: 'Pílulas estratégicas, agendas públicas, debates e posicionamento de imagem pública.',
    icon: Award,
  },
  {
    id: 'fotografia',
    title: 'Fotografia e bastidores',
    description: 'Registros profissionais de momentos, ensaios corporativos e making of.',
    icon: Camera,
    suggestsDate: true,
  },
  {
    id: 'identidade_visual',
    title: 'Identidade visual',
    description: 'Criação de marcas, manuais, paletas cromáticas, tipografia e aplicações.',
    icon: Palette,
  },
  {
    id: 'publicidade_marcas',
    title: 'Publicidade e marcas',
    description: 'Filmes comerciais, vídeos institucionais e criativos de conversão para empresas.',
    icon: TrendingUp,
  },
  {
    id: 'outro_projeto',
    title: 'Outro projeto sob medida',
    description: 'Formatos mistos, necessidades específicas ou produções exclusivas.',
    icon: HelpCircle,
  },
];

export const BudgetSimulator: React.FC<BudgetSimulatorProps> = ({ settings }) => {
  const [config, setConfig] = useState<SimulatorConfig | null>(null);

  // Stepper State: 1 = Tipos, 2 = Especificações, 3 = Complementos, 4 = Contato, 5 = Resumo do Briefing
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Selections
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedPackageId, setSelectedPackageId] = useState<string | null>(null);
  const [videoFormat, setVideoFormat] = useState<'vertical' | 'horizontal'>('vertical');
  const [materialSource, setMaterialSource] = useState<'cliente' | 'captacao'>('cliente');

  // Quantities
  const [customVideoCount, setCustomVideoCount] = useState<number>(0);
  const [customCardCount, setCustomCardCount] = useState<number>(0);
  const [customCarouselCount, setCustomCarouselCount] = useState<number>(0);

  // Event specifics
  const [eventPhotoCount, setEventPhotoCount] = useState<number>(0);
  const [eventSingleVideoCount, setEventSingleVideoCount] = useState<number>(0);
  const [eventCollectiveVideoCount, setEventCollectiveVideoCount] = useState<number>(0);
  const [storymakerDuration, setStorymakerDuration] = useState<'meio_periodo' | 'diaria_completa' | 'multiplos_dias'>('meio_periodo');

  // Branding deliverables
  const [identityDeliverables, setIdentityDeliverables] = useState<string[]>([]);
  const [otherProjectText, setOtherProjectText] = useState<string>('');

  // Addons
  const [addonCards, setAddonCards] = useState<number>(0);
  const [addonCarousels, setAddonCarousels] = useState<number>(0);
  const [addonVideos, setAddonVideos] = useState<number>(0);
  const [addonPhotos5, setAddonPhotos5] = useState<number>(0);

  // Client info
  const [clientName, setClientName] = useState<string>('');
  const [companyName, setCompanyName] = useState<string>('');
  const [instagram, setInstagram] = useState<string>('');
  const [city, setCity] = useState<string>('');
  const [eventDate, setEventDate] = useState<string>('');
  const [observations, setObservations] = useState<string>('');
  const [formErrors, setFormErrors] = useState<{ clientName?: string }>({});

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submissionSuccess, setSubmissionSuccess] = useState<boolean>(false);

  useEffect(() => {
    api.getSimulatorConfig()
      .then((cfg) => setConfig(cfg))
      .catch(() => {
        setConfig({
          packages: [
            { id: 'pkg-1', name: '2 Vídeos', videoCount: 2, cardCount: 0, price: 200, active: true },
            { id: 'pkg-2', name: '4 Vídeos', videoCount: 4, cardCount: 0, price: 300, active: true },
            { id: 'pkg-3', name: '6 Vídeos', videoCount: 6, cardCount: 0, price: 600, active: true },
          ],
          standalonePrices: { cardPrice: 25, carouselPrice: 40, videoPrice: 100 },
          eventPrices: { photo5Price: 20, photo10Price: 40, singleVideoPrice: 120, collectiveVideoPrice: 150 },
          customAddons: [],
        });
      });
  }, []);

  const toggleCategory = (id: string) => {
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const hasVideoEditing = selectedCategories.includes('edicao_videos') || selectedCategories.includes('reels_redes');
  const hasStorymaker = selectedCategories.includes('storymaker');
  const hasEvents = selectedCategories.includes('cobertura_eventos');
  const hasFilmmaker = selectedCategories.includes('filmmaker');
  const hasPhotography = selectedCategories.includes('fotografia');
  const hasIdentity = selectedCategories.includes('identidade_visual');
  const hasPolitics = selectedCategories.includes('comunicacao_politica');
  const hasAdvertising = selectedCategories.includes('publicidade_marcas');
  const hasOther = selectedCategories.includes('outro_projeto');

  const shouldAskDate = useMemo(() => {
    return selectedCategories.some((id) => {
      const cat = CATEGORY_OPTIONS.find((c) => c.id === id);
      return cat?.suggestsDate;
    });
  }, [selectedCategories]);

  const activePackages = useMemo(() => {
    return (config?.packages || [
      { id: 'pkg-1', name: '2 Vídeos', videoCount: 2, cardCount: 0, price: 200, active: true },
      { id: 'pkg-2', name: '4 Vídeos', videoCount: 4, cardCount: 0, price: 300, active: true },
      { id: 'pkg-3', name: '6 Vídeos', videoCount: 6, cardCount: 0, price: 600, active: true },
    ]).filter((p) => p.active);
  }, [config]);

  const currentPackage: SimulatorPackage | undefined = useMemo(() => {
    if (!selectedPackageId) return undefined;
    return activePackages.find((p) => p.id === selectedPackageId);
  }, [selectedPackageId, activePackages]);

  // Internal Project Estimate Calculation using registered config rules (No public unit price table exposed)
  const estimatedResult = useMemo(() => {
    const standalone = config?.standalonePrices || { cardPrice: 25, carouselPrice: 40, videoPrice: 100 };
    const eventP = config?.eventPrices || { photo5Price: 20, photo10Price: 40, singleVideoPrice: 120, collectiveVideoPrice: 150 };
    const politicsMultiplier = config?.politicsRateMultiplier || 1.5;

    let subtotal = 0;
    let hasQuantifiedItems = false;

    if (currentPackage) {
      subtotal += currentPackage.price;
      hasQuantifiedItems = true;
    } else if (customVideoCount > 0) {
      subtotal += customVideoCount * standalone.videoPrice;
      hasQuantifiedItems = true;
    }

    if (customCardCount > 0) {
      subtotal += customCardCount * standalone.cardPrice;
      hasQuantifiedItems = true;
    }
    if (customCarouselCount > 0) {
      subtotal += customCarouselCount * standalone.carouselPrice;
      hasQuantifiedItems = true;
    }

    if (eventPhotoCount > 0) {
      const packsOf10 = Math.floor(eventPhotoCount / 10);
      const rem5 = Math.ceil((eventPhotoCount % 10) / 5);
      subtotal += packsOf10 * eventP.photo10Price + rem5 * eventP.photo5Price;
      hasQuantifiedItems = true;
    }
    if (eventSingleVideoCount > 0) {
      subtotal += eventSingleVideoCount * eventP.singleVideoPrice;
      hasQuantifiedItems = true;
    }
    if (eventCollectiveVideoCount > 0) {
      subtotal += eventCollectiveVideoCount * eventP.collectiveVideoPrice;
      hasQuantifiedItems = true;
    }

    // Addons
    if (addonCards > 0) {
      subtotal += addonCards * standalone.cardPrice;
      hasQuantifiedItems = true;
    }
    if (addonCarousels > 0) {
      subtotal += addonCarousels * standalone.carouselPrice;
      hasQuantifiedItems = true;
    }
    if (addonVideos > 0) {
      subtotal += addonVideos * standalone.videoPrice;
      hasQuantifiedItems = true;
    }
    if (addonPhotos5 > 0) {
      subtotal += addonPhotos5 * eventP.photo5Price;
      hasQuantifiedItems = true;
    }

    if (hasPolitics && subtotal > 0) {
      subtotal = Math.round(subtotal * politicsMultiplier);
    }

    const requiresCustomQuote =
      hasStorymaker || hasFilmmaker || hasIdentity || hasAdvertising || hasOther || materialSource === 'captacao';

    return {
      total: hasQuantifiedItems ? subtotal : null,
      requiresCustomQuote,
    };
  }, [
    config,
    currentPackage,
    customVideoCount,
    customCardCount,
    customCarouselCount,
    eventPhotoCount,
    eventSingleVideoCount,
    eventCollectiveVideoCount,
    addonCards,
    addonCarousels,
    addonVideos,
    addonPhotos5,
    hasPolitics,
    hasStorymaker,
    hasFilmmaker,
    hasIdentity,
    hasAdvertising,
    hasOther,
    materialSource,
  ]);

  // Construct Personalized WhatsApp Briefing Message
  const generatedWhatsAppMessage = useMemo(() => {
    const selectedCatNames = selectedCategories
      .map((id) => CATEGORY_OPTIONS.find((c) => c.id === id)?.title)
      .filter(Boolean)
      .join(', ') || 'A definir';

    const servicesList: string[] = [];
    if (hasVideoEditing) {
      servicesList.push(`• Edição de vídeo (${videoFormat === 'vertical' ? 'Vertical 9:16 (Reels/TikTok)' : 'Horizontal 16:9 (YouTube/Institucional)'}) - Material: ${materialSource === 'cliente' ? 'Já gravado pelo cliente' : 'Necessita de captação'}`);
    }
    if (hasStorymaker) {
      servicesList.push(`• Storymaker e tempo real (${storymakerDuration === 'meio_periodo' ? 'Meio período' : storymakerDuration === 'diaria_completa' ? 'Diária completa' : 'Múltiplos dias'})`);
    }
    if (hasFilmmaker) servicesList.push('• Filmmaker e captação cinematográfica');
    if (hasEvents) servicesList.push('• Cobertura audiovisual de evento');
    if (hasPhotography) servicesList.push('• Fotografia profissional e tratamento');
    if (hasIdentity) servicesList.push(`• Identidade visual (${identityDeliverables.length > 0 ? identityDeliverables.join(', ') : 'Completa'})`);
    if (hasPolitics) servicesList.push('• Comunicação política e posicionamento estratégico');
    if (hasAdvertising) servicesList.push('• Publicidade e filmes comerciais para marcas');
    if (hasOther && otherProjectText) servicesList.push(`• Outro projeto: ${otherProjectText}`);

    const quantitiesList: string[] = [];
    if (currentPackage) {
      quantitiesList.push(`• Pacote escolhido: ${currentPackage.name} (${currentPackage.videoCount} vídeos com edição completa)`);
    } else {
      if (customVideoCount > 0) quantitiesList.push(`• ${customVideoCount} vídeo(s) avulso(s)`);
      if (customCardCount > 0) quantitiesList.push(`• ${customCardCount} card(s) estático(s)`);
      if (customCarouselCount > 0) quantitiesList.push(`• ${customCarouselCount} carrossel(is)`);
    }

    if (eventPhotoCount > 0) quantitiesList.push(`• ${eventPhotoCount} fotos de evento tratadas`);
    if (eventSingleVideoCount > 0) quantitiesList.push(`• ${eventSingleVideoCount} vídeo(s) individual(is) de evento`);
    if (eventCollectiveVideoCount > 0) quantitiesList.push(`• ${eventCollectiveVideoCount} vídeo(s) coletivo(s) de evento`);

    const addonsList: string[] = [];
    if (addonCards > 0) addonsList.push(`+ ${addonCards} Card(s) para redes sociais`);
    if (addonCarousels > 0) addonsList.push(`+ ${addonCarousels} Carrossel(is)`);
    if (addonVideos > 0) addonsList.push(`+ ${addonVideos} Vídeo(s) extra(s)`);
    if (addonPhotos5 > 0) addonsList.push(`+ ${addonPhotos5 * 5} Fotos extras`);

    return `Olá, Endson! Montei meu briefing pelo simulador H7.VOX e gostaria de solicitar um orçamento para meu projeto:

📋 DADOS DO CONTATO
• Nome: ${clientName || 'Não informado'}
• Empresa / Projeto: ${companyName || 'Não informado'}
• Instagram: ${instagram || 'Não informado'}
• Cidade: ${city || 'Não informada'}

🎯 TIPO DE PROJETO
• ${selectedCatNames}

🎬 SERVIÇOS & ESPECIFICAÇÕES
${servicesList.length > 0 ? servicesList.join('\n') : '• A definir'}

📦 VOLUMES & QUANTIDADES
${quantitiesList.length > 0 ? quantitiesList.join('\n') : '• Sob alinhamento'}

➕ COMPLEMENTOS
${addonsList.length > 0 ? addonsList.join('\n') : '• Nenhum complemento adicional'}

📅 DATA / PRAZO PREVISTO
• ${eventDate || 'A definir'}

💬 OBSERVAÇÕES
• ${observations || 'Nenhuma observação extra'}

📲 Gostaria de conversar sobre os valores e disponibilidade para esse projeto!`;
  }, [
    selectedCategories,
    hasVideoEditing,
    videoFormat,
    materialSource,
    hasStorymaker,
    storymakerDuration,
    hasFilmmaker,
    hasEvents,
    hasPhotography,
    hasIdentity,
    identityDeliverables,
    hasPolitics,
    hasAdvertising,
    hasOther,
    otherProjectText,
    currentPackage,
    customVideoCount,
    customCardCount,
    customCarouselCount,
    eventPhotoCount,
    eventSingleVideoCount,
    eventCollectiveVideoCount,
    addonCards,
    addonCarousels,
    addonVideos,
    addonPhotos5,
    estimatedResult,
    clientName,
    companyName,
    instagram,
    city,
    eventDate,
    observations,
  ]);

  const handleNextStep = () => {
    if (currentStep === 1 && selectedCategories.length === 0) {
      return;
    }
    if (currentStep === 4) {
      if (!clientName.trim()) {
        setFormErrors({ clientName: 'Por favor, informe seu nome para contato.' });
        return;
      }
      setFormErrors({});
    }
    setCurrentStep((prev) => Math.min(prev + 1, 5));
    const el = document.getElementById('orcamento');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handlePrevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    const el = document.getElementById('orcamento');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleSendToWhatsApp = async () => {
    setIsSubmitting(true);
    try {
      await api.submitSimulation({
        clientName: clientName || 'Cliente H7.VOX',
        companyName,
        instagram,
        city,
        eventDate,
        observations,
        categories: selectedCategories,
        packageSelected: currentPackage?.name || 'Personalizado',
        standaloneItems: [],
        addonItems: [],
        estimatedTotal: estimatedResult.total,
        status: estimatedResult.total !== null && !estimatedResult.requiresCustomQuote ? 'estimado' : 'sob_avaliacao',
        whatsappSent: true,
      }).catch((e) => console.warn('Aviso: simulação registrada localmente', e));

      setSubmissionSuccess(true);
      const encoded = encodeURIComponent(generatedWhatsAppMessage);
      const cleanPhone = (settings.whatsappNumber || OFFICIAL_CONTACTS.whatsappCountryNumber).replace(/\D/g, '');
      const url = `https://wa.me/${cleanPhone}?text=${encoded}`;
      window.location.href = url;
    } catch (err) {
      console.error(err);
      const encoded = encodeURIComponent(generatedWhatsAppMessage);
      const cleanPhone = (settings.whatsappNumber || OFFICIAL_CONTACTS.whatsappCountryNumber).replace(/\D/g, '');
      window.location.href = `https://wa.me/${cleanPhone}?text=${encoded}`;
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="orcamento" className="py-24 sm:py-32 bg-[#050505] border-b border-white/10 relative overflow-hidden">
      <SectionAmbient3DBackground
        leftSculpture="number7"
        rightSculpture="letterH"
        showSoundWave={true}
        smokeIntensity="subtle"
      />
      <Section3DShowcase preset="simulator" />
      <div id="simulador" className="absolute -top-20 left-0 pointer-events-none" aria-hidden="true" />
      <div className="max-w-5xl mx-auto px-5 sm:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#08CC07] mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>SIMULADOR DE PROJETOS</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-[#FFFFFF] tracking-tight font-display mb-4">
            Monte Seu Orçamento
          </h2>
          <p className="text-sm sm:text-base text-[#858585]">
            Selecione os serviços desejados, monte o briefing completo do seu projeto e envie diretamente para o WhatsApp para receber seu orçamento personalizado.
          </p>
        </div>

        {/* Stepper Progress Bar */}
        <div className="mb-10">
          <div className="flex items-center justify-between max-w-2xl mx-auto">
            {[
              { num: 1, label: 'Categorias' },
              { num: 2, label: 'Detalhes' },
              { num: 3, label: 'Adicionais' },
              { num: 4, label: 'Contato' },
              { num: 5, label: 'WhatsApp' },
            ].map((step) => {
              const isActive = currentStep === step.num;
              const isPast = currentStep > step.num;
              return (
                <div key={step.num} className="flex flex-col items-center">
                  <div
                    className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm transition-all duration-300 font-mono tabular-nums ${
                      isActive
                        ? 'bg-[#08CC07] text-[#050505] ring-4 ring-[#08CC07]/20 shadow-lg shadow-[#08CC07]/30 scale-105'
                        : isPast
                        ? 'bg-[#08CC07]/20 border border-[#08CC07] text-[#08CC07]'
                        : 'bg-[#0A0A0A] border border-white/10 text-white/40'
                    }`}
                  >
                    {isPast ? <Check className="w-4 h-4" /> : step.num}
                  </div>
                  <span
                    className={`text-[10px] sm:text-xs font-mono mt-1.5 hidden sm:block ${
                      isActive ? 'text-[#08CC07] font-bold' : isPast ? 'text-white/80' : 'text-[#858585]'
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Main Card */}
        <div className="p-6 sm:p-10 rounded-3xl bg-[#0A0A0A] border border-white/10 shadow-2xl">
          {/* ========================================================= */}
          {/* STEP 1: CATEGORIAS DO PROJETO                             */}
          {/* ========================================================= */}
          {currentStep === 1 && (
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-6 mb-8 border-b border-white/10">
                <div>
                  <div className="text-xs font-mono text-[#08CC07] uppercase tracking-wider mb-1">
                    ETAPA 1 DE 5
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white">
                    Qual o foco do seu projeto?
                  </h3>
                </div>
                <span className="text-xs text-white/50 font-mono">
                  Selecione uma ou mais opções
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-8">
                {CATEGORY_OPTIONS.map((cat) => {
                  const Icon = cat.icon;
                  const isSelected = selectedCategories.includes(cat.id);
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => toggleCategory(cat.id)}
                      className={`p-5 rounded-2xl border text-left transition-all duration-200 flex items-start gap-4 cursor-pointer group ${
                        isSelected
                          ? 'bg-[#08CC07]/10 border-[#08CC07] shadow-lg shadow-[#08CC07]/10'
                          : 'bg-[#161616] border-white/5 hover:border-white/20 hover:bg-[#1a1a1a]'
                      }`}
                    >
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                          isSelected
                            ? 'bg-[#08CC07] text-[#080808]'
                            : 'bg-white/5 text-white/70 group-hover:text-white'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <h4
                            className={`text-sm font-bold transition-colors ${
                              isSelected ? 'text-[#08CC07]' : 'text-white'
                            }`}
                          >
                            {cat.title}
                          </h4>
                          <div
                            className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 ${
                              isSelected
                                ? 'bg-[#08CC07] border-[#08CC07] text-black'
                                : 'border-white/20'
                            }`}
                          >
                            {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                          </div>
                        </div>
                        <p className="text-xs text-white/50 mt-1 line-clamp-2 leading-relaxed">
                          {cat.description}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center justify-end pt-6 border-t border-white/10">
                <button
                  type="button"
                  onClick={handleNextStep}
                  disabled={selectedCategories.length === 0}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#08CC07] text-[#080808] font-bold text-sm hover:bg-[#0ae309] transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#08CC07]/20 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer active:scale-95"
                >
                  <span>Avançar para Detalhes</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* STEP 2: ESPECIFICAÇÕES & FORMATOS (NO PRICES)              */}
          {/* ========================================================= */}
          {currentStep === 2 && (
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-6 mb-8 border-b border-white/10">
                <div>
                  <div className="text-xs font-mono text-[#08CC07] uppercase tracking-wider mb-1">
                    ETAPA 2 DE 5
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white">
                    Defina os detalhes e formatos
                  </h3>
                </div>
                <span className="text-xs text-white/50 font-mono">
                  Personalização sob medida
                </span>
              </div>

              <div className="space-y-8 mb-8">
                {/* 1. SELEÇÃO DE PACOTES DE VÍDEO */}
                {(hasVideoEditing || !selectedCategories.some((c) => ['cobertura_eventos', 'storymaker', 'fotografia', 'identidade_visual'].includes(c))) && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-white uppercase tracking-wider font-mono text-[#08CC07]">
                        PACOTES DE EDIÇÃO SUGERIDOS
                      </h4>
                      <span className="text-xs text-white/40">Selecione o plano desejado</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {activePackages.map((pkg) => {
                        const isSelected = selectedPackageId === pkg.id;
                        return (
                          <div
                            key={pkg.id}
                            onClick={() => {
                              setSelectedPackageId(isSelected ? null : pkg.id);
                              if (!isSelected) {
                                setCustomVideoCount(0);
                              }
                            }}
                            className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                              isSelected
                                ? 'bg-[#08CC07]/10 border-[#08CC07] shadow-lg shadow-[#08CC07]/10'
                                : 'bg-[#161616] border-white/5 hover:border-white/20'
                            }`}
                          >
                            <div>
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-mono font-bold text-[#08CC07]">
                                  {pkg.name}
                                </span>
                                <div
                                  className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                                    isSelected
                                      ? 'bg-[#08CC07] border-[#08CC07] text-black'
                                      : 'border-white/20'
                                  }`}
                                >
                                  {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                                </div>
                              </div>
                              <h5 className="text-base font-bold text-white mb-1.5">
                                {pkg.videoCount} Vídeos com Edição Completa
                              </h5>
                              <p className="text-xs text-white/50 leading-relaxed">
                                {pkg.description || 'Cortes dinâmicos, ritmo, cor, legendas sincronizadas e sound design.'}
                              </p>
                            </div>

                            <div className="pt-3 mt-4 border-t border-white/5 text-[11px] font-mono text-[#08CC07]">
                              ✓ Ideal para consistência em redes
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Vídeos Avulsos se não usar pacote */}
                    <div className="p-4 rounded-xl bg-[#161616] border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <span className="text-xs font-bold text-white block">
                          Ou escolha vídeos avulsos sob demanda:
                        </span>
                        <span className="text-[11px] text-white/40 block">
                          Edição personalizada para projetos específicos
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedPackageId(null);
                            setCustomVideoCount(Math.max(0, customVideoCount - 1));
                          }}
                          className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="font-mono text-sm font-bold text-white min-w-[2rem] text-center">
                          {selectedPackageId ? 0 : customVideoCount}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedPackageId(null);
                            setCustomVideoCount(customVideoCount + 1);
                          }}
                          className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. FORMATO & CAPTAÇÃO */}
                {hasVideoEditing && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-5 rounded-2xl bg-[#161616] border border-white/5">
                      <label className="block text-xs font-mono uppercase tracking-wider text-white/70 mb-3">
                        Formato Principal do Vídeo
                      </label>
                      <div className="grid grid-cols-2 gap-2.5">
                        <button
                          type="button"
                          onClick={() => setVideoFormat('vertical')}
                          className={`py-3 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                            videoFormat === 'vertical'
                              ? 'bg-[#08CC07]/15 border-[#08CC07] text-[#08CC07]'
                              : 'bg-white/5 border-white/5 text-white/60 hover:text-white'
                          }`}
                        >
                          Vertical (9:16) Reels / TikTok
                        </button>
                        <button
                          type="button"
                          onClick={() => setVideoFormat('horizontal')}
                          className={`py-3 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                            videoFormat === 'horizontal'
                              ? 'bg-[#08CC07]/15 border-[#08CC07] text-[#08CC07]'
                              : 'bg-white/5 border-white/5 text-white/60 hover:text-white'
                          }`}
                        >
                          Horizontal (16:9) YouTube / TV
                        </button>
                      </div>
                    </div>

                    <div className="p-5 rounded-2xl bg-[#161616] border border-white/5">
                      <label className="block text-xs font-mono uppercase tracking-wider text-white/70 mb-3">
                        Origem das Gravações
                      </label>
                      <div className="grid grid-cols-2 gap-2.5">
                        <button
                          type="button"
                          onClick={() => setMaterialSource('cliente')}
                          className={`py-3 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                            materialSource === 'cliente'
                              ? 'bg-[#08CC07]/15 border-[#08CC07] text-[#08CC07]'
                              : 'bg-white/5 border-white/5 text-white/60 hover:text-white'
                          }`}
                        >
                          Já possuo gravação pronta
                        </button>
                        <button
                          type="button"
                          onClick={() => setMaterialSource('captacao')}
                          className={`py-3 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                            materialSource === 'captacao'
                              ? 'bg-[#08CC07]/15 border-[#08CC07] text-[#08CC07]'
                              : 'bg-white/5 border-white/5 text-white/60 hover:text-white'
                          }`}
                        >
                          Preciso de captação presencial
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. STORYMAKER DETALHES */}
                {hasStorymaker && (
                  <div className="p-5 rounded-2xl bg-[#161616] border border-white/5">
                    <label className="block text-xs font-mono uppercase tracking-wider text-white/70 mb-3">
                      Tempo de Cobertura Storymaker
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      {[
                        { id: 'meio_periodo', label: 'Meio Período (Até 4h)' },
                        { id: 'diaria_completa', label: 'Diária Completa (Até 8h)' },
                        { id: 'multiplos_dias', label: 'Múltiplos Dias / Festival' },
                      ].map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setStorymakerDuration(item.id as any)}
                          className={`py-3 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                            storymakerDuration === item.id
                              ? 'bg-[#08CC07]/15 border-[#08CC07] text-[#08CC07]'
                              : 'bg-white/5 border-white/5 text-white/60 hover:text-white'
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* 4. EVENTOS: FOTOS & VÍDEOS */}
                {(hasEvents || hasPhotography) && (
                  <div className="p-6 rounded-2xl bg-[#161616] border border-white/5 space-y-4">
                    <h4 className="text-xs font-mono uppercase tracking-wider text-[#08CC07]">
                      ENTREGAS PARA EVENTO & FOTOGRAFIA
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="p-4 rounded-xl bg-black/40 border border-white/5">
                        <span className="text-xs font-bold text-white block mb-2">Fotos Tratadas:</span>
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => setEventPhotoCount(Math.max(0, eventPhotoCount - 5))}
                            className="w-8 h-8 rounded-lg bg-white/10 text-white flex items-center justify-center cursor-pointer"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="font-mono text-sm font-bold text-white min-w-[2rem] text-center">
                            {eventPhotoCount}
                          </span>
                          <button
                            type="button"
                            onClick={() => setEventPhotoCount(eventPhotoCount + 5)}
                            className="w-8 h-8 rounded-lg bg-white/10 text-white flex items-center justify-center cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <div className="p-4 rounded-xl bg-black/40 border border-white/5">
                        <span className="text-xs font-bold text-white block mb-2">Vídeo Individual:</span>
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => setEventSingleVideoCount(Math.max(0, eventSingleVideoCount - 1))}
                            className="w-8 h-8 rounded-lg bg-white/10 text-white flex items-center justify-center cursor-pointer"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="font-mono text-sm font-bold text-white min-w-[2rem] text-center">
                            {eventSingleVideoCount}
                          </span>
                          <button
                            type="button"
                            onClick={() => setEventSingleVideoCount(eventSingleVideoCount + 1)}
                            className="w-8 h-8 rounded-lg bg-white/10 text-white flex items-center justify-center cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <div className="p-4 rounded-xl bg-black/40 border border-white/5">
                        <span className="text-xs font-bold text-white block mb-2">Vídeo Coletivo:</span>
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => setEventCollectiveVideoCount(Math.max(0, eventCollectiveVideoCount - 1))}
                            className="w-8 h-8 rounded-lg bg-white/10 text-white flex items-center justify-center cursor-pointer"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="font-mono text-sm font-bold text-white min-w-[2rem] text-center">
                            {eventCollectiveVideoCount}
                          </span>
                          <button
                            type="button"
                            onClick={() => setEventCollectiveVideoCount(eventCollectiveVideoCount + 1)}
                            className="w-8 h-8 rounded-lg bg-white/10 text-white flex items-center justify-center cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 5. OUTRO PROJETO */}
                {hasOther && (
                  <div className="p-5 rounded-2xl bg-[#161616] border border-white/5">
                    <label className="block text-xs font-mono uppercase tracking-wider text-white/70 mb-2">
                      Detalhes do seu projeto
                    </label>
                    <textarea
                      rows={3}
                      value={otherProjectText}
                      onChange={(e) => setOtherProjectText(e.target.value)}
                      placeholder="Descreva seu projeto, objetivo e referências..."
                      className="w-full bg-[#1c1c1c] border border-white/10 rounded-xl p-3 text-xs text-white"
                    />
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-white/10">
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className="px-5 py-3 rounded-xl bg-white/5 text-white/70 hover:text-white font-medium text-xs sm:text-sm cursor-pointer"
                >
                  Voltar
                </button>
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="px-7 py-3 rounded-xl bg-[#08CC07] text-[#080808] font-bold text-xs sm:text-sm hover:bg-[#0ae309] transition-all cursor-pointer"
                >
                  Avançar para Adicionais
                </button>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* STEP 3: COMPLEMENTOS (CARDS, CARROSSÉIS, EXTRAS)          */}
          {/* ========================================================= */}
          {currentStep === 3 && (
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-6 mb-8 border-b border-white/10">
                <div>
                  <div className="text-xs font-mono text-[#08CC07] uppercase tracking-wider mb-1">
                    ETAPA 3 DE 5
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white">
                    Deseja adicionar peças complementares?
                  </h3>
                </div>
                <span className="text-xs text-white/50 font-mono">
                  Opcional — adicione se necessário
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                <div className="p-5 rounded-2xl bg-[#161616] border border-white/5 flex items-center justify-between">
                  <div>
                    <h5 className="text-sm font-bold text-white">Cards Estáticos para Redes</h5>
                    <p className="text-xs text-white/40 mt-0.5">Posts com arte alinhada à sua identidade</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setAddonCards(Math.max(0, addonCards - 1))}
                      className="w-8 h-8 rounded-lg bg-white/10 text-white flex items-center justify-center cursor-pointer"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="font-mono text-sm font-bold text-white min-w-[2rem] text-center">
                      {addonCards}
                    </span>
                    <button
                      type="button"
                      onClick={() => setAddonCards(addonCards + 1)}
                      className="w-8 h-8 rounded-lg bg-white/10 text-white flex items-center justify-center cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-[#161616] border border-white/5 flex items-center justify-between">
                  <div>
                    <h5 className="text-sm font-bold text-white">Carrosséis Estratégicos</h5>
                    <p className="text-xs text-white/40 mt-0.5">Conteúdos de alta retenção slide a slide</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setAddonCarousels(Math.max(0, addonCarousels - 1))}
                      className="w-8 h-8 rounded-lg bg-white/10 text-white flex items-center justify-center cursor-pointer"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="font-mono text-sm font-bold text-white min-w-[2rem] text-center">
                      {addonCarousels}
                    </span>
                    <button
                      type="button"
                      onClick={() => setAddonCarousels(addonCarousels + 1)}
                      className="w-8 h-8 rounded-lg bg-white/10 text-white flex items-center justify-center cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-[#161616] border border-white/5 flex items-center justify-between">
                  <div>
                    <h5 className="text-sm font-bold text-white">Vídeos Extras Adicionais</h5>
                    <p className="text-xs text-white/40 mt-0.5">Edições complementares além do pacote</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setAddonVideos(Math.max(0, addonVideos - 1))}
                      className="w-8 h-8 rounded-lg bg-white/10 text-white flex items-center justify-center cursor-pointer"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="font-mono text-sm font-bold text-white min-w-[2rem] text-center">
                      {addonVideos}
                    </span>
                    <button
                      type="button"
                      onClick={() => setAddonVideos(addonVideos + 1)}
                      className="w-8 h-8 rounded-lg bg-white/10 text-white flex items-center justify-center cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-[#161616] border border-white/5 flex items-center justify-between">
                  <div>
                    <h5 className="text-sm font-bold text-white">Pacote 5 Fotos Tratadas</h5>
                    <p className="text-xs text-white/40 mt-0.5">Seleção e color grading de alta definição</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setAddonPhotos5(Math.max(0, addonPhotos5 - 1))}
                      className="w-8 h-8 rounded-lg bg-white/10 text-white flex items-center justify-center cursor-pointer"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="font-mono text-sm font-bold text-white min-w-[2rem] text-center">
                      {addonPhotos5}
                    </span>
                    <button
                      type="button"
                      onClick={() => setAddonPhotos5(addonPhotos5 + 1)}
                      className="w-8 h-8 rounded-lg bg-white/10 text-white flex items-center justify-center cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-white/10">
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className="px-5 py-3 rounded-xl bg-white/5 text-white/70 hover:text-white font-medium text-xs sm:text-sm cursor-pointer"
                >
                  Voltar
                </button>
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="px-7 py-3 rounded-xl bg-[#08CC07] text-[#080808] font-bold text-xs sm:text-sm hover:bg-[#0ae309] transition-all cursor-pointer"
                >
                  Avançar para Seus Dados
                </button>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* STEP 4: INFORMAÇÕES DE CONTATO                            */}
          {/* ========================================================= */}
          {currentStep === 4 && (
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-6 mb-8 border-b border-white/10">
                <div>
                  <div className="text-xs font-mono text-[#08CC07] uppercase tracking-wider mb-1">
                    ETAPA 4 DE 5
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white">
                    Como Endson deve te chamar?
                  </h3>
                </div>
                <span className="text-xs text-white/50 font-mono">
                  Contato direto e sem burocracia
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-mono uppercase tracking-wider text-white/80 mb-2">
                    Seu Nome Completo *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={clientName}
                      onChange={(e) => {
                        setClientName(e.target.value);
                        if (formErrors.clientName) setFormErrors({});
                      }}
                      placeholder="Ex: Carlos Silva"
                      className="w-full bg-[#161616] border border-white/10 rounded-xl py-3 pl-10 pr-4 text-xs sm:text-sm text-white focus:outline-none focus:border-[#08CC07]"
                    />
                  </div>
                  {formErrors.clientName && (
                    <span className="text-xs text-red-400 mt-1 block">{formErrors.clientName}</span>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-white/80 mb-2">
                    Empresa ou Projeto
                  </label>
                  <div className="relative">
                    <Building className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="Ex: Agência Criativa"
                      className="w-full bg-[#161616] border border-white/10 rounded-xl py-3 pl-10 pr-4 text-xs sm:text-sm text-white focus:outline-none focus:border-[#08CC07]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-white/80 mb-2">
                    Instagram
                  </label>
                  <div className="relative">
                    <Instagram className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={instagram}
                      onChange={(e) => setInstagram(e.target.value)}
                      placeholder="@seu.perfil"
                      className="w-full bg-[#161616] border border-white/10 rounded-xl py-3 pl-10 pr-4 text-xs sm:text-sm text-white focus:outline-none focus:border-[#08CC07]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-white/80 mb-2">
                    Cidade / Região
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="Ex: Recife - PE"
                      className="w-full bg-[#161616] border border-white/10 rounded-xl py-3 pl-10 pr-4 text-xs sm:text-sm text-white focus:outline-none focus:border-[#08CC07]"
                    />
                  </div>
                </div>

                {shouldAskDate && (
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-white/80 mb-2">
                      Data Prevista do Evento / Gravação
                    </label>
                    <div className="relative">
                      <Calendar className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="date"
                        value={eventDate}
                        onChange={(e) => setEventDate(e.target.value)}
                        className="w-full bg-[#161616] border border-white/10 rounded-xl py-3 pl-10 pr-4 text-xs sm:text-sm text-white focus:outline-none focus:border-[#08CC07]"
                      />
                    </div>
                  </div>
                )}

                <div className="sm:col-span-2">
                  <label className="block text-xs font-mono uppercase tracking-wider text-white/80 mb-2">
                    Alguma observação especial?
                  </label>
                  <textarea
                    rows={2}
                    value={observations}
                    onChange={(e) => setObservations(e.target.value)}
                    placeholder="Descreva detalhes como referências de estilo, prazos curtos ou expectativas..."
                    className="w-full bg-[#161616] border border-white/10 rounded-xl p-3 text-xs text-white"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-white/10">
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className="px-5 py-3 rounded-xl bg-white/5 text-white/70 hover:text-white font-medium text-xs sm:text-sm cursor-pointer"
                >
                  Voltar
                </button>
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="px-7 py-3 rounded-xl bg-[#08CC07] text-[#080808] font-bold text-xs sm:text-sm hover:bg-[#0ae309] transition-all cursor-pointer"
                >
                  Gerar Mensagem do WhatsApp
                </button>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* STEP 5: RESUMO DO BRIEFING & DISPARO PARA O WHATSAPP      */}
          {/* ========================================================= */}
          {currentStep === 5 && (
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-6 mb-8 border-b border-white/10">
                <div>
                  <div className="text-xs font-mono text-[#08CC07] uppercase tracking-wider mb-1">
                    BRIEFING PRONTO
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white">
                    Tudo pronto para enviar no WhatsApp
                  </h3>
                </div>
                <span className="text-xs font-mono px-3 py-1 rounded-full bg-[#08CC07]/10 text-[#08CC07] border border-[#08CC07]/20">
                  Pronto para Disparo
                </span>
              </div>

              <div className="space-y-6 mb-8">
                {/* Direct WhatsApp Consultation Panel (Zero public values) */}
                <div className="p-6 rounded-2xl bg-[#111111] border border-[#08CC07]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="text-xs font-mono text-[#08CC07] uppercase tracking-widest mb-1">
                      ATENDIMENTO DIRETO • H7.VOX
                    </div>
                    <h4 className="text-lg font-bold text-white">
                      Orçamento Personalizado via WhatsApp
                    </h4>
                    <p className="text-xs text-[#858585] mt-1">
                      Seu briefing foi organizado com todas as escolhas do projeto. Envie agora para o WhatsApp e receba o atendimento e a proposta diretamente com Endson Henrique.
                    </p>
                  </div>

                  <div className="sm:text-right shrink-0">
                    <span className="text-[10px] font-mono uppercase text-[#858585] block">
                      Canal Oficial
                    </span>
                    <span className="text-lg sm:text-xl font-black font-mono text-[#08CC07]">
                      Direto no WhatsApp
                    </span>
                  </div>
                </div>

                {/* WhatsApp Message Preview */}
                <div className="p-5 rounded-2xl bg-black/60 border border-white/10">
                  <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10">
                    <div className="flex items-center gap-2 text-xs font-mono text-white/60">
                      <MessageCircle className="w-4 h-4 text-[#08CC07]" />
                      <span>PRÉVIA DA SOLICITAÇÃO PARA O WHATSAPP</span>
                    </div>
                    <span className="text-[10px] text-white/40 font-mono">H7.VOX BRIEFING</span>
                  </div>
                  <pre className="font-mono text-xs text-white/80 whitespace-pre-wrap leading-relaxed max-h-60 overflow-y-auto">
                    {generatedWhatsAppMessage}
                  </pre>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="w-full sm:w-auto px-5 py-3.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white font-medium text-xs sm:text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer order-2 sm:order-1"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Editar Escolhas</span>
                </button>

                <button
                  type="button"
                  onClick={handleSendToWhatsApp}
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#08CC07] text-[#080808] font-black text-sm sm:text-base hover:bg-[#0ae309] transition-all transform active:scale-95 flex items-center justify-center gap-3 shadow-xl shadow-[#08CC07]/30 cursor-pointer order-1 sm:order-2"
                >
                  <MessageCircle className="w-5 h-5 fill-current" />
                  <span>ENVIAR BRIEFING NO WHATSAPP COM ENDSON</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>

              {submissionSuccess && (
                <div className="mt-4 p-3 rounded-xl bg-[#08CC07]/10 border border-[#08CC07]/30 text-xs text-[#08CC07] text-center font-mono">
                  ✓ Mensagem preparada! Redirecionando para o WhatsApp...
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
