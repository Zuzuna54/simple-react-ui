'use client';

import React, { useEffect } from 'react';
import { clsx } from 'clsx';
import { TopBar } from './components/panels/TopBar';
import { Sidebar } from './components/panels/Sidebar';
import { MainPanel, EmptyState, NoDataState, LoadingState } from './components/panels/MainPanel';
import { GraphContainer } from './components/GraphContainer';
import { useGraphStore } from './stores/graphStore';
import { createLogger } from './utils/logger';
import type { GraphStore } from './types';

const logger = createLogger('page.tsx');

export default function DashboardPage() {
  const setChannels = useGraphStore((state: GraphStore) => state.setChannels);
  const setLoading = useGraphStore((state: GraphStore) => state.setLoading);
  const setError = useGraphStore((state: GraphStore) => state.setError);

  // Fetch channels on component mount
  useEffect(() => {
    async function fetchChannels() {
      try {
        setLoading(true);
        setError(null);
        
        logger.info('Fetching channels from API');
        const response = await fetch('/api/data/channels');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.error) {
          throw new Error(data.error);
        }
        
        // Convert string IDs back to bigint for internal use
        const channels = data.channels.map((channel: { id: string; name: string; description: string; platform: string }) => ({
          ...channel,
          id: BigInt(channel.id),
        }));
        
        logger.info('Channels fetched successfully', { count: channels.length });
        setChannels(channels);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch channels';
        logger.error('Failed to fetch channels', err);
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    }

    fetchChannels();
  }, [setChannels, setLoading, setError]);

  return (
    <div className="h-screen flex flex-col" style={{ backgroundColor: 'var(--bg-primary)' }}>
      {/* Top navigation bar with better spacing */}
      <TopBar />
      
      {/* Main content area with enhanced spacing */}
      <div className="flex-1 flex overflow-hidden" style={{ gap: 'var(--space-md)' }}>
        {/* Sidebar with better sizing and margins */}
        <Sidebar className="w-96 flex-shrink-0" style={{ margin: 'var(--space-md) 0 var(--space-md) var(--space-md)' }} />
        
        {/* Main content panel with proper margins */}
        <div className="flex-1" style={{ margin: 'var(--space-md) var(--space-md) var(--space-md) 0' }}>
          <MainPanel>
            <GraphVisualizationContent />
          </MainPanel>
        </div>
      </div>
    </div>
  );
}

function GraphVisualizationContent() {
  const currentChannel = useGraphStore((state: GraphStore) => state.currentChannel);
  const channelLoading = useGraphStore((state: GraphStore) => state.ui.isLoading);
  const channelError = useGraphStore((state: GraphStore) => state.ui.error);
  
  // Show loading state for channel fetching
  if (channelLoading) {
    return <LoadingState message="Loading channel data..." />;
  }
  
  // Show error state if there's a channel error
  if (channelError) {
    return <NoDataState channelName={channelError} />;
  }
  
  // Show empty state if no channel is selected
  if (!currentChannel) {
    return <EmptyState />;
  }
  
  // Show graph when channel is selected
  return <GraphContainer channel={currentChannel} />;
}
