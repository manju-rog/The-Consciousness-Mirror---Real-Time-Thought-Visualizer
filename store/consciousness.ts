import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  Interaction,
  StatisticalFeatures,
  BehavioralPattern,
  ConsciousnessState,
  VisualizationState,
  AudioParameters,
} from '@/types/interactions';
import {
  VisualizationMode,
  ColorTheme,
  ParticleStyle,
  VisualizationSettings,
  Achievement,
  ConsciousnessMetrics,
  SocialConnection,
} from '@/types/visualization';

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
  visualizationSettings: VisualizationSettings;

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

  // Gamification
  achievements: Achievement[];
  metrics: ConsciousnessMetrics;

  // Social
  connections: SocialConnection[];
  isSharing: boolean;

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

  // New actions
  setVisualizationMode: (mode: VisualizationMode) => void;
  setColorTheme: (theme: ColorTheme) => void;
  setParticleStyle: (style: ParticleStyle) => void;
  updateVisualizationSettings: (settings: Partial<VisualizationSettings>) => void;
  unlockAchievement: (achievementId: string) => void;
  updateMetrics: (metrics: Partial<ConsciousnessMetrics>) => void;
  addConnection: (connection: SocialConnection) => void;
  removeConnection: (connectionId: string) => void;
  setSharing: (sharing: boolean) => void;
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
  visualizationSettings: {
    mode: 'particles',
    colorTheme: 'default',
    particleStyle: 'spheres',
    quality: 'high',
    showGrid: false,
    showStats: true,
    autoRotate: true,
    cameraSpeed: 0.5,
    effectsIntensity: 0.7,
    bloomEnabled: true,
    motionBlurEnabled: false,
    depthOfFieldEnabled: false,
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
  achievements: [],
  metrics: {
    focusStreak: 0,
    maxFocusStreak: 0,
    totalFlowTime: 0,
    peakCreativity: 0,
    emotionalBalance: 0.5,
    stressManagement: 0.5,
    mindfulness: 0,
    consciousnessLevel: 1,
  },
  connections: [],
  isSharing: false,

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

  // New actions
  setVisualizationMode: (mode) =>
    set((state) => ({
      visualizationSettings: { ...state.visualizationSettings, mode },
    })),

  setColorTheme: (theme) =>
    set((state) => ({
      visualizationSettings: { ...state.visualizationSettings, colorTheme: theme },
    })),

  setParticleStyle: (style) =>
    set((state) => ({
      visualizationSettings: { ...state.visualizationSettings, particleStyle: style },
    })),

  updateVisualizationSettings: (settings) =>
    set((state) => ({
      visualizationSettings: { ...state.visualizationSettings, ...settings },
    })),

  unlockAchievement: (achievementId) =>
    set((state) => ({
      achievements: state.achievements.map((a) =>
        a.id === achievementId ? { ...a, unlocked: true, unlockedAt: Date.now() } : a
      ),
    })),

  updateMetrics: (metrics) =>
    set((state) => ({
      metrics: { ...state.metrics, ...metrics },
    })),

  addConnection: (connection) =>
    set((state) => ({
      connections: [...state.connections, connection],
    })),

  removeConnection: (connectionId) =>
    set((state) => ({
      connections: state.connections.filter((c) => c.id !== connectionId),
    })),

  setSharing: (sharing) =>
    set({ isSharing: sharing }),
}));
