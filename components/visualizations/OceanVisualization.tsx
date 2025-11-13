'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useConsciousnessStore } from '@/store/consciousness';

export function OceanVisualization() {
  const planeRef = useRef<THREE.Mesh>(null);
  const particlesRef = useRef<THREE.Points>(null);

  const behavioralPattern = useConsciousnessStore((state) => state.behavioralPattern);
  const consciousnessState = useConsciousnessStore((state) => state.consciousnessState);

  useFrame((state, delta) => {
    if (!planeRef.current) return;

    const time = state.clock.elapsedTime;
    const geometry = planeRef.current.geometry;
    const positions = geometry.attributes.position.array as Float32Array;

    // Get consciousness metrics
    const emotionalValence = consciousnessState?.emotionalValence || 0;
    const arousalLevel = consciousnessState?.arousalLevel || 0.5;
    const stressLevel = consciousnessState?.stressLevel || 0;

    // Animate waves
    for (let i = 0; i < positions.length; i += 3) {
      const x = positions[i];
      const z = positions[i + 2];

      // Multiple wave frequencies for realistic ocean
      const wave1 = Math.sin(x * 0.3 + time) * 2;
      const wave2 = Math.sin(z * 0.2 + time * 1.5) * 1.5;
      const wave3 = Math.sin((x + z) * 0.15 + time * 0.8) * 1;

      // Modulate waves based on consciousness
      const waveHeight = (wave1 + wave2 + wave3) * (1 + arousalLevel);
      const stressWaves = Math.sin(x * 2 + z * 2 + time * 5) * stressLevel * 3;

      positions[i + 1] = waveHeight + stressWaves;
    }

    geometry.attributes.position.needsUpdate = true;
    geometry.computeVertexNormals();

    // Update colors based on emotion
    const material = planeRef.current.material as THREE.MeshStandardMaterial;
    const hue = emotionalValence * 0.3 + 0.5; // 0.5 (blue) to 0.8 (cyan/green)
    material.color.setHSL(hue, 0.7, 0.3 + arousalLevel * 0.2);

    // Animate particles (bubbles/foam)
    if (particlesRef.current) {
      particlesRef.current.rotation.y = time * 0.1;
    }
  });

  // Create wave plane
  const planeGeometry = new THREE.PlaneGeometry(80, 80, 128, 128);
  planeGeometry.rotateX(-Math.PI / 2);

  // Create particle positions (foam/bubbles)
  const particleCount = 5000;
  const particlePositions = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount; i++) {
    particlePositions[i * 3] = (Math.random() - 0.5) * 80;
    particlePositions[i * 3 + 1] = Math.random() * 10;
    particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 80;
  }

  return (
    <group>
      {/* Ocean surface */}
      <mesh ref={planeRef} geometry={planeGeometry} receiveShadow>
        <meshStandardMaterial
          color="#1e3a8a"
          metalness={0.8}
          roughness={0.2}
          transparent
          opacity={0.9}
        />
      </mesh>

      {/* Foam particles */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particleCount}
            array={particlePositions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          color="#ffffff"
          size={0.15}
          transparent
          opacity={0.6}
          sizeAttenuation={true}
        />
      </points>

      {/* Underwater glow */}
      <mesh position-y={-5}>
        <sphereGeometry args={[30, 32, 32]} />
        <meshBasicMaterial
          color="#0099ff"
          transparent
          opacity={0.05}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Lighting for ocean */}
      <directionalLight position={[10, 20, 10]} intensity={1} castShadow />
      <hemisphereLight args={['#87CEEB', '#000066', 0.5]} />
    </group>
  );
}
