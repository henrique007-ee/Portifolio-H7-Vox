import React, { useState } from 'react';
import {
  Palette,
  Type,
  Layers,
  Eye,
  X,
  ChevronLeft,
  ChevronRight,
  MessageCircle,
  ExternalLink,
  CheckCircle2,
} from 'lucide-react';
import { buildWhatsAppLink } from '../services/api';
import { Section3DShowcase } from './Section3DShowcase';
import { SectionAmbient3DBackground } from './VisualEffects';
import type { VisualIdentityProject } from '../types';

interface VisualIdentitySectionProps {
  visualIdentities: VisualIdentityProject[];
  whatsappNumber?: string;
}

export const VisualIdentitySection: React.FC<VisualIdentitySectionProps> = ({
  visualIdentities,
  whatsappNumber,
}) => {
  const [selectedIdentity, setSelectedIdentity] = useState<VisualIdentityProject | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);

  const publishedIdentities = (visualIdentities || [])
    .filter((vi) => vi.published && !vi.inTrash)
    .sort((a, b) => a.order - b.order);

  if (publishedIdentities.length === 0) return null;

  const handleOpenCaseStudy = (item: VisualIdentityProject) => {
    setSelectedIdentity(item);
    setActiveImageIndex(0);
  };

  const galleryImages = selectedIdentity
    ? Array.from(
        new Set(
          [
            selectedIdentity.coverImage,
            selectedIdentity.logoMain,
            ...(selectedIdentity.images || []),
          ].filter(Boolean) as string[]
        )
      )
    : [];

  return (
    <section
      id="identidades-visuais"
      className="py-24 sm:py-32 bg-[#050505] border-b border-white/10 relative overflow-hidden"
    >
      {/* Floating 3D Geometric Block Letter 'H', 3D Prism, Wireframe Sphere & Soundwave in Background */}
      <SectionAmbient3DBackground
        leftSculpture="letterH"
        rightSculpture="prism"
        showSoundWave={true}
        smokeIntensity="subtle"
      />
      <Section3DShowcase preset="branding" />

      <div className="max-w-7xl mx-auto px-5 sm:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-mono tracking-widest text-[#08CC07] uppercase mb-3">
              <Palette className="w-3.5 h-3.5" />
              <span>IDENTIDADE VISUAL</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-[#FFFFFF] tracking-tight font-display text-balance">
              Identidades Visuais & Sistemas de Marca.
            </h2>
          </div>

          <p className="text-sm sm:text-base text-[#858585] max-w-md leading-relaxed">
            Estudos de caso que unem direção de arte, logotipos, paletas cromáticas, tipografia e aplicações visuais pensadas para gerar reconhecimento imediato.
          </p>
        </div>

        {/* Case Studies Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {publishedIdentities.map((item, idx) => {
            const allImgs = Array.from(
              new Set([item.coverImage, ...(item.images || [])].filter(Boolean))
            );

            return (
              <div
                key={item.id}
                onClick={() => handleOpenCaseStudy(item)}
                className="futuristic-card group cursor-pointer rounded-2xl bg-[#0A0A0A] border border-white/10 hover:border-[#08CC07]/50 overflow-hidden flex flex-col justify-between"
              >
                <div>
                  {/* Cover Media Frame with HUD Accents */}
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-black media-overlay-preserve">
                    <img
                      src={item.coverImage || '/assets/logo_web.png'}
                      alt={item.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 filter brightness-95"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-black/25 to-black/30" />

                    {/* Top HUD Frame Stamp */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between text-[10px] font-mono z-10">
                      <span className="bg-black/75 backdrop-blur-md px-2.5 py-1 rounded text-[#08CC07] border border-[#08CC07]/30">
                        CASE 0{idx + 1} · BRANDING
                      </span>
                      {allImgs.length > 1 && (
                        <span className="bg-black/75 backdrop-blur-md px-2.5 py-1 rounded text-white/80 border border-white/10">
                          {allImgs.length} APLICAÇÕES
                        </span>
                      )}
                    </div>

                    {/* Inspect Trigger on Hover */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                      <div className="px-4 py-2 rounded-xl bg-[#08CC07] text-[#050505] font-bold text-xs flex items-center gap-2 shadow-xl">
                        <Eye className="w-4 h-4" />
                        <span>Abrir Estudo de Caso</span>
                      </div>
                    </div>
                  </div>

                  {/* Case Study Body */}
                  <div className="p-6 sm:p-7 space-y-5">
                    <div>
                      <div className="flex items-center gap-2 text-xs font-mono text-[#858585] mb-1.5">
                        <span>{item.client}</span>
                        <span aria-hidden="true">·</span>
                        <span>{item.year}</span>
                      </div>
                      <h3 className="text-xl font-bold text-[#FFFFFF] group-hover:text-[#08CC07] transition-colors leading-snug">
                        {item.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-[#858585] mt-2 line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                    {/* Color Palette Swatches Preview */}
                    {item.colorPalette && item.colorPalette.length > 0 && (
                      <div className="pt-4 border-t border-white/10">
                        <span className="text-[10px] font-mono uppercase tracking-widest text-[#858585] block mb-2.5">
                          Paleta Cromática
                        </span>
                        <div className="flex items-center gap-2 flex-wrap">
                          {item.colorPalette.map((swatch, sIdx) => (
                            <div
                              key={sIdx}
                              className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-[#111111] border border-white/10"
                              title={`${swatch.name}: ${swatch.hex}`}
                            >
                              <span
                                className="w-3.5 h-3.5 rounded-full border border-white/20 shrink-0"
                                style={{ backgroundColor: swatch.hex }}
                              />
                              <span className="text-[10px] font-mono text-white/80 uppercase">
                                {swatch.hex}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Typography System Preview */}
                    {item.typography && item.typography.length > 0 && (
                      <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1.5 text-[#858585] font-mono text-[11px]">
                          <Type className="w-3.5 h-3.5 text-[#08CC07]" />
                          <span className="truncate max-w-[210px]">
                            {item.typography.map((t) => t.family).join(' + ')}
                          </span>
                        </div>
                        <span className="text-[11px] font-mono text-[#08CC07] font-semibold">
                          Ver sistema →
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Full Case Study Modal */}
      {selectedIdentity && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md overflow-y-auto"
          onClick={() => setSelectedIdentity(null)}
        >
          <div
            className="relative w-full max-w-5xl bg-[#0A0A0A] border border-white/15 rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Top HUD Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#050505]">
              <div className="flex items-center gap-3 text-xs font-mono">
                <span className="text-[#08CC07] font-bold uppercase tracking-widest">
                  ESTUDO DE CASO • IDENTIDADE VISUAL
                </span>
                <span className="text-white/20">/</span>
                <span className="text-[#858585]">{selectedIdentity.client}</span>
                <span className="text-white/20">·</span>
                <span className="text-[#858585]">{selectedIdentity.year}</span>
              </div>

              <button
                type="button"
                onClick={() => setSelectedIdentity(null)}
                aria-label="Fechar estudo de caso"
                className="p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="p-6 sm:p-8 overflow-y-auto space-y-8">
              {/* Sequential Image Showcase Viewer */}
              {galleryImages.length > 0 && (
                <div className="space-y-3">
                  <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black border border-white/10">
                    <img
                      src={galleryImages[activeImageIndex]}
                      alt={`${selectedIdentity.title} - Aplicação ${activeImageIndex + 1}`}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />

                    {galleryImages.length > 1 && (
                      <>
                        <button
                          type="button"
                          onClick={() =>
                            setActiveImageIndex((prev) =>
                              prev === 0 ? galleryImages.length - 1 : prev - 1
                            )
                          }
                          aria-label="Imagem anterior"
                          className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl bg-black/75 hover:bg-[#08CC07] text-white hover:text-[#050505] border border-white/15 flex items-center justify-center transition-colors cursor-pointer"
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setActiveImageIndex((prev) =>
                              prev === galleryImages.length - 1 ? 0 : prev + 1
                            )
                          }
                          aria-label="Próxima imagem"
                          className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl bg-black/75 hover:bg-[#08CC07] text-white hover:text-[#050505] border border-white/15 flex items-center justify-center transition-colors cursor-pointer"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      </>
                    )}

                    <div className="absolute bottom-3 right-3 px-3 py-1 rounded-md bg-black/80 border border-white/10 text-[11px] font-mono text-white/80">
                      PRANCHA {activeImageIndex + 1} / {galleryImages.length}
                    </div>
                  </div>

                  {/* Sequence Thumbnails */}
                  {galleryImages.length > 1 && (
                    <div className="flex items-center gap-3 overflow-x-auto pb-1">
                      {galleryImages.map((imgUrl, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setActiveImageIndex(idx)}
                          className={`relative w-24 aspect-video rounded-lg overflow-hidden border transition-all shrink-0 cursor-pointer ${
                            activeImageIndex === idx
                              ? 'border-[#08CC07] ring-2 ring-[#08CC07]/30'
                              : 'border-white/10 opacity-50 hover:opacity-90'
                          }`}
                        >
                          <img
                            src={imgUrl}
                            alt={`Miniatura ${idx + 1}`}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Case Study Details Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left 2 Columns: Concept, Variations & Elements */}
                <div className="lg:col-span-2 space-y-6">
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-display mb-2">
                      {selectedIdentity.title}
                    </h2>
                    <p className="text-sm sm:text-base text-white/80 leading-relaxed">
                      {selectedIdentity.description}
                    </p>
                  </div>

                  {selectedIdentity.concept && (
                    <div className="p-5 rounded-xl bg-[#111111] border border-white/10">
                      <h4 className="text-xs font-mono uppercase tracking-wider text-[#08CC07] mb-2">
                        Conceito & Direção Criativa
                      </h4>
                      <p className="text-sm text-white/80 leading-relaxed">
                        {selectedIdentity.concept}
                      </p>
                    </div>
                  )}

                  {/* Logo Variations & Graphic Elements */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {selectedIdentity.logoVariations && selectedIdentity.logoVariations.length > 0 && (
                      <div className="p-5 rounded-xl bg-[#111111] border border-white/10">
                        <h4 className="text-xs font-mono uppercase tracking-wider text-white/60 mb-3 flex items-center gap-2">
                          <Layers className="w-3.5 h-3.5 text-[#08CC07]" />
                          <span>Variações de Logotipo</span>
                        </h4>
                        <ul className="space-y-2">
                          {selectedIdentity.logoVariations.map((v, i) => (
                            <li key={i} className="text-xs text-white/80 flex items-center gap-2">
                              <CheckCircle2 className="w-3.5 h-3.5 text-[#08CC07] shrink-0" />
                              <span>{v}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {selectedIdentity.graphicElements && selectedIdentity.graphicElements.length > 0 && (
                      <div className="p-5 rounded-xl bg-[#111111] border border-white/10">
                        <h4 className="text-xs font-mono uppercase tracking-wider text-white/60 mb-3 flex items-center gap-2">
                          <Palette className="w-3.5 h-3.5 text-[#08CC07]" />
                          <span>Elementos Gráficos & Aplicações</span>
                        </h4>
                        <ul className="space-y-2">
                          {selectedIdentity.graphicElements.map((el, i) => (
                            <li key={i} className="text-xs text-white/80 flex items-center gap-2">
                              <CheckCircle2 className="w-3.5 h-3.5 text-[#08CC07] shrink-0" />
                              <span>{el}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Column: Color Palette, Typography & CTA */}
                <div className="space-y-6 bg-[#111111] p-6 rounded-xl border border-white/10 h-fit">
                  {/* Color Swatches */}
                  {selectedIdentity.colorPalette && selectedIdentity.colorPalette.length > 0 && (
                    <div>
                      <h4 className="text-xs font-mono uppercase tracking-wider text-[#08CC07] mb-3">
                        Sistema de Cores
                      </h4>
                      <div className="space-y-2.5">
                        {selectedIdentity.colorPalette.map((color, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between p-2.5 rounded-lg bg-[#0A0A0A] border border-white/10"
                          >
                            <div className="flex items-center gap-3">
                              <span
                                className="w-6 h-6 rounded-md border border-white/20 shrink-0"
                                style={{ backgroundColor: color.hex }}
                              />
                              <span className="text-xs font-semibold text-white">
                                {color.name}
                              </span>
                            </div>
                            <span className="text-xs font-mono text-[#858585] uppercase">
                              {color.hex}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Typography */}
                  {selectedIdentity.typography && selectedIdentity.typography.length > 0 && (
                    <div className="pt-4 border-t border-white/10">
                      <h4 className="text-xs font-mono uppercase tracking-wider text-[#08CC07] mb-3">
                        Tipografia Oficial
                      </h4>
                      <div className="space-y-2.5">
                        {selectedIdentity.typography.map((typo, idx) => (
                          <div
                            key={idx}
                            className="p-3 rounded-lg bg-[#0A0A0A] border border-white/10"
                          >
                            <span className="text-[10px] font-mono uppercase text-[#858585] block">
                              {typo.role}
                            </span>
                            <span className="text-sm font-bold text-white font-display">
                              {typo.family}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedIdentity.externalLink && (
                    <a
                      href={selectedIdentity.externalLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-xs text-white/70 hover:text-[#08CC07] transition-colors pt-2"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Ver projeto completo externo</span>
                    </a>
                  )}

                  {/* WhatsApp Conversion CTA */}
                  <div className="pt-4 border-t border-white/10">
                    <a
                      href={buildWhatsAppLink(
                        whatsappNumber,
                        `Olá, Endson! Vi o estudo de caso de Identidade Visual "${selectedIdentity.title}" no seu site H7.VOX e gostaria de um orçamento para a minha marca.`
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-[#08CC07] text-[#050505] font-bold text-xs sm:text-sm hover:bg-[#0ae309] transition-all shadow-lg shadow-[#08CC07]/20"
                    >
                      <MessageCircle className="w-4 h-4 fill-current" />
                      <span>Solicitar Identidade Visual</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
