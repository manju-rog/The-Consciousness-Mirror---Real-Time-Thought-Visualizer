import { useEffect, useRef } from 'react';
import { useConsciousnessStore } from '@/store/consciousness';
import { processInteractions } from '@/lib/dataProcessing';
import { detectBehaviorPattern } from '@/lib/behaviorRecognition';
import { getConsciousnessClassifier } from '@/lib/consciousnessClassifier';

/**
 * Hook to process interactions and update consciousness state
 * Runs every 100ms to keep the analysis real-time
 */
export function useDataProcessing() {
  const interactions = useConsciousnessStore((state) => state.interactions);
  const updateStatistics = useConsciousnessStore((state) => state.updateStatistics);
  const updateBehavior = useConsciousnessStore((state) => state.updateBehavior);
  const updateConsciousness = useConsciousnessStore((state) => state.updateConsciousness);
  const updateProcessingTime = useConsciousnessStore((state) => state.updateProcessingTime);

  const processingInterval = useRef<NodeJS.Timeout>();
  const classifierRef = useRef(getConsciousnessClassifier());

  useEffect(() => {
    // Process data every 100ms
    processingInterval.current = setInterval(async () => {
      if (interactions.length < 10) return; // Need minimum data

      const startTime = performance.now();

      // Process statistical features
      const features = processInteractions(interactions);
      updateStatistics(features);

      // Detect behavioral pattern
      const pattern = detectBehaviorPattern(features);
      updateBehavior(pattern);

      // Run TensorFlow.js consciousness classifier
      try {
        const consciousnessState = await classifierRef.current.predict(features, pattern);
        updateConsciousness(consciousnessState);
      } catch (error) {
        console.error('Consciousness prediction error:', error);
      }

      const processingTime = performance.now() - startTime;
      updateProcessingTime(processingTime);
    }, 100);

    return () => {
      if (processingInterval.current) {
        clearInterval(processingInterval.current);
      }
    };
  }, [interactions, updateStatistics, updateBehavior, updateConsciousness, updateProcessingTime]);
}
