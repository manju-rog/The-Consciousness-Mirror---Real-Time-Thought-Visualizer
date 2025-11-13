import { Achievement } from '@/types/visualization';

export const ACHIEVEMENTS: Achievement[] = [
  // Focus Achievements
  {
    id: 'first-focus',
    name: 'First Focus',
    description: 'Enter focus state for the first time',
    icon: '🎯',
    unlocked: false,
    rarity: 'common',
    maxProgress: 1,
    progress: 0,
  },
  {
    id: 'focus-master',
    name: 'Focus Master',
    description: 'Maintain focus for 60 seconds',
    icon: '🧘',
    unlocked: false,
    rarity: 'rare',
    maxProgress: 60,
    progress: 0,
  },
  {
    id: 'focus-legend',
    name: 'Focus Legend',
    description: 'Achieve a 300 second focus streak',
    icon: '👑',
    unlocked: false,
    rarity: 'legendary',
    maxProgress: 300,
    progress: 0,
  },

  // Flow State Achievements
  {
    id: 'flow-state',
    name: 'Flow State',
    description: 'Enter flow state (>70% probability)',
    icon: '💫',
    unlocked: false,
    rarity: 'rare',
    maxProgress: 1,
    progress: 0,
  },
  {
    id: 'flow-addict',
    name: 'Flow Addict',
    description: 'Spend 30 minutes total in flow',
    icon: '✨',
    unlocked: false,
    rarity: 'epic',
    maxProgress: 1800,
    progress: 0,
  },

  // Creativity Achievements
  {
    id: 'creative-spark',
    name: 'Creative Spark',
    description: 'Reach 80% creativity index',
    icon: '🎨',
    unlocked: false,
    rarity: 'rare',
    maxProgress: 1,
    progress: 0,
  },
  {
    id: 'creative-genius',
    name: 'Creative Genius',
    description: 'Maintain peak creativity for 5 minutes',
    icon: '🌟',
    unlocked: false,
    rarity: 'epic',
    maxProgress: 300,
    progress: 0,
  },

  // Stress Management
  {
    id: 'zen-master',
    name: 'Zen Master',
    description: 'Keep stress below 20% for 5 minutes',
    icon: '😌',
    unlocked: false,
    rarity: 'epic',
    maxProgress: 300,
    progress: 0,
  },
  {
    id: 'unshakeable',
    name: 'Unshakeable',
    description: 'Maintain calmness during high cognitive load',
    icon: '🗿',
    unlocked: false,
    rarity: 'legendary',
    maxProgress: 1,
    progress: 0,
  },

  // Consciousness Level
  {
    id: 'awakening',
    name: 'Awakening',
    description: 'Reach consciousness level 50',
    icon: '🌅',
    unlocked: false,
    rarity: 'common',
    maxProgress: 1,
    progress: 0,
  },
  {
    id: 'enlightened',
    name: 'Enlightened',
    description: 'Reach consciousness level 80',
    icon: '🌞',
    unlocked: false,
    rarity: 'epic',
    maxProgress: 1,
    progress: 0,
  },
  {
    id: 'transcendence',
    name: 'Transcendence',
    description: 'Reach consciousness level 95',
    icon: '🌌',
    unlocked: false,
    rarity: 'legendary',
    maxProgress: 1,
    progress: 0,
  },

  // Exploration
  {
    id: 'explorer',
    name: 'Explorer',
    description: 'Try all visualization modes',
    icon: '🔍',
    unlocked: false,
    rarity: 'rare',
    maxProgress: 10,
    progress: 0,
  },
  {
    id: 'perfectionist',
    name: 'Perfectionist',
    description: 'Achieve 100% emotional balance',
    icon: '⚖️',
    unlocked: false,
    rarity: 'legendary',
    maxProgress: 1,
    progress: 0,
  },

  // Time-based
  {
    id: 'dedicated',
    name: 'Dedicated',
    description: 'Use consciousness mirror for 1 hour total',
    icon: '⏰',
    unlocked: false,
    rarity: 'common',
    maxProgress: 3600,
    progress: 0,
  },
  {
    id: 'consciousness-scholar',
    name: 'Consciousness Scholar',
    description: 'Use consciousness mirror for 10 hours total',
    icon: '📚',
    unlocked: false,
    rarity: 'epic',
    maxProgress: 36000,
    progress: 0,
  },

  // Special/Hidden
  {
    id: 'matrix-mode',
    name: 'Red Pill',
    description: 'Enter matrix visualization during peak focus',
    icon: '💊',
    unlocked: false,
    rarity: 'legendary',
    maxProgress: 1,
    progress: 0,
  },
  {
    id: 'god-mode',
    name: 'God Mode',
    description: 'Achieve 100% in all consciousness dimensions simultaneously',
    icon: '👁️',
    unlocked: false,
    rarity: 'legendary',
    maxProgress: 1,
    progress: 0,
  },
  {
    id: 'singularity',
    name: 'Singularity',
    description: 'Reach consciousness level 100',
    icon: '🌠',
    unlocked: false,
    rarity: 'legendary',
    maxProgress: 1,
    progress: 0,
  },
];

export function checkAchievements(
  achievements: Achievement[],
  metrics: any,
  consciousnessState: any,
  visualizationMode: string
): string[] {
  const unlocked: string[] = [];

  achievements.forEach((achievement) => {
    if (achievement.unlocked) return;

    let shouldUnlock = false;
    let progress = achievement.progress || 0;

    switch (achievement.id) {
      case 'first-focus':
        if (metrics.focusStreak > 0) shouldUnlock = true;
        break;

      case 'focus-master':
        progress = metrics.focusStreak;
        if (metrics.focusStreak >= 60) shouldUnlock = true;
        break;

      case 'focus-legend':
        progress = metrics.maxFocusStreak;
        if (metrics.maxFocusStreak >= 300) shouldUnlock = true;
        break;

      case 'flow-state':
        if (consciousnessState?.flowStateProbability > 0.7) shouldUnlock = true;
        break;

      case 'flow-addict':
        progress = metrics.totalFlowTime;
        if (metrics.totalFlowTime >= 1800) shouldUnlock = true;
        break;

      case 'creative-spark':
        if (consciousnessState?.creativityIndex > 0.8) shouldUnlock = true;
        break;

      case 'zen-master':
        if (consciousnessState?.stressLevel < 0.2) {
          progress = (progress || 0) + 1;
          if (progress >= 300) shouldUnlock = true;
        }
        break;

      case 'awakening':
        if (metrics.consciousnessLevel >= 0.5) shouldUnlock = true;
        break;

      case 'enlightened':
        if (metrics.consciousnessLevel >= 0.8) shouldUnlock = true;
        break;

      case 'transcendence':
        if (metrics.consciousnessLevel >= 0.95) shouldUnlock = true;
        break;

      case 'singularity':
        if (metrics.consciousnessLevel >= 1.0) shouldUnlock = true;
        break;

      case 'matrix-mode':
        if (
          visualizationMode === 'matrix' &&
          consciousnessState?.focusDepth > 0.8
        ) {
          shouldUnlock = true;
        }
        break;

      case 'god-mode':
        if (
          consciousnessState?.focusDepth > 0.99 &&
          consciousnessState?.creativityIndex > 0.99 &&
          consciousnessState?.flowStateProbability > 0.99 &&
          consciousnessState?.stressLevel < 0.01
        ) {
          shouldUnlock = true;
        }
        break;
    }

    if (shouldUnlock) {
      unlocked.push(achievement.id);
    }

    achievement.progress = progress;
  });

  return unlocked;
}
