# Implementation Plan - Phase 2: Core Graph Visualization

## Overview
This phase implements the core G6 graph visualization components, including the hierarchical tree layout, custom node/edge styling, and basic interactions as specified in the design document.

## Prerequisites
- Phase 1 completed successfully
- Database integration working
- Global state management in place
- Basic UI components available

## Step 2.1: G6 Base Configuration

### Action Items:
1. **Create G6 configuration utility**:
   - **File**: `app/lib/g6Config.ts`
   - **Purpose**: Centralize G6 configuration, themes, and default settings
   - **Content**:
     ```typescript
     export const G6_THEMES = {
       default: {
         background: '#f8fafc',
         node: { /* colors from design doc */ },
         edge: { /* colors from design doc */ }
       }
     }
     
     export const G6_LAYOUTS = {
       hierarchical: { type: 'dagre', rankdir: 'TB' },
       force: { type: 'force', linkDistance: 100 },
       radial: { type: 'radial', center: [250, 250] }
     }
     ```

2. **Create G6 React wrapper component**:
   - **File**: `app/components/graphs/G6Graph.tsx`
   - **Purpose**: Handle G6 lifecycle within React
   - **Features**:
     - Proper cleanup on unmount
     - Ref management for G6 instance
     - Event handling setup
     - Responsive canvas sizing
   - **Reference**: Use existing FishEyeGraph.jsx patterns but convert to TypeScript

### Expected Outcome:
- Reusable G6 wrapper that handles React integration
- Configuration system for themes and layouts

## Step 2.2: Custom Node Components

### Action Items:
1. **Implement message node styling**:
   - **File**: `app/components/graphs/nodes/MessageNode.ts`
   - **Features**:
     - Rounded rectangle shape as per design
     - Dynamic sizing based on content length
     - Author color coding
     - Message type differentiation (contextual vs noise)
     - Timestamp display
   - **Reference**: Follow semantic-tree-visualization-design.md node specifications

2. **Implement channel root node**:
   - **File**: `app/components/graphs/nodes/ChannelNode.ts`
   - **Features**:
     - Hexagonal or rounded square shape
     - Channel name display
     - Message count indicator
     - Distinct styling to show hierarchy

3. **Register custom nodes with G6**:
   - **File**: `app/lib/registerNodes.ts`
   - **Purpose**: Register all custom nodes with G6 engine
   - **Reference**: Use G6.registerNode() API

### Expected Outcome:
- Custom nodes matching design specifications
- Visual distinction between message types and hierarchy levels

## Step 2.3: Custom Edge Components

### Action Items:
1. **Implement reply edge styling**:
   - **File**: `app/components/graphs/edges/ReplyEdge.ts`
   - **Features**:
     - Solid blue lines as per design
     - Directional arrows
     - 3px thickness
     - Optional flow animation on hover

2. **Implement semantic edge styling**:
   - **File**: `app/components/graphs/edges/SemanticEdge.ts`
   - **Features**:
     - Dashed purple lines
     - Variable thickness based on strength (1-3px)
     - Variable opacity based on strength (0.3-1.0)
     - Curved bezier path to distinguish from reply edges

3. **Register custom edges with G6**:
   - **File**: `app/lib/registerEdges.ts`
   - **Purpose**: Register all custom edges with G6 engine

### Expected Outcome:
- Custom edges matching design specifications
- Visual differentiation between reply and semantic relationships

## Step 2.4: Hierarchical Tree Layout Implementation

### Action Items:
1. **Create hierarchical layout component**:
   - **File**: `app/components/graphs/layouts/HierarchicalLayout.tsx`
   - **Features**:
     - Dagre layout as primary layout
     - Channel root at top center
     - Conversation threads as primary branches
     - Reply chains as secondary branches
     - Temporal organization within threads
   - **Reference**: Use G6 dagre layout with custom configuration

2. **Implement layout switching logic**:
   - **File**: `app/components/graphs/LayoutSwitcher.tsx`
   - **Purpose**: Allow users to switch between different layouts
   - **Layouts**:
     - Hierarchical Tree (primary)
     - Force-Directed Network (secondary)
     - Radial/Circular (tertiary)

### Expected Outcome:
- Working hierarchical tree layout
- Smooth layout transitions
- Layout switching interface

## Step 2.5: Data Processing Pipeline

