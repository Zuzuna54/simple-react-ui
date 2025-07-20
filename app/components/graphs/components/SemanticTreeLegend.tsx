'use client';

import React from 'react';
import { User, MessageCircle, AlertTriangle, Minus, MoreHorizontal } from 'lucide-react';
import { ModernCard } from '@/app/components/ui/modern-controls';

export function SemanticTreeLegend() {
  return (
    <div className="absolute top-6 right-6 z-10 w-64">
      <ModernCard className="p-5">
        <div className="flex items-center gap-2 mb-6">
          <div className="p-2 bg-slate-700/50 rounded-lg">
            <MoreHorizontal size={16} className="text-slate-400" />
          </div>
          <h3 className="text-sm font-semibold text-white tracking-tight">
            Legend
          </h3>
        </div>
        
        <div className="space-y-6">
          {/* Nodes */}
          <div>
            <h4 className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-3">
              Node Types
            </h4>
            <div className="space-y-2">
              <div className="group flex items-center gap-3 p-2 rounded-lg transition-all duration-200 hover:bg-slate-800/30">
                <div className="flex items-center justify-center w-8 h-8 bg-indigo-500/20 rounded-lg border border-indigo-500/30">
                  <User size={14} className="text-indigo-400" />
                </div>
                <div>
                  <span className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors">
                    User
                  </span>
                  <p className="text-xs text-slate-500">
                    Conversation participants
                  </p>
                </div>
              </div>
              
              <div className="group flex items-center gap-3 p-2 rounded-lg transition-all duration-200 hover:bg-slate-800/30">
                <div className="flex items-center justify-center w-8 h-8 bg-green-500/20 rounded-lg border border-green-500/30">
                  <MessageCircle size={14} className="text-green-400" />
                </div>
                <div>
                  <span className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors">
                    Contextual
                  </span>
                  <p className="text-xs text-slate-500">
                    Relevant messages
                  </p>
                </div>
              </div>
              
              <div className="group flex items-center gap-3 p-2 rounded-lg transition-all duration-200 hover:bg-slate-800/30">
                <div className="flex items-center justify-center w-8 h-8 bg-amber-500/20 rounded-lg border border-amber-500/30">
                  <AlertTriangle size={14} className="text-amber-400" />
                </div>
                <div>
                  <span className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors">
                    Noise
                  </span>
                  <p className="text-xs text-slate-500">
                    Off-topic content
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Edges */}
          <div>
            <h4 className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-3">
              Relationships
            </h4>
            <div className="space-y-2">
              <div className="group flex items-center gap-3 p-2 rounded-lg transition-all duration-200 hover:bg-slate-800/30">
                <div className="w-8 h-0.5 bg-indigo-400 rounded-full" />
                <div>
                  <span className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors">
                    User-Message
                  </span>
                  <p className="text-xs text-slate-500">
                    Authorship links
                  </p>
                </div>
              </div>
              
              <div className="group flex items-center gap-3 p-2 rounded-lg transition-all duration-200 hover:bg-slate-800/30">
                <div className="w-8 h-0.5 bg-blue-400 rounded-full" />
                <div>
                  <span className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors">
                    Reply
                  </span>
                  <p className="text-xs text-slate-500">
                    Response chains
                  </p>
                </div>
              </div>
              
              <div className="group flex items-center gap-3 p-2 rounded-lg transition-all duration-200 hover:bg-slate-800/30">
                <div className="flex items-center gap-1">
                  <Minus size={8} className="text-purple-400" />
                  <Minus size={8} className="text-purple-400" />
                  <Minus size={8} className="text-purple-400" />
                </div>
                <div>
                  <span className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors">
                    Semantic
                  </span>
                  <p className="text-xs text-slate-500">
                    Similar content
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ModernCard>
    </div>
  );
} 