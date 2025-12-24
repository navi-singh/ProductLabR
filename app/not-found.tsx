import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="mb-8">
          <div className="w-24 h-24 mx-auto mb-6 bg-purple-100 rounded-full flex items-center justify-center">
            <svg
              className="w-12 h-12 text-purple-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            Page Not Found
          </h2>
          <p className="text-gray-600 mb-8">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
        </div>

        <div className="space-y-4">
          <Link
            href="/"
            className="block w-full bg-purple-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-purple-600 transition-colors shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            Go Home
          </Link>
          <Link
            href="/best"
            className="block w-full bg-gray-100 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
          >
            Browse Best Products
          </Link>
        </div>

        <div className="mt-8">
          <p className="text-sm text-gray-500 mb-4">
            Looking for something specific? Try these popular sections:
          </p>
          <div className="flex flex-wrap gap-2 justify-center">
            <Link
              href="/best/power-stations"
              className="text-xs bg-trustworthy/10 text-trustworthy px-3 py-1 rounded-full hover:bg-trustworthy/20 transition-colors"
            >
              Power Stations
            </Link>
            <Link
              href="/best/cameras"
              className="text-xs bg-purple-100 text-purple-600 px-3 py-1 rounded-full hover:bg-purple-200 transition-colors"
            >
              Cameras
            </Link>
            <Link
              href="/best/knives-tools"
              className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full hover:bg-gray-200 transition-colors"
            >
              Tools & Knives
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
