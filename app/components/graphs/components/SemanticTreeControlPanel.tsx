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
  onRestartPhysics: () => void;
  availableAuthors: string[];
  onResetAllFilters: () => void;
}

export function SemanticTreeControlPanel({
  height,
  layoutType,
  setLayoutType,
  filters,
  updateFilters,
  onResetView,
  onRestartPhysics,
  availableAuthors,
  onResetAllFilters
}: SemanticTreeControlPanelProps) {
  return (
    <div 
      className="absolute top-6 left-6 z-10 group"
      style={{ 
        width: '320px',
        maxHeight: `${height - 100}px`
      }}
    >
      {/* Modern glassmorphism container */}
      <div 
        className="rounded-3xl shadow-2xl backdrop-blur-xl border overflow-hidden"
        style={{ 
          background: 'rgba(15, 23, 42, 0.85)',
          borderColor: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.05)'
        }}
      >
        {/* Animated gradient overlay */}
        <div 
          className="absolute inset-0 opacity-30 pointer-events-none"
          style={{
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(59, 130, 246, 0.05) 50%, rgba(16, 185, 129, 0.1) 100%)',
            animation: 'gradient-shift 6s ease-in-out infinite alternate'
          }}
        />
        
        <div className="relative z-10 p-6 space-y-6">
          {/* Enhanced Header */}
          <div className="border-b border-white/10 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                <span className="text-white text-sm font-bold">⚙️</span>
              </div>
              <h3 className="text-xl font-bold text-white tracking-tight">
                Graph Controls
              </h3>
            </div>
          </div>

          {/* Enhanced Layout Controls */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-slate-200 mb-3 uppercase tracking-wide flex items-center gap-2">
              <span className="text-blue-400">🎯</span>
              Layout Engine
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {(['force', 'circular', 'grid', 'radial'] as LayoutType[]).map((layout) => (
                <button
                  key={layout}
                  onClick={() => setLayoutType(layout)}
                  className={`group p-3 rounded-xl text-sm font-medium transition-all duration-300 relative overflow-hidden border ${
                    layoutType === layout
                      ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-200 border-blue-400/50 shadow-lg'
                      : 'bg-white/5 text-slate-300 hover:text-white border-white/10 hover:border-white/20 hover:bg-white/10'
                  }`}
                >
                  <div className={`absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                    layoutType === layout ? 'opacity-100' : ''
                  }`} />
                  <span className="relative z-10 capitalize">{layout}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Enhanced Message Type Filters */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-slate-200 mb-3 uppercase tracking-wide flex items-center gap-2">
              <span className="text-green-400">📋</span>
              Message Types
            </h4>
            <div className="space-y-3">
              {/* Contextual Messages */}
              <div className="group flex items-center justify-between p-3 rounded-xl border border-white/10 hover:border-green-400/30 transition-all duration-300 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative z-10 flex items-center gap-3">
                  <div className="w-3 h-3 rounded-lg bg-green-500 shadow-lg"></div>
                  <span className="text-sm text-slate-200 font-medium">Contextual</span>
                </div>
                <div className="relative z-10">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.showContextual}
                      onChange={(e) => updateFilters({ showContextual: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all duration-300 peer-checked:bg-gradient-to-r peer-checked:from-green-500 peer-checked:to-emerald-500 shadow-inner"></div>
                  </label>
                </div>
              </div>

              {/* Noise Messages */}
              <div className="group flex items-center justify-between p-3 rounded-xl border border-white/10 hover:border-amber-400/30 transition-all duration-300 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative z-10 flex items-center gap-3">
                  <div className="w-3 h-3 rounded-lg bg-amber-500 shadow-lg"></div>
                  <span className="text-sm text-slate-200 font-medium">Noise</span>
                </div>
                <div className="relative z-10">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.showNoise}
                      onChange={(e) => updateFilters({ showNoise: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all duration-300 peer-checked:bg-gradient-to-r peer-checked:from-amber-500 peer-checked:to-orange-500 shadow-inner"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Relationship Filters */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-slate-200 mb-3 uppercase tracking-wide flex items-center gap-2">
              <span className="text-pink-400">🔗</span>
              Relationships
            </h4>
            <div className="space-y-3">
              {/* User-Message Edges */}
              <div className="group flex items-center justify-between p-3 rounded-xl border border-white/10 hover:border-indigo-400/30 transition-all duration-300 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative z-10 flex items-center gap-3">
                  <div className="w-6 h-0.5 bg-indigo-500 rounded-full shadow-lg"></div>
                  <span className="text-sm text-slate-200 font-medium">User-Message</span>
                </div>
                <div className="relative z-10">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.showUserMessageEdges}
                      onChange={(e) => updateFilters({ showUserMessageEdges: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all duration-300 peer-checked:bg-gradient-to-r peer-checked:from-indigo-500 peer-checked:to-blue-500 shadow-inner"></div>
                  </label>
                </div>
              </div>

              {/* Reply Edges */}
              <div className="group flex items-center justify-between p-3 rounded-xl border border-white/10 hover:border-blue-400/30 transition-all duration-300 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative z-10 flex items-center gap-3">
                  <div className="w-6 h-0.5 bg-blue-500 rounded-full shadow-lg"></div>
                  <span className="text-sm text-slate-200 font-medium">Reply Chains</span>
                </div>
                <div className="relative z-10">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.showReplyEdges}
                      onChange={(e) => updateFilters({ showReplyEdges: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all duration-300 peer-checked:bg-gradient-to-r peer-checked:from-blue-500 peer-checked:to-cyan-500 shadow-inner"></div>
                  </label>
                </div>
              </div>

              {/* Semantic Edges */}
              <div className="group flex items-center justify-between p-3 rounded-xl border border-white/10 hover:border-purple-400/30 transition-all duration-300 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative z-10 flex items-center gap-3">
                  <div className="w-6 h-0.5 bg-purple-500 rounded-full relative shadow-lg">
                    <div className="absolute inset-0 border-t-2 border-dashed border-purple-300 opacity-70 rounded-full"></div>
                  </div>
                  <span className="text-sm text-slate-200 font-medium">Semantic Links</span>
                </div>
                <div className="relative z-10">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.showSemanticEdges}
                      onChange={(e) => updateFilters({ showSemanticEdges: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all duration-300 peer-checked:bg-gradient-to-r peer-checked:from-purple-500 peer-checked:to-pink-500 shadow-inner"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Author Filter */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-slate-200 mb-3 uppercase tracking-wide flex items-center gap-2">
              <span className="text-cyan-400">👥</span>
              Authors
            </h4>
            <div className="group relative">
              <select
                multiple
                value={filters.authorFilter}
                onChange={(e) => updateFilters({ 
                  authorFilter: Array.from(e.target.selectedOptions, option => option.value)
                })}
                className="w-full h-32 p-3 bg-white/5 border border-white/10 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-cyan-400/50 focus:bg-white/10 transition-all duration-300 resize-none scrollbar-thin scrollbar-track-transparent scrollbar-thumb-cyan-500/50"
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(10px)'
                }}
              >
                {availableAuthors.map(author => (
                  <option 
                    key={author} 
                    value={author}
                    className="bg-slate-800 text-slate-200 p-2 hover:bg-slate-700"
                  >
                    @{author}
                  </option>
                ))}
              </select>
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl pointer-events-none" />
            </div>
          </div>

          {/* Enhanced Content Search */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-slate-200 mb-3 uppercase tracking-wide flex items-center gap-2">
              <span className="text-yellow-400">🔍</span>
              Content Search
            </h4>
            <div className="group relative">
              <input
                type="text"
                placeholder="Search message content..."
                value={filters.contentSearch}
                onChange={(e) => updateFilters({ contentSearch: e.target.value })}
                className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-sm text-slate-200 placeholder-slate-400 focus:outline-none focus:border-yellow-400/50 focus:bg-white/10 transition-all duration-300"
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(10px)'
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/5 to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl pointer-events-none" />
            </div>
          </div>

          {/* Enhanced Semantic Threshold */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-slate-200 mb-3 uppercase tracking-wide flex items-center gap-2">
              <span className="text-purple-400">⚡</span>
              Semantic Threshold
            </h4>
            <div className="group space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">Strength:</span>
                <span className="text-sm font-bold text-purple-400 px-2 py-1 bg-purple-500/20 rounded-lg">
                  {filters.semanticThreshold.toFixed(1)}
                </span>
              </div>
              <div className="relative">
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={filters.semanticThreshold}
                  onChange={(e) => updateFilters({ semanticThreshold: parseFloat(e.target.value) })}
                  className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer focus:outline-none slider-thumb"
                  style={{
                    background: `linear-gradient(to right, rgb(147, 51, 234) 0%, rgb(147, 51, 234) ${filters.semanticThreshold * 100}%, rgba(255, 255, 255, 0.1) ${filters.semanticThreshold * 100}%, rgba(255, 255, 255, 0.1) 100%)`
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Enhanced Action Buttons */}
          <div className="pt-4 border-t border-white/10">
            <div className="space-y-3">
              {/* Primary Actions */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={onResetView}
                  className="group px-4 py-3 bg-gradient-to-r from-blue-600/20 to-blue-500/20 hover:from-blue-600/30 hover:to-blue-500/30 text-blue-200 font-medium rounded-xl border border-blue-500/30 transition-all duration-300 hover:scale-[1.02] relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <span className="relative z-10 text-sm">Reset View</span>
                </button>
                
                {layoutType === 'force' && (
                  <button
                    onClick={onRestartPhysics}
                    className="group px-4 py-3 bg-gradient-to-r from-green-600/20 to-green-500/20 hover:from-green-600/30 hover:to-green-500/30 text-green-200 font-medium rounded-xl border border-green-500/30 transition-all duration-300 hover:scale-[1.02] relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <span className="relative z-10 text-sm">Restart Physics</span>
                  </button>
                )}
              </div>

              {/* Reset All Filters */}
              <button
                onClick={onResetAllFilters}
                className="group w-full px-4 py-3 bg-gradient-to-r from-slate-600/20 to-slate-500/20 hover:from-red-600/20 hover:to-red-500/20 text-slate-300 hover:text-red-200 font-medium rounded-xl border border-slate-500/30 hover:border-red-500/30 transition-all duration-300 hover:scale-[1.02] relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="relative z-10 text-sm">Reset All Filters</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Inline styles for animations to avoid styled-jsx nesting */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes gradient-shift {
            0%, 100% { opacity: 0.3; }
            50% { opacity: 0.6; }
          }
          
          .scrollbar-thin::-webkit-scrollbar {
            width: 4px;
          }
          
          .scrollbar-thin::-webkit-scrollbar-track {
            background: rgba(255, 255, 255, 0.05);
            border-radius: 2px;
          }
          
          .scrollbar-thin::-webkit-scrollbar-thumb {
            background: rgba(139, 92, 246, 0.5);
            border-radius: 2px;
          }
          
          .scrollbar-thin::-webkit-scrollbar-thumb:hover {
            background: rgba(139, 92, 246, 0.7);
          }
          
          .slider-thumb::-webkit-slider-thumb {
            appearance: none;
            height: 20px;
            width: 20px;
            border-radius: 50%;
            background: linear-gradient(135deg, rgb(147, 51, 234), rgb(168, 85, 247));
            cursor: pointer;
            box-shadow: 0 4px 12px rgba(147, 51, 234, 0.4);
            border: 2px solid rgba(255, 255, 255, 0.2);
            transition: all 0.2s ease-in-out;
          }
          
          .slider-thumb::-webkit-slider-thumb:hover {
            transform: scale(1.1);
            box-shadow: 0 6px 16px rgba(147, 51, 234, 0.6);
          }
        `
      }} />
    </div>
  );
} 