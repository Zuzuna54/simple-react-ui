'use client';

import React from 'react';
import { User, MessageCircle, Hash, Clock, FileText, AlertTriangle } from 'lucide-react';
import { ModernCard, ModernBadge } from '@/app/components/ui/modern-controls';
import type { GraphData } from '@/app/types';

interface SemanticTreeSelectedNodeProps {
  selectedNode: string | null;
  data: GraphData;
}

export function SemanticTreeSelectedNode({ selectedNode, data }: SemanticTreeSelectedNodeProps) {
  if (!selectedNode) return null;

  const node = data.nodes.find(n => n.id === selectedNode);
  if (!node) return null;

  const isUser = selectedNode.startsWith('user-');
  const isChannel = node.id.includes('channel');

  return (
    <div className="absolute bottom-6 right-6 z-10 w-80">
      <ModernCard className="p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-purple-500/20 rounded-lg">
            {isUser ? (
              <User size={16} className="text-purple-400" />
            ) : (
              <MessageCircle size={16} className="text-purple-400" />
            )}
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white tracking-tight">
              Selected Node
            </h3>
            <p className="text-xs text-slate-400">
              {isUser ? 'User Profile' : 'Message Details'}
            </p>
          </div>
        </div>
        
        <div className="space-y-4">
          {/* Type and Status */}
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 uppercase tracking-wider">Type</span>
            <ModernBadge 
              variant={
                isChannel ? 'info' : 
                isUser ? 'info' : 
                (node.data.is_contextual ? 'success' : 'warning')
              }
              size="sm"
            >
              {isChannel ? 'Channel' : (isUser ? 'User' : (node.data.is_contextual ? 'Contextual' : 'Noise'))}
            </ModernBadge>
          </div>
          
          {/* Author */}
          <div className="flex items-center gap-2">
            <User size={14} className="text-slate-500" />
            <div className="flex-1">
              <span className="text-xs text-slate-500 block uppercase tracking-wider">Author</span>
              <span className="text-sm text-slate-200 font-medium">
                {node.data.author_name || 'System'}
              </span>
            </div>
          </div>
          
          {/* Timestamp */}
          {node.data.written_at && (
            <div className="flex items-center gap-2">
              <Clock size={14} className="text-slate-500" />
              <div className="flex-1">
                <span className="text-xs text-slate-500 block uppercase tracking-wider">Timestamp</span>
                <span className="text-sm text-slate-200">
                  {new Date(node.data.written_at).toLocaleString()}
                </span>
              </div>
            </div>
          )}
          
          {/* Content Preview */}
          {node.data.content && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <FileText size={14} className="text-slate-500" />
                <span className="text-xs text-slate-500 uppercase tracking-wider">Content</span>
              </div>
              <div className="p-3 bg-slate-800/30 rounded-lg border border-slate-700/30">
                <p className="text-sm text-slate-200 line-clamp-3 leading-relaxed">
                  {node.data.content}
                </p>
              </div>
            </div>
          )}
          
          {/* Noise Reason */}
          {node.data.noise_reason && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle size={14} className="text-amber-500" />
                <span className="text-xs text-amber-400 uppercase tracking-wider">Noise Reason</span>
              </div>
              <div className="p-3 bg-amber-500/10 rounded-lg border border-amber-500/20">
                <p className="text-sm text-amber-300 line-clamp-2">
                  {node.data.noise_reason}
                </p>
              </div>
            </div>
          )}
          
          {/* Node ID */}
          <div className="pt-3 border-t border-slate-700/50">
            <div className="flex items-center gap-2 mb-2">
              <Hash size={14} className="text-slate-500" />
              <span className="text-xs text-slate-500 uppercase tracking-wider">Node ID</span>
            </div>
            <code className="text-xs text-slate-400 font-mono bg-slate-800/50 px-2 py-1 rounded break-all">
              {selectedNode}
            </code>
          </div>
        </div>
      </ModernCard>
    </div>
  );
} 