import { StatisticalFeatures, BehavioralPattern, BehaviorState } from '@/types/interactions';

/**
 * Detect behavioral patterns from statistical features
 */
export function detectBehaviorPattern(features: StatisticalFeatures): BehavioralPattern {
  // Calculate scores for each behavior state
  const scores = {
    frustration: calculateFrustrationScore(features),
    focus: calculateFocusScore(features),
    confusion: calculateConfusionScore(features),
    excitement: calculateExcitementScore(features),
    calmness: calculateCalmnessScore(features),
    stress: calculateStressScore(features),
    boredom: calculateBoredomScore(features),
    discovery: calculateDiscoveryScore(features),
  };

  // Find the dominant behavior state
  let dominantState: BehaviorState = 'neutral';
  let maxScore = 0;

  Object.entries(scores).forEach(([state, score]) => {
    if (score > maxScore) {
      maxScore = score;
      dominantState = state as BehaviorState;
    }
  });

  // Calculate confidence (how much the dominant state stands out)
  const scoreValues = Object.values(scores);
  const meanScore = scoreValues.reduce((a, b) => a + b, 0) / scoreValues.length;
  const confidence = maxScore > 0 ? Math.min((maxScore - meanScore) / maxScore, 1) : 0;

  // Get description
  const description = getBehaviorDescription(dominantState, features);

  return {
    state: dominantState,
    confidence: Math.max(0, Math.min(1, confidence)),
    intensity: Math.max(0, Math.min(1, maxScore)),
    timestamp: Date.now(),
    features,
    description,
  };
}

/**
 * Calculate frustration score
 * Indicators: Rapid clicking, erratic movement, high acceleration, high jerk
 */
function calculateFrustrationScore(features: StatisticalFeatures): number {
  let score = 0;

  // Rapid, erratic movements
  if (features.mouseVelocityMean > 500) score += 0.3;
  if (features.mouseAccelerationVariance > 1000) score += 0.2;
  if (features.mouseJerkMean > 5000) score += 0.2;

  // Low movement smoothness
  if (features.movementSmoothnessCoefficient < 0.3) score += 0.2;

  // Rapid clicking
  if (features.doubleClickSpeed > 3) score += 0.15;

  // High backspace frequency (frustration with typing)
  if (features.backspaceFrequency > 0.2) score += 0.1;

  return Math.min(score, 1);
}

/**
 * Calculate focus score
 * Indicators: Smooth movements, consistent typing, low idle time
 */
function calculateFocusScore(features: StatisticalFeatures): number {
  let score = 0;

  // Smooth, deliberate movements
  if (features.movementSmoothnessCoefficient > 0.7) score += 0.3;
  if (features.mouseVelocityMean > 100 && features.mouseVelocityMean < 400) score += 0.2;

  // Consistent typing rhythm
  if (features.typingRhythmMean > 100 && features.typingRhythmMean < 500) score += 0.2;
  if (features.typingRhythmVariance < 10000) score += 0.1;

  // Low backspace frequency (confident typing)
  if (features.backspaceFrequency < 0.1) score += 0.1;

  // Active interaction
  if (features.idleTime < 2000) score += 0.1;
  if (features.interactionDensity > 5) score += 0.1;

  return Math.min(score, 1);
}

/**
 * Calculate confusion score
 * Indicators: Hovering, slow movements, frequent backspaces, pauses
 */
function calculateConfusionScore(features: StatisticalFeatures): number {
  let score = 0;

  // Slow, hesitant movements
  if (features.mouseVelocityMean < 150) score += 0.2;
  if (features.pauseFrequency > 0.3) score += 0.2;
  if (features.pauseDurationMean > 1000) score += 0.15;

  // High backspace frequency (uncertainty)
  if (features.backspaceFrequency > 0.15) score += 0.2;

  // Low interaction density
  if (features.interactionDensity < 3) score += 0.15;

  // Erratic but slow
  if (features.pathCurvatureVariance > 0.5 && features.mouseVelocityMean < 200) score += 0.1;

  return Math.min(score, 1);
}

/**
 * Calculate excitement score
 * Indicators: Fast movements, rapid interactions, high energy
 */
function calculateExcitementScore(features: StatisticalFeatures): number {
  let score = 0;

  // Fast, energetic movements
  if (features.mouseVelocityMean > 600) score += 0.3;
  if (features.interactionDensity > 10) score += 0.25;

  // Rapid typing
  if (features.typingRhythmMean < 200) score += 0.2;

  // Active scrolling
  if (features.scrollSpeedMean > 500) score += 0.15;

  // Smooth but fast
  if (features.movementSmoothnessCoefficient > 0.5 && features.mouseVelocityMean > 500) score += 0.1;

  return Math.min(score, 1);
}

/**
 * Calculate calmness score
 * Indicators: Slow, smooth movements, regular patterns, low variance
 */
