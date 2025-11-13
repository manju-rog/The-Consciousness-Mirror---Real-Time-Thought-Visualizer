'use client';

import { useConsciousnessStore } from '@/store/consciousness';
import { useState } from 'react';

export function DebugPanel() {
  const [isOpen, setIsOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<'stats' | 'behavior' | 'performance'>('stats');

  const interactions = useConsciousnessStore((state) => state.interactions);
  const statisticalFeatures = useConsciousnessStore((state) => state.statisticalFeatures);
  const behavioralPattern = useConsciousnessStore((state) => state.behavioralPattern);
  const fps = useConsciousnessStore((state) => state.fps);
  const processingTime = useConsciousnessStore((state) => state.processingTime);
  const particleCount = useConsciousnessStore((state) => state.particleCount);

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 bg-black/80 text-white px-4 py-2 rounded-lg backdrop-blur-sm hover:bg-black/90 transition-colors z-50"
      >
        Show Debug Panel
      </button>
    );
  }

  return (
    <div className="fixed top-4 right-4 w-96 bg-black/80 backdrop-blur-md text-white rounded-lg shadow-2xl z-50 max-h-[90vh] overflow-hidden flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/20">
        <h2 className="text-lg font-bold">Consciousness Monitor</h2>
        <button
          onClick={() => setIsOpen(false)}
          className="text-white/60 hover:text-white transition-colors"
        >
          ✕
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/20">
        <button
          onClick={() => setActiveTab('stats')}
          className={`flex-1 px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === 'stats'
              ? 'bg-white/10 text-white border-b-2 border-blue-400'
              : 'text-white/60 hover:text-white'
          }`}
        >
          Statistics
        </button>
        <button
          onClick={() => setActiveTab('behavior')}
          className={`flex-1 px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === 'behavior'
              ? 'bg-white/10 text-white border-b-2 border-purple-400'
              : 'text-white/60 hover:text-white'
          }`}
        >
          Behavior
        </button>
        <button
          onClick={() => setActiveTab('performance')}
          className={`flex-1 px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === 'performance'
              ? 'bg-white/10 text-white border-b-2 border-green-400'
              : 'text-white/60 hover:text-white'
          }`}
        >
          Performance
        </button>
      </div>

      {/* Content */}
      <div className="p-4 overflow-y-auto flex-1">
        {activeTab === 'stats' && (
          <div className="space-y-3">
            <div className="text-sm">
              <div className="text-white/60 mb-2">Interaction Data</div>
              <MetricRow label="Total Interactions" value={interactions.length} />
              <MetricRow
                label="Interaction Rate"
                value={statisticalFeatures?.interactionDensity.toFixed(2) + '/s' || '0/s'}
              />
            </div>

            {statisticalFeatures && (
              <>
                <div className="text-sm border-t border-white/10 pt-3">
                  <div className="text-white/60 mb-2">Mouse Metrics</div>
                  <MetricRow
                    label="Velocity (mean)"
                    value={statisticalFeatures.mouseVelocityMean.toFixed(0) + ' px/s'}
                  />
                  <MetricRow
                    label="Velocity (std)"
                    value={statisticalFeatures.mouseVelocityStd.toFixed(0) + ' px/s'}
                  />
                  <MetricRow
                    label="Acceleration"
                    value={statisticalFeatures.mouseAccelerationMean.toFixed(0) + ' px/s²'}
                  />
                  <MetricRow label="Jerk" value={statisticalFeatures.mouseJerkMean.toFixed(0)} />
                  <MetricRow
                    label="Smoothness"
                    value={(statisticalFeatures.movementSmoothnessCoefficient * 100).toFixed(1) + '%'}
                  />
                  <MetricRow
                    label="Path Curvature"
                    value={statisticalFeatures.pathCurvatureMean.toFixed(3)}
                  />
                </div>

                <div className="text-sm border-t border-white/10 pt-3">
                  <div className="text-white/60 mb-2">Click Metrics</div>
                  <MetricRow
                    label="Click Entropy"
                    value={statisticalFeatures.clickPositionEntropy.toFixed(2)}
                  />
                  <MetricRow
                    label="Click Duration"
                    value={statisticalFeatures.clickDurationMean.toFixed(0) + ' ms'}
                  />
                  <MetricRow
                    label="Double-click Speed"
                    value={statisticalFeatures.doubleClickSpeed.toFixed(2) + ' Hz'}
                  />
                </div>

                <div className="text-sm border-t border-white/10 pt-3">
                  <div className="text-white/60 mb-2">Keyboard Metrics</div>
                  <MetricRow
                    label="Typing Rhythm"
                    value={statisticalFeatures.typingRhythmMean.toFixed(0) + ' ms'}
                  />
                  <MetricRow
                    label="Rhythm Variance"
                    value={statisticalFeatures.typingRhythmVariance.toFixed(0)}
                  />
                  <MetricRow
                    label="Backspace Frequency"
                    value={(statisticalFeatures.backspaceFrequency * 100).toFixed(1) + '%'}
                  />
                </div>

                <div className="text-sm border-t border-white/10 pt-3">
                  <div className="text-white/60 mb-2">Temporal Metrics</div>
                  <MetricRow
                    label="Pause Frequency"
                    value={(statisticalFeatures.pauseFrequency * 100).toFixed(1) + '%'}
                  />
                  <MetricRow
                    label="Pause Duration"
                    value={statisticalFeatures.pauseDurationMean.toFixed(0) + ' ms'}
                  />
                  <MetricRow
                    label="Idle Time"
                    value={(statisticalFeatures.idleTime / 1000).toFixed(1) + ' s'}
                  />
                </div>
              </>
            )}
          </div>
        )}

        {activeTab === 'behavior' && (
          <div className="space-y-4">
            {behavioralPattern ? (
              <>
                <div>
                  <div className="text-white/60 text-sm mb-2">Current State</div>
                  <div className="text-2xl font-bold capitalize mb-2">{behavioralPattern.state}</div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="text-sm text-white/60">Confidence:</div>
                    <div className="flex-1 bg-white/20 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-blue-400 h-full transition-all duration-300"
                        style={{ width: `${behavioralPattern.confidence * 100}%` }}
                      />
                    </div>
                    <div className="text-sm font-mono">
                      {(behavioralPattern.confidence * 100).toFixed(0)}%
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-sm text-white/60">Intensity:</div>
                    <div className="flex-1 bg-white/20 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-purple-400 h-full transition-all duration-300"
                        style={{ width: `${behavioralPattern.intensity * 100}%` }}
                      />
                    </div>
                    <div className="text-sm font-mono">
                      {(behavioralPattern.intensity * 100).toFixed(0)}%
                    </div>
                  </div>
                </div>

                <div className="border-t border-white/10 pt-4">
                  <div className="text-white/60 text-sm mb-2">Analysis</div>
                  <div className="text-sm leading-relaxed">{behavioralPattern.description}</div>
                </div>

                <div className="border-t border-white/10 pt-4">
                  <div className="text-white/60 text-sm mb-2">State History</div>
                  <div className="text-xs text-white/40">
                    Last updated: {new Date(behavioralPattern.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              </>
            ) : (
              <div className="text-white/40 text-sm text-center py-8">
                Collecting data... Move your mouse and interact with the page.
              </div>
            )}
          </div>
        )}

        {activeTab === 'performance' && (
          <div className="space-y-4">
            <div>
              <div className="text-white/60 text-sm mb-2">Rendering</div>
              <MetricRow label="FPS" value={fps.toFixed(0)} />
              <MetricRow label="Particles" value={particleCount.toLocaleString()} />
            </div>

            <div className="border-t border-white/10 pt-4">
              <div className="text-white/60 text-sm mb-2">Processing</div>
              <MetricRow label="Analysis Time" value={processingTime.toFixed(2) + ' ms'} />
              <MetricRow
                label="Analysis Overhead"
                value={((processingTime / 100) * 100).toFixed(1) + '%'}
              />
            </div>

            <div className="border-t border-white/10 pt-4">
              <div className="text-white/60 text-sm mb-2">Memory</div>
              <MetricRow label="Interactions Stored" value={interactions.length} />
              <MetricRow
                label="Memory Usage"
                value={(interactions.length * 0.2).toFixed(1) + ' KB (est)'}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function MetricRow({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex justify-between items-center py-1 text-xs">
      <span className="text-white/80">{label}</span>
      <span className="font-mono text-white">{value}</span>
    </div>
  );
}
