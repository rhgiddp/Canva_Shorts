/**
 * Error boundary component for catching React errors
 */

'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('[ErrorBoundary] Caught error:', error, errorInfo);

    this.setState({
      error,
      errorInfo,
    });

    // Log error to external service (e.g., Sentry)
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
      // Example: Sentry.captureException(error, { extra: errorInfo });
    }
  }

  handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4">
          <div className="max-w-2xl w-full bg-gray-800 rounded-lg shadow-xl p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-red-400">
                  Something went wrong
                </h1>
                <p className="text-gray-400 mt-1">
                  We encountered an unexpected error
                </p>
              </div>
            </div>

            {this.state.error && (
              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-2 text-gray-300">
                  Error Details:
                </h2>
                <div className="bg-gray-900 rounded p-4 overflow-auto max-h-64">
                  <pre className="text-red-400 text-sm whitespace-pre-wrap">
                    {this.state.error.toString()}
                  </pre>
                  {process.env.NODE_ENV === 'development' &&
                    this.state.errorInfo && (
                      <pre className="text-gray-500 text-xs mt-4 whitespace-pre-wrap">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    )}
                </div>
              </div>
            )}

            <div className="flex gap-4">
              <button
                onClick={this.handleReset}
                className="flex-1 py-3 px-6 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
              >
                <RefreshCw className="w-5 h-5" />
                Try Again
              </button>

              <button
                onClick={() => (window.location.href = '/')}
                className="flex-1 py-3 px-6 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium transition-colors"
              >
                Go Home
              </button>
            </div>

            {process.env.NODE_ENV === 'development' && (
              <div className="mt-6 text-sm text-gray-500">
                <p>
                  This error was caught by the ErrorBoundary component in
                  development mode.
                </p>
              </div>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Higher-order component for wrapping components with error boundary
 */
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  fallback?: ReactNode
): React.FC<P> {
  return function WithErrorBoundary(props: P) {
    return (
      <ErrorBoundary fallback={fallback}>
        <Component {...props} />
      </ErrorBoundary>
    );
  };
}
