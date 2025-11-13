'use client';

import { useState } from 'react';
import { useConsciousnessStore } from '@/store/consciousness';
import { VisualizationMode, ColorTheme } from '@/types/visualization';

export function VisualizationControls() {
  const [isOpen, setIsOpen] = useState(false);
  const visualizationSettings = useConsciousnessStore((state) => state.visualizationSettings);
  const setVisualizationMode = useConsciousnessStore((state) => state.setVisualizationMode);
  const setColorTheme = useConsciousnessStore((state) => state.setColorTheme);
  const updateVisualizationSettings = useConsciousnessStore((state) => state.updateVisualizationSettings);

  const modes: { id: VisualizationMode; name: string; icon: string; description: string }[] = [
    { id: 'particles', name: 'Particles', icon: '✨', description: 'Classic particle cloud' },
    { id: 'galaxy', name: 'Galaxy', icon: '🌌', description: 'Cosmic consciousness' },
    { id: 'brain', name: 'Brain', icon: '🧠', description: 'Neural patterns' },
    { id: 'mandala', name: 'Mandala', icon: '🕉️', description: 'Sacred geometry' },
    { id: 'matrix', name: 'Matrix', icon: '💚', description: 'Code consciousness' },
    { id: 'ocean', name: 'Ocean', icon: '🌊', description: 'Flowing thoughts' },
    { id: 'forest', name: 'Forest', icon: '🌲', description: 'Growing ideas' },
    { id: 'crystal', name: 'Crystal', icon: '💎', description: 'Geometric forms' },
    { id: 'dna', name: 'DNA', icon: '🧬', description: 'Helical thoughts' },
    { id: 'cosmos', name: 'Cosmos', icon: '🪐', description: 'Universal mind' },
    { id: 'neural', name: 'Neural', icon: '⚡', description: 'Network patterns' },
    { id: 'quantum', name: 'Quantum', icon: '⚛️', description: 'Quantum field' },
  ];

  const colorThemes: { id: ColorTheme; name: string; gradient: string }[] = [
    { id: 'default', name: 'Default', gradient: 'from-blue-500 to-purple-500' },
    { id: 'cosmic', name: 'Cosmic', gradient: 'from-indigo-600 to-pink-500' },
    { id: 'fire', name: 'Fire', gradient: 'from-orange-500 to-red-600' },
    { id: 'ice', name: 'Ice', gradient: 'from-cyan-400 to-blue-600' },
    { id: 'rainbow', name: 'Rainbow', gradient: 'from-red-500 via-yellow-500 to-blue-500' },
    { id: 'monochrome', name: 'Mono', gradient: 'from-gray-600 to-gray-900' },
    { id: 'sunset', name: 'Sunset', gradient: 'from-orange-400 to-purple-600' },
    { id: 'aurora', name: 'Aurora', gradient: 'from-green-400 to-blue-500' },
    { id: 'deep-sea', name: 'Deep Sea', gradient: 'from-blue-900 to-teal-500' },
    { id: 'forest', name: 'Forest', gradient: 'from-green-600 to-emerald-800' },
  ];

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-4 right-4 bg-white/10 backdrop-blur-md text-white px-4 py-2 rounded-lg hover:bg-white/20 transition-all z-40"
      >
        🎨 Controls
      </button>
    );
  }

  return (
    <div className="fixed top-4 right-4 w-96 bg-black/90 backdrop-blur-xl text-white rounded-2xl shadow-2xl z-40 max-h-[90vh] overflow-y-auto border border-white/10">
      {/* Header */}
      <div className="sticky top-0 bg-black/95 backdrop-blur-xl p-4 border-b border-white/10 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Visualization Controls
          </h2>
          <p className="text-xs text-white/40 mt-1">Shape your consciousness</p>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="text-white/60 hover:text-white transition-colors"
        >
          ✕
        </button>
      </div>

      {/* Content */}
      <div className="p-4 space-y-6">
        {/* Visualization Modes */}
        <div>
          <h3 className="text-sm font-semibold text-white/80 mb-3">Visualization Mode</h3>
          <div className="grid grid-cols-3 gap-2">
            {modes.map((mode) => (
              <button
                key={mode.id}
                onClick={() => setVisualizationMode(mode.id)}
                className={`p-3 rounded-lg transition-all ${
                  visualizationSettings.mode === mode.id
                    ? 'bg-gradient-to-br from-blue-500 to-purple-500 scale-105'
                    : 'bg-white/5 hover:bg-white/10'
                }`}
                title={mode.description}
              >
                <div className="text-2xl mb-1">{mode.icon}</div>
                <div className="text-xs font-medium">{mode.name}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Color Themes */}
        <div>
          <h3 className="text-sm font-semibold text-white/80 mb-3">Color Theme</h3>
          <div className="grid grid-cols-5 gap-2">
            {colorThemes.map((theme) => (
              <button
                key={theme.id}
                onClick={() => setColorTheme(theme.id)}
                className={`aspect-square rounded-lg bg-gradient-to-br ${theme.gradient} transition-all ${
                  visualizationSettings.colorTheme === theme.id
                    ? 'ring-2 ring-white scale-110'
                    : 'hover:scale-105'
                }`}
                title={theme.name}
              />
            ))}
          </div>
        </div>

        {/* Effects */}
        <div>
          <h3 className="text-sm font-semibold text-white/80 mb-3">Effects</h3>
          <div className="space-y-3">
            <label className="flex items-center justify-between">
              <span className="text-sm">Auto Rotate</span>
              <input
                type="checkbox"
                checked={visualizationSettings.autoRotate}
                onChange={(e) =>
                  updateVisualizationSettings({ autoRotate: e.target.checked })
                }
                className="w-4 h-4"
              />
            </label>

            <label className="flex items-center justify-between">
              <span className="text-sm">Bloom</span>
              <input
                type="checkbox"
                checked={visualizationSettings.bloomEnabled}
                onChange={(e) =>
                  updateVisualizationSettings({ bloomEnabled: e.target.checked })
                }
                className="w-4 h-4"
              />
            </label>

            <label className="flex items-center justify-between">
              <span className="text-sm">Motion Blur</span>
              <input
                type="checkbox"
                checked={visualizationSettings.motionBlurEnabled}
                onChange={(e) =>
                  updateVisualizationSettings({ motionBlurEnabled: e.target.checked })
                }
                className="w-4 h-4"
              />
            </label>

            <label className="flex items-center justify-between">
              <span className="text-sm">Depth of Field</span>
              <input
                type="checkbox"
                checked={visualizationSettings.depthOfFieldEnabled}
                onChange={(e) =>
                  updateVisualizationSettings({ depthOfFieldEnabled: e.target.checked })
                }
                className="w-4 h-4"
              />
            </label>
          </div>
        </div>

        {/* Sliders */}
        <div>
          <h3 className="text-sm font-semibold text-white/80 mb-3">Settings</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs text-white/60 mb-1">
                <span>Camera Speed</span>
                <span>{(visualizationSettings.cameraSpeed * 100).toFixed(0)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={visualizationSettings.cameraSpeed}
                onChange={(e) =>
                  updateVisualizationSettings({ cameraSpeed: parseFloat(e.target.value) })
                }
                className="w-full"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs text-white/60 mb-1">
                <span>Effects Intensity</span>
                <span>{(visualizationSettings.effectsIntensity * 100).toFixed(0)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={visualizationSettings.effectsIntensity}
                onChange={(e) =>
                  updateVisualizationSettings({
                    effectsIntensity: parseFloat(e.target.value),
                  })
                }
                className="w-full"
              />
            </div>
          </div>
        </div>

        {/* Quality Preset */}
        <div>
          <h3 className="text-sm font-semibold text-white/80 mb-3">Quality</h3>
          <div className="grid grid-cols-4 gap-2">
            {(['low', 'medium', 'high', 'ultra'] as const).map((quality) => (
              <button
                key={quality}
                onClick={() => updateVisualizationSettings({ quality })}
                className={`py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                  visualizationSettings.quality === quality
                    ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                    : 'bg-white/5 hover:bg-white/10'
                }`}
              >
                {quality.charAt(0).toUpperCase() + quality.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
