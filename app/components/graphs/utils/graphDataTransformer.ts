import type { GraphData } from '@/app/types';
import type { TransformedGraphData, HierarchicalData, FilterState } from '../types';
import { processHierarchicalData } from './hierarchicalProcessor';

export function transformDataForG6(filteredData: GraphData, filters?: Partial<FilterState>): TransformedGraphData {
  // First process data into hierarchical structure with filter support
  const hierarchicalData = processHierarchicalData(filteredData, filters);
  
  // Transform nodes with design-compliant styling
  const nodes = hierarchicalData.nodes.map(node => {
    const isUser = node.type === 'user';
    const isMessage = node.type === 'message';
    const isContextual = node.data.messageType === 'contextual';
    
    if (isUser) {
      // User node styling
      const messageCount = node.data.messageCount || 0;
      
      // User nodes get circular shape and size based on message count
      const baseSize = Math.min(Math.max(80, messageCount * 8), 150);
      const width = baseSize;
      const height = baseSize;
      const shape = 'circle' as const;
      
      // User color coding based on importance/activity
      const nodeColor = '#6366f1'; // Indigo for users
      const borderColor = '#4338ca'; // Darker indigo border
      
      return {
        id: node.id,
        data: {
          label: node.data.userHandle || node.data.author,
          fullContent: node.data.content || '',
          author: node.data.author || 'Unknown',
          timestamp: new Date(node.data.timestamp).toLocaleString(),
          nodeType: node.type,
          messageType: node.data.messageType,
          nodeSize: Math.min(Math.max(40, messageCount * 2), 80),
          nodeColor,
          borderColor,
          importance: node.metadata.importance,
          // Design-compliant fields
          width,
          height,
          shape,
          replyCount: node.metadata.replyCount,
          semanticConnections: node.metadata.semanticConnections,
          // User-specific fields
          messageCount,
          userHandle: node.data.userHandle
        }
      };
    } else if (isMessage) {
      // Message node styling (existing logic)
      const contentLength = node.data.content?.length || 0;
      
      // Design-compliant sizing: 120-300px width, 60-120px height
      const baseWidth = Math.min(Math.max(120, contentLength * 2), 300);
      const baseHeight = Math.min(Math.max(60, contentLength / 3), 120);
      
      const width = baseWidth;
      const height = baseHeight;
      const shape = 'rect' as const;
      
      // Enhanced node sizing based on importance and content
      const nodeSize = Math.min(Math.max(30, contentLength / 3), 50);
      const nodeColor = isContextual ? '#4CAF50' : '#FFC107';
      const borderColor = isContextual ? '#2E7D32' : '#F57F17';
      
      // Create rich content label with author and timestamp
      const createRichLabel = () => {
        const authorLine = `@${node.data.author}`;
        const contentPreview = node.data.content.length > 50 
          ? node.data.content.substring(0, 50) + '...' 
          : node.data.content;
        const timestamp = new Date(node.data.timestamp).toLocaleTimeString();
        
        return `${authorLine}\n${contentPreview}\n${timestamp}`;
      };
      
      return {
        id: node.id,
        data: {
          label: createRichLabel(),
          fullContent: node.data.content || '',
          author: node.data.author || 'Unknown',
          timestamp: new Date(node.data.timestamp).toLocaleString(),
          nodeType: node.type,
          messageType: node.data.messageType,
          nodeSize,
          nodeColor,
          borderColor,
          importance: node.metadata.importance,
          // Design-compliant fields
          width,
          height,
          shape,
          replyCount: node.metadata.replyCount,
          semanticConnections: node.metadata.semanticConnections
        }
      };
    }
    
    // Fallback (should not happen)
    return {
      id: node.id,
      data: {
        label: node.data.content || node.id,
        fullContent: node.data.content || '',
        author: node.data.author || 'Unknown',
        timestamp: new Date(node.data.timestamp).toLocaleString(),
        nodeType: node.type,
        messageType: node.data.messageType,
        nodeSize: 30,
        nodeColor: '#gray',
        borderColor: '#darkgray',
        importance: 1,
        width: 120,
        height: 60,
        shape: 'rect' as const,
        replyCount: 0,
        semanticConnections: 0
      }
    };
  });

  // Transform edges with enhanced styling
  const edges = hierarchicalData.edges.map(edge => {
    const isSemanticLink = edge.type === 'semantic';
    const isUserMessage = edge.type === 'user_message';
    const isReply = edge.type === 'reply';
    
    let strokeColor: string;
    let strokeWidth: number;
    let opacity: number;
    let isDashed: boolean;
    let isCurved: boolean;
    
    if (isUserMessage) {
      // User-to-message edges: distinct styling
      strokeColor = '#6366f1'; // Indigo to match user nodes
      strokeWidth = 2;
      opacity = 0.7;
      isDashed = false;
      isCurved = false;
    } else if (isSemanticLink) {
      // Semantic links: purple, dashed, curved
      strokeColor = '#9C27B0';
      strokeWidth = Math.max(2, edge.strength * 4);
      opacity = Math.max(0.4, edge.strength);
      isDashed = true;
      isCurved = true;
    } else if (isReply) {
      // Reply chains: blue, solid, straight
      strokeColor = '#2196F3';
      strokeWidth = 3;
      opacity = 0.9;
      isDashed = false;
      isCurved = false;
    } else {
      // Fallback
      strokeColor = '#gray';
      strokeWidth = 2;
      opacity = 0.5;
      isDashed = false;
      isCurved = false;
    }
    
    return {
      id: edge.id,
      source: edge.source,
      target: edge.target,
      data: {
        edgeType: edge.type,
        strength: edge.strength,
        strokeColor,
        strokeWidth,
        opacity,
        isDashed,
        isCurved
      }
    };
  });

  return { nodes, edges };
}

// Helper function to get hierarchical data for other components
export function getHierarchicalData(data: GraphData): HierarchicalData {
  return processHierarchicalData(data);
} 