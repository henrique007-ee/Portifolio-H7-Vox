import React, { useState } from 'react';
import { Eye, X, Camera } from 'lucide-react';
import { Section3DShowcase } from './Section3DShowcase';
import { SectionAmbient3DBackground } from './VisualEffects';
import type { BackstageItem } from '../types';

interface BackstageProps {
  items: BackstageItem[];
}

export const Backstage: React.FC<BackstageProps> = ({ items }) => {
  const [activeItem, setActiveItem] = useState<BackstageItem | null>(null);

  if (!items || items.length === 0) return null;

  const visibleItems = items.filter((item) => item.published !== false && !item.inTrash);
  if (visibleItems.length === 0) return null;

  return (
    <section
      id="bastidores"
      className="py-20 sm:py-28 bg-[#050505] border-b border-white/10 relative overflow-hidden"
    >
      {/* Floating 3D Cinematic Drone & Cinema Camera Rig in Background */}
      <SectionAmbient3DBackground
        leftSculpture="orbitalRing"
        rightSculpture="wireframeSphere"
        showSoundWave={false}
        smokeIntensity="subtle"
      />
      <Section3DShowcase preset="backstage" />

      <div className="max-w-7xl mx-auto px-5 sm:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-14 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-mono tracking-widest text-[#08CC07] uppercase mb-2.5">
              <Camera className="w-3.5 h-3.5" />
              <span>PROCESSO & GRAVAÇÕES</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-[#FFFFFF] tracking-tight font-display">
              Bastidores em Set.
            </h2>
          </div>
          <p className="text-sm sm:text-base text-[#858585] max-w-md">
            Registros de sets, rotina de captação aérea e terrestre, coberturas dinâmicas e o rigor técnico em cada etapa da produção audiovisual.
          </p>
        </div>

        {/* Dynamic Visual Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-6">
          {visibleItems.map((item, idx) => {
            const colSpan =
              visibleItems.length >= 4
                ? idx === 0 || idx === 3
                  ? 'lg:col-span-7'
                  : 'lg:col-span-5'
                : 'lg:col-span-4';

            return (
              <div
                key={item.id}
                onClick={() => setActiveItem(item)}
                className={`${colSpan} futuristic-card group cursor-pointer relative overflow-hidden rounded-2xl bg-[#0A0A0A] border border-white/10 hover:border-[#08CC07]/55 flex flex-col justify-between`}
              >
                {/* Media Container */}
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-black media-overlay-preserve">
                  {item.mediaType === 'video' ? (
                    <video
                      src={item.mediaUrl}
                      muted
                      loop
                      playsInline
                      onMouseEnter={(e) => e.currentTarget.play().catch(() => {})}
                      onMouseLeave={(e) => e.currentTarget.pause()}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 filter brightness-90 group-hover:brightness-100"
                    />
                  ) : (
                    <img
                      src={item.mediaUrl}
                      alt={item.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 filter brightness-90 group-hover:brightness-100"
                      loading="lazy"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-black/35 opacity-85" />

                  {/* Category Tag */}
                  <div className="absolute top-3.5 left-3.5 z-10">
                    <span className="text-[10px] font-mono uppercase tracking-wider bg-black/75 backdrop-blur-md px-2.5 py-1 rounded text-[#08CC07] border border-[#08CC07]/30">
                      {item.tag}
                    </span>
                  </div>

                  {/* Inspect eye icon on hover */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10">
                    <div className="w-11 h-11 rounded-full bg-[#08CC07] text-[#050505] flex items-center justify-center shadow-lg">
                      <Eye className="w-5 h-5" />
                    </div>
                  </div>
                </div>

                {/* Caption Content */}
                <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-[#FFFFFF] group-hover:text-[#08CC07] transition-colors mb-1.5">
                      {item.title}
                    </h3>
                    {item.caption && (
                      <p className="text-xs sm:text-sm text-[#858585] leading-relaxed">
                        {item.caption}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Lightbox Preview Modal for Backstage item */}
      {activeItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
          onClick={() => setActiveItem(null)}
        >
          <div
            className="relative max-w-4xl w-full bg-[#0A0A0A] rounded-2xl overflow-hidden border border-white/15 p-5 sm:p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/10">
              <div className="flex items-center gap-2 text-xs font-mono">
                <span className="text-[#08CC07] uppercase tracking-wider font-bold">
                  {activeItem.tag}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setActiveItem(null)}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-white/70 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-black mb-4 border border-white/10">
              {activeItem.mediaType === 'video' ? (
                <video
                  src={activeItem.mediaUrl}
                  controls
                  autoPlay
                  className="w-full h-full object-contain"
                />
              ) : (
                <img
                  src={activeItem.mediaUrl}
                  alt={activeItem.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-contain"
                />
              )}
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-white">{activeItem.title}</h3>
                {activeItem.caption && (
                  <p className="text-xs sm:text-sm text-[#858585] mt-1">{activeItem.caption}</p>
                )}
              </div>
              <button
                type="button"
                onClick={() => setActiveItem(null)}
                className="px-5 py-2.5 rounded-xl bg-[#08CC07] text-[#050505] font-bold text-xs transition-colors cursor-pointer shrink-0"
              >
                Fechar Visualização
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
