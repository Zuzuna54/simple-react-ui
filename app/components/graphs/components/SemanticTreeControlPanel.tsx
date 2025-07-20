'use client';

import React from 'react';
import { Filter, RotateCcw, Zap, Eye, User } from 'lucide-react';
import type { FilterState, LayoutType } from '../types';
import { 
  ModernCheckbox, 
  ModernRadio, 
  ModernSearchInput, 
  ModernButton, 
  ModernRangeSlider,
  ModernCard
} from '@/app/components/ui/modern-controls';

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
      className="absolute top-6 left-6 z-10 w-80"
      style={{ 
        maxHeight: height - 120,
        overflowY: 'auto'
      }}
    >
      <ModernCard solid className="p-0 overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-600/40 bg-gray-700/30 rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-purple-500/20 rounded-xl border border-purple-500/30 ml-2">
              <Filter size={20} className="text-purple-400" />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-white tracking-tight">
                Filters & Layout
              </h2>
              <p className="text-xs text-gray-300 mt-0.5">
                Customize your visualization
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Search */}
          <div>
            <h3 className="text-xs font-semibold text-gray-200 uppercase tracking-wider mb-3">
              Search Content
            </h3>
            <ModernSearchInput
              value={filters.contentSearch}
              onChange={(value) => updateFilters({ contentSearch: value })}
              placeholder="Search messages..."
              onClear={() => updateFilters({ contentSearch: '' })}
            />
          </div>

          {/* Authors */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <User size={14} className="text-gray-300" />
              <h3 className="text-xs font-semibold text-gray-200 uppercase tracking-wider">
                Authors
              </h3>
              {filters.authorFilter.length > 0 && (
                <span className="text-xs bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded-full border border-purple-500/30">
                  {filters.authorFilter.length}
                </span>
              )}
            </div>
            
            {/* Enhanced fixed height scrollable authors list */}
            <div className="bg-gray-700/20 border border-gray-600/30 rounded-xl p-3">
              <div className="space-y-1 h-40 overflow-y-auto pr-2 scrollbar-thin scrollbar-track-gray-700 scrollbar-thumb-gray-500 hover:scrollbar-thumb-gray-400">
                {availableAuthors.map(author => (
                  <ModernCheckbox
                    key={author}
                    checked={filters.authorFilter.includes(author)}
                    onChange={(checked) => {
                      if (checked) {
                        updateFilters({ authorFilter: [...filters.authorFilter, author] });
                      } else {
                        updateFilters({ authorFilter: filters.authorFilter.filter(a => a !== author) });
                      }
                    }}
                    label={author}
                    color="purple"
                  />
                ))}
                {availableAuthors.length === 0 && (
                  <div className="flex items-center justify-center h-32 text-gray-400">
                    <p className="text-sm">No authors available</p>
                  </div>
                )}
              </div>
            </div>
            
            {filters.authorFilter.length > 0 && (
              <ModernButton
                onClick={() => updateFilters({ authorFilter: [] })}
                variant="ghost"
                size="sm"
                className="mt-3 text-xs w-full"
              >
                Clear ({filters.authorFilter.length})
              </ModernButton>
            )}
          </div>

          {/* Date Range */}
          <div>
            <h3 className="text-xs font-semibold text-gray-200 uppercase tracking-wider mb-3">
              Date Range
            </h3>
            <div className="space-y-3">
              <input
                type="date"
                value={filters.dateRange.start || ''}
                onChange={(e) => updateFilters({ 
                  dateRange: { ...filters.dateRange, start: e.target.value || null }
                })}
                className="w-full px-4 py-3 bg-gray-700/60 border border-gray-500/60 rounded-2xl text-gray-100 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 focus:bg-gray-700 transition-all duration-200 text-sm hover:border-gray-400/70"
              />
              <input
                type="date"
                value={filters.dateRange.end || ''}
                onChange={(e) => updateFilters({ 
                  dateRange: { ...filters.dateRange, end: e.target.value || null }
                })}
                className="w-full px-4 py-3 bg-gray-700/60 border border-gray-500/60 rounded-2xl text-gray-100 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 focus:bg-gray-700 transition-all duration-200 text-sm hover:border-gray-400/70"
              />
              {(filters.dateRange.start || filters.dateRange.end) && (
                <ModernButton
                  onClick={() => updateFilters({ dateRange: { start: null, end: null } })}
                  variant="ghost"
                  size="sm"
                  className="text-xs w-full"
                >
                  Clear dates
                </ModernButton>
              )}
            </div>
          </div>

          {/* Layout */}
          <div>
            <h3 className="text-xs font-semibold text-gray-200 uppercase tracking-wider mb-3">
              Layout Style
            </h3>
            <div className="space-y-2">
              <ModernRadio
                selected={layoutType === 'tree'}
                onChange={() => setLayoutType('tree')}
                label="Hierarchical Tree"
                description="Organized top-down structure"
                color="purple"
              />
              <ModernRadio
                selected={layoutType === 'force'}
                onChange={() => setLayoutType('force')}
                label="Force Network"
                description="Natural clustering layout"
                color="purple"
              />
              <ModernRadio
                selected={layoutType === 'radial'}
                onChange={() => setLayoutType('radial')}
                label="Radial Layout"
                description="Circular arrangement"
                color="purple"
              />
            </div>
          </div>

          {/* Message Types */}
          <div>
            <h3 className="text-xs font-semibold text-gray-200 uppercase tracking-wider mb-3">
              Message Types
            </h3>
            <div className="space-y-2">
              <ModernCheckbox
                checked={filters.showContextual}
                onChange={(checked) => updateFilters({ showContextual: checked })}
                label="Contextual Messages"
                color="green"
              />
              <ModernCheckbox
                checked={filters.showNoise}
                onChange={(checked) => updateFilters({ showNoise: checked })}
                label="Noise Messages"
                color="amber"
              />
            </div>
          </div>

          {/* Relationships */}
          <div>
            <h3 className="text-xs font-semibold text-gray-200 uppercase tracking-wider mb-3">
              Relationships
            </h3>
            <div className="space-y-2">
              <ModernCheckbox
                checked={filters.showUserMessageEdges}
                onChange={(checked) => updateFilters({ showUserMessageEdges: checked })}
                label="User-Message Links"
                color="indigo"
              />
              <ModernCheckbox
                checked={filters.showReplyEdges}
                onChange={(checked) => updateFilters({ showReplyEdges: checked })}
                label="Reply Chains"
                color="blue"
              />
              <ModernCheckbox
                checked={filters.showSemanticEdges}
                onChange={(checked) => updateFilters({ showSemanticEdges: checked })}
                label="Semantic Links"
                color="purple"
              />
            </div>
          </div>

          {/* Semantic Threshold */}
          {filters.showSemanticEdges && (
            <div>
              <h3 className="text-xs font-semibold text-gray-200 uppercase tracking-wider mb-3">
                Semantic Threshold
              </h3>
              <div className="space-y-3">
                <ModernRangeSlider
                  value={filters.semanticThreshold}
                  onChange={(value) => updateFilters({ semanticThreshold: value })}
                  min={0}
                  max={1}
                  step={0.1}
                  color="purple"
                />
                <div className="flex justify-between text-xs text-gray-400">
                  <span>Weak (0%)</span>
                  <span className="font-medium text-purple-400">
                    {(filters.semanticThreshold * 100).toFixed(0)}%
                  </span>
                  <span>Strong (100%)</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Actions Footer */}
        <div className="p-6 border-t border-gray-600/40 bg-gray-700/30 space-y-3 rounded-b-2xl">
          <ModernButton
            onClick={onResetView}
            variant="secondary"
            className="w-full"
          >
            <Eye size={16} className="mr-2" />
            Reset View
          </ModernButton>
          
          {layoutType === 'force' && (
            <ModernButton
              onClick={onRestartPhysics}
              variant="secondary"
              className="w-full"
            >
              <Zap size={16} className="mr-2" />
              Restart Physics
            </ModernButton>
          )}
          
          <ModernButton
            onClick={onResetAllFilters}
            variant="ghost"
            className="w-full"
          >
            <RotateCcw size={16} className="mr-2" />
            Reset All Filters
          </ModernButton>
        </div>
      </ModernCard>
    </div>
  );
} 