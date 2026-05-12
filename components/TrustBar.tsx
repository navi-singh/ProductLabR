import getPostMetadata from '@/components/getPostMetadata';

export function TrustBar() {
  const posts = getPostMetadata();
  const count = posts.length;

  const latestDate = posts[0]?.date
    ? new Date(posts[0].date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    : null;

  const signals = [
    `${count} products tested`,
    'Real-world conditions',
    'No sponsored reviews',
    ...(latestDate ? [`Reviewed through ${latestDate}`] : []),
  ];

  return (
    <div className="bg-primary-dark px-4 py-1.5 sm:px-6" role="region" aria-label="Trust signals">
      <div className="mx-auto flex max-w-content items-center gap-4 overflow-x-auto">
        {signals.map((signal) => (
          <span key={signal} className="type-label flex flex-shrink-0 items-center gap-1.5 text-white/85">
            <span className="text-success" aria-hidden="true">✓</span>
            {signal}
          </span>
        ))}
      </div>
    </div>
  );
}
