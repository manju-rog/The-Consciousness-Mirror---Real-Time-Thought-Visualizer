'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useConsciousnessStore } from '@/store/consciousness';

export function MatrixVisualization() {
  const groupRef = useRef<THREE.Group>(null);
  const statisticalFeatures = useConsciousnessStore((state) => state.statisticalFeatures);

  // Create matrix rain columns
  const columns = useMemo(() => {
    const cols = [];
    const gridSize = 40;
    const spacing = 1.5;

    for (let x = 0; x < gridSize; x++) {
      for (let z = 0; z < gridSize; z++) {
        const height = 5 + Math.random() * 20;
        const speed = 0.5 + Math.random() * 2;
        const delay = Math.random() * 5;

        cols.push({
          x: (x - gridSize / 2) * spacing,
          z: (z - gridSize / 2) * spacing,
          height,
          speed,
          delay,
          chars: Array.from({ length: Math.ceil(height) }, () =>
            String.fromCharCode(0x30a0 + Math.random() * 96)
          ),
        });
      }
    }

    return cols;
  }, []);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    const time = state.clock.elapsedTime;
    const typingSpeed = statisticalFeatures?.interactionDensity || 5;

    groupRef.current.children.forEach((child, index) => {
      const column = columns[index];
      if (!column) return;

      // Animate falling
      const fallSpeed = column.speed * (1 + typingSpeed / 10);
      const yPos = ((time * fallSpeed - column.delay) % 30) - 15;
      child.position.y = yPos;

      // Fade based on position
      const material = (child as THREE.Mesh).material as THREE.MeshBasicMaterial;
      const opacity = Math.max(0, 1 - Math.abs(yPos) / 15);
      material.opacity = opacity * 0.8;
    });
  });

  return (
    <group ref={groupRef}>
      {columns.map((column, index) => (
        <mesh
          key={index}
          position={[column.x, 0, column.z]}
        >
          <boxGeometry args={[0.5, column.height, 0.5]} />
          <meshBasicMaterial
            color="#00ff00"
            transparent
            opacity={0.8}
          />
        </mesh>
      ))}

      {/* Grid floor */}
      <gridHelper args={[60, 40, '#00ff00', '#003300']} position-y={-15} />

      {/* Ambient "code" particles */}
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={1000}
            array={new Float32Array(
              Array.from({ length: 3000 }, () => (Math.random() - 0.5) * 60)
            )}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          color="#00ff00"
          size={0.1}
          transparent
          opacity={0.3}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}
