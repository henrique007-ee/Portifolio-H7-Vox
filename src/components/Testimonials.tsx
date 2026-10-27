import React, { useState } from 'react';
import { Quote, Star } from 'lucide-react';
import { SectionAmbient3DBackground } from './VisualEffects';
import type { Testimonial } from '../types';

interface TestimonialsProps {
  testimonials: Testimonial[];
  showTestimonials?: boolean;
}

export const Testimonials: React.FC<TestimonialsProps> = ({
  testimonials,
  showTestimonials = true,
}) => {
  const [hoveredKey, setHoveredKey] = useState<string | null>(null);

  if (!showTestimonials || !testimonials || testimonials.length === 0) return null;

  const published = testimonials.filter((t) => t.published);
  if (published.length === 0) return null;

  const loopList = [...published, ...published, ...published, ...published];

  return (
    <section
      id="depoimentos"
      className="py-20 sm:py-28 bg-[#050505] text-[#FFFFFF] border-b border-white/10 relative overflow-hidden"
    >
      {/* Floating 3D Sculptures, Soundwave & Digital Smoke in Background */}
      <SectionAmbient3DBackground
        leftSculpture="wireframeSphere"
        rightSculpture="orbitalRing"
        showSoundWave={true}
        smokeIntensity="subtle"
      />

      <div className="max-w-7xl mx-auto px-5 sm:px-8 mb-12 text-center relative z-10">
        <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#08CC07] mb-3">
          <Quote className="w-3.5 h-3.5" />
          <span>DEPOIMENTOS & RESULTADOS</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-black text-[#FFFFFF] tracking-tight font-display mb-3 text-balance">
          Quem já trabalhou comigo.
        </h2>
        <p className="text-sm sm:text-base text-[#858585] max-w-2xl mx-auto">
          A percepção real de clientes, diretores e marcas que confiaram na H7.VOX para contar suas histórias.
        </p>
      </div>

      {/* Infinite Marquee Track with gradient fade edges */}
      <div className="relative w-full overflow-hidden py-4 z-10">
        <div className="marquee-fade-left absolute left-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-r from-[#050505] to-transparent z-10 pointer-events-none" />
        <div className="marquee-fade-right absolute right-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-l from-[#050505] to-transparent z-10 pointer-events-none" />

        <div className="animate-marquee-infinite flex items-stretch gap-6 sm:gap-8 select-none">
          {loopList.map((item, idx) => {
            const cardKey = `${item.id}-${idx}`;
            const isDimmed = hoveredKey !== null && hoveredKey !== cardKey;

            return (
              <div
                key={cardKey}
                onMouseEnter={() => setHoveredKey(cardKey)}
                onMouseLeave={() => setHoveredKey(null)}
                className={`shrink-0 w-[300px] sm:w-[390px] p-6 sm:p-7 rounded-2xl bg-[#0A0A0A] border transition-all duration-300 flex flex-col justify-between group ${
                  hoveredKey === cardKey
                    ? 'border-[#08CC07]/50 bg-[#0F0F0F] shadow-[0_0_28px_rgba(8,204,7,0.14)] opacity-100 scale-[1.01]'
                    : isDimmed
                    ? 'border-white/10 opacity-65'
                    : 'border-white/10 opacity-95'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <Quote className="w-5 h-5 text-[#08CC07]" />
                    <div className="flex items-center gap-1 text-[#08CC07]">
                      {Array.from({ length: item.rating || 5 }).map((_, starIdx) => (
                        <Star key={starIdx} className="w-3.5 h-3.5 fill-current" />
                      ))}
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-white/90 leading-relaxed mb-6 line-clamp-4">
                    &ldquo;{item.text}&rdquo;
                  </p>
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center gap-3">
                  {item.avatar ? (
                    <img
                      src={item.avatar}
                      alt={item.name}
                      referrerPolicy="no-referrer"
                      className="w-10 h-10 rounded-full object-cover border border-[#08CC07]/40 shrink-0"
                      loading="lazy"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-[#08CC07]/10 border border-[#08CC07]/30 text-[#08CC07] font-bold text-xs flex items-center justify-center font-mono shrink-0">
                      {item.name.substring(0, 2).toUpperCase()}
                    </div>
                  )}
                  <div className="overflow-hidden">
                    <h4 className="text-xs sm:text-sm font-bold text-white font-display truncate">
                      {item.name}
                    </h4>
                    <div className="text-[11px] text-[#858585] font-mono mt-0.5 truncate">
                      {item.role || 'Cliente'} {item.company ? `· ${item.company}` : ''}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
