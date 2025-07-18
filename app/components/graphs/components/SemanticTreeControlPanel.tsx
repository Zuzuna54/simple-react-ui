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
        maxHeight: height - 120,
        width: '320px'
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
          className="absolute inset-0 opacity-50 pointer-events-none"
          style={{
            background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(59, 130, 246, 0.05) 50%, rgba(16, 185, 129, 0.1) 100%)',
            animation: 'gradient-shift 8s ease-in-out infinite'
          }}
        />
        
        {/* Scrollable content */}
        <div 
          className="relative z-10 overflow-y-auto"
          style={{ maxHeight: height - 140 }}
        >
          <div className="p-6 space-y-6">
            {/* Enhanced Header */}
            <div className="border-b border-white/10 pb-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center">
                  <span className="text-white text-sm font-bold">🌳</span>
                </div>
                <h2 className="text-xl font-bold text-white tracking-tight">
                  Semantic Tree
                </h2>
              </div>
              <p className="text-sm text-slate-300 font-medium opacity-80">
                Interactive conversation analysis
              </p>
            </div>

            {/* Modern Search Section */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-slate-200 mb-3 uppercase tracking-wide flex items-center gap-2">
                <span className="text-purple-400">🔍</span>
                Search Content
              </h3>
              <div className="relative group">
                <input
                  type="text"
                  placeholder="Search messages and authors..."
                  value={filters.contentSearch}
                  onChange={(e) => updateFilters({ contentSearch: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-slate-200 placeholder-slate-400 focus:outline-none focus:border-purple-400/50 focus:bg-white/10 transition-all duration-300 backdrop-blur-sm"
                  style={{
                    boxShadow: 'inset 0 2px 8px rgba(0, 0, 0, 0.1)'
                  }}
                />
                {filters.contentSearch && (
                  <button
                    onClick={() => updateFilters({ contentSearch: '' })}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white transition-all duration-200 hover:scale-110 p-1 rounded-full hover:bg-white/10"
                  >
                    ✕
                  </button>
                )}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </div>
            </div>

            {/* Enhanced Author Filter */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-slate-200 mb-3 uppercase tracking-wide flex items-center gap-2">
                <span className="text-blue-400">👤</span>
                Filter by Author
              </h3>
              <div className="space-y-2 max-h-32 overflow-y-auto custom-scrollbar">
                {availableAuthors.map(author => (
                  <label key={author} className="group flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-300 hover:bg-white/5 hover:backdrop-blur-sm relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <input
                      type="checkbox"
                      checked={filters.authorFilter.includes(author)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          updateFilters({ authorFilter: [...filters.authorFilter, author] });
                        } else {
                          updateFilters({ authorFilter: filters.authorFilter.filter(a => a !== author) });
                        }
                      }}
                      className="relative z-10 w-4 h-4 text-blue-500 bg-white/10 border-white/20 rounded focus:ring-blue-500 focus:ring-2 focus:ring-offset-0 transition-all duration-200 hover:scale-110"
                    />
                    <span className="relative z-10 text-sm text-slate-200 group-hover:text-white transition-colors duration-200 flex-1">
                      {author}
                    </span>
                  </label>
                ))}
              </div>
              {filters.authorFilter.length > 0 && (
                <button
                  onClick={() => updateFilters({ authorFilter: [] })}
                  className="text-xs text-slate-400 hover:text-slate-200 transition-colors duration-200 px-3 py-1 rounded-full hover:bg-white/5"
                >
                  Clear author filter ({filters.authorFilter.length} selected)
                </button>
              )}
            </div>

            {/* Modern Date Range Filter */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-slate-200 mb-3 uppercase tracking-wide flex items-center gap-2">
                <span className="text-green-400">📅</span>
                Date Range
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-slate-400 mb-2 block font-medium">From:</label>
                  <input
                    type="date"
                    value={filters.dateRange.start || ''}
                    onChange={(e) => updateFilters({ 
                      dateRange: { ...filters.dateRange, start: e.target.value || null }
                    })}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-slate-200 focus:outline-none focus:border-green-400/50 focus:bg-white/10 transition-all duration-300 text-sm backdrop-blur-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 mb-2 block font-medium">To:</label>
                  <input
                    type="date"
                    value={filters.dateRange.end || ''}
                    onChange={(e) => updateFilters({ 
                      dateRange: { ...filters.dateRange, end: e.target.value || null }
                    })}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-slate-200 focus:outline-none focus:border-green-400/50 focus:bg-white/10 transition-all duration-300 text-sm backdrop-blur-sm"
                  />
                </div>
                {(filters.dateRange.start || filters.dateRange.end) && (
                  <button
                    onClick={() => updateFilters({ dateRange: { start: null, end: null } })}
                    className="text-xs text-slate-400 hover:text-slate-200 transition-colors duration-200 px-3 py-1 rounded-full hover:bg-white/5"
                  >
                    Clear date filter
                  </button>
                )}
              </div>
            </div>

            {/* Enhanced Layout Controls */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-slate-200 mb-4 uppercase tracking-wide flex items-center gap-2">
                <span className="text-amber-400">⚡</span>
                Layout Style
              </h3>
              <div className="space-y-3">
                {[
                  { key: 'tree', label: '🌳 Hierarchical Tree', desc: 'Top-down structure', color: 'from-green-500 to-emerald-500' },
                  { key: 'force', label: '🕸️ Force Network', desc: 'Natural clustering', color: 'from-blue-500 to-cyan-500' },
                  { key: 'radial', label: '⭕ Radial Layout', desc: 'Circular arrangement', color: 'from-purple-500 to-pink-500' }
                ].map(({ key, label, desc, color }) => (
                  <label key={key} className="group flex items-start gap-4 p-4 rounded-2xl cursor-pointer transition-all duration-300 hover:bg-white/5 relative overflow-hidden border border-transparent hover:border-white/10">
                    <div className={`absolute inset-0 bg-gradient-to-r ${color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                    <input
                      type="radio"
                      name="layout"
                      checked={layoutType === key}
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      onChange={() => setLayoutType(key as any)}
                      className="relative z-10 mt-1.5 w-4 h-4 text-purple-500 bg-white/10 border-white/20 focus:ring-purple-500 focus:ring-2 focus:ring-offset-0 transition-all duration-200 hover:scale-110"
                    />
                    <div className="relative z-10 flex-1 min-w-0">
                      <div className="text-sm font-medium text-slate-200 group-hover:text-white transition-colors duration-200">
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

            {/* Enhanced Message Type Filters */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-slate-200 mb-4 uppercase tracking-wide flex items-center gap-2">
                <span className="text-cyan-400">💬</span>
                Message Types
              </h3>
              <div className="space-y-3">
                <label className="group flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all duration-300 hover:bg-white/5 relative overflow-hidden border border-transparent hover:border-green-500/20">
                  <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <input
                    type="checkbox"
                    checked={filters.showContextual}
                    onChange={(e) => updateFilters({ showContextual: e.target.checked })}
                    className="relative z-10 w-4 h-4 text-green-500 bg-white/10 border-white/20 rounded focus:ring-green-500 focus:ring-2 focus:ring-offset-0 transition-all duration-200 hover:scale-110"
                  />
                  <div className="relative z-10 w-3 h-3 rounded-full bg-green-500 shadow-lg"></div>
                  <span className="relative z-10 text-sm font-medium text-slate-200 group-hover:text-white transition-colors duration-200 flex-1">
                    Contextual Messages
                  </span>
                </label>
                
                <label className="group flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all duration-300 hover:bg-white/5 relative overflow-hidden border border-transparent hover:border-amber-500/20">
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <input
                    type="checkbox"
                    checked={filters.showNoise}
                    onChange={(e) => updateFilters({ showNoise: e.target.checked })}
                    className="relative z-10 w-4 h-4 text-amber-500 bg-white/10 border-white/20 rounded focus:ring-amber-500 focus:ring-2 focus:ring-offset-0 transition-all duration-200 hover:scale-110"
                  />
                  <div className="relative z-10 w-3 h-3 rounded-full bg-amber-500 shadow-lg"></div>
                  <span className="relative z-10 text-sm font-medium text-slate-200 group-hover:text-white transition-colors duration-200 flex-1">
                    Noise Messages
                  </span>
                </label>
              </div>
            </div>

            {/* Enhanced Relationship Filters */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-slate-200 mb-4 uppercase tracking-wide flex items-center gap-2">
                <span className="text-pink-400">🔗</span>
                Relationships
              </h3>
              <div className="space-y-3">
                <label className="group flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all duration-300 hover:bg-white/5 relative overflow-hidden border border-transparent hover:border-indigo-500/20">
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <input
                    type="checkbox"
                    checked={filters.showUserMessageEdges}
                    onChange={(e) => updateFilters({ showUserMessageEdges: e.target.checked })}
                    className="relative z-10 w-4 h-4 text-indigo-500 bg-white/10 border-white/20 rounded focus:ring-indigo-500 focus:ring-2 focus:ring-offset-0 transition-all duration-200 hover:scale-110"
                  />
                  <div className="relative z-10 w-8 h-0.5 bg-indigo-500 rounded-full shadow-lg"></div>
                  <span className="relative z-10 text-sm font-medium text-slate-200 group-hover:text-white transition-colors duration-200 flex-1">
                    User-Message Links
                  </span>
                </label>
                
                <label className="group flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all duration-300 hover:bg-white/5 relative overflow-hidden border border-transparent hover:border-blue-500/20">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <input
                    type="checkbox"
                    checked={filters.showReplyEdges}
                    onChange={(e) => updateFilters({ showReplyEdges: e.target.checked })}
                    className="relative z-10 w-4 h-4 text-blue-500 bg-white/10 border-white/20 rounded focus:ring-blue-500 focus:ring-2 focus:ring-offset-0 transition-all duration-200 hover:scale-110"
                  />
                  <div className="relative z-10 w-8 h-0.5 bg-blue-500 rounded-full shadow-lg"></div>
                  <span className="relative z-10 text-sm font-medium text-slate-200 group-hover:text-white transition-colors duration-200 flex-1">
                    Reply Chains
                  </span>
                </label>
                
                <label className="group flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all duration-300 hover:bg-white/5 relative overflow-hidden border border-transparent hover:border-purple-500/20">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <input
                    type="checkbox"
                    checked={filters.showSemanticEdges}
                    onChange={(e) => updateFilters({ showSemanticEdges: e.target.checked })}
                    className="relative z-10 w-4 h-4 text-purple-500 bg-white/10 border-white/20 rounded focus:ring-purple-500 focus:ring-2 focus:ring-offset-0 transition-all duration-200 hover:scale-110"
                  />
                  <div className="relative z-10 w-8 h-0.5 bg-purple-500 rounded-full shadow-lg border-dashed relative">
                    <div className="absolute inset-0 border-t-2 border-dashed border-purple-300 opacity-60 rounded-full"></div>
                  </div>
                  <span className="relative z-10 text-sm font-medium text-slate-200 group-hover:text-white transition-colors duration-200 flex-1">
                    Semantic Links
                  </span>
                </label>
              </div>
            </div>

            {/* Enhanced Semantic Threshold */}
            {filters.showSemanticEdges && (
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-slate-200 mb-4 uppercase tracking-wide flex items-center gap-2">
                  <span className="text-purple-400">🎯</span>
                  Semantic Similarity
                </h3>
                <div className="space-y-4 p-6 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm">
                  <div className="relative group">
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={filters.semanticThreshold}
                      onChange={(e) => updateFilters({ semanticThreshold: parseFloat(e.target.value) })}
                      className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer slider transition-all duration-300"
                      style={{
                        background: `linear-gradient(to right, #8b5cf6 0%, #8b5cf6 ${filters.semanticThreshold * 100}%, rgba(255,255,255,0.1) ${filters.semanticThreshold * 100}%, rgba(255,255,255,0.1) 100%)`
                      }}
                    />
                    <style jsx>{`
                      .slider::-webkit-slider-thumb {
                        appearance: none;
                        height: 20px;
                        width: 20px;
                        border-radius: 50%;
                        background: linear-gradient(135deg, #8b5cf6, #a855f7);
                        cursor: pointer;
                        border: 2px solid #ffffff;
                        box-shadow: 0 4px 12px rgba(139, 92, 246, 0.4);
                        transition: all 0.2s ease;
                      }
                      .slider::-webkit-slider-thumb:hover {
                        transform: scale(1.1);
                        box-shadow: 0 6px 16px rgba(139, 92, 246, 0.6);
                      }
                      .slider::-moz-range-thumb {
                        height: 20px;
                        width: 20px;
                        border-radius: 50%;
                        background: linear-gradient(135deg, #8b5cf6, #a855f7);
                        cursor: pointer;
                        border: 2px solid #ffffff;
                        box-shadow: 0 4px 12px rgba(139, 92, 246, 0.4);
                        transition: all 0.2s ease;
                      }
                    `}</style>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400 font-medium">Weak</span>
                    <div className="px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-500 text-white font-bold rounded-full text-xs shadow-lg">
                      {(filters.semanticThreshold * 100).toFixed(0)}%
                    </div>
                    <span className="text-slate-400 font-medium">Strong</span>
                  </div>
                </div>
              </div>
            )}

            {/* Enhanced Action Buttons */}
            <div className="pt-6 border-t border-white/10 space-y-3">
              <button
                onClick={onResetView}
                className="w-full px-6 py-4 text-sm font-semibold bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 text-white rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3 relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="relative z-10 text-lg">🎯</span>
                <span className="relative z-10">Fit to View</span>
              </button>
              
              {layoutType === 'force' && (
                <button
                  onClick={onRestartPhysics}
                  className="w-full px-6 py-3 text-sm font-medium bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3 relative overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <span className="relative z-10 text-lg">⚡</span>
                  <span className="relative z-10">Restart Physics</span>
                </button>
              )}
              
              <button
                onClick={onResetAllFilters}
                className="w-full px-6 py-3 text-sm font-medium bg-white/5 hover:bg-white/10 text-slate-200 hover:text-white rounded-2xl transition-all duration-300 border border-white/10 hover:border-white/20 transform hover:scale-[1.01] active:scale-[0.99]"
              >
                Reset All Filters
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* CSS animations */}
      <style jsx>{`
        @keyframes gradient-shift {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 0.8; }
        }
        
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 2px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(139, 92, 246, 0.5);
          border-radius: 2px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(139, 92, 246, 0.7);
        }
      `}</style>
    </div>
  );
} 