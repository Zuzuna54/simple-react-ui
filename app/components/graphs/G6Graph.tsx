'use client';

import React, { useEffect, useRef, useState, useMemo } from 'react';
import { Graph } from '@antv/g6';
import type { GraphData } from '@/app/types';
import { createLogger } from '@/app/utils/logger';

const logger = createLogger('SimpleG6Graph.tsx');

interface SimpleG6GraphProps {
  data: GraphData;
  width?: number;
  height?: number;
  className?: string;
}

export function SimpleG6Graph({ 
  data, 
  width = 800, 
  height = 600, 
  className = '' 
}: SimpleG6GraphProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const graphRef = useRef<Graph | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const initializingRef = useRef(false);
  const lastDataHashRef = useRef<string>('');

  // Create a stable hash of the data to detect actual changes
  const dataHash = useMemo(() => {
    const hash = `${data.nodes.length}-${data.edges.length}-${data.nodes.map(n => n.id).sort().join(',')}-${data.edges.map(e => e.id).sort().join(',')}`;
    logger.info('Data hash computed', { hash, nodes: data.nodes.length, edges: data.edges.length });
    return hash;
  }, [data.nodes, data.edges]);

  useEffect(() => {
    // Only initialize if container exists, not already initializing, and data actually changed
    if (!containerRef.current || initializingRef.current) {
      logger.info('Skipping initialization', { 
        containerExists: !!containerRef.current, 
        initializing: initializingRef.current 
      });
      return;
    }

    // Check if data actually changed
    if (lastDataHashRef.current === dataHash) {
      logger.info('Data unchanged, skipping initialization', { dataHash });
      return;
    }

    logger.info('Starting graph initialization', { 
      dataHash, 
      lastHash: lastDataHashRef.current,
      nodes: data.nodes.length, 
      edges: data.edges.length 
    });

    const initializeGraph = async () => {
      try {
        initializingRef.current = true;
        lastDataHashRef.current = dataHash;

        // Destroy existing graph
        if (graphRef.current) {
          try {
            logger.info('Destroying existing graph');
            graphRef.current.destroy();
          } catch (e) {
            logger.warn('Error destroying previous graph', e);
          }
          graphRef.current = null;
        }

        // Basic data transformation for G6 v5
        const graphData = {
          nodes: data.nodes.map(node => ({
            id: node.id,
            data: {
              label: node.data.content ? 
                (node.data.content.length > 30 ? node.data.content.substring(0, 30) + '...' : node.data.content) : 
                node.id,
              nodeType: node.id.includes('channel') ? 'channel' : 'message',
              isContextual: node.data.is_contextual
            }
          })),
          edges: data.edges.map(edge => ({
            id: edge.id,
            source: edge.source,
            target: edge.target,
            data: {
              edgeType: edge.data?.edge_type || 'reply_to'
            }
          }))
        };

        logger.info('Creating G6 graph', { 
          transformedNodes: graphData.nodes.length, 
          transformedEdges: graphData.edges.length 
        });

        // Create G6 v5 graph with proper configuration
        const graph = new Graph({
          container: containerRef.current!,
          width,
          height,
          background: 'transparent',
          data: graphData,
          layout: {
            type: 'dagre',
            rankdir: 'TB',
            nodesep: 20,
            ranksep: 30,
          },
          node: {
            style: {
              size: 20,
              fill: '#10b981',
              stroke: '#1f2937',
              strokeWidth: 2,
              labelText: (d: { data?: Record<string, unknown>; id: string }) => (d.data?.label as string) || d.id,
              labelFill: '#f9fafb',
              labelFontSize: 10,
              labelFontWeight: 'bold',
              labelMaxWidth: 80,
              labelWordWrap: true,
            }
          },
          edge: {
            style: {
              stroke: '#3b82f6',
              strokeWidth: 2,
              strokeOpacity: 0.8,
            }
          },
          behaviors: ['zoom-canvas', 'drag-canvas'],
          plugins: [],
        });

        // Wait for graph to be ready
        logger.info('Rendering G6 graph');
        await graph.render();
        
        // Auto fit view
        setTimeout(() => {
          try {
            graph.fitView();
            setIsLoading(false);
            logger.info('Graph initialization completed successfully');
          } catch (e) {
            logger.warn('Error fitting view', e);
            setIsLoading(false);
          }
        }, 100);

        graphRef.current = graph;
        setError(null);

      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to initialize graph';
        logger.error('Failed to initialize simple G6 graph', err);
        setError(errorMessage);
        setIsLoading(false);
      } finally {
        initializingRef.current = false;
      }
    };

    initializeGraph();

    // Cleanup function
    return () => {
      logger.info('Cleanup function called');
      if (graphRef.current) {
        try {
          graphRef.current.destroy();
        } catch (e) {
          logger.warn('Error in cleanup', e);
        }
        graphRef.current = null;
      }
      initializingRef.current = false;
    };
  }, [dataHash, width, height]); // Use dataHash instead of data object

  if (error) {
    return (
      <div className={`relative ${className}`} style={{ width, height }}>
        <div className="h-full flex items-center justify-center">
          <div className="text-center">
            <div className="text-red-500 mb-2">Graph Error</div>
            <div className="text-sm text-gray-500">{error}</div>
            <button 
              onClick={() => {
                setError(null);
                setIsLoading(true);
              }}
              className="mt-2 px-3 py-1 text-xs bg-gray-600 hover:bg-gray-500 text-white rounded"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`} style={{ width, height }}>
      {/* Loading overlay */}
      {isLoading && (
        <div 
          className="absolute inset-0 flex items-center justify-center z-10"
          style={{ backgroundColor: 'rgba(10, 10, 11, 0.8)' }}
        >
          <div className="text-center">
            <div 
              className="w-8 h-8 border-4 border-t-transparent rounded-full animate-spin mx-auto mb-2"
              style={{ 
                borderColor: 'var(--border-secondary)',
                borderTopColor: 'var(--primary-500)'
              }}
            ></div>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
              Rendering graph...
            </p>
          </div>
        </div>
      )}

      {/* Graph container */}
      <div 
        ref={containerRef} 
        className="w-full h-full rounded-lg"
        style={{ backgroundColor: 'var(--bg-secondary)' }}
      />

      {/* Graph info */}
      <div 
        className="absolute bottom-2 left-2 px-2 py-1 rounded text-xs"
        style={{ 
          backgroundColor: 'var(--bg-elevated)',
          borderColor: 'var(--border-primary)',
          border: '1px solid'
        }}
      >
        <span style={{ color: 'var(--text-muted)' }}>
          {data.nodes.length} nodes • {data.edges.length} edges
        </span>
      </div>

      {/* Graph legend */}
      <div 
        className="absolute top-2 right-2 px-2 py-1 rounded text-xs"
        style={{ 
          backgroundColor: 'var(--bg-elevated)',
          borderColor: 'var(--border-primary)',
          border: '1px solid'
        }}
      >
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-purple-500"></div>
            <span style={{ color: 'var(--text-muted)' }}>Channel</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span style={{ color: 'var(--text-muted)' }}>Contextual</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-amber-500"></div>
            <span style={{ color: 'var(--text-muted)' }}>Noise</span>
          </div>
        </div>
      </div>
    </div>
  );
} 