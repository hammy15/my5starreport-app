'use client';

/**
 * Error Boundary Component
 *
 * React error boundary for catching and displaying errors gracefully.
 * Matches the neumorphic design system with cyan accents.
 */

import React, { Component, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home, ChevronDown, ChevronUp } from 'lucide-react';

// ============================================================================
// Types
// ============================================================================

export interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary?: () => void;
  showDetails?: boolean;
}

export interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode | ((props: ErrorFallbackProps) => ReactNode);
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  onReset?: () => void;
  showDetails?: boolean;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

// ============================================================================
// Error Fallback Component (Standalone)
// ============================================================================

export function ErrorFallback({
  error,
  resetErrorBoundary,
  showDetails = process.env.NODE_ENV === 'development'
}: ErrorFallbackProps) {
  const [detailsExpanded, setDetailsExpanded] = React.useState(false);

  const handleRefresh = () => {
    if (resetErrorBoundary) {
      resetErrorBoundary();
    } else {
      window.location.reload();
    }
  };

  const handleGoHome = () => {
    window.location.href = '/';
  };

  return (
    <div className="min-h-[400px] flex items-center justify-center p-6">
      <div
        className="card-neumorphic max-w-lg w-full p-8 text-center"
        role="alert"
        aria-live="assertive"
      >
        {/* Error Icon */}
        <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center mb-6 shadow-lg">
          <AlertTriangle className="w-8 h-8 text-white" aria-hidden="true" />
        </div>

        {/* Error Message */}
        <h2 className="text-2xl font-bold text-[var(--foreground)] mb-2">
          Something went wrong
        </h2>
        <p className="text-[var(--foreground-muted)] mb-6">
          We encountered an unexpected error. Please try refreshing the page or return to the home page.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
          <button
            onClick={handleRefresh}
            className="btn-neumorphic-primary inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-white transition-all hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[var(--primary-400)] focus:ring-offset-2"
          >
            <RefreshCw className="w-4 h-4" aria-hidden="true" />
            Try Again
          </button>
          <button
            onClick={handleGoHome}
            className="btn-neumorphic inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[var(--primary-400)] focus:ring-offset-2"
          >
            <Home className="w-4 h-4" aria-hidden="true" />
            Go Home
          </button>
        </div>

        {/* Error Details (Dev Mode) */}
        {showDetails && error && (
          <div className="mt-4">
            <button
              onClick={() => setDetailsExpanded(!detailsExpanded)}
              className="inline-flex items-center gap-2 text-sm text-[var(--foreground-muted)] hover:text-[var(--primary-500)] transition-colors"
              aria-expanded={detailsExpanded}
            >
              {detailsExpanded ? (
                <>
                  <ChevronUp className="w-4 h-4" aria-hidden="true" />
                  Hide Error Details
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4" aria-hidden="true" />
                  Show Error Details
                </>
              )}
            </button>

            {detailsExpanded && (
              <div className="mt-4 p-4 card-neumorphic-inset text-left overflow-auto max-h-64">
                <p className="text-sm font-mono text-red-500 dark:text-red-400 mb-2">
                  {error.name}: {error.message}
                </p>
                {error.stack && (
                  <pre className="text-xs font-mono text-[var(--foreground-muted)] whitespace-pre-wrap break-words">
                    {error.stack}
                  </pre>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// Error Boundary Class Component
// ============================================================================

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('ErrorBoundary caught an error:', error);
      console.error('Component stack:', errorInfo.componentStack);
    }

    // Call the onError callback if provided
    this.props.onError?.(error, errorInfo);
  }

  resetErrorBoundary = (): void => {
    this.props.onReset?.();
    this.setState({ hasError: false, error: null });
  };

  render(): ReactNode {
    const { hasError, error } = this.state;
    const { children, fallback, showDetails } = this.props;

    if (hasError && error) {
      // If fallback is a function, call it with error props
      if (typeof fallback === 'function') {
        return fallback({
          error,
          resetErrorBoundary: this.resetErrorBoundary,
          showDetails,
        });
      }

      // If fallback is a ReactNode, render it
      if (fallback) {
        return fallback;
      }

      // Default fallback UI
      return (
        <ErrorFallback
          error={error}
          resetErrorBoundary={this.resetErrorBoundary}
          showDetails={showDetails}
        />
      );
    }

    return children;
  }
}

export default ErrorBoundary;
