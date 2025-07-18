import type { 
  ContextualMessage, 
  MessageEdge, 
  GraphData, 
  G6Node, 
  G6Edge 
} from '../types';
import { createLogger } from './logger';

const logger = createLogger('dataTransform.ts');

// Color schemes based on design specifications
const NODE_COLORS = {
  message: {
    contextual: '#E3F2FD', // Light blue for contextual messages
    selected: '#2196F3',   // Blue for selected
    hover: '#1976D2',      // Dark blue for hover
  },
  channel: {
    default: '#F3E5F5',    // Light purple for channel root
    selected: '#9C27B0',   // Purple for selected
    hover: '#7B1FA2',      // Dark purple for hover
  },
  author: [
    '#FFEBEE', '#FFF3E0', '#F1F8E9', '#E8F5E8', '#E3F2FD',
    '#F3E5F5', '#FFF8E1', '#FCE4EC', '#E1F5FE', '#F9FBE7'
  ]
};

const EDGE_COLORS = {
  reply: '#2196F3',      // Solid blue for reply connections
  semantic: '#9C27B0',   // Dashed purple for semantic links
};

// Helper function to get author color based on author name
function getAuthorColor(authorName: string | null): string {
  if (!authorName) return NODE_COLORS.message.contextual;
  
  // Simple hash function to consistently assign colors
  let hash = 0;
  for (let i = 0; i < authorName.length; i++) {
    hash = authorName.charCodeAt(i) + ((hash << 5) - hash);
  }
  return NODE_COLORS.author[Math.abs(hash) % NODE_COLORS.author.length];
}

// Helper function to truncate content for labels
function truncateContent(content: string, maxLength: number = 50): string {
  if (content.length <= maxLength) return content;
  return content.substring(0, maxLength - 3) + '...';
}

// Transform messages to G6 nodes
export function transformMessagesToNodes(messages: ContextualMessage[]): G6Node[] {
  logger.info('Transforming messages to G6 nodes', { count: messages.length });
  
  return messages.map((message) => {
    const nodeId = `message-${message.id.toString()}`;
    const authorColor = getAuthorColor(message.author_name);
    
    return {
      id: nodeId,
      type: 'message' as const,
      data: {
        label: truncateContent(message.content),
        content: message.content,
        author_name: message.author_name || undefined,
        written_at: message.written_at,
        is_contextual: true,
      },
      style: {
        fill: authorColor,
        stroke: '#CCCCCC',
        radius: 8,
      },
    };
  });
}

// Transform edges to G6 edges
export function transformEdgesToG6Edges(edges: MessageEdge[]): G6Edge[] {
  logger.info('Transforming edges to G6 edges', { count: edges.length });
  
  return edges.map((edge) => {
    const edgeType = edge.edge_type === 'reply_to' ? 'reply' : 'semantic';
    const isReply = edge.edge_type === 'reply_to';
    
    return {
      id: edge.id,
      source: `message-${edge.source_message_id.toString()}`,
      target: `message-${edge.target_message_id.toString()}`,
      type: edgeType,
      data: {
        strength: edge.strength,
        edge_type: edge.edge_type,
      },
      style: {
        stroke: isReply ? EDGE_COLORS.reply : EDGE_COLORS.semantic,
        lineWidth: Math.max(1, edge.strength * 3), // Scale line width by strength
        lineDash: isReply ? [] : [5, 5], // Dashed for semantic links
      },
    };
  });
}

// Create channel root node
export function createChannelNode(channelName: string, channelId: bigint): G6Node {
  return {
    id: `channel-${channelId.toString()}`,
    type: 'channel' as const,
    data: {
      label: channelName,
      is_contextual: false,
    },
    style: {
      fill: NODE_COLORS.channel.default,
      stroke: '#9C27B0',
      radius: 12,
    },
  };
}

