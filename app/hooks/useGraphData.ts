'use client';

import { useEffect, useState } from 'react';
import { useGraphStore } from '@/app/stores/graphStore';
import { transformToGraphData } from '@/app/utils/dataTransform';
import type { Channel, ContextualMessage, MessageEdge, GraphData } from '@/app/types';
import { createLogger } from '@/app/utils/logger';

const logger = createLogger('useGraphData.ts');

interface UseGraphDataOptions {
  autoFetch?: boolean;
  semanticThreshold?: number;
  timeRange?: {
    start?: Date;
    end?: Date;
  };
  limit?: number;
}

interface UseGraphDataReturn {
  graphData: GraphData;
  isLoading: boolean;
  error: string | null;
  fetchGraphData: (channelId: string) => Promise<void>;
  refetch: () => Promise<void>;
}

export function useGraphData(options: UseGraphDataOptions = {}): UseGraphDataReturn {
  const {
    autoFetch = true,
    semanticThreshold = 0.5,
    timeRange,
    limit = 1000
  } = options;

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastChannelId, setLastChannelId] = useState<string | null>(null);

  const currentChannel = useGraphStore((state) => state.currentChannel);
  const graphData = useGraphStore((state) => state.graphData);
  const setGraphData = useGraphStore((state) => state.setGraphData);
  const setRawData = useGraphStore((state) => state.setRawData);

  const fetchGraphData = async (channelId: string) => {
    if (!channelId) {
      logger.warn('No channel ID provided for graph data fetch');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      logger.info('Fetching graph data for channel', { 
        channelId, 
        semanticThreshold, 
        timeRange, 
        limit 
      });

      // Build query parameters
      const queryParams = new URLSearchParams();
      if (semanticThreshold !== undefined) {
        queryParams.append('threshold', semanticThreshold.toString());
      }
      if (limit) {
        queryParams.append('limit', limit.toString());
      }
      if (timeRange?.start) {
        queryParams.append('start', timeRange.start.toISOString());
      }
      if (timeRange?.end) {
        queryParams.append('end', timeRange.end.toISOString());
      }

      const url = `/api/data/graph/${channelId}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      logger.info('Graph data fetched successfully', { 
        messageCount: data.messages.length,
        edgeCount: data.edges.length 
      });

      // Convert API response back to internal types
      const messages: ContextualMessage[] = data.messages.map((msg: {
        id: string;
        channel_id: string;
        author_id: string;
        written_at: string;
        content: string;
        author_name: string | null;
        embedding?: number[];
      }) => ({
        ...msg,
        id: BigInt(msg.id),
        channel_id: BigInt(msg.channel_id),
        author_id: BigInt(msg.author_id),
        written_at: new Date(msg.written_at),
      }));

      const edges: MessageEdge[] = data.edges.map((edge: {
        id: string;
        channel_id: string;
        source_message_id: string;
        target_message_id: string;
        edge_type: 'reply_to' | 'semantic_link';
        strength: number;
      }) => ({
        ...edge,
        channel_id: BigInt(edge.channel_id),
        source_message_id: BigInt(edge.source_message_id),
        target_message_id: BigInt(edge.target_message_id),
      }));

      // Store raw data
      setRawData(messages, edges);

      // Transform to G6 format
      const transformedData = transformToGraphData(
        messages, 
        edges, 
        currentChannel?.name, 
        currentChannel?.id
      );

      logger.info('Graph data transformed successfully', { 
        nodes: transformedData.nodes.length,
        edges: transformedData.edges.length 
      });

      // Update store
      setGraphData(transformedData);
      setLastChannelId(channelId);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch graph data';
      logger.error('Failed to fetch graph data', err);
      setError(errorMessage);
      
      // Clear graph data on error
      setGraphData({ nodes: [], edges: [] });
    } finally {
      setIsLoading(false);
    }
  };

  const refetch = async () => {
    if (currentChannel) {
      await fetchGraphData(currentChannel.id.toString());
    }
  };

  // Auto-fetch when channel changes
  useEffect(() => {
    if (autoFetch && currentChannel && currentChannel.id.toString() !== lastChannelId) {
      fetchGraphData(currentChannel.id.toString());
    }
  }, [currentChannel, autoFetch, lastChannelId, semanticThreshold, timeRange, limit]);

  // Clear data when no channel is selected
  useEffect(() => {
    if (!currentChannel) {
      setGraphData({ nodes: [], edges: [] });
      setLastChannelId(null);
      setError(null);
    }
  }, [currentChannel, setGraphData]);

  return {
    graphData,
    isLoading,
    error,
    fetchGraphData,
    refetch,
  };
}

// Additional hook for graph statistics
export function useGraphStats() {
  const graphData = useGraphStore((state) => state.graphData);
  const rawMessages = useGraphStore((state) => state.rawMessages);
  
  return {
    messageCount: rawMessages.length,
    edgeCount: graphData.edges.length,
    nodeCount: graphData.nodes.length,
  };
}

// Hook for available authors in current data
export function useAvailableAuthors() {
  const rawMessages = useGraphStore((state) => state.rawMessages);
  
  const authors = rawMessages
    .map(msg => msg.author_name)
    .filter((name): name is string => name !== null)
    .filter((name, index, array) => array.indexOf(name) === index)
    .sort();
    
  return authors;
} 