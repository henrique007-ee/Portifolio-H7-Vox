import React from 'react';
import type { StatMetric } from '../types';

interface MetricsBarProps {
  metrics: StatMetric[];
  showMetrics: boolean;
}

export const MetricsBar: React.FC<MetricsBarProps> = ({ metrics, showMetrics }) => {
  if (!showMetrics || !metrics || metrics.length === 0) {
    return null;
  }

  return (
    <section
      aria-label="Indicadores e Resultados"
      className="relative border-y border-white/10 bg-[#050505] py-14 sm:py-20"
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8 md:divide-x md:divide-white/10">
          {metrics.map((metric, index) => (
            <div
              key={metric.label + index}
              className={`flex flex-col items-center text-center p-4 sm:p-2 rounded-2xl sm:rounded-none bg-[#0A0A0A]/80 sm:bg-transparent border border-white/5 sm:border-0 ${
                index > 0 ? 'md:pl-8' : ''
              }`}
            >
              <div className="text-2xl sm:text-4xl lg:text-5xl font-black text-white font-mono tracking-tight tabular-nums mb-1.5 flex items-baseline justify-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#08CC07] shrink-0 self-center" />
                <span>{metric.value}</span>
              </div>
              <span className="text-xs sm:text-sm font-semibold text-white/90 mb-1 leading-snug">
                {metric.label}
              </span>
              {metric.detail && (
                <span className="text-[11px] sm:text-xs text-[#B3B3B3]/70 leading-relaxed max-w-[22ch]">
                  {metric.detail}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
