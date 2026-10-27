import React, { useState, useEffect } from 'react';
import { Menu, X, MessageCircle, Instagram, Sun, Moon } from 'lucide-react';
import { buildWhatsAppLink } from '../services/api';
import { LogoOrbit3D } from './LogoOrbit3D';
import type { SiteSettings } from '../types';

interface NavbarProps {
  settings: SiteSettings;
  onOpenAdmin: () => void;
  isAdminLoggedIn: boolean;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  settings, 
  onOpenAdmin, 
  isAdminLoggedIn,
  theme,
  onToggleTheme
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDesktopHref, setActiveDesktopHref] = useState('#inicio');
  const [activeMobileHref, setActiveMobileHref] = useState('#inicio');
  const [hoveredHref, setHoveredHref] = useState<string | null>(null);

  useEffect(() => {
    const desktopSectionIds = [
      'inicio',
      'marcas',
      'portfolio',
      'servicos',
      'sobre',
      'orcamento',
      'contato',
    ];
    const mobileSectionIds = [
      'inicio',
      'marcas',
      'portfolio',
      'servicos',
      'sobre',
      'depoimentos',
      'orcamento',
      'faq',
      'contato',
    ];

    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsScrolled(scrollY > 30);

      if (scrollY < 80) {
        setActiveDesktopHref('#inicio');
        setActiveMobileHref('#inicio');
        return;
      }

      if (window.innerHeight + scrollY >= document.documentElement.scrollHeight - 80) {
        setActiveDesktopHref('#contato');
        setActiveMobileHref('#contato');
        return;
      }

      const probeY = scrollY + Math.min(window.innerHeight * 0.35, 280);

      let currentDesktop = '#inicio';
      for (const id of desktopSectionIds) {
        const el = document.getElementById(id);
        if (el) {
          const top = el.getBoundingClientRect().top + scrollY;
          if (probeY >= top) {
            currentDesktop = `#${id}`;
          }
        }
      }
      setActiveDesktopHref(currentDesktop);

      let currentMobile = '#inicio';
      for (const id of mobileSectionIds) {
        const el = document.getElementById(id);
        if (el) {
          const top = el.getBoundingClientRect().top + scrollY;
          if (probeY >= top) {
            currentMobile = `#${id}`;
          }
        }
      }
      setActiveMobileHref(currentMobile);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const whatsappUrl = buildWhatsAppLink(
    settings.whatsappNumber,
    settings.defaultWhatsappMessage || 'Olá, Endson! Conheci seu portfólio H7.VOX e gostaria de conversar sobre um projeto audiovisual.'
  );

  const instagramUrl = settings.instagramUrl || 'https://www.instagram.com/h7.vox/';

  // Left side nav links (Desktop) - balanced symmetrically to the left of the centered logo
  const leftNavLinks: Array<{ label: string; href: string }> = [
    { label: 'Início', href: '#inicio' },
    { label: 'Marcas', href: '#marcas' },
    { label: 'Portfólios', href: '#portfolio' },
    { label: 'Serviços', href: '#servicos' },
  ];

  // Right side nav links (Desktop) - balanced symmetrically with action buttons to the right of the centered logo
  const rightNavLinks: Array<{ label: string; href: string }> = [
    { label: 'Sobre', href: '#sobre' },
    { label: 'Orçamento', href: '#orcamento' },
    { label: 'Contato', href: '#contato' },
  ];

  // Combined for mobile drawer
  const allMobileLinks: Array<{ label: string; href: string; badge?: string }> = [
    { label: 'Início', href: '#inicio' },
    { label: 'Marcas', href: '#marcas' },
    { label: 'Portfólios', href: '#portfolio' },
    { label: 'Serviços', href: '#servicos' },
    { label: 'Sobre mim', href: '#sobre' },
    { label: 'Depoimentos', href: '#depoimentos' },
    { label: 'Montar Orçamento', href: '#orcamento', badge: 'Briefing' },
    { label: 'Dúvidas Frequentes', href: '#faq' },
    { label: 'Contato', href: '#contato' },
  ];

  const currentHighlightedHref = hoveredHref || activeDesktopHref;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 ${
        isScrolled
          ? 'bg-[#050505]/95 backdrop-blur-md border-b border-white/10 shadow-2xl py-2.5'
          : 'bg-[#050505]/85 lg:bg-transparent backdrop-blur-md lg:backdrop-blur-none border-b border-white/5 lg:border-transparent py-3 sm:py-4 lg:py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        {/* Desktop Navbar: True Mathematical Center alignment with the site */}
        <div className="hidden lg:grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-4 xl:gap-8">
          {/* Left Navigation Zone - aligned toward the center axis */}
          <nav
            className="flex items-center justify-end gap-4 xl:gap-6 text-xs xl:text-sm font-medium text-white/80"
            onMouseLeave={() => setHoveredHref(null)}
          >
            {leftNavLinks.map((link) => {
              const isActive = currentHighlightedHref === link.href;
              return (
                <a
                  key={link.label}
                  href={link.href}
                  onMouseEnter={() => setHoveredHref(link.href)}
                  onClick={() => {
                    setActiveDesktopHref(link.href);
                    setActiveMobileHref(link.href);
                  }}
                  className={`transition-colors duration-200 relative py-1 whitespace-nowrap after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-0.5 after:bg-[#08CC07] after:transition-all after:duration-300 ${
                    isActive
                      ? 'text-[#08CC07] font-bold after:w-full'
                      : 'hover:text-[#08CC07] after:w-0 hover:after:w-full'
                  }`}
                >
                  {link.label}
                </a>
              );
            })}
          </nav>

          {/* Center Zone: Prominent Large Logo pinned to the exact horizontal center of the site */}
          <div className="flex items-center justify-center px-2 xl:px-4 shrink-0">
            <a
              href="#inicio"
              onClick={() => {
                setActiveDesktopHref('#inicio');
                setActiveMobileHref('#inicio');
              }}
              className="group flex flex-col items-center justify-center transition-transform duration-300 hover:scale-105"
              title="H7.VOX - Editor de Vídeo, Filmmaker e Storymaker"
            >
              <LogoOrbit3D size="lg">
                <div className="h7-logo-badge p-1 transition-all flex items-center justify-center">
                  <img
                    src="/assets/logo_web.png"
                    alt="H7.VOX"
                    className="h7-logo-img h-12 sm:h-14 xl:h-16 w-auto object-contain filter drop-shadow-[0_0_16px_rgba(8,204,7,0.28)]"
                  />
                </div>
              </LogoOrbit3D>
            </a>
          </div>

          {/* Right Navigation & Action Zone - aligned symmetrically from the center axis */}
          <div className="flex items-center justify-start gap-4 xl:gap-6">
            <nav
              className="flex items-center gap-4 xl:gap-6 text-xs xl:text-sm font-medium text-white/80"
              onMouseLeave={() => setHoveredHref(null)}
            >
              {rightNavLinks.map((link) => {
                const isActive = currentHighlightedHref === link.href;
                return (
                  <a
                    key={link.label}
                    href={link.href}
                    onMouseEnter={() => setHoveredHref(link.href)}
                    onClick={() => {
                      setActiveDesktopHref(link.href);
                      setActiveMobileHref(link.href);
                    }}
                    className={`transition-colors duration-200 relative py-1 whitespace-nowrap after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-0.5 after:bg-[#08CC07] after:transition-all after:duration-300 ${
                      isActive
                        ? 'text-[#08CC07] font-bold after:w-full'
                        : 'hover:text-[#08CC07] after:w-0 hover:after:w-full'
                    }`}
                  >
                    {link.label}
                  </a>
                );
              })}
            </nav>

            <div className="flex items-center gap-2 xl:gap-2.5 pl-3 border-l border-white/10 shrink-0">
              {/* Theme Toggle Button */}
              <button
                type="button"
                onClick={onToggleTheme}
                title={theme === 'dark' ? 'Alternar para Modo Claro' : 'Alternar para Modo Escuro'}
                aria-label="Alternar tema claro e escuro"
                className="p-2 xl:p-2.5 rounded-xl border border-white/10 text-white/70 hover:text-white hover:border-[#08CC07]/40 bg-white/5 transition-all cursor-pointer hover:bg-white/10"
              >
                {theme === 'dark' ? (
                  <Sun className="w-4 h-4 text-amber-400" />
                ) : (
                  <Moon className="w-4 h-4 text-indigo-500" />
                )}
              </button>

              {/* Instagram link */}
              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                title="Instagram Oficial @h7.vox"
                className="p-2 xl:p-2.5 rounded-xl border border-white/10 text-white/60 hover:text-[#08CC07] hover:bg-white/5 transition-colors"
              >
                <Instagram className="w-4 h-4" />
              </a>

              {/* WhatsApp CTA */}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3.5 xl:px-4 py-2 text-xs font-bold text-[#050505] bg-[#08CC07] hover:bg-[#0ae309] rounded-xl transition-all transform active:scale-95 shadow-md shadow-[#08CC07]/20 whitespace-nowrap"
              >
                <MessageCircle className="w-3.5 h-3.5 fill-current" />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>
        </div>

        {/* Mobile & Tablet Navbar: Clean 3-column symmetrical layout with true center column */}
        <div className="lg:hidden grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2">
          {/* Left: Compact Menu Button & Theme Toggle */}
          <div className="flex items-center justify-start gap-1.5">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Alternar menu mobile"
              aria-expanded={mobileMenuOpen}
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl text-white/90 hover:text-white bg-[#0A0A0A] border border-white/10 flex items-center justify-center cursor-pointer active:scale-95 transition-transform"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <button
              type="button"
              onClick={onToggleTheme}
              title={theme === 'dark' ? 'Modo Claro' : 'Modo Escuro'}
              aria-label="Alternar tema claro e escuro"
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl text-white/80 hover:text-white bg-[#0A0A0A] border border-white/10 flex items-center justify-center cursor-pointer active:scale-95 transition-transform"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-indigo-500" />
              )}
            </button>
          </div>

          {/* Center: H7.VOX Logo perfectly centered with compact 3D Orbital Ring */}
          <a
            href="#inicio"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center justify-center shrink-0 mx-auto"
            title="H7.VOX Audiovisual"
          >
            <LogoOrbit3D size="sm">
              <div className="h7-logo-badge p-0.5 flex items-center justify-center">
                <img
                  src="/assets/logo_web.png"
                  alt="H7.VOX"
                  className="h7-logo-img h-9 sm:h-11 w-auto object-contain filter drop-shadow-[0_0_12px_rgba(8,204,7,0.28)]"
                />
              </div>
            </LogoOrbit3D>
          </a>

          {/* Right: Direct WhatsApp Button */}
          <div className="flex items-center justify-end">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              title="Conversar no WhatsApp"
              aria-label="Conversar no WhatsApp"
              className="h-10 sm:h-11 px-3 sm:px-3.5 rounded-xl bg-[#08CC07] text-[#050505] font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-[#08CC07]/20 active:scale-95 transition-transform"
            >
              <MessageCircle className="w-4 h-4 fill-current shrink-0" />
              <span className="hidden sm:inline text-xs font-bold">WhatsApp</span>
            </a>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0A0A0A]/98 border-b border-white/10 px-5 sm:px-6 py-6 space-y-5 backdrop-blur-2xl max-h-[calc(100dvh-4.5rem)] overflow-y-auto">
          <div className="pb-4 border-b border-white/10 flex items-center justify-between gap-2">
            <div className="flex items-center gap-3">
              <div className="h7-logo-badge p-1 flex items-center justify-center">
                <img src="/assets/logo_web.png" alt="H7.VOX" className="h7-logo-img h-8 w-auto object-contain" />
              </div>
              <div>
                <span className="text-xs font-bold text-white block">H7.VOX</span>
                <span className="text-[10px] text-[#08CC07] font-mono block">AUDIOVISUAL</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Quick theme button inside drawer */}
              <button
                type="button"
                onClick={onToggleTheme}
                className="px-3 py-2 rounded-xl border border-white/10 text-xs font-medium text-white/80 bg-white/5 flex items-center gap-1.5"
              >
                {theme === 'dark' ? (
                  <>
                    <Sun className="w-3.5 h-3.5 text-amber-300" />
                    <span>Claro</span>
                  </>
                ) : (
                  <>
                    <Moon className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Escuro</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <nav className="flex flex-col space-y-1.5">
            {allMobileLinks.map((link) => {
              const isMobileActive = activeMobileHref === link.href;
              return (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => {
                    setActiveMobileHref(link.href);
                    setActiveDesktopHref(link.href);
                    setMobileMenuOpen(false);
                  }}
                  className={`py-3 px-3.5 rounded-xl text-sm font-semibold transition-colors flex items-center justify-between ${
                    isMobileActive
                      ? 'bg-[#08CC07]/10 text-[#08CC07] border border-[#08CC07]/20 font-bold'
                      : 'text-white/85 hover:text-[#08CC07] hover:bg-white/5'
                  }`}
                >
                  <span>{link.label}</span>
                  {link.badge && (
                    <span className="text-[10px] font-mono uppercase bg-[#08CC07] text-[#050505] px-2 py-0.5 rounded font-bold">
                      {link.badge}
                    </span>
                  )}
                </a>
              );
            })}
          </nav>

          <div className="pt-4 border-t border-white/10 space-y-3">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-3.5 px-4 rounded-xl bg-[#08CC07] text-[#050505] font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#08CC07]/20"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>Falar no WhatsApp com Endson</span>
            </a>

            <div className="flex items-center justify-between text-xs text-white/50 pt-2 font-mono">
              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#08CC07] flex items-center gap-1.5"
              >
                <Instagram className="w-3.5 h-3.5 text-[#08CC07]" />
                <span>@h7.vox</span>
              </a>
              <span>{settings.location || 'Pernambuco, BR'}</span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
