import React from 'react';
import { Check, ArrowRight, MessageCircle } from 'lucide-react';
import { buildWhatsAppLink } from '../services/api';
import { Section3DShowcase } from './Section3DShowcase';
import { SectionAmbient3DBackground } from './VisualEffects';
import type { ServiceItem, SiteSettings } from '../types';

interface ServicesProps {
  services: ServiceItem[];
  settings: SiteSettings;
}

export const Services: React.FC<ServicesProps> = ({ services, settings }) => {
  const activeServices = services.filter((s) => s.active).sort((a, b) => a.order - b.order);

  return (
    <section
      id="servicos"
      className="py-24 sm:py-32 bg-[#050505] border-b border-white/10 relative overflow-hidden"
    >
      {/* Floating 3D Studio Headphones, 3D Octahedron, Orbital Triangles & Soundwave in Background */}
      <SectionAmbient3DBackground
        leftSculpture="octahedron"
        rightSculpture="orbitalRing"
        showSoundWave={true}
        smokeIntensity="subtle"
      />
      <Section3DShowcase preset="services" />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <div className="text-xs font-mono tracking-widest text-[#08CC07] uppercase mb-3">
            SERVIÇOS & SOLUÇÕES
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight font-display mb-4">
            Da ideia à entrega final.
          </h2>
          <p className="text-base sm:text-lg text-[#B3B3B3] leading-relaxed">
            Cada projeto tem uma necessidade diferente. Meu trabalho é entender o que precisa ser comunicado e transformar isso em conteúdo audiovisual com intenção, ritmo e personalidade.
          </p>
        </div>

        {/* Services Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {activeServices.map((service) => {
            const serviceWhatsappUrl = buildWhatsAppLink(
              settings.whatsappNumber,
              service.whatsappMessage ||
                `Olá Endson! Gostaria de falar sobre o serviço de ${service.title}.`
            );

            return (
              <div
                key={service.id}
                className="futuristic-card group rounded-2xl bg-[#0A0A0A] border border-white/10 hover:border-[#08CC07]/40 p-8 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-sm font-mono font-bold text-[#08CC07] tracking-wider">
                      SERVIÇO {service.code}
                    </span>
                    <span className="text-xs font-mono text-white/30">H7.VOX</span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 group-hover:text-[#08CC07] transition-colors">
                    {service.title}
                  </h3>

                  <p className="text-sm text-[#B3B3B3] leading-relaxed mb-6">
                    {service.description}
                  </p>

                  {/* Deliverables */}
                  <div className="space-y-2.5 pt-4 border-t border-white/10 mb-6">
                    <span className="text-xs font-mono text-white/40 uppercase tracking-wider block mb-2">
                      Possíveis Entregas
                    </span>
                    {service.deliverables.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-xs text-white/80">
                        <Check className="w-3.5 h-3.5 text-[#08CC07] shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* WhatsApp Action Button */}
                <div className="pt-6 border-t border-white/5">
                  <a
                    href={serviceWhatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-white/5 group-hover:bg-[#08CC07] text-white group-hover:text-[#080808] font-bold text-xs sm:text-sm transition-all duration-300"
                  >
                    <MessageCircle className="w-4 h-4 fill-current" />
                    <span>Quero esse serviço</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
