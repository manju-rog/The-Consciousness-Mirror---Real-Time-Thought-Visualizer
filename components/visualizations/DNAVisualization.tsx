'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useConsciousnessStore } from '@/store/consciousness';

export function DNAVisualization() {
  const groupRef = useRef<THREE.Group>(null);
  const consciousnessState = useConsciousnessStore((state) => state.consciousnessState);
  const statisticalFeatures = useConsciousnessStore((state) => state.statisticalFeatures);

  // Generate DNA helix structure
  const { strand1, strand2, connections } = useMemo(() => {
    const segments = 100;
    const height = 30;
    const radius = 3;
    const strand1Positions: THREE.Vector3[] = [];
    const strand2Positions: THREE.Vector3[] = [];
    const connections: [THREE.Vector3, THREE.Vector3][] = [];

    for (let i = 0; i < segments; i++) {
      const y = (i / segments) * height - height / 2;
      const angle = (i / segments) * Math.PI * 8; // 4 full rotations

      const x1 = Math.cos(angle) * radius;
      const z1 = Math.sin(angle) * radius;
      const x2 = Math.cos(angle + Math.PI) * radius;
      const z2 = Math.sin(angle + Math.PI) * radius;

      strand1Positions.push(new THREE.Vector3(x1, y, z1));
      strand2Positions.push(new THREE.Vector3(x2, y, z2));

      // Base pair connections every 5 segments
      if (i % 5 === 0) {
        connections.push([
          new THREE.Vector3(x1, y, z1),
          new THREE.Vector3(x2, y, z2),
        ]);
      }
    }

    return { strand1: strand1Positions, strand2: strand2Positions, connections };
  }, []);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    const time = state.clock.elapsedTime;
    const creativity = consciousnessState?.creativityIndex || 0.5;
    const interactionDensity = statisticalFeatures?.interactionDensity || 5;

    // Rotate the entire helix
    groupRef.current.rotation.y = time * 0.3;

    // Twist rate varies with creativity
    const twistSpeed = 0.2 + creativity * 0.5;

    // Pulsate with interaction density
    const pulse = 1 + Math.sin(time * 2) * 0.05 * (interactionDensity / 10);
    groupRef.current.scale.setScalar(pulse);
  });

  return (
    <group ref={groupRef}>
      {/* Strand 1 - spheres */}
      {strand1.map((pos, index) => (
        <mesh key={`s1-${index}`} position={pos}>
          <sphereGeometry args={[0.3, 8, 8]} />
          <meshStandardMaterial
            color="#ff4488"
            emissive="#ff4488"
            emissiveIntensity={0.5}
          />
        </mesh>
      ))}

      {/* Strand 2 - spheres */}
      {strand2.map((pos, index) => (
        <mesh key={`s2-${index}`} position={pos}>
          <sphereGeometry args={[0.3, 8, 8]} />
          <meshStandardMaterial
            color="#4488ff"
            emissive="#4488ff"
            emissiveIntensity={0.5}
          />
        </mesh>
      ))}

      {/* Base pair connections */}
      {connections.map(([start, end], index) => (
        <line key={`conn-${index}`}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={2}
              array={new Float32Array([start.x, start.y, start.z, end.x, end.y, end.z])}
              itemSize={3}
            />
          </bufferGeometry>
          <lineBasicMaterial
            color="#88ff88"
            transparent
            opacity={0.6}
            linewidth={2}
          />
        </line>
      ))}

      {/* Strand backbone curves */}
      <line>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={strand1.length}
            array={new Float32Array(strand1.flatMap((v) => [v.x, v.y, v.z]))}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#ff4488" transparent opacity={0.3} linewidth={1} />
      </line>

      <line>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={strand2.length}
            array={new Float32Array(strand2.flatMap((v) => [v.x, v.y, v.z]))}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#4488ff" transparent opacity={0.3} linewidth={1} />
      </line>

      {/* Energy particles flowing along helix */}
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={500}
            array={new Float32Array(
              Array.from({ length: 1500 }, (_, i) => {
                const segment = (i / 3) % strand1.length;
                const pos = strand1[Math.floor(segment)];
                return i % 3 === 0 ? pos.x : i % 3 === 1 ? pos.y : pos.z;
              })
            )}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          color="#ffff88"
          size={0.15}
          transparent
          opacity={0.8}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}
