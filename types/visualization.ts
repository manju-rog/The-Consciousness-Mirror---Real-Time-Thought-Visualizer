export type VisualizationMode =
  | 'particles' // Default particle cloud
  | 'galaxy' // Stars and nebula
  | 'brain' // Anatomical brain regions
  | 'mandala' // Sacred geometry
  | 'matrix' // Code rain
  | 'ocean' // Wave patterns
  | 'forest' // Growing trees
  | 'crystal' // Geometric formations
  | 'dna' // Helical strands
  | 'cosmos' // Universe view
  | 'neural' // Neural network
  | 'quantum'; // Quantum field

export type ColorTheme =
  | 'default'
  | 'cosmic'
  | 'fire'
  | 'ice'
  | 'rainbow'
  | 'monochrome'
  | 'sunset'
  | 'aurora'
  | 'deep-sea'
  | 'forest';

export type ParticleStyle = 'dots' | 'spheres' | 'geometric' | 'sprites' | 'trails';

export interface VisualizationSettings {
  mode: VisualizationMode;
  colorTheme: ColorTheme;
  particleStyle: ParticleStyle;
  quality: 'low' | 'medium' | 'high' | 'ultra';
  showGrid: boolean;
  showStats: boolean;
  autoRotate: boolean;
  cameraSpeed: number;
  effectsIntensity: number;
  bloomEnabled: boolean;
  motionBlurEnabled: boolean;
  depthOfFieldEnabled: boolean;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  progress?: number;
  maxProgress?: number;
}

export interface ConsciousnessMetrics {
  focusStreak: number;
  maxFocusStreak: number;
  totalFlowTime: number;
  peakCreativity: number;
  emotionalBalance: number;
  stressManagement: number;
  mindfulness: number;
  consciousnessLevel: number;
}

export interface SocialConnection {
  id: string;
  userId: string;
  username: string;
  consciousnessState: any;
  visualizationMode: VisualizationMode;
  lastSync: number;
  empathyScore: number;
}
