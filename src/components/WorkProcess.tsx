import React from 'react';
import { SectionAmbient3DBackground } from './VisualEffects';

const PROCESS_STEPS = [
  {
    step: '01',
    title: 'Conversa inicial',
    description:
      'Entendimento da necessidade, do objetivo, da audiência-alvo e do formato ideal para o projeto.',
  },
  {
    step: '02',
    title: 'Alinhamento',
    description:
      'Definição da proposta, referências visuais de ritmo e cor, roteiro ou cronograma de gravação.',
  },
  {
    step: '03',
    title: 'Produção',
    description:
      'Captação presencial com equipamento profissional, edição dinâmica, color grading e sound design.',
  },
  {
    step: '04',
    title: 'Entrega',
    description:
      'Finalização pontual, ajustes finos e disponibilização dos arquivos finais prontos para publicação.',
  },
];

export const WorkProcess: React.FC = () => {
  return (
    <section className="py-24 sm:py-32 bg-[#050505] border-b border-white/10 relative overflow-hidden">
      {/* Floating 3D Sculptures & Digital Smoke in Background */}
      <SectionAmbient3DBackground
        leftSculpture="prism"
        rightSculpture="octahedron"
        showSoundWave={false}
        smokeIntensity="subtle"
      />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <div className="text-xs font-mono tracking-widest text-[#08CC07] uppercase mb-3">
            METODOLOGIA DE TRABALHO
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight font-display mb-4">
            Do primeiro contato à entrega.
          </h2>
          <p className="text-base text-[#B3B3B3]">
            Um processo claro e sem ruídos para garantir que a sua mensagem chegue com a força que merece.
          </p>
        </div>

        {/* Process Step Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
          {PROCESS_STEPS.map((item, idx) => (
            <div
              key={item.step}
              className="relative p-6 sm:p-8 rounded-2xl bg-[#0A0A0A] border border-white/10 hover:border-[#08CC07]/40 transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-4xl sm:text-5xl font-black font-mono text-white/20 group-hover:text-[#08CC07] transition-colors tabular-nums">
                    {item.step}
                  </span>
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-white/5 text-[#08CC07] border border-[#08CC07]/20">
                    ETAPA {item.step}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-[#08CC07] transition-colors">
                  {item.title}
                </h3>

                <p className="text-sm text-[#B3B3B3] leading-relaxed">{item.description}</p>
              </div>

              {idx < 3 && (
                <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-6 h-px bg-white/20" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
