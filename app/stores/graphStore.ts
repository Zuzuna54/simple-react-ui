import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type {
  GraphStore,
  Channel,
  GraphData,
  ContextualMessage,
  MessageEdge,
  FilterState,
  LayoutType,
  UIState,
} from '../types';

// Initial states
const initialFilterState: FilterState = {
  authors: [],
  timeRange: {
    start: null,
    end: null,
  },
  semanticThreshold: 0.5,
  messageTypes: ['contextual'],
  searchQuery: '',
};

const initialUIState: UIState = {
  selectedNodes: [],
  hoveredNode: null,
  selectedLayout: {
    type: 'hierarchical',
    options: {},
  },
  filters: initialFilterState,
  isLoading: false,
  error: null,
};

const initialGraphData: GraphData = {
  nodes: [],
  edges: [],
};

// Create store with devtools for debugging
export const useGraphStore = create<GraphStore>()(
  devtools(
    (set, _get) => ({
      // Data state
      channels: [],
      currentChannel: null,
      graphData: initialGraphData,
      rawMessages: [],
      rawEdges: [],
      
      // UI state
      ui: initialUIState,
      
      // Data actions
      setChannels: (channels: Channel[]) =>
        set(
          { channels },
          false,
          'setChannels'
        ),
      
      setCurrentChannel: (channel: Channel) =>
        set(
          { currentChannel: channel },
          false,
          'setCurrentChannel'
        ),
      
      setGraphData: (data: GraphData) =>
        set(
          { graphData: data },
          false,
          'setGraphData'
        ),
      
      setRawData: (messages: ContextualMessage[], edges: MessageEdge[]) =>
        set(
          { rawMessages: messages, rawEdges: edges },
          false,
          'setRawData'
        ),
      
      // UI actions
      updateFilters: (filters: Partial<FilterState>) =>
        set(
          (state) => ({
            ui: {
              ...state.ui,
              filters: { ...state.ui.filters, ...filters },
            },
          }),
          false,
          'updateFilters'
        ),
      
      updateLayout: (layout: LayoutType) =>
        set(
          (state) => ({
            ui: {
              ...state.ui,
              selectedLayout: layout,
            },
          }),
          false,
          'updateLayout'
        ),
      
      setSelectedNodes: (nodeIds: string[]) =>
        set(
          (state) => ({
            ui: {
              ...state.ui,
              selectedNodes: nodeIds,
            },
          }),
          false,
          'setSelectedNodes'
        ),
      
      setHoveredNode: (nodeId: string | null) =>
        set(
          (state) => ({
            ui: {
              ...state.ui,
              hoveredNode: nodeId,
            },
          }),
          false,
          'setHoveredNode'
        ),
      
      setLoading: (loading: boolean) =>
        set(
          (state) => ({
            ui: {
              ...state.ui,
              isLoading: loading,
            },
          }),
          false,
          'setLoading'
        ),
      
      setError: (error: string | null) =>
        set(
          (state) => ({
            ui: {
              ...state.ui,
              error,
            },
          }),
          false,
          'setError'
        ),
    }),
    {
      name: 'graph-store', // DevTools store name
    }
  )
);

// Selector hooks for better performance and type safety
export const useChannels = () => useGraphStore((state) => state.channels);
export const useCurrentChannel = () => useGraphStore((state) => state.currentChannel);
export const useGraphData = () => useGraphStore((state) => state.graphData);
export const useRawData = () => useGraphStore((state) => ({ 
  messages: state.rawMessages, 
  edges: state.rawEdges 
}));
export const useUIState = () => useGraphStore((state) => state.ui);
export const useFilters = () => useGraphStore((state) => state.ui.filters);
export const useSelectedLayout = () => useGraphStore((state) => state.ui.selectedLayout);
export const useSelectedNodes = () => useGraphStore((state) => state.ui.selectedNodes);
export const useHoveredNode = () => useGraphStore((state) => state.ui.hoveredNode);
export const useIsLoading = () => useGraphStore((state) => state.ui.isLoading);
export const useError = () => useGraphStore((state) => state.ui.error);

// Action hooks
export const useGraphActions = () => useGraphStore((state) => ({
  setChannels: state.setChannels,
  setCurrentChannel: state.setCurrentChannel,
  setGraphData: state.setGraphData,
  setRawData: state.setRawData,
  updateFilters: state.updateFilters,
  updateLayout: state.updateLayout,
  setSelectedNodes: state.setSelectedNodes,
  setHoveredNode: state.setHoveredNode,
  setLoading: state.setLoading,
  setError: state.setError,
})); 