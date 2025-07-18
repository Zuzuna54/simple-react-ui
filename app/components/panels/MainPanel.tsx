'use client';

import React from 'react';
import { clsx } from 'clsx';
import { createLogger } from '@/app/utils/logger';

const logger = createLogger('MainPanel.tsx');

interface MainPanelProps {
  children: React.ReactNode;
  className?: string;
}

export function MainPanel({ children, className }: MainPanelProps) {
  logger.info('MainPanel rendering');

  return (
    <main className={clsx(
      'elevated-card flex-1 overflow-hidden animate-fade-in',
      className
    )} style={{ 
      borderRadius: 'var(--radius-2xl)',
      position: 'relative'
    }}>
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute w-96 h-96 rounded-full opacity-10 animate-blob"
          style={{ 
            background: 'linear-gradient(45deg, var(--primary-500), var(--primary-700))',
            top: '-10%',
            right: '-10%'
          }}
        />
        <div 
          className="absolute w-80 h-80 rounded-full opacity-10 animate-blob animation-delay-400"
          style={{ 
            background: 'linear-gradient(45deg, var(--primary-400), var(--primary-600))',
            bottom: '-10%',
            left: '-10%'
          }}
        />
        <div 
          className="absolute w-72 h-72 rounded-full opacity-10 animate-blob animation-delay-800"
          style={{ 
            background: 'linear-gradient(45deg, var(--primary-300), var(--primary-500))',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)'
          }}
        />
      </div>

      {/* Content area with proper padding */}
      <div className="relative z-10 h-full" style={{ padding: 'var(--space-3xl)' }}>
        {children}
      </div>
    </main>
  );
}

interface EmptyStateProps {
  className?: string;
}

export function EmptyState({ className }: EmptyStateProps) {
  return (
    <div className={clsx(
      'h-full flex items-center justify-center animate-scale-in',
      className
    )}>
      <div className="text-center max-w-2xl">
        <div className="relative mb-12">
          {/* Large conversation icon with purple theme */}
          <div className="w-48 h-48 mx-auto mb-8 relative">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-purple-700/20 rounded-full animate-glow"></div>
            <div className="absolute inset-4 bg-gradient-to-br from-purple-500 to-purple-700 rounded-full flex items-center justify-center shadow-2xl">
              <svg 
                className="w-24 h-24 text-white" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={1} 
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.963 9.963 0 01-3.361-.606L3 21l1.06-4.4C1.845 15.11 3 12.778 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" 
                />
              </svg>
            </div>
            
            {/* Floating decorative elements */}
            <div className="absolute -top-6 -right-6 w-12 h-12 bg-purple-400 rounded-full animate-bounce opacity-80"></div>
            <div className="absolute -bottom-6 -left-6 w-8 h-8 bg-purple-300 rounded-full animate-bounce opacity-80" style={{ animationDelay: '0.5s' }}></div>
            <div className="absolute top-1/2 -right-8 w-6 h-6 bg-purple-200 rounded-full animate-bounce opacity-80" style={{ animationDelay: '1s' }}></div>
          </div>
        </div>
        
        <h2 className="text-display mb-6" style={{ color: 'var(--text-primary)' }}>
          Welcome to Semantic Tree Visualization
        </h2>
        <p className="text-body leading-relaxed mb-12" style={{ color: 'var(--text-secondary)' }}>
          Select a channel from the sidebar to start exploring conversation patterns and semantic relationships. 
          Our advanced visualization will help you discover insights and connections within your data.
        </p>
        
        {/* Feature cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <FeatureCard
            icon={
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            }
            title="Interactive Graphs"
            description="Explore conversation data through beautiful, interactive semantic trees"
            delay={0}
          />
          <FeatureCard
            icon={
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            }
            title="Real-time Analysis"
            description="Get instant insights as your conversation data updates"
            delay={200}
          />
          <FeatureCard
            icon={
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            }
            title="Multi-platform"
            description="Supports Discord, Telegram, Slack, and more communication platforms"
            delay={400}
          />
        </div>
      </div>
    </div>
  );
}

interface NoDataStateProps {
  channelName: string;
  className?: string;
}

export function NoDataState({ channelName, className }: NoDataStateProps) {
  return (
    <div className={clsx(
      'h-full flex items-center justify-center animate-scale-in',
      className
    )}>
      <div className="text-center max-w-lg">
        <div className="relative mb-12">
          <div className="w-32 h-32 mx-auto bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-xl animate-pulse">
            <svg 
              className="w-16 h-16 text-white" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={1.5} 
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
              />
            </svg>
          </div>
        </div>
        
        <h3 className="text-headline mb-4" style={{ color: 'var(--text-primary)' }}>
          No Data Available
        </h3>
        <p className="text-body leading-relaxed mb-8" style={{ color: 'var(--text-secondary)' }}>
          The channel <span className="font-semibold" style={{ color: 'var(--primary-400)' }}>&quot;{channelName}&quot;</span> doesn&apos;t have any conversation data yet, 
          or the data is still being processed.
        </p>
        
        <div className="space-y-4">
          <button 
            className="modern-button modern-button-primary hover-lift"
            onClick={() => window.location.reload()}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh Data
          </button>
          
          <p className="text-caption" style={{ color: 'var(--text-muted)' }}>
            Try refreshing or check back later
          </p>
        </div>
      </div>
    </div>
  );
}

interface LoadingStateProps {
  message?: string;
  className?: string;
}

export function LoadingState({ message = "Loading...", className }: LoadingStateProps) {
  return (
    <div className={clsx(
      'h-full flex items-center justify-center animate-fade-in',
      className
    )}>
      <div className="text-center">
        <div className="relative mb-8">
          {/* Spinning loader with purple theme */}
          <div className="w-20 h-20 mx-auto">
            <div 
              className="w-20 h-20 border-4 border-t-transparent rounded-full animate-spin"
              style={{ 
                borderColor: 'var(--border-secondary)',
                borderTopColor: 'var(--primary-500)'
              }}
            ></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 bg-purple-500 rounded-full animate-pulse"></div>
            </div>
          </div>
          
          {/* Floating dots */}
          <div className="flex justify-center mt-6" style={{ gap: 'var(--space-sm)' }}>
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>
        
        <h3 className="text-title mb-2" style={{ color: 'var(--text-primary)' }}>
          {message}
        </h3>
        <p className="text-caption" style={{ color: 'var(--text-muted)' }}>
          Please wait while we process your data
        </p>
      </div>
    </div>
  );
}

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: number;
}

function FeatureCard({ icon, title, description, delay }: FeatureCardProps) {
  return (
    <div 
      className="glass-card hover-lift group animate-scale-in"
      style={{ 
        padding: 'var(--space-2xl)',
        animationDelay: `${delay}ms`
      }}
    >
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-purple-500 to-purple-700 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
          <div style={{ color: 'white' }}>
            {icon}
          </div>
        </div>
        
        <h3 className="text-title mb-4" style={{ color: 'var(--text-primary)' }}>
          {title}
        </h3>
        <p className="text-body leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          {description}
        </p>
      </div>
    </div>
  );
} 