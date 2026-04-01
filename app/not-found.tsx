import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col items-center justify-center px-4">
      <div className="text-center max-w-sm">
        <p className="text-xs font-semibold tracking-widest uppercase text-primary mb-6">
          PRODUCT LAB
        </p>
        <p className="text-8xl font-bold text-primary mb-4 leading-none">
          404
        </p>
        <h1 className="text-2xl font-bold text-neutral-900 mb-3">
          Page Not Found
        </h1>
        <p className="text-neutral-500 text-sm mb-8 leading-relaxed">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>

        <Link
          href="/"
          className="inline-block bg-primary text-white px-8 py-3 text-sm font-semibold tracking-wide hover:bg-primary-dark transition-colors"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
