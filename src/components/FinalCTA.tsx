import React from 'react';
import { MessageCircle, Instagram, ArrowRight } from 'lucide-react';
import { SectionAmbient3DBackground } from './VisualEffects';

interface FinalCTAProps {
  whatsappNumber?: string;
  instagramUrl?: string;
}

export const FinalCTA: React.FC<FinalCTAProps> = ({
  whatsappNumber = '5581985476681',
  instagramUrl = 'https://www.instagram.com/h7.vox/',
}) => {
  const cleanNumber = whatsappNumber.replace(/\D/g, '') || '5581985476681';
  const whatsappUrl = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(
    'Olá, Endson! Conheci seu portfólio H7.VOX e gostaria de conversar sobre um projeto.'
  )}`;

  return (
    <section className="relative py-24 sm:py-32 bg-[#050505] text-white border-b border-white/10 overflow-hidden">
      {/* Floating 3D Sculptures, Soundwave & Ambient Glow in Background */}
      <SectionAmbient3DBackground
        leftSculpture="letterH"
        rightSculpture="number7"
        showSoundWave={true}
        smokeIntensity="medium"
      />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-[#08CC07]/15 rounded-full blur-[120px] pointer-events-none z-0" />

      <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#08CC07]/10 border border-[#08CC07]/20 text-[#08CC07] text-xs font-mono uppercase tracking-widest mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-[#08CC07] animate-ping" />
          <span>INICIE SEU PROJETO</span>
        </div>

        <h2 className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight font-display uppercase mb-6 leading-tight">
          VAMOS DAR VOZ À SUA IDEIA?
        </h2>

        <p className="text-base sm:text-lg md:text-xl text-[#B3B3B3] max-w-2xl mx-auto mb-10 font-light leading-relaxed">
          Se você precisa de vídeos que conectam, conteúdo que marca ou uma identidade visual para seu projeto, vamos conversar.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl bg-[#08CC07] text-black font-bold text-sm sm:text-base hover:bg-[#0ae309] hover:shadow-[0_0_30px_rgba(8,204,7,0.35)] transition-all duration-300 active:scale-95"
          >
            <MessageCircle className="w-5 h-5 fill-current" />
            <span>Falar com Endson</span>
            <ArrowRight className="w-4 h-4" />
          </a>

          <a
            href={instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-xl bg-white/5 hover:bg-white/10 text-white border border-white/10 font-semibold text-sm sm:text-base transition-all duration-200"
          >
            <Instagram className="w-5 h-5 text-[#08CC07]" />
            <span>Ver Instagram</span>
          </a>
        </div>
      </div>
    </section>
  );
};
