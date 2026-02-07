import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface ErrorFallbackProps {
  error: Error | null;
  onReset?: () => void;
}

export default function ErrorFallback({ error, onReset }: ErrorFallbackProps) {
  return (
    <div className="flex items-center justify-center min-h-[400px] w-full p-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-8 text-center">
        <div className="flex justify-center mb-4">
          <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-full">
            <AlertTriangle className="w-8 h-8 text-red-500 dark:text-red-400" />
          </div>
        </div>

        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
          Something went wrong
        </h2>

        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          An unexpected error occurred. You can try again or navigate back to the dashboard.
        </p>

        {error?.message && (
          <div className="mb-6 p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-700">
            <p className="text-xs text-gray-600 dark:text-gray-400 font-mono break-words line-clamp-3">
              {error.message}
            </p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {onReset && (
            <button
              onClick={onReset}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 dark:bg-indigo-500 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </button>
          )}

          <a
            href="/"
            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            <Home className="w-4 h-4" />
            Go to Dashboard
          </a>
        </div>
      </div>
    </div>
  );
}
