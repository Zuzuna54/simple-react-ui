export interface FilterState {
  showContextual: boolean;
  showNoise: boolean;
  showReplyEdges: boolean;
  showSemanticEdges: boolean;
  showUserMessageEdges: boolean; // New: show user-to-message connections
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
  type: 'message' | 'user'; // Changed: removed 'channel', added 'user'
  data: {
    content: string;
    author: string;
    timestamp: number;
    messageType: 'contextual' | 'noise';
    embedding?: number[];
    // User-specific data
    messageCount?: number; // For user nodes: how many messages they have
    userHandle?: string; // For user nodes: their handle/name
  };
  position: { x: number; y: number };
  metadata: {
    replyCount: number;
    semanticConnections: number;
    importance: number;
    // User-specific metadata
    userMessageIds?: string[]; // For user nodes: IDs of their messages
  };
}

export interface VisualizationEdge {
  id: string;
  source: string;
  target: string;
  type: 'reply' | 'semantic' | 'user_message'; // Added 'user_message' for user-to-message connections
  strength: number;
  metadata: {
    timestamp?: number;
    distance?: number;
  };
}

// Thread organization structure - updated for user-centric approach
export interface ConversationThread {
  id: string;
  rootMessageId: string;
  messages: string[]; // message IDs in thread
  semanticLinks: string[]; // edge IDs for semantic connections
  participants: string[]; // user IDs who participated in thread
  timestamp: number;
  isNoiseThread: boolean;
}

export interface HierarchicalData {
  users: VisualizationNode[]; // Changed: users instead of channelRoot
  threads: ConversationThread[];
  nodes: VisualizationNode[];
  edges: VisualizationEdge[];
  noiseNodes: VisualizationNode[];
  userMessageEdges: VisualizationEdge[]; // New: user-to-message edges
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
    // Design-compliant fields
    width: number;
    height: number;
    shape: 'rect' | 'hexagon' | 'circle'; // Added 'circle' for user nodes
    replyCount: number;
    semanticConnections: number;
    // User-specific fields
    messageCount?: number;
    userHandle?: string;
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
    label: string; // New: edge label for relationship type display
  };
}

export interface TransformedGraphData {
  nodes: TransformedNode[];
  edges: TransformedEdge[];
}

export type LayoutType = 'tree' | 'force' | 'radial'; 