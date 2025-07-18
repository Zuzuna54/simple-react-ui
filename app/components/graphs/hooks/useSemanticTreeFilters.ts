import { useState, useCallback, useMemo } from 'react';
import type { GraphData } from '@/app/types';
import type { FilterState } from '../types';
import { createLogger } from '@/app/utils/logger';

const logger = createLogger('useSemanticTreeFilters.ts');

export function useSemanticTreeFilters(data: GraphData) {
  const [filters, setFilters] = useState<FilterState>({
    showContextual: true,
    showNoise: true,
    showReplyEdges: true,
    showSemanticEdges: true,
    showUserMessageEdges: true, // New: show user-to-message connections
    semanticThreshold: 0.5,
    authorFilter: [],
    contentSearch: '',
    dateRange: {
      start: null,
      end: null
    }
  });

  // Get unique authors for filter dropdown
  const availableAuthors = useMemo(() => {
    const authors = new Set<string>();
    data.nodes.forEach(node => {
      if (node.data.author_name) {
        authors.add(node.data.author_name);
      }
    });
    return Array.from(authors).sort();
  }, [data.nodes]);

  // Filter and transform data based on current filters
  const filteredData = useMemo(() => {
    logger.info('Starting data filtering', { 
      totalNodes: data.nodes.length, 
      totalEdges: data.edges.length,
      semanticEdgesInRaw: data.edges.filter(e => e.data.edge_type === 'semantic_link').length,
      filters 
    });

    const filteredNodes = data.nodes.filter(node => {
      // Skip legacy channel nodes (if any exist)
      if (node.type === 'channel') return false;
      
      // Handle message nodes
      if (node.type === 'message') {
        // Filter by message type
        if (!filters.showContextual && node.data.is_contextual) return false;
        if (!filters.showNoise && !node.data.is_contextual) return false;
        
        // Filter by author
        if (filters.authorFilter.length > 0 && node.data.author_name) {
          if (!filters.authorFilter.includes(node.data.author_name)) return false;
        }
        
        // Filter by content search (case-insensitive, partial match)
        if (filters.contentSearch && node.data.content) {
          const searchTerm = filters.contentSearch.toLowerCase();
          const content = node.data.content.toLowerCase();
          const author = (node.data.author_name || '').toLowerCase();
          
          // Search in content or author name
          if (!content.includes(searchTerm) && !author.includes(searchTerm)) {
            return false;
          }
        }
        
        // Filter by date range
        if (filters.dateRange.start || filters.dateRange.end) {
          if (node.data.written_at) {
            const nodeDate = new Date(node.data.written_at);
            
            if (filters.dateRange.start) {
              const startDate = new Date(filters.dateRange.start);
              if (nodeDate < startDate) return false;
            }
            
            if (filters.dateRange.end) {
              const endDate = new Date(filters.dateRange.end);
              // Set end date to end of day
              endDate.setHours(23, 59, 59, 999);
              if (nodeDate > endDate) return false;
            }
          }
        }
        
        return true;
      }
      
      // Handle user nodes (these will be created by hierarchical processor)
      // User nodes are included if:
      // 1. They match author filter (if applied)
      // 2. They match content search (if applied)
      // 3. They have at least one message that passes the filters
      
      return true; // User nodes will be handled by the hierarchical processor
    });

    const filteredNodeIds = new Set(filteredNodes.map(n => n.id));
    
    // Enhanced edge filtering with debug logging
    const initialSemanticEdges = data.edges.filter(e => e.data.edge_type === 'semantic_link');
    logger.info('Semantic edges before filtering', { count: initialSemanticEdges.length });
    
    const filteredEdges = data.edges.filter(edge => {
      // Only include edges between visible nodes
      if (!filteredNodeIds.has(edge.source) || !filteredNodeIds.has(edge.target)) {
        if (edge.data.edge_type === 'semantic_link') {
          logger.warn('Semantic edge filtered out due to invisible nodes', { 
            edgeId: edge.id, 
            source: edge.source, 
            target: edge.target,
            sourceVisible: filteredNodeIds.has(edge.source),
            targetVisible: filteredNodeIds.has(edge.target)
          });
        }
        return false;
      }
      
      // Filter by edge type
      if (!filters.showReplyEdges && edge.data.edge_type === 'reply_to') return false;
      if (!filters.showSemanticEdges && edge.data.edge_type === 'semantic_link') {
        logger.info('Semantic edge filtered out by showSemanticEdges flag', { edgeId: edge.id });
        return false;
      }
      
      // Filter semantic edges by strength threshold
      if (edge.data.edge_type === 'semantic_link' && edge.data.strength < filters.semanticThreshold) {
        logger.info('Semantic edge filtered out by threshold', { 
          edgeId: edge.id, 
          strength: edge.data.strength, 
          threshold: filters.semanticThreshold 
        });
        return false;
      }
      
      return true;
    });

    const finalSemanticEdges = filteredEdges.filter(e => e.data.edge_type === 'semantic_link');
    logger.info('Filtering complete', { 
      filteredNodes: filteredNodes.length,
      filteredEdges: filteredEdges.length,
      semanticEdgesAfter: finalSemanticEdges.length,
      replyEdges: filteredEdges.filter(e => e.data.edge_type === 'reply_to').length
    });

    return { nodes: filteredNodes, edges: filteredEdges };
  }, [data, filters]);

  // Filter update handler
  const updateFilters = useCallback((newFilters: Partial<FilterState>) => {
    logger.info('Updating filters', { newFilters });
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  // Helper functions for common filter operations
  const clearContentSearch = useCallback(() => {
    updateFilters({ contentSearch: '' });
  }, [updateFilters]);

  const clearDateRange = useCallback(() => {
    updateFilters({ dateRange: { start: null, end: null } });
  }, [updateFilters]);

  const clearAuthorFilter = useCallback(() => {
    updateFilters({ authorFilter: [] });
  }, [updateFilters]);

  const resetAllFilters = useCallback(() => {
    logger.info('Resetting all filters');
    setFilters({
      showContextual: true,
      showNoise: true,
      showReplyEdges: true,
      showSemanticEdges: true,
      showUserMessageEdges: true,
      semanticThreshold: 0.5,
      authorFilter: [],
      contentSearch: '',
      dateRange: { start: null, end: null }
    });
  }, []);

  return {
    filters,
    filteredData,
    updateFilters,
    availableAuthors,
    // Helper functions
    clearContentSearch,
    clearDateRange,
    clearAuthorFilter,
    resetAllFilters
  };
} 