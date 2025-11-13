'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useConsciousnessStore } from '@/store/consciousness';

export function BrainVisualization() {
  const groupRef = useRef<THREE.Group>(null);
  const neuronsRef = useRef<THREE.Points>(null);

  const behavioralPattern = useConsciousnessStore((state) => state.behavioralPattern);
  const consciousnessState = useConsciousnessStore((state) => state.consciousnessState);

  // Generate brain-like structure with neurons
  const { positions, connections } = useMemo(() => {
    const neuronCount = 5000;
    const positions = new Float32Array(neuronCount * 3);
    const connections: [number, number][] = [];

    // Create brain-shaped point cloud
    for (let i = 0; i < neuronCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      // Brain shape (ellipsoid with lobes)
      const r = 10 + Math.sin(phi * 3) * 2;
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta) * 0.8;
      const z = r * Math.cos(phi) * 0.9;

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      // Create neural connections
      if (i > 0 && Math.random() < 0.05) {
        const target = Math.floor(Math.random() * i);
        connections.push([i, target]);
      }
    }

    return { positions, connections };
  }, []);

  useFrame((state, delta) => {
    if (!groupRef.current || !neuronsRef.current) return;

    const time = state.clock.elapsedTime;
    const focusDepth = consciousnessState?.focusDepth || 0.5;
    const cognitiveLoad = consciousnessState?.cognitiveLoad || 0.5;

    // Pulsate with cognitive activity
    const pulse = 1 + Math.sin(time * 2) * 0.05 * cognitiveLoad;
    groupRef.current.scale.setScalar(pulse);

    // Rotate brain
    groupRef.current.rotation.y = time * 0.2 * focusDepth;

    // Animate neurons
    const colors = neuronsRef.current.geometry.attributes.color.array as Float32Array;
    for (let i = 0; i < colors.length; i += 3) {
      const activity = Math.sin(time * 5 + i * 0.1) * 0.5 + 0.5;
      const intensity = 0.3 + activity * cognitiveLoad * 0.7;

      colors[i] = intensity; // R
      colors[i + 1] = intensity * 0.5; // G
      colors[i + 2] = intensity + focusDepth * 0.5; // B
    }
    neuronsRef.current.geometry.attributes.color.needsUpdate = true;
  });

  // Generate colors for neurons
  const colors = useMemo(() => {
    const arr = new Float32Array(positions.length);
    for (let i = 0; i < arr.length; i += 3) {
      arr[i] = 0.5;
      arr[i + 1] = 0.3;
      arr[i + 2] = 1;
    }
    return arr;
  }, [positions]);

  return (
    <group ref={groupRef}>
      {/* Neurons */}
      <points ref={neuronsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={positions.length / 3}
            array={positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={colors.length / 3}
            array={colors}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.2}
          vertexColors
          transparent
          opacity={0.8}
          sizeAttenuation={true}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Neural connections */}
      {connections.slice(0, 200).map(([start, end], index) => (
        <line key={index}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={2}
              array={new Float32Array([
                positions[start * 3],
                positions[start * 3 + 1],
                positions[start * 3 + 2],
                positions[end * 3],
                positions[end * 3 + 1],
                positions[end * 3 + 2],
              ])}
              itemSize={3}
            />
          </bufferGeometry>
          <lineBasicMaterial
            color="#4488ff"
            transparent
            opacity={0.1}
            blending={THREE.AdditiveBlending}
          />
        </line>
      ))}

      {/* Brain hemispheres outline */}
      <mesh position-x={-5}>
        <sphereGeometry args={[8, 32, 32, 0, Math.PI]} />
        <meshBasicMaterial
          color="#2244aa"
          transparent
          opacity={0.1}
          wireframe
        />
      </mesh>
      <mesh position-x={5}>
        <sphereGeometry args={[8, 32, 32, 0, Math.PI]} />
        <meshBasicMaterial
          color="#2244aa"
          transparent
          opacity={0.1}
          wireframe
        />
      </mesh>
    </group>
  );
}
