'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col items-center justify-center px-4">
      <div className="text-center max-w-sm">
        <p className="text-xs font-semibold tracking-widest uppercase text-primary mb-6">
          PRODUCT LAB
        </p>
        <h1 className="text-2xl font-bold text-neutral-900 mb-3">
          Something went wrong
        </h1>
        <p className="text-neutral-500 text-sm mb-8 leading-relaxed">
          An unexpected error occurred. Please try again or return to the homepage.
        </p>

        <div className="flex flex-col gap-3">
          <button
            onClick={reset}
            className="w-full bg-primary text-white px-6 py-3 text-sm font-semibold tracking-wide hover:bg-primary-dark transition-colors"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="w-full border border-neutral-200 text-neutral-700 px-6 py-3 text-sm font-semibold tracking-wide hover:border-neutral-300 hover:bg-neutral-100 transition-colors block"
          >
            Return Home
          </Link>
        </div>

        {error.digest && (
          <p className="mt-8 text-xs text-neutral-300 font-mono">
            {error.digest}
          </p>
        )}
      </div>
    </div>
  );
}
