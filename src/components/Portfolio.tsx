import React, { useState, useMemo } from 'react';
import { Play, Instagram, ArrowUpRight, Film } from 'lucide-react';
import { Section3DShowcase } from './Section3DShowcase';
import { SectionAmbient3DBackground } from './VisualEffects';
import type { Project, CategoryItem } from '../types';

interface PortfolioProps {
  projects: Project[];
  categories: CategoryItem[];
  onSelectProject: (project: Project) => void;
}

export const Portfolio: React.FC<PortfolioProps> = ({ projects, categories, onSelectProject }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');

  // Preserve all active categories + standard 9 categories
  const categoryRows = useMemo(() => {
    const row1 = ['Eventos', 'Shows', 'Storymaker e real time'];
    const row2 = ['Reels e redes sociais', 'Comunicação política', 'Publicidade e marcas'];
    const row3 = ['Filmmaker e captação', 'Fotografia e bastidores', 'Identidades visuais'];

    const standardSet = new Set(['Todos', ...row1, ...row2, ...row3]);
    const extraCategories = (categories || [])
      .filter((c) => c.active && !standardSet.has(c.name))
      .map((c) => c.name);

    return { row1, row2, row3, extraCategories };
  }, [categories]);

  const publishedProjects = useMemo(
    () => projects.filter((p) => p.published && !p.inTrash),
    [projects]
  );

  const filteredProjects = useMemo(() => {
    if (selectedCategory === 'Todos') {
      return publishedProjects;
    }
    return publishedProjects.filter((p) => {
      if (selectedCategory === 'Identidades visuais') {
        return p.category === 'Identidades visuais' || p.category === 'Identidade visual';
      }
      if (selectedCategory === 'Fotografia e bastidores') {
        return p.category === 'Fotografia e bastidores' || p.category === 'Fotografia';
      }
      return p.category === selectedCategory;
    });
  }, [publishedProjects, selectedCategory]);

  return (
    <section
      id="portfolio"
      className="py-24 sm:py-32 bg-[#050505] border-b border-white/10 relative overflow-hidden"
    >
      {/* Floating 3D Background Environment (LED Wand, Cinema Camera, Wireframe Sphere, 3D '7', Soundwave & Digital Smoke) */}
      <SectionAmbient3DBackground
        leftSculpture="wireframeSphere"
        rightSculpture="number7"
        showSoundWave={true}
        smokeIntensity="subtle"
      />
      <Section3DShowcase preset="portfolio" />

      <div className="max-w-7xl mx-auto px-5 sm:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-mono tracking-widest text-[#08CC07] uppercase mb-3">
              <Film className="w-3.5 h-3.5" />
              <span>PORTFÓLIO AUDIOVISUAL</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-[#FFFFFF] tracking-tight font-display text-balance">
              Portfólio de Produções.
            </h2>
          </div>

          <p className="text-sm sm:text-base text-[#858585] max-w-md md:text-right">
            Filmes, aftermovies, coberturas em tempo real e projetos visuais desenvolvidos com narrativa, precisão técnica e impacto.
          </p>
        </div>

        {/* Category Filter Matrix */}
        <div className="max-w-4xl mx-auto mb-14 space-y-2.5">
          {/* 'Todos' Master Filter */}
          <div className="flex items-center justify-center mb-3">
            <button
              type="button"
              onClick={() => setSelectedCategory('Todos')}
              className={`px-6 py-2.5 text-xs sm:text-sm font-mono uppercase tracking-wider rounded-xl transition-all border cursor-pointer whitespace-nowrap ${
                selectedCategory === 'Todos'
                  ? 'bg-[#08CC07] text-[#050505] border-[#08CC07] shadow-[0_0_25px_rgba(8,204,7,0.3)] font-bold'
                  : 'bg-[#0A0A0A] text-white/75 border-white/10 hover:text-white hover:border-[#08CC07]/40'
              }`}
            >
              Todos os Projetos ({publishedProjects.length})
            </button>
          </div>

          {/* Row 1 */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 max-w-2xl mx-auto">
            {categoryRows.row1.map((category) => {
              const isActive = selectedCategory === category;
              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => setSelectedCategory(category)}
                  className={`w-full py-2.5 px-3 text-xs sm:text-sm font-medium rounded-xl transition-all text-center border cursor-pointer whitespace-nowrap truncate ${
                    isActive
                      ? 'bg-[#08CC07] text-[#050505] border-[#08CC07] shadow-[0_0_20px_rgba(8,204,7,0.25)] font-bold'
                      : 'bg-[#0A0A0A] text-white/75 border-white/10 hover:text-white hover:border-[#08CC07]/40 hover:bg-[#111111]'
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>

          {/* Row 2 */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 max-w-3xl mx-auto">
            {categoryRows.row2.map((category) => {
              const isActive = selectedCategory === category;
              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => setSelectedCategory(category)}
                  className={`w-full py-2.5 px-3 text-xs sm:text-sm font-medium rounded-xl transition-all text-center border cursor-pointer whitespace-nowrap truncate ${
                    isActive
                      ? 'bg-[#08CC07] text-[#050505] border-[#08CC07] shadow-[0_0_20px_rgba(8,204,7,0.25)] font-bold'
                      : 'bg-[#0A0A0A] text-white/75 border-white/10 hover:text-white hover:border-[#08CC07]/40 hover:bg-[#111111]'
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>

          {/* Row 3 */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 max-w-3xl mx-auto">
            {categoryRows.row3.map((category) => {
              const isActive = selectedCategory === category;
              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => setSelectedCategory(category)}
                  className={`w-full py-2.5 px-3 text-xs sm:text-sm font-medium rounded-xl transition-all text-center border cursor-pointer whitespace-nowrap truncate ${
                    isActive
                      ? 'bg-[#08CC07] text-[#050505] border-[#08CC07] shadow-[0_0_20px_rgba(8,204,7,0.25)] font-bold'
                      : 'bg-[#0A0A0A] text-white/75 border-white/10 hover:text-white hover:border-[#08CC07]/40 hover:bg-[#111111]'
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>

          {/* Extra Custom Categories if any */}
          {categoryRows.extraCategories.length > 0 && (
            <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
              {categoryRows.extraCategories.map((category) => {
                const isActive = selectedCategory === category;
                return (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setSelectedCategory(category)}
                    className={`py-2 px-4 text-xs font-medium rounded-xl transition-all border cursor-pointer whitespace-nowrap ${
                      isActive
                        ? 'bg-[#08CC07] text-[#050505] border-[#08CC07] font-bold'
                        : 'bg-[#0A0A0A] text-white/75 border-white/10 hover:text-white hover:border-[#08CC07]/40'
                    }`}
                  >
                    {category}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Project Grid */}
        {filteredProjects.length === 0 ? (
          <div className="py-20 px-6 text-center rounded-2xl bg-[#0A0A0A] border border-white/10 max-w-lg mx-auto space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-white/5 border border-[#08CC07]/30 flex items-center justify-center mx-auto text-[#08CC07]">
              <Play className="w-6 h-6 fill-current ml-0.5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white mb-1.5 font-display">
                {publishedProjects.length === 0
                  ? 'Catálogo Audiovisual Pronto para Publicação'
                  : 'Nenhum projeto audiovisual nesta categoria'}
              </h3>
              <p className="text-xs text-[#858585] max-w-md mx-auto leading-relaxed">
                {selectedCategory === 'Identidades visuais'
                  ? 'Confira logo abaixo nossa seção dedicada de Estudos de Caso de Identidades Visuais e Design de Marca.'
                  : publishedProjects.length === 0
                  ? 'Os projetos e produções audiovisuais podem ser gerenciados pelo painel H7.VOX ou solicitados diretamente pelo WhatsApp.'
                  : 'Selecione outra categoria acima para explorar mais produções.'}
              </p>
            </div>
            {selectedCategory === 'Identidades visuais' ? (
              <div className="pt-2">
                <a
                  href="#identidades-visuais"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#08CC07] text-[#050505] font-bold text-xs hover:bg-[#0ae309] transition-all"
                >
                  <span>Ir para Estudos de Caso de Identidade Visual</span>
                </a>
              </div>
            ) : (
              publishedProjects.length === 0 && (
                <div className="pt-2">
                  <a
                    href="https://wa.me/5581985476681?text=Ol%C3%A1%2C%20Endson!%20Conheci%20seu%20portf%C3%B3lio%20H7.VOX%20e%20gostaria%20de%20conversar%20sobre%20um%20projeto%20audiovisual."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#08CC07] text-[#050505] font-bold text-xs hover:bg-[#0ae309] transition-all shadow-md shadow-[#08CC07]/20"
                  >
                    <span>Conversar no WhatsApp</span>
                  </a>
                </div>
              )
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-start">
            {filteredProjects.map((project) => {
              const isVertical = project.aspectRatio === '9:16';
              const isInstagram =
                project.videoType === 'instagram' || Boolean(project.instagramUrl);

              return (
                <div
                  key={project.id}
                  onClick={() => onSelectProject(project)}
                  className="futuristic-card group cursor-pointer rounded-2xl bg-[#0A0A0A] border border-white/10 hover:border-[#08CC07]/60 overflow-hidden flex flex-col h-full"
                >
                  {/* Media Frame respecting native aspect ratio */}
                  <div
                    className={`relative w-full overflow-hidden bg-black media-overlay-preserve ${
                      isVertical ? 'aspect-[9/16] max-h-[560px]' : 'aspect-video'
                    }`}
                  >
                    <img
                      src={project.thumbnail || '/assets/logo_web.png'}
                      alt={project.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 filter brightness-95"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-black/35" />

                    {/* Play Hover Trigger */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <div className="w-13 h-13 rounded-full bg-[#08CC07] text-[#050505] flex items-center justify-center shadow-[0_0_25px_rgba(8,204,7,0.5)] transform scale-90 group-hover:scale-100 transition-transform">
                        <Play className="w-5 h-5 fill-current ml-0.5" />
                      </div>
                    </div>

                    {/* Top Project Category & Format */}
                    <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between text-[10px] font-mono z-10">
                      <span className="bg-black/75 backdrop-blur-md px-2.5 py-1 rounded text-white/90 border border-white/10 truncate max-w-[165px]">
                        {project.category}
                      </span>
                      {isInstagram ? (
                        <span className="bg-[#833AB4]/90 backdrop-blur-md px-2.5 py-1 rounded text-white border border-white/10 flex items-center gap-1">
                          <Instagram className="w-3 h-3" />
                          <span>REEL</span>
                        </span>
                      ) : (
                        <span className="bg-black/75 backdrop-blur-md px-2.5 py-1 rounded text-[#08CC07] border border-[#08CC07]/30">
                          {project.aspectRatio}
                        </span>
                      )}
                    </div>

                    {project.results && (
                      <div className="absolute bottom-3 left-3.5 right-3.5 bg-black/80 backdrop-blur-md px-2.5 py-1 rounded text-[11px] text-[#08CC07] border border-[#08CC07]/25 font-mono truncate">
                        {project.results}
                      </div>
                    )}
                  </div>

                  {/* Content details */}
                  <div className="p-6 flex flex-col justify-between flex-1">
                    <div>
                      <div className="flex items-center gap-2 text-xs text-[#858585] mb-2 font-mono">
                        <span>{project.client || 'H7.VOX'}</span>
                        <span aria-hidden="true">·</span>
                        <span>{project.year}</span>
                      </div>

                      <h3 className="text-lg font-bold text-[#FFFFFF] group-hover:text-[#08CC07] transition-colors mb-2 leading-snug">
                        {project.title}
                      </h3>

                      <p className="text-xs sm:text-sm text-[#858585] line-clamp-2 leading-relaxed mb-4">
                        {project.description}
                      </p>
                    </div>

                    {/* Services done */}
                    <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs">
                      <span className="text-[#858585] font-mono text-[11px] truncate max-w-[200px]">
                        {project.services.join(' · ')}
                      </span>
                      <span className="font-semibold text-white/80 group-hover:text-[#08CC07] transition-colors shrink-0 flex items-center gap-1 font-mono text-[11px]">
                        <span>ASSISTIR</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
