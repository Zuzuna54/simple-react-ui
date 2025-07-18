# Semantic Tree Visualization Design Document

## Overview

This document outlines the design for a semantic tree visualization system that displays conversation intelligence data from the NLP1 schema. The visualization will represent messages as nodes and their relationships (replies and semantic links) as edges, creating an interactive graph that reveals conversation patterns and semantic connections.

## Visualization Concept

### Core Philosophy
Based on research into [semantic trees](https://medium.com/@hello_30021/unlocking-the-power-of-semantic-trees-nurturing-wisdom-in-information-driven-world-6b0c55e1e515) and [hierarchical visualization techniques](https://insight7.io/mind-map-tree-6-hierarchical-visualization-techniques/), our design follows these principles:

1. **Hierarchical Organization**: Messages organized by conversation threads and semantic relationships
2. **Visual Clarity**: Clear distinction between different relationship types and message classifications
3. **Interactive Exploration**: Users can navigate through conversation flows and discover semantic connections
4. **Contextual Understanding**: Visual representation helps identify patterns and conversation dynamics

## Data Mapping

### Node Representation (Messages)
Each message becomes a node with the following visual properties:

| Message Property | Visual Representation |
|------------------|----------------------|
| **Message Type** | Node shape and styling |
| **Author** | Color coding or avatar |
| **Timestamp** | Position and size hints |
| **Content Length** | Node size |
| **Semantic Importance** | Border thickness/glow |

### Edge Representation (Relationships)
Message relationships become edges with distinct visual styles:

| Edge Type | Visual Style | Strength Indicator |
|-----------|--------------|-------------------|
| **Reply To** | Solid, thick line | Always 100% opacity |
| **Semantic Link** | Dashed/dotted line | Opacity/thickness based on strength (0.0-1.0) |

## Layout Designs

### 1. Hierarchical Tree Layout (Primary)
```
Channel Root
├── Thread 1 (Temporal Grouping)
│   ├── Message A (Original)
│   │   ├── Message B (Reply)
│   │   └── Message C (Reply)
│   └── Message D (Semantic Link to A)
├── Thread 2
│   └── Message E
│       └── Message F (Reply)
└── Noise Messages (Collapsed Branch)
```

**Characteristics:**
- **Root Node**: Channel/Group name
- **Primary Branches**: Conversation threads organized temporally
- **Secondary Branches**: Reply chains and semantic connections
- **Leaf Nodes**: Individual messages
- **Collapsible Sections**: Noise messages, old threads

### 2. Force-Directed Network (Secondary View)
**Characteristics:**
- Messages as floating nodes
- Natural clustering based on semantic similarity
- Reply chains create strong gravitational pulls
- Temporal flow from left to right
- Authors create color-coded clusters

### 3. Radial/Circular Layout (Tertiary View)
**Characteristics:**
- Central hub represents the channel
- Messages arranged in concentric circles by time
- Radial branches show reply relationships
- Semantic links as curved connections across the circle

## Visual Design Specifications

### Color Scheme
```css
/* Message Types */
.contextual-message {
  background: #4CAF50;      /* Green - meaningful content */
  border: #2E7D32;
}

.noise-message {
  background: #FFC107;      /* Amber - filtered content */
  border: #F57F17;
  opacity: 0.6;
}

/* Relationship Types */
.reply-edge {
  stroke: #2196F3;          /* Blue - direct replies */
  stroke-width: 3px;
  stroke-dasharray: none;
}

.semantic-edge {
  stroke: #9C27B0;          /* Purple - AI-detected similarity */
  stroke-width: 2px;
  stroke-dasharray: 5,5;
}

/* Author Coding */
.author-colors {
  --author-1: #FF5722;      /* Red-Orange */
  --author-2: #4CAF50;      /* Green */
  --author-3: #2196F3;      /* Blue */
  --author-4: #FF9800;      /* Orange */
  --author-5: #9C27B0;      /* Purple */
}
```

### Node Specifications

#### Message Nodes
- **Shape**: Rounded rectangles
- **Size**: 
  - Width: 120-300px (based on content length)
  - Height: 60-120px (based on content length)
- **Content**: 
  - Author name (top)
  - Message preview (center, truncated)
  - Timestamp (bottom right)
- **Interactive States**:
  - Hover: Slight scale increase, shadow
  - Selected: Bold border, highlight
  - Related: Subtle glow when related messages are selected

#### Channel/Group Root Node
- **Shape**: Hexagon or rounded square
- **Size**: 150x80px
- **Content**: Channel name, message count
- **Style**: Distinct styling to show hierarchy level

### Edge Specifications

#### Reply Relationships
- **Style**: Solid lines with directional arrows
- **Thickness**: 3px
- **Color**: Blue (#2196F3)
- **Animation**: Optional flow animation on hover

#### Semantic Links
- **Style**: Dashed lines
- **Thickness**: 1-3px (based on similarity strength)
- **Color**: Purple (#9C27B0)
- **Opacity**: 0.3-1.0 (based on similarity strength)
- **Curve**: Slight bezier curve to distinguish from reply edges

## Interactive Features

### 1. Navigation Controls
- **Zoom**: Mouse wheel or pinch gestures
- **Pan**: Click and drag on empty space
- **Fit to View**: Button to reset zoom/pan
- **Minimap**: Overview of entire graph structure

### 2. Filtering Options
```
☑ Show Contextual Messages
☑ Show Noise Messages
☑ Show Reply Relationships
☑ Show Semantic Links (threshold: 0.5-1.0)
📅 Date Range Filter
👤 Author Filter
🔍 Content Search Filter
```

### 3. Layout Switching
- Toggle between Tree, Network, and Radial layouts
- Smooth animated transitions between layouts
- Layout-specific optimization controls

### 4. Message Interaction
- **Click**: Select message and highlight related messages
- **Double-click**: Expand message to show full content
- **Right-click**: Context menu (copy, link, etc.)
- **Hover**: Show relationship strengths and metadata

### 5. Semantic Exploration
- **Similarity Threshold Slider**: Adjust which semantic links to display
- **Path Highlighting**: Show conversation paths between any two messages
- **Cluster Detection**: Visual grouping of semantically similar messages
- **Topic Highlighting**: Color-code messages by detected topics

## Layout Behavior

### Hierarchical Tree Rules
1. **Root**: Channel at top center
2. **Level 1**: Major conversation threads (temporal grouping)
3. **Level 2**: Reply chains within threads
4. **Level 3**: Individual messages
5. **Cross-connections**: Semantic links as curved edges

### Temporal Organization
- **Primary Sort**: Messages grouped by conversation threads
- **Secondary Sort**: Chronological within threads
- **Visual Indicators**: 
  - Newer messages have stronger visual weight
  - Time gaps shown as visual spacing
  - Timestamps visible on hover/selection

### Semantic Clustering
- Messages with strong semantic similarity (>0.7) cluster together
- Visual bridges show semantic connections across time
- Strength indicators help identify key conversation topics

## Performance Considerations

### Scalability Thresholds
- **Optimal**: 50-200 messages
- **Good**: 200-500 messages
- **Requires Optimization**: 500+ messages

### Large Dataset Handling
1. **Pagination**: Show conversations in time-based chunks
2. **Level of Detail**: Simplify distant nodes, detailed nearby nodes
3. **Lazy Loading**: Load message details on demand
4. **Virtualization**: Only render visible portions of large graphs

## Accessibility Features

### Visual Accessibility
- High contrast mode option
- Colorblind-friendly palette alternative
- Adjustable text sizes
- Screen reader compatible labels

### Interaction Accessibility
- Keyboard navigation support
- Focus indicators
- Alternative text for all visual elements
- ARIA labels for complex interactions

## Technical Implementation Notes

### Data Structure Requirements
```typescript
interface VisualizationNode {
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

interface VisualizationEdge {
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
```

### Performance Optimizations
- Use canvas rendering for large graphs
- Implement quadtree spatial indexing
- Batch DOM updates during animations
- Use web workers for layout calculations

## Future Enhancements

### Advanced Features
1. **Sentiment Analysis**: Color-code messages by sentiment
2. **Topic Modeling**: Visual topic clusters
3. **User Journey Mapping**: Trace individual user conversation patterns
4. **Real-time Updates**: Live visualization of incoming messages
5. **Export Options**: PNG, SVG, PDF export of visualizations
6. **Collaboration**: Shared annotations and bookmarks

### AI-Powered Insights
1. **Conversation Summarization**: Generate visual summaries of long threads
2. **Anomaly Detection**: Highlight unusual conversation patterns
3. **Prediction**: Show likely next messages or responses
4. **Pattern Recognition**: Identify recurring conversation structures

## Conclusion

This semantic tree visualization design creates an intuitive interface for exploring conversation intelligence data. By combining hierarchical organization with interactive features, users can understand both the structure of conversations and the semantic relationships that emerge from AI analysis.

The design balances visual clarity with information density, ensuring that complex conversation networks remain comprehensible while providing deep insights into communication patterns and semantic connections. 