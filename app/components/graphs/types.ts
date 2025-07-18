export interface FilterState {
  showContextual: boolean;
  showNoise: boolean;
  showReplyEdges: boolean;
  showSemanticEdges: boolean;
  semanticThreshold: number;
  authorFilter: string[];
  contentSearch: string;
}

export interface SemanticTreeGraphProps {
  data: import('@/app/types').GraphData;
  width?: number;
  height?: number;
  className?: string;
}

export interface TransformedNode {
  id: string;
  data: {
    label: string;
    fullContent: string;
    author: string;
    timestamp: string;
    nodeType: string;
    messageType: string;
    nodeSize: number;
    nodeColor: string;
    borderColor: string;
    importance: number;
  };
}

export interface TransformedEdge {
  id: string;
  source: string;
  target: string;
  data: {
    edgeType: string;
    strength: number;
    strokeColor: string;
    strokeWidth: number;
    opacity: number;
    isDashed: boolean;
  };
}

export interface TransformedGraphData {
  nodes: TransformedNode[];
  edges: TransformedEdge[];
}

export type LayoutType = 'tree' | 'force' | 'radial'; 