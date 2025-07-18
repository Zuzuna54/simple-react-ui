import type { GraphData } from '@/app/types';
import type { TransformedGraphData, HierarchicalData } from '../types';
import { processHierarchicalData } from './hierarchicalProcessor';

export function transformDataForG6(filteredData: GraphData): TransformedGraphData {
  // First process data into hierarchical structure
  const hierarchicalData = processHierarchicalData(filteredData);
  
  // Transform nodes with design-compliant styling
  const nodes = hierarchicalData.nodes.map(node => {
    const isChannel = node.type === 'channel';
    const isContextual = node.data.messageType === 'contextual';
    const contentLength = node.data.content?.length || 0;
    
    // Design-compliant sizing: 120-300px width, 60-120px height
    const baseWidth = Math.min(Math.max(120, contentLength * 2), 300);
    const baseHeight = Math.min(Math.max(60, contentLength / 3), 120);
    
    // Channel nodes get special sizing and shape
    const width = isChannel ? 200 : baseWidth;
    const height = isChannel ? 100 : baseHeight;
    const shape: 'rect' | 'hexagon' = isChannel ? 'hexagon' : 'rect';
    
    // Enhanced node sizing based on importance and content
    const nodeSize = isChannel ? 60 : Math.min(Math.max(30, contentLength / 3), 50);
    const nodeColor = isChannel ? '#7c3aed' : (isContextual ? '#4CAF50' : '#FFC107');
    const borderColor = isChannel ? '#5b21b7' : (isContextual ? '#2E7D32' : '#F57F17');
    
    // Create rich content label with author and timestamp
    const createRichLabel = () => {
      if (isChannel) {
        return node.data.content;
      }
      
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
        author: node.data.author || 'System',
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
  });

  // Transform edges with enhanced styling
  const edges = hierarchicalData.edges.map(edge => {
    const isSemanticLink = edge.type === 'semantic';
    
    return {
      id: edge.id,
      source: edge.source,
      target: edge.target,
      data: {
        edgeType: edge.type,
        strength: edge.strength,
        strokeColor: isSemanticLink ? '#9C27B0' : '#2196F3',
        strokeWidth: isSemanticLink ? 
          Math.max(2, edge.strength * 4) : 3,
        opacity: isSemanticLink ? 
          Math.max(0.4, edge.strength) : 0.9,
        isDashed: isSemanticLink,
        isCurved: isSemanticLink // Semantic links should be curved
      }
    };
  });

  return { nodes, edges };
}

// Helper function to get hierarchical data for other components
export function getHierarchicalData(data: GraphData): HierarchicalData {
  return processHierarchicalData(data);
} 