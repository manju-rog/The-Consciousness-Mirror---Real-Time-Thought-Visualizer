'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useConsciousnessStore } from '@/store/consciousness';

export function MandalaVisualization() {
  const groupRef = useRef<THREE.Group>(null);
  const behavioralPattern = useConsciousnessStore((state) => state.behavioralPattern);
  const consciousnessState = useConsciousnessStore((state) => state.consciousnessState);

  // Generate sacred geometry patterns
  const layers = useMemo(() => {
    const layerCount = 8;
    const result = [];

    for (let layer = 0; layer < layerCount; layer++) {
      const points = [];
      const petalCount = 6 + layer * 3;
      const radius = 2 + layer * 1.5;

      for (let i = 0; i < petalCount; i++) {
        const angle = (i / petalCount) * Math.PI * 2;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        points.push(new THREE.Vector3(x, y, 0));
      }

      result.push({ points, radius, layer });
    }

    return result;
  }, []);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    const time = state.clock.elapsedTime;
    const focusDepth = consciousnessState?.focusDepth || 0.5;
    const flowState = consciousnessState?.flowStateProbability || 0;

    // Rotate at different speeds per layer
    groupRef.current.children.forEach((child, index) => {
      const layerSpeed = (index % 2 === 0 ? 1 : -1) * (0.1 + focusDepth * 0.2);
      child.rotation.z = time * layerSpeed * (1 + index * 0.1);

      // Scale based on flow state
      const scale = 1 + Math.sin(time + index) * 0.1 * flowState;
      child.scale.setScalar(scale);
    });

    // Pulsate the entire mandala
    const pulse = 1 + Math.sin(time * 2) * 0.05;
    groupRef.current.scale.setScalar(pulse);
  });

  return (
    <group ref={groupRef}>
      {layers.map((layer, layerIndex) => (
        <group key={layerIndex}>
          {/* Petals */}
          {layer.points.map((point, pointIndex) => (
            <mesh key={pointIndex} position={[point.x, point.y, point.z]}>
              <circleGeometry args={[0.3, 16]} />
              <meshBasicMaterial
                color={new THREE.Color().setHSL(
                  (layerIndex / layers.length + pointIndex * 0.01) % 1,
                  0.7,
                  0.5 + Math.sin(pointIndex) * 0.2
                )}
                transparent
                opacity={0.6}
                side={THREE.DoubleSide}
              />
            </mesh>
          ))}

          {/* Connecting lines */}
          <lineLoop>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                count={layer.points.length}
                array={new Float32Array(
                  layer.points.flatMap((p) => [p.x, p.y, p.z])
                )}
                itemSize={3}
              />
            </bufferGeometry>
            <lineBasicMaterial
              color={new THREE.Color().setHSL((layerIndex / layers.length) % 1, 0.8, 0.6)}
              transparent
              opacity={0.5}
              linewidth={2}
            />
          </lineLoop>

          {/* Ring */}
          <mesh rotation-x={0}>
            <torusGeometry args={[layer.radius, 0.05, 8, 64]} />
            <meshBasicMaterial
              color={new THREE.Color().setHSL((layerIndex / layers.length) % 1, 0.7, 0.5)}
              transparent
              opacity={0.4}
            />
          </mesh>
        </group>
      ))}

      {/* Center crystal */}
      <mesh>
        <octahedronGeometry args={[1, 0]} />
        <meshBasicMaterial
          color="#ffffff"
          transparent
          opacity={0.8}
          wireframe
        />
      </mesh>
    </group>
  );
}
