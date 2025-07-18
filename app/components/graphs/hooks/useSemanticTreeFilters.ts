import { useState, useCallback, useMemo } from 'react';
import type { GraphData } from '@/app/types';
import type { FilterState } from '../types';

export function useSemanticTreeFilters(data: GraphData) {
  const [filters, setFilters] = useState<FilterState>({
    showContextual: true,
    showNoise: true,
    showReplyEdges: true,
    showSemanticEdges: true,
    semanticThreshold: 0.5,
    authorFilter: [],
    contentSearch: ''
  });

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

  // Filter update handler
  const updateFilters = useCallback((newFilters: Partial<FilterState>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  return {
    filters,
    filteredData,
    updateFilters
  };
} 