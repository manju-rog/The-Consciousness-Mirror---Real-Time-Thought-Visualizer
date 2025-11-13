import { useEffect, useRef } from 'react';
import { useConsciousnessStore } from '@/store/consciousness';
import { getConsciousnessAudio } from '@/lib/audioSynthesis';

/**
 * Hook to manage audio synthesis based on consciousness state
 */
export function useAudioSynthesis() {
  const audioEnabled = useConsciousnessStore((state) => state.audioEnabled);
  const consciousnessState = useConsciousnessStore((state) => state.consciousnessState);
  const statisticalFeatures = useConsciousnessStore((state) => state.statisticalFeatures);

  const audioRef = useRef(getConsciousnessAudio());
  const updateInterval = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const audio = audioRef.current;

    if (audioEnabled) {
      // Initialize and start audio
      audio.initialize().then(() => {
        audio.start();
      });

      // Update audio parameters every 100ms
      updateInterval.current = setInterval(() => {
        if (consciousnessState && statisticalFeatures) {
          audio.update(consciousnessState, statisticalFeatures);
        }
      }, 100);
    } else {
      // Stop audio
      audio.stop();
      if (updateInterval.current) {
        clearInterval(updateInterval.current);
      }
    }

    return () => {
      if (updateInterval.current) {
        clearInterval(updateInterval.current);
      }
    };
  }, [audioEnabled, consciousnessState, statisticalFeatures]);

  return {
    audioEnabled,
  };
}
