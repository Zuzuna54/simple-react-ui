import type { GraphData } from '@/app/types';
import type { 
  VisualizationNode, 
  VisualizationEdge, 
  ConversationThread, 
  HierarchicalData,
  FilterState
} from '../types';
import { createLogger } from '@/app/utils/logger';

const logger = createLogger('hierarchicalProcessor.ts');

export function processHierarchicalData(data: GraphData, filters?: Partial<FilterState>): HierarchicalData {
  logger.info('Starting hierarchical data processing', { 
    nodeCount: data.nodes.length, 
    edgeCount: data.edges.length,
    semanticEdges: data.edges.filter(e => e.data.edge_type === 'semantic_link').length
  });

  // Convert raw data to visualization format
  const nodes = convertToVisualizationNodes(data);
  const edges = convertToVisualizationEdges(data);
  
  logger.info('Converted to visualization format', { 
    visualNodes: nodes.length, 
    visualEdges: edges.length,
    semanticVisualizationEdges: edges.filter(e => e.type === 'semantic').length
  });
  
  // Create unique user nodes from message authors
  const users = createUserNodes(data);
  
  // Create user-to-message edges (apply filtering if provided)
  const userMessageEdges = createUserMessageEdges(data, users, filters);
  
  // Group messages into conversation threads with participant tracking
  const threads = buildConversationThreads(nodes, edges);
  
  // Separate noise nodes
  const noiseNodes = nodes.filter(node => 
    node.type === 'message' && node.data.messageType === 'noise'
  );
  
  // Filter user nodes based on whether they have visible messages
  const visibleMessageIds = new Set(nodes.map(n => n.id));
  const filteredUsers = users.filter(user => {
    if (!user.metadata.userMessageIds) return false;
    
    // Keep user if they have at least one visible message
    return user.metadata.userMessageIds.some(messageId => visibleMessageIds.has(messageId));
  });
  
  // Combine all edges, applying edge type filters
  const allEdges = [...edges];
  if (!filters || filters.showUserMessageEdges !== false) {
    allEdges.push(...userMessageEdges);
  }
  
  logger.info('Hierarchical processing complete', { 
    finalNodes: [...nodes, ...filteredUsers].length,
    finalEdges: allEdges.length,
    finalSemanticEdges: allEdges.filter(e => e.type === 'semantic').length,
    userNodes: filteredUsers.length,
    userMessageEdges: userMessageEdges.length
  });
  
  return {
    users: filteredUsers,
    threads,
    nodes: [...nodes, ...filteredUsers], // Combine message nodes and filtered user nodes
    edges: allEdges,
    noiseNodes,
    userMessageEdges
  };
}

function convertToVisualizationNodes(data: GraphData): VisualizationNode[] {
  return data.nodes
    .filter(node => node.type === 'message') // Only process message nodes, skip any legacy channel nodes
    .map(node => {
      const isContextual = node.data.is_contextual;
      
      // Calculate metadata for message nodes
      const replyCount = data.edges.filter(edge => 
        edge.source === node.id && edge.data.edge_type === 'reply_to'
      ).length;
      
      const semanticConnections = data.edges.filter(edge => 
        (edge.source === node.id || edge.target === node.id) && 
        edge.data.edge_type === 'semantic_link'
      ).length;
      
      const importance = isContextual ? 2 : 1;
      
      return {
        id: node.id,
        type: 'message' as const,
        data: {
          content: node.data.content || '',
          author: node.data.author_name || 'Unknown',
          timestamp: node.data.written_at ? new Date(node.data.written_at).getTime() : Date.now(),
          messageType: isContextual ? 'contextual' : 'noise',
          embedding: undefined // TODO: Add if available in future
        },
        position: { x: 0, y: 0 }, // Will be calculated by layout
        metadata: {
          replyCount,
          semanticConnections,
          importance
        }
      };
    });
}

function createUserNodes(data: GraphData): VisualizationNode[] {
  // Get unique authors from all messages
  const authorMap = new Map<string, {
    messageIds: string[];
    messageCount: number;
    firstMessageTime: number;
    lastMessageTime: number;
    contextualCount: number;
    noiseCount: number;
  }>();
  
  data.nodes
    .filter(node => node.type === 'message' && node.data.author_name)
    .forEach(node => {
      const author = node.data.author_name!;
      const messageTime = node.data.written_at ? new Date(node.data.written_at).getTime() : Date.now();
      const isContextual = node.data.is_contextual;
      
      if (!authorMap.has(author)) {
        authorMap.set(author, {
          messageIds: [],
          messageCount: 0,
          firstMessageTime: messageTime,
          lastMessageTime: messageTime,
          contextualCount: 0,
          noiseCount: 0
        });
      }
      
      const authorData = authorMap.get(author)!;
      authorData.messageIds.push(node.id);
      authorData.messageCount++;
      authorData.firstMessageTime = Math.min(authorData.firstMessageTime, messageTime);
      authorData.lastMessageTime = Math.max(authorData.lastMessageTime, messageTime);
      
      if (isContextual) {
        authorData.contextualCount++;
      } else {
        authorData.noiseCount++;
      }
    });
  
  // Create user nodes
  return Array.from(authorMap.entries()).map(([author, authorData]) => {
    // Calculate user importance based on message count and contextual ratio
    const contextualRatio = authorData.contextualCount / authorData.messageCount;
    const importance = Math.min(3, Math.floor(authorData.messageCount / 5) + (contextualRatio > 0.5 ? 1 : 0));
    
    return {
      id: `user-${author}`,
      type: 'user' as const,
      data: {
        content: `${author} (${authorData.messageCount} messages)`,
        author: author,
        timestamp: authorData.firstMessageTime,
        messageType: 'contextual' as const, // Users are always considered contextual
        userHandle: author,
        messageCount: authorData.messageCount
      },
      position: { x: 0, y: 0 },
      metadata: {
        replyCount: 0, // Users don't reply directly
        semanticConnections: 0, // Will be calculated separately if needed
        importance,
        userMessageIds: authorData.messageIds
      }
    };
  });
}

