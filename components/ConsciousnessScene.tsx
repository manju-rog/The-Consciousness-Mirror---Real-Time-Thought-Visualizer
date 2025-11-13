'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars, Environment } from '@react-three/drei';
import { ParticleSystem } from './ParticleSystem';
import { GalaxyVisualization } from './visualizations/GalaxyVisualization';
import { MandalaVisualization } from './visualizations/MandalaVisualization';
import { MatrixVisualization } from './visualizations/MatrixVisualization';
import { OceanVisualization } from './visualizations/OceanVisualization';
import { BrainVisualization } from './visualizations/BrainVisualization';
import { ForestVisualization } from './visualizations/ForestVisualization';
import { CrystalVisualization } from './visualizations/CrystalVisualization';
import { DNAVisualization } from './visualizations/DNAVisualization';
import { QuantumVisualization } from './visualizations/QuantumVisualization';
import { Suspense } from 'react';
import { useConsciousnessStore } from '@/store/consciousness';
import { EffectComposer, Bloom, DepthOfField } from '@react-three/postprocessing';

function VisualizationRenderer() {
  const visualizationSettings = useConsciousnessStore((state) => state.visualizationSettings);

  switch (visualizationSettings.mode) {
    case 'galaxy':
      return <GalaxyVisualization />;
    case 'mandala':
      return <MandalaVisualization />;
    case 'matrix':
      return <MatrixVisualization />;
    case 'ocean':
      return <OceanVisualization />;
    case 'brain':
      return <BrainVisualization />;
    case 'forest':
      return <ForestVisualization />;
    case 'crystal':
      return <CrystalVisualization />;
    case 'dna':
      return <DNAVisualization />;
    case 'quantum':
      return <QuantumVisualization />;
    case 'particles':
    default:
      return <ParticleSystem />;
  }
}

export function ConsciousnessScene() {
  const visualizationSettings = useConsciousnessStore((state) => state.visualizationSettings);

  return (
    <div className="w-full h-screen">
      <Canvas
        camera={{ position: [0, 0, 40], fov: 75 }}
        gl={{ antialias: true, alpha: true }}
      >
        <color attach="background" args={['#000000']} />

        {/* Lighting based on mode */}
        <ambientLight intensity={0.3} />
        <pointLight position={[10, 10, 10]} intensity={0.8} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#4444ff" />

        {/* Visualization */}
        <Suspense fallback={null}>
          <VisualizationRenderer />
        </Suspense>

        {/* Background stars (except for Matrix mode) */}
        {visualizationSettings.mode !== 'matrix' && visualizationSettings.mode !== 'ocean' && (
          <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        )}

        {/* Post-processing effects */}
        {(visualizationSettings.bloomEnabled ||
          visualizationSettings.depthOfFieldEnabled) && (
          <EffectComposer>
            {visualizationSettings.bloomEnabled && (
              <Bloom
                intensity={visualizationSettings.effectsIntensity}
                luminanceThreshold={0.2}
                luminanceSmoothing={0.9}
              />
            )}
            {visualizationSettings.depthOfFieldEnabled && (
              <DepthOfField
                focusDistance={0.01}
                focalLength={0.1}
                bokehScale={visualizationSettings.effectsIntensity * 5}
              />
            )}
          </EffectComposer>
        )}

        {/* Camera controls */}
        <OrbitControls
          enableZoom={true}
          enablePan={true}
          enableRotate={true}
          autoRotate={visualizationSettings.autoRotate}
          autoRotateSpeed={visualizationSettings.cameraSpeed}
          maxDistance={100}
          minDistance={10}
        />
      </Canvas>
    </div>
  );
}
