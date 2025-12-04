import React from 'react';
import { MeshStandardMaterial } from 'three';

// We define these as functions or ready-to-use hooks/constants if needed,
// but for R3F usually we use <meshStandardMaterial /> inline. 
// However, creating specific material presets helps consistency.

export const GoldMaterial = () => (
  <meshStandardMaterial
    color="#D4AF37"
    roughness={0.15}
    metalness={1}
    emissive="#443300"
    emissiveIntensity={0.2}
  />
);

export const SilverMaterial = () => (
  <meshStandardMaterial
    color="#E0E0E0"
    roughness={0.2}
    metalness={1}
    emissive="#111111"
    emissiveIntensity={0.1}
  />
);

export const RubyMaterial = () => (
  <meshStandardMaterial
    color="#800020"
    roughness={0.1}
    metalness={0.6}
    emissive="#330000"
    emissiveIntensity={0.2}
  />
);

export const EmeraldLeafMaterial = () => (
  <meshStandardMaterial
    color="#004D40"
    roughness={0.7}
    metalness={0.1}
    flatShading={false}
  />
);