// Main transformation function: database data to G6 graph data
export function transformToGraphData(
  messages: ContextualMessage[], 
  edges: MessageEdge[],
  channelName?: string,
  channelId?: bigint
): GraphData {
  logger.info('Starting graph data transformation', { 
    messageCount: messages.length, 
    edgeCount: edges.length 
  });
  
  try {
    // Transform messages to nodes
    const messageNodes = transformMessagesToNodes(messages);
    
    // Create channel root node if provided
    const nodes: G6Node[] = [...messageNodes];
    if (channelName && channelId) {
      const channelNode = createChannelNode(channelName, channelId);
      nodes.unshift(channelNode); // Add channel node at the beginning
    }
    
    // Transform edges
    const g6Edges = transformEdgesToG6Edges(edges);
    
    // Add edges from channel to root messages (messages without incoming reply edges)
    if (channelName && channelId) {
      const channelNodeId = `channel-${channelId.toString()}`;
      const messagesWithIncomingReplies = new Set(
        edges
          .filter(edge => edge.edge_type === 'reply_to')
          .map(edge => edge.target_message_id.toString())
      );
      
      const rootMessages = messages.filter(
        message => !messagesWithIncomingReplies.has(message.id.toString())
      );
      
      const channelEdges: G6Edge[] = rootMessages.map((message, index) => ({
        id: `channel-edge-${message.id.toString()}`,
        source: channelNodeId,
        target: `message-${message.id.toString()}`,
        type: 'reply' as const,
        data: {
          strength: 1.0,
          edge_type: 'reply_to' as const,
        },
        style: {
          stroke: EDGE_COLORS.reply,
          lineWidth: 2,
          lineDash: [],
        },
      }));
      
      g6Edges.push(...channelEdges);
    }
    
    const result: GraphData = {
      nodes,
      edges: g6Edges,
    };
    
    logger.info('Graph data transformation completed', { 
      nodeCount: result.nodes.length, 
      edgeCount: result.edges.length 
    });
    
    return result;
  } catch (error) {
    logger.error('Failed to transform graph data', error);
    throw new Error('Data transformation failed');
  }
}

// Filter graph data based on criteria
export function filterGraphData(
  graphData: GraphData,
  filters: {
    authors?: string[];
    timeRange?: { start?: Date; end?: Date };
    searchQuery?: string;
  }
): GraphData {
  logger.info('Filtering graph data', filters);
  
  let filteredNodes = graphData.nodes;
  
  // Filter by authors
  if (filters.authors && filters.authors.length > 0) {
    filteredNodes = filteredNodes.filter(node => {
      if (node.type === 'channel') return true; // Keep channel nodes
      return !node.data.author_name || filters.authors!.includes(node.data.author_name);
    });
  }
  
  // Filter by time range
  if (filters.timeRange) {
    filteredNodes = filteredNodes.filter(node => {
      if (node.type === 'channel') return true; // Keep channel nodes
      if (!node.data.written_at) return true;
      
      const messageTime = node.data.written_at;
      if (filters.timeRange!.start && messageTime < filters.timeRange!.start) {
        return false;
      }
      if (filters.timeRange!.end && messageTime > filters.timeRange!.end) {
        return false;
      }
      return true;
    });
  }
  
  // Filter by search query
  if (filters.searchQuery) {
    const query = filters.searchQuery.toLowerCase();
    filteredNodes = filteredNodes.filter(node => {
      if (node.type === 'channel') return true; // Keep channel nodes
      return !node.data.content || node.data.content.toLowerCase().includes(query);
    });
  }
  
  // Get IDs of filtered nodes
  const filteredNodeIds = new Set(filteredNodes.map(node => node.id));
  
  // Filter edges to only include those connecting filtered nodes
  const filteredEdges = graphData.edges.filter(edge => 
    filteredNodeIds.has(edge.source) && filteredNodeIds.has(edge.target)
  );
  
  logger.info('Graph data filtered', { 
    originalNodes: graphData.nodes.length,
    filteredNodes: filteredNodes.length,
    originalEdges: graphData.edges.length,
    filteredEdges: filteredEdges.length,
  });
  
  return {
    nodes: filteredNodes,
    edges: filteredEdges,
  };
}

// Calculate graph statistics
export function calculateGraphStats(graphData: GraphData) {
  const messageNodes = graphData.nodes.filter(node => node.type === 'message');
  const channelNodes = graphData.nodes.filter(node => node.type === 'channel');
  const replyEdges = graphData.edges.filter(edge => edge.type === 'reply');
  const semanticEdges = graphData.edges.filter(edge => edge.type === 'semantic');
  
  const authors = new Set(
    messageNodes
      .map(node => node.data.author_name)
      .filter(Boolean)
  );
  
  return {
    totalNodes: graphData.nodes.length,
    messageNodes: messageNodes.length,
    channelNodes: channelNodes.length,
    totalEdges: graphData.edges.length,
    replyEdges: replyEdges.length,
    semanticEdges: semanticEdges.length,
    uniqueAuthors: authors.size,
    averageStrength: graphData.edges.reduce((sum, edge) => sum + edge.data.strength, 0) / graphData.edges.length || 0,
  };
} 