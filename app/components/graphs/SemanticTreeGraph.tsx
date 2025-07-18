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
import { SemanticTreeNodeModal } from './components/SemanticTreeNodeModal';
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
  const [showModal, setShowModal] = useState(false);
  const [layoutType, setLayoutType] = useState<LayoutType>('tree');

  const { 
    filters, 
    filteredData, 
    updateFilters, 
    availableAuthors, 
    resetAllFilters 
  } = useSemanticTreeFilters(data);

  const initializingRef = useRef(false);
  const lastDataHashRef = useRef<string>('');

  // Create a stable hash of the data to detect actual changes
  const dataHash = useMemo(() => {
    const hash = `${data.nodes.length}-${data.edges.length}-${JSON.stringify(filters)}-${layoutType}`;
    return hash;
  }, [data.nodes, data.edges, filters, layoutType]);

  // Configure physics parameters based on layout type
  const getPhysicsConfig = useCallback((type: LayoutType) => {
    switch (type) {
      case 'force':
        return {
          type: 'd3-force',
          link: {
            distance: 150,
            strength: 0.6
          },
          charge: {
            strength: -300,
            distanceMax: 400
          },
          center: {
            x: width / 2,
            y: height / 2,
            strength: 0.1
          },
          collide: {
            radius: 40,
            strength: 0.8
          },
          forceX: {
            strength: 0.05,
            x: width / 2
          },
          forceY: {
            strength: 0.05,
            y: height / 2
          },
          alpha: 0.3,
          alphaDecay: 0.028,
          alphaMin: 0.001,
          velocityDecay: 0.4
        };
      case 'radial':
        return {
          type: 'radial',
          center: [width / 2, height / 2],
          radius: Math.min(width, height) / 3,
          nodeSize: 30,
          preventOverlap: true,
          sortBy: 'importance'
        };
      default: // tree
        return {
          type: 'dagre',
          rankdir: 'TB',
          nodesep: 60,
          ranksep: 100,
          preventOverlap: true,
          nodeSize: 50
        };
    }
  }, [width, height]);

  // Configure behaviors based on layout type
  const getBehaviors = useCallback((type: LayoutType) => {
    if (type === 'force') {
      // Add physics-based dragging for force layout
      return [
        'zoom-canvas',
        'drag-canvas',
        'hover-activate',
        'drag-element-force'
      ];
    } else {
      // Add regular dragging for other layouts
      return [
        'zoom-canvas',
        'drag-canvas', 
        'hover-activate',
        'drag-element'
      ];
    }
  }, []);

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

        const transformedData = transformDataForG6(filteredData, filters);
        
        logger.info('Creating enhanced semantic tree with G6', { 
          transformedNodes: transformedData.nodes.length, 
          transformedEdges: transformedData.edges.length,
          semanticEdges: transformedData.edges.filter(e => e.data.edgeType === 'semantic').length
        });

        // Enhanced G6 configuration with physics and animations
        const graph = new Graph({
          container: containerRef.current!,
          width,
          height,
          background: 'transparent',
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          data: transformedData as any,
          layout: getPhysicsConfig(layoutType),
          node: {
            style: {
              // Use design-compliant shapes: circles for users, rectangles for messages
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              size: (d: any) => {
                // Handle different node shapes
                if (d.data?.shape === 'circle') {
                  // User nodes: circular with single dimension
                  return d.data?.width || 80;
                } else {
                  // Message nodes: rectangular with width and height
                  return [d.data?.width || 120, d.data?.height || 60];
                }
              },
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              fill: (d: any) => d.data?.nodeColor || '#4CAF50',
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              stroke: (d: any) => d.data?.borderColor || '#2E7D32',
              strokeWidth: 2,
              // Enhanced label styling for rich content
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              labelText: (d: any) => {
                if (d.data?.nodeType === 'user') {
                  // User nodes: show handle and message count
                  const handle = d.data?.userHandle || d.data?.author || 'User';
                  const messageCount = d.data?.messageCount || 0;
                  return `${handle}\n(${messageCount} messages)`;
                } else if (d.data?.nodeType === 'message') {
                  // Message nodes: show author and content preview
                  return `@${d.data?.author || 'User'}\n${(d.data?.fullContent || '').substring(0, 50)}${(d.data?.fullContent || '').length > 50 ? '...' : ''}`;
                }
                return d.data?.label || d.id;
              },
              labelFill: '#f9fafb',
              labelFontSize: 10,
              labelFontWeight: 'normal',
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              labelMaxWidth: (d: any) => {
                if (d.data?.shape === 'circle') {
                  // User nodes: label width based on circle diameter
                  return (d.data?.width || 80) - 10;
                } else {
                  // Message nodes: label width based on rectangle width
                  return (d.data?.width || 120) - 20;
                }
              },
              labelWordWrap: true,
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              labelWordWrapWidth: (d: any) => {
                if (d.data?.shape === 'circle') {
                  return (d.data?.width || 80) - 10;
                } else {
                  return (d.data?.width || 120) - 20;
                }
              },
              radius: 8,
              // Animation properties
              opacity: 1,
              shadowColor: 'rgba(0, 0, 0, 0.1)',
              shadowBlur: 4,
              shadowOffsetX: 2,
              shadowOffsetY: 2
            },
            state: {
              hover: {
                fill: '#ffffff',
                stroke: '#8b5cf6',
                strokeWidth: 3,
                shadowColor: 'rgba(139, 92, 246, 0.3)',
                shadowBlur: 10,
                transform: 'scale(1.05)'
              },
              selected: {
                fill: '#8b5cf6',
                stroke: '#ffffff',
                strokeWidth: 4,
                shadowColor: 'rgba(139, 92, 246, 0.5)',
                shadowBlur: 15,
                transform: 'scale(1.1)'
              }
            }
          },
          edge: {
            style: {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              stroke: (d: any) => d.data?.strokeColor || '#2196F3',
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              strokeWidth: (d: any) => d.data?.strokeWidth || 2,
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              strokeOpacity: (d: any) => d.data?.opacity || 0.8,
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              lineDash: (d: any) => d.data?.isDashed ? [5, 5] : undefined,
              // Enhanced curve support for semantic links
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              curveOffset: (d: any) => d.data?.isCurved ? 20 : 0,
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              endArrow: (d: any) => d.data?.isDashed ? false : true,
              // Enhanced edge labels
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              labelText: (d: any) => d.data?.label || '',
              labelFill: '#f1f5f9',
              labelFontSize: 9,
              labelFontWeight: 'normal',
              labelBackgroundFill: 'rgba(15, 23, 42, 0.8)',
              labelBackgroundPadding: [2, 4],
              labelBackgroundRadius: 4,
              labelBackgroundStroke: 'rgba(148, 163, 184, 0.3)',
              labelBackgroundStrokeWidth: 1,
              // Position labels in the middle of edges
              labelPosition: 'middle'
            },
            state: {
              hover: {
                strokeWidth: 4,
                strokeOpacity: 1,
                shadowColor: 'rgba(33, 150, 243, 0.3)',
                shadowBlur: 8,
                labelFontSize: 10,
                labelBackgroundFill: 'rgba(15, 23, 42, 0.95)'
              }
            }
          },
          behaviors: getBehaviors(layoutType),
          // Add tooltip plugin for hover metadata display
          plugins: [
            {
              type: 'tooltip',
              key: 'tooltip',
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              getContent: (evt: any, items: any) => {
                if (!items || items.length === 0) return '';
                
                const item = items[0];
                // Fix: Use proper G6 v5 API to access node data
                // Debug logging to understand the data structure
                logger.info('Tooltip item structure', { 
                  item: typeof item,
                  hasData: !!item.data,
                  hasModel: !!item.model,
                  keys: Object.keys(item || {})
                });
                
                // Try multiple access patterns for G6 v5 compatibility
                const data = item.data || item.model?.data || item._cfg?.model?.data || item;
                
                if (!data) {
                  logger.warn('No data found in tooltip item', { item });
                  return '';
                }
                
                logger.info('Tooltip data accessed', { 
                  nodeType: data.nodeType,
                  author: data.author,
                  hasFullContent: !!data.fullContent
                });
                
                // Create tooltip content based on node type
                if (data.nodeType === 'user') {
                  return `
                    <div style="
                      background: rgba(15, 23, 42, 0.95);
                      border: 1px solid rgba(139, 92, 246, 0.4);
                      border-radius: 8px;
                      padding: 12px;
                      color: white;
                      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                      font-size: 12px;
                      line-height: 1.4;
                      max-width: 250px;
                      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
                    ">
                      <div style="font-weight: bold; color: #a5b4fc; margin-bottom: 8px;">
                        👤 User: ${data.userHandle || data.author}
                      </div>
                      <div style="margin-bottom: 4px;">
                        📊 Messages: <span style="color: #60a5fa;">${data.messageCount || 0}</span>
                      </div>
                      <div style="margin-bottom: 4px;">
                        🔗 Connections: <span style="color: #34d399;">${data.replyCount + data.semanticConnections}</span>
                      </div>
                      <div style="margin-bottom: 4px;">
                        ⭐ Importance: <span style="color: #fbbf24;">${data.importance}/3</span>
                      </div>
                    </div>
                  `;
                } else if (data.nodeType === 'message') {
                  const contentPreview = data.fullContent && data.fullContent.length > 80 
                    ? data.fullContent.substring(0, 80) + '...' 
                    : data.fullContent || 'No content';
                  
                  return `
                    <div style="
                      background: rgba(15, 23, 42, 0.95);
                      border: 1px solid rgba(139, 92, 246, 0.4);
                      border-radius: 8px;
                      padding: 12px;
                      color: white;
                      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                      font-size: 12px;
                      line-height: 1.4;
                      max-width: 280px;
                      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
                    ">
                      <div style="font-weight: bold; color: #a5b4fc; margin-bottom: 8px;">
                        💬 ${data.messageType === 'contextual' ? 'Contextual' : 'Noise'} Message
                      </div>
                      <div style="margin-bottom: 6px;">
                        👤 <span style="color: #60a5fa;">@${data.author}</span>
                      </div>
                      <div style="margin-bottom: 6px; font-size: 11px; color: #94a3b8;">
                        🕒 ${data.timestamp}
                      </div>
                      <div style="margin-bottom: 8px; padding: 6px; background: rgba(30, 41, 59, 0.6); border-radius: 4px; font-size: 11px; color: #e2e8f0;">
                        ${contentPreview}
                      </div>
                      <div style="display: flex; justify-content: space-between; font-size: 11px;">
                        <span>🔗 Replies: <span style="color: #60a5fa;">${data.replyCount}</span></span>
                        <span>🕸️ Semantic: <span style="color: #c084fc;">${data.semanticConnections}</span></span>
                      </div>
                    </div>
                  `;
                }
                
                return '';
              },
              style: {
                position: 'absolute',
                zIndex: 1000
              }
            }
          ],
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          animation: true as any, // Simplified animation config for G6 v5 compatibility
          // Auto-fit configuration
          autoFit: 'view'
        });

        // Enhanced event handling with animations and modal integration
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        graph.on('node:click', (evt: any) => {
          const nodeId = evt.itemId || evt.item?.id;
          
          // Clear previous selection
          if (selectedNode && selectedNode !== nodeId) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (graph as any).setItemState?.(selectedNode, 'selected', false);
          }
          
          // Set new selection
          if (nodeId) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (graph as any).setItemState?.(nodeId, 'selected', true);
            setSelectedNode(nodeId);
            setShowModal(true); // Open modal on node click
            logger.info('Node selected in semantic tree', { nodeId });
          }
        });

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        graph.on('node:mouseenter', (evt: any) => {
          const nodeId = evt.itemId || evt.item?.id;
          if (nodeId) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (graph as any).setItemState?.(nodeId, 'hover', true);
          }
        });

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        graph.on('node:mouseleave', (evt: any) => {
          const nodeId = evt.itemId || evt.item?.id;
          if (nodeId) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (graph as any).setItemState?.(nodeId, 'hover', false);
          }
        });

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        graph.on('edge:mouseenter', (evt: any) => {
          const edgeId = evt.itemId || evt.item?.id;
          if (edgeId) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (graph as any).setItemState?.(edgeId, 'hover', true);
          }
        });

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        graph.on('edge:mouseleave', (evt: any) => {
          const edgeId = evt.itemId || evt.item?.id;
          if (edgeId) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (graph as any).setItemState?.(edgeId, 'hover', false);
          }
        });

        graph.on('canvas:click', () => {
          if (selectedNode) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (graph as any).setItemState?.(selectedNode, 'selected', false);
            setSelectedNode(null);
          }
        });

        // Render with enhanced timing and animations
        await graph.render();
        
        // Apply initial animation and fit view
        setTimeout(() => {
          try {
            graph.fitView();
            setIsLoading(false);
            logger.info('Enhanced semantic tree graph initialization completed successfully');
          } catch (e) {
            logger.warn('Error fitting view', e);
            setIsLoading(false);
          }
        }, 400);

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
  }, [dataHash, width, height, layoutType, filteredData, getPhysicsConfig, getBehaviors]);

  const resetView = useCallback(() => {
    if (graphRef.current) {
      graphRef.current.fitView();
    }
  }, []);

  // Add a restart physics simulation function for force layout
  const restartPhysics = useCallback(() => {
    if (graphRef.current && layoutType === 'force') {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (graphRef.current as any).getLayoutInstance()?.restart();
    }
  }, [layoutType]);

  // Modal close handler
  const closeModal = useCallback(() => {
    setShowModal(false);
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

      {/* Enhanced Control Panel */}
      <SemanticTreeControlPanel
        height={height}
        layoutType={layoutType}
        setLayoutType={setLayoutType}
        filters={filters}
        updateFilters={updateFilters}
        onResetView={resetView}
        onRestartPhysics={restartPhysics}
        availableAuthors={availableAuthors}
        onResetAllFilters={resetAllFilters}
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

      {/* Selected Node Info (legacy - keeping for compatibility) */}
      <SemanticTreeSelectedNode selectedNode={selectedNode} data={data} />

      {/* Enhanced Node Modal */}
      {showModal && (
        <SemanticTreeNodeModal 
          selectedNode={selectedNode} 
          data={data} 
          onClose={closeModal}
        />
      )}
    </div>
  );
} 