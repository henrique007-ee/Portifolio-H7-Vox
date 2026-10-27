import React from 'react';
import { Instagram, MessageCircle, Mail, MapPin, Lock } from 'lucide-react';
import { buildWhatsAppLink } from '../services/api';
import { LogoOrbit3D } from './LogoOrbit3D';
import { SectionAmbient3DBackground } from './VisualEffects';
import type { SiteSettings } from '../types';

interface FooterProps {
  settings: SiteSettings;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ settings, onOpenAdmin }) => {
  const currentYear = new Date().getFullYear();
  const whatsappUrl = buildWhatsAppLink(
    settings.whatsappNumber,
    'Olá, Endson! Conheci seu portfólio H7.VOX e gostaria de conversar sobre um projeto audiovisual.'
  );

  const instagramUrl = settings.instagramUrl || 'https://www.instagram.com/h7.vox/';

  return (
    <footer className="relative bg-[#050505] text-white/70 border-t border-white/10 pt-16 pb-12 overflow-hidden">
      {/* Floating 3D Sculptures & Digital Smoke integrated into Footer Background */}
      <SectionAmbient3DBackground
        leftSculpture="letterH"
        rightSculpture="number7"
        showSoundWave={true}
        smokeIntensity="subtle"
      />

      <div className="max-w-7xl mx-auto px-5 sm:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 pb-12 border-b border-white/10 text-center md:text-center items-start justify-items-center">
          {/* Brand & Purpose */}
          <div className="space-y-4 flex flex-col items-center">
            <div className="flex items-center justify-center gap-4">
              <a href="#inicio" className="inline-block group">
                <LogoOrbit3D size="md">
                  <div className="h7-logo-badge inline-flex items-center justify-center p-1">
                    <img
                      src="/assets/logo_web.png"
                      alt="H7.VOX"
                      className="h7-logo-img h-11 sm:h-13 w-auto object-contain transition-transform duration-300 group-hover:scale-105 filter drop-shadow-[0_0_14px_rgba(8,204,7,0.25)]"
                    />
                  </div>
                </LogoOrbit3D>
              </a>
            </div>

            <p className="text-sm text-[#B3B3B3] max-w-sm leading-relaxed">
              Dar voz a boas histórias. Criar imagens que ficam. Produção audiovisual, edição de vídeos, filmmaker e cobertura estratégica para eventos e marcas.
            </p>

            <div className="text-xs font-mono text-[#B3B3B3]/60 flex items-center justify-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#08CC07]" />
              <span>{settings.location || 'Pernambuco, Brasil'}</span>
            </div>
          </div>

          {/* Quick Navigation */}
          <div className="space-y-3 flex flex-col items-center">
            <h4 className="text-xs font-mono uppercase tracking-widest text-[#B3B3B3]/60">
              Navegação
            </h4>
            <ul className="space-y-2 text-sm text-[#B3B3B3] flex flex-col items-center">
              <li>
                <a href="#inicio" className="hover:text-[#08CC07] transition-colors">
                  Início
                </a>
              </li>
              <li>
                <a href="#marcas" className="hover:text-[#08CC07] transition-colors">
                  Marcas Atendidas
                </a>
              </li>
              <li>
                <a href="#portfolio" className="hover:text-[#08CC07] transition-colors">
                  Portfólio de Trabalhos
                </a>
              </li>
              <li>
                <a href="#servicos" className="hover:text-[#08CC07] transition-colors">
                  Serviços
                </a>
              </li>
              <li>
                <a href="#sobre" className="hover:text-[#08CC07] transition-colors">
                  Sobre Endson Henrique
                </a>
              </li>
              <li>
                <a href="#depoimentos" className="hover:text-[#08CC07] transition-colors">
                  Depoimentos
                </a>
              </li>
              <li>
                <a href="#orcamento" className="hover:text-[#08CC07] transition-colors">
                  Monte seu Orçamento
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-[#08CC07] transition-colors">
                  Dúvidas Frequentes
                </a>
              </li>
              <li>
                <a href="#contato" className="hover:text-[#08CC07] transition-colors">
                  Contato & WhatsApp
                </a>
              </li>
            </ul>
          </div>

          {/* Direct Social Channels */}
          <div className="space-y-3 flex flex-col items-center">
            <h4 className="text-xs font-mono uppercase tracking-widest text-white/40">
              Canais Oficiais
            </h4>
            <div className="flex flex-col items-start space-y-2.5 text-sm text-left">
              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 text-white/80 hover:text-[#08CC07] transition-colors group"
              >
                <div className="p-1.5 rounded-lg bg-white/5 group-hover:bg-[#08CC07]/20 transition-colors">
                  <Instagram className="w-4 h-4 text-[#08CC07]" />
                </div>
                <div>
                  <span className="block font-semibold">@h7.vox</span>
                  <span className="text-[11px] text-white/40 font-mono">Instagram Oficial</span>
                </div>
              </a>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 text-white/80 hover:text-[#08CC07] transition-colors group"
              >
                <div className="p-1.5 rounded-lg bg-white/5 group-hover:bg-[#08CC07]/20 transition-colors">
                  <MessageCircle className="w-4 h-4 text-[#08CC07]" />
                </div>
                <div>
                  <span className="block font-semibold">(81) 98547-6681</span>
                  <span className="text-[11px] text-white/40 font-mono">WhatsApp Profissional</span>
                </div>
              </a>

              <a
                href={`mailto:${settings.email && settings.email !== 'contato@h7vox.com.br' ? settings.email : 'endsonhenrique13@gmail.com'}`}
                className="flex items-center gap-2.5 text-white/80 hover:text-[#08CC07] transition-colors group"
              >
                <div className="p-1.5 rounded-lg bg-white/5 group-hover:bg-[#08CC07]/20 transition-colors">
                  <Mail className="w-4 h-4 text-[#08CC07]" />
                </div>
                <div>
                  <span className="block font-semibold">
                    {settings.email && settings.email !== 'contato@h7vox.com.br' ? settings.email : 'endsonhenrique13@gmail.com'}
                  </span>
                  <span className="text-[11px] text-white/40 font-mono">E-mail para Propostas</span>
                </div>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-white/40 gap-4 text-center sm:text-left">
          <p>© {currentYear} H7.VOX · {settings.ownerName}. Todos os direitos reservados.</p>

          <div className="flex items-center justify-center gap-6">
            <span className="italic text-white/30 hidden sm:inline">
              "Dar voz a boas histórias. Criar imagens que ficam."
            </span>

            <button
              type="button"
              onClick={onOpenAdmin}
              title="Área de Gestão"
              aria-label="Área de Gestão"
              className="p-2 rounded-lg text-white/30 hover:text-[#08CC07] hover:bg-white/5 transition-colors cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
