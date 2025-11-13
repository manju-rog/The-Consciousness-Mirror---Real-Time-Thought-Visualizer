'use client';

import { useState } from 'react';
import { useConsciousnessStore } from '@/store/consciousness';

export function ConsciousnessExport() {
  const [isOpen, setIsOpen] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);

  const behavioralPattern = useConsciousnessStore((state) => state.behavioralPattern);
  const consciousnessState = useConsciousnessStore((state) => state.consciousnessState);
  const metrics = useConsciousnessStore((state) => state.metrics);
  const visualizationMode = useConsciousnessStore((state) => state.visualizationSettings.mode);

  const captureScreenshot = async () => {
    setIsCapturing(true);

    try {
      // Wait a moment for UI to update
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Find the canvas element
      const canvas = document.querySelector('canvas');
      if (!canvas) {
        alert('Canvas not found');
        setIsCapturing(false);
        return;
      }

      // Get canvas data
      const dataURL = canvas.toDataURL('image/png');

      // Create download link
      const link = document.createElement('a');
      link.download = `consciousness-${Date.now()}.png`;
      link.href = dataURL;
      link.click();

      // Show success message
      alert('✨ Consciousness snapshot captured!');
    } catch (error) {
      console.error('Screenshot failed:', error);
      alert('Failed to capture screenshot');
    } finally {
      setIsCapturing(false);
    }
  };

  const exportConsciousnessData = () => {
    const data = {
      timestamp: Date.now(),
      state: behavioralPattern?.state,
      consciousness: consciousnessState,
      metrics,
      visualizationMode,
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json',
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = `consciousness-data-${Date.now()}.json`;
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);

    alert('📊 Consciousness data exported!');
  };

  const shareToTwitter = () => {
    if (!behavioralPattern || !consciousnessState) {
      alert('Not enough data yet!');
      return;
    }

    const text = `I'm in a ${behavioralPattern.state} state! 🧠✨

Consciousness Level: ${Math.floor(metrics.consciousnessLevel * 100)}
Flow State: ${(consciousnessState.flowStateProbability * 100).toFixed(0)}%
Focus: ${(consciousnessState.focusDepth * 100).toFixed(0)}%
Creativity: ${(consciousnessState.creativityIndex * 100).toFixed(0)}%

Visualizing my consciousness in real-time with The Consciousness Mirror!

#ConsciousnessMirror #Neuroscience #Mindfulness`;

    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const generateConsciousnessCard = async () => {
    if (!behavioralPattern || !consciousnessState) {
      alert('Not enough data yet!');
      return;
    }

    // Create a canvas for the consciousness card
    const cardCanvas = document.createElement('canvas');
    cardCanvas.width = 1200;
    cardCanvas.height = 630;
    const ctx = cardCanvas.getContext('2d');

    if (!ctx) return;

    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, 1200, 630);
    gradient.addColorStop(0, '#1a1a2e');
    gradient.addColorStop(1, '#16213e');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 1200, 630);

    // Title
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 60px Arial';
    ctx.fillText('My Consciousness', 50, 100);

    // State
    ctx.font = '48px Arial';
    ctx.fillText(`State: ${behavioralPattern.state}`, 50, 180);

    // Metrics
    ctx.font = '32px Arial';
    ctx.fillStyle = '#aaaaaa';

    const metricsY = 260;
    const lineHeight = 50;

    ctx.fillText(
      `Consciousness Level: ${Math.floor(metrics.consciousnessLevel * 100)}`,
      50,
      metricsY
    );
    ctx.fillText(
      `Flow State: ${(consciousnessState.flowStateProbability * 100).toFixed(0)}%`,
      50,
      metricsY + lineHeight
    );
    ctx.fillText(
      `Focus: ${(consciousnessState.focusDepth * 100).toFixed(0)}%`,
      50,
      metricsY + lineHeight * 2
    );
    ctx.fillText(
      `Creativity: ${(consciousnessState.creativityIndex * 100).toFixed(0)}%`,
      50,
      metricsY + lineHeight * 3
    );
    ctx.fillText(
      `Stress: ${(consciousnessState.stressLevel * 100).toFixed(0)}%`,
      50,
      metricsY + lineHeight * 4
    );

    // Footer
    ctx.fillStyle = '#666666';
    ctx.font = '24px Arial';
    ctx.fillText('The Consciousness Mirror', 50, 580);

    // Download
    const dataURL = cardCanvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `consciousness-card-${Date.now()}.png`;
    link.href = dataURL;
    link.click();

    alert('🎨 Consciousness card generated!');
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-pink-600 to-purple-600 text-white px-6 py-3 rounded-full hover:scale-105 transition-all z-40 shadow-lg font-semibold"
      >
        📸 Share Consciousness
      </button>
    );
  }

  return (
    <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-black/90 backdrop-blur-xl text-white rounded-2xl shadow-2xl z-40 border border-white/10 p-6 w-96">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold">Share Your Consciousness</h3>
        <button
          onClick={() => setIsOpen(false)}
          className="text-white/60 hover:text-white transition-colors"
        >
          ✕
        </button>
      </div>

      <div className="space-y-3">
        <button
          onClick={captureScreenshot}
          disabled={isCapturing}
          className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-4 py-3 rounded-lg transition-all disabled:opacity-50 font-medium"
        >
          {isCapturing ? '📸 Capturing...' : '📸 Screenshot Visualization'}
        </button>

        <button
          onClick={generateConsciousnessCard}
          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-4 py-3 rounded-lg transition-all font-medium"
        >
          🎨 Generate Consciousness Card
        </button>

        <button
          onClick={exportConsciousnessData}
          className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-4 py-3 rounded-lg transition-all font-medium"
        >
          📊 Export Data (JSON)
        </button>

        <button
          onClick={shareToTwitter}
          className="w-full bg-gradient-to-r from-sky-500 to-blue-500 hover:from-sky-600 hover:to-blue-600 text-white px-4 py-3 rounded-lg transition-all font-medium"
        >
          🐦 Share on Twitter
        </button>
      </div>

      <div className="mt-4 text-xs text-white/40 text-center">
        Capture and share your consciousness moments
      </div>
    </div>
  );
}
