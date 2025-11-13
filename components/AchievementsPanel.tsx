'use client';

import { useState, useEffect } from 'react';
import { useConsciousnessStore } from '@/store/consciousness';
import { ACHIEVEMENTS, checkAchievements } from '@/lib/achievements';
import { Achievement } from '@/types/visualization';

export function AchievementsPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [recentUnlock, setRecentUnlock] = useState<Achievement | null>(null);

  const achievements = useConsciousnessStore((state) => state.achievements);
  const metrics = useConsciousnessStore((state) => state.metrics);
  const consciousnessState = useConsciousnessStore((state) => state.consciousnessState);
  const visualizationMode = useConsciousnessStore((state) => state.visualizationSettings.mode);
  const unlockAchievement = useConsciousnessStore((state) => state.unlockAchievement);

  // Initialize achievements if empty
  useEffect(() => {
    if (achievements.length === 0) {
      // This would be set in the store initialization
    }
  }, [achievements]);

  // Check for new achievements every second
  useEffect(() => {
    const interval = setInterval(() => {
      if (!consciousnessState) return;

      const unlocked = checkAchievements(
        ACHIEVEMENTS,
        metrics,
        consciousnessState,
        visualizationMode
      );

      unlocked.forEach((id) => {
        unlockAchievement(id);
        const achievement = ACHIEVEMENTS.find((a) => a.id === id);
        if (achievement) {
          setRecentUnlock(achievement);
          setTimeout(() => setRecentUnlock(null), 5000);
        }
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [consciousnessState, metrics, visualizationMode, unlockAchievement]);

  const unlockedCount = ACHIEVEMENTS.filter((a) => a.unlocked).length;
  const totalCount = ACHIEVEMENTS.length;

  if (!isOpen && !recentUnlock) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-20 right-4 bg-gradient-to-r from-yellow-600 to-orange-600 text-white px-4 py-2 rounded-lg hover:scale-105 transition-all z-40 shadow-lg"
      >
        🏆 {unlockedCount}/{totalCount}
      </button>
    );
  }

  // Recent unlock notification
  if (recentUnlock && !isOpen) {
    return (
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
        <div className="bg-gradient-to-br from-yellow-500 to-orange-500 p-8 rounded-2xl shadow-2xl border-4 border-yellow-300 animate-bounce">
          <div className="text-center">
            <div className="text-6xl mb-4">{recentUnlock.icon}</div>
            <div className="text-2xl font-bold text-white mb-2">Achievement Unlocked!</div>
            <div className="text-xl text-white/90 mb-1">{recentUnlock.name}</div>
            <div className="text-sm text-white/70">{recentUnlock.description}</div>
            <div className="mt-4 text-xs text-white/60 uppercase tracking-wider">
              {recentUnlock.rarity}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const rarityColors = {
    common: 'from-gray-500 to-gray-600',
    rare: 'from-blue-500 to-blue-600',
    epic: 'from-purple-500 to-purple-600',
    legendary: 'from-yellow-500 to-orange-500',
  };

  const groupedAchievements = {
    focus: ACHIEVEMENTS.filter((a) => a.id.includes('focus')),
    flow: ACHIEVEMENTS.filter((a) => a.id.includes('flow')),
    creative: ACHIEVEMENTS.filter((a) => a.id.includes('creative')),
    zen: ACHIEVEMENTS.filter((a) => a.id.includes('zen') || a.id.includes('unshakeable')),
    consciousness: ACHIEVEMENTS.filter((a) =>
      ['awakening', 'enlightened', 'transcendence', 'singularity'].includes(a.id)
    ),
    special: ACHIEVEMENTS.filter((a) =>
      ['matrix-mode', 'god-mode', 'explorer', 'perfectionist'].includes(a.id)
    ),
  };

  return (
    <div className="fixed top-20 right-4 w-96 bg-black/90 backdrop-blur-xl text-white rounded-2xl shadow-2xl z-40 max-h-[80vh] overflow-hidden border border-white/10">
      {/* Header */}
      <div className="sticky top-0 bg-gradient-to-r from-yellow-600 to-orange-600 p-4 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">Achievements</h2>
          <p className="text-xs text-white/80">
            {unlockedCount} / {totalCount} Unlocked
          </p>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="text-white/80 hover:text-white transition-colors"
        >
          ✕
        </button>
      </div>

      {/* Progress bar */}
      <div className="px-4 pt-4">
        <div className="w-full bg-black/50 rounded-full h-3 overflow-hidden">
          <div
            className="bg-gradient-to-r from-yellow-400 to-orange-400 h-full transition-all duration-500"
            style={{ width: `${(unlockedCount / totalCount) * 100}%` }}
          />
        </div>
      </div>

      {/* Achievements list */}
      <div className="p-4 space-y-4 overflow-y-auto max-h-[60vh]">
        {Object.entries(groupedAchievements).map(([category, categoryAchievements]) => {
          if (categoryAchievements.length === 0) return null;

          return (
            <div key={category}>
              <h3 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-2">
                {category}
              </h3>
              <div className="space-y-2">
                {categoryAchievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className={`p-3 rounded-lg border ${
                      achievement.unlocked
                        ? `bg-gradient-to-r ${rarityColors[achievement.rarity]} border-white/30`
                        : 'bg-white/5 border-white/10'
                    } transition-all`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`text-3xl ${achievement.unlocked ? '' : 'grayscale opacity-30'}`}
                      >
                        {achievement.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <div className="font-semibold">{achievement.name}</div>
                          {achievement.unlocked && (
                            <div className="text-xs bg-white/20 px-2 py-0.5 rounded">
                              ✓
                            </div>
                          )}
                        </div>
                        <div className="text-xs text-white/70 mb-2">
                          {achievement.description}
                        </div>
                        {achievement.maxProgress && achievement.maxProgress > 1 && (
                          <div>
                            <div className="flex justify-between text-xs text-white/60 mb-1">
                              <span>Progress</span>
                              <span>
                                {achievement.progress || 0} / {achievement.maxProgress}
                              </span>
                            </div>
                            <div className="w-full bg-black/30 rounded-full h-1.5 overflow-hidden">
                              <div
                                className="bg-white h-full transition-all duration-300"
                                style={{
                                  width: `${((achievement.progress || 0) / achievement.maxProgress) * 100}%`,
                                }}
                              />
                            </div>
                          </div>
                        )}
                        <div className="text-xs text-white/40 uppercase tracking-wider mt-2">
                          {achievement.rarity}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
