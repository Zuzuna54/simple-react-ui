'use client';

import React from 'react';
import { Button } from './Button';
import { createLogger } from '@/app/utils/logger';

const logger = createLogger('ErrorBoundary.tsx');

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error?: Error; resetError: () => void }>;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    logger.error('ErrorBoundary caught an error', error);
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    logger.error('ErrorBoundary componentDidCatch', { error, errorInfo });
  }

  resetError = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return <FallbackComponent error={this.state.error} resetError={this.resetError} />;
      }

      return <DefaultErrorFallback error={this.state.error} resetError={this.resetError} />;
    }

    return this.props.children;
  }
}

function DefaultErrorFallback({ error, resetError }: { error?: Error; resetError: () => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6">
        <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
          <svg 
            className="w-6 h-6 text-red-600" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-gray-900 text-center mb-2">
          Something went wrong
        </h2>
        <p className="text-gray-600 text-center mb-4">
          An error occurred while rendering this component. Please try refreshing the page or contact support if the problem persists.
        </p>
        {error && process.env.NODE_ENV === 'development' && (
          <div className="mb-4 p-3 bg-gray-100 rounded text-sm">
            <p className="font-mono text-red-600">{error.message}</p>
          </div>
        )}
        <div className="flex space-x-3">
          <Button 
            onClick={resetError} 
            variant="primary" 
            className="flex-1"
          >
            Try Again
          </Button>
          <Button 
            onClick={() => window.location.reload()} 
            variant="outline" 
            className="flex-1"
          >
            Refresh Page
          </Button>
        </div>
      </div>
    </div>
  );
} 