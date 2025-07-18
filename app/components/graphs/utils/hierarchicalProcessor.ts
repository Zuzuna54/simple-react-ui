import type { GraphData } from '@/app/types';
import type { 
  VisualizationNode, 
  VisualizationEdge, 
  ConversationThread, 
  HierarchicalData 
} from '../types';

export function processHierarchicalData(data: GraphData): HierarchicalData {
  // Convert raw data to visualization format
  const nodes = convertToVisualizationNodes(data);
  const edges = convertToVisualizationEdges(data);
  
  // Find or create channel root
  const channelRoot = findOrCreateChannelRoot(nodes, data);
  
  // Group messages into conversation threads
  const threads = buildConversationThreads(nodes, edges);
  
  // Separate noise nodes
  const noiseNodes = nodes.filter(node => 
    node.type === 'message' && node.data.messageType === 'noise'
  );
  
  return {
    channelRoot,
    threads,
    nodes,
    edges,
    noiseNodes
  };
}

function convertToVisualizationNodes(data: GraphData): VisualizationNode[] {
  return data.nodes.map(node => {
    const isChannel = node.id.includes('channel');
    const isContextual = node.data.is_contextual;
    
    // Calculate metadata
    const replyCount = data.edges.filter(edge => 
      edge.source === node.id && edge.data.edge_type === 'reply_to'
    ).length;
    
    const semanticConnections = data.edges.filter(edge => 
      (edge.source === node.id || edge.target === node.id) && 
      edge.data.edge_type === 'semantic_link'
    ).length;
    
    const importance = isChannel ? 3 : (isContextual ? 2 : 1);
    
    return {
      id: node.id,
      type: isChannel ? 'channel' : 'message',
      data: {
        content: node.data.content || '',
        author: node.data.author_name || 'System',
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

function convertToVisualizationEdges(data: GraphData): VisualizationEdge[] {
  return data.edges.map(edge => ({
    id: edge.id,
    source: edge.source,
    target: edge.target,
    type: edge.data.edge_type === 'reply_to' ? 'reply' : 'semantic',
    strength: edge.data.strength || 1.0,
    metadata: {
      timestamp: undefined, // TODO: Add when timestamp data is available
      distance: undefined  // TODO: Add when distance data is available
    }
  }));
}

function findOrCreateChannelRoot(nodes: VisualizationNode[], data: GraphData): VisualizationNode {
  // Try to find existing channel node
  const existingChannel = nodes.find(node => node.type === 'channel');
  if (existingChannel) {
    return existingChannel;
  }
  
  // Create a virtual channel root if none exists
  return {
    id: 'channel-root',
    type: 'channel',
    data: {
      content: `Channel (${nodes.length} messages)`,
      author: 'System',
      timestamp: Date.now(),
      messageType: 'contextual',
    },
    position: { x: 0, y: 0 },
    metadata: {
      replyCount: 0,
      semanticConnections: 0,
      importance: 3
    }
  };
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
  const rootMessages = nodes.filter(node => 
    node.type === 'message' && !parentMap.has(node.id)
  );
  
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
    
    // Determine if this is a noise thread (all messages are noise)
    const threadNodes = nodes.filter(node => threadMessages.includes(node.id));
    const isNoiseThread = threadNodes.every(node => node.data.messageType === 'noise');
    
    threads.push({
      id: `thread-${index}`,
      rootMessageId: rootMessage.id,
      messages: threadMessages,
      semanticLinks,
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