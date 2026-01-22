import React from 'react';
import { Button } from './ui/button';
import { useAuth } from '../contexts/AuthContext';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error | null;
}

export class ErrorBoundary extends React.Component<React.PropsWithChildren<{}>, ErrorBoundaryState> {
  constructor(props: React.PropsWithChildren<{}>) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: any) {
    console.error('Unhandled render error caught by ErrorBoundary:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-8">
          <h2 className="text-xl font-bold">Something went wrong while rendering this view.</h2>
          <p className="mt-2 text-sm text-gray-500">We logged the error to the console for debugging.</p>
          <div className="mt-4 flex gap-2">
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 rounded bg-blue-600 text-white"
            >
              Reload Page
            </button>
            <button
              onClick={() => {
                try {
                  // Try to clear local auth state if available
                  localStorage.removeItem('token');
                  localStorage.removeItem('user');
                } catch (e) {}
                window.location.href = '/';
              }}
              className="px-4 py-2 rounded border border-gray-300"
            >
              Go Home
            </button>
          </div>
          <details className="mt-4 bg-gray-100 p-3 rounded text-xs">
            <summary className="cursor-pointer">View error details</summary>
            <pre className="mt-2 whitespace-pre-wrap">{String(this.state.error)}</pre>
          </details>
        </div>
      );
    }

    return this.props.children as React.ReactElement;
  }
}
