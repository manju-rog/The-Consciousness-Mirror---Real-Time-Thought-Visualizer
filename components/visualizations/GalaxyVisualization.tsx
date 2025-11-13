'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useConsciousnessStore } from '@/store/consciousness';

export function GalaxyVisualization() {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const starsRef = useRef<THREE.Points>(null);

  const behavioralPattern = useConsciousnessStore((state) => state.behavioralPattern);
  const statisticalFeatures = useConsciousnessStore((state) => state.statisticalFeatures);
  const visualizationSettings = useConsciousnessStore((state) => state.visualizationSettings);

  const particleCount = 50000;

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    const time = state.clock.elapsedTime;
    const emotionalIntensity = behavioralPattern?.intensity || 0.5;

    // Rotate galaxy
    meshRef.current.rotation.y += delta * 0.1 * emotionalIntensity;

    // Pulsate based on stress
    const stressLevel = statisticalFeatures?.mouseJerkMean || 0;
    const scale = 1 + Math.sin(time * 2) * 0.1 * (stressLevel / 10000);
    meshRef.current.scale.setScalar(scale);

    if (starsRef.current) {
      starsRef.current.rotation.y = time * 0.05;
    }
  });

  // Generate galaxy arms
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);

  for (let i = 0; i < particleCount; i++) {
    const i3 = i * 3;

    // Spiral arm pattern
    const radius = Math.random() * 25;
    const spinAngle = radius * 0.5;
    const branchAngle = ((i % 3) / 3) * Math.PI * 2;

    const randomX = (Math.random() - 0.5) * 2;
    const randomY = (Math.random() - 0.5) * 2;
    const randomZ = (Math.random() - 0.5) * 2;

    positions[i3] = Math.cos(branchAngle + spinAngle) * radius + randomX;
    positions[i3 + 1] = randomY;
    positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ;

    // Colors - cosmic gradient
    const colorIntensity = 1 - radius / 25;
    colors[i3] = 0.2 + colorIntensity * 0.3; // R
    colors[i3 + 1] = 0.4 + colorIntensity * 0.6; // G
    colors[i3 + 2] = 1; // B
  }

  return (
    <group>
      {/* Galaxy particles */}
      <points ref={starsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particleCount}
            array={positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={particleCount}
            array={colors}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.15}
          vertexColors
          transparent
          opacity={0.8}
          sizeAttenuation={true}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      {/* Center core */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[2, 32, 32]} />
        <meshBasicMaterial
          color="#4444ff"
          transparent
          opacity={0.3}
        />
      </mesh>

      {/* Accretion disk */}
      <mesh rotation-x={Math.PI / 2}>
        <torusGeometry args={[3, 0.5, 16, 100]} />
        <meshBasicMaterial
          color="#ff44ff"
          transparent
          opacity={0.2}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}
