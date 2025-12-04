import React, { useRef, useMemo, useLayoutEffect, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Group, Object3D, Vector3, Quaternion, Color, InstancedMesh, MathUtils } from 'three';
import { Sparkles } from '@react-three/drei';
import { ThemeColor, TreeProps } from '../types';

// --- Constants & Config ---
const TREE_LAYERS = [
  { y: 1.0, h: 2.0, r: 2.2 },
  { y: 2.2, h: 1.8, r: 1.8 },
  { y: 3.2, h: 1.6, r: 1.4 },
  { y: 4.0, h: 1.4, r: 1.0 },
  { y: 4.8, h: 1.0, r: 0.6 } // Top tip
];

// Helper to get random point in sphere
const randomInSphere = (radius: number) => {
  const u = Math.random();
  const v = Math.random();
  const theta = 2 * Math.PI * u;
  const phi = Math.acos(2 * v - 1);
  const r = Math.cbrt(Math.random()) * radius;
  return new Vector3(
    r * Math.sin(phi) * Math.cos(theta),
    r * Math.sin(phi) * Math.sin(theta),
    r * Math.cos(phi)
  );
};

// --- Custom Hook for Morphing Instances ---
interface MorphConfig {
  count: number;
  isExploded: boolean;
  generateTreeData: (i: number) => { pos: Vector3; rot: Quaternion; scale: Vector3 };
  generateScatterData: (i: number) => { pos: Vector3; rot: Quaternion; scale: Vector3 };
}

const useMorphInstances = ({ count, isExploded, generateTreeData, generateScatterData }: MorphConfig) => {
  const meshRef = useRef<InstancedMesh>(null);
  
  // Store target data
  const data = useMemo(() => {
    const tree = [];
    const scatter = [];
    for (let i = 0; i < count; i++) {
      tree.push(generateTreeData(i));
      scatter.push(generateScatterData(i));
    }
    return { tree, scatter };
  }, [count, generateTreeData, generateScatterData]);

  // Animation state
  const progress = useRef(isExploded ? 1 : 0);
  const tempObj = useMemo(() => new Object3D(), []);

  useFrame((_, delta) => {
    if (!meshRef.current) return;

    // Smoothly interpolate progress
    const target = isExploded ? 1 : 0;
    // Non-linear ease for "organic" feel
    const speed = isExploded ? 2.5 : 2.0;
    progress.current = MathUtils.damp(progress.current, target, speed, delta);

    const t = progress.current;
    
    // Optimization: Stop updating if we are settled at 0 or 1 (and not actively switching)
    if (Math.abs(t - target) < 0.001 && (target === 0 || target === 1)) {
       // If we just finished a transition, ensure final frame is set, then skip
       // For simplicity in this demo, we just keep running to allow floating effects.
    }

    // Update instances
    for (let i = 0; i < count; i++) {
      const tree = data.tree[i];
      const scatter = data.scatter[i];

      // Add some noise/wobble when scattered
      const noise = isExploded ? Math.sin(Date.now() * 0.001 + i) * 0.05 : 0;

      // Lerp Position
      tempObj.position.lerpVectors(tree.pos, scatter.pos, t);
      tempObj.position.y += noise; 

      // Slerp Rotation
      tempObj.quaternion.slerpQuaternions(tree.rot, scatter.rot, t);

      // Lerp Scale (maybe shrink slightly when scattered?)
      tempObj.scale.lerpVectors(tree.scale, scatter.scale, t);

      tempObj.updateMatrix();
      meshRef.current.setMatrixAt(i, tempObj.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return meshRef;
};

// --- Sub-components ---

// 1. Foliage: Thousands of crystal-like needles
const FoliageCloud = ({ isExploded }: { isExploded: boolean }) => {
  const count = 1500;
  
  const meshRef = useMorphInstances({
    count,
    isExploded,
    generateTreeData: (i) => {
      // Pick a random layer
      const layer = TREE_LAYERS[Math.floor(Math.random() * TREE_LAYERS.length)];
      // Random position within cone volume
      const h = Math.random() * layer.h;
      const r = (layer.r * (1 - h/layer.h)) * Math.sqrt(Math.random()); // sqrt for uniform disk distrib
      const theta = Math.random() * Math.PI * 2;
      
      const pos = new Vector3(
        r * Math.cos(theta),
        layer.y + h - layer.h/2,
        r * Math.sin(theta)
      );

      // Rotate to point somewhat outward/upward
      const q = new Quaternion();
      q.setFromEuler(new Object3D().rotation.set(
        (Math.random() - 0.5) * 0.5, 
        Math.random() * Math.PI * 2, 
        (Math.random() - 0.5) * 0.5
      ));

      return { pos, rot: q, scale: new Vector3(1, 1, 1).multiplyScalar(0.5 + Math.random() * 0.5) };
    },
    generateScatterData: () => ({
      pos: randomInSphere(12),
      rot: new Quaternion().random(),
      scale: new Vector3(1, 1, 1).multiplyScalar(0.5)
    })
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]} castShadow receiveShadow>
      <cylinderGeometry args={[0.02, 0.12, 0.6, 4]} />
      <meshStandardMaterial color="#004D40" roughness={0.4} metalness={0.6} />
    </instancedMesh>
  );
};

// 2. Ornaments: Spheres that change color
const OrnamentCloud = ({ isExploded, themeColor }: { isExploded: boolean, themeColor: ThemeColor }) => {
  const count = 200;
  const meshRef = useMorphInstances({
    count,
    isExploded,
    generateTreeData: (i) => {
      const layer = TREE_LAYERS[Math.floor(Math.random() * TREE_LAYERS.length)];
      // Place on SURFACE of cone
      const h = Math.random() * layer.h;
      const r = (layer.r * (1 - h/layer.h)) * 0.9; // Slightly inset
      const theta = Math.random() * Math.PI * 2;
      
      const pos = new Vector3(
        r * Math.cos(theta),
        layer.y + h - layer.h/2,
        r * Math.sin(theta)
      );

      return { 
        pos, 
        rot: new Quaternion().random(), 
        scale: new Vector3(1, 1, 1).multiplyScalar(0.15 + Math.random() * 0.15) 
      };
    },
    generateScatterData: () => ({
      pos: randomInSphere(10),
      rot: new Quaternion().random(),
      scale: new Vector3(1, 1, 1).multiplyScalar(0.2)
    })
  });

  // Handle Color Updates
  const tempColor = useMemo(() => new Color(), []);
  useLayoutEffect(() => {
    if (meshRef.current) {
      for (let i = 0; i < count; i++) {
        // Deterministic random per instance based on index
        const isGold = (i % 3) === 0; 
        
        if (isGold) {
          tempColor.set('#D4AF37'); // Always some gold
        } else {
          // Theme specific
          if (themeColor === 'gold') tempColor.set('#F4CF57');
          if (themeColor === 'silver') tempColor.set('#E0E0E0');
          if (themeColor === 'ruby') tempColor.set('#800020');
        }
        
        meshRef.current.setColorAt(i, tempColor);
      }
      meshRef.current.instanceColor!.needsUpdate = true;
    }
  }, [themeColor, count]);

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]} castShadow>
      <sphereGeometry args={[1, 16, 16]} />
      <meshStandardMaterial roughness={0.1} metalness={1.0} />
    </instancedMesh>
  );
};

