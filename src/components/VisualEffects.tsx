import React, { useEffect, useRef } from 'react';

interface GreenSoundWave3DProps {
  className?: string;
  barCount?: number;
  compact?: boolean;
}

/**
 * Pure, borderless 3D Green Soundwave (#08CC07) floating directly in the background space.
 * Zero borders, zero boxes, zero technical labels.
 */
export const GreenSoundWave3D: React.FC<GreenSoundWave3DProps> = ({
  className = '',
  barCount = 48,
  compact = false,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let isVisible = true;
    let animId = 0;

    const checkMediaPlaying = () => {
      const mediaElements = document.querySelectorAll<HTMLMediaElement>('video, audio');
      let active = false;
      mediaElements.forEach((el) => {
        if (!el.paused && !el.ended && el.readyState > 2 && !el.muted) {
          active = true;
        }
      });
      return active;
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
      },
      { threshold: 0.05 }
    );
    observer.observe(canvas);

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      canvas.width = Math.max(rect.width * dpr, 240);
      canvas.height = Math.max(rect.height * dpr, 48);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener('resize', resize);

    let phase = 0;

    const render = () => {
      animId = requestAnimationFrame(render);
      if (!isVisible) return;

      const rect = canvas.getBoundingClientRect();
      const width = rect.width || 300;
      const height = rect.height || (compact ? 48 : 76);
      const centerY = height / 2;

      ctx.clearRect(0, 0, width, height);

      const isLightMode = document.documentElement.classList.contains('light');
      const activeSound = checkMediaPlaying();
      const speed = activeSound ? 0.085 : 0.032;
      if (!prefersReducedMotion) {
        phase += speed;
      }

      // 1. Primary 3D Harmonic Sine Ribbon
      ctx.beginPath();
      for (let x = 0; x <= width; x += 6) {
        const normX = x / width;
        const envelope = Math.sin(normX * Math.PI);
        const yOffset =
          Math.sin(normX * 14 - phase * 1.3) *
          Math.cos(normX * 7 + phase * 0.8) *
          (height * 0.36) *
          envelope;
        const y = centerY + yOffset * 0.68;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = isLightMode ? 'rgba(6, 168, 6, 0.45)' : 'rgba(8, 204, 7, 0.36)';
      ctx.lineWidth = 1.6;
      ctx.stroke();

      // 2. Secondary Counter-Phase Harmonic Wave
      ctx.beginPath();
      for (let x = 0; x <= width; x += 6) {
        const normX = x / width;
        const envelope = Math.sin(normX * Math.PI);
        const yOffset =
          Math.cos(normX * 10 + phase * 1.1) *
          Math.sin(normX * 5 - phase * 0.6) *
          (height * 0.3) *
          envelope;
        const y = centerY + yOffset;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = isLightMode ? 'rgba(6, 168, 6, 0.28)' : 'rgba(8, 204, 7, 0.22)';
      ctx.lineWidth = 1.2;
      ctx.stroke();

      // 3. Clean Luminous Vertical Frequency Bars
      const isMobile = width < 500;
      const effectiveBars = isMobile ? Math.min(barCount, 28) : barCount;
      const spacing = width / (effectiveBars + 1);

      for (let i = 1; i <= effectiveBars; i++) {
        const norm = i / (effectiveBars + 1);
        const windowEnv = Math.sin(norm * Math.PI);

        const waveA = Math.sin(i * 0.45 + phase * 1.8);
        const waveB = Math.cos(i * 0.27 - phase * 1.2);
        const waveC = activeSound ? Math.sin(i * 1.3 + phase * 3.4) * 0.45 : 0;

        const rawAmp = Math.abs(waveA * 0.55 + waveB * 0.45 + waveC) * windowEnv;
        const barHeight = Math.max(4, rawAmp * (height * (activeSound ? 0.88 : 0.72)));

        const x = i * spacing;
        const topY = centerY - barHeight / 2;

        const grad = ctx.createLinearGradient(x, topY, x, topY + barHeight);
        if (isLightMode) {
          grad.addColorStop(0, 'rgba(6, 168, 6, 0.28)');
          grad.addColorStop(0.5, 'rgba(7, 185, 7, 0.95)');
          grad.addColorStop(1, 'rgba(6, 168, 6, 0.28)');
        } else {
          grad.addColorStop(0, 'rgba(8, 204, 7, 0.22)');
          grad.addColorStop(0.5, 'rgba(8, 204, 7, 0.92)');
          grad.addColorStop(1, 'rgba(8, 204, 7, 0.22)');
        }

        ctx.fillStyle = grad;
        ctx.fillRect(x - 1, topY, 2.2, barHeight);

        if (i % 4 === 0) {
          ctx.fillStyle = isLightMode ? 'rgba(15, 23, 42, 0.78)' : 'rgba(255, 255, 255, 0.8)';
          ctx.fillRect(x - 1, topY - 2, 2.2, 1.8);
        }
      }
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      observer.disconnect();
      window.removeEventListener('resize', resize);
    };
  }, [barCount, compact]);

  return (
    <div
      className={`relative select-none pointer-events-none ${className}`}
      style={{ perspective: '700px' }}
      aria-hidden="true"
    >
      <div className="relative w-full overflow-hidden" style={{ transform: 'rotateX(14deg)' }}>
        <canvas
          ref={canvasRef}
          className={`w-full block ${compact ? 'h-10 sm:h-14' : 'h-16 sm:h-24'}`}
        />
      </div>
    </div>
  );
};

