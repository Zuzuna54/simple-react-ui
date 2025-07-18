'use client';

import React from 'react';
import type { GraphData } from '@/app/types';

interface SemanticTreeSelectedNodeProps {
  selectedNode: string | null;
  data: GraphData;
}

export function SemanticTreeSelectedNode({ selectedNode, data }: SemanticTreeSelectedNodeProps) {
  if (!selectedNode) return null;

  const node = data.nodes.find(n => n.id === selectedNode);
  if (!node) return null;

  const isChannel = node.id.includes('channel');

  return (
    <div 
      className="absolute bottom-6 right-6 rounded-2xl shadow-2xl backdrop-blur-md border z-10"
      style={{ 
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        borderColor: 'rgba(139, 92, 246, 0.4)',
        width: '320px',
        maxWidth: '320px'
      }}
    >
      <div className="p-5 space-y-4">
        <div className="border-b border-slate-700/50 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-lg">🎯</span>
            <h3 className="text-lg font-bold text-white tracking-tight">
              Selected Message
            </h3>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-3 bg-slate-800/40 rounded-xl border border-slate-700/40">
            <div className={`w-4 h-4 rounded-lg shadow-sm ${isChannel ? 'bg-purple-500 border-2 border-purple-300/30' : (node.data.is_contextual ? 'bg-green-500 border-2 border-green-300/30' : 'bg-amber-500 border-2 border-amber-300/30')}`}></div>
            <div>
              <span className="text-sm font-semibold text-white">
                {isChannel ? 'Channel' : (node.data.is_contextual ? 'Contextual' : 'Noise')} Message
              </span>
              <div className="text-xs text-slate-400 mt-0.5">
                {isChannel ? 'Root conversation starter' : (node.data.is_contextual ? 'Relevant to discussion' : 'Off-topic or low value')}
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 font-medium uppercase tracking-wide">Author</span>
              <span className="text-sm font-semibold text-slate-200">
                {node.data.author_name || 'System'}
              </span>
            </div>
            
            {node.data.written_at && (
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400 font-medium uppercase tracking-wide">Timestamp</span>
                <span className="text-xs text-slate-300 font-mono">
                  {new Date(node.data.written_at).toLocaleString()}
                </span>
              </div>
            )}
          </div>
          
          {node.data.content && (
            <div className="space-y-2">
              <span className="text-xs text-slate-400 font-medium uppercase tracking-wide">Content</span>
              <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-700/30 max-h-32 overflow-y-auto">
                <p className="text-sm text-slate-200 leading-relaxed break-words">
                  {node.data.content.substring(0, 200)}
                  {node.data.content.length > 200 && (
                    <span className="text-slate-400 italic">... (truncated)</span>
                  )}
                </p>
              </div>
            </div>
          )}
          
          {node.data.noise_reason && (
            <div className="space-y-2">
              <span className="text-xs text-slate-400 font-medium uppercase tracking-wide">Noise Reason</span>
              <div className="p-3 bg-amber-900/20 rounded-xl border border-amber-700/30">
                <p className="text-sm text-amber-200 leading-relaxed">
                  {node.data.noise_reason}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 