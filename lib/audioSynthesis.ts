import * as Tone from 'tone';
import { ConsciousnessState, StatisticalFeatures } from '@/types/interactions';

/**
 * Audio synthesis system that generates soundscapes from consciousness data
 */
export class ConsciousnessAudio {
  private isInitialized = false;
  private isPlaying = false;

  // Synthesizers for different aspects
  private focusSynth: Tone.Synth | null = null;
  private emotionSynth: Tone.FMSynth | null = null;
  private thoughtsGrain: Tone.GrainPlayer | null = null;
  private stressNoise: Tone.Noise | null = null;
  private creativityArp: Tone.PolySynth | null = null;
  private bassSynth: Tone.MonoSynth | null = null;

  // Effects
  private reverb: Tone.Reverb | null = null;
  private delay: Tone.FeedbackDelay | null = null;
  private filter: Tone.Filter | null = null;
  private panner: Tone.Panner | null = null;
  private compressor: Tone.Compressor | null = null;

  // Sequences
  private arpSequence: Tone.Sequence | null = null;

  constructor() {}

  /**
   * Initialize audio system
   */
  async initialize() {
    if (this.isInitialized) return;

    try {
      await Tone.start();

      // Create effects chain
      this.reverb = new Tone.Reverb({ decay: 4, wet: 0.3 }).toDestination();
      this.delay = new Tone.FeedbackDelay('8n', 0.3).connect(this.reverb);
      this.filter = new Tone.Filter(1000, 'lowpass').connect(this.delay);
      this.panner = new Tone.Panner(0).connect(this.filter);
      this.compressor = new Tone.Compressor(-20, 3).connect(this.panner);

      // Focus: Sine wave drone
      this.focusSynth = new Tone.Synth({
        oscillator: { type: 'sine' },
        envelope: {
          attack: 2,
          decay: 1,
          sustain: 0.8,
          release: 4,
        },
        volume: -15,
      }).connect(this.compressor);

      // Emotion: FM synthesis
      this.emotionSynth = new Tone.FMSynth({
        harmonicity: 3,
        modulationIndex: 10,
        oscillator: { type: 'sine' },
        envelope: {
          attack: 0.5,
          decay: 0.2,
          sustain: 0.6,
          release: 2,
        },
        modulation: { type: 'square' },
        modulationEnvelope: {
          attack: 0.2,
          decay: 0.0,
          sustain: 1,
          release: 0.5,
        },
        volume: -18,
      }).connect(this.compressor);

      // Stress: Noise generator
      this.stressNoise = new Tone.Noise('brown');
      const noiseFilter = new Tone.Filter(300, 'lowpass');
      const noiseEnv = new Tone.AmplitudeEnvelope({
        attack: 0.1,
        decay: 0.2,
        sustain: 0.3,
        release: 1,
      });
      this.stressNoise.connect(noiseFilter);
      noiseFilter.connect(noiseEnv);
      noiseEnv.connect(this.compressor);
      this.stressNoise.volume.value = -30;

      // Creativity: Arpeggiator
      this.creativityArp = new Tone.PolySynth(Tone.Synth, {
        oscillator: { type: 'triangle' },
        envelope: {
          attack: 0.02,
          decay: 0.3,
          sustain: 0.1,
          release: 0.5,
        },
        volume: -20,
      }).connect(this.compressor);

      // Energy: Bass synthesizer
      this.bassSynth = new Tone.MonoSynth({
        oscillator: { type: 'sawtooth' },
        filter: {
          Q: 2,
          type: 'lowpass',
          rolloff: -24,
        },
        envelope: {
          attack: 0.1,
          decay: 0.3,
          sustain: 0.4,
          release: 1,
        },
        filterEnvelope: {
          attack: 0.02,
          decay: 0.1,
          sustain: 0.2,
          release: 1,
          baseFrequency: 100,
          octaves: 2,
        },
        volume: -18,
      }).connect(this.compressor);

      this.isInitialized = true;
    } catch (error) {
      console.error('Failed to initialize audio:', error);
    }
  }

  /**
   * Start audio playback
   */
  async start() {
    if (!this.isInitialized) {
      await this.initialize();
    }

    if (this.isPlaying) return;

    try {
      await Tone.start();

      // Start continuous sounds
      if (this.focusSynth) {
        this.focusSynth.triggerAttack('C2');
      }

      if (this.emotionSynth) {
        this.emotionSynth.triggerAttack('G2');
      }

      if (this.stressNoise) {
        this.stressNoise.start();
      }

      this.isPlaying = true;
    } catch (error) {
      console.error('Failed to start audio:', error);
    }
  }

  /**
   * Stop audio playback
   */
  stop() {
    if (!this.isPlaying) return;

    try {
      if (this.focusSynth) {
        this.focusSynth.triggerRelease();
      }

      if (this.emotionSynth) {
        this.emotionSynth.triggerRelease();
      }

      if (this.stressNoise) {
        this.stressNoise.stop();
      }

      if (this.arpSequence) {
        this.arpSequence.stop();
      }

      this.isPlaying = false;
    } catch (error) {
      console.error('Failed to stop audio:', error);
    }
  }

