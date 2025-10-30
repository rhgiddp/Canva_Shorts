/**
 * Global error page for Next.js App Router
 */

'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { errorLogger } from '@/lib/error-handler';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to error logger
    errorLogger.log(error, { digest: error.digest });
  }, [error]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-xl shadow-lg p-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Oops! Something went wrong
            </h1>
            <p className="text-gray-600 mt-1">
              We&apos;re sorry for the inconvenience
            </p>
          </div>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-red-800 font-medium">
            {error.message || 'An unexpected error occurred'}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={reset}
            className="flex-1 py-3 px-6 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
          >
            <RefreshCw className="w-5 h-5" />
            Try Again
          </button>

          <Link
            href="/"
            className="flex-1 py-3 px-6 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
          >
            <Home className="w-5 h-5" />
            Go Home
          </Link>
        </div>

        {process.env.NODE_ENV === 'development' && (
          <details className="mt-6">
            <summary className="text-sm text-gray-600 cursor-pointer hover:text-gray-800">
              Error Details (Development Only)
            </summary>
            <div className="mt-3 bg-gray-100 rounded p-4 overflow-auto max-h-64">
              <pre className="text-xs text-gray-700 whitespace-pre-wrap">
                {error.stack}
              </pre>
              {error.digest && (
                <p className="text-xs text-gray-500 mt-2">
                  Error Digest: {error.digest}
                </p>
              )}
            </div>
          </details>
        )}
      </div>
    </div>
  );
}
