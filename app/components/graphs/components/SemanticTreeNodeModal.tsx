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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
      <div 
        className="relative rounded-2xl shadow-2xl border max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        style={{ 
          backgroundColor: 'rgba(15, 23, 42, 0.98)',
          borderColor: 'rgba(139, 92, 246, 0.4)'
        }}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between p-6 border-b border-slate-700/50 bg-slate-900/80 backdrop-blur-sm rounded-t-2xl">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{isUser ? '👤' : '💬'}</span>
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">
                {isUser ? 'User Details' : 'Message Details'}
              </h2>
              <p className="text-sm text-slate-400">
                {isUser ? `@${node.data.author_name || 'Unknown'}` : `Message from @${node.data.author_name || 'Unknown'}`}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-slate-800/60"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white border-b border-slate-700/50 pb-2">
              Basic Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-800/40 rounded-xl border border-slate-700/40">
                <div className="text-xs text-slate-400 font-medium uppercase tracking-wide mb-1">
                  ID
                </div>
                <div className="text-sm text-slate-200 font-mono break-all">
                  {selectedNode}
                </div>
              </div>
              
              <div className="p-4 bg-slate-800/40 rounded-xl border border-slate-700/40">
                <div className="text-xs text-slate-400 font-medium uppercase tracking-wide mb-1">
                  Type
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${
                    isUser ? 'bg-indigo-500' : 
                    (node.data.is_contextual ? 'bg-green-500' : 'bg-amber-500')
                  }`}></div>
                  <span className="text-sm text-slate-200 font-medium">
                    {isUser ? 'User' : (node.data.is_contextual ? 'Contextual Message' : 'Noise Message')}
                  </span>
                </div>
              </div>
              
              {node.data.written_at && (
                <div className="p-4 bg-slate-800/40 rounded-xl border border-slate-700/40 md:col-span-2">
                  <div className="text-xs text-slate-400 font-medium uppercase tracking-wide mb-1">
                    Timestamp
                  </div>
                  <div className="text-sm text-slate-200">
                    {new Date(node.data.written_at).toLocaleString()}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Message Content (for message nodes) */}
          {isMessage && node.data.content && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white border-b border-slate-700/50 pb-2">
                Message Content
              </h3>
              <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-700/30 max-h-40 overflow-y-auto">
                <p className="text-sm text-slate-200 leading-relaxed whitespace-pre-wrap">
                  {node.data.content}
                </p>
              </div>
              
              {node.data.noise_reason && (
                <div className="p-4 bg-amber-900/20 rounded-xl border border-amber-700/30">
                  <div className="text-xs text-amber-400 font-medium uppercase tracking-wide mb-2">
                    Classified as Noise
                  </div>
                  <p className="text-sm text-amber-200 leading-relaxed">
                    {node.data.noise_reason}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* User Messages (for user nodes) */}
          {isUser && userMessages.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white border-b border-slate-700/50 pb-2">
                User Messages ({userMessages.length})
              </h3>
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {userMessages.slice(0, 10).map((msg, index) => (
                  <div key={msg.id} className="p-3 bg-slate-800/40 rounded-lg border border-slate-700/30">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="text-xs text-slate-400 mb-1">
                          {msg.data.written_at ? new Date(msg.data.written_at).toLocaleString() : 'Unknown time'}
                        </div>
                        <p className="text-sm text-slate-200 line-clamp-2">
                          {msg.data.content ? 
                            (msg.data.content.length > 100 ? 
                              msg.data.content.substring(0, 100) + '...' : 
                              msg.data.content
                            ) : 
                            'No content'
                          }
                        </p>
                      </div>
                      <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                        msg.data.is_contextual ? 'bg-green-500' : 'bg-amber-500'
                      }`}></div>
                    </div>
                  </div>
                ))}
                {userMessages.length > 10 && (
                  <div className="text-center text-sm text-slate-400">
                    ... and {userMessages.length - 10} more messages
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Connection Statistics */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white border-b border-slate-700/50 pb-2">
              Connections
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-blue-900/20 rounded-xl border border-blue-700/30">
                <div className="text-xs text-blue-400 font-medium uppercase tracking-wide mb-1">
                  Reply Connections
                </div>
                <div className="text-2xl font-bold text-blue-400">
                  {replyEdges.length}
                </div>
              </div>
              
              <div className="p-4 bg-purple-900/20 rounded-xl border border-purple-700/30">
                <div className="text-xs text-purple-400 font-medium uppercase tracking-wide mb-1">
                  Semantic Links
                </div>
                <div className="text-2xl font-bold text-purple-400">
                  {semanticEdges.length}
                </div>
              </div>
              
              <div className="p-4 bg-slate-800/40 rounded-xl border border-slate-700/30">
                <div className="text-xs text-slate-400 font-medium uppercase tracking-wide mb-1">
                  Total Connections
                </div>
                <div className="text-2xl font-bold text-slate-200">
                  {connectedEdges.length}
                </div>
              </div>
            </div>
          </div>

          {/* Semantic Connections (for message nodes) */}
          {isMessage && semanticConnections.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white border-b border-slate-700/50 pb-2">
                Semantic Connections
              </h3>
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {semanticConnections
                  .sort((a, b) => b.strength - a.strength)
                  .slice(0, 5)
                  .map(({ node: connectedNode, strength }) => (
                    <div key={connectedNode.id} className="p-3 bg-purple-900/20 rounded-lg border border-purple-700/30">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs text-purple-400 font-medium">
                              @{connectedNode.data.author_name || 'Unknown'}
                            </span>
                            <div className="px-2 py-0.5 bg-purple-600 text-white text-xs font-bold rounded-full">
                              {(strength * 100).toFixed(0)}%
                            </div>
                          </div>
                          <p className="text-sm text-slate-200 line-clamp-2">
                            {connectedNode.data.content ? 
                              (connectedNode.data.content.length > 80 ? 
                                connectedNode.data.content.substring(0, 80) + '...' : 
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
                  <div className="text-center text-sm text-slate-400">
                    ... and {semanticConnections.length - 5} more connections
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Raw Data (expandable debug section) */}
          <details className="space-y-4">
            <summary className="text-lg font-semibold text-white border-b border-slate-700/50 pb-2 cursor-pointer hover:text-slate-300">
              Raw Data (Debug)
            </summary>
            <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-700/30 max-h-60 overflow-y-auto">
              <pre className="text-xs text-slate-300 font-mono whitespace-pre-wrap">
                {JSON.stringify({ 
                  node, 
                  connectedEdges: connectedEdges.length,
                  userMessages: isUser ? userMessages.length : undefined 
                }, null, 2)}
              </pre>
            </div>
          </details>
        </div>
      </div>
    </div>
  );
} 