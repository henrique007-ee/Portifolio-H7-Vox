import React from 'react';
import { Check, MessageCircle, Sparkles, Video, Image as ImageIcon, Camera, ArrowRight, Sliders } from 'lucide-react';

interface PricingSectionProps {
  whatsappNumber?: string;
}

export const PricingSection: React.FC<PricingSectionProps> = ({ whatsappNumber = '5581985476681' }) => {
  const cleanNumber = whatsappNumber.replace(/\D/g, '') || '5581985476681';

  const makeWhatsAppUrl = (text: string) => {
    return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(text)}`;
  };

  const packages = [
    {
      id: 'pkg-1',
      name: 'Pacote 1',
      headline: '2 Vídeos',
      price: 200,
      description: 'Ideal para lançamentos pontuais, recados estratégicos ou testes de conteúdo.',
      deliverables: [
        '2 vídeos com edição completa',
        'Cortes dinâmicos e trilha sincronizada',
        'Tratamento de cor e equalização de áudio',
        'Formatos verticais ou horizontais sob demanda',
        'Cards avulsos podem ser adicionados conforme necessidade',
      ],
      whatsappMsg: 'Olá, Endson! Tenho interesse no Pacote 1 (2 vídeos - R$ 200), anunciado no site H7.VOX.',
    },
    {
      id: 'pkg-2',
      name: 'Pacote 2',
      headline: '4 Vídeos',
      price: 300,
      description: 'Consistência mensal ou quinzenal para posicionamento e autoridade.',
      deliverables: [
        '4 vídeos com edição completa',
        'Narrativa assertiva com retenção pensada segundo a segundo',
        'Legendas dinâmicas estilizadas',
        'Tratamento de áudio e correção de cor profissional',
        'Adicionais e cards disponíveis na contratação',
      ],
      whatsappMsg: 'Olá, Endson! Tenho interesse no Pacote 2 (4 vídeos - R$ 300), anunciado no site H7.VOX.',
      highlight: true,
    },
    {
      id: 'pkg-3',
      name: 'Pacote 3',
      headline: '6 Vídeos',
      price: 600,
      description: 'Volume estratégico completo para escala de conteúdo e presença forte.',
      deliverables: [
        '6 vídeos com edição completa',
        'Narrativa de alto impacto para Reels/TikTok ou YouTube',
        'Edição ágil com identidade visual alinhada',
        'Entrega rápida e fluxo organizado',
        'Cards e complementos selecionáveis avulsos',
      ],
      whatsappMsg: 'Olá, Endson! Tenho interesse no Pacote 3 (6 vídeos - R$ 600), anunciado no site H7.VOX.',
    },
  ];

  const standaloneServices = [
    {
      id: 'card',
      title: 'Card para Redes Sociais',
      price: 25,
      unit: 'por unidade',
      description: 'Design de post estático alinhado com a identidade e paleta da sua marca.',
      whatsappMsg: 'Olá, Endson! Tenho interesse em Card para Redes Sociais (R$ 25 cada), anunciado no site H7.VOX.',
      icon: ImageIcon,
    },
    {
      id: 'carrossel',
      title: 'Carrossel Estratégico',
      price: 40,
      unit: 'por carrossel',
      description: 'Carrossel slide a slide pensado para reter a atenção, educar e gerar engajamento.',
      whatsappMsg: 'Olá, Endson! Tenho interesse no Carrossel Estratégico (R$ 40 cada), anunciado no site H7.VOX.',
      icon: ImageIcon,
    },
    {
      id: 'video-avulso',
      title: 'Vídeo Avulso',
      price: 100,
      unit: 'por vídeo',
      description: 'Edição completa para conteúdo avulso com cortes, sonorização, cor e legendagem.',
      whatsappMsg: 'Olá, Endson! Tenho interesse em Vídeo Avulso (R$ 100 cada), anunciado no site H7.VOX.',
      icon: Video,
    },
  ];

  const eventServices = [
    {
      id: 'fotos-5',
      title: 'Pacote 5 Fotos',
      price: 20,
      detail: '5 fotos tratadas e entregues em alta resolução para redes.',
      whatsappMsg: 'Olá, Endson! Tenho interesse no pacote de 5 fotos de evento (R$ 20), anunciado no H7.VOX.',
    },
    {
      id: 'fotos-10',
      title: 'Pacote 10 Fotos',
      price: 40,
      detail: '10 fotos tratadas e colorizadas em alta definição.',
      whatsappMsg: 'Olá, Endson! Tenho interesse no pacote de 10 fotos de evento (R$ 40), anunciado no H7.VOX.',
    },
    {
      id: 'video-ind',
      title: 'Vídeo Individual',
      price: 120,
      detail: 'Cobertura focada em um artista, palestrante, cliente ou homenageado.',
      whatsappMsg: 'Olá, Endson! Tenho interesse no Vídeo Individual de evento (R$ 120), anunciado no H7.VOX.',
    },
    {
      id: 'video-col',
      title: 'Vídeo Coletivo',
      price: 150,
      detail: 'Aftermovie e cobertura geral registrando clima, público e destaques.',
      whatsappMsg: 'Olá, Endson! Tenho interesse no Vídeo Coletivo de evento (R$ 150), anunciado no H7.VOX.',
    },
  ];

  return (
    <section id="investimento" className="py-20 sm:py-28 bg-[#090909] text-white border-b border-white/5 relative">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14 sm:mb-18">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#08CC07]/10 border border-[#08CC07]/20 text-[#08CC07] text-xs font-mono uppercase tracking-widest mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>TRANSPARÊNCIA E VALOR</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight font-display mb-3">
            Investimento
          </h2>
          <p className="text-sm sm:text-base text-white/60">
            Escolha o formato ideal para o seu projeto.
          </p>
        </div>

        {/* 1. PACOTES DE CONTEÚDO */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-6 pb-3 border-b border-white/10">
            <Video className="w-5 h-5 text-[#08CC07]" />
            <h3 className="text-lg sm:text-xl font-bold uppercase tracking-wider text-white">
              Pacotes de Conteúdo
            </h3>
            <span className="text-xs font-mono text-white/40 ml-auto hidden sm:inline">
              Edição audiovisual contínua
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {packages.map((pkg) => (
              <div
                key={pkg.id}
                className={`relative rounded-2xl p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 ${
                  pkg.highlight
                    ? 'bg-[#151515] border-2 border-[#08CC07] shadow-[0_0_35px_rgba(8,204,7,0.15)]'
                    : 'bg-[#121212] border border-white/10 hover:border-white/25'
                }`}
              >
                {pkg.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-[#08CC07] text-black text-[11px] font-mono font-bold uppercase tracking-wider px-3 py-0.5 rounded-full shadow-md">
                      Destaque
                    </span>
                  </div>
                )}

                <div>
                  <div className="flex items-baseline justify-between mb-2">
                    <span className="text-xs font-mono text-white/50 uppercase tracking-wider">
                      {pkg.name}
                    </span>
                    <span className="text-xs font-mono text-[#08CC07]">
                      {pkg.headline}
                    </span>
                  </div>

                  <div className="mb-4">
                    <div className="flex items-baseline gap-1">
                      <span className="text-sm font-mono text-white/60">R$</span>
                      <span className="text-4xl sm:text-5xl font-black tracking-tight text-white font-mono">
                        {pkg.price}
                      </span>
                    </div>
                    <p className="text-xs text-white/50 mt-2 leading-relaxed">
                      {pkg.description}
                    </p>
                  </div>

                  <div className="space-y-2.5 pt-4 border-t border-white/10 mb-6">
                    {pkg.deliverables.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-white/80">
                        <Check className="w-4 h-4 text-[#08CC07] shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <a
                  href={makeWhatsAppUrl(pkg.whatsappMsg)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-full py-3.5 px-4 rounded-xl font-bold text-xs sm:text-sm text-center flex items-center justify-center gap-2 transition-all active:scale-95 ${
                    pkg.highlight
                      ? 'bg-[#08CC07] text-black hover:bg-[#0ae309]'
                      : 'bg-white/10 text-white hover:bg-[#08CC07] hover:text-black'
                  }`}
                >
                  <MessageCircle className="w-4 h-4 fill-current" />
                  <span>Contratar {pkg.headline}</span>
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* 2. SERVIÇOS AVULSOS */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-6 pb-3 border-b border-white/10">
            <Sliders className="w-5 h-5 text-[#08CC07]" />
            <h3 className="text-lg sm:text-xl font-bold uppercase tracking-wider text-white">
              Serviços Avulsos
            </h3>
            <span className="text-xs font-mono text-white/40 ml-auto hidden sm:inline">
              Demandas pontuais sem pacote
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {standaloneServices.map((srv) => {
              const Icon = srv.icon;
              return (
                <div
                  key={srv.id}
                  className="rounded-2xl p-6 bg-[#121212] border border-white/10 hover:border-white/20 flex flex-col justify-between transition-colors"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#08CC07]">
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-mono text-white/40">{srv.unit}</span>
                    </div>

                    <h4 className="text-base sm:text-lg font-bold text-white mb-1">
                      {srv.title}
                    </h4>
                    <p className="text-xs text-white/50 mb-4 leading-relaxed">
                      {srv.description}
                    </p>

                    <div className="flex items-baseline gap-1 mb-6">
                      <span className="text-xs font-mono text-white/60">R$</span>
                      <span className="text-3xl font-black font-mono text-white">
                        {srv.price}
                      </span>
                    </div>
                  </div>

                  <a
                    href={makeWhatsAppUrl(srv.whatsappMsg)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 px-4 rounded-xl bg-white/5 hover:bg-[#08CC07] text-white hover:text-black font-semibold text-xs text-center flex items-center justify-center gap-2 transition-all active:scale-95"
                  >
                    <MessageCircle className="w-3.5 h-3.5 fill-current" />
                    <span>Solicitar avulso</span>
                  </a>
                </div>
              );
            })}
          </div>
        </div>

        {/* 3. COBERTURA DE EVENTOS */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-6 pb-3 border-b border-white/10">
            <Camera className="w-5 h-5 text-[#08CC07]" />
            <h3 className="text-lg sm:text-xl font-bold uppercase tracking-wider text-white">
              Cobertura de Eventos
            </h3>
            <span className="text-xs font-mono text-white/40 ml-auto hidden sm:inline">
              Festivais, shows, palestras e conferências
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {eventServices.map((evt) => (
              <div
                key={evt.id}
                className="rounded-2xl p-5 bg-[#121212] border border-white/10 hover:border-white/20 flex flex-col justify-between"
              >
                <div>
                  <div className="text-xs font-mono text-[#08CC07] uppercase tracking-wider mb-1">
                    Evento
                  </div>
                  <h4 className="text-base font-bold text-white mb-1">
                    {evt.title}
                  </h4>
                  <p className="text-xs text-white/50 mb-4 leading-relaxed min-h-[2.5rem]">
                    {evt.detail}
                  </p>

                  <div className="flex items-baseline gap-1 mb-5">
                    <span className="text-xs font-mono text-white/60">R$</span>
                    <span className="text-3xl font-black font-mono text-white">
                      {evt.price}
                    </span>
                  </div>
                </div>

                <a
                  href={makeWhatsAppUrl(evt.whatsappMsg)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-3 rounded-xl bg-white/5 hover:bg-[#08CC07] text-white hover:text-black font-semibold text-xs text-center flex items-center justify-center gap-2 transition-all active:scale-95"
                >
                  <MessageCircle className="w-3.5 h-3.5 fill-current" />
                  <span>Contratar</span>
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 10: CTA DE CONTRATAÇÃO NA ÁREA DE VALORES */}
        <div className="rounded-2xl p-7 sm:p-10 bg-gradient-to-r from-[#141414] via-[#1a1a1a] to-[#141414] border border-white/10 text-center max-w-4xl mx-auto shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#08CC07]/5 rounded-full blur-3xl pointer-events-none" />

          <h3 className="text-xl sm:text-3xl font-black text-white font-display mb-2">
            Não encontrou o formato ideal?
          </h3>
          <p className="text-sm sm:text-base text-white/70 max-w-xl mx-auto mb-6">
            Me conte sua ideia e vamos conversar sobre a melhor solução para o seu projeto.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href={makeWhatsAppUrl('Olá, Endson! Conheci o site H7.VOX e gostaria de solicitar um orçamento personalizado.')}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-[#08CC07] text-black font-bold text-sm hover:bg-[#0ae309] transition-all duration-200 active:scale-95"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>Solicitar orçamento personalizado</span>
            </a>

            <a
              href="#simulador"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white/5 hover:bg-white/10 text-white border border-white/10 text-sm font-medium transition-colors"
            >
              <Sliders className="w-4 h-4 text-[#08CC07]" />
              <span>Abrir simulador interativo</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
