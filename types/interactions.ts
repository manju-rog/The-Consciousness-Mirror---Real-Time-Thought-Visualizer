// Core interaction data types

export interface MouseInteraction {
  type: 'mousemove' | 'click' | 'mousedown' | 'mouseup' | 'dblclick' | 'hover';
  timestamp: number;
  x: number;
  y: number;
  velocityX?: number;
  velocityY?: number;
  accelerationX?: number;
  accelerationY?: number;
  jerk?: number;
  curvature?: number;
  pressure?: number; // Duration as proxy for pressure
  targetElement?: string;
}

export interface KeyboardInteraction {
  type: 'keydown' | 'keyup';
  timestamp: number;
  key: string;
  code: string;
  isBackspace: boolean;
  timeSinceLastKey?: number;
}

export interface ScrollInteraction {
  type: 'scroll';
  timestamp: number;
  scrollY: number;
  scrollX: number;
  velocityY: number;
  velocityX: number;
}

export interface TouchInteraction {
  type: 'touchstart' | 'touchmove' | 'touchend';
  timestamp: number;
  x: number;
  y: number;
  pressure: number;
  radiusX: number;
  radiusY: number;
}

export interface DeviceInteraction {
  type: 'focus' | 'blur' | 'resize' | 'orientation';
  timestamp: number;
  data?: any;
}

export type Interaction =
  | MouseInteraction
  | KeyboardInteraction
  | ScrollInteraction
  | TouchInteraction
  | DeviceInteraction;

export interface InteractionWindow {
  interactions: Interaction[];
  startTime: number;
  endTime: number;
  maxSize: number;
}

// Statistical features
export interface StatisticalFeatures {
  mouseVelocityMean: number;
  mouseVelocityVariance: number;
  mouseVelocityStd: number;
  mouseAccelerationMean: number;
  mouseAccelerationVariance: number;
  mouseJerkMean: number;
  clickPositionEntropy: number;
  typingRhythmMean: number;
  typingRhythmVariance: number;
  backspaceFrequency: number;
  scrollSpeedMean: number;
  movementSmoothnessCoefficient: number;
  pauseFrequency: number;
  pauseDurationMean: number;
  interactionDensity: number;
  pathCurvatureMean: number;
  pathCurvatureVariance: number;
  clickDurationMean: number;
  doubleClickSpeed: number;
  idleTime: number;
}

// Behavioral patterns
export type BehaviorState =
  | 'frustration'
  | 'focus'
  | 'confusion'
  | 'excitement'
  | 'calmness'
  | 'stress'
  | 'boredom'
  | 'discovery'
  | 'neutral';

export interface BehavioralPattern {
  state: BehaviorState;
  confidence: number;
  intensity: number;
  timestamp: number;
  features: Partial<StatisticalFeatures>;
  description: string;
}

// Consciousness state (for TensorFlow.js output)
export interface ConsciousnessState {
  emotionalValence: number; // -1 to 1
  arousalLevel: number; // 0 to 1
  cognitiveLoad: number; // 0 to 1
  focusDepth: number; // 0 to 1
  creativityIndex: number; // 0 to 1
  stressLevel: number; // 0 to 1
  flowStateProbability: number; // 0 to 1
  mindWandering: number; // 0 to 1
  confidence: number; // 0 to 1
  timestamp: number;
}

// Particle system types
export interface ParticleType {
  type: 'emotion' | 'thought' | 'focus' | 'memory';
  position: [number, number, number];
  velocity: [number, number, number];
  color: [number, number, number]; // HSL
  size: number;
  lifetime: number;
  maxLifetime: number;
  connectionStrength: number;
  behavior: string;
}

export interface VisualizationState {
  particles: ParticleType[];
  particleCount: number;
  emotionColor: [number, number, number];
  energyLevel: number;
  focusLevel: number;
  chaosLevel: number;
}

// Audio synthesis types
export interface AudioParameters {
  focusPitch: number;
  emotionFM: number;
  stressnoise: number;
  creativityArp: number;
  volume: number;
  filterCutoff: number;
  reverbMix: number;
  panPosition: number;
}
