// Database schema interfaces for NLP1 PostgreSQL schema

export interface Channel {
  id: bigint;
  name: string;
  description: string;
  platform: string;
}

export interface BaseMessage {
  id: bigint;
  channel_id: bigint;
  content: string;
  author_name: string | null;
  author_id: bigint;
  written_at: Date;
}

export interface ContextualMessage extends BaseMessage {
  embedding: number[]; // 768-dimensional vector
}

export interface NoiseMessage extends BaseMessage {
  noise_reason: string;
}

export type Message = ContextualMessage | NoiseMessage;

export interface MessageEdge {
  id: string; // UUID
  channel_id: bigint;
  source_message_id: bigint;
  target_message_id: bigint;
  edge_type: 'reply_to' | 'semantic_link';
  strength: number; // 0.0 to 1.0
}

// G6 Graph types
export interface G6Node {
  id: string;
  type: 'message' | 'channel';
  data: {
    label: string;
    content?: string;
    author_name?: string;
    written_at?: Date;
    is_contextual: boolean;
    noise_reason?: string;
  };
  style?: {
    fill?: string;
    stroke?: string;
    radius?: number;
  };
}

export interface G6Edge {
  id: string;
  source: string;
  target: string;
  type: 'reply' | 'semantic';
  data: {
    strength: number;
    edge_type: 'reply_to' | 'semantic_link';
  };
  style?: {
    stroke?: string;
    lineWidth?: number;
    lineDash?: number[];
  };
}

export interface GraphData {
  nodes: G6Node[];
  edges: G6Edge[];
}

// UI State types
export interface FilterState {
  authors: string[];
  timeRange: {
    start: Date | null;
    end: Date | null;
  };
  semanticThreshold: number;
  messageTypes: ('contextual' | 'noise')[];
  searchQuery: string;
}

export interface LayoutType {
  type: 'hierarchical' | 'force' | 'radial';
  options?: Record<string, unknown>;
}

export interface UIState {
  selectedNodes: string[];
  hoveredNode: string | null;
  selectedLayout: LayoutType;
  filters: FilterState;
  isLoading: boolean;
  error: string | null;
}

// API Response types (with string IDs for JSON serialization)
export interface APIChannel {
  id: string; // Serialized from bigint
  name: string;
  description: string;
  platform: string;
}

export interface APIContextualMessage {
  id: string; // Serialized from bigint
  channel_id: string; // Serialized from bigint
  content: string;
  author_name: string | null;
  author_id: string; // Serialized from bigint
  written_at: Date;
  embedding: number[];
}

export interface APIMessageEdge {
  id: string; // UUID
  channel_id: string; // Serialized from bigint
  source_message_id: string; // Serialized from bigint
  target_message_id: string; // Serialized from bigint
  edge_type: 'reply_to' | 'semantic_link';
  strength: number;
}

export interface ChannelsResponse {
  channels: APIChannel[];
}

export interface GraphDataResponse {
  messages: APIContextualMessage[];
  edges: APIMessageEdge[];
  total_count: number;
}

export interface TimeRangeQuery {
  channel_id: bigint;
  start_date?: Date;
  end_date?: Date;
  limit?: number;
  offset?: number;
}

// Store State types
export interface GraphStore {
  // Data
  channels: Channel[];
  currentChannel: Channel | null;
  graphData: GraphData;
  rawMessages: ContextualMessage[];
  rawEdges: MessageEdge[];
  
  // UI State
  ui: UIState;
  
  // Actions
  setChannels: (channels: Channel[]) => void;
  setCurrentChannel: (channel: Channel) => void;
  setGraphData: (data: GraphData) => void;
  setRawData: (messages: ContextualMessage[], edges: MessageEdge[]) => void;
  updateFilters: (filters: Partial<FilterState>) => void;
  updateLayout: (layout: LayoutType) => void;
  setSelectedNodes: (nodeIds: string[]) => void;
  setHoveredNode: (nodeId: string | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

// Utility types
export type NodeType = 'message' | 'channel';
export type EdgeType = 'reply' | 'semantic';
export type MessageType = 'contextual' | 'noise'; 