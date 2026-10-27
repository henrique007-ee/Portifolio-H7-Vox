import React, { useEffect } from 'react';
import { X, MessageCircle, ExternalLink, Film, CheckCircle2, Instagram } from 'lucide-react';
import { VideoPlayer } from './VideoPlayer';
import { buildWhatsAppLink } from '../services/api';
import type { Project, SiteSettings } from '../types';

interface ProjectModalProps {
  project: Project | null;
  allProjects: Project[];
  settings: SiteSettings;
  onClose: () => void;
  onSelectProject: (project: Project) => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({
  project,
  allProjects,
  settings,
  onClose,
  onSelectProject,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (project) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [project, onClose]);

  if (!project) return null;

  const relatedProjects = allProjects
    .filter((p) => p.id !== project.id && p.published && !p.inTrash && (p.category === project.category || p.featured))
    .slice(0, 3);

  const whatsappMessage = `Olá, Endson! Assisti ao projeto "${project.title}" no seu portfólio H7.VOX e gostaria de um orçamento para um trabalho similar.`;
  const whatsappUrl = buildWhatsAppLink(settings.whatsappNumber, whatsappMessage);

  const isInstagram = project.videoType === 'instagram' || Boolean(project.instagramUrl);
  const igLink = project.instagramUrl || (project.videoUrl?.includes('instagram.com') ? project.videoUrl : '');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md overflow-y-auto">
      {/* Modal Container */}
      <div
        className="relative w-full max-w-5xl bg-[#111111] border border-white/10 rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Bar with Title and Close Button */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#0c0c0c]/90">
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono uppercase tracking-widest text-[#08CC07]">
              {project.category}
            </span>
            <span className="text-white/20">/</span>
            <span className="text-xs text-white/50 font-mono">{project.year}</span>
            {isInstagram && (
              <span className="bg-[#833AB4]/90 text-white text-[10px] font-mono px-2 py-0.5 rounded flex items-center gap-1">
                <Instagram className="w-3 h-3" />
                <span>INSTAGRAM REEL</span>
              </span>
            )}
          </div>

          <button
            onClick={onClose}
            aria-label="Fechar visualizador"
            className="p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-8">
          {/* Main Video / Showcase Player */}
          <div className="w-full flex justify-center bg-black/40 rounded-xl p-2 sm:p-4 border border-white/5">
            <div className={`w-full ${project.aspectRatio === '9:16' ? 'max-w-md' : 'max-w-4xl'}`}>
              <VideoPlayer
                videoUrl={project.videoUrl}
                thumbnail={project.thumbnail}
                title={project.title}
                aspectRatio={project.aspectRatio}
                videoType={project.videoType}
                instagramUrl={project.instagramUrl}
                autoPlay={true}
              />
            </div>
          </div>

          {/* Project Details Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-2">
            {/* Left 2 Cols: Main Context */}
            <div className="lg:col-span-2 space-y-6">
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-2 font-display">
                  {project.title}
                </h2>
                <div className="flex items-center gap-3 text-sm text-white/50 font-mono">
                  <span>Cliente: <strong className="text-white font-medium">{project.client || 'H7.VOX'}</strong></span>
                  <span>·</span>
                  <span>Formato: <strong className="text-[#08CC07]">{project.aspectRatio}</strong></span>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-mono uppercase tracking-wider text-white/40 mb-2">
                  Contexto e Desafio
                </h4>
                <p className="text-sm sm:text-base text-white/80 leading-relaxed whitespace-pre-line">
                  {project.description || 'Produção audiovisual planejada com ritmo dinâmico, enquadramentos estratégicos e pós-produção profissional.'}
                </p>
              </div>

              {project.credits && (
                <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                  <h4 className="text-xs font-mono uppercase tracking-wider text-white/40 mb-1">
                    Créditos da Produção
                  </h4>
                  <p className="text-xs text-white/70">{project.credits}</p>
                </div>
              )}
            </div>

            {/* Right 1 Col: Services, Results & CTA */}
            <div className="space-y-6 bg-[#161616] p-6 rounded-xl border border-white/5 h-fit">
              {/* Services Executed */}
              <div>
                <h4 className="text-xs font-mono uppercase tracking-wider text-[#08CC07] mb-3">
                  Serviços Executados
                </h4>
                <ul className="space-y-2">
                  {project.services && project.services.length > 0 ? (
                    project.services.map((srv, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-white/80">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#08CC07] shrink-0 mt-0.5" />
                        <span>{srv}</span>
                      </li>
                    ))
                  ) : (
                    <li className="text-xs text-white/40">Edição e produção audiovisual</li>
                  )}
                </ul>
              </div>

              {/* Real Results (if any) */}
              {project.results && (
                <div className="pt-4 border-t border-white/10">
                  <h4 className="text-xs font-mono uppercase tracking-wider text-white/40 mb-1">
                    Resultados Alcançados
                  </h4>
                  <p className="text-sm font-semibold text-[#08CC07] font-mono">
                    {project.results}
                  </p>
                </div>
              )}

              {/* Instagram External Link */}
              {igLink && (
                <div className="pt-2">
                  <a
                    href={igLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-xs text-[#E1306C] hover:text-white transition-colors"
                  >
                    <Instagram className="w-4 h-4" />
                    <span>Ver no perfil oficial @h7.vox</span>
                  </a>
                </div>
              )}

              {/* External Link */}
              {project.externalLink && project.externalLink !== igLink && (
                <a
                  href={project.externalLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-xs text-white/60 hover:text-white transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Ver publicação original</span>
                </a>
              )}

              {/* WhatsApp Conversion CTA */}
              <div className="pt-4 border-t border-white/10">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#08CC07] text-[#080808] font-bold text-xs sm:text-sm hover:bg-[#0ae309] transition-all shadow-lg shadow-[#08CC07]/20"
                >
                  <MessageCircle className="w-4 h-4 fill-current" />
                  <span>Quero um projeto similar</span>
                </a>
              </div>
            </div>
          </div>

          {/* Related Projects Section */}
          {relatedProjects.length > 0 && (
            <div className="pt-8 border-t border-white/10">
              <h4 className="text-xs font-mono uppercase tracking-wider text-white/40 mb-4">
                Outros Trabalhos Relacionados
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {relatedProjects.map((rel) => (
                  <div
                    key={rel.id}
                    onClick={() => onSelectProject(rel)}
                    className="group cursor-pointer rounded-xl bg-[#181818] border border-white/5 hover:border-[#08CC07]/40 p-3 transition-colors flex items-center gap-3"
                  >
                    <div className="w-14 h-14 rounded-lg bg-black overflow-hidden shrink-0">
                      <img src={rel.thumbnail || '/assets/logo_web.png'} alt={rel.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                    </div>
                    <div className="overflow-hidden">
                      <h5 className="text-xs font-bold text-white group-hover:text-[#08CC07] transition-colors truncate">
                        {rel.title}
                      </h5>
                      <span className="text-[11px] text-white/40 font-mono">{rel.client}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
