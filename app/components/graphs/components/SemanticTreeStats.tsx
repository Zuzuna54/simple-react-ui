'use client';

import React from 'react';
import { BarChart3, Users, MessageSquare, Zap, Link, AlertTriangle } from 'lucide-react';
import { ModernCard, ModernBadge } from '@/app/components/ui/modern-controls';
import type { GraphData } from '@/app/types';

interface SemanticTreeStatsProps {
  filteredData: GraphData;
}

export function SemanticTreeStats({ filteredData }: SemanticTreeStatsProps) {
  // Calculate stats based on the hierarchical data structure
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

  const stats = [
    {
      icon: Users,
      label: 'Users',
      value: userCount,
      color: 'indigo' as const,
      description: 'Active participants'
    },
    {
      icon: MessageSquare,
      label: 'Messages',
      value: messageNodes.length,
      color: 'blue' as const,
      description: 'Total messages'
    },
    {
      icon: Zap,
      label: 'Contextual',
      value: contextualCount,
      color: 'green' as const,
      description: 'Relevant content'
    },
    {
      icon: AlertTriangle,
      label: 'Noise',
      value: noiseCount,
      color: 'amber' as const,
      description: 'Off-topic content'
    },
    {
      icon: Link,
      label: 'Replies',
      value: replyCount,
      color: 'blue' as const,
      description: 'Response chains'
    },
    {
      icon: BarChart3,
      label: 'Semantic',
      value: semanticCount,
      color: 'purple' as const,
      description: 'Similar content links'
    }
  ];

  return (
    <div className="absolute bottom-6 left-6 z-10 w-72">
      <ModernCard className="p-5">
        <div className="flex items-center gap-2 mb-6">
          <div className="p-2 bg-slate-700/50 rounded-lg">
            <BarChart3 size={16} className="text-slate-400" />
          </div>
          <h3 className="text-sm font-semibold text-white tracking-tight">
            Statistics
          </h3>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          {stats.map((stat) => {
            const Icon = stat.icon;
            const colorClasses = {
              indigo: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
              blue: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
              green: 'bg-green-500/20 text-green-400 border-green-500/30',
              amber: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
              purple: 'bg-purple-500/20 text-purple-400 border-purple-500/30'
            };
            
            return (
              <div 
                key={stat.label}
                className="group p-3 rounded-lg border border-slate-700/50 bg-slate-800/20 transition-all duration-200 hover:bg-slate-800/40 hover:border-slate-600/50"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className={`p-1.5 rounded-md border ${colorClasses[stat.color]}`}>
                    <Icon size={12} />
                  </div>
                  <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                    {stat.label}
                  </span>
                </div>
                <div className="flex items-end justify-between">
                  <span className="text-lg font-bold text-white">
                    {stat.value}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  {stat.description}
                </p>
              </div>
            );
          })}
        </div>
        
        {/* Summary */}
        <div className="mt-4 pt-4 border-t border-slate-700/50">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500">
              Total Activity
            </span>
            <ModernBadge variant="default" size="sm">
              {messageNodes.length + replyCount + semanticCount} items
            </ModernBadge>
          </div>
        </div>
      </ModernCard>
    </div>
  );
} 