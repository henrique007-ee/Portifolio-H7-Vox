import React, { useState, useEffect, useCallback } from 'react';
import { api } from './services/api';
import type {
  Project,
  CategoryItem,
  ServiceItem,
  Testimonial,
  Brand,
  BackstageItem,
  SiteSettings,
} from './types';

import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { MetricsBar } from './components/MetricsBar';
import { Brands } from './components/Brands';
import { HudSectionDivider } from './components/HudSectionDivider';
import { FeaturedWorks } from './components/FeaturedWorks';
import { Portfolio } from './components/Portfolio';
import { WorkInMotion } from './components/WorkInMotion';
import { MidCallout } from './components/MidCallout';
import { Services } from './components/Services';
import { WorkProcess } from './components/WorkProcess';
import { AboutMe } from './components/AboutMe';
import { Testimonials } from './components/Testimonials';
import { BudgetSimulator } from './components/BudgetSimulator';
import { FAQSection } from './components/FAQSection';
import { ContactSection } from './components/ContactSection';
import { FinalCTA } from './components/FinalCTA';
import { Footer } from './components/Footer';
import { ProjectModal } from './components/ProjectModal';
import { AdminModal } from './components/AdminModal';

export default function App() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [backstage, setBackstage] = useState<BackstageItem[]>([]);

  // Theme Management (Default: Cinematic Dark #050505)
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    const stored = localStorage.getItem('h7_theme');
    if (stored === 'light') {
      setTheme('light');
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    } else {
      setTheme('dark');
      document.documentElement.classList.remove('light');
      document.documentElement.classList.add('dark');
      localStorage.setItem('h7_theme', 'dark');
    }
  }, []);

  const handleToggleTheme = () => {
    setTheme((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark';
      if (next === 'light') {
        document.documentElement.classList.add('light');
        document.documentElement.classList.remove('dark');
      } else {
        document.documentElement.classList.remove('light');
        document.documentElement.classList.add('dark');
      }
      localStorage.setItem('h7_theme', next);
      return next;
    });
  };

  const [isLoading, setIsLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  const loadData = useCallback(async () => {
    try {
      const isAuth = await api.verifyAuth();
      setIsAdminLoggedIn(isAuth);

      const [sData, pData, cData, srvData, tData, bData, bkData] = await Promise.all([
        api.getSettings(),
        api.getProjects(isAuth),
        api.getCategories(isAuth).catch(() => []),
        api.getServices(),
        api.getTestimonials(),
        api.getBrands(),
        api.getBackstage(),
      ]);

      setSettings({
        ...sData,
        email: !sData.email || sData.email === 'contato@h7vox.com.br'
          ? 'endsonhenrique13@gmail.com'
          : sData.email,
      });
      setProjects(pData);
      setCategories(cData);
      setServices(srvData);
      setTestimonials(tData);
      setBrands(bData);
      setBackstage(bkData);
    } catch (err) {
      console.error('Erro ao carregar dados:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Loading Screen with Official Transparent H7.VOX Logo
  if (isLoading || !settings) {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-6 text-center select-none">
        <div className="relative mb-6 flex flex-col items-center">
          <div className="w-32 sm:w-36 h-auto p-2 mb-5 relative group">
            <img
              src="/assets/logo_web.png"
              alt="H7.VOX - Editor de Vídeo, Filmmaker e Storymaker"
              className="h7-logo-img w-full h-auto object-contain filter drop-shadow-[0_0_18px_rgba(8,204,7,0.3)]"
            />
          </div>
          <div className="w-8 h-8 rounded-full border-2 border-[#08CC07]/20 border-t-[#08CC07] animate-spin" />
        </div>
        <span className="text-xs text-[#858585] font-mono tracking-wider">
          Carregando experiência audiovisual de Endson Henrique...
        </span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-[#FFFFFF] selection:bg-[#08CC07] selection:text-[#050505] overflow-x-hidden">
      {/* Global SVG Filter: In Light Mode, maps white logo pixels to dark slate while preserving #08CC07 neon green & 100% transparency */}
      <svg width="0" height="0" className="absolute pointer-events-none" aria-hidden="true">
        <defs>
          <filter id="h7-logo-light-mode" colorInterpolationFilters="sRGB">
            <feColorMatrix
              type="matrix"
              values="
                0     0     0     0   0.04
               -1.03  1.10  0     0   0
                0.08  0     0     0   0.02
                0     0     0     1   0
              "
            />
          </filter>
        </defs>
      </svg>

      {/* Top Navigation Bar with Official Centered Logo & Theme Toggle */}
      <Navbar
        settings={settings}
        onOpenAdmin={() => setIsAdminModalOpen(true)}
        isAdminLoggedIn={isAdminLoggedIn}
        theme={theme}
        onToggleTheme={handleToggleTheme}
      />

      {/* Hero Dobra Principal: Futuristic 3D Experience */}
      <Hero settings={settings} />

      {/* Metrics Counter Bar */}
      <MetricsBar
        metrics={settings.metrics}
        showMetrics={settings.showMetrics}
      />

      {/* Brands & Partners (Infinite Loop Marquee with full original colors) */}
      <Brands
        brands={brands}
        showBrands={settings.showBrands}
      />

      {/* Technological HUD Section Transition to Portfolio (3D Soundwave + 3D Prism + Digital Smoke) */}
      <HudSectionDivider
        frameCode="FRAME 001"
        leftTag="H7.VOX SYSTEM"
        centerTag="4K DCI • 60 FPS"
        rightTag="FOCUS LOCK"
        showSoundWave={true}
        sculptureVariant="prism"
      />

      {/* Featured Projects Highlight */}
      <FeaturedWorks
        projects={projects}
        onSelectProject={(p) => setSelectedProject(p)}
      />

      {/* Main Portfolio with Category Filters */}
      <Portfolio
        projects={projects}
        categories={categories}
        onSelectProject={(p) => setSelectedProject(p)}
      />

      {/* Work in Motion (Reels & Vertical Stories) */}
      <WorkInMotion
        projects={projects}
        onSelectProject={(p) => setSelectedProject(p)}
      />

      {/* Technological HUD Section Transition */}
      <HudSectionDivider
        frameCode="FRAME 002"
        leftTag="AUDIO MONITOR"
        centerTag="REC ● LARK M2"
        rightTag="COLOR LAB"
        showSoundWave={false}
        sculptureVariant="octahedron"
      />

      {/* Mid-page hiring CTA Section */}
      <MidCallout whatsappNumber={settings.whatsappNumber} />

      {/* Services Section with Direct WhatsApp actions */}
      <Services
        services={services}
        settings={settings}
      />

      {/* Work Methodology 4 Steps */}
      <WorkProcess />

      {/* About Endson Henrique */}
      <AboutMe settings={settings} />

      {/* Client Testimonials (Infinite Loop Marquee) */}
      <Testimonials
        testimonials={testimonials}
        showTestimonials={true}
      />

      {/* Technological HUD Section Transition */}
      <HudSectionDivider
        frameCode="FRAME 003"
        leftTag="SIMULATOR ENGINE"
        centerTag="H7.VOX BRIEFING"
        rightTag="WHATSAPP DIRECT"
        showSoundWave={false}
        sculptureVariant="number7"
      />

      {/* Interactive Budget Simulator ("MONTE SEU ORÇAMENTO") */}
      <BudgetSimulator settings={settings} />

      {/* Frequently Asked Questions Accordion */}
      <FAQSection whatsappNumber={settings.whatsappNumber} />

      {/* Contact & Briefing Conversion */}
      <ContactSection
        settings={settings}
        services={services}
      />

      {/* Final Hiring Conversion CTA */}
      <FinalCTA
        whatsappNumber={settings.whatsappNumber}
        instagramUrl={settings.instagramUrl}
      />

      {/* Footer */}
      <Footer
        settings={settings}
        onOpenAdmin={() => setIsAdminModalOpen(true)}
      />

      {/* Video Lightbox Player Modal */}
      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          allProjects={projects}
          settings={settings}
          onClose={() => setSelectedProject(null)}
          onSelectProject={(p) => setSelectedProject(p)}
        />
      )}

      {/* Admin Panel Modal */}
      <AdminModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        settings={settings}
        projects={projects}
        categories={categories}
        services={services}
        testimonials={testimonials}
        brands={brands}
        backstage={backstage}
        onRefreshData={loadData}
        isAdminLoggedIn={isAdminLoggedIn}
        setIsAdminLoggedIn={setIsAdminLoggedIn}
      />
    </div>
  );
}
