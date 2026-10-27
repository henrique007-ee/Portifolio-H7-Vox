import React, { useState } from 'react';
import { Plus, Minus, HelpCircle, MessageCircle } from 'lucide-react';
import { SectionAmbient3DBackground } from './VisualEffects';

interface FAQItem {
  id: number;
  question: string;
  answer: string;
}

const FAQ_ITEMS: FAQItem[] = [
  {
    id: 1,
    question: 'COMO FUNCIONA O SEU PROCESSO DE CRIAÇÃO?',
    answer:
      'Primeiro, entendo sua ideia, seus objetivos e o tipo de conteúdo que você precisa. A partir disso, alinhamos a proposta e os detalhes do projeto para desenvolver um resultado de acordo com sua necessidade.',
  },
  {
    id: 2,
    question: 'VOCÊ TRABALHA COM QUAIS TIPOS DE PROJETO?',
    answer:
      'Trabalho com edição de vídeos, produção audiovisual, filmmaker, storymaker, cobertura de eventos, conteúdo para redes sociais, comunicação política e identidades visuais.',
  },
  {
    id: 3,
    question: 'VOCÊ FAZ COBERTURA DE EVENTOS?',
    answer:
      'Sim. Trabalho com produção de conteúdo audiovisual para eventos, incluindo captação e conteúdo para redes sociais, conforme o serviço contratado.',
  },
  {
    id: 4,
    question: 'VOCÊ PRODUZ STORIES EM TEMPO REAL?',
    answer:
      'Sim. Trabalho com storymaker e produção de conteúdo em tempo real para registrar os principais momentos e compartilhar a experiência durante o evento, conforme o formato combinado.',
  },
  {
    id: 5,
    question: 'COMO POSSO CONTRATAR SEUS SERVIÇOS?',
    answer:
      'Você pode entrar em contato pelo WhatsApp ou Instagram. Me conte o que precisa e vamos conversar sobre o formato ideal para o seu projeto.',
  },
  {
    id: 6,
    question: 'COMO FUNCIONA O ORÇAMENTO DOS PROJETOS?',
    answer:
      'Cada projeto é avaliado de acordo com os formatos, entregas e objetivos escolhidos. Você pode montar seu briefing aqui no site e enviar diretamente para o WhatsApp para receber sua proposta personalizada.',
  },
  {
    id: 7,
    question: 'COMO ENVIO MEU MATERIAL PARA EDIÇÃO?',
    answer:
      'Podemos alinhar a melhor forma de envio conforme o volume e o tipo dos arquivos. Entre em contato para combinarmos os detalhes.',
  },
  {
    id: 8,
    question: 'VOCÊ TRABALHA COM IDENTIDADE VISUAL?',
    answer:
      'Sim. Também desenvolvo identidades visuais e posso apresentar projetos anteriores na seção específica do portfólio.',
  },
];

interface FAQSectionProps {
  whatsappNumber?: string;
}

export const FAQSection: React.FC<FAQSectionProps> = ({ whatsappNumber = '5581985476681' }) => {
  const [openId, setOpenId] = useState<number | null>(1);

  const toggleItem = (id: number) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  const cleanNumber = whatsappNumber.replace(/\D/g, '') || '5581985476681';
  const whatsappUrl = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(
    'Olá, Endson! Estava lendo o FAQ no site H7.VOX e gostaria de tirar uma dúvida sobre um projeto.'
  )}`;

  return (
    <section id="faq" className="py-20 sm:py-28 bg-[#050505] text-white border-b border-white/10 relative overflow-hidden">
      <SectionAmbient3DBackground
        leftSculpture="octahedron"
        rightSculpture="prism"
        showSoundWave={false}
        smokeIntensity="subtle"
      />
      <div className="max-w-4xl mx-auto px-6 sm:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#08CC07]/10 border border-[#08CC07]/20 text-[#08CC07] text-xs font-mono uppercase tracking-widest mb-3">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>DÚVIDAS COMUNS</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight font-display mb-3">
            Perguntas Frequentes
          </h2>
          <p className="text-sm sm:text-base text-[#B3B3B3] max-w-lg mx-auto">
            Tudo o que você precisa saber sobre prazos, formatos, envio de arquivos e contratação.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-3">
          {FAQ_ITEMS.map((item) => {
            const isOpen = openId === item.id;
            return (
              <div
                key={item.id}
                className={`rounded-2xl transition-all duration-300 border ${
                  isOpen
                    ? 'bg-[#0F0F0F] border-[#08CC07]/40 shadow-[0_0_20px_rgba(8,204,7,0.06)]'
                    : 'bg-[#0A0A0A] border-white/10 hover:border-white/20'
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleItem(item.id)}
                  aria-expanded={isOpen}
                  className="w-full text-left px-5 sm:px-6 py-4 sm:py-5 flex items-center justify-between gap-4 cursor-pointer focus:outline-none"
                >
                  <span className={`text-sm sm:text-base font-bold tracking-wide transition-colors ${
                    isOpen ? 'text-[#08CC07]' : 'text-white/90'
                  }`}>
                    {item.question}
                  </span>
                  <div
                    className={`w-8 h-8 rounded-full border flex items-center justify-center shrink-0 transition-all ${
                      isOpen
                        ? 'bg-[#08CC07] border-[#08CC07] text-black rotate-180'
                        : 'bg-white/5 border-white/10 text-white/60 hover:text-white'
                    }`}
                  >
                    {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 sm:px-6 pb-5 pt-1 text-sm sm:text-base text-[#B3B3B3] leading-relaxed border-t border-white/10">
                    {item.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom micro CTA */}
        <div className="mt-12 text-center p-6 rounded-2xl bg-[#0A0A0A] border border-white/10">
          <p className="text-xs sm:text-sm text-white/50 mb-3">
            Ainda tem alguma dúvida sobre seu projeto ou formato?
          </p>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#08CC07] hover:underline"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Falar diretamente no WhatsApp</span>
          </a>
        </div>
      </div>
    </section>
  );
};
