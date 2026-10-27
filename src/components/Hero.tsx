import React, { useState } from 'react';
import { ArrowDown, MessageCircle, Film } from 'lucide-react';
import { buildWhatsAppLink } from '../services/api';
import { EquipmentCanvas } from './EquipmentCanvas';
import { DigitalSmokeLayer, GreenSoundWave3D } from './VisualEffects';
import type { SiteSettings } from '../types';

interface HeroProps {
  settings: SiteSettings;
}

export const Hero: React.FC<HeroProps> = ({ settings }) => {
  const [isMuted] = useState(true);

  const whatsappUrl = buildWhatsAppLink(
    settings.whatsappNumber,
    settings.defaultWhatsappMessage ||
      'Olá, Endson! Conheci seu portfólio H7.VOX e gostaria de conversar sobre um projeto audiovisual.'
  );

  const line1Words = ['IMAGENS', 'QUE', 'MARCAM.'];
  const line2Words = ['HISTÓRIAS', 'QUE', 'CONECTAM.'];

  return (
    <section
      id="inicio"
      className="relative min-h-[100svh] h-auto flex flex-col items-center justify-center overflow-hidden bg-[#050505] text-[#FFFFFF] pt-32 pb-20 sm:pt-36 sm:pb-28 lg:py-32"
    >
      {/* 1. Deep Cinematic Black & Subtle Neon Atmosphere Layer */}
      <div className="hero-bg-layer absolute inset-0 z-0 bg-gradient-to-b from-[#050505] via-[#080808] to-[#050505]" />

      {/* Subtle video background overlay */}
      {settings.heroVideoUrl && (
        <div className="absolute inset-0 z-0 overflow-hidden opacity-15 sm:opacity-20 pointer-events-none mix-blend-luminosity">
          <video
            autoPlay
            loop
            muted={isMuted}
            playsInline
            className="w-full h-full object-cover scale-105 filter brightness-50 contrast-125"
            src={settings.heroVideoUrl}
          />
        </div>
      )}

      {/* Subtle Radial Vignette (Below 3D elements so it never washes them out in Light or Dark mode) */}
      <div className="hero-vignette-layer absolute inset-0 z-0 bg-radial from-transparent via-[#050505]/45 to-[#050505]/85 pointer-events-none" />

      {/* Digital Smoke Atmosphere (Subtle fog illuminated by #08CC07 green tones) */}
      <DigitalSmokeLayer intensity="medium" />

      {/* Controlled green ambient glow behind equipment & focal anchor */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[560px] h-[560px] rounded-full bg-[#08CC07]/[0.07] blur-[130px] pointer-events-none z-0"
        aria-hidden="true"
      />

      <div
        className="ambient-3d-soundwave pointer-events-none absolute left-1/2 -translate-x-1/2 bottom-10 w-full max-w-4xl px-6 z-0 opacity-65 sm:opacity-85"
        aria-hidden="true"
      >
        <GreenSoundWave3D compact barCount={52} />
      </div>

      {/* 2. 3D Floating Equipment & Geometry Background Layer (LED Tube, Cinema Camera, Drone, iPhone 15 Pro Max, Wireframe Sphere, 3D '7', 3D Prism) */}
      <EquipmentCanvas className="section-3d-canvas-host z-0 opacity-80 sm:opacity-95 lg:opacity-100" />

      {/* 3. Central Content Container (Preserving exact mobile spacing & hierarchy, zero HUD clutter) */}
      <div className="relative z-20 w-full max-w-4xl mx-auto px-5 sm:px-6 lg:px-8 text-center flex flex-col items-center">
        {/* Item 2: Identificação profissional: ENDSON HENRIQUE */}
        <div className="mb-3.5 sm:mb-4 inline-flex items-center gap-2.5 px-3.5 py-1 rounded-md bg-[#0A0A0A]/85 border border-[#08CC07]/30 shadow-[0_0_20px_rgba(8,204,7,0.1)]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#08CC07]" />
          <span className="text-xs sm:text-sm font-bold tracking-[0.22em] text-[#08CC07] uppercase font-mono">
            {settings.ownerName || 'ENDSON HENRIQUE'}
          </span>
        </div>

        {/* Item 3: Especialidades profissionais */}
        <p className="mb-7 sm:mb-8 text-xs sm:text-sm font-semibold tracking-[0.12em] text-[#858585] uppercase leading-[1.75] max-w-[310px] sm:max-w-xl mx-auto font-mono">
          {settings.roleSubtitle || 'EDITOR DE VÍDEO • FILMMAKER • STORYMAKER • IDENTIDADE VISUAL'}
        </p>

        {/* Item 4: Título principal com animação progressiva de entrada por palavra */}
        <h1 className="text-[clamp(2.05rem,7.2vw,4.5rem)] font-extrabold tracking-tight text-[#FFFFFF] mb-5 sm:mb-6 leading-[1.14] text-balance max-w-[18ch] sm:max-w-3xl mx-auto font-display">
          <span className="inline">
            {line1Words.map((word, idx) => (
              <React.Fragment key={word}>
                <span
                  className="animate-word-reveal"
                  style={{ animationDelay: `${idx * 90}ms` }}
                >
                  {word}
                </span>{' '}
              </React.Fragment>
            ))}
          </span>
          <br className="hidden sm:inline" />
          <span className="inline">
            {line2Words.map((word, idx) => (
              <React.Fragment key={word}>
                <span
                  className={`animate-word-reveal ${
                    word === 'CONECTAM.'
                      ? 'text-[#08CC07] drop-shadow-[0_0_24px_rgba(8,204,7,0.28)]'
                      : ''
                  }`}
                  style={{ animationDelay: `${(idx + line1Words.length) * 90}ms` }}
                >
                  {word}
                </span>
                {idx < line2Words.length - 1 ? ' ' : ''}
              </React.Fragment>
            ))}
          </span>
        </h1>

        {/* Item 5: Texto de apresentação */}
        <p className="text-sm sm:text-base lg:text-lg text-[#B3B3B3] max-w-[34ch] sm:max-w-xl mx-auto mb-7 sm:mb-9 leading-[1.65] font-normal">
          {settings.heroLead ||
            'Transformo ideias, momentos e marcas em experiências visuais que merecem ser vistas.'}
        </p>

        {/* Items 6 & 7: Botões principais */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4 w-full max-w-[360px] sm:max-w-none mx-auto">
          {/* Item 6: Botão para explorar o portfólio */}
          <a
            href="#portfolio"
            className="hero-explore-btn w-full sm:w-auto px-6 sm:px-8 py-4 rounded-xl bg-[#FFFFFF] text-[#050505] border border-white font-bold text-sm sm:text-base hover:bg-white/90 transition-all transform active:scale-95 flex items-center justify-center gap-2.5 shadow-xl shadow-black/40 cursor-pointer whitespace-nowrap"
          >
            <Film className="w-4 h-4 text-[#08CC07] shrink-0" />
            <span>Explorar portfólio</span>
          </a>

          {/* Item 7: Botão para conversar pelo WhatsApp */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-6 sm:px-8 py-4 rounded-xl bg-[#08CC07] text-[#050505] border border-[#08CC07] font-bold text-sm sm:text-base hover:bg-[#0ae309] transition-all transform active:scale-95 flex items-center justify-center gap-2.5 shadow-lg shadow-[#08CC07]/25 cursor-pointer whitespace-nowrap"
          >
            <MessageCircle className="w-4 h-4 fill-current shrink-0" />
            <span>Conversar no WhatsApp</span>
          </a>
        </div>

        {/* Item 8: Indicador de rolagem */}
        <a
          href="#portfolio"
          aria-label="Rolar para ver portfólio"
          className="inline-flex items-center gap-2 text-xs font-mono text-white/60 hover:text-[#08CC07] transition-colors group mt-9 sm:mt-10 py-1"
        >
          <span className="tracking-widest uppercase text-[11px]">Explorar experiência</span>
          <ArrowDown className="w-3.5 h-3.5 group-hover:translate-y-1 transition-transform text-[#08CC07]" />
        </a>
      </div>
    </section>
  );
};
