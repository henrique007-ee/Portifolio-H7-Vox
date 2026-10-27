import React from 'react';
import { MessageCircle, ArrowRight } from 'lucide-react';
import { SectionAmbient3DBackground } from './VisualEffects';

interface MidCalloutProps {
  whatsappNumber?: string;
}

export const MidCallout: React.FC<MidCalloutProps> = ({ whatsappNumber = '5581985476681' }) => {
  const cleanNumber = whatsappNumber.replace(/\D/g, '') || '5581985476681';
  const whatsappUrl = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(
    'Olá, Endson! Conheci seu portfólio H7.VOX e gostaria de conversar sobre um projeto.'
  )}`;

  return (
    <section className="relative py-16 sm:py-20 bg-[#050505] border-y border-white/10 overflow-hidden">
      {/* Floating 3D Sculptures, Soundwave & Green Ambient Glow in Background */}
      <SectionAmbient3DBackground
        leftSculpture="orbitalRing"
        rightSculpture="wireframeSphere"
        showSoundWave={true}
        smokeIntensity="subtle"
      />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-48 bg-[#08CC07]/10 rounded-full blur-[90px] pointer-events-none z-0" />

      <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#08CC07]/10 border border-[#08CC07]/20 text-[#08CC07] text-xs font-mono uppercase tracking-widest mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-[#08CC07] animate-pulse" />
          <span>VAMOS CONECTAR</span>
        </div>

        <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight font-display uppercase mb-4 leading-tight">
          SEU PRÓXIMO PROJETO PODE COMEÇAR AQUI.
        </h2>

        <p className="text-sm sm:text-base md:text-lg text-[#B3B3B3] max-w-2xl mx-auto mb-8 font-light leading-relaxed">
          Você já viu o que eu faço. Agora, vamos conversar sobre o que podemos criar juntos.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl bg-[#08CC07] text-[#050505] font-bold text-sm sm:text-base hover:bg-[#0ae309] hover:shadow-[0_0_25px_rgba(8,204,7,0.3)] transition-all duration-300 active:scale-95"
          >
            <MessageCircle className="w-5 h-5 fill-current" />
            <span>Quero conversar</span>
            <ArrowRight className="w-4 h-4" />
          </a>

          <a
            href="#orcamento"
            className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-4 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 hover:text-white border border-white/10 text-sm font-medium transition-colors"
          >
            <span>Montar briefing</span>
          </a>
        </div>
      </div>
    </section>
  );
};
