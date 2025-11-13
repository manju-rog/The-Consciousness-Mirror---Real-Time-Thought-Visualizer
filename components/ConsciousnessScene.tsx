'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import { ParticleSystem } from './ParticleSystem';
import { Suspense } from 'react';

export function ConsciousnessScene() {
  return (
    <div className="w-full h-screen">
      <Canvas
        camera={{ position: [0, 0, 40], fov: 75 }}
        gl={{ antialias: true, alpha: true }}
      >
        <color attach="background" args={['#000000']} />

        {/* Ambient lighting */}
        <ambientLight intensity={0.3} />
        <pointLight position={[10, 10, 10]} intensity={0.8} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#4444ff" />

        {/* Particle system */}
        <Suspense fallback={null}>
          <ParticleSystem />
        </Suspense>

        {/* Background stars */}
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

        {/* Camera controls */}
        <OrbitControls
          enableZoom={true}
          enablePan={true}
          enableRotate={true}
          autoRotate={true}
          autoRotateSpeed={0.5}
          maxDistance={100}
          minDistance={10}
        />
      </Canvas>
    </div>
  );
}
