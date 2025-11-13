import * as tf from '@tensorflow/tfjs';
import { StatisticalFeatures, ConsciousnessState, BehavioralPattern } from '@/types/interactions';

/**
 * Consciousness classifier using TensorFlow.js
 * Maps behavioral features to consciousness state vectors
 */
export class ConsciousnessClassifier {
  private model: tf.LayersModel | null = null;
  private isInitialized = false;

  constructor() {
    this.initialize();
  }

  /**
   * Initialize the TensorFlow.js model
   */
  async initialize() {
    if (this.isInitialized) return;

    try {
      // Create a simple neural network model
      // In production, this would be a pre-trained model
      this.model = this.createModel();
      this.isInitialized = true;
    } catch (error) {
      console.error('Failed to initialize consciousness classifier:', error);
    }
  }

  /**
   * Create a simple feedforward neural network
   */
  private createModel(): tf.LayersModel {
    const model = tf.sequential();

    // Input layer: statistical features
    model.add(
      tf.layers.dense({
        inputShape: [20], // 20 statistical features
        units: 64,
        activation: 'relu',
        kernelInitializer: 'heNormal',
      })
    );

    // Hidden layers
    model.add(
      tf.layers.dropout({
        rate: 0.2,
      })
    );

    model.add(
      tf.layers.dense({
        units: 32,
        activation: 'relu',
      })
    );

    model.add(
      tf.layers.dropout({
        rate: 0.2,
      })
    );

    model.add(
      tf.layers.dense({
        units: 16,
        activation: 'relu',
      })
    );

    // Output layer: 8 consciousness dimensions
    model.add(
      tf.layers.dense({
        units: 8,
        activation: 'sigmoid', // Output between 0 and 1
      })
    );

    // Compile model
    model.compile({
      optimizer: tf.train.adam(0.001),
      loss: 'meanSquaredError',
      metrics: ['accuracy'],
    });

    // Initialize weights randomly
    // In production, we'd load pre-trained weights
    return model;
  }

  /**
   * Normalize features for neural network input
   */
  private normalizeFeatures(features: StatisticalFeatures): number[] {
    return [
      Math.min(features.mouseVelocityMean / 1000, 1),
      Math.min(features.mouseVelocityVariance / 100000, 1),
      Math.min(features.mouseVelocityStd / 1000, 1),
      Math.min(features.mouseAccelerationMean / 5000, 1),
      Math.min(features.mouseAccelerationVariance / 100000, 1),
      Math.min(features.mouseJerkMean / 20000, 1),
      Math.min(features.clickPositionEntropy / 10, 1),
      Math.min(features.typingRhythmMean / 1000, 1),
      Math.min(features.typingRhythmVariance / 50000, 1),
      features.backspaceFrequency,
      Math.min(features.scrollSpeedMean / 2000, 1),
      features.movementSmoothnessCoefficient,
      features.pauseFrequency,
      Math.min(features.pauseDurationMean / 3000, 1),
      Math.min(features.interactionDensity / 20, 1),
      Math.min(features.pathCurvatureMean / 2, 1),
      Math.min(features.pathCurvatureVariance / 5, 1),
      Math.min(features.clickDurationMean / 500, 1),
      Math.min(features.doubleClickSpeed / 10, 1),
      Math.min(features.idleTime / 10000, 1),
    ];
  }

  /**
   * Predict consciousness state from features
   */
  async predict(features: StatisticalFeatures, behavior: BehavioralPattern): Promise<ConsciousnessState> {
    if (!this.model || !this.isInitialized) {
      await this.initialize();
    }

    try {
      const normalizedFeatures = this.normalizeFeatures(features);
      const inputTensor = tf.tensor2d([normalizedFeatures]);

      // Run prediction
      const prediction = this.model!.predict(inputTensor) as tf.Tensor;
      const values = await prediction.data();

      // Clean up tensors
      inputTensor.dispose();
      prediction.dispose();

      // Map neural network output to consciousness dimensions
      const emotionalValence = this.calculateEmotionalValence(behavior, values);
      const arousalLevel = values[1];
      const cognitiveLoad = this.calculateCognitiveLoad(features);
      const focusDepth = features.movementSmoothnessCoefficient;
      const creativityIndex = this.calculateCreativityIndex(features);
      const stressLevel = this.calculateStressLevel(features, behavior);
      const flowStateProbability = this.calculateFlowState(features, behavior);
      const mindWandering = this.calculateMindWandering(features);

      // Calculate overall confidence
      const confidence = behavior.confidence;

      return {
        emotionalValence,
        arousalLevel,
        cognitiveLoad,
        focusDepth,
        creativityIndex,
        stressLevel,
        flowStateProbability,
        mindWandering,
        confidence,
        timestamp: Date.now(),
      };
    } catch (error) {
      console.error('Prediction error:', error);
      // Return neutral state on error
      return this.getNeutralState();
    }
  }

