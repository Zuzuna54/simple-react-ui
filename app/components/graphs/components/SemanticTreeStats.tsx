'use client';

import React from 'react';
import type { GraphData } from '@/app/types';

interface SemanticTreeStatsProps {
  filteredData: GraphData;
}

export function SemanticTreeStats({ filteredData }: SemanticTreeStatsProps) {
  // Calculate stats based on the hierarchical data structure
  // Note: At this point filteredData still contains the original message nodes
  // The hierarchical processor will add user nodes and user-message edges
  
  const messageNodes = filteredData.nodes.filter(n => n.type === 'message');
  const contextualCount = messageNodes.filter(n => n.data.is_contextual).length;
  const noiseCount = messageNodes.filter(n => !n.data.is_contextual).length;
  
  // Count unique users from messages
  const uniqueAuthors = new Set(
    messageNodes
      .map(n => n.data.author_name)
      .filter(Boolean)
  );
  const userCount = uniqueAuthors.size;
  
  const replyCount = filteredData.edges.filter(e => e.data.edge_type === 'reply_to').length;
  const semanticCount = filteredData.edges.filter(e => e.data.edge_type === 'semantic_link').length;

  return (
    <div 
      className="absolute bottom-6 left-6 rounded-2xl shadow-2xl backdrop-blur-md border z-10"
      style={{ 
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        borderColor: 'rgba(148, 163, 184, 0.2)',
        width: '280px'
      }}
    >
      <div className="p-5 space-y-4">
        <div className="border-b border-slate-700/50 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-lg">📊</span>
            <h3 className="text-lg font-bold text-white tracking-tight">
              Graph Statistics
            </h3>
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-slate-200 font-medium">Total Elements</span>
            <div className="flex items-center gap-2 text-sm">
              <span className="px-2 py-1 bg-indigo-600 text-white font-bold rounded-lg">
                {userCount}
              </span>
              <span className="text-slate-400">users</span>
              <span className="px-2 py-1 bg-blue-600 text-white font-bold rounded-lg">
                {messageNodes.length}
              </span>
              <span className="text-slate-400">messages</span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="p-3 bg-slate-800/40 rounded-xl border border-slate-700/40">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
                <span className="text-xs text-slate-400 font-medium uppercase tracking-wide">Users</span>
              </div>
              <div className="text-xl font-bold text-indigo-400">
                {userCount}
              </div>
            </div>
            
            <div className="p-3 bg-slate-800/40 rounded-xl border border-slate-700/40">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span className="text-xs text-slate-400 font-medium uppercase tracking-wide">Contextual</span>
              </div>
              <div className="text-xl font-bold text-green-400">
                {contextualCount}
              </div>
            </div>
            
            <div className="p-3 bg-slate-800/40 rounded-xl border border-slate-700/40">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                <span className="text-xs text-slate-400 font-medium uppercase tracking-wide">Noise</span>
              </div>
              <div className="text-xl font-bold text-amber-400">
                {noiseCount}
              </div>
            </div>
            
            <div className="p-3 bg-slate-800/40 rounded-xl border border-slate-700/40">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-4 h-0.5 bg-blue-500 rounded-full"></div>
                <span className="text-xs text-slate-400 font-medium uppercase tracking-wide">Replies</span>
              </div>
              <div className="text-xl font-bold text-blue-400">
                {replyCount}
              </div>
            </div>
          </div>
          
          <div className="pt-2 border-t border-slate-700/40">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-0.5 bg-purple-500 rounded-full relative">
                  <div className="absolute inset-0 border-t border-dashed border-purple-300 opacity-70"></div>
                </div>
                <span className="text-slate-200 font-medium">Semantic Links</span>
              </div>
              <div className="text-lg font-bold text-purple-400">
                {semanticCount}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 