// 3. Lights: Glowing Emissive Spheres
const LightCloud = ({ isExploded, lightsOn }: { isExploded: boolean, lightsOn: boolean }) => {
  const count = 150;
  const meshRef = useMorphInstances({
    count,
    isExploded,
    generateTreeData: (i) => {
      // Spiral distribution
      const layerIndex = Math.floor((i / count) * TREE_LAYERS.length);
      const layer = TREE_LAYERS[layerIndex];
      const h = Math.random() * layer.h;
      const r = (layer.r * (1 - h/layer.h)) * 0.95;
      const theta = (i * 0.5) + Math.random(); // Semi-spiral
      
      const pos = new Vector3(
        r * Math.cos(theta),
        layer.y + h - layer.h/2,
        r * Math.sin(theta)
      );
      
      return { 
        pos, 
        rot: new Quaternion(), 
        scale: new Vector3(1, 1, 1).multiplyScalar(0.06) 
      };
    },
    generateScatterData: () => ({
      pos: randomInSphere(14),
      rot: new Quaternion(),
      scale: new Vector3(1, 1, 1).multiplyScalar(0.06)
    })
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 8, 8]} />
      <meshStandardMaterial 
        color="#ffffee"
        emissive="#ffcc00"
        emissiveIntensity={lightsOn ? 20 : 0}
        toneMapped={false}
      />
    </instancedMesh>
  );
};

// --- Main Component ---

export const ChristmasTree: React.FC<TreeProps> = ({ lightsOn, themeColor, isExploded }) => {
  const starRef = useRef<Group>(null);
  
  useFrame((state) => {
    if (starRef.current) {
      // If exploded, star floats away or stays? Let's make it float up slightly
      const targetY = isExploded ? 8 : 4.8;
      starRef.current.position.y = MathUtils.lerp(starRef.current.position.y, targetY, 0.05);
      starRef.current.rotation.y += 0.01;
    }
  });

  return (
    <group dispose={null}>
      
      {/* Morphing Components */}
      <FoliageCloud isExploded={isExploded} />
      <OrnamentCloud isExploded={isExploded} themeColor={themeColor} />
      <LightCloud isExploded={isExploded} lightsOn={lightsOn} />

      {/* The Trunk - Scales down when exploded */}
      <group scale={[isExploded ? 0 : 1, isExploded ? 0 : 1, isExploded ? 0 : 1]} position={[0, 0, 0]}>
        <mesh position={[0, 1, 0]} castShadow receiveShadow>
           <cylinderGeometry args={[0.4, 0.8, 2.5, 8]} />
           <meshStandardMaterial color="#3E2723" roughness={1} />
        </mesh>
      </group>

      {/* The Topper Star */}
      <group ref={starRef} position={[0, 4.8, 0]}>
         <pointLight color="#fff" intensity={lightsOn ? 2 : 0} distance={4} decay={2} />
         <mesh scale={isExploded ? 1.5 : 1}>
            <octahedronGeometry args={[0.3, 0]} />
            <meshStandardMaterial 
              color="#D4AF37" 
              emissive="#D4AF37" 
              emissiveIntensity={lightsOn ? 10 : 0.5}
              toneMapped={false}
            />
         </mesh>
         <mesh scale={1.5} rotation={[0,0,Math.PI/4]}>
            <torusGeometry args={[0.3, 0.02, 16, 32]} />
            <meshStandardMaterial color="#D4AF37" metalness={1} roughness={0} />
         </mesh>
      </group>

      {/* Magical Sparkles - Always present but scattered more when exploded */}
      {lightsOn && (
        <Sparkles 
          count={200} 
          scale={isExploded ? 20 : 6} 
          size={isExploded ? 6 : 4} 
          speed={0.4} 
          opacity={0.6}
          color={themeColor === 'ruby' ? '#ffaaaa' : '#ffeeaa'}
        />
      )}
      
      {/* Floor Reflection */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.75, 0]} receiveShadow>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial 
            color="#001a14" 
            roughness={0.1} 
            metalness={0.9} 
            envMapIntensity={0.5}
        />
      </mesh>
    </group>
  );
};