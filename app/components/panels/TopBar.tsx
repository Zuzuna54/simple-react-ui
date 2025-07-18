'use client';

import React from 'react';
import { clsx } from 'clsx';
import { useGraphStats, useAvailableAuthors } from '@/app/hooks/useGraphStore';
import { createLogger } from '@/app/utils/logger';

const logger = createLogger('TopBar.tsx');

interface TopBarProps {
  className?: string;
}

export function TopBar({ className }: TopBarProps) {
  const stats = useGraphStats();
  const availableAuthors = useAvailableAuthors();

  logger.info('TopBar rendering', { stats, authorCount: availableAuthors.length });

  return (
    <header className={clsx(
      'elevated-card sticky top-0 z-50 animate-slide-in',
      className
    )} style={{ 
      borderRadius: 'var(--radius-2xl)', 
      margin: 'var(--space-md)', 
      marginBottom: 0 
    }}>
      <div className="flex items-center justify-between" style={{ padding: 'var(--space-2xl)' }}>
        {/* Left Section - Logo & Title with enhanced spacing */}
        <div className="flex items-center" style={{ gap: 'var(--space-2xl)' }}>
          <div className="flex items-center" style={{ gap: 'var(--space-lg)' }}>
            {/* Modern Logo with purple theme */}
            <div className="relative">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-700 rounded-2xl flex items-center justify-center shadow-lg hover-scale animate-glow">
                <svg 
                  className="w-8 h-8 text-white" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M13 10V3L4 14h7v7l9-11h-7z" 
                  />
                </svg>
              </div>
              {/* Pulse indicator for real-time data */}
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full animate-pulse shadow-lg"></div>
            </div>
            
            <div>
              <h1 className="text-title" style={{ color: 'var(--text-primary)', marginBottom: 'var(--space-xs)' }}>
                Semantic Tree Visualization
              </h1>
              <p className="text-caption" style={{ color: 'var(--text-muted)' }}>
                Conversation Intelligence Dashboard
              </p>
            </div>
          </div>
        </div>

        {/* Center Section - Quick Stats with better spacing */}
        <div className="hidden md:flex items-center" style={{ gap: 'var(--space-2xl)' }}>
          <StatCard
            label="Total Messages"
            value={stats.messageCount}
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.963 9.963 0 01-3.361-.606L3 21l1.06-4.4C1.845 15.11 3 12.778 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            }
            gradient="from-purple-500 to-purple-600"
          />
          <StatCard
            label="Connections"
            value={stats.edgeCount}
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
            }
            gradient="from-purple-400 to-purple-500"
          />
          <StatCard
            label="Authors"
            value={availableAuthors.length}
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            }
            gradient="from-purple-300 to-purple-400"
          />
        </div>

        {/* Right Section - Action Buttons with enhanced spacing */}
        <div className="flex items-center" style={{ gap: 'var(--space-lg)' }}>
          
          <button 
            className="modern-button modern-button-primary hover-lift"
            title="Refresh data"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
        </div>
      </div>
    </header>
  );
}

interface StatCardProps {
  label: string;
  value: number;
  icon: React.ReactNode;
  gradient: string;
}

function StatCard({ label, value, icon, gradient }: StatCardProps) {
  return (
    <div 
      className="glass-card hover-lift group cursor-pointer transition-all duration-300"
      style={{ 
        padding: 'var(--space-xl)',
        minWidth: '140px'
      }}
    >
      <div className="flex items-center" style={{ gap: 'var(--space-md)' }}>
        <div className={clsx(
          'w-12 h-12 rounded-xl flex items-center justify-center shadow-md transition-all duration-300 group-hover:scale-110',
          `bg-gradient-to-br ${gradient}`
        )}>
          <div style={{ color: 'white' }}>
            {icon}
          </div>
        </div>
        
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <span 
              className="text-caption font-medium"
              style={{ color: 'var(--text-muted)' }}
            >
              {label}
            </span>
          </div>
          <div className="flex items-baseline" style={{ gap: 'var(--space-xs)' }}>
            <span 
              className="text-2xl font-bold transition-colors duration-300 group-hover:text-purple-400"
              style={{ color: 'var(--text-primary)' }}
            >
              {value.toLocaleString()}
            </span>
            {/* Trending indicator */}
            <div className="flex items-center" style={{ gap: 'var(--space-xs)' }}>
              <svg 
                className="w-3 h-3 text-green-400" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              <span 
                className="text-xs font-medium text-green-400"
              >
                Live
              </span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Subtle bottom border for depth */}
      <div 
        className="mt-3 h-1 rounded-full transition-all duration-300"
        style={{ 
          background: `linear-gradient(90deg, ${gradient.includes('purple-500') ? 'var(--primary-500)' : 'var(--primary-400)'}, transparent)`,
          transform: 'scaleX(0)',
          transformOrigin: 'left'
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'scaleX(1)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'scaleX(0)'}
      />
    </div>
  );
} 