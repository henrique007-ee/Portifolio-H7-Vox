import React from 'react';

interface LogoOrbit3DProps {
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

/**
 * Wraps the official H7.VOX logo with a 3D Orbital Ring (Anel 3D) and
 * 3D Orbital Triangles (Triângulos Orbitais) in true 3D perspective.
 * Never covers, blurs, or alters the original logo image.
 */
export const LogoOrbit3D: React.FC<LogoOrbit3DProps> = ({
  children,
  size = 'md',
  className = '',
}) => {
  const dimensions =
    size === 'lg'
      ? 'w-[148px] sm:w-[172px] h-[76px] sm:h-[88px]'
      : size === 'sm'
      ? 'w-[104px] sm:w-[118px] h-[52px] sm:h-[58px]'
      : 'w-[126px] sm:w-[152px] h-[64px] sm:h-[76px]';

  return (
    <div
      className={`relative inline-flex items-center justify-center select-none ${className}`}
      style={{ perspective: '650px', transformStyle: 'preserve-3d' }}
    >
      {/* Back-half of 3D Orbital Ring & Triangles (Behind Logo, z-0) */}
      <div
        className={`pointer-events-none absolute ${dimensions} flex items-center justify-center z-0`}
        aria-hidden="true"
        style={{ transformStyle: 'preserve-3d' }}
      >
        <svg
          viewBox="0 0 200 100"
          className="w-full h-full overflow-visible logo-orbit-svg"
        >
          <defs>
            <linearGradient id="h7OrbitGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#08CC07" stopOpacity="0.08" />
              <stop offset="50%" stopColor="#08CC07" stopOpacity="0.65" />
              <stop offset="100%" stopColor="#08CC07" stopOpacity="0.08" />
            </linearGradient>
          </defs>

          {/* Outer Tilted 3D Ring */}
          <ellipse
            cx="100"
            cy="50"
            rx="92"
            ry="34"
            fill="none"
            stroke="url(#h7OrbitGrad)"
            strokeWidth="1.35"
            strokeDasharray="8 5"
            transform="rotate(-14 100 50)"
            className="origin-center animate-[spin_22s_linear_infinite]"
          />

          {/* Secondary Counter-Rotating 3D Ring */}
          <ellipse
            cx="100"
            cy="50"
            rx="82"
            ry="26"
            fill="none"
            stroke="#08CC07"
            strokeOpacity="0.28"
            strokeWidth="1"
            transform="rotate(16 100 50)"
          />

          {/* Orbiting 3D Triangle 1 (Top-Left Satellite) */}
          <g className="logo-triangle-orbit-1">
            <polygon
              points="14,32 21,23 24,35"
              fill="#0A0A0A"
              stroke="#08CC07"
              strokeWidth="1.2"
              className="logo-orbit-triangle-fill"
            />
            <line x1="14" y1="32" x2="20" y2="30" stroke="#08CC07" strokeOpacity="0.5" strokeWidth="0.8" />
          </g>

          {/* Orbiting 3D Triangle 2 (Bottom-Right Satellite) */}
          <g className="logo-triangle-orbit-2">
            <polygon
              points="184,66 192,58 189,71"
              fill="#08CC07"
              fillOpacity="0.25"
              stroke="#08CC07"
              strokeWidth="1.2"
            />
          </g>

          {/* Orbiting 3D Triangle 3 (Top-Right Micro Tetrahedron) */}
          <g className="logo-triangle-orbit-3 hidden sm:block">
            <polygon
              points="174,20 181,14 183,24"
              fill="#0A0A0A"
              stroke="#08CC07"
              strokeOpacity="0.8"
              strokeWidth="1"
              className="logo-orbit-triangle-fill"
            />
          </g>
        </svg>
      </div>

      {/* Original Unmodified H7.VOX Logo Content (Foreground z-10) */}
      <div className="relative z-10 flex items-center justify-center">
        {children}
      </div>

      {/* Subtle Front Rim Arc (Passes below/around badge edge without touching logo image) */}
      <div
        className={`pointer-events-none absolute ${dimensions} flex items-center justify-center z-20`}
        aria-hidden="true"
      >
        <svg viewBox="0 0 200 100" className="w-full h-full overflow-visible">
          <path
            d="M 14 62 A 92 32 0 0 0 186 38"
            fill="none"
            stroke="#08CC07"
            strokeOpacity="0.35"
            strokeWidth="1.1"
            strokeDasharray="4 8"
            transform="rotate(-14 100 50)"
          />
          <circle cx="18" cy="60" r="2" fill="#08CC07" className="animate-pulse" />
          <circle cx="184" cy="36" r="1.75" fill="#08CC07" opacity="0.8" />
        </svg>
      </div>
    </div>
  );
};
