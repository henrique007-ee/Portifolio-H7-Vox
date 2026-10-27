import React from 'react';
import { GreenSoundWave3D, BrandSculpture3D, DigitalSmokeLayer, type SculptureVariant } from './VisualEffects';

interface HudSectionDividerProps {
  frameCode?: string;
  leftTag?: string;
  centerTag?: string;
  rightTag?: string;
  showSoundWave?: boolean;
  sculptureVariant?: SculptureVariant;
}

/**
 * Pure 3D Visual Transition between sections.
 * Zero technical text labels, zero boxes, zero borders around 3D objects.
 */
export const HudSectionDivider: React.FC<HudSectionDividerProps> = ({
  showSoundWave = false,
  sculptureVariant = 'prism',
}) => {
  return (
    <div
      className="relative w-full bg-[#050505] py-6 sm:py-10 overflow-hidden select-none pointer-events-none"
      aria-hidden="true"
    >
      <DigitalSmokeLayer intensity="subtle" />

      {/* Luminous Neon Green Horizon Line */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-5xl h-px bg-gradient-to-r from-transparent via-[#08CC07]/40 to-transparent" />

      <div className="max-w-7xl mx-auto px-5 sm:px-8 relative z-0 flex items-center justify-between gap-6">
        <div className="ambient-3d-sculpture hidden md:block opacity-75">
          <BrandSculpture3D variant={sculptureVariant} size="sm" />
        </div>

        {showSoundWave ? (
          <div className="ambient-3d-soundwave flex-1 max-w-3xl mx-auto opacity-85">
            <GreenSoundWave3D compact barCount={48} />
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <span className="w-2.5 h-2.5 rounded-full bg-[#08CC07] shadow-[0_0_14px_#08CC07]" />
          </div>
        )}

        <div className="ambient-3d-sculpture hidden md:block opacity-75">
          <BrandSculpture3D
            variant={sculptureVariant === 'prism' ? 'orbitalRing' : 'prism'}
            size="sm"
          />
        </div>
      </div>
    </div>
  );
};
