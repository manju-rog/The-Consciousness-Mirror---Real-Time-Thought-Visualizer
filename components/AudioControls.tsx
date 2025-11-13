'use client';

import { useConsciousnessStore } from '@/store/consciousness';

export function AudioControls() {
  const audioEnabled = useConsciousnessStore((state) => state.audioEnabled);
  const setAudioEnabled = useConsciousnessStore((state) => state.setAudioEnabled);
  const consciousnessState = useConsciousnessStore((state) => state.consciousnessState);

  return (
    <div className="fixed bottom-8 right-8 z-40 bg-black/80 backdrop-blur-md rounded-lg p-4 text-white">
      <div className="flex items-center gap-3">
        <button
          onClick={() => setAudioEnabled(!audioEnabled)}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            audioEnabled
              ? 'bg-purple-600 hover:bg-purple-700'
              : 'bg-white/20 hover:bg-white/30'
          }`}
        >
          {audioEnabled ? '🔊 Audio On' : '🔇 Audio Off'}
        </button>

        {audioEnabled && consciousnessState && (
          <div className="text-xs text-white/60">
            <div>Soundscape active</div>
            <div className="flex gap-2 mt-1">
              <span>Flow: {(consciousnessState.flowStateProbability * 100).toFixed(0)}%</span>
              <span>•</span>
              <span>Energy: {(consciousnessState.arousalLevel * 100).toFixed(0)}%</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
