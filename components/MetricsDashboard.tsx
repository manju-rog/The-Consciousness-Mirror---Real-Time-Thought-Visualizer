'use client';

import { useState, useEffect } from 'react';
import { useConsciousnessStore } from '@/store/consciousness';

export function MetricsDashboard() {
  const [isOpen, setIsOpen] = useState(false);
  const consciousnessState = useConsciousnessStore((state) => state.consciousnessState);
  const metrics = useConsciousnessStore((state) => state.metrics);
  const updateMetrics = useConsciousnessStore((state) => state.updateMetrics);
  const behavioralPattern = useConsciousnessStore((state) => state.behavioralPattern);

  // Update metrics based on consciousness state
  useEffect(() => {
    if (!consciousnessState || !behavioralPattern) return;

    const interval = setInterval(() => {
      // Update focus streak
      if (behavioralPattern.state === 'focus' && consciousnessState.focusDepth > 0.7) {
        updateMetrics({
          focusStreak: metrics.focusStreak + 1,
          maxFocusStreak: Math.max(metrics.focusStreak + 1, metrics.maxFocusStreak),
        });
      } else {
        updateMetrics({ focusStreak: 0 });
      }

      // Accumulate flow time
      if (consciousnessState.flowStateProbability > 0.7) {
        updateMetrics({ totalFlowTime: metrics.totalFlowTime + 1 });
      }

      // Track peak creativity
      if (consciousnessState.creativityIndex > metrics.peakCreativity) {
        updateMetrics({ peakCreativity: consciousnessState.creativityIndex });
      }

      // Update emotional balance (running average)
      const newBalance = metrics.emotionalBalance * 0.95 + Math.abs(consciousnessState.emotionalValence) * 0.05;
      updateMetrics({ emotionalBalance: newBalance });

      // Update stress management
      const stressManagement = 1 - consciousnessState.stressLevel;
      updateMetrics({
        stressManagement: metrics.stressManagement * 0.95 + stressManagement * 0.05,
      });

      // Update mindfulness (inverse of mind wandering)
      const mindfulness = 1 - consciousnessState.mindWandering;
      updateMetrics({ mindfulness: metrics.mindfulness * 0.95 + mindfulness * 0.05 });

      // Calculate consciousness level (composite score)
      const consciousnessLevel =
        (consciousnessState.focusDepth +
          consciousnessState.creativityIndex +
          (1 - consciousnessState.stressLevel) +
          consciousnessState.flowStateProbability +
          (1 - consciousnessState.mindWandering)) /
        5;

      updateMetrics({
        consciousnessLevel: metrics.consciousnessLevel * 0.98 + consciousnessLevel * 0.02,
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [consciousnessState, behavioralPattern, metrics, updateMetrics]);

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-28 right-8 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-lg hover:scale-105 transition-all z-40 shadow-lg"
      >
        📊 Metrics
      </button>
    );
  }

  const getEmoji = (state: string) => {
    const emojiMap: Record<string, string> = {
      frustration: '😤',
      focus: '🎯',
      confusion: '🤔',
      excitement: '🤩',
      calmness: '😌',
      stress: '😰',
      boredom: '😑',
      discovery: '🔍',
      neutral: '😐',
    };
    return emojiMap[state] || '😐';
  };

  return (
    <div className="fixed bottom-28 right-8 w-80 bg-gradient-to-br from-purple-900/95 to-pink-900/95 backdrop-blur-xl text-white rounded-2xl shadow-2xl z-40 border border-white/20 overflow-hidden">
      {/* Header */}
      <div className="bg-black/30 p-4 border-b border-white/10 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold">Consciousness Metrics</h2>
          <p className="text-xs text-white/60">Your mental universe</p>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="text-white/60 hover:text-white transition-colors"
        >
          ✕
        </button>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4 max-h-[70vh] overflow-y-auto">
        {/* Current State */}
        <div className="bg-white/5 rounded-xl p-4 border border-white/10">
          <div className="text-center">
            <div className="text-6xl mb-2 animate-pulse">
              {behavioralPattern && getEmoji(behavioralPattern.state)}
            </div>
            <div className="text-xl font-bold capitalize mb-1">
              {behavioralPattern?.state || 'Neutral'}
            </div>
            <div className="text-xs text-white/60">Current State</div>
          </div>
        </div>

        {/* Consciousness Level */}
        <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl p-4 border border-white/10">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-semibold">Consciousness Level</span>
            <span className="text-2xl font-bold">{Math.floor(metrics.consciousnessLevel * 100)}</span>
          </div>
          <div className="w-full bg-black/30 rounded-full h-3 overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-400 to-purple-400 h-full transition-all duration-500"
              style={{ width: `${metrics.consciousnessLevel * 100}%` }}
            />
          </div>
        </div>

        {/* Focus Streak */}
        <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-xl p-4 border border-white/10">
          <div className="flex justify-between items-center">
            <div>
              <div className="text-sm font-semibold">🎯 Focus Streak</div>
              <div className="text-xs text-white/60">Current / Best</div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">{metrics.focusStreak}s</div>
              <div className="text-sm text-white/60">{metrics.maxFocusStreak}s best</div>
            </div>
          </div>
        </div>

        {/* Flow Time */}
        <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl p-4 border border-white/10">
          <div className="flex justify-between items-center">
            <div className="text-sm font-semibold">💫 Flow State Time</div>
            <div className="text-2xl font-bold">{Math.floor(metrics.totalFlowTime / 60)}m</div>
          </div>
          <div className="mt-2 text-xs text-white/60">
            Total time in peak flow
          </div>
        </div>

        {/* Mental Attributes */}
        <div className="space-y-3">
          <div className="text-sm font-semibold mb-2">Mental Attributes</div>

          {/* Creativity */}
          <MetricBar
            label="🎨 Creativity"
            value={metrics.peakCreativity}
            color="from-yellow-400 to-orange-400"
          />

          {/* Emotional Balance */}
          <MetricBar
            label="⚖️ Emotional Balance"
            value={1 - metrics.emotionalBalance}
            color="from-cyan-400 to-blue-400"
          />

          {/* Stress Management */}
          <MetricBar
            label="😌 Stress Management"
            value={metrics.stressManagement}
            color="from-green-400 to-emerald-400"
          />

          {/* Mindfulness */}
          <MetricBar
            label="🧘 Mindfulness"
            value={metrics.mindfulness}
            color="from-purple-400 to-pink-400"
          />
        </div>

        {/* Live Consciousness Metrics */}
        {consciousnessState && (
          <div className="bg-black/30 rounded-xl p-4 border border-white/10">
            <div className="text-sm font-semibold mb-3">Live Metrics</div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <div className="text-white/60">Arousal</div>
                <div className="font-mono">{(consciousnessState.arousalLevel * 100).toFixed(0)}%</div>
              </div>
              <div>
                <div className="text-white/60">Cognitive Load</div>
                <div className="font-mono">{(consciousnessState.cognitiveLoad * 100).toFixed(0)}%</div>
              </div>
              <div>
                <div className="text-white/60">Focus Depth</div>
                <div className="font-mono">{(consciousnessState.focusDepth * 100).toFixed(0)}%</div>
              </div>
              <div>
                <div className="text-white/60">Flow State</div>
                <div className="font-mono">{(consciousnessState.flowStateProbability * 100).toFixed(0)}%</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function MetricBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span>{label}</span>
        <span className="font-mono">{(value * 100).toFixed(0)}%</span>
      </div>
      <div className="w-full bg-black/30 rounded-full h-2 overflow-hidden">
        <div
          className={`bg-gradient-to-r ${color} h-full transition-all duration-500`}
          style={{ width: `${value * 100}%` }}
        />
      </div>
    </div>
  );
}
