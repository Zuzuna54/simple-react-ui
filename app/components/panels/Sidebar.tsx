'use client';

import React from 'react';
import { clsx } from 'clsx';
import { Loading } from '../ui/Loading';
import { useChannels, useCurrentChannel, useIsLoading, useError } from '@/app/hooks/useGraphStore';
import { useGraphStore } from '@/app/stores/graphStore';
import type { Channel, GraphStore } from '@/app/types';
import { createLogger } from '@/app/utils/logger';

const logger = createLogger('Sidebar.tsx');

interface SidebarProps {
  className?: string;
  style?: React.CSSProperties;
}

export function Sidebar({ className, style }: SidebarProps) {
  const channels = useChannels();
  const currentChannel = useCurrentChannel();
  const isLoading = useIsLoading();
  const error = useError();
  const setCurrentChannel = useGraphStore((state: GraphStore) => state.setCurrentChannel);

  const handleChannelSelect = (channel: Channel) => {
    logger.info('Channel selected', { channelId: channel.id.toString(), channelName: channel.name });
    setCurrentChannel(channel);
  };

  return (
    <aside 
      className={clsx(
        'elevated-card flex flex-col overflow-hidden animate-slide-in',
        className
      )}
      style={{ 
        borderRadius: 'var(--radius-2xl)',
        ...style 
      }}
    >
      {/* Header with enhanced spacing */}
      <div style={{ 
        padding: 'var(--space-2xl)', 
        borderBottom: '1px solid var(--border-primary)'
      }}>
        <div className="flex items-center mb-6" style={{ gap: 'var(--space-lg)' }}>
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-700 rounded-xl flex items-center justify-center shadow-lg hover-scale">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <div>
            <h2 className="text-title" style={{ color: 'var(--text-primary)', marginBottom: 'var(--space-xs)' }}>
              Channels
            </h2>
            {/* <p className="text-caption" style={{ color: 'var(--text-muted)' }}>
              Select a conversation
            </p> */}
          </div>
        </div>
        
        {/* Enhanced Search Bar
        <div className="relative">
          <input
            type="text"
            placeholder="Search channels..."
            className="dark-input w-full pl-12"
            style={{ 
              padding: 'var(--space-lg) var(--space-lg) var(--space-lg) 3rem',
              fontSize: '0.875rem'
            }}
          />

        </div> */}
      </div>

      {/* Content with better spacing */}
      <div className="flex-1 overflow-y-auto" style={{ padding: 'var(--space-xl)' }}>
        {isLoading && (
          <div className="space-y-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="skeleton h-20 rounded-xl"></div>
            ))}
          </div>
        )}

        {error && (
          <div 
            className="rounded-xl border" 
            style={{ 
              padding: 'var(--space-xl)',
              backgroundColor: 'var(--error-bg)',
              borderColor: 'var(--error-border)',
              color: 'var(--error-text)'
            }}
          >
            <div className="flex items-center" style={{ gap: 'var(--space-md)' }}>
              <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h3 className="font-semibold text-sm">Error loading channels</h3>
                <p className="text-xs mt-1 opacity-90">{error}</p>
              </div>
            </div>
          </div>
        )}

        {!isLoading && !error && (
          <div className="space-y-4">
            {channels.length === 0 && (
              <div 
                className="text-center rounded-xl border-2 border-dashed" 
                style={{ 
                  padding: 'var(--space-3xl)',
                  borderColor: 'var(--border-secondary)',
                  color: 'var(--text-muted)'
                }}
              >
                <svg className="w-12 h-12 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                <p className="text-sm font-medium">No channels available</p>
                <p className="text-xs mt-1">Check your connection or try refreshing</p>
              </div>
            )}

            {channels.map((channel, index) => (
              <ChannelCard
                key={channel.id.toString()}
                channel={channel}
                isSelected={currentChannel?.id === channel.id}
                onClick={() => handleChannelSelect(channel)}
                animationDelay={index * 100}
              />
            ))}
          </div>
        )}
      </div>

      {/* Footer with connection status */}
      <div 
        style={{ 
          padding: 'var(--space-xl)',
          borderTop: '1px solid var(--border-primary)',
          backgroundColor: 'var(--bg-secondary)'
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center" style={{ gap: 'var(--space-md)' }}>
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-caption" style={{ color: 'var(--text-muted)' }}>
              {channels.length} channel{channels.length !== 1 ? 's' : ''} available
            </span>
          </div>
          <div className="status-indicator status-success">
            Connected
          </div>
        </div>
      </div>
    </aside>
  );
}

interface ChannelCardProps {
  channel: Channel;
  isSelected: boolean;
  onClick: () => void;
  animationDelay: number;
}

function ChannelCard({ channel, isSelected, onClick, animationDelay }: ChannelCardProps) {
  const getPlatformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'telegram':
        return (
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.13-.31-1.09-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/>
            </svg>
          </div>
        );
      case 'discord':
        return (
          <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
            </svg>
          </div>
        );
      case 'slack':
        return (
          <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zM15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z"/>
            </svg>
          </div>
        );
      default:
        return (
          <div className="w-8 h-8 bg-gray-500 rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.963 9.963 0 01-3.361-.606L3 21l1.06-4.4C1.845 15.11 3 12.778 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
        );
    }
  };

  return (
    <button
      onClick={onClick}
      className={clsx(
        'w-full text-left rounded-xl transition-all duration-300 hover-glow group',
        'animate-scale-in',
        isSelected ? 'ring-2' : ''
      )}
             style={{
         padding: 'var(--space-xl)',
         backgroundColor: isSelected ? 'var(--bg-tertiary)' : 'var(--bg-secondary)',
         border: '1px solid',
         borderColor: isSelected ? 'var(--primary-500)' : 'var(--border-primary)',
         animationDelay: `${animationDelay}ms`,
         boxShadow: isSelected ? '0 0 0 2px var(--primary-500)' : undefined
       }}
    >
      <div className="flex items-start" style={{ gap: 'var(--space-lg)' }}>
        <div className="flex-shrink-0">
          {getPlatformIcon(channel.platform)}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <h3 
              className="font-semibold text-sm truncate group-hover:text-purple-400 transition-colors"
              style={{ color: isSelected ? 'var(--primary-400)' : 'var(--text-primary)' }}
            >
              {channel.name}
            </h3>
            <span 
              className="text-xs font-medium px-2 py-1 rounded-md"
              style={{ 
                backgroundColor: 'var(--bg-primary)',
                color: 'var(--text-muted)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}
            >
              {channel.platform}
            </span>
          </div>
          
          {channel.description && (
            <p 
              className="text-xs leading-relaxed line-clamp-2"
              style={{ color: 'var(--text-muted)' }}
            >
              {channel.description}
            </p>
          )}
          
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center" style={{ gap: 'var(--space-xs)' }}>
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                Active
              </span>
            </div>
            
            {isSelected && (
              <div className="flex items-center" style={{ gap: 'var(--space-xs)' }}>
                <svg className="w-4 h-4" style={{ color: 'var(--primary-400)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-xs font-medium" style={{ color: 'var(--primary-400)' }}>
                  Selected
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </button>
  );
} 