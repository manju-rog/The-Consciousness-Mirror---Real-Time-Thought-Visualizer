'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useConsciousnessStore } from '@/store/consciousness';

export function ForestVisualization() {
  const groupRef = useRef<THREE.Group>(null);
  const behavioralPattern = useConsciousnessStore((state) => state.behavioralPattern);
  const statisticalFeatures = useConsciousnessStore((state) => state.statisticalFeatures);
  const consciousnessState = useConsciousnessStore((state) => state.consciousnessState);

  // Generate trees (thought trees)
  const trees = useMemo(() => {
    const treeData = [];
    const gridSize = 10;

    for (let x = -gridSize; x <= gridSize; x += 3) {
      for (let z = -gridSize; z <= gridSize; z += 3) {
        const height = 3 + Math.random() * 5;
        const age = Math.random();

        treeData.push({
          x: x + (Math.random() - 0.5) * 2,
          z: z + (Math.random() - 0.5) * 2,
          height,
          age,
          growthRate: 0.5 + Math.random() * 0.5,
        });
      }
    }

    return treeData;
  }, []);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    const time = state.clock.elapsedTime;
    const creativity = consciousnessState?.creativityIndex || 0.5;
    const interactionDensity = statisticalFeatures?.interactionDensity || 5;

    // Trees grow with creativity and interactions
    groupRef.current.children.forEach((child, index) => {
      if (child.type === 'Group') {
        const tree = trees[index];
        if (!tree) return;

        // Grow trees based on creativity
        const growthFactor = 1 + creativity * 0.3 + (interactionDensity / 20) * 0.2;
        const targetScale = tree.growthRate * growthFactor;

        child.scale.y += (targetScale - child.scale.y) * delta * 0.5;

        // Sway in the wind
        const sway = Math.sin(time + tree.x + tree.z) * 0.05;
        child.rotation.z = sway;
      }
    });
  });

  return (
    <group ref={groupRef}>
      {/* Ground */}
      <mesh rotation-x={-Math.PI / 2} position-y={-1}>
        <planeGeometry args={[50, 50, 20, 20]} />
        <meshStandardMaterial
          color="#1a4d2e"
          roughness={0.9}
          metalness={0.1}
        />
      </mesh>

      {/* Trees */}
      {trees.map((tree, index) => (
        <group key={index} position={[tree.x, 0, tree.z]}>
          {/* Trunk */}
          <mesh position-y={tree.height / 2}>
            <cylinderGeometry args={[0.2, 0.3, tree.height, 8]} />
            <meshStandardMaterial color="#4a2c2a" />
          </mesh>

          {/* Foliage (multiple layers) */}
          {[0, 1, 2].map((layer) => (
            <mesh
              key={layer}
              position-y={tree.height - layer * 0.8}
            >
              <coneGeometry args={[1.5 - layer * 0.3, 2, 8]} />
              <meshStandardMaterial
                color={new THREE.Color().setHSL(0.3, 0.6 + tree.age * 0.2, 0.3 + layer * 0.1)}
                transparent
                opacity={0.8}
              />
            </mesh>
          ))}

          {/* Glowing particles (thoughts growing) */}
          <points>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                count={20}
                array={new Float32Array(
                  Array.from({ length: 60 }, (_, i) => {
                    if (i % 3 === 0) return (Math.random() - 0.5) * 2;
                    if (i % 3 === 1) return tree.height + Math.random() * 2;
                    return (Math.random() - 0.5) * 2;
                  })
                )}
                itemSize={3}
              />
            </bufferGeometry>
            <pointsMaterial
              color="#88ff88"
              size={0.1}
              transparent
              opacity={0.6}
              blending={THREE.AdditiveBlending}
            />
          </points>
        </group>
      ))}

      {/* Ambient lighting */}
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 20, 10]} intensity={0.8} castShadow />
      <hemisphereLight args={['#87CEEB', '#2d5016', 0.6]} />

      {/* Fireflies */}
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={100}
            array={new Float32Array(
              Array.from({ length: 300 }, () => (Math.random() - 0.5) * 40)
            )}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          color="#ffff88"
          size={0.2}
          transparent
          opacity={0.8}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}
