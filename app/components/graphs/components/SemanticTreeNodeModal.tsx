'use client';

import React from 'react';
import { X, User, MessageCircle, Clock, Hash, Zap, Link2 } from 'lucide-react';
import { ModernCard, ModernBadge, ModernButton } from '@/app/components/ui/modern-controls';
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-hidden">
        <ModernCard className="overflow-y-auto max-h-full">
          {/* Header */}
          <div className="sticky top-0 z-10 flex items-center justify-between p-6 border-b border-slate-700/50 bg-slate-900/95 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                {isUser ? (
                  <User size={20} className="text-purple-400" />
                ) : (
                  <MessageCircle size={20} className="text-purple-400" />
                )}
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white tracking-tight">
                  {isUser ? 'User Profile' : 'Message Details'}
                </h2>
                <p className="text-sm text-slate-400">
                  {isUser ? `@${node.data.author_name || 'Unknown'}` : `From @${node.data.author_name || 'Unknown'}`}
                </p>
              </div>
            </div>
            <ModernButton
              onClick={onClose}
              variant="ghost"
              size="sm"
              className="p-2"
            >
              <X size={16} />
            </ModernButton>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Basic Information */}
            <div>
              <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Hash size={14} />
                Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-800/30 rounded-lg border border-slate-700/30">
                  <span className="text-xs text-slate-500 block mb-2 uppercase tracking-wider">ID</span>
                  <span className="text-sm text-slate-200 font-mono break-all">{selectedNode}</span>
                </div>
                <div className="p-4 bg-slate-800/30 rounded-lg border border-slate-700/30">
                  <span className="text-xs text-slate-500 block mb-2 uppercase tracking-wider">Type</span>
                  <ModernBadge 
                    variant={isUser ? 'info' : (node.data.is_contextual ? 'success' : 'warning')}
                  >
                    {isUser ? 'User' : (node.data.is_contextual ? 'Contextual' : 'Noise')}
                  </ModernBadge>
                </div>
                {node.data.written_at && (
                  <div className="md:col-span-2 p-4 bg-slate-800/30 rounded-lg border border-slate-700/30">
                    <span className="text-xs text-slate-500 mb-2 uppercase tracking-wider flex items-center gap-2">
                      <Clock size={12} />
                      Timestamp
                    </span>
                    <span className="text-sm text-slate-200">
                      {new Date(node.data.written_at).toLocaleString()}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Message Content */}
            {isMessage && node.data.content && (
              <div>
                <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <MessageCircle size={14} />
                  Content
                </h3>
                <div className="p-4 bg-slate-800/30 rounded-lg border border-slate-700/30">
                  <p className="text-sm text-slate-200 leading-relaxed whitespace-pre-wrap">
                    {node.data.content}
                  </p>
                  {node.data.noise_reason && (
                    <div className="mt-4 pt-4 border-t border-amber-500/20">
                      <ModernBadge variant="warning" className="mb-2">
                        Noise Reason
                      </ModernBadge>
                      <p className="text-sm text-amber-300">
                        {node.data.noise_reason}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* User Messages */}
            {isUser && userMessages.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <MessageCircle size={14} />
                  Recent Messages ({userMessages.length})
                </h3>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {userMessages.slice(0, 5).map(msg => (
                    <div key={msg.id} className="p-3 bg-slate-800/30 rounded-lg border border-slate-700/30">
                      <div className="flex items-center justify-between mb-2">
                        <ModernBadge 
                          variant={msg.data.is_contextual ? 'success' : 'warning'}
                          size="sm"
                        >
                          {msg.data.is_contextual ? 'Contextual' : 'Noise'}
                        </ModernBadge>
                        <span className="text-xs text-slate-500">
                          {msg.data.written_at ? new Date(msg.data.written_at).toLocaleTimeString() : 'Unknown time'}
                        </span>
                      </div>
                      <p className="text-sm text-slate-200 line-clamp-2">{msg.data.content}</p>
                    </div>
                  ))}
                  {userMessages.length > 5 && (
                    <p className="text-xs text-slate-500 text-center py-2">
                      ... and {userMessages.length - 5} more messages
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Connections */}
            <div>
              <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Link2 size={14} />
                Connections
              </h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 bg-blue-500/10 rounded-lg border border-blue-500/20 text-center">
                  <div className="text-2xl font-bold text-blue-400 mb-1">{replyEdges.length}</div>
                  <span className="text-xs text-blue-300 uppercase tracking-wider">Replies</span>
                </div>
                <div className="p-4 bg-purple-500/10 rounded-lg border border-purple-500/20 text-center">
                  <div className="text-2xl font-bold text-purple-400 mb-1">{semanticEdges.length}</div>
                  <span className="text-xs text-purple-300 uppercase tracking-wider">Semantic</span>
                </div>
                <div className="p-4 bg-slate-700/30 rounded-lg border border-slate-600/30 text-center">
                  <div className="text-2xl font-bold text-slate-300 mb-1">{connectedEdges.length}</div>
                  <span className="text-xs text-slate-400 uppercase tracking-wider">Total</span>
                </div>
              </div>
            </div>

            {/* Semantic Connections */}
            {isMessage && semanticConnections.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Zap size={14} />
                  Semantic Links
                </h3>
                <div className="space-y-3 max-h-48 overflow-y-auto">
                  {semanticConnections.slice(0, 3).map(({ node: conn, strength }) => (
                    <div key={conn.id} className="p-3 bg-purple-500/10 rounded-lg border border-purple-500/20">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-purple-300">
                          @{conn.data.author_name}
                        </span>
                        <ModernBadge variant="info" size="sm">
                          {(strength * 100).toFixed(0)}% similar
                        </ModernBadge>
                      </div>
                      <p className="text-sm text-slate-300 line-clamp-2">{conn.data.content}</p>
                    </div>
                  ))}
                  {semanticConnections.length > 3 && (
                    <p className="text-xs text-slate-500 text-center py-2">
                      ... and {semanticConnections.length - 3} more connections
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </ModernCard>
      </div>
    </div>
  );
} 