function calculateCalmnessScore(features: StatisticalFeatures): number {
  let score = 0;

  // Slow, smooth movements
  if (features.mouseVelocityMean < 300 && features.mouseVelocityMean > 50) score += 0.3;
  if (features.movementSmoothnessCoefficient > 0.8) score += 0.25;

  // Low acceleration and jerk
  if (features.mouseAccelerationMean < 500) score += 0.15;
  if (features.mouseJerkMean < 2000) score += 0.1;

  // Regular typing
  if (features.typingRhythmVariance < 5000 && features.typingRhythmMean > 200) score += 0.15;

  // Few pauses but not rushed
  if (features.pauseFrequency < 0.2) score += 0.05;

  return Math.min(score, 1);
}

/**
 * Calculate stress score
 * Indicators: Jagged movements, long clicks (force), high jerk
 */
function calculateStressScore(features: StatisticalFeatures): number {
  let score = 0;

  // Jagged, tense movements
  if (features.mouseJerkMean > 7000) score += 0.3;
  if (features.movementSmoothnessCoefficient < 0.4) score += 0.2;

  // Long click durations (pressing hard)
  if (features.clickDurationMean > 150) score += 0.2;

  // High acceleration variance (inconsistent)
  if (features.mouseAccelerationVariance > 2000) score += 0.15;

  // Frequent backspaces
  if (features.backspaceFrequency > 0.25) score += 0.1;

  // High path curvature variance (shaky)
  if (features.pathCurvatureVariance > 1) score += 0.05;

  return Math.min(score, 1);
}

/**
 * Calculate boredom score
 * Indicators: Repetitive patterns, idle periods, slow movements
 */
function calculateBoredomScore(features: StatisticalFeatures): number {
  let score = 0;

  // Long idle time
  if (features.idleTime > 3000) score += 0.3;

  // Low interaction density
  if (features.interactionDensity < 2) score += 0.25;

  // Slow movements
  if (features.mouseVelocityMean < 100) score += 0.2;

  // Frequent pauses
  if (features.pauseFrequency > 0.4) score += 0.15;

  // Low click entropy (repetitive clicking)
  if (features.clickPositionEntropy < 2) score += 0.1;

  return Math.min(score, 1);
}

/**
 * Calculate discovery score
 * Indicators: Exploratory movements, varied interactions, high entropy
 */
function calculateDiscoveryScore(features: StatisticalFeatures): number {
  let score = 0;

  // High click position entropy (exploring different areas)
  if (features.clickPositionEntropy > 4) score += 0.3;

  // High interaction density (actively exploring)
  if (features.interactionDensity > 7) score += 0.2;

  // Varied movements
  if (features.mouseVelocityVariance > 10000 && features.mouseVelocityMean > 300) score += 0.2;

  // High path curvature (not linear movements)
  if (features.pathCurvatureMean > 0.5) score += 0.15;

  // Active scrolling (reading/exploring)
  if (features.scrollSpeedMean > 300) score += 0.15;

  return Math.min(score, 1);
}

/**
 * Get human-readable description of the behavior
 */
function getBehaviorDescription(state: BehaviorState, features: StatisticalFeatures): string {
  const descriptions: Record<BehaviorState, string> = {
    frustration: `Rapid, erratic movements detected (velocity: ${features.mouseVelocityMean.toFixed(
      0
    )}px/s). High tension in interactions.`,
    focus: `Smooth, deliberate movements (smoothness: ${(features.movementSmoothnessCoefficient * 100).toFixed(
      0
    )}%). Consistent interaction patterns.`,
    confusion: `Hesitant behavior detected. High backspace frequency (${(features.backspaceFrequency * 100).toFixed(
      1
    )}%) and frequent pauses.`,
    excitement: `High energy interactions! Rapid movements (${features.mouseVelocityMean.toFixed(
      0
    )}px/s) and fast typing rhythm.`,
    calmness: `Relaxed, smooth interactions. Low stress indicators. Movement smoothness: ${(
      features.movementSmoothnessCoefficient * 100
    ).toFixed(0)}%.`,
    stress: `Tense movements with high jerk (${features.mouseJerkMean.toFixed(
      0
    )}). Long click durations indicate pressure.`,
    boredom: `Low engagement. Idle time: ${(features.idleTime / 1000).toFixed(
      1
    )}s. Interaction density: ${features.interactionDensity.toFixed(1)}/s.`,
    discovery: `Exploratory behavior! High click entropy (${features.clickPositionEntropy.toFixed(
      1
    )}) and varied movement patterns.`,
    neutral: 'Normal interaction patterns. No strong behavioral indicators.',
  };

  return descriptions[state] || descriptions.neutral;
}

/**
 * Get color for behavior state (HSL format)
 */
export function getBehaviorColor(state: BehaviorState): [number, number, number] {
  const colors: Record<BehaviorState, [number, number, number]> = {
    frustration: [0, 80, 50], // Red
    focus: [120, 70, 45], // Green
    confusion: [45, 70, 50], // Yellow-orange
    excitement: [280, 80, 60], // Purple-pink
    calmness: [200, 70, 60], // Light blue
    stress: [0, 70, 40], // Dark red
    boredom: [0, 0, 50], // Gray
    discovery: [180, 80, 50], // Cyan
    neutral: [0, 0, 70], // Light gray
  };

  return colors[state] || colors.neutral;
}
