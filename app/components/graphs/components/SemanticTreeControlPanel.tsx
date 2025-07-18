'use client';

import React from 'react';
import type { FilterState, LayoutType } from '../types';

interface SemanticTreeControlPanelProps {
  height: number;
  layoutType: LayoutType;
  setLayoutType: (layout: LayoutType) => void;
  filters: FilterState;
  updateFilters: (filters: Partial<FilterState>) => void;
  onResetView: () => void;
}

export function SemanticTreeControlPanel({
  height,
  layoutType,
  setLayoutType,
  filters,
  updateFilters,
  onResetView
}: SemanticTreeControlPanelProps) {
  return (
    <div 
      className="absolute top-6 left-6 z-10 rounded-2xl shadow-2xl backdrop-blur-md border"
      style={{ 
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        borderColor: 'rgba(148, 163, 184, 0.2)',
        maxHeight: height - 120,
        overflowY: 'auto',
        width: '280px'
      }}
    >
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="border-b border-slate-700/50 pb-4">
          <h2 className="text-xl font-bold text-white mb-1 tracking-tight">
            Semantic Tree
          </h2>
          <p className="text-sm text-slate-400 font-medium">
            Interactive conversation analysis
          </p>
        </div>

        {/* Layout Controls */}
        <div>
          <h3 className="text-sm font-semibold text-slate-200 mb-4 uppercase tracking-wide">
            Layout Style
          </h3>
          <div className="space-y-3">
            {[
              { key: 'tree', label: '🌳 Hierarchical Tree', desc: 'Top-down structure' },
              { key: 'force', label: '🕸️ Force Network', desc: 'Natural clustering' },
              { key: 'radial', label: '⭕ Radial Layout', desc: 'Circular arrangement' }
            ].map(({ key, label, desc }) => (
              <label key={key} className="group flex items-start gap-4 p-3 rounded-xl cursor-pointer transition-all duration-200 hover:bg-slate-800/60 border border-transparent hover:border-slate-600/30">
                <input
                  type="radio"
                  name="layout"
                  checked={layoutType === key}
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  onChange={() => setLayoutType(key as any)}
                  className="mt-1.5 w-4 h-4 text-purple-500 bg-slate-700 border-slate-600 focus:ring-purple-500 focus:ring-2 focus:ring-offset-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-slate-200 group-hover:text-white transition-colors">
                    {label}
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                    {desc}
                  </div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Content Filters */}
        <div>
          <h3 className="text-sm font-semibold text-slate-200 mb-4 uppercase tracking-wide">
            Message Types
          </h3>
          <div className="space-y-3">
            <label className="group flex items-center gap-4 p-3 rounded-xl cursor-pointer transition-all duration-200 hover:bg-slate-800/60 border border-transparent hover:border-slate-600/30">
              <input
                type="checkbox"
                checked={filters.showContextual}
                onChange={(e) => updateFilters({ showContextual: e.target.checked })}
                className="w-4 h-4 text-green-500 bg-slate-700 border-slate-600 rounded focus:ring-green-500 focus:ring-2 focus:ring-offset-0"
              />
              <div className="w-3 h-3 rounded-full bg-green-500 shadow-sm"></div>
              <span className="text-sm font-medium text-slate-200 group-hover:text-white transition-colors flex-1">
                Contextual Messages
              </span>
            </label>
            
            <label className="group flex items-center gap-4 p-3 rounded-xl cursor-pointer transition-all duration-200 hover:bg-slate-800/60 border border-transparent hover:border-slate-600/30">
              <input
                type="checkbox"
                checked={filters.showNoise}
                onChange={(e) => updateFilters({ showNoise: e.target.checked })}
                className="w-4 h-4 text-amber-500 bg-slate-700 border-slate-600 rounded focus:ring-amber-500 focus:ring-2 focus:ring-offset-0"
              />
              <div className="w-3 h-3 rounded-full bg-amber-500 shadow-sm"></div>
              <span className="text-sm font-medium text-slate-200 group-hover:text-white transition-colors flex-1">
                Noise Messages
              </span>
            </label>
          </div>
        </div>

        {/* Relationship Filters */}
        <div>
          <h3 className="text-sm font-semibold text-slate-200 mb-4 uppercase tracking-wide">
            Relationships
          </h3>
          <div className="space-y-3">
            <label className="group flex items-center gap-4 p-3 rounded-xl cursor-pointer transition-all duration-200 hover:bg-slate-800/60 border border-transparent hover:border-slate-600/30">
              <input
                type="checkbox"
                checked={filters.showReplyEdges}
                onChange={(e) => updateFilters({ showReplyEdges: e.target.checked })}
                className="w-4 h-4 text-blue-500 bg-slate-700 border-slate-600 rounded focus:ring-blue-500 focus:ring-2 focus:ring-offset-0"
              />
              <div className="w-8 h-0.5 bg-blue-500 rounded-full shadow-sm"></div>
              <span className="text-sm font-medium text-slate-200 group-hover:text-white transition-colors flex-1">
                Reply Chains
              </span>
            </label>
            
            <label className="group flex items-center gap-4 p-3 rounded-xl cursor-pointer transition-all duration-200 hover:bg-slate-800/60 border border-transparent hover:border-slate-600/30">
              <input
                type="checkbox"
                checked={filters.showSemanticEdges}
                onChange={(e) => updateFilters({ showSemanticEdges: e.target.checked })}
                className="w-4 h-4 text-purple-500 bg-slate-700 border-slate-600 rounded focus:ring-purple-500 focus:ring-2 focus:ring-offset-0"
              />
              <div className="w-8 h-0.5 bg-purple-500 rounded-full shadow-sm border-dashed relative">
                <div className="absolute inset-0 border-t-2 border-dashed border-purple-300 opacity-60"></div>
              </div>
              <span className="text-sm font-medium text-slate-200 group-hover:text-white transition-colors flex-1">
                Semantic Links
              </span>
            </label>
          </div>
        </div>

        {/* Semantic Threshold */}
        {filters.showSemanticEdges && (
          <div>
            <h3 className="text-sm font-semibold text-slate-200 mb-4 uppercase tracking-wide">
              Semantic Similarity
            </h3>
            <div className="space-y-4 p-4 bg-slate-800/40 rounded-xl border border-slate-700/40">
              <div className="relative">
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={filters.semanticThreshold}
                  onChange={(e) => updateFilters({ semanticThreshold: parseFloat(e.target.value) })}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer slider"
                  style={{
                    background: `linear-gradient(to right, #8b5cf6 0%, #8b5cf6 ${filters.semanticThreshold * 100}%, #374151 ${filters.semanticThreshold * 100}%, #374151 100%)`
                  }}
                />
                <style jsx>{`
                  .slider::-webkit-slider-thumb {
                    appearance: none;
                    height: 20px;
                    width: 20px;
                    border-radius: 50%;
                    background: #8b5cf6;
                    cursor: pointer;
                    border: 2px solid #ffffff;
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
                  }
                  .slider::-moz-range-thumb {
                    height: 20px;
                    width: 20px;
                    border-radius: 50%;
                    background: #8b5cf6;
                    cursor: pointer;
                    border: 2px solid #ffffff;
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
                  }
                `}</style>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 font-medium">Weak</span>
                <div className="px-3 py-1 bg-purple-600 text-white font-bold rounded-full text-xs shadow-sm">
                  {(filters.semanticThreshold * 100).toFixed(0)}%
                </div>
                <span className="text-slate-400 font-medium">Strong</span>
              </div>
            </div>
          </div>
        )}

        {/* View Controls */}
        <div className="pt-4 border-t border-slate-700/50">
          <button
            onClick={onResetView}
            className="w-full px-4 py-3 text-sm font-semibold bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
          >
            <span className="text-base">🎯</span>
            Fit to View
          </button>
        </div>
      </div>
    </div>
  );
} 