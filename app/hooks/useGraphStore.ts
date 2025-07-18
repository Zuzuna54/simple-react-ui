// Re-export all hooks from the store for consistent access pattern
export {
  useGraphStore,
  useChannels,
  useCurrentChannel,
  useGraphData as useGraphDataStore,
  useRawData,
  useUIState,
  useFilters,
  useSelectedLayout,
  useSelectedNodes,
  useHoveredNode,
  useIsLoading,
  useError,
  useGraphActions,
} from '../stores/graphStore';

// Re-export graph data fetching hook from the data hook
export {
  useGraphData as useGraphDataFetcher,
} from './useGraphData';

// Additional derived hooks for common use cases
import { useMemo } from 'react';
import { useGraphStore } from '../stores/graphStore';
import type { ContextualMessage } from '../types';

// Get filtered messages based on current filters
export const useFilteredMessages = () => {
  const rawMessages = useGraphStore((state) => state.rawMessages);
  const filters = useGraphStore((state) => state.ui.filters);

  return useMemo(() => {
    return rawMessages.filter((message: ContextualMessage) => {
      // Filter by authors
      if (filters.authors.length > 0 && message.author_name) {
        if (!filters.authors.includes(message.author_name)) {
          return false;
        }
      }

      // Filter by time range
      if (filters.timeRange.start && message.written_at < filters.timeRange.start) {
        return false;
      }
      if (filters.timeRange.end && message.written_at > filters.timeRange.end) {
        return false;
      }

      // Filter by search query (simple content search)
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        if (!message.content.toLowerCase().includes(query)) {
          return false;
        }
      }

      return true;
    });
  }, [rawMessages, filters]);
};

// Get unique authors from messages
export const useAvailableAuthors = () => {
  const rawMessages = useGraphStore((state) => state.rawMessages);

  return useMemo(() => {
    const authorsSet = new Set<string>();
    rawMessages.forEach((message) => {
      if (message.author_name) {
        authorsSet.add(message.author_name);
      }
    });
    return Array.from(authorsSet).sort();
  }, [rawMessages]);
};

// Get time range of messages
export const useMessageTimeRange = () => {
  const rawMessages = useGraphStore((state) => state.rawMessages);

  return useMemo(() => {
    if (rawMessages.length === 0) {
      return { start: null, end: null };
    }

    const timestamps = rawMessages.map((msg) => msg.written_at.getTime());
    return {
      start: new Date(Math.min(...timestamps)),
      end: new Date(Math.max(...timestamps)),
    };
  }, [rawMessages]);
};

// Check if graph has data
export const useHasGraphData = () => {
  return useGraphStore((state) => 
    state.graphData.nodes.length > 0 || state.graphData.edges.length > 0
  );
};

// Get node count and edge count statistics
export const useGraphStats = () => {
  const graphData = useGraphStore((state) => state.graphData);
  const rawMessages = useGraphStore((state) => state.rawMessages);
  const rawEdges = useGraphStore((state) => state.rawEdges);

  return useMemo(() => ({
    nodeCount: graphData.nodes.length,
    edgeCount: graphData.edges.length,
    messageCount: rawMessages.length,
    replyEdges: rawEdges.filter(edge => edge.edge_type === 'reply_to').length,
    semanticEdges: rawEdges.filter(edge => edge.edge_type === 'semantic_link').length,
  }), [graphData.nodes.length, graphData.edges.length, rawMessages.length, rawEdges]);
}; 