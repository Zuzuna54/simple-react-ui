'use client';

import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { Graph } from '@antv/g6';
import { createLogger } from '@/app/utils/logger';
import { useSemanticTreeFilters } from './hooks/useSemanticTreeFilters';
import { transformDataForG6 } from './utils/graphDataTransformer';
import { SemanticTreeControlPanel } from './components/SemanticTreeControlPanel';
import { SemanticTreeLegend } from './components/SemanticTreeLegend';
import { SemanticTreeStats } from './components/SemanticTreeStats';
import { SemanticTreeSelectedNode } from './components/SemanticTreeSelectedNode';
import type { SemanticTreeGraphProps, LayoutType } from './types';

const logger = createLogger('SemanticTreeGraph.tsx');

export function SemanticTreeGraph({ 
  data, 
  width = 1200, 
  height = 700, 
  className = '' 
}: SemanticTreeGraphProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const graphRef = useRef<Graph | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [layoutType, setLayoutType] = useState<LayoutType>('tree');

  const { filters, filteredData, updateFilters } = useSemanticTreeFilters(data);

  const initializingRef = useRef(false);
  const lastDataHashRef = useRef<string>('');

  // Create a stable hash of the data to detect actual changes
  const dataHash = useMemo(() => {
    const hash = `${data.nodes.length}-${data.edges.length}-${JSON.stringify(filters)}-${layoutType}`;
    return hash;
  }, [data.nodes, data.edges, filters, layoutType]);

  // Initialize or update graph with proper G6 v5 configuration
  useEffect(() => {
    if (!containerRef.current || initializingRef.current) return;

    if (lastDataHashRef.current === dataHash && graphRef.current) {
      logger.info('Data unchanged, skipping initialization', { dataHash });
      return;
    }

    logger.info('Starting enhanced semantic tree graph initialization', { 
      dataHash, 
      nodes: filteredData.nodes.length, 
      edges: filteredData.edges.length,
      layout: layoutType
    });

    const initializeGraph = async () => {
      try {
        initializingRef.current = true;
        lastDataHashRef.current = dataHash;

        // Ensure complete cleanup of existing graph and DOM
        if (graphRef.current) {
          logger.info('Destroying existing graph');
          try {
            graphRef.current.destroy();
          } catch (e) {
            logger.warn('Error during graph destruction', e);
          }
          graphRef.current = null;
        }

        // Clear the container DOM to prevent overlaps
        if (containerRef.current) {
          containerRef.current.innerHTML = '';
        }

        // Wait a tick to ensure DOM is cleaned
        await new Promise(resolve => setTimeout(resolve, 50));

        const transformedData = transformDataForG6(filteredData);
        
        logger.info('Creating enhanced semantic tree with G6', { 
          transformedNodes: transformedData.nodes.length, 
          transformedEdges: transformedData.edges.length 
        });

        // Enhanced G6 configuration following design document
        const graph = new Graph({
          container: containerRef.current!,
          width,
          height,
          background: 'transparent',
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          data: transformedData as any,
          layout: {
            type: layoutType === 'tree' ? 'dagre' : layoutType,
            rankdir: layoutType === 'tree' ? 'TB' : undefined,
            nodesep: 40,
            ranksep: 60,
            preventOverlap: true,
            nodeSize: 35,
            linkDistance: layoutType === 'force' ? 120 : undefined,
            center: layoutType === 'radial' ? [width / 2, height / 2] : undefined
          },
          node: {
            style: {
              size: 25,
              fill: '#4CAF50',
              stroke: '#2E7D32',
              strokeWidth: 3,
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              labelText: (d: any) => (d.data?.label as string) || d.id,
              labelFill: '#f9fafb',
              labelFontSize: 11,
              labelFontWeight: 'bold',
              labelMaxWidth: 140,
              labelWordWrap: true,
              radius: 8
            }
          },
          edge: {
            style: {
              stroke: '#2196F3',
              strokeWidth: 2,
              strokeOpacity: 0.8
            }
          },
          behaviors: ['zoom-canvas', 'drag-canvas'],
        });

        // Simple event handling to prevent TypeScript errors
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        graph.on('node:click', (evt: any) => {
          const nodeId = evt.itemId || evt.item?.id;
          setSelectedNode(nodeId || null);
          logger.info('Node selected in semantic tree', { nodeId });
        });

        graph.on('canvas:click', () => {
          setSelectedNode(null);
        });

        // Render with enhanced timing
        await graph.render();
        
        setTimeout(() => {
          try {
            graph.fitView();
            setIsLoading(false);
            logger.info('Enhanced semantic tree graph initialization completed successfully');
          } catch (e) {
            logger.warn('Error fitting view', e);
            setIsLoading(false);
          }
        }, 300);

        graphRef.current = graph;
        setError(null);

      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to initialize semantic tree graph';
        logger.error('Failed to initialize enhanced semantic tree graph', err);
        setError(errorMessage);
        setIsLoading(false);
      } finally {
        initializingRef.current = false;
      }
    };

    initializeGraph();

    return () => {
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
  }, [dataHash, width, height, layoutType, filteredData]);

  const resetView = useCallback(() => {
    if (graphRef.current) {
      graphRef.current.fitView();
    }
  }, []);

  if (error) {
    return (
      <div className={`relative ${className}`} style={{ width, height }}>
        <div className="h-full flex items-center justify-center">
          <div className="text-center">
            <div className="text-red-500 mb-2">Semantic Tree Graph Error</div>
            <div className="text-sm text-gray-500 mb-4">{error}</div>
            <button 
              onClick={() => {
                setError(null);
                setIsLoading(true);
              }}
              className="px-4 py-2 text-sm bg-gray-600 hover:bg-gray-500 text-white rounded"
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
      {/* Enhanced Loading overlay */}
      {isLoading && (
        <div 
          className="absolute inset-0 flex items-center justify-center z-20 backdrop-blur-sm"
          style={{ backgroundColor: 'rgba(15, 23, 42, 0.95)' }}
        >
          <div className="text-center p-8 rounded-2xl border" style={{ 
            backgroundColor: 'rgba(30, 41, 59, 0.95)',
            borderColor: 'rgba(148, 163, 184, 0.2)'
          }}>
            <div className="relative mb-6">
              <div 
                className="w-16 h-16 border-4 border-slate-600 border-t-purple-500 rounded-full animate-spin mx-auto"
              ></div>
              <div className="absolute inset-0 w-16 h-16 border-2 border-purple-500/20 rounded-full mx-auto animate-pulse"></div>
            </div>
            <h3 className="text-xl font-bold text-white mb-2 tracking-tight">
              Building Semantic Tree
            </h3>
            <p className="text-sm text-slate-400 font-medium">
              Analyzing {filteredData.nodes.length} messages and {filteredData.edges.length} relationships...
            </p>
            <div className="mt-4 flex items-center justify-center gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        </div>
      )}

      {/* Control Panel */}
      <SemanticTreeControlPanel
        height={height}
        layoutType={layoutType}
        setLayoutType={setLayoutType}
        filters={filters}
        updateFilters={updateFilters}
        onResetView={resetView}
      />

      {/* Graph container */}
      <div 
        ref={containerRef} 
        className="w-full h-full rounded-lg"
        style={{ backgroundColor: 'var(--bg-secondary)' }}
      />

      {/* Legend */}
      <SemanticTreeLegend />

      {/* Stats */}
      <SemanticTreeStats filteredData={filteredData} />

      {/* Selected Node Info */}
      <SemanticTreeSelectedNode selectedNode={selectedNode} data={data} />
    </div>
  );
} 