import React from 'react';
import { SectionAmbient3DBackground } from './VisualEffects';
import type { Brand } from '../types';

interface BrandsProps {
  brands: Brand[];
  showBrands?: boolean;
}

export const Brands: React.FC<BrandsProps> = ({ brands, showBrands = true }) => {
  if (!showBrands || !brands || brands.length === 0) return null;

  const activeBrands = brands
    .filter((b) => b.active && !b.inTrash)
    .sort((a, b) => a.order - b.order);
  if (activeBrands.length === 0) return null;

  const loopList = [...activeBrands, ...activeBrands, ...activeBrands, ...activeBrands];

  return (
    <section
      id="marcas"
      className="py-20 sm:py-26 bg-[#050505] border-b border-white/10 relative overflow-hidden"
    >
      {/* Floating 3D Orbital Ring, 3D Prism, Soundwave & Digital Smoke in Background */}
      <SectionAmbient3DBackground
        leftSculpture="orbitalRing"
        rightSculpture="prism"
        showSoundWave={true}
        smokeIntensity="subtle"
      />

      <div className="max-w-7xl mx-auto px-5 sm:px-8 mb-12 text-center relative z-10">
        <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#08CC07] mb-3">
          <span>PARCERIAS & PROJETOS</span>
        </div>
        <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-[#FFFFFF] tracking-tight font-display mb-3 text-balance">
          Marcas, projetos e identidades que ganham vida.
        </h2>
        <p className="text-xs sm:text-sm lg:text-base text-[#858585] max-w-xl mx-auto leading-relaxed">
          Do audiovisual ao design, transformo ideias em experiências visuais que conectam pessoas e marcas.
        </p>
      </div>

      {/* Infinite Marquee Track with gradient fade edges */}
      <div className="relative w-full overflow-hidden py-4 z-10">
        <div className="marquee-fade-left absolute left-0 top-0 bottom-0 w-16 sm:w-36 bg-gradient-to-r from-[#050505] to-transparent z-10 pointer-events-none" />
        <div className="marquee-fade-right absolute right-0 top-0 bottom-0 w-16 sm:w-36 bg-gradient-to-l from-[#050505] to-transparent z-10 pointer-events-none" />

        <div className="animate-marquee-infinite flex items-center gap-5 sm:gap-7 select-none">
          {loopList.map((brand, idx) => {
            const logo = brand.logo || brand.logoUrl;
            return (
              <div
                key={`${brand.id}-${idx}`}
                className="group relative shrink-0 h-24 sm:h-28 min-w-[190px] sm:min-w-[240px] px-6 sm:px-8 py-4 rounded-2xl bg-[#0A0A0A] border border-white/10 hover:border-[#08CC07]/45 hover:bg-[#0F0F0F] transition-all duration-300 flex items-center justify-center cursor-default shadow-sm hover:shadow-[0_0_24px_rgba(8,204,7,0.12)]"
              >
                {logo ? (
                  <img
                    src={logo}
                    alt={brand.name}
                    referrerPolicy="no-referrer"
                    className="max-h-12 sm:max-h-15 w-auto max-w-[145px] sm:max-w-[185px] object-contain transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                ) : (
                  <div className="text-center">
                    <span className="text-xs sm:text-sm font-bold text-white/90 group-hover:text-white font-display uppercase tracking-wider block transition-colors">
                      {brand.name}
                    </span>
                    {brand.description && (
                      <span className="text-[10px] text-[#858585] font-mono block mt-0.5">
                        {brand.description}
                      </span>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