  /**
   * Calculate emotional valence (-1 to 1)
   * Negative emotions: frustration, stress, confusion
   * Positive emotions: focus, calmness, excitement, discovery
   */
  private calculateEmotionalValence(behavior: BehavioralPattern, nnOutput: Float32Array): number {
    const valenceMap: Record<string, number> = {
      frustration: -0.7,
      stress: -0.8,
      confusion: -0.5,
      boredom: -0.3,
      focus: 0.6,
      calmness: 0.7,
      excitement: 0.8,
      discovery: 0.9,
      neutral: 0,
    };

    const baseValence = valenceMap[behavior.state] || 0;
    // Blend with neural network output
    return baseValence * 0.7 + (nnOutput[0] * 2 - 1) * 0.3;
  }

  /**
   * Calculate cognitive load (0 to 1)
   * High load: many interactions, high variance, frequent corrections
   */
  private calculateCognitiveLoad(features: StatisticalFeatures): number {
    let load = 0;

    // High interaction density = high load
    load += Math.min(features.interactionDensity / 20, 0.3);

    // High backspace frequency = high load
    load += features.backspaceFrequency * 0.3;

    // High velocity variance = high load
    load += Math.min(features.mouseVelocityVariance / 100000, 0.2);

    // Frequent pauses = high load
    load += features.pauseFrequency * 0.2;

    return Math.min(load, 1);
  }

  /**
   * Calculate creativity index (0 to 1)
   * High creativity: exploratory behavior, varied patterns, discovery mode
   */
  private calculateCreativityIndex(features: StatisticalFeatures): number {
    let creativity = 0;

    // High click entropy = exploring
    creativity += Math.min(features.clickPositionEntropy / 10, 0.4);

    // Varied movement patterns
    creativity += Math.min(features.pathCurvatureVariance / 5, 0.3);

    // Active but not frantic
    if (features.mouseVelocityMean > 200 && features.mouseVelocityMean < 600) {
      creativity += 0.3;
    }

    return Math.min(creativity, 1);
  }

  /**
   * Calculate stress level (0 to 1)
   */
  private calculateStressLevel(features: StatisticalFeatures, behavior: BehavioralPattern): number {
    let stress = 0;

    if (behavior.state === 'stress' || behavior.state === 'frustration') {
      stress += behavior.intensity * 0.5;
    }

    // High jerk = stress
    stress += Math.min(features.mouseJerkMean / 20000, 0.3);

    // Long click duration = pressure
    stress += Math.min(features.clickDurationMean / 500, 0.2);

    return Math.min(stress, 1);
  }

  /**
   * Calculate flow state probability (0 to 1)
   * Flow: high focus, smooth movements, consistent rhythm, moderate speed
   */
  private calculateFlowState(features: StatisticalFeatures, behavior: BehavioralPattern): number {
    if (behavior.state !== 'focus' && behavior.state !== 'calmness') {
      return 0;
    }

    let flowScore = 0;

    // High smoothness
    if (features.movementSmoothnessCoefficient > 0.7) {
      flowScore += 0.4;
    }

    // Consistent typing rhythm
    if (features.typingRhythmVariance < 10000 && features.typingRhythmMean > 0) {
      flowScore += 0.3;
    }

    // Active engagement
    if (features.interactionDensity > 5 && features.interactionDensity < 15) {
      flowScore += 0.3;
    }

    return Math.min(flowScore, 1);
  }

  /**
   * Calculate mind wandering indicator (0 to 1)
   * High: idle time, slow movements, low density
   */
  private calculateMindWandering(features: StatisticalFeatures): number {
    let wandering = 0;

    // Long idle time
    wandering += Math.min(features.idleTime / 10000, 0.4);

    // Low interaction density
    if (features.interactionDensity < 3) {
      wandering += 0.3;
    }

    // Slow movements
    if (features.mouseVelocityMean < 150) {
      wandering += 0.3;
    }

    return Math.min(wandering, 1);
  }

  /**
   * Get neutral consciousness state
   */
  private getNeutralState(): ConsciousnessState {
    return {
      emotionalValence: 0,
      arousalLevel: 0.5,
      cognitiveLoad: 0.5,
      focusDepth: 0.5,
      creativityIndex: 0.5,
      stressLevel: 0,
      flowStateProbability: 0,
      mindWandering: 0.5,
      confidence: 0,
      timestamp: Date.now(),
    };
  }

  /**
   * Cleanup
   */
  dispose() {
    if (this.model) {
      this.model.dispose();
      this.model = null;
    }
    this.isInitialized = false;
  }
}

// Singleton instance
let classifierInstance: ConsciousnessClassifier | null = null;

export function getConsciousnessClassifier(): ConsciousnessClassifier {
  if (!classifierInstance) {
    classifierInstance = new ConsciousnessClassifier();
  }
  return classifierInstance;
}