function createUserMessageEdges(
  data: GraphData, 
  users: VisualizationNode[], 
  filters?: Partial<FilterState>
): VisualizationEdge[] {
  // Skip creating user-message edges if they're filtered out
  if (filters && filters.showUserMessageEdges === false) {
    return [];
  }
  
  const userMessageEdges: VisualizationEdge[] = [];
  
  // Create edges from users to their messages
  users.forEach(user => {
    if (user.metadata.userMessageIds) {
      user.metadata.userMessageIds.forEach(messageId => {
        userMessageEdges.push({
          id: `user-message-${user.id}-${messageId}`,
          source: user.id,
          target: messageId,
          type: 'user_message',
          strength: 1.0, // Strong connection between user and their message
          metadata: {}
        });
      });
    }
  });
  
  return userMessageEdges;
}

function convertToVisualizationEdges(data: GraphData): VisualizationEdge[] {
  const visualizationEdges = data.edges.map(edge => ({
    id: edge.id,
    source: edge.source,
    target: edge.target,
    type: (edge.data.edge_type === 'reply_to' ? 'reply' : 'semantic') as 'reply' | 'semantic',
    strength: edge.data.strength || 1.0,
    metadata: {
      timestamp: undefined, // TODO: Add when timestamp data is available
      distance: undefined  // TODO: Add when distance data is available
    }
  }));
  
  logger.info('Edge conversion complete', { 
    originalEdges: data.edges.length,
    visualizationEdges: visualizationEdges.length,
    semanticEdgesConverted: visualizationEdges.filter(e => e.type === 'semantic').length,
    replyEdgesConverted: visualizationEdges.filter(e => e.type === 'reply').length
  });
  
  return visualizationEdges;
}

function buildConversationThreads(
  nodes: VisualizationNode[], 
  edges: VisualizationEdge[]
): ConversationThread[] {
  const threads: ConversationThread[] = [];
  const processedNodes = new Set<string>();
  
  // Find reply relationships
  const replyMap = new Map<string, string[]>(); // parent -> children
  const parentMap = new Map<string, string>(); // child -> parent
  
  edges.forEach(edge => {
    if (edge.type === 'reply') {
      // In reply_to relationship, source replies to target
      const parent = edge.target;
      const child = edge.source;
      
      if (!replyMap.has(parent)) {
        replyMap.set(parent, []);
      }
      replyMap.get(parent)!.push(child);
      parentMap.set(child, parent);
    }
  });
  
  // Find root messages (messages with no parent)
  const messageNodes = nodes.filter(node => node.type === 'message');
  const rootMessages = messageNodes.filter(node => !parentMap.has(node.id));
  
  // Build threads starting from root messages
  rootMessages.forEach((rootMessage, index) => {
    if (processedNodes.has(rootMessage.id)) return;
    
    const threadMessages = collectThreadMessages(rootMessage.id, replyMap, processedNodes);
    
    // Find semantic links within this thread
    const semanticLinks = edges
      .filter(edge => 
        edge.type === 'semantic' && 
        threadMessages.includes(edge.source) && 
        threadMessages.includes(edge.target)
      )
      .map(edge => edge.id);
    
    // Find participants (unique authors in this thread)
    const threadNodes = nodes.filter(node => threadMessages.includes(node.id));
    const participants = [...new Set(threadNodes.map(node => node.data.author))];
    
    // Determine if this is a noise thread (all messages are noise)
    const isNoiseThread = threadNodes.every(node => node.data.messageType === 'noise');
    
    threads.push({
      id: `thread-${index}`,
      rootMessageId: rootMessage.id,
      messages: threadMessages,
      semanticLinks,
      participants,
      timestamp: rootMessage.data.timestamp,
      isNoiseThread
    });
  });
  
  return threads.sort((a, b) => a.timestamp - b.timestamp);
}

function collectThreadMessages(
  rootId: string, 
  replyMap: Map<string, string[]>, 
  processedNodes: Set<string>
): string[] {
  const messages = [rootId];
  processedNodes.add(rootId);
  
  const children = replyMap.get(rootId) || [];
  children.forEach(childId => {
    if (!processedNodes.has(childId)) {
      messages.push(...collectThreadMessages(childId, replyMap, processedNodes));
    }
  });
  
  return messages;
} 