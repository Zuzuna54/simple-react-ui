'use client';

import React, { useState, useCallback } from 'react';
import { clsx } from 'clsx';
import { SimpleG6Graph } from './graphs/G6Graph';
import { LoadingState, NoDataState } from './panels/MainPanel';
import { useGraphDataFetcher } from '@/app/hooks/useGraphStore';
import type { Channel } from '@/app/types';
import { createLogger } from '@/app/utils/logger';

const logger = createLogger('GraphContainer.tsx');

interface GraphContainerProps {
  channel: Channel;
  className?: string;
}

export function GraphContainer({ channel, className }: GraphContainerProps) {
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  
  // Fetch graph data for the selected channel
  const { graphData, isLoading, error, refetch } = useGraphDataFetcher({
    autoFetch: true,
    semanticThreshold: 0.5,
    limit: 1000,
  });

  const handleNodeClick = useCallback((nodeId: string, nodeData: unknown) => {
    logger.info('Node clicked in graph', { nodeId, nodeData });
    setSelectedNodeId(selectedNodeId === nodeId ? null : nodeId);
  }, [selectedNodeId]);

  const handleNodeHover = useCallback((nodeId: string | null, nodeData: unknown) => {
    setHoveredNodeId(nodeId);
  }, []);

  const handleRetry = useCallback(() => {
    logger.info('Retrying graph data fetch');
    refetch();
  }, [refetch]);

  // Show loading state while fetching graph data
  if (isLoading) {
    return (
      <div className={clsx('h-full', className)}>
        <LoadingState message={`Loading conversation data for ${channel.name}...`} />
      </div>
    );
  }

  // Show error state if graph data fetch failed
  if (error) {
    return (
      <div className={clsx('h-full', className)}>
        <div className="h-full flex items-center justify-center">
          <div className="text-center max-w-lg">
            <div className="relative mb-8">
              <div className="w-24 h-24 mx-auto bg-gradient-to-br from-red-500 to-red-700 rounded-2xl flex items-center justify-center shadow-xl">
                <svg 
                  className="w-12 h-12 text-white" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={1.5} 
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                  />
                </svg>
              </div>
            </div>
            
            <h3 className="text-headline mb-4" style={{ color: 'var(--text-primary)' }}>
              Failed to Load Graph Data
            </h3>
            <p className="text-body leading-relaxed mb-8" style={{ color: 'var(--text-secondary)' }}>
              {error}
            </p>
            
            <button
              onClick={handleRetry}
              className="modern-button modern-button-primary"
              style={{ padding: 'var(--space-lg) var(--space-2xl)' }}
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Show no data state if no messages found
  if (graphData.nodes.length === 0) {
    return (
      <div className={clsx('h-full', className)}>
        <NoDataState channelName={channel.name} />
      </div>
    );
  }

  // Calculate container dimensions (full height minus some padding)
  const containerHeight = 'calc(100vh - 140px)';
  const containerWidth = '100%';

  return (
    <div className={clsx('h-full flex flex-col', className)}>
      {/* Graph Header */}
      <div 
        className="flex items-center justify-between border-b"
        style={{ 
          padding: 'var(--space-xl)', 
          borderColor: 'var(--border-primary)',
          backgroundColor: 'var(--bg-secondary)'
        }}
      >
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-700 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
                {channel.name}
              </h2>
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                Semantic Tree Visualization
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Graph Stats */}
          <div className="flex items-center gap-6 text-sm" style={{ color: 'var(--text-muted)' }}>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>{graphData.nodes.filter(n => n.type === 'message').length} Messages</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span>{graphData.edges.filter(e => e.data?.edge_type === 'reply_to').length} Replies</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
              <span>{graphData.edges.filter(e => e.data?.edge_type === 'semantic_link').length} Semantic Links</span>
            </div>
          </div>

          {/* Refresh Button */}
          <button
            onClick={handleRetry}
            className="modern-button modern-button-secondary"
            title="Refresh graph data"
            style={{ padding: 'var(--space-sm)' }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
      </div>

      {/* Graph Visualization */}
      <div className="flex-1 relative overflow-hidden">
        <SimpleG6Graph
          data={graphData}
          width={1200} // Fixed width for now
          height={700} // Fixed height for now  
          className="w-full h-full"
        />
        
        {/* Selection Info Panel */}
        {selectedNodeId && (
          <div 
            className="absolute top-4 left-4 max-w-sm border rounded-xl shadow-lg"
            style={{ 
              backgroundColor: 'var(--bg-elevated)',
              borderColor: 'var(--border-primary)',
              padding: 'var(--space-lg)'
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
                Node Details
              </h4>
              <button
                onClick={() => setSelectedNodeId(null)}
                className="text-xs p-1 rounded"
                style={{ color: 'var(--text-muted)' }}
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-2 text-xs">
              <div>
                <span style={{ color: 'var(--text-muted)' }}>ID:</span>{' '}
                <span style={{ color: 'var(--text-primary)' }}>{selectedNodeId}</span>
              </div>
              {/* Add more node details here */}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 