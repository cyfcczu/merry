import React from 'react';
import { EffectComposer, Bloom, Vignette, Noise } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';

interface EffectsProps {
  bloomIntensity: number;
}

export const Effects: React.FC<EffectsProps> = ({ bloomIntensity }) => {
  return (
    <EffectComposer disableNormalPass>
      {/* 
        High luminance threshold ensures only the lights and super bright reflections glow.
        The intensity creates that "cinematic" luxury feel.
      */}
      <Bloom 
        luminanceThreshold={1.2} 
        mipmapBlur 
        intensity={bloomIntensity} 
        radius={0.6}
        levels={8}
      />
      <Noise opacity={0.02} blendFunction={BlendFunction.OVERLAY} />
      <Vignette eskil={false} offset={0.1} darkness={0.6} />
    </EffectComposer>
  );
};