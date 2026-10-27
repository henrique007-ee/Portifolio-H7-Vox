import React from 'react';
import { MessageCircle, ArrowRight } from 'lucide-react';
import { buildWhatsAppLink } from '../services/api';
import { LogoOrbit3D } from './LogoOrbit3D';
import { SectionAmbient3DBackground } from './VisualEffects';
import { Section3DShowcase } from './Section3DShowcase';
import type { SiteSettings } from '../types';

interface AboutMeProps {
  settings: SiteSettings;
}

export const AboutMe: React.FC<AboutMeProps> = ({ settings }) => {
  const whatsappUrl = buildWhatsAppLink(
    settings.whatsappNumber,
    'Olá, Endson! Conheci seu trabalho e trajetória no site H7.VOX e gostaria de conversar sobre um projeto audiovisual.'
  );

  const pillars = [
    {
      title: 'Narrativa & Ritmo',
      desc: 'Edições pensadas para reter a atenção nos primeiros segundos e conduzir a história até o final.',
    },
    {
      title: 'Equipamento & Estética',
      desc: 'Captação em 4K, lentes cinematográficas e iluminação voltada para valorizar a cena.',
    },
    {
      title: 'Estratégia & Propósito',
      desc: 'Vídeos que comunicam com clareza a mensagem de marcas, eventos e líderes de opinião.',
    },
  ];

  return (
    <section
      id="sobre"
      className="py-24 sm:py-32 bg-[#050505] border-b border-white/10 relative overflow-hidden"
    >
      {/* Floating 3D Background Objects (Letter H, Number 7, Drone & Cinema Camera in Deep Space) */}
      <SectionAmbient3DBackground
        leftSculpture="letterH"
        rightSculpture="number7"
        showSoundWave={true}
        smokeIntensity="subtle"
      />
      <Section3DShowcase preset="backstage" className="opacity-35 sm:opacity-55" />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Portrait and Visual Showcase */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden bg-[#0A0A0A] border border-white/10 aspect-[4/5] shadow-2xl">
              {settings.aboutPhoto ? (
                <img
                  src={settings.aboutPhoto}
                  alt={settings.ownerName}
                  className="w-full h-full object-cover filter brightness-95"
                />
              ) : (
                <div className="about-logo-surface w-full h-full flex flex-col items-center justify-center p-8 text-center bg-[#0A0A0A] relative">
                  <div className="mb-5">
                    <LogoOrbit3D size="lg">
                      <div className="h7-logo-badge w-32 h-32 flex items-center justify-center p-2">
                        <img
                          src="/assets/logo_web.png"
                          alt="H7.VOX"
                          className="h7-logo-img w-full h-full object-contain filter drop-shadow-[0_0_16px_rgba(8,204,7,0.28)]"
                        />
                      </div>
                    </LogoOrbit3D>
                  </div>

                  <span className="text-xs font-mono tracking-widest text-[#08CC07] uppercase mb-2">
                    H7.VOX AUDIOVISUAL
                  </span>
                  <h3 className="text-2xl font-black text-white font-display mb-1">
                    {settings.ownerName}
                  </h3>
                  <p className="text-xs text-white/50 font-mono mb-4">
                    {settings.roleSubtitle || 'EDITOR DE VÍDEO • FILMMAKER • STORYMAKER'}
                  </p>
                  <p className="text-xs text-white/40 max-w-xs leading-relaxed">
                    Pernambuco, Brasil · Produções em todo o território nacional
                  </p>
                </div>
              )}

              {/* Bottom tag strip */}
              <div
                className={`${
                  settings.aboutPhoto
                    ? 'media-overlay-preserve bg-black/80'
                    : 'bg-[#161616]/90'
                } absolute bottom-4 left-4 right-4 backdrop-blur-md px-4 py-2.5 rounded-xl border border-white/10 flex items-center justify-between text-xs font-mono`}
              >
                <span className="text-white/80">ENDSON HENRIQUE</span>
                <span className="text-[#08CC07]">H7.VOX</span>
              </div>
            </div>
          </div>

          {/* Right Column: Narrative & Philosophy */}
          <div className="lg:col-span-7 space-y-8">
            <div>
              <div className="text-xs font-mono tracking-widest text-[#08CC07] uppercase mb-3">
                SOBRE MIM
              </div>
              <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight font-display mb-6 leading-tight">
                {settings.aboutTitle}
              </h2>
              <div className="space-y-4 text-sm sm:text-base text-white/70 leading-relaxed whitespace-pre-line">
                {settings.aboutBio}
              </div>
            </div>

            {/* Philosophy quote */}
            <div className="p-6 rounded-2xl bg-[#121212] border-l-2 border-[#08CC07] border-y border-r border-white/5">
              <p className="text-sm sm:text-base font-medium text-white/90 italic leading-relaxed">
                "{settings.aboutPhilosophy}"
              </p>
            </div>

            {/* 3 Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              {pillars.map((pillar, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-white/5 border border-white/5">
                  <h4 className="text-xs font-bold text-white mb-1.5 font-display flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#08CC07]" />
                    {pillar.title}
                  </h4>
                  <p className="text-xs text-white/50 leading-relaxed">{pillar.desc}</p>
                </div>
              ))}
            </div>

            {/* Direct Contact Button */}
            <div className="pt-4 flex flex-col sm:flex-row items-center gap-4">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-[#08CC07] text-[#050505] font-bold text-sm hover:bg-[#0ae309] transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#08CC07]/20"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>Conversar com Endson</span>
              </a>

              <a
                href="#portfolio"
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-white/5 text-white font-semibold text-sm hover:bg-white/10 transition-colors flex items-center justify-center gap-2 border border-white/10"
              >
                <span>Ver produções</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
