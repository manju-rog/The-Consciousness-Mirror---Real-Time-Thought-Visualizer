'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useConsciousnessStore } from '@/store/consciousness';

export function QuantumVisualization() {
  const groupRef = useRef<THREE.Group>(null);
  const waveRef = useRef<THREE.Points>(null);

  const consciousnessState = useConsciousnessStore((state) => state.consciousnessState);
  const behavioralPattern = useConsciousnessStore((state) => state.behavioralPattern);

  // Quantum field particles
  const particleCount = 10000;
  const positions = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 40;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 40;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 40;
    }
    return pos;
  }, []);

  useFrame((state, delta) => {
    if (!groupRef.current || !waveRef.current) return;

    const time = state.clock.elapsedTime;
    const arousal = consciousnessState?.arousalLevel || 0.5;
    const mindWandering = consciousnessState?.mindWandering || 0;

    // Quantum field fluctuations
    const positions = waveRef.current.geometry.attributes.position.array as Float32Array;

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;

      // Wave function collapse and expansion
      const x = positions[i3];
      const y = positions[i3 + 1];
      const z = positions[i3 + 2];

      // Quantum superposition effect
      const wave1 = Math.sin(x * 0.1 + time * 2) * Math.cos(y * 0.1 + time * 1.5);
      const wave2 = Math.cos(z * 0.1 + time) * Math.sin(x * 0.1 + y * 0.1);

      const displacement = (wave1 + wave2) * arousal * 2;

      positions[i3 + 1] += displacement * delta;

      // Quantum tunneling effect (particles teleport)
      if (Math.random() < mindWandering * 0.01) {
        positions[i3] = (Math.random() - 0.5) * 40;
        positions[i3 + 1] = (Math.random() - 0.5) * 40;
        positions[i3 + 2] = (Math.random() - 0.5) * 40;
      }

      // Keep particles in bounds
      if (Math.abs(positions[i3 + 1]) > 20) {
        positions[i3 + 1] *= 0.9;
      }
    }

    waveRef.current.geometry.attributes.position.needsUpdate = true;

    // Rotate quantum field
    groupRef.current.rotation.y = time * 0.1;
    groupRef.current.rotation.x = Math.sin(time * 0.3) * 0.2;
  });

  return (
    <group ref={groupRef}>
      {/* Quantum field particles */}
      <points ref={waveRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particleCount}
            array={positions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          color="#00ffff"
          size={0.1}
          transparent
          opacity={0.6}
          blending={THREE.AdditiveBlending}
          sizeAttenuation={true}
        />
      </points>

      {/* Probability clouds (spheres) */}
      {[0, 1, 2, 3].map((index) => {
        const angle = (index / 4) * Math.PI * 2;
        const radius = 15;

        return (
          <mesh
            key={index}
            position={[
              Math.cos(angle) * radius,
              0,
              Math.sin(angle) * radius,
            ]}
          >
            <sphereGeometry args={[3, 32, 32]} />
            <meshBasicMaterial
              color={new THREE.Color().setHSL(index * 0.25, 0.8, 0.5)}
              transparent
              opacity={0.1}
              side={THREE.DoubleSide}
            />
          </mesh>
        );
      })}

      {/* Quantum entanglement lines */}
      {[0, 1, 2, 3].map((i) => {
        const angle1 = (i / 4) * Math.PI * 2;
        const angle2 = ((i + 1) / 4) * Math.PI * 2;
        const radius = 15;

        return (
          <line key={`ent-${i}`}>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                count={2}
                array={new Float32Array([
                  Math.cos(angle1) * radius,
                  0,
                  Math.sin(angle1) * radius,
                  Math.cos(angle2) * radius,
                  0,
                  Math.sin(angle2) * radius,
                ])}
                itemSize={3}
              />
            </bufferGeometry>
            <lineBasicMaterial
              color="#ff00ff"
              transparent
              opacity={0.3}
              blending={THREE.AdditiveBlending}
            />
          </line>
        );
      })}

      {/* Central singularity */}
      <mesh>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial
          color="#ffffff"
          transparent
          opacity={0.9}
        />
      </mesh>

      {/* Energy rings (orbits) */}
      {[5, 10, 15, 20].map((radius, index) => (
        <mesh key={`ring-${index}`} rotation-x={Math.PI / 2}>
          <torusGeometry args={[radius, 0.1, 16, 100]} />
          <meshBasicMaterial
            color={new THREE.Color().setHSL(index * 0.2, 0.8, 0.6)}
            transparent
            opacity={0.3}
          />
        </mesh>
      ))}
    </group>
  );
}
