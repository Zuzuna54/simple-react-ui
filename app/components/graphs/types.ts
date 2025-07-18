export interface FilterState {
  showContextual: boolean;
  showNoise: boolean;
  showReplyEdges: boolean;
  showSemanticEdges: boolean;
  semanticThreshold: number;
  authorFilter: string[];
  contentSearch: string;
  dateRange: {
    start: string | null;
    end: string | null;
  };
}

export interface SemanticTreeGraphProps {
  data: import('@/app/types').GraphData;
  width?: number;
  height?: number;
  className?: string;
}

// Design-compliant data structures
export interface VisualizationNode {
  id: string;
  type: 'message' | 'channel' | 'thread';
  data: {
    content: string;
    author: string;
    timestamp: number;
    messageType: 'contextual' | 'noise';
    embedding?: number[];
  };
  position: { x: number; y: number };
  metadata: {
    replyCount: number;
    semanticConnections: number;
    importance: number;
  };
}

export interface VisualizationEdge {
  id: string;
  source: string;
  target: string;
  type: 'reply' | 'semantic';
  strength: number;
  metadata: {
    timestamp?: number;
    distance?: number;
  };
}

// Thread organization structure
export interface ConversationThread {
  id: string;
  rootMessageId: string;
  messages: string[]; // message IDs in thread
  semanticLinks: string[]; // edge IDs for semantic connections
  timestamp: number;
  isNoiseThread: boolean;
}

export interface HierarchicalData {
  channelRoot: VisualizationNode;
  threads: ConversationThread[];
  nodes: VisualizationNode[];
  edges: VisualizationEdge[];
  noiseNodes: VisualizationNode[];
}

// Legacy transformed data for G6 compatibility
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
    // New design-compliant fields
    width: number;
    height: number;
    shape: 'rect' | 'hexagon';
    replyCount: number;
    semanticConnections: number;
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
    isCurved: boolean;
  };
}

export interface TransformedGraphData {
  nodes: TransformedNode[];
  edges: TransformedEdge[];
}

export type LayoutType = 'tree' | 'force' | 'radial'; 