  /**
   * Update audio parameters based on consciousness state
   */
  update(state: ConsciousnessState, features: StatisticalFeatures) {
    if (!this.isInitialized || !this.isPlaying) return;

    try {
      // Map emotional valence to pitch (low=negative, high=positive)
      const basePitch = 220; // A3
      const emotionPitch = basePitch * Math.pow(2, state.emotionalValence); // One octave range

      // Update emotion synth
      if (this.emotionSynth) {
        this.emotionSynth.frequency.rampTo(emotionPitch, 0.5);
        this.emotionSynth.harmonicity.value = 2 + state.arousalLevel * 3;
        this.emotionSynth.modulationIndex.value = 5 + state.cognitiveLoad * 10;
        this.emotionSynth.volume.rampTo(-18 + state.arousalLevel * 6, 0.5);
      }

      // Update focus drone
      if (this.focusSynth) {
        const focusPitch = 65.41; // C2
        this.focusSynth.frequency.rampTo(focusPitch * (1 + state.focusDepth * 0.5), 1);
        this.focusSynth.volume.rampTo(-15 + state.focusDepth * 5, 0.5);
      }

      // Update stress noise
      if (this.stressNoise) {
        this.stressNoise.volume.rampTo(-30 + state.stressLevel * 15, 0.5);
      }

      // Update filter (arousal affects brightness)
      if (this.filter) {
        const cutoff = 500 + state.arousalLevel * 2000;
        this.filter.frequency.rampTo(cutoff, 0.5);
      }

      // Update reverb (dreaminess/flow state)
      if (this.reverb) {
        this.reverb.wet.value = 0.2 + state.flowStateProbability * 0.5;
      }

      // Update panning based on interaction position
      if (this.panner && features.mouseVelocityMean > 0) {
        // Subtle panning based on movement
        const panAmount = Math.sin(Date.now() / 1000) * 0.3;
        this.panner.pan.rampTo(panAmount, 0.2);
      }

      // Trigger creativity arpeggio during high creativity
      if (state.creativityIndex > 0.6 && this.creativityArp) {
        this.triggerCreativeArpeggio(state);
      }

      // Trigger bass notes during high energy
      if (features.mouseVelocityMean > 500 && Math.random() < 0.1) {
        this.triggerEnergyBass(state);
      }
    } catch (error) {
      console.error('Audio update error:', error);
    }
  }

  /**
   * Trigger creative arpeggio pattern
   */
  private triggerCreativeArpeggio(state: ConsciousnessState) {
    if (!this.creativityArp) return;

    // Generate notes in key based on emotional state
    const isMinor = state.emotionalValence < 0;
    const scale = isMinor
      ? ['C4', 'D4', 'Eb4', 'F4', 'G4', 'Ab4', 'Bb4', 'C5'] // C minor
      : ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5']; // C major

    // Pick random notes from scale
    const noteCount = Math.floor(2 + state.creativityIndex * 4);
    const notes: string[] = [];
    for (let i = 0; i < noteCount; i++) {
      const note = scale[Math.floor(Math.random() * scale.length)];
      notes.push(note);
    }

    // Trigger notes with timing based on typing rhythm
    notes.forEach((note, i) => {
      const time = Tone.now() + i * 0.15;
      this.creativityArp?.triggerAttackRelease(note, '16n', time);
    });
  }

  /**
   * Trigger bass note for energy bursts
   */
  private triggerEnergyBass(state: ConsciousnessState) {
    if (!this.bassSynth) return;

    const notes = ['C1', 'C2', 'G1', 'F1'];
    const note = notes[Math.floor(Math.random() * notes.length)];
    this.bassSynth.triggerAttackRelease(note, '8n');
  }

  /**
   * Cleanup
   */
  dispose() {
    this.stop();

    if (this.focusSynth) this.focusSynth.dispose();
    if (this.emotionSynth) this.emotionSynth.dispose();
    if (this.thoughtsGrain) this.thoughtsGrain.dispose();
    if (this.stressNoise) this.stressNoise.dispose();
    if (this.creativityArp) this.creativityArp.dispose();
    if (this.bassSynth) this.bassSynth.dispose();
    if (this.reverb) this.reverb.dispose();
    if (this.delay) this.delay.dispose();
    if (this.filter) this.filter.dispose();
    if (this.panner) this.panner.dispose();
    if (this.compressor) this.compressor.dispose();
    if (this.arpSequence) this.arpSequence.dispose();

    this.isInitialized = false;
  }
}

// Singleton instance
let audioInstance: ConsciousnessAudio | null = null;

export function getConsciousnessAudio(): ConsciousnessAudio {
  if (!audioInstance) {
    audioInstance = new ConsciousnessAudio();
  }
  return audioInstance;
}
