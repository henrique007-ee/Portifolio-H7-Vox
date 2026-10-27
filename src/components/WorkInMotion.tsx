import React from 'react';
import { Play, Instagram, ArrowUpRight } from 'lucide-react';
import { Section3DShowcase } from './Section3DShowcase';
import { SectionAmbient3DBackground } from './VisualEffects';
import type { Project } from '../types';

interface WorkInMotionProps {
  projects: Project[];
  onSelectProject: (project: Project) => void;
}

export const WorkInMotion: React.FC<WorkInMotionProps> = ({ projects, onSelectProject }) => {
  const motionProjects = projects
    .filter((p) => p.published && !p.inTrash)
    .sort((a, b) => {
      if (a.aspectRatio === '9:16' && b.aspectRatio !== '9:16') return -1;
      if (b.aspectRatio === '9:16' && a.aspectRatio !== '9:16') return 1;
      return a.order - b.order;
    })
    .slice(0, 6);

  if (motionProjects.length === 0) return null;

  return (
    <section
      id="em-movimento"
      className="py-24 sm:py-32 bg-[#050505] border-b border-white/10 relative overflow-hidden"
    >
      {/* Floating 3D Studio Headphones, Drone, Sculptures & Soundwave in Background */}
      <SectionAmbient3DBackground
        leftSculpture="prism"
        rightSculpture="number7"
        showSoundWave={true}
        smokeIntensity="subtle"
      />
      <Section3DShowcase preset="motion" />

      <div className="max-w-7xl mx-auto px-5 sm:px-8 relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <div className="text-xs font-mono tracking-widest text-[#08CC07] uppercase mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#08CC07]" />
              <span>REELS, STORIES & PRODUÇÕES DINÂMICAS</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-[#FFFFFF] tracking-tight font-display">
              Meu trabalho em movimento.
            </h2>
          </div>
          <p className="text-sm sm:text-base text-[#B3B3B3] max-w-md">
            Produções pensadas para o consumo vertical nas redes sociais: ritmo acelerado, cortes precisos e retenção imediata nos primeiros segundos.
          </p>
        </div>

        {/* Carousel / Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 items-start">
          {motionProjects.map((project) => {
            const isVertical = project.aspectRatio === '9:16';
            const isInstagram =
              project.videoType === 'instagram' || Boolean(project.instagramUrl);

            return (
              <div
                key={project.id}
                onClick={() => onSelectProject(project)}
                className="group cursor-pointer rounded-2xl bg-[#0A0A0A] border border-white/10 hover:border-[#08CC07]/50 transition-all duration-300 overflow-hidden flex flex-col justify-between"
              >
                {/* Media Container with 9:16 preservation */}
                <div
                  className={`relative w-full overflow-hidden bg-black ${
                    isVertical ? 'aspect-[9/16] max-h-[520px] sm:max-h-none' : 'aspect-video'
                  }`}
                >
                  <img
                    src={project.thumbnail}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 filter brightness-95"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/30" />

                  {/* Play badge */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-12 h-12 rounded-full bg-[#08CC07] text-[#050505] flex items-center justify-center shadow-lg shadow-[#08CC07]/40 transform scale-90 group-hover:scale-100 transition-transform">
                      <Play className="w-5 h-5 fill-current ml-0.5" />
                    </div>
                  </div>

                  {/* Top category & format badges */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between text-[10px] font-mono z-10">
                    <span className="bg-black/75 backdrop-blur-md px-2 py-0.5 rounded text-white/85 border border-white/10 truncate max-w-[140px]">
                      {project.category}
                    </span>
                    {isInstagram ? (
                      <span className="bg-[#833AB4]/85 backdrop-blur-md px-2 py-0.5 rounded text-white flex items-center gap-1 border border-white/10">
                        <Instagram className="w-3 h-3" />
                        <span>REEL</span>
                      </span>
                    ) : (
                      <span className="bg-black/75 backdrop-blur-md px-2 py-0.5 rounded text-[#08CC07] border border-[#08CC07]/20">
                        {project.aspectRatio}
                      </span>
                    )}
                  </div>
                </div>

                {/* Info block */}
                <div className="p-4 flex flex-col justify-between flex-1">
                  <div>
                    <span className="text-[11px] text-white/40 font-mono block truncate">
                      {project.client || 'H7.VOX'} · {project.year}
                    </span>
                    <h3 className="text-sm font-bold text-white group-hover:text-[#08CC07] transition-colors line-clamp-1 mt-1">
                      {project.title}
                    </h3>
                  </div>

                  <div className="pt-3 border-t border-white/5 mt-3 flex items-center justify-between text-[11px] text-white/50">
                    <span>{project.services[0] || 'Edição Vertical'}</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-[#08CC07]" />
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
