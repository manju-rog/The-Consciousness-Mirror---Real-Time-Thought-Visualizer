import { create } from 'zustand';
import {
  Interaction,
  StatisticalFeatures,
  BehavioralPattern,
  ConsciousnessState,
  VisualizationState,
  AudioParameters,
} from '@/types/interactions';

interface ConsciousnessStore {
  // Raw interaction data
  interactions: Interaction[];
  maxInteractions: number;

  // Processed data
  statisticalFeatures: StatisticalFeatures | null;
  behavioralPattern: BehavioralPattern | null;
  consciousnessState: ConsciousnessState | null;

  // Visualization state
  visualizationState: VisualizationState;

  // Audio state
  audioParameters: AudioParameters;
  audioEnabled: boolean;

  // Performance metrics
  fps: number;
  processingTime: number;

  // Settings
  particleCount: number;
  qualityLevel: 'low' | 'medium' | 'high' | 'ultra';
  trackingEnabled: boolean;

  // Actions
  addInteraction: (interaction: Interaction) => void;
  updateStatistics: (features: StatisticalFeatures) => void;
  updateBehavior: (pattern: BehavioralPattern) => void;
  updateConsciousness: (state: ConsciousnessState) => void;
  updateVisualization: (state: Partial<VisualizationState>) => void;
  updateAudio: (params: Partial<AudioParameters>) => void;
  setAudioEnabled: (enabled: boolean) => void;
  setParticleCount: (count: number) => void;
  setQualityLevel: (level: 'low' | 'medium' | 'high' | 'ultra') => void;
  setTrackingEnabled: (enabled: boolean) => void;
  clearInteractions: () => void;
  updateFPS: (fps: number) => void;
  updateProcessingTime: (time: number) => void;
}

export const useConsciousnessStore = create<ConsciousnessStore>((set, get) => ({
  // Initial state
  interactions: [],
  maxInteractions: 1000,
  statisticalFeatures: null,
  behavioralPattern: null,
  consciousnessState: null,
  visualizationState: {
    particles: [],
    particleCount: 100000,
    emotionColor: [0, 0, 0],
    energyLevel: 0,
    focusLevel: 0,
    chaosLevel: 0,
  },
  audioParameters: {
    focusPitch: 440,
    emotionFM: 0.5,
    stressnoise: 0,
    creativityArp: 0.5,
    volume: 0.7,
    filterCutoff: 1000,
    reverbMix: 0.3,
    panPosition: 0,
  },
  audioEnabled: false,
  fps: 60,
  processingTime: 0,
  particleCount: 100000,
  qualityLevel: 'high',
  trackingEnabled: true,

  // Actions
  addInteraction: (interaction) =>
    set((state) => {
      const newInteractions = [...state.interactions, interaction];
      // Keep only the last maxInteractions
      if (newInteractions.length > state.maxInteractions) {
        newInteractions.shift();
      }
      return { interactions: newInteractions };
    }),

  updateStatistics: (features) =>
    set({ statisticalFeatures: features }),

  updateBehavior: (pattern) =>
    set({ behavioralPattern: pattern }),

  updateConsciousness: (state) =>
    set({ consciousnessState: state }),

  updateVisualization: (newState) =>
    set((state) => ({
      visualizationState: { ...state.visualizationState, ...newState },
    })),

  updateAudio: (params) =>
    set((state) => ({
      audioParameters: { ...state.audioParameters, ...params },
    })),

  setAudioEnabled: (enabled) =>
    set({ audioEnabled: enabled }),

  setParticleCount: (count) =>
    set({ particleCount: count }),

  setQualityLevel: (level) =>
    set({ qualityLevel: level }),

  setTrackingEnabled: (enabled) =>
    set({ trackingEnabled: enabled }),

  clearInteractions: () =>
    set({ interactions: [] }),

  updateFPS: (fps) =>
    set({ fps }),

  updateProcessingTime: (time) =>
    set({ processingTime: time }),
}));
