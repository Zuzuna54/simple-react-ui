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

  // Calculate percentages for visual elements
  const totalMessages = messageNodes.length;
  const contextualPercentage = totalMessages > 0 ? (contextualCount / totalMessages) * 100 : 0;
  const noisePercentage = totalMessages > 0 ? (noiseCount / totalMessages) * 100 : 0;

  return (
    <div 
      className="absolute bottom-6 left-6 z-10 group"
      style={{ width: '320px' }}
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
          className="absolute inset-0 opacity-40 pointer-events-none"
          style={{
            background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(59, 130, 246, 0.05) 50%, rgba(147, 51, 234, 0.1) 100%)',
            animation: 'stats-pulse 4s ease-in-out infinite alternate'
          }}
        />
        
        <div className="relative z-10 p-6 space-y-6">
          {/* Enhanced Header */}
          <div className="border-b border-white/10 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-500 to-blue-500 flex items-center justify-center">
                <span className="text-white text-sm font-bold">📊</span>
              </div>
              <h3 className="text-xl font-bold text-white tracking-tight">
                Graph Statistics
              </h3>
            </div>
          </div>
          
          {/* Overview Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-slate-200 font-medium">Total Elements</span>
              <div className="flex items-center gap-3 text-sm">
                <div className="flex items-center gap-2">
                  <div className="px-3 py-1.5 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white font-bold rounded-xl shadow-lg">
                    {userCount}
                  </div>
                  <span className="text-slate-400 font-medium">users</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="px-3 py-1.5 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-bold rounded-xl shadow-lg">
                    {messageNodes.length}
                  </div>
                  <span className="text-slate-400 font-medium">messages</span>
                </div>
              </div>
            </div>
            
            {/* Progress bar for message types */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-slate-400">
                <span>Message Distribution</span>
                <span>{totalMessages} total</span>
              </div>
              <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full flex">
                  <div 
                    className="bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-1000 ease-out"
                    style={{ width: `${contextualPercentage}%` }}
                  />
                  <div 
                    className="bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-1000 ease-out"
                    style={{ width: `${noisePercentage}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
          
          {/* Enhanced Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            {/* Users Card */}
            <div className="group p-4 bg-gradient-to-br from-indigo-500/10 to-blue-500/10 rounded-2xl border border-indigo-500/20 hover:border-indigo-400/40 transition-all duration-300 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 rounded-full bg-indigo-500 shadow-lg"></div>
                  <span className="text-xs text-indigo-400 font-medium uppercase tracking-wide">Users</span>
                </div>
                <div className="text-2xl font-bold text-indigo-400 transition-colors duration-300 group-hover:text-indigo-300">
                  {userCount}
                </div>
              </div>
            </div>
            
            {/* Contextual Messages Card */}
            <div className="group p-4 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-2xl border border-green-500/20 hover:border-green-400/40 transition-all duration-300 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 shadow-lg"></div>
                  <span className="text-xs text-green-400 font-medium uppercase tracking-wide">Contextual</span>
                </div>
                <div className="text-2xl font-bold text-green-400 transition-colors duration-300 group-hover:text-green-300">
                  {contextualCount}
                </div>
                <div className="text-xs text-green-400/70 mt-1">
                  {contextualPercentage.toFixed(1)}%
                </div>
              </div>
            </div>
            
            {/* Noise Messages Card */}
            <div className="group p-4 bg-gradient-to-br from-amber-500/10 to-orange-500/10 rounded-2xl border border-amber-500/20 hover:border-amber-400/40 transition-all duration-300 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 rounded-full bg-amber-500 shadow-lg"></div>
                  <span className="text-xs text-amber-400 font-medium uppercase tracking-wide">Noise</span>
                </div>
                <div className="text-2xl font-bold text-amber-400 transition-colors duration-300 group-hover:text-amber-300">
                  {noiseCount}
                </div>
                <div className="text-xs text-amber-400/70 mt-1">
                  {noisePercentage.toFixed(1)}%
                </div>
              </div>
            </div>
            
            {/* Reply Connections Card */}
            <div className="group p-4 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-2xl border border-blue-500/20 hover:border-blue-400/40 transition-all duration-300 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-4 h-0.5 bg-blue-500 rounded-full shadow-lg"></div>
                  <span className="text-xs text-blue-400 font-medium uppercase tracking-wide">Replies</span>
                </div>
                <div className="text-2xl font-bold text-blue-400 transition-colors duration-300 group-hover:text-blue-300">
                  {replyCount}
                </div>
              </div>
            </div>
          </div>
          
          {/* Enhanced Semantic Links Section */}
          <div className="pt-4 border-t border-white/10">
            <div className="group p-4 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-2xl border border-purple-500/20 hover:border-purple-400/40 transition-all duration-300 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative z-10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-0.5 bg-purple-500 rounded-full relative shadow-lg">
                      <div className="absolute inset-0 border-t border-dashed border-purple-300 opacity-70"></div>
                    </div>
                    <span className="text-sm text-purple-400 font-medium">Semantic Links</span>
                  </div>
                  <div className="text-xl font-bold text-purple-400 transition-colors duration-300 group-hover:text-purple-300">
                    {semanticCount}
                  </div>
                </div>
                
                {/* Connection density indicator */}
                <div className="mt-3">
                  <div className="flex justify-between text-xs text-purple-400/70 mb-1">
                    <span>Connection Density</span>
                    <span>{totalMessages > 0 ? (semanticCount / Math.max(1, totalMessages)).toFixed(2) : 0}</span>
                  </div>
                  <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-1000 ease-out"
                      style={{ width: `${Math.min(100, (semanticCount / Math.max(1, totalMessages)) * 100 * 10)}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Insights */}
          <div className="pt-2">
            <div className="p-4 bg-gradient-to-r from-white/5 to-white/10 rounded-2xl border border-white/10 backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm">📈</span>
                <span className="text-xs text-slate-300 font-medium">Network Health</span>
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="text-slate-400">
                  <span className="text-slate-300">Activity:</span> {userCount > 0 ? (messageNodes.length / userCount).toFixed(1) : 0} msg/user
                </div>
                <div className="text-slate-400">
                  <span className="text-slate-300">Quality:</span> {contextualPercentage.toFixed(0)}% contextual
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CSS animations */}
      <style jsx>{`
        @keyframes stats-pulse {
          0% { opacity: 0.4; }
          100% { opacity: 0.7; }
        }
      `}</style>
    </div>
  );
} 