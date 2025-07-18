'use client';

import React from 'react';
import type { GraphData } from '@/app/types';

interface SemanticTreeNodeModalProps {
  selectedNode: string | null;
  data: GraphData;
  onClose: () => void;
}

export function SemanticTreeNodeModal({ selectedNode, data, onClose }: SemanticTreeNodeModalProps) {
  if (!selectedNode) return null;

  // Find the selected node in the raw data
  const node = data.nodes.find(n => n.id === selectedNode);
  if (!node) return null;

  const isUser = selectedNode.startsWith('user-');
  const isMessage = node.type === 'message';

  // Calculate node statistics
  const connectedEdges = data.edges.filter(e => e.source === selectedNode || e.target === selectedNode);
  const replyEdges = connectedEdges.filter(e => e.data.edge_type === 'reply_to');
  const semanticEdges = connectedEdges.filter(e => e.data.edge_type === 'semantic_link');
  
  // For user nodes, find their messages
  let userMessages: typeof data.nodes = [];
  if (isUser) {
    const authorName = selectedNode.replace('user-', '');
    userMessages = data.nodes.filter(n => 
      n.type === 'message' && n.data.author_name === authorName
    );
  }

  // For message nodes, find semantic connections
  let semanticConnections: Array<{ node: typeof node; strength: number }> = [];
  if (isMessage) {
    semanticConnections = semanticEdges
      .map(edge => {
        const connectedNodeId = edge.source === selectedNode ? edge.target : edge.source;
        const connectedNode = data.nodes.find(n => n.id === connectedNodeId);
        return connectedNode ? { node: connectedNode, strength: edge.data.strength } : null;
      })
      .filter(Boolean) as Array<{ node: typeof node; strength: number }>;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-modal-appear">
      {/* Enhanced modal container */}
      <div 
        className="relative rounded-3xl shadow-2xl border max-w-4xl w-full max-h-[90vh] overflow-hidden animate-modal-scale"
        style={{ 
          background: 'rgba(15, 23, 42, 0.95)',
          borderColor: 'rgba(139, 92, 246, 0.3)',
          backdropFilter: 'blur(30px)',
          WebkitBackdropFilter: 'blur(30px)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(139, 92, 246, 0.2)'
        }}
      >
        {/* Animated gradient overlay */}
        <div 
          className="absolute inset-0 opacity-60 pointer-events-none"
          style={{
            background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(59, 130, 246, 0.05) 30%, rgba(16, 185, 129, 0.1) 60%, rgba(245, 158, 11, 0.05) 100%)',
            animation: 'modal-shimmer 8s ease-in-out infinite'
          }}
        />

        {/* Enhanced Header */}
        <div className="sticky top-0 z-20 flex items-center justify-between p-8 border-b border-white/10 bg-slate-900/90 backdrop-blur-xl rounded-t-3xl">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center shadow-lg">
              <span className="text-white text-xl font-bold">{isUser ? '👤' : '💬'}</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white tracking-tight">
                {isUser ? 'User Profile' : 'Message Details'}
              </h2>
              <p className="text-sm text-slate-300 font-medium">
                {isUser ? `@${node.data.author_name || 'Unknown'}` : `Message from @${node.data.author_name || 'Unknown'}`}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="group p-3 text-slate-400 hover:text-white transition-all duration-300 rounded-2xl hover:bg-white/10 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
            <svg className="relative z-10 w-6 h-6 transition-transform duration-300 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="relative z-10 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 120px)' }}>
          <div className="p-8 space-y-8">
            {/* Enhanced Basic Information */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-white border-b border-white/10 pb-3 flex items-center gap-3">
                <span className="text-cyan-400">ℹ️</span>
                Basic Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="group p-6 bg-gradient-to-br from-white/5 to-white/10 rounded-2xl border border-white/10 hover:border-white/20 transition-all duration-300 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="relative z-10">
                    <div className="text-xs text-cyan-400 font-medium uppercase tracking-wide mb-2 flex items-center gap-2">
                      <span>🆔</span> Node ID
                    </div>
                    <div className="text-sm text-slate-200 font-mono break-all leading-relaxed">
                      {selectedNode}
                    </div>
                  </div>
                </div>
                
                <div className="group p-6 bg-gradient-to-br from-white/5 to-white/10 rounded-2xl border border-white/10 hover:border-white/20 transition-all duration-300 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="relative z-10">
                    <div className="text-xs text-indigo-400 font-medium uppercase tracking-wide mb-2 flex items-center gap-2">
                      <span>🏷️</span> Type
                    </div>
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded-lg shadow-lg ${
                        isUser ? 'bg-indigo-500' : 
                        (node.data.is_contextual ? 'bg-green-500' : 'bg-amber-500')
                      }`} style={{
                        borderRadius: isUser ? '50%' : '6px',
                        boxShadow: isUser ? '0 4px 12px rgba(99, 102, 241, 0.4)' : 
                                  node.data.is_contextual ? '0 4px 12px rgba(34, 197, 94, 0.4)' : '0 4px 12px rgba(245, 158, 11, 0.4)'
                      }}></div>
                      <span className="text-sm text-slate-200 font-medium">
                        {isUser ? 'User' : (node.data.is_contextual ? 'Contextual Message' : 'Noise Message')}
                      </span>
                    </div>
                  </div>
                </div>
                
                {node.data.written_at && (
                  <div className="group md:col-span-2 p-6 bg-gradient-to-br from-white/5 to-white/10 rounded-2xl border border-white/10 hover:border-white/20 transition-all duration-300 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-green-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="relative z-10">
                      <div className="text-xs text-emerald-400 font-medium uppercase tracking-wide mb-2 flex items-center gap-2">
                        <span>⏰</span> Timestamp
                      </div>
                      <div className="text-sm text-slate-200 font-mono">
                        {new Date(node.data.written_at).toLocaleString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit'
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Enhanced Message Content */}
            {isMessage && node.data.content && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-white border-b border-white/10 pb-3 flex items-center gap-3">
                  <span className="text-blue-400">💬</span>
                  Message Content
                </h3>
                <div className="p-6 bg-gradient-to-br from-slate-900/80 to-slate-800/80 rounded-2xl border border-white/10 backdrop-blur-sm">
                  <div className="max-h-60 overflow-y-auto custom-scrollbar">
                    <p className="text-sm text-slate-200 leading-relaxed whitespace-pre-wrap">
                      {node.data.content}
                    </p>
                  </div>
                </div>
                
                {node.data.noise_reason && (
                  <div className="p-6 bg-gradient-to-br from-amber-900/30 to-orange-900/30 rounded-2xl border border-amber-500/30 backdrop-blur-sm">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-amber-400 text-lg">⚠️</span>
                      <div className="text-sm text-amber-400 font-medium uppercase tracking-wide">
                        Classified as Noise
                      </div>
                    </div>
                    <p className="text-sm text-amber-200 leading-relaxed">
                      {node.data.noise_reason}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Enhanced User Messages */}
            {isUser && userMessages.length > 0 && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-white border-b border-white/10 pb-3 flex items-center gap-3">
                  <span className="text-purple-400">📝</span>
                  User Messages ({userMessages.length})
                </h3>
                <div className="space-y-4 max-h-80 overflow-y-auto custom-scrollbar">
                  {userMessages.slice(0, 10).map((msg, index) => (
                    <div key={msg.id} className="group p-4 bg-gradient-to-br from-white/5 to-white/10 rounded-2xl border border-white/10 hover:border-white/20 transition-all duration-300 relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="relative z-10 flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="text-xs text-slate-400 mb-2 font-medium">
                            {msg.data.written_at ? new Date(msg.data.written_at).toLocaleString() : 'Unknown time'}
                          </div>
                          <p className="text-sm text-slate-200 line-clamp-3 leading-relaxed">
                            {msg.data.content ? 
                              (msg.data.content.length > 150 ? 
                                msg.data.content.substring(0, 150) + '...' : 
                                msg.data.content
                              ) : 
                              'No content'
                            }
                          </p>
                        </div>
                        <div className={`w-3 h-3 rounded-full flex-shrink-0 shadow-lg ${
                          msg.data.is_contextual ? 'bg-green-500' : 'bg-amber-500'
                        }`} style={{
                          boxShadow: msg.data.is_contextual ? '0 2px 8px rgba(34, 197, 94, 0.4)' : '0 2px 8px rgba(245, 158, 11, 0.4)'
                        }}></div>
                      </div>
                    </div>
                  ))}
                  {userMessages.length > 10 && (
                    <div className="text-center p-4 text-sm text-slate-400 bg-white/5 rounded-2xl border border-white/10">
                      ... and {userMessages.length - 10} more messages
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Enhanced Connection Statistics */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-white border-b border-white/10 pb-3 flex items-center gap-3">
                <span className="text-pink-400">🔗</span>
                Connections
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="group p-6 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-2xl border border-blue-500/30 hover:border-blue-400/50 transition-all duration-300 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="relative z-10">
                    <div className="text-xs text-blue-400 font-medium uppercase tracking-wide mb-3 flex items-center gap-2">
                      <span>🔄</span> Reply Connections
                    </div>
                    <div className="text-3xl font-bold text-blue-400 transition-colors duration-300 group-hover:text-blue-300">
                      {replyEdges.length}
                    </div>
                  </div>
                </div>
                
                <div className="group p-6 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-2xl border border-purple-500/30 hover:border-purple-400/50 transition-all duration-300 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="relative z-10">
                    <div className="text-xs text-purple-400 font-medium uppercase tracking-wide mb-3 flex items-center gap-2">
                      <span>🧠</span> Semantic Links
                    </div>
                    <div className="text-3xl font-bold text-purple-400 transition-colors duration-300 group-hover:text-purple-300">
                      {semanticEdges.length}
                    </div>
                  </div>
                </div>
                
                <div className="group p-6 bg-gradient-to-br from-slate-600/10 to-slate-500/10 rounded-2xl border border-slate-500/30 hover:border-slate-400/50 transition-all duration-300 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-slate-500/5 to-slate-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="relative z-10">
                    <div className="text-xs text-slate-400 font-medium uppercase tracking-wide mb-3 flex items-center gap-2">
                      <span>🌐</span> Total Connections
                    </div>
                    <div className="text-3xl font-bold text-slate-200 transition-colors duration-300 group-hover:text-slate-100">
                      {connectedEdges.length}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Semantic Connections */}
            {isMessage && semanticConnections.length > 0 && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-white border-b border-white/10 pb-3 flex items-center gap-3">
                  <span className="text-purple-400">🧠</span>
                  Semantic Connections
                </h3>
                <div className="space-y-4 max-h-80 overflow-y-auto custom-scrollbar">
                  {semanticConnections
                    .sort((a, b) => b.strength - a.strength)
                    .slice(0, 5)
                    .map(({ node: connectedNode, strength }, index) => (
                      <div key={connectedNode.id} className="group p-5 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-2xl border border-purple-500/30 hover:border-purple-400/50 transition-all duration-300 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <div className="relative z-10 flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-2">
                              <span className="text-sm text-purple-400 font-medium">
                                @{connectedNode.data.author_name || 'Unknown'}
                              </span>
                              <div className="px-3 py-1 bg-gradient-to-r from-purple-600 to-purple-500 text-white text-xs font-bold rounded-full shadow-lg">
                                {(strength * 100).toFixed(0)}%
                              </div>
                            </div>
                            <p className="text-sm text-slate-200 line-clamp-2 leading-relaxed">
                              {connectedNode.data.content ? 
                                (connectedNode.data.content.length > 100 ? 
                                  connectedNode.data.content.substring(0, 100) + '...' : 
                                  connectedNode.data.content
                                ) : 
                                'No content'
                              }
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  {semanticConnections.length > 5 && (
                    <div className="text-center p-4 text-sm text-slate-400 bg-white/5 rounded-2xl border border-white/10">
                      ... and {semanticConnections.length - 5} more connections
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Enhanced Raw Data Section */}
            <details className="space-y-6 group">
              <summary className="text-xl font-semibold text-white border-b border-white/10 pb-3 cursor-pointer hover:text-slate-300 transition-colors duration-300 flex items-center gap-3">
                <span className="text-slate-400">🔧</span>
                Raw Data (Debug)
              </summary>
              <div className="p-6 bg-gradient-to-br from-slate-900/80 to-slate-800/80 rounded-2xl border border-white/10 backdrop-blur-sm">
                <div className="max-h-80 overflow-y-auto custom-scrollbar">
                  <pre className="text-xs text-slate-300 font-mono whitespace-pre-wrap leading-relaxed">
                    {JSON.stringify({ 
                      node, 
                      connectedEdges: connectedEdges.length,
                      userMessages: isUser ? userMessages.length : undefined,
                      semanticConnections: isMessage ? semanticConnections.length : undefined
                    }, null, 2)}
                  </pre>
                </div>
              </div>
            </details>
          </div>
        </div>
      </div>

      {/* CSS animations and styles */}
      <style jsx>{`
        @keyframes modal-appear {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes modal-scale {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(20px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        
        @keyframes modal-shimmer {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 0.8; }
        }
        
        .animate-modal-appear {
          animation: modal-appear 0.2s ease-out;
        }
        
        .animate-modal-scale {
          animation: modal-scale 0.3s ease-out;
        }
        
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 3px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(139, 92, 246, 0.5);
          border-radius: 3px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(139, 92, 246, 0.7);
        }
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
} 