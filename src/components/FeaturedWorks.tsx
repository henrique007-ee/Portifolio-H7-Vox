import React from 'react';
import { Play, ArrowUpRight } from 'lucide-react';
import { SectionAmbient3DBackground } from './VisualEffects';
import type { Project } from '../types';

interface FeaturedWorksProps {
  projects: Project[];
  onSelectProject: (project: Project) => void;
}

export const FeaturedWorks: React.FC<FeaturedWorksProps> = ({ projects, onSelectProject }) => {
  const featured = projects.filter((p) => p.featured && p.published && !p.inTrash);

  if (featured.length === 0) return null;

  return (
    <section className="py-24 sm:py-32 bg-[#050505] border-b border-white/10 relative overflow-hidden">
      {/* Floating 3D Sculptures & Digital Smoke in Background */}
      <SectionAmbient3DBackground
        leftSculpture="number7"
        rightSculpture="octahedron"
        showSoundWave={false}
        smokeIntensity="subtle"
      />

      <div className="max-w-7xl mx-auto px-5 sm:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <div className="text-xs font-mono tracking-widest text-[#08CC07] uppercase mb-3">
              DESTAQUES SELECIONADOS
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-[#FFFFFF] tracking-tight font-display">
              Trabalhos que falam por si.
            </h2>
          </div>
          <p className="text-sm sm:text-base text-[#B3B3B3] max-w-md">
            Produções marcantes que traduzem ritmo, narrativa cinematográfica e resultado real para clientes e audiência.
          </p>
        </div>

        {/* Asymmetrical Layout for Featured Works */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {featured.map((project, idx) => {
            const isWide = idx % 3 === 0;
            const colSpan = isWide
              ? 'md:col-span-8'
              : idx % 3 === 1
              ? 'md:col-span-4'
              : 'md:col-span-6';

            return (
              <div
                key={project.id}
                onClick={() => onSelectProject(project)}
                className={`${colSpan} group cursor-pointer relative overflow-hidden rounded-2xl bg-[#0A0A0A] border border-white/10 hover:border-[#08CC07]/50 transition-all duration-300 flex flex-col`}
              >
                {/* Media Container */}
                <div
                  className={`relative w-full overflow-hidden bg-black ${
                    project.aspectRatio === '9:16'
                      ? 'aspect-[9/16] max-h-[600px]'
                      : 'aspect-video'
                  }`}
                >
                  <img
                    src={project.thumbnail}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 filter brightness-90 group-hover:brightness-100"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-transparent to-transparent opacity-80" />

                  {/* Play Overlay Badge */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-14 h-14 rounded-full bg-[#08CC07]/90 text-[#080808] flex items-center justify-center transform scale-90 group-hover:scale-110 transition-transform duration-300 shadow-xl shadow-[#08CC07]/30">
                      <Play className="w-6 h-6 fill-current ml-0.5" />
                    </div>
                  </div>

                  {/* Top floating metadata */}
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between text-xs font-mono">
                    <span className="bg-black/70 backdrop-blur-md px-2.5 py-1 rounded text-white/90 border border-white/10">
                      {project.category}
                    </span>
                    <span className="bg-black/70 backdrop-blur-md px-2.5 py-1 rounded text-[#08CC07] border border-[#08CC07]/30">
                      {project.aspectRatio}
                    </span>
                  </div>
                </div>

                {/* Content Box */}
                <div className="p-6 sm:p-8 flex flex-col justify-between flex-1">
                  <div>
                    <div className="flex items-center gap-2 text-xs text-white/40 mb-2 font-mono">
                      <span>{project.client}</span>
                      <span aria-hidden="true">·</span>
                      <span>{project.year}</span>
                    </div>

                    <h3 className="text-xl sm:text-2xl font-bold text-white group-hover:text-[#08CC07] transition-colors mb-3">
                      {project.title}
                    </h3>

                    <p className="text-sm text-white/60 line-clamp-2 leading-relaxed mb-4">
                      {project.description}
                    </p>
                  </div>

                  {/* Bottom Meta & Action */}
                  <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                    <div className="flex flex-wrap gap-2 text-xs text-white/40">
                      {project.services.slice(0, 3).map((srv, sIdx) => (
                        <span key={sIdx}>
                          {srv}
                          {sIdx < Math.min(project.services.length, 3) - 1 ? ' · ' : ''}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center gap-1 text-xs font-semibold text-white/70 group-hover:text-[#08CC07] transition-colors whitespace-nowrap">
                      <span>Ver detalhes</span>
                      <ArrowUpRight className="w-4 h-4" />
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
