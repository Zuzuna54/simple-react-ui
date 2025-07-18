# Implementation Plan - Phase 1: Project Setup & Foundation

## Overview
This phase establishes the foundation for the semantic tree visualization dashboard, sets up the basic project structure, and implements the core state management system.

## Prerequisites
- Current Next.js project with G6 already installed
- Database connection working (as verified)
- Existing API route structure

## Step 1.1: Clean Up Existing Structure

### Action Items:
1. **Remove unused files**:
   ```bash
   # Remove files that won't be needed
   rm app/components/FishEyeGraph.jsx
   rm app/parsers/fishEyeDataParser.js
   rm app/parsers/jsonPharser.js
   ```

2. **Update package.json dependencies**:
   ```bash
   npm install zustand @types/d3 clsx class-variance-authority
   ```

### Expected Outcome:
- Clean project structure ready for semantic tree implementation
- Additional dependencies for state management and utilities

## Step 1.2: Create Directory Structure

### Action Items:
1. **Create new directory structure**:
   ```bash
   mkdir -p app/components/ui
   mkdir -p app/components/graphs
   mkdir -p app/components/panels
   mkdir -p app/hooks
   mkdir -p app/stores
   mkdir -p app/types
   mkdir -p app/utils
   mkdir -p app/lib
   ```

2. **Create type definitions file**:
   - **File**: `app/types/index.ts`
   - **Content**: Database schema interfaces matching NLP1 schema
   - **Reference**: Use databasenlp1schema.md for exact field types

### Expected Outcome:
- Organized directory structure following Next.js best practices
- Type safety foundation established

## Step 1.3: Implement Global State Store

### Action Items:
1. **Create Zustand store for graph data**:
   - **File**: `app/stores/graphStore.ts`
   - **Features**:
     - Store all channels data
     - Store current selected channel
     - Store graph visualization data (nodes/edges)
     - Store UI state (selected layout, filters)
     - Actions for data fetching and updates

2. **Create store selectors and hooks**:
   - **File**: `app/hooks/useGraphStore.ts`
   - **Purpose**: Provide typed access to store state
   - **Reference**: Follow Zustand TypeScript patterns

### Expected Outcome:
- Centralized state management system
- Type-safe store access throughout the app

## Step 1.4: Database Integration Setup

### Action Items:
1. **Extend existing API route**:
   - **File**: `app/api/data/route.ts`
   - **Add endpoints**:
     - `/api/data/channels` - Get available channels
     - `/api/data/graph/[channelId]` - Get graph data for channel
     - `/api/data/graph/[channelId]/timerange` - Get data for specific time range

2. **Create database query functions**:
   - **File**: `app/lib/database.ts`
   - **Functions**:
     - `getChannels()` - Query nlp1.channel table
     - `getChannelMessages(channelId, timeRange?)` - Get messages with relationships
     - `getSemanticEdges(channelId, threshold?)` - Get semantic connections

3. **Create data transformation utilities**:
   - **File**: `app/utils/dataTransform.ts`
   - **Purpose**: Transform database results into G6-compatible format
   - **Reference**: Use semantic-tree-visualization-design.md specifications

### Expected Outcome:
- Database integration working with proper error handling
- Data transformation pipeline ready for G6 consumption

## Step 1.5: Basic UI Components

### Action Items:
1. **Create reusable UI components**:
   - **File**: `app/components/ui/Button.tsx`
   - **File**: `app/components/ui/Select.tsx`
   - **File**: `app/components/ui/Loading.tsx`
   - **File**: `app/components/ui/ErrorBoundary.tsx`
   - **Style**: Use Tailwind with consistent design system
   - **Reference**: Keep styles consistent with existing globals.css

2. **Create layout components**:
   - **File**: `app/components/panels/Sidebar.tsx`
   - **File**: `app/components/panels/MainPanel.tsx`
   - **File**: `app/components/panels/TopBar.tsx`

### Expected Outcome:
- Reusable UI component library
- Basic dashboard layout structure

## Step 1.6: Update Root Layout and Home Page

### Action Items:
1. **Update app/layout.tsx**:
   - Add global error boundary
   - Include font imports if needed
   - Set up proper metadata for Vercel deployment

2. **Update app/page.tsx**:
   - Create channel selection landing page
   - Fetch and display available channels
   - Navigate to dashboard on channel selection

### Expected Outcome:
- Landing page with channel selection
- Proper app-wide layout and error handling

## Step 1.7: Environment Configuration

### Action Items:
1. **Create environment variables**:
   - **File**: `.env.local`
   - **Variables**:
     ```
     POSTGRES_HOST=194.110.175.36
     POSTGRES_PORT=5000
     POSTGRES_DB=conversation-intelligence
     POSTGRES_USER=postgres
     POSTGRES_PASSWORD=GSrCfnHCLGbg
     ```

2. **Update next.config.ts**:
   - Add environment variable configuration
   - Ensure Vercel deployment compatibility
   - Add any necessary webpack configurations for G6

### Expected Outcome:
- Secure environment configuration
- Deployment-ready configuration

## Phase 1 Verification Checklist

- [ ] Project structure is clean and organized
- [ ] Zustand store is implemented and typed
- [ ] Database integration is working
- [ ] Basic UI components are created
- [ ] Landing page displays available channels
- [ ] Environment variables are properly configured
- [ ] App can be built without errors (`npm run build`)
- [ ] TypeScript compilation passes without errors

## Next Phase Preview
Phase 2 will focus on implementing the core graph visualization components using G6, starting with the hierarchical tree layout.

## Notes for Implementation
- Keep components simple and focused on single responsibility
- Use TypeScript strictly - no `any` types
- Follow Next.js 13+ app directory conventions
- Ensure all components are server-side compatible where appropriate
- Test database queries thoroughly before proceeding to Phase 2 