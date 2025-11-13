'use client';

import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useConsciousnessStore } from '@/store/consciousness';
import { getBehaviorColor } from '@/lib/behaviorRecognition';

interface Particle {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  color: THREE.Color;
  size: number;
  lifetime: number;
  maxLifetime: number;
  type: 'emotion' | 'thought' | 'focus' | 'memory';
}

export function ParticleSystem() {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const particlesRef = useRef<Particle[]>([]);

  const behavioralPattern = useConsciousnessStore((state) => state.behavioralPattern);
  const statisticalFeatures = useConsciousnessStore((state) => state.statisticalFeatures);
  const particleCount = useConsciousnessStore((state) => state.particleCount);
  const updateFPS = useConsciousnessStore((state) => state.updateFPS);

  // Initialize particles
  useEffect(() => {
    const particles: Particle[] = [];

    for (let i = 0; i < particleCount; i++) {
      const type: Particle['type'] = ['emotion', 'thought', 'focus', 'memory'][
        Math.floor(Math.random() * 4)
      ] as Particle['type'];

      particles.push({
        position: new THREE.Vector3(
          (Math.random() - 0.5) * 50,
          (Math.random() - 0.5) * 50,
          (Math.random() - 0.5) * 50
        ),
        velocity: new THREE.Vector3(
          (Math.random() - 0.5) * 0.1,
          (Math.random() - 0.5) * 0.1,
          (Math.random() - 0.5) * 0.1
        ),
        color: new THREE.Color(Math.random(), Math.random(), Math.random()),
        size: Math.random() * 0.5 + 0.1,
        lifetime: Math.random() * 100,
        maxLifetime: 100 + Math.random() * 100,
        type,
      });
    }

    particlesRef.current = particles;
  }, [particleCount]);

  // Update particles every frame
  useFrame((state, delta) => {
    if (!meshRef.current || !particlesRef.current.length) return;

    const time = state.clock.elapsedTime;
    const dummy = new THREE.Object3D();
    const particles = particlesRef.current;

    // Get behavior-based parameters
    const behaviorState = behavioralPattern?.state || 'neutral';
    const intensity = behavioralPattern?.intensity || 0.5;
    const [hue, sat, light] = getBehaviorColor(behaviorState);

    // Calculate consciousness metrics
    const emotionalIntensity = intensity;
    const focusLevel = statisticalFeatures?.movementSmoothnessCoefficient || 0.5;
    const energyLevel = Math.min((statisticalFeatures?.mouseVelocityMean || 0) / 1000, 1);
    const chaosLevel = Math.min((statisticalFeatures?.mouseJerkMean || 0) / 10000, 1);

    // Update each particle
    for (let i = 0; i < particles.length; i++) {
      const particle = particles[i];

      // Update lifetime
      particle.lifetime += delta * 60;
      if (particle.lifetime > particle.maxLifetime) {
        particle.lifetime = 0;
        // Respawn particle
        particle.position.set(
          (Math.random() - 0.5) * 50,
          (Math.random() - 0.5) * 50,
          (Math.random() - 0.5) * 50
        );
      }

      const lifetimeFactor = Math.sin((particle.lifetime / particle.maxLifetime) * Math.PI);

      // Particle behavior based on type
      if (particle.type === 'emotion') {
        // Emotion particles: Inner core, pulsing
        const targetRadius = 5 + emotionalIntensity * 10;
        const currentRadius = particle.position.length();
        const radiusDiff = targetRadius - currentRadius;

        particle.velocity.add(particle.position.clone().normalize().multiplyScalar(radiusDiff * 0.01));

        // Color based on emotion
        particle.color.setHSL(hue / 360, sat / 100, light / 100);

        // Size pulses with emotion
        particle.size = 0.2 + emotionalIntensity * 0.3 * (1 + Math.sin(time * 2) * 0.3);
      } else if (particle.type === 'thought') {
        // Thought particles: Spawn from center, move outward
        const spawnRate = (statisticalFeatures?.interactionDensity || 0) / 10;

        if (Math.random() < spawnRate * delta) {
          particle.position.set(0, 0, 0);
          const angle = Math.random() * Math.PI * 2;
          const elevation = (Math.random() - 0.5) * Math.PI;
          particle.velocity.set(
            Math.cos(angle) * Math.cos(elevation) * 0.2,
            Math.sin(elevation) * 0.2,
            Math.sin(angle) * Math.cos(elevation) * 0.2
          );
        }

        // Brightness based on confidence
        const brightness = 0.5 + (behavioralPattern?.confidence || 0) * 0.5;
        particle.color.setHSL((hue + 30) / 360, 0.7, brightness);

        particle.size = 0.15 * lifetimeFactor;
      } else if (particle.type === 'focus') {
        // Focus particles: Orbit when focused, scatter when distracted
        const orbitRadius = 20;
        const orbitSpeed = (1 - focusLevel) * 2 + 0.5;

        if (focusLevel > 0.5) {
          // Orbit mode
          const angle = (time * orbitSpeed + i) / 10;
          const targetX = Math.cos(angle) * orbitRadius;
          const targetZ = Math.sin(angle) * orbitRadius;
          const targetY = Math.sin(angle * 2) * 5;

          particle.velocity.lerp(
            new THREE.Vector3(targetX - particle.position.x, targetY - particle.position.y, targetZ - particle.position.z).multiplyScalar(
              0.1
            ),
            0.1
          );
        } else {
          // Scatter mode
          particle.velocity.add(
            new THREE.Vector3((Math.random() - 0.5) * 0.01, (Math.random() - 0.5) * 0.01, (Math.random() - 0.5) * 0.01)
          );
        }

        particle.color.setHSL((hue + 60) / 360, 0.8, 0.6);
        particle.size = 0.1 + focusLevel * 0.2;
      } else if (particle.type === 'memory') {
        // Memory particles: Trails, fade over time
        particle.velocity.multiplyScalar(0.98); // Damping

        const age = particle.lifetime / particle.maxLifetime;
        particle.color.setHSL((hue + 90) / 360, 0.6, 0.7 * (1 - age));
        particle.size = 0.08 * (1 - age);
      }

      // Apply velocity
      particle.position.add(particle.velocity.clone().multiplyScalar(delta * 60));

      // Apply forces
      // Gravity to center (weak)
      const distanceFromCenter = particle.position.length();
      if (distanceFromCenter > 30) {
        const gravityForce = particle.position.clone().normalize().multiplyScalar(-0.001);
        particle.velocity.add(gravityForce);
      }

      // Turbulence during confusion/chaos
      if (chaosLevel > 0.5) {
        particle.velocity.add(
          new THREE.Vector3(
            (Math.random() - 0.5) * chaosLevel * 0.02,
            (Math.random() - 0.5) * chaosLevel * 0.02,
            (Math.random() - 0.5) * chaosLevel * 0.02
          )
        );
      }

      // Velocity damping
      particle.velocity.multiplyScalar(0.99);

      // Update instance matrix
      dummy.position.copy(particle.position);
      dummy.scale.setScalar(particle.size);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);

      // Update color
      meshRef.current.setColorAt(i, particle.color);
    }

    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) {
      meshRef.current.instanceColor.needsUpdate = true;
    }

    // Update FPS
    updateFPS(1 / delta);
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, particleCount]}>
      <sphereGeometry args={[1, 8, 8]} />
      <meshBasicMaterial />
    </instancedMesh>
  );
}
