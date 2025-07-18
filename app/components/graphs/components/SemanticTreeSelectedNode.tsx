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
  const isUser = selectedNode.startsWith('user-');

  return (
    <div 
      className="absolute bottom-6 right-6 z-10 group animate-slide-up"
      style={{ 
        width: '350px',
        maxWidth: '350px'
      }}
    >
      {/* Modern glassmorphism container */}
      <div 
        className="rounded-3xl shadow-2xl backdrop-blur-xl border overflow-hidden"
        style={{ 
          background: 'rgba(15, 23, 42, 0.85)',
          borderColor: 'rgba(139, 92, 246, 0.3)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(139, 92, 246, 0.2)'
        }}
      >
        {/* Animated gradient overlay */}
        <div 
          className="absolute inset-0 opacity-50 pointer-events-none"
          style={{
            background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(59, 130, 246, 0.1) 50%, rgba(16, 185, 129, 0.15) 100%)',
            animation: 'selected-glow 3s ease-in-out infinite alternate'
          }}
        />
        
        <div className="relative z-10 p-6 space-y-6">
          {/* Enhanced Header */}
          <div className="border-b border-white/10 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center shadow-lg">
                <span className="text-white text-lg font-bold">🎯</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white tracking-tight">
                  Selected Node
                </h3>
                <p className="text-sm text-slate-300 opacity-80">
                  {isUser ? 'User Profile' : 'Message Details'}
                </p>
              </div>
            </div>
          </div>
          
          {/* Enhanced Node Type Badge */}
          <div className="space-y-4">
            <div className="group flex items-center gap-4 p-4 bg-gradient-to-r from-white/5 to-white/10 rounded-2xl border border-white/10 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className={`relative z-10 w-5 h-5 rounded-lg shadow-lg transition-transform duration-300 group-hover:scale-110 ${
                isChannel ? 'bg-purple-500 border-2 border-purple-300/30' : 
                isUser ? 'bg-indigo-500 border-2 border-indigo-300/30' :
                (node.data.is_contextual ? 'bg-green-500 border-2 border-green-300/30' : 'bg-amber-500 border-2 border-amber-300/30')
              }`} style={{
                borderRadius: isUser ? '50%' : '8px',
                boxShadow: isUser ? '0 4px 12px rgba(99, 102, 241, 0.4)' : 
                          node.data.is_contextual ? '0 4px 12px rgba(34, 197, 94, 0.4)' : '0 4px 12px rgba(245, 158, 11, 0.4)'
              }}></div>
              <div className="relative z-10 flex-1">
                <span className="text-sm font-semibold text-white">
                  {isChannel ? 'Channel' : 
                   isUser ? 'User Profile' :
                   (node.data.is_contextual ? 'Contextual' : 'Noise')} {isUser ? '' : 'Message'}
                </span>
                <div className="text-xs text-slate-400 mt-0.5">
                  {isChannel ? 'Root conversation starter' : 
                   isUser ? 'User node with associated messages' :
                   (node.data.is_contextual ? 'Relevant to discussion' : 'Off-topic or low value')}
                </div>
              </div>
            </div>
            
            {/* Enhanced Node Metadata */}
            <div className="space-y-3">
              <div className="group flex items-center justify-between p-3 rounded-xl transition-all duration-300 hover:bg-white/5">
                <span className="text-xs text-slate-400 font-medium uppercase tracking-wide">Node ID</span>
                <span className="text-sm font-semibold text-slate-200 font-mono text-right max-w-48 truncate">
                  {selectedNode}
                </span>
              </div>
              
              <div className="group flex items-center justify-between p-3 rounded-xl transition-all duration-300 hover:bg-white/5">
                <span className="text-xs text-slate-400 font-medium uppercase tracking-wide">Author</span>
                <span className="text-sm font-semibold text-slate-200">
                  @{node.data.author_name || 'System'}
                </span>
              </div>
              
              {node.data.written_at && (
                <div className="group flex items-center justify-between p-3 rounded-xl transition-all duration-300 hover:bg-white/5">
                  <span className="text-xs text-slate-400 font-medium uppercase tracking-wide">Timestamp</span>
                  <span className="text-xs text-slate-300 font-mono">
                    {new Date(node.data.written_at).toLocaleString()}
                  </span>
                </div>
              )}
            </div>
          </div>
          
          {/* Enhanced Content Section */}
          {node.data.content && (
            <div className="space-y-3">
              <span className="text-xs text-slate-400 font-medium uppercase tracking-wide flex items-center gap-2">
                <span className="text-cyan-400">💬</span>
                Content Preview
              </span>
              <div className="p-4 bg-gradient-to-br from-slate-900/60 to-slate-800/60 rounded-2xl border border-white/10 max-h-32 overflow-y-auto backdrop-blur-sm">
                <p className="text-sm text-slate-200 leading-relaxed break-words">
                  {node.data.content.substring(0, 200)}
                  {node.data.content.length > 200 && (
                    <span className="text-slate-400 italic ml-1">... (click node for full content)</span>
                  )}
                </p>
              </div>
            </div>
          )}
          
          {/* Enhanced Noise Reason Section */}
          {node.data.noise_reason && (
            <div className="space-y-3">
              <span className="text-xs text-slate-400 font-medium uppercase tracking-wide flex items-center gap-2">
                <span className="text-amber-400">⚠️</span>
                Classification Reason
              </span>
              <div className="p-4 bg-gradient-to-br from-amber-900/20 to-orange-900/20 rounded-2xl border border-amber-500/20 backdrop-blur-sm">
                <p className="text-sm text-amber-200 leading-relaxed">
                  {node.data.noise_reason}
                </p>
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="pt-4 border-t border-white/10">
            <div className="flex gap-2">
              <button className="flex-1 px-4 py-2 text-xs font-medium bg-gradient-to-r from-purple-600/20 to-purple-500/20 hover:from-purple-600/30 hover:to-purple-500/30 text-purple-200 rounded-xl border border-purple-500/30 transition-all duration-300 hover:scale-[1.02]">
                View Full Details
              </button>
              <button className="px-4 py-2 text-xs font-medium bg-white/5 hover:bg-white/10 text-slate-300 rounded-xl border border-white/10 transition-all duration-300 hover:scale-[1.02]">
                Copy ID
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* CSS animations */}
      <style jsx>{`
        @keyframes selected-glow {
          0% { opacity: 0.5; }
          100% { opacity: 0.8; }
        }
        
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </div>
  );
} 