'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-md w-full px-6 py-12">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-primary mb-4">!</h1>
          <h2 className="text-2xl font-semibold text-foreground mb-4">
            Something went wrong!
          </h2>
          <p className="text-muted-foreground mb-8">
            We encountered an unexpected error. Please try again.
          </p>
          {error?.digest && (
            <p className="text-xs text-muted-foreground mb-4 font-mono">
              Error ID: {error.digest}
            </p>
          )}
          <button
            onClick={reset}
            className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Try again
          </button>
        </div>
      </div>
    </div>
  );
}
