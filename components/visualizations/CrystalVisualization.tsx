'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useConsciousnessStore } from '@/store/consciousness';

export function CrystalVisualization() {
  const groupRef = useRef<THREE.Group>(null);
  const consciousnessState = useConsciousnessStore((state) => state.consciousnessState);
  const behavioralPattern = useConsciousnessStore((state) => state.behavioralPattern);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    const time = state.clock.elapsedTime;
    const focusDepth = consciousnessState?.focusDepth || 0.5;
    const flowState = consciousnessState?.flowStateProbability || 0;

    // Rotate crystal formation
    groupRef.current.rotation.y = time * 0.3;
    groupRef.current.rotation.x = Math.sin(time * 0.5) * 0.2;

    // Crystallize during deep focus
    const crystallization = focusDepth * 0.3 + flowState * 0.7;
    const targetScale = 0.8 + crystallization * 0.4;

    groupRef.current.children.forEach((child, index) => {
      const offset = index * 0.1;
      child.scale.lerp(
        new THREE.Vector3(targetScale, targetScale, targetScale),
        delta * 2
      );

      // Individual rotation
      child.rotation.z = time * (0.5 + index * 0.1) + offset;
    });
  });

  const crystalGeometries = [
    { type: 'octahedron', args: [3, 0] },
    { type: 'dodecahedron', args: [2.5, 0] },
    { type: 'icosahedron', args: [2, 0] },
    { type: 'tetrahedron', args: [2, 0] },
  ];

  return (
    <group ref={groupRef}>
      {/* Central core crystal */}
      <mesh>
        <octahedronGeometry args={[4, 2]} />
        <meshStandardMaterial
          color="#4488ff"
          transparent
          opacity={0.6}
          metalness={0.9}
          roughness={0.1}
          envMapIntensity={1}
        />
      </mesh>

      {/* Orbiting crystals */}
      {crystalGeometries.map((geom, index) => {
        const angle = (index / crystalGeometries.length) * Math.PI * 2;
        const radius = 8;

        return (
          <mesh
            key={index}
            position={[
              Math.cos(angle) * radius,
              Math.sin(angle * 2) * 2,
              Math.sin(angle) * radius,
            ]}
          >
            {geom.type === 'octahedron' && <octahedronGeometry args={geom.args as [number, number]} />}
            {geom.type === 'dodecahedron' && <dodecahedronGeometry args={geom.args as [number, number]} />}
            {geom.type === 'icosahedron' && <icosahedronGeometry args={geom.args as [number, number]} />}
            {geom.type === 'tetrahedron' && <tetrahedronGeometry args={geom.args as [number, number]} />}

            <meshStandardMaterial
              color={new THREE.Color().setHSL((index / crystalGeometries.length) * 0.3 + 0.5, 0.7, 0.5)}
              transparent
              opacity={0.7}
              metalness={0.8}
              roughness={0.2}
              wireframe={index % 2 === 0}
            />
          </mesh>
        );
      })}

      {/* Energy lattice */}
      {[0, 1, 2].map((layer) => (
        <lineSegments key={layer}>
          <edgesGeometry args={[new THREE.IcosahedronGeometry(5 + layer * 2, 0)]} />
          <lineBasicMaterial
            color={new THREE.Color().setHSL(0.6 + layer * 0.1, 0.8, 0.5)}
            transparent
            opacity={0.3 - layer * 0.1}
          />
        </lineSegments>
      ))}

      {/* Particle field */}
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={2000}
            array={new Float32Array(
              Array.from({ length: 6000 }, (_, i) => {
                const theta = Math.random() * Math.PI * 2;
                const phi = Math.acos(2 * Math.random() - 1);
                const r = 15 + Math.random() * 5;

                if (i % 3 === 0) return r * Math.sin(phi) * Math.cos(theta);
                if (i % 3 === 1) return r * Math.sin(phi) * Math.sin(theta);
                return r * Math.cos(phi);
              })
            )}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          color="#88ffff"
          size={0.1}
          transparent
          opacity={0.4}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Lighting */}
      <pointLight position={[0, 0, 0]} intensity={2} color="#88aaff" />
    </group>
  );
}
