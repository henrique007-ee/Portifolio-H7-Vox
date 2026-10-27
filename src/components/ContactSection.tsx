import React, { useState } from 'react';
import { MessageCircle, Film, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { api, buildWhatsAppLink } from '../services/api';
import { Section3DShowcase } from './Section3DShowcase';
import { SectionAmbient3DBackground } from './VisualEffects';
import type { SiteSettings, ServiceItem } from '../types';

interface ContactSectionProps {
  settings: SiteSettings;
  services: ServiceItem[];
}

export const ContactSection: React.FC<ContactSectionProps> = ({ settings, services }) => {
  const [formData, setFormData] = useState({
    name: '',
    companyOrProject: '',
    service: 'Edição de Vídeo',
    estimatedDate: '',
    description: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const directWhatsappUrl = buildWhatsAppLink(
    settings.whatsappNumber,
    settings.defaultWhatsappMessage || 'Olá, Endson! Conheci seu portfólio H7.VOX e gostaria de conversar sobre um projeto audiovisual.'
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.description.trim()) {
      setErrorMessage('Por favor, preencha seu nome e descreva a sua ideia ou necessidade.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      // 1. Save lead to backend database so Endson never loses it
      await api.submitBriefingLead(formData);

      // 2. Prepare WhatsApp message with all briefing details
      const briefingMessage = `*Olá, Endson! Novo briefing enviado pelo site H7.VOX:*\n\n` +
        `👤 *Nome:* ${formData.name}\n` +
        `🏢 *Projeto/Empresa:* ${formData.companyOrProject || 'Não informado'}\n` +
        `🎬 *Serviço desejado:* ${formData.service}\n` +
        `📅 *Data prevista:* ${formData.estimatedDate || 'A definir'}\n` +
        `📝 *Detalhes:* ${formData.description}`;

      const whatsappRedirectUrl = buildWhatsAppLink(settings.whatsappNumber, briefingMessage);

      setSubmitSuccess(true);
      setIsSubmitting(false);

      // Open WhatsApp with prefilled briefing
      window.open(whatsappRedirectUrl, '_blank', 'noopener,noreferrer');
    } catch (err: any) {
      setIsSubmitting(false);
      setErrorMessage(err.message || 'Ocorreu um erro ao processar seu briefing. Você também pode clicar no botão direto do WhatsApp.');
    }
  };

  return (
    <section id="contato" className="py-24 sm:py-32 bg-[#050505] relative border-b border-white/10 overflow-hidden">
      <SectionAmbient3DBackground
        leftSculpture="orbitalRing"
        rightSculpture="number7"
        showSoundWave={true}
        smokeIntensity="subtle"
      />
      <Section3DShowcase preset="services" className="opacity-35 sm:opacity-55" />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Headline and Direct WhatsApp */}
          <div className="lg:col-span-5 space-y-6">
            <div className="text-xs font-mono tracking-widest text-[#08CC07] uppercase">
              VAMOS CONVERSAR
            </div>

            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight font-display leading-[1.1]">
              Tem uma ideia? Vamos dar voz a ela.
            </h2>

            <p className="text-base sm:text-lg text-[#B3B3B3] leading-relaxed">
              Se você precisa de vídeos que comuniquem, de cobertura para seu evento ou de alguém para registrar e transformar suas ideias em conteúdo, vamos conversar.
            </p>

            <div className="pt-4 space-y-4">
              <a
                href={directWhatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-[#08CC07] text-[#050505] font-bold text-base hover:bg-[#0ae309] transition-all transform active:scale-95 shadow-xl shadow-[#08CC07]/25"
              >
                <MessageCircle className="w-5 h-5 fill-current" />
                <span>Chamar no WhatsApp (81) 98547-6681</span>
              </a>

              <div>
                <a
                  href="#portfolio"
                  className="inline-flex items-center gap-2 text-sm text-[#B3B3B3] hover:text-white transition-colors"
                >
                  <Film className="w-4 h-4" />
                  <span>Ou explore mais trabalhos no portfólio</span>
                </a>
              </div>
            </div>

            {/* Direct Info */}
            <div className="pt-8 border-t border-white/10 space-y-2 text-xs font-mono text-[#B3B3B3]">
              <p>📍 {settings.location || 'Pernambuco, Brasil'}</p>
              <p>
                📸 Instagram Oficial:{' '}
                <a
                  href={settings.instagramUrl || 'https://www.instagram.com/h7.vox/'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#08CC07] hover:underline"
                >
                  @h7.vox
                </a>
              </p>
              <p>📱 WhatsApp Oficial: (81) 98547-6681</p>
              <p>✉️ E-mail: {settings.email && settings.email !== 'contato@h7vox.com.br' ? settings.email : 'endsonhenrique13@gmail.com'}</p>
            </div>
          </div>

          {/* Right Column: Interactive Briefing Form */}
          <div className="lg:col-span-7 bg-[#0A0A0A] rounded-2xl border border-white/10 p-6 sm:p-10 shadow-2xl relative">
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 font-display">
              Envie os detalhes do seu projeto
            </h3>
            <p className="text-xs sm:text-sm text-[#B3B3B3] mb-8">
              Preencha o formulário rápido abaixo. Os dados são salvos com segurança e você é direcionado diretamente ao WhatsApp para conversarmos.
            </p>

            {submitSuccess ? (
              <div className="p-6 rounded-xl bg-[#08CC07]/10 border border-[#08CC07]/30 text-center space-y-4">
                <CheckCircle2 className="w-12 h-12 text-[#08CC07] mx-auto" />
                <h4 className="text-lg font-bold text-white">Briefing Enviado com Sucesso!</h4>
                <p className="text-xs sm:text-sm text-white/70">
                  Seu briefing foi registrado no sistema e encaminhado para o WhatsApp da H7.VOX. Entraremos em contato rapidamente.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSubmitSuccess(false);
                    setFormData({
                      name: '',
                      companyOrProject: '',
                      service: 'Edição de Vídeo',
                      estimatedDate: '',
                      description: '',
                    });
                  }}
                  className="px-6 py-2.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold text-white transition-colors"
                >
                  Enviar outra mensagem
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {errorMessage && (
                  <div className="flex items-center gap-2 p-3.5 rounded-lg bg-red-500/10 border border-red-500/30 text-xs text-red-400">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-mono text-white/70 uppercase tracking-wider mb-2">
                      Seu Nome *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Carlos Eduardo"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-[#181818] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#08CC07] transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-white/70 uppercase tracking-wider mb-2">
                      Empresa, Artista ou Projeto
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: Festival Sons ou Marca X"
                      value={formData.companyOrProject}
                      onChange={(e) => setFormData({ ...formData, companyOrProject: e.target.value })}
                      className="w-full bg-[#181818] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#08CC07] transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-mono text-white/70 uppercase tracking-wider mb-2">
                      Serviço Desejado
                    </label>
                    <select
                      value={formData.service}
                      onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                      className="w-full bg-[#181818] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#08CC07] transition-colors"
                    >
                      <option value="Edição de Vídeo">Edição de Vídeo</option>
                      <option value="Storymaker para Eventos">Storymaker para Eventos</option>
                      <option value="Filmmaker / Captação">Filmmaker / Captação</option>
                      <option value="Fotografia Profissional">Fotografia Profissional</option>
                      <option value="Comunicação Política">Comunicação Política</option>
                      <option value="Outro / Projeto Especial">Outro / Projeto Especial</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-white/70 uppercase tracking-wider mb-2">
                      Data Prevista / Prazo
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: Próximo mês ou Urgente"
                      value={formData.estimatedDate}
                      onChange={(e) => setFormData({ ...formData, estimatedDate: e.target.value })}
                      className="w-full bg-[#181818] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#08CC07] transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-white/70 uppercase tracking-wider mb-2">
                    Descrição da Necessidade / Ideia *
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Conte um pouco sobre o formato do vídeo, objetivo, referências ou como podemos somar ao seu projeto..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full bg-[#181818] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#08CC07] transition-colors resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 rounded-xl bg-[#08CC07] hover:bg-[#0ae309] text-[#080808] font-bold text-sm sm:text-base flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#08CC07]/20 disabled:opacity-50"
                >
                  <Send className="w-4 h-4 fill-current" />
                  <span>{isSubmitting ? 'Enviando briefing...' : 'Enviar Briefing e Iniciar no WhatsApp'}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
