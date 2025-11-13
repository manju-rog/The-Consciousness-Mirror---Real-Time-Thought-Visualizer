import {
  Interaction,
  MouseInteraction,
  KeyboardInteraction,
  ScrollInteraction,
  StatisticalFeatures,
} from '@/types/interactions';

/**
 * Calculate mean of an array
 */
function mean(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((sum, val) => sum + val, 0) / values.length;
}

/**
 * Calculate variance of an array
 */
function variance(values: number[], meanVal?: number): number {
  if (values.length === 0) return 0;
  const m = meanVal !== undefined ? meanVal : mean(values);
  return values.reduce((sum, val) => sum + Math.pow(val - m, 2), 0) / values.length;
}

/**
 * Calculate standard deviation
 */
function std(values: number[], meanVal?: number): number {
  return Math.sqrt(variance(values, meanVal));
}

/**
 * Calculate entropy of positions (for click positions)
 */
function calculateEntropy(positions: { x: number; y: number }[], gridSize = 50): number {
  if (positions.length === 0) return 0;

  // Create a grid and count occurrences in each cell
  const grid = new Map<string, number>();

  positions.forEach(({ x, y }) => {
    const gridX = Math.floor(x / gridSize);
    const gridY = Math.floor(y / gridSize);
    const key = `${gridX},${gridY}`;
    grid.set(key, (grid.get(key) || 0) + 1);
  });

  // Calculate entropy
  const total = positions.length;
  let entropy = 0;

  grid.forEach((count) => {
    const probability = count / total;
    entropy -= probability * Math.log2(probability);
  });

  return entropy;
}

/**
 * Calculate autocorrelation of a time series
 */
function autocorrelation(values: number[], lag: number): number {
  if (values.length < lag + 1) return 0;

  const m = mean(values);
  const v = variance(values, m);

  if (v === 0) return 0;

  let sum = 0;
  for (let i = 0; i < values.length - lag; i++) {
    sum += (values[i] - m) * (values[i + lag] - m);
  }

  return sum / ((values.length - lag) * v);
}

/**
 * Calculate movement smoothness coefficient
 * Based on the number of direction changes and velocity consistency
 */
function calculateSmoothness(velocities: number[]): number {
  if (velocities.length < 2) return 1;

  let directionChanges = 0;
  for (let i = 1; i < velocities.length; i++) {
    if ((velocities[i] > 0 && velocities[i - 1] < 0) || (velocities[i] < 0 && velocities[i - 1] > 0)) {
      directionChanges++;
    }
  }

  // More direction changes = less smooth
  const changeRatio = directionChanges / velocities.length;
  return 1 - Math.min(changeRatio, 1);
}

/**
 * Process interaction window and extract statistical features
 */