interface DigitalSmokeLayerProps {
  intensity?: 'subtle' | 'medium';
  className?: string;
}

/**
 * Digital Smoke (Fumaça Digital) & Floating Green Particles & Luminous Lines.
 * Strictly pointer-events-none background atmosphere.
 */
export const DigitalSmokeLayer: React.FC<DigitalSmokeLayerProps> = ({
  intensity = 'subtle',
  className = '',
}) => {
  const opacityClass =
    intensity === 'medium' ? 'opacity-70 sm:opacity-85' : 'opacity-55 sm:opacity-75';

  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden z-0 select-none ${opacityClass} ${className}`}
      aria-hidden="true"
    >
      {/* Plume 1: Slow Drifting Dark-Green Illuminated Volumetric Mist */}
      <div
        className="digital-smoke-plume-1 absolute -top-24 -left-24 w-[320px] sm:w-[560px] h-[320px] sm:h-[560px] rounded-full"
        style={{
          background:
            'radial-gradient(circle, rgba(8,204,7,0.095) 0%, rgba(10,18,10,0.42) 45%, rgba(5,5,5,0) 72%)',
          filter: 'blur(55px)',
        }}
      />

      {/* Plume 2: Counter-Drifting Deep Cinema Fog */}
      <div
        className="digital-smoke-plume-2 absolute -bottom-28 -right-20 w-[300px] sm:w-[540px] h-[300px] sm:h-[540px] rounded-full"
        style={{
          background:
            'radial-gradient(circle, rgba(8,204,7,0.08) 0%, rgba(12,16,12,0.45) 48%, rgba(5,5,5,0) 74%)',
          filter: 'blur(65px)',
        }}
      />

      {/* Plume 3: Mid-Section Horizontal Atmospheric Vapor */}
      <div
        className="digital-smoke-plume-3 hidden sm:block absolute top-1/3 left-1/4 w-[640px] h-[240px] rounded-full"
        style={{
          background:
            'radial-gradient(ellipse, rgba(8,204,7,0.06) 0%, rgba(8,10,8,0.32) 52%, rgba(5,5,5,0) 78%)',
          filter: 'blur(50px)',
        }}
      />

      {/* Subtle Floating Green Digital Particles & Luminous Micro Lines */}
      <div className="absolute inset-0">
        <span className="digital-particle absolute top-[16%] left-[8%] w-1.5 h-1.5 rounded-full bg-[#08CC07]/55 shadow-[0_0_10px_#08CC07]" />
        <span className="digital-particle-slow absolute top-[72%] left-[12%] w-1.5 h-1.5 rounded-full bg-[#08CC07]/35 shadow-[0_0_10px_#08CC07]" />
        <span className="digital-particle absolute top-[24%] right-[9%] w-1.5 h-1.5 rounded-full bg-[#08CC07]/50 shadow-[0_0_10px_#08CC07]" />
        <span className="digital-particle-slow hidden sm:block absolute bottom-[18%] right-[14%] w-1.5 h-1.5 rounded-full bg-[#08CC07]/40 shadow-[0_0_12px_#08CC07]" />
        <span className="hidden lg:block absolute top-[42%] left-[4%] w-16 h-px bg-gradient-to-r from-transparent via-[#08CC07]/35 to-transparent rotate-[-28deg]" />
        <span className="hidden lg:block absolute bottom-[32%] right-[4%] w-20 h-px bg-gradient-to-r from-transparent via-[#08CC07]/35 to-transparent rotate-[24deg]" />
      </div>
    </div>
  );
};

export type SculptureVariant =
  | 'number7'
  | 'letterH'
  | 'wireframeSphere'
  | 'prism'
  | 'octahedron'
  | 'orbitalRing';

interface BrandSculpture3DProps {
  variant: SculptureVariant;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

/**
 * Pure 3D Geometric & Exclusive H7.VOX Background Sculptures (Zero boxes, zero labels):
 * - 'number7': 3D Number 7 with metallic bevels and #08CC07 neon reflections
 * - 'letterH': Geometric 3D Letter H constructed with solid 3D blocks and green accents
 * - 'wireframeSphere': 3D sphere of green latitude/longitude wireframe lines rotating on its axis
 * - 'prism': 3D triangular prism with dark metallic faces and green reflections
 * - 'octahedron': Dual-pyramid 3D octahedron with metallic/luminous green structure
 * - 'orbitalRing': 3D circular ring with orbiting triangles
 */
export const BrandSculpture3D: React.FC<BrandSculpture3DProps> = ({
  variant,
  size = 'md',
  className = '',
}) => {
  const sizeClasses =
    size === 'lg'
      ? 'w-32 h-32 sm:w-44 sm:h-44'
      : size === 'sm'
      ? 'w-16 h-16 sm:w-22 sm:h-22'
      : 'w-24 h-24 sm:w-32 sm:h-32';

  return (
    <div
      className={`pointer-events-none select-none relative flex items-center justify-center ${sizeClasses} ${className}`}
      style={{ perspective: '800px', transformStyle: 'preserve-3d' }}
      aria-hidden="true"
    >
      {variant === 'number7' && (
        <div className="sculpture-float-7 relative w-full h-full flex items-center justify-center">
          <svg viewBox="0 0 120 140" className="w-full h-full overflow-visible">
            <defs>
              <linearGradient id="metalDark7" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#23272E" />
                <stop offset="50%" stopColor="#0E1115" />
                <stop offset="100%" stopColor="#08CC07" stopOpacity="0.45" />
              </linearGradient>
              <linearGradient id="sideExtrude7" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#08CC07" stopOpacity="0.55" />
                <stop offset="100%" stopColor="#0A1E0A" />
              </linearGradient>
            </defs>

            <polygon
              points="26,22 102,22 108,28 32,28"
              fill="url(#sideExtrude7)"
              stroke="#08CC07"
              strokeOpacity="0.4"
              strokeWidth="0.8"
            />
            <polygon
              points="102,22 58,122 66,125 108,28"
              fill="url(#sideExtrude7)"
              stroke="#08CC07"
              strokeOpacity="0.5"
              strokeWidth="0.9"
            />
            <polygon
              points="20,16 98,16 98,38 56,122 34,122 72,38 20,38"
              fill="url(#metalDark7)"
              stroke="#08CC07"
              strokeWidth="1.4"
            />
            <line x1="28" y1="26" x2="88" y2="26" stroke="#08CC07" strokeOpacity="0.65" strokeWidth="1.1" />
            <line x1="84" y1="34" x2="48" y2="112" stroke="#08CC07" strokeOpacity="0.4" strokeWidth="1" strokeDasharray="6 4" />
            <polygon points="12,68 20,60 22,72" fill="#0F1410" stroke="#08CC07" strokeWidth="1.1" />
            <circle cx="96" cy="18" r="2.2" fill="#08CC07" />
          </svg>
        </div>
      )}

      {variant === 'letterH' && (
        <div className="sculpture-float-h relative w-full h-full flex items-center justify-center">
          <svg viewBox="0 0 130 140" className="w-full h-full overflow-visible">
            <defs>
              <linearGradient id="blockMetalH" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#22262C" />
                <stop offset="55%" stopColor="#0E1014" />
                <stop offset="100%" stopColor="#142914" />
              </linearGradient>
              <linearGradient id="blockSideH" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#08CC07" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#0B190B" />
              </linearGradient>
            </defs>

            <polygon points="44,18 52,12 52,116 44,124" fill="url(#blockSideH)" stroke="#08CC07" strokeOpacity="0.4" strokeWidth="0.8" />
            <polygon points="20,18 28,12 52,12 44,18" fill="#182B18" stroke="#08CC07" strokeOpacity="0.45" strokeWidth="0.8" />
            <rect x="20" y="18" width="24" height="106" fill="url(#blockMetalH)" stroke="#08CC07" strokeWidth="1.3" />

            <polygon points="48,58 84,58 90,52 54,52" fill="#183018" stroke="#08CC07" strokeOpacity="0.55" strokeWidth="0.9" />
            <rect x="48" y="58" width="36" height="22" fill="url(#blockMetalH)" stroke="#08CC07" strokeWidth="1.3" />
            <line x1="54" y1="69" x2="78" y2="69" stroke="#08CC07" strokeWidth="1.4" />

            <polygon points="108,18 116,12 116,62 108,68" fill="url(#blockSideH)" stroke="#08CC07" strokeOpacity="0.4" strokeWidth="0.8" />
            <rect x="84" y="18" width="24" height="50" fill="url(#blockMetalH)" stroke="#08CC07" strokeWidth="1.3" />

            <polygon points="108,74 116,68 116,116 108,124" fill="url(#blockSideH)" stroke="#08CC07" strokeOpacity="0.4" strokeWidth="0.8" />
            <rect x="84" y="74" width="24" height="50" fill="url(#blockMetalH)" stroke="#08CC07" strokeWidth="1.3" />

            <circle cx="26" cy="26" r="2" fill="#08CC07" />
            <circle cx="96" cy="114" r="2" fill="#08CC07" />
          </svg>
        </div>
      )}

      {variant === 'wireframeSphere' && (
        <div className="sculpture-spin-slow relative w-full h-full flex items-center justify-center">
          <svg viewBox="0 0 120 120" className="w-full h-full overflow-visible">
            <circle cx="60" cy="60" r="46" fill="rgba(8, 204, 7, 0.06)" stroke="#08CC07" strokeOpacity="0.72" strokeWidth="1.5" />
            <ellipse cx="60" cy="60" rx="46" ry="18" fill="none" stroke="#08CC07" strokeOpacity="0.55" strokeWidth="1.2" />
            <ellipse cx="60" cy="60" rx="46" ry="34" fill="none" stroke="#08CC07" strokeOpacity="0.42" strokeWidth="1.1" strokeDasharray="4 3" />
            <ellipse cx="60" cy="60" rx="18" ry="46" fill="none" stroke="#08CC07" strokeOpacity="0.55" strokeWidth="1.2" />
            <ellipse cx="60" cy="60" rx="34" ry="46" fill="none" stroke="#08CC07" strokeOpacity="0.42" strokeWidth="1.1" />
            <line x1="14" y1="60" x2="106" y2="60" stroke="#08CC07" strokeOpacity="0.45" strokeWidth="1" />
            <line x1="60" y1="14" x2="60" y2="106" stroke="#08CC07" strokeOpacity="0.45" strokeWidth="1" />
            <circle cx="60" cy="60" r="3.2" fill="#08CC07" />
          </svg>
        </div>
      )}

      {variant === 'prism' && (
        <div className="sculpture-float-prism relative w-full h-full flex items-center justify-center">
          <svg viewBox="0 0 120 120" className="w-full h-full overflow-visible">
            <defs>
              <linearGradient id="prismLeft" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#1B1E24" />
                <stop offset="100%" stopColor="#0B0D10" />
              </linearGradient>
              <linearGradient id="prismRight" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#112A12" />
                <stop offset="60%" stopColor="#0C100C" />
                <stop offset="100%" stopColor="#08CC07" stopOpacity="0.42" />
              </linearGradient>
            </defs>
            <polygon
              points="60,14 18,92 60,106"
              fill="url(#prismLeft)"
              stroke="#08CC07"
              strokeOpacity="0.6"
              strokeWidth="1.2"
            />
            <polygon
              points="60,14 102,92 60,106"
              fill="url(#prismRight)"
              stroke="#08CC07"
              strokeWidth="1.2"
            />
            <line x1="60" y1="14" x2="60" y2="106" stroke="#08CC07" strokeWidth="1.3" />
            <circle cx="60" cy="14" r="2.2" fill="#08CC07" />
          </svg>
        </div>
      )}

      {variant === 'octahedron' && (
        <div className="sculpture-float-octa relative w-full h-full flex items-center justify-center">
          <svg viewBox="0 0 120 130" className="w-full h-full overflow-visible">
            <defs>
              <linearGradient id="octaTopL" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#232830" />
                <stop offset="100%" stopColor="#0C0E12" />
              </linearGradient>
              <linearGradient id="octaTopR" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#112F12" />
                <stop offset="100%" stopColor="#08CC07" stopOpacity="0.45" />
              </linearGradient>
              <linearGradient id="octaBotL" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#0E1014" />
                <stop offset="100%" stopColor="#07080A" />
              </linearGradient>
              <linearGradient id="octaBotR" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#0B1F0B" />
                <stop offset="100%" stopColor="#080A08" />
              </linearGradient>
            </defs>

            <polygon points="60,10 18,65 60,76" fill="url(#octaTopL)" stroke="#08CC07" strokeWidth="1.2" />
            <polygon points="60,10 102,65 60,76" fill="url(#octaTopR)" stroke="#08CC07" strokeWidth="1.2" />
            <polygon points="18,65 60,120 60,76" fill="url(#octaBotL)" stroke="#08CC07" strokeOpacity="0.7" strokeWidth="1.1" />
            <polygon points="102,65 60,120 60,76" fill="url(#octaBotR)" stroke="#08CC07" strokeOpacity="0.85" strokeWidth="1.1" />

            <circle cx="60" cy="10" r="2.2" fill="#08CC07" />
            <circle cx="60" cy="120" r="2.2" fill="#08CC07" />
            <circle cx="18" cy="65" r="2" fill="#08CC07" />
            <circle cx="102" cy="65" r="2" fill="#08CC07" />
          </svg>
        </div>
      )}

      {variant === 'orbitalRing' && (
        <div className="sculpture-spin-reverse relative w-full h-full flex items-center justify-center">
          <svg viewBox="0 0 120 120" className="w-full h-full overflow-visible">
            <ellipse
              cx="60"
              cy="60"
              rx="50"
              ry="22"
              fill="none"
              stroke="#08CC07"
              strokeOpacity="0.6"
              strokeWidth="1.4"
              transform="rotate(-24 60 60)"
            />
            <ellipse
              cx="60"
              cy="60"
              rx="42"
              ry="16"
              fill="none"
              stroke="#08CC07"
              strokeOpacity="0.28"
              strokeWidth="1"
              strokeDasharray="6 4"
              transform="rotate(32 60 60)"
            />
            <polygon points="16,42 24,34 26,46" fill="#0F1410" stroke="#08CC07" strokeWidth="1.2" />
            <polygon points="94,76 104,68 100,82" fill="#08CC07" fillOpacity="0.3" stroke="#08CC07" strokeWidth="1.2" />
            <circle cx="60" cy="60" r="3.5" fill="#08CC07" />
          </svg>
        </div>
      )}
    </div>
  );
};

interface SectionAmbient3DBackgroundProps {
  leftSculpture?: SculptureVariant;
  rightSculpture?: SculptureVariant;
  showSoundWave?: boolean;
  smokeIntensity?: 'subtle' | 'medium';
}

/**
 * Reusable Full-Section Ambient 3D Background Layer (z-0, pointer-events-none).
 * Distributes 3D sculptures, subtle green soundwaves, digital smoke, and particles
 * at different depths and edge positions behind any section's content.
 */
export const SectionAmbient3DBackground: React.FC<SectionAmbient3DBackgroundProps> = ({
  leftSculpture = 'prism',
  rightSculpture = 'orbitalRing',
  showSoundWave = false,
  smokeIntensity = 'subtle',
}) => {
  return (
    <div
      className="pointer-events-none select-none absolute inset-0 overflow-hidden z-0"
      aria-hidden="true"
    >
      <DigitalSmokeLayer intensity={smokeIntensity} />

      {/* Left Edge Floating 3D Sculpture (Partially entering from edge) */}
      <div className="ambient-3d-sculpture absolute -left-4 sm:left-4 lg:left-10 top-12 sm:top-16 opacity-65 sm:opacity-80 lg:opacity-90">
        <BrandSculpture3D variant={leftSculpture} size="lg" />
      </div>

      {/* Right Edge Floating 3D Sculpture (Deeper perspective plane) */}
      <div className="ambient-3d-sculpture absolute -right-4 sm:right-4 lg:right-12 bottom-12 sm:bottom-16 opacity-65 sm:opacity-80 lg:opacity-90">
        <BrandSculpture3D variant={rightSculpture} size="md" />
      </div>

      {/* Optional Background 3D Green Soundwave */}
      {showSoundWave && (
        <div className="ambient-3d-soundwave absolute left-1/2 -translate-x-1/2 bottom-6 w-full max-w-4xl px-6 opacity-55 sm:opacity-75">
          <GreenSoundWave3D compact barCount={44} />
        </div>
      )}
    </div>
  );
};
