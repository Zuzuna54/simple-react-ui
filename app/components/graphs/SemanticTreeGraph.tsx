'use client';

import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { Graph } from '@antv/g6';
import type { GraphData } from '@/app/types';
import { createLogger } from '@/app/utils/logger';

const logger = createLogger('SemanticTreeGraph.tsx');

interface SemanticTreeGraphProps {
  data: GraphData;
  width?: number;
  height?: number;
  className?: string;
}

interface FilterState {
  showContextual: boolean;
  showNoise: boolean;
  showReplyEdges: boolean;
  showSemanticEdges: boolean;
  semanticThreshold: number;
  authorFilter: string[];
  contentSearch: string;
}

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
  const [layoutType, setLayoutType] = useState<'tree' | 'force' | 'radial'>('tree');
  const [filters, setFilters] = useState<FilterState>({
    showContextual: true,
    showNoise: true,
    showReplyEdges: true,
    showSemanticEdges: true,
    semanticThreshold: 0.5,
    authorFilter: [],
    contentSearch: ''
  });

  const initializingRef = useRef(false);
  const lastDataHashRef = useRef<string>('');

  // Create a stable hash of the data to detect actual changes (exclude layout)
  const dataHash = useMemo(() => {
    const hash = `${data.nodes.length}-${data.edges.length}-${JSON.stringify(filters)}-${layoutType}`;
    return hash;
  }, [data.nodes, data.edges, filters, layoutType]);

  // Filter and transform data based on current filters
  const filteredData = useMemo(() => {
    const filteredNodes = data.nodes.filter(node => {
      // Filter by message type
      if (!filters.showContextual && node.data.is_contextual) return false;
      if (!filters.showNoise && !node.data.is_contextual) return false;
      
      // Filter by content search
      if (filters.contentSearch && !node.data.content?.toLowerCase().includes(filters.contentSearch.toLowerCase())) {
        return false;
      }
      
      return true;
    });

    const filteredNodeIds = new Set(filteredNodes.map(n => n.id));
    
    const filteredEdges = data.edges.filter(edge => {
      // Only include edges between visible nodes
      if (!filteredNodeIds.has(edge.source) || !filteredNodeIds.has(edge.target)) return false;
      
      // Filter by edge type
      if (!filters.showReplyEdges && edge.data.edge_type === 'reply_to') return false;
      if (!filters.showSemanticEdges && edge.data.edge_type === 'semantic_link') return false;
      
      // Filter semantic edges by strength threshold
      if (edge.data.edge_type === 'semantic_link' && edge.data.strength < filters.semanticThreshold) {
        return false;
      }
      
      return true;
    });

    return { nodes: filteredNodes, edges: filteredEdges };
  }, [data, filters]);

  // Transform data for G6 with enhanced styling following design document
  const transformDataForG6 = useCallback((filteredData: GraphData) => {
    const nodes = filteredData.nodes.map(node => {
      const isChannel = node.id.includes('channel');
      const isContextual = node.data.is_contextual;
      const contentLength = node.data.content?.length || 0;
      
      // Implement design document specifications
      const nodeSize = isChannel ? 50 : Math.min(Math.max(25, contentLength / 4), 40);
      const nodeColor = isChannel ? '#7c3aed' : (isContextual ? '#4CAF50' : '#FFC107');
      const borderColor = isChannel ? '#5b21b7' : (isContextual ? '#2E7D32' : '#F57F17');
      
      return {
        id: node.id,
        data: {
          label: node.data.content ? 
            (node.data.content.length > 35 ? node.data.content.substring(0, 35) + '...' : node.data.content) : 
            (isChannel ? 'Channel Root' : node.id),
          fullContent: node.data.content || '',
          author: node.data.author_name || 'System',
          timestamp: node.data.written_at ? new Date(node.data.written_at).toLocaleString() : '',
          nodeType: isChannel ? 'channel' : 'message',
          messageType: isContextual ? 'contextual' : 'noise',
          nodeSize,
          nodeColor,
          borderColor,
          importance: isChannel ? 3 : (isContextual ? 2 : 1)
        }
      };
    });

    const edges = filteredData.edges.map(edge => ({
      id: edge.id,
      source: edge.source,
      target: edge.target,
      data: {
        edgeType: edge.data.edge_type,
        strength: edge.data.strength,
        strokeColor: edge.data.edge_type === 'semantic_link' ? '#9C27B0' : '#2196F3',
        strokeWidth: edge.data.edge_type === 'semantic_link' ? 
          Math.max(2, edge.data.strength * 4) : 3,
        opacity: edge.data.edge_type === 'semantic_link' ? 
          Math.max(0.4, edge.data.strength) : 0.9,
        isDashed: edge.data.edge_type === 'semantic_link'
      }
    }));

    return { nodes, edges };
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
          data: transformedData,
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
  }, [dataHash, width, height, layoutType, filteredData, transformDataForG6]);

  // Filter update handlers
  const updateFilters = useCallback((newFilters: Partial<FilterState>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

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
          className="absolute inset-0 flex items-center justify-center z-20"
          style={{ backgroundColor: 'rgba(10, 10, 11, 0.95)' }}
        >
          <div className="text-center">
            <div 
              className="w-16 h-16 border-4 border-t-transparent rounded-full animate-spin mx-auto mb-4"
              style={{ 
                borderColor: 'var(--border-secondary)',
                borderTopColor: 'var(--primary-500)'
              }}
            ></div>
            <p className="text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
              Building Semantic Tree
            </p>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
              Analyzing {filteredData.nodes.length} messages and {filteredData.edges.length} relationships...
            </p>
          </div>
        </div>
      )}

      {/* Enhanced Control Panel */}
      <div 
        className="absolute top-4 left-4 z-10 p-4 rounded-xl shadow-xl backdrop-blur-sm"
        style={{ 
          backgroundColor: 'rgba(16, 16, 20, 0.95)',
          borderColor: 'var(--border-primary)',
          border: '1px solid',
          maxHeight: height - 100,
          overflowY: 'auto'
        }}
      >
        <div className="space-y-4 min-w-52">
          {/* Header */}
          <div>
            <h2 className="text-lg font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
              Semantic Tree
            </h2>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
              Interactive conversation analysis
            </p>
          </div>

          {/* Layout Controls */}
          <div>
            <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
              Layout Style
            </h3>
            <div className="space-y-2">
              {[
                { key: 'tree', label: '🌳 Hierarchical Tree', desc: 'Top-down structure' },
                { key: 'force', label: '🕸️ Force Network', desc: 'Natural clustering' },
                { key: 'radial', label: '⭕ Radial Layout', desc: 'Circular arrangement' }
              ].map(({ key, label, desc }) => (
                <label key={key} className="flex items-start gap-3 p-2 rounded cursor-pointer hover:bg-gray-800/50">
                  <input
                    type="radio"
                    name="layout"
                    checked={layoutType === key}
                    
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    onChange={() => setLayoutType(key as any)}
                    className="accent-purple-500 mt-1"
                  />
                  <div>
                    <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>{label}</div>
                    <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{desc}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Content Filters */}
          <div>
            <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
              Message Types
            </h3>
            <div className="space-y-2">
              <label className="flex items-center gap-3 p-2 rounded cursor-pointer hover:bg-gray-800/50">
                <input
                  type="checkbox"
                  checked={filters.showContextual}
                  onChange={(e) => updateFilters({ showContextual: e.target.checked })}
                  className="accent-green-500"
                />
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Contextual Messages</span>
              </label>
              
              <label className="flex items-center gap-3 p-2 rounded cursor-pointer hover:bg-gray-800/50">
                <input
                  type="checkbox"
                  checked={filters.showNoise}
                  onChange={(e) => updateFilters({ showNoise: e.target.checked })}
                  className="accent-amber-500"
                />
                <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Noise Messages</span>
              </label>
            </div>
          </div>

          {/* Relationship Filters */}
          <div>
            <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
              Relationships
            </h3>
            <div className="space-y-2">
              <label className="flex items-center gap-3 p-2 rounded cursor-pointer hover:bg-gray-800/50">
                <input
                  type="checkbox"
                  checked={filters.showReplyEdges}
                  onChange={(e) => updateFilters({ showReplyEdges: e.target.checked })}
                  className="accent-blue-500"
                />
                <div className="w-6 h-0.5 bg-blue-500"></div>
                <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Reply Chains</span>
              </label>
              
              <label className="flex items-center gap-3 p-2 rounded cursor-pointer hover:bg-gray-800/50">
                <input
                  type="checkbox"
                  checked={filters.showSemanticEdges}
                  onChange={(e) => updateFilters({ showSemanticEdges: e.target.checked })}
                  className="accent-purple-500"
                />
                <div className="w-6 h-0.5 bg-purple-500 border-dashed" style={{ borderTop: '2px dashed' }}></div>
                <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Semantic Links</span>
              </label>
            </div>
          </div>

          {/* Semantic Threshold */}
          {filters.showSemanticEdges && (
            <div>
              <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
                Semantic Similarity
              </h3>
              <div className="space-y-2">
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={filters.semanticThreshold}
                  onChange={(e) => updateFilters({ semanticThreshold: parseFloat(e.target.value) })}
                  className="w-full accent-purple-500"
                />
                <div className="flex justify-between text-xs" style={{ color: 'var(--text-muted)' }}>
                  <span>Weak</span>
                  <span className="font-semibold">{(filters.semanticThreshold * 100).toFixed(0)}%</span>
                  <span>Strong</span>
                </div>
              </div>
            </div>
          )}

          {/* View Controls */}
          <div className="pt-2 border-t" style={{ borderColor: 'var(--border-secondary)' }}>
            <button
              onClick={resetView}
              className="w-full px-4 py-2 text-sm bg-purple-600 hover:bg-purple-500 text-white rounded-lg transition-colors"
            >
              🎯 Fit to View
            </button>
          </div>
        </div>
      </div>

      {/* Graph container */}
      <div 
        ref={containerRef} 
        className="w-full h-full rounded-lg"
        style={{ backgroundColor: 'var(--bg-secondary)' }}
      />

      {/* Enhanced Legend */}
      <div 
        className="absolute top-4 right-4 p-4 rounded-xl shadow-xl backdrop-blur-sm z-10"
        style={{ 
          backgroundColor: 'rgba(16, 16, 20, 0.95)',
          borderColor: 'var(--border-primary)',
          border: '1px solid'
        }}
      >
        <h3 className="text-sm font-bold mb-3" style={{ color: 'var(--text-primary)' }}>
          Legend
        </h3>
        <div className="space-y-3">
          <div>
            <h4 className="text-xs font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>Node Types</h4>
            <div className="space-y-1">
              <div className="flex items-center gap-3 text-xs">
                <div className="w-5 h-5 rounded bg-purple-500 border-2 border-purple-700"></div>
                <span style={{ color: 'var(--text-secondary)' }}>Channel Root</span>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <div className="w-4 h-4 rounded bg-green-500 border-2 border-green-700"></div>
                <span style={{ color: 'var(--text-secondary)' }}>Contextual Message</span>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <div className="w-4 h-4 rounded bg-amber-500 border-2 border-amber-700"></div>
                <span style={{ color: 'var(--text-secondary)' }}>Noise Message</span>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="text-xs font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>Edge Types</h4>
            <div className="space-y-1">
              <div className="flex items-center gap-3 text-xs">
                <div className="w-8 h-0.5 bg-blue-500"></div>
                <span style={{ color: 'var(--text-secondary)' }}>Reply Chain</span>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <div className="w-8 h-0.5 bg-purple-500 border-dashed" style={{ borderTop: '2px dashed' }}></div>
                <span style={{ color: 'var(--text-secondary)' }}>Semantic Link</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Stats */}
      <div 
        className="absolute bottom-4 left-4 px-4 py-3 rounded-xl shadow-xl backdrop-blur-sm z-10"
        style={{ 
          backgroundColor: 'rgba(16, 16, 20, 0.95)',
          borderColor: 'var(--border-primary)',
          border: '1px solid'
        }}
      >
        <div className="text-sm space-y-1">
          <div className="font-semibold" style={{ color: 'var(--text-primary)' }}>
            📊 Graph Statistics
          </div>
          <div style={{ color: 'var(--text-secondary)' }}>
            <strong>{filteredData.nodes.length}</strong> nodes • <strong>{filteredData.edges.length}</strong> edges
          </div>
          <div className="text-xs space-x-4" style={{ color: 'var(--text-muted)' }}>
            <span>🟢 {filteredData.nodes.filter(n => n.data.is_contextual).length} contextual</span>
            <span>🟡 {filteredData.nodes.filter(n => !n.data.is_contextual).length} noise</span>
          </div>
          <div className="text-xs space-x-4" style={{ color: 'var(--text-muted)' }}>
            <span>🔗 {filteredData.edges.filter(e => e.data.edge_type === 'reply_to').length} replies</span>
            <span>🔮 {filteredData.edges.filter(e => e.data.edge_type === 'semantic_link').length} semantic</span>
          </div>
        </div>
      </div>

      {/* Enhanced Selected Node Info */}
      {selectedNode && (
        <div 
          className="absolute bottom-4 right-4 p-4 rounded-xl shadow-xl backdrop-blur-sm z-10 max-w-sm"
          style={{ 
            backgroundColor: 'rgba(16, 16, 20, 0.95)',
            borderColor: 'var(--primary-500)',
            border: '2px solid'
          }}
        >
          <h3 className="text-sm font-bold mb-3 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
            🎯 Selected Message
          </h3>
          {(() => {
            const node = data.nodes.find(n => n.id === selectedNode);
            if (!node) return null;
            
            const isChannel = node.id.includes('channel');
            
            return (
              <div className="text-xs space-y-2">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${isChannel ? 'bg-purple-500' : (node.data.is_contextual ? 'bg-green-500' : 'bg-amber-500')}`}></div>
                  <span className="font-semibold" style={{ color: 'var(--text-secondary)' }}>
                    {isChannel ? 'Channel' : (node.data.is_contextual ? 'Contextual' : 'Noise')} Message
                  </span>
                </div>
                
                <div style={{ color: 'var(--text-secondary)' }}>
                  <strong>Author:</strong> {node.data.author_name || 'System'}
                </div>
                
                {node.data.written_at && (
                  <div style={{ color: 'var(--text-secondary)' }}>
                    <strong>Time:</strong> {new Date(node.data.written_at).toLocaleString()}
                  </div>
                )}
                
                {node.data.content && (
                  <div style={{ color: 'var(--text-muted)' }}>
                    <strong>Content:</strong> 
                    <div className="mt-1 p-2 rounded bg-gray-800/50 text-xs leading-relaxed">
                      {node.data.content.substring(0, 150)}
                      {node.data.content.length > 150 ? '...' : ''}
                    </div>
                  </div>
                )}
                
                {node.data.noise_reason && (
                  <div style={{ color: 'var(--text-muted)' }}>
                    <strong>Noise Reason:</strong> {node.data.noise_reason}
                  </div>
                )}
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
} 