### Action Items:
1. **Create graph data processor**:
   - **File**: `app/utils/graphDataProcessor.ts`
   - **Purpose**: Transform database results into G6-compatible graph data
   - **Functions**:
     ```typescript
     - transformMessages(messages, edges) -> { nodes: [], edges: [] }
     - createMessageNode(message) -> G6Node
     - createChannelNode(channel) -> G6Node
     - createReplyEdge(edge) -> G6Edge
     - createSemanticEdge(edge) -> G6Edge
     ```

2. **Implement temporal grouping logic**:
   - **File**: `app/utils/temporalGrouping.ts`
   - **Purpose**: Group messages into conversation threads
   - **Algorithm**:
     - Group by time proximity
     - Consider reply relationships
     - Create thread hierarchy

### Expected Outcome:
- Robust data transformation pipeline
- Intelligent conversation thread detection
- G6-compatible data structures

## Step 2.6: Basic Interactions

### Action Items:
1. **Implement node selection**:
   - **File**: `app/components/graphs/behaviors/NodeSelection.ts`
   - **Features**:
     - Click to select message
     - Highlight related messages
     - Show full message content on selection
     - Visual feedback (border highlight)

2. **Implement basic navigation**:
   - **File**: `app/components/graphs/behaviors/Navigation.ts`
   - **Features**:
     - Zoom with mouse wheel
     - Pan with click and drag
     - Fit to view button
     - Reset zoom/pan functionality

3. **Implement hover effects**:
   - **File**: `app/components/graphs/behaviors/HoverEffects.ts`
   - **Features**:
     - Node hover: scale increase, shadow
     - Edge hover: highlight and show strength
     - Tooltip with metadata

### Expected Outcome:
- Interactive graph with intuitive navigation
- Clear visual feedback for user actions
- Accessible interaction patterns

## Step 2.7: Dashboard Integration

### Action Items:
1. **Create main graph container**:
   - **File**: `app/components/graphs/GraphContainer.tsx`
   - **Purpose**: Main container for graph visualization
   - **Features**:
     - Responsive sizing
     - Loading states
     - Error handling
     - Layout controls integration

2. **Update dashboard layout**:
   - **File**: `app/dashboard/[channelId]/page.tsx`
   - **Purpose**: Dashboard page for specific channel
   - **Layout**:
     - Sidebar with graph list/controls
     - Main panel with graph visualization
     - Top bar with channel info and settings

3. **Implement graph data loading**:
   - **File**: `app/hooks/useGraphData.ts`
   - **Purpose**: Custom hook for fetching and managing graph data
   - **Features**:
     - Fetch graph data on channel selection
     - Loading states
     - Error handling
     - Data caching

### Expected Outcome:
- Fully integrated dashboard with working graph visualization
- Proper loading states and error handling
- Responsive design

## Step 2.8: Performance Optimization

### Action Items:
1. **Implement virtualization for large graphs**:
   - **File**: `app/utils/graphVirtualization.ts`
   - **Purpose**: Handle performance for graphs with 500+ messages
   - **Features**:
     - Level of detail (LOD) rendering
     - Node culling for off-screen nodes
     - Lazy loading of detailed content

2. **Add performance monitoring**:
   - **File**: `app/utils/performanceMonitor.ts`
   - **Purpose**: Monitor graph rendering performance
   - **Metrics**:
     - Render time
     - Node count
     - Memory usage

### Expected Outcome:
- Smooth performance even with large datasets
- Performance monitoring and optimization

## Phase 2 Verification Checklist

- [ ] G6 is properly configured with custom themes
- [ ] Custom nodes render correctly with proper styling
- [ ] Custom edges display relationships accurately
- [ ] Hierarchical layout works and is visually clear
- [ ] Basic interactions (select, hover, zoom, pan) function
- [ ] Dashboard integrates graph visualization properly
- [ ] Data transforms correctly from database to G6 format
- [ ] Performance is acceptable with test datasets
- [ ] Layout switching works smoothly
- [ ] Error handling covers edge cases

## Next Phase Preview
Phase 3 will focus on advanced features including filtering, semantic exploration, and the timebar component for temporal visualization.

## Notes for Implementation
- Test with real database data early and often
- Follow accessibility guidelines for interactions
- Keep rendering performance in mind for large datasets
- Implement error boundaries around graph components
- Use React.memo() and useMemo() for expensive operations
- Log user interactions for UX improvement insights 