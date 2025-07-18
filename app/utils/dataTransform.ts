import type { ContextualMessage, NoiseMessage, MessageEdge, GraphData } from '@/app/types';
import { createLogger } from './logger';

const logger = createLogger('dataTransform.ts');

/**
 * Transform raw messages and edges into GraphData format
 */
export function transformToGraphData(
  messages: (ContextualMessage | NoiseMessage)[],
  edges: MessageEdge[],
  channelName?: string,
  channelId?: string
): GraphData {
  logger.info('Transforming raw data to GraphData format', {
    messageCount: messages.length,
    edgeCount: edges.length,
    channelName,
    channelId
  });

  // Transform messages to nodes
  const nodes = messages.map(message => {
    // Check if message is contextual or noise
    const isContextual = !('noise_reason' in message);
    const noiseReason = 'noise_reason' in message ? message.noise_reason : undefined;

    return {
      id: message.id.toString(), // Convert bigint to string
      type: 'message' as const,
      data: {
        label: message.content.substring(0, 50) + (message.content.length > 50 ? '...' : ''), // Required label property
        content: message.content,
        author_name: message.author_name || undefined, // Convert null to undefined
        written_at: message.written_at,
        is_contextual: isContextual,
        noise_reason: noiseReason,
        // Additional metadata for visualization
        channel_id: channelId,
        channel_name: channelName,
        message_type: isContextual ? 'contextual' : 'noise'
      }
    };
  });

  // Transform edges
  const transformedEdges = edges.map(edge => ({
    id: `${edge.source_message_id}-${edge.target_message_id}`,
    source: edge.source_message_id.toString(),
    target: edge.target_message_id.toString(),
    type: (edge.edge_type === 'reply_to' ? 'reply' : 'semantic') as 'reply' | 'semantic', // Proper type assertion
    data: {
      edge_type: edge.edge_type as 'reply_to' | 'semantic_link',
      strength: edge.strength || 1.0,
      // Additional metadata
      relationship_type: edge.edge_type === 'reply_to' ? 'reply' : 'semantic',
      confidence: edge.strength || 1.0
    }
  }));

  const result: GraphData = {
    nodes,
    edges: transformedEdges
  };

  logger.info('Data transformation completed', {
    outputNodes: result.nodes.length,
    outputEdges: result.edges.length,
    semanticEdges: transformedEdges.filter(e => e.data.edge_type === 'semantic_link').length,
    replyEdges: transformedEdges.filter(e => e.data.edge_type === 'reply_to').length
  });

  return result;
} 