export function processInteractions(interactions: Interaction[]): StatisticalFeatures {
  const startTime = performance.now();

  // Filter interactions by type
  const mouseInteractions = interactions.filter(
    (i) => i.type === 'mousemove'
  ) as MouseInteraction[];
  const clickInteractions = interactions.filter(
    (i) => i.type === 'click' || i.type === 'mousedown'
  ) as MouseInteraction[];
  const keyboardInteractions = interactions.filter(
    (i) => i.type === 'keydown'
  ) as KeyboardInteraction[];
  const scrollInteractions = interactions.filter((i) => i.type === 'scroll') as ScrollInteraction[];

  // Mouse velocity statistics
  const velocities = mouseInteractions
    .map((i) => {
      if (i.velocityX !== undefined && i.velocityY !== undefined) {
        return Math.sqrt(i.velocityX ** 2 + i.velocityY ** 2);
      }
      return 0;
    })
    .filter((v) => !isNaN(v) && isFinite(v));

  const mouseVelocityMean = mean(velocities);
  const mouseVelocityVariance = variance(velocities, mouseVelocityMean);
  const mouseVelocityStd = std(velocities, mouseVelocityMean);

  // Mouse acceleration statistics
  const accelerations = mouseInteractions
    .map((i) => {
      if (i.accelerationX !== undefined && i.accelerationY !== undefined) {
        return Math.sqrt(i.accelerationX ** 2 + i.accelerationY ** 2);
      }
      return 0;
    })
    .filter((a) => !isNaN(a) && isFinite(a));

  const mouseAccelerationMean = mean(accelerations);
  const mouseAccelerationVariance = variance(accelerations, mouseAccelerationMean);

  // Mouse jerk statistics
  const jerks = mouseInteractions
    .map((i) => i.jerk || 0)
    .filter((j) => !isNaN(j) && isFinite(j));
  const mouseJerkMean = mean(jerks);

  // Click position entropy
  const clickPositions = clickInteractions.map((i) => ({ x: i.x, y: i.y }));
  const clickPositionEntropy = calculateEntropy(clickPositions);

  // Typing rhythm statistics
  const typingIntervals = keyboardInteractions
    .map((i) => i.timeSinceLastKey || 0)
    .filter((t) => t > 0 && t < 5000); // Filter out outliers

  const typingRhythmMean = mean(typingIntervals);
  const typingRhythmVariance = variance(typingIntervals, typingRhythmMean);

  // Backspace frequency
  const backspaceCount = keyboardInteractions.filter((i) => i.isBackspace).length;
  const backspaceFrequency = keyboardInteractions.length > 0 ? backspaceCount / keyboardInteractions.length : 0;

  // Scroll speed statistics
  const scrollSpeeds = scrollInteractions
    .map((i) => Math.sqrt(i.velocityX ** 2 + i.velocityY ** 2))
    .filter((s) => !isNaN(s) && isFinite(s));
  const scrollSpeedMean = mean(scrollSpeeds);

  // Movement smoothness
  const velocityX = mouseInteractions.map((i) => i.velocityX || 0);
  const velocityY = mouseInteractions.map((i) => i.velocityY || 0);
  const movementSmoothnessCoefficient = (calculateSmoothness(velocityX) + calculateSmoothness(velocityY)) / 2;

  // Pause detection
  let pauseCount = 0;
  let totalPauseDuration = 0;
  const PAUSE_THRESHOLD = 500; // ms

  for (let i = 1; i < interactions.length; i++) {
    const timeDiff = interactions[i].timestamp - interactions[i - 1].timestamp;
    if (timeDiff > PAUSE_THRESHOLD) {
      pauseCount++;
      totalPauseDuration += timeDiff;
    }
  }

  const pauseFrequency = interactions.length > 0 ? pauseCount / interactions.length : 0;
  const pauseDurationMean = pauseCount > 0 ? totalPauseDuration / pauseCount : 0;

  // Interaction density (interactions per second)
  const timeSpan =
    interactions.length > 1
      ? (interactions[interactions.length - 1].timestamp - interactions[0].timestamp) / 1000
      : 1;
  const interactionDensity = interactions.length / timeSpan;

  // Path curvature statistics
  const curvatures = mouseInteractions
    .map((i) => i.curvature || 0)
    .filter((c) => !isNaN(c) && isFinite(c));
  const pathCurvatureMean = mean(curvatures);
  const pathCurvatureVariance = variance(curvatures, pathCurvatureMean);

  // Click duration statistics
  const clickDurations = clickInteractions.map((i) => i.pressure || 0);
  const clickDurationMean = mean(clickDurations);

  // Double-click speed (inverse of time between clicks)
  const clickTimes = clickInteractions.map((i) => i.timestamp).sort((a, b) => a - b);
  const clickIntervals: number[] = [];
  for (let i = 1; i < clickTimes.length; i++) {
    const interval = clickTimes[i] - clickTimes[i - 1];
    if (interval < 1000) {
      // Only consider rapid clicks
      clickIntervals.push(interval);
    }
  }
  const doubleClickSpeed = clickIntervals.length > 0 ? 1000 / mean(clickIntervals) : 0;

  // Idle time (time since last interaction)
  const idleTime = interactions.length > 0 ? Date.now() - interactions[interactions.length - 1].timestamp : 0;

  const processingTime = performance.now() - startTime;

  return {
    mouseVelocityMean,
    mouseVelocityVariance,
    mouseVelocityStd,
    mouseAccelerationMean,
    mouseAccelerationVariance,
    mouseJerkMean,
    clickPositionEntropy,
    typingRhythmMean,
    typingRhythmVariance,
    backspaceFrequency,
    scrollSpeedMean,
    movementSmoothnessCoefficient,
    pauseFrequency,
    pauseDurationMean,
    interactionDensity,
    pathCurvatureMean,
    pathCurvatureVariance,
    clickDurationMean,
    doubleClickSpeed,
    idleTime,
  };
}

/**
 * Apply FFT for frequency domain analysis
 * Simplified version - in production, use a proper FFT library
 */
export function frequencyAnalysis(values: number[]): { dominantFrequency: number; spectrum: number[] } {
  // This is a placeholder for proper FFT analysis
  // In a real implementation, we'd use a library like fft.js
  const spectrum: number[] = [];
  let dominantFrequency = 0;

  // Simple autocorrelation-based frequency detection
  let maxCorr = -Infinity;
  for (let lag = 1; lag < Math.min(values.length / 2, 100); lag++) {
    const corr = autocorrelation(values, lag);
    if (corr > maxCorr) {
      maxCorr = corr;
      dominantFrequency = 1 / lag;
    }
  }

  return { dominantFrequency, spectrum };
}
