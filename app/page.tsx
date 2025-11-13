'use client';

import dynamic from 'next/dynamic';
import { DebugPanel } from '@/components/DebugPanel';
import { AudioControls } from '@/components/AudioControls';
import { VisualizationControls } from '@/components/VisualizationControls';
import { MetricsDashboard } from '@/components/MetricsDashboard';
import { AchievementsPanel } from '@/components/AchievementsPanel';
import { ConsciousnessExport } from '@/components/ConsciousnessExport';
import { useInteractionTracking } from '@/hooks/useInteractionTracking';
import { useDataProcessing } from '@/hooks/useDataProcessing';
import { useAudioSynthesis } from '@/hooks/useAudioSynthesis';
import { useConsciousnessStore } from '@/store/consciousness';

// Dynamically import Three.js scene to avoid SSR issues
const ConsciousnessScene = dynamic(() => import('@/components/ConsciousnessScene').then(mod => ({ default: mod.ConsciousnessScene })), {
  ssr: false,
  loading: () => (
    <div className="w-full h-screen flex items-center justify-center bg-black">
      <div className="text-white/60">Initializing consciousness mirror...</div>
    </div>
  ),
});

export default function Home() {
  // Initialize tracking and processing
  useInteractionTracking();
  useDataProcessing();
  useAudioSynthesis();

  const behavioralPattern = useConsciousnessStore((state) => state.behavioralPattern);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      {/* Main visualization */}
      <ConsciousnessScene />

      {/* Debug panel */}
      <DebugPanel />

      {/* Visualization controls */}
      <VisualizationControls />

      {/* Audio controls */}
      <AudioControls />

      {/* Metrics Dashboard */}
      <MetricsDashboard />

      {/* Achievements */}
      <AchievementsPanel />

      {/* Export/Share */}
      <ConsciousnessExport />

      {/* Title overlay */}
      <div className="absolute top-8 left-8 z-40 pointer-events-none">
        <h1 className="text-5xl font-bold text-white/90 mb-2 tracking-tight">
          The Consciousness Mirror
        </h1>
        <p className="text-white/60 text-lg">
          Real-time behavioral visualization
        </p>
        {behavioralPattern && (
          <div className="mt-4 text-white/80 text-sm">
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full animate-pulse"
                style={{
                  backgroundColor: `hsl(${
                    {
                      frustration: '0',
                      focus: '120',
                      confusion: '45',
                      excitement: '280',
                      calmness: '200',
                      stress: '0',
                      boredom: '0',
                      discovery: '180',
                      neutral: '0',
                    }[behavioralPattern.state]
                  }, 70%, 50%)`,
                }}
              />
              <span className="capitalize font-medium">
                {behavioralPattern.state}
              </span>
              <span className="text-white/40">•</span>
              <span className="text-white/60">
                {(behavioralPattern.confidence * 100).toFixed(0)}% confidence
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Instructions overlay */}
      <div className="absolute bottom-8 left-8 z-40 text-white/40 text-sm max-w-md pointer-events-none">
        <p>
          Move your mouse, type, click, and interact with the page. Your behavioral patterns will be
          analyzed and visualized in real-time as a consciousness map.
        </p>
      </div>
    </div>
  );
}
