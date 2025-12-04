import React, { useRef, PropsWithChildren } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, Stars } from '@react-three/drei';
import { ChristmasTree } from './Tree';
import { Effects } from './Effects';
import { AppState } from '../types';
import { Group } from 'three';

interface SceneProps {
  state: AppState;
}

const RotatingGroup = ({ speed, children }: PropsWithChildren<{ speed: number }>) => {
  const ref = useRef<Group>(null);
  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * speed * 0.5;
    }
  });
  return <group ref={ref}>{children}</group>;
};

export const Scene: React.FC<SceneProps> = ({ state }) => {
  return (
    <div className="w-full h-screen bg-gradient-to-b from-arix-emeraldDark to-black">
      <Canvas shadows dpr={[1, 2]} gl={{ antialias: false, stencil: false, alpha: false }}>
        {/* Cinematic Camera Setup */}
        <PerspectiveCamera makeDefault position={[0, 2, 9]} fov={45} />
        <OrbitControls 
          enablePan={false} 
          minPolarAngle={Math.PI / 3} 
          maxPolarAngle={Math.PI / 1.8} 
          minDistance={5}
          maxDistance={14}
          autoRotate={state.rotationSpeed > 0}
          autoRotateSpeed={state.rotationSpeed}
        />

        {/* Environment Lighting */}
        <color attach="background" args={['#000504']} />
        
        <ambientLight intensity={0.2} color="#004D40" />
        
        {/* Key Light - Warm Gold */}
        <spotLight 
          position={[5, 8, 5]} 
          angle={0.5} 
          penumbra={0.5} 
          intensity={20} 
          color="#ffddaa" 
          castShadow 
          shadow-bias={-0.0001}
        />

        {/* Fill Light - Cool Blue/Green to contrast */}
        <pointLight position={[-5, 3, -5]} intensity={5} color="#004D40" />
        
        {/* Back Light - Rim light for drama */}
        <spotLight position={[0, 5, -8]} angle={0.8} intensity={10} color="#ca8a04" />

        {/* The Starry Background */}
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={0.5} />
        
        {/* Content */}
        <RotatingGroup speed={state.rotationSpeed}>
          <ChristmasTree 
            lightsOn={state.lightsOn} 
            themeColor={state.themeColor} 
            isExploded={state.isExploded}
          />
        </RotatingGroup>

        {/* Post Processing */}
        <Effects bloomIntensity={state.lightsOn ? state.bloomIntensity : 0.5} />
        
        {/* Environment Map for reflections */}
        <Environment preset="city" environmentIntensity={0.5} />
      </Canvas>
    </div>
  );
};