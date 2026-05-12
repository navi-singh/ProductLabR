import getPostMetadata from '@/components/getPostMetadata';

export function TrustBar() {
  const count = getPostMetadata().length;
  const signals = [
    `${count} products tested`,
    'Real-world conditions',
    'No sponsored reviews',
    `Updated ${new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}`,
  ];

  return (
    <div className="bg-primary-dark px-4 py-1.5 sm:px-6">
      <div className="mx-auto flex max-w-content items-center gap-4 overflow-x-auto">
        {signals.map((signal) => (
          <span key={signal} className="type-label flex flex-shrink-0 items-center gap-1.5 text-white/85">
            <span className="text-success">✓</span>
            {signal}
          </span>
        ))}
      </div>
    </div>
  );
}
