import type { GraphData } from '@/app/types';
import type { TransformedGraphData } from '../types';

export function transformDataForG6(filteredData: GraphData): TransformedGraphData {
  const nodes = filteredData.nodes.map(node => {
    const isChannel = node.id.includes('channel');
    const isContextual = node.data.is_contextual;
    const contentLength = node.data.content?.length || 0;
    
    // Implement design document specifications
    const nodeSize = isChannel ? 50 : Math.min(Math.max(25, contentLength / 4), 40);
    const nodeColor = isChannel ? '#7c3aed' : (isContextual ? '#4CAF50' : '#FFC107');
    const borderColor = isChannel ? '#5b21b7' : (isContextual ? '#2E7D32' : '#F57F17');
    
    return {
      id: node.id,
      data: {
        label: node.data.content ? 
          (node.data.content.length > 35 ? node.data.content.substring(0, 35) + '...' : node.data.content) : 
          (isChannel ? 'Channel Root' : node.id),
        fullContent: node.data.content || '',
        author: node.data.author_name || 'System',
        timestamp: node.data.written_at ? new Date(node.data.written_at).toLocaleString() : '',
        nodeType: isChannel ? 'channel' : 'message',
        messageType: isContextual ? 'contextual' : 'noise',
        nodeSize,
        nodeColor,
        borderColor,
        importance: isChannel ? 3 : (isContextual ? 2 : 1)
      }
    };
  });

  const edges = filteredData.edges.map(edge => ({
    id: edge.id,
    source: edge.source,
    target: edge.target,
    data: {
      edgeType: edge.data.edge_type,
      strength: edge.data.strength,
      strokeColor: edge.data.edge_type === 'semantic_link' ? '#9C27B0' : '#2196F3',
      strokeWidth: edge.data.edge_type === 'semantic_link' ? 
        Math.max(2, edge.data.strength * 4) : 3,
      opacity: edge.data.edge_type === 'semantic_link' ? 
        Math.max(0.4, edge.data.strength) : 0.9,
      isDashed: edge.data.edge_type === 'semantic_link'
    }
  }));

  return { nodes, edges };
} 