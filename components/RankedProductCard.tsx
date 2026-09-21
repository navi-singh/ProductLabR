// components/RankedProductCard.tsx
import Link from 'next/link';
import { OptimizedImage } from './OptimizedImage';
import { ScoreBadge } from './ScoreBadge';
import { AwardBadge } from './AwardBadge';

interface RankedProductCardProps {
  rank: number;
  name: string;
  href: string;
  image?: string;
  summary: string;
  score: number;
  price?: string;
  badge?: 'best-overall' | 'best-value' | 'budget-pick';
  buyUrl?: string;
  specs?: Record<string, string>;
}

export function RankedProductCard({
  rank,
  name,
  href,
  image,
  summary,
  score,
  price,
  badge,
  buyUrl,
  specs,
}: RankedProductCardProps) {
  const isTopRanked = rank === 1;
  const visibleSpecs = specs ? Object.entries(specs).slice(0, 5) : [];

  return (
    <article
      id={`rank-${rank}`}
      data-testid="ranked-card"
      className={[
        'group relative isolate overflow-hidden rounded-xl border bg-white p-5 shadow-featured',
        'transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-card-hover',
        'focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2',
        isTopRanked ? 'border-l-4 border-neutral-200 border-l-accent' : 'border-neutral-200',
      ].join(' ')}
    >
      <div className="flex flex-col gap-5 md:flex-row md:items-start">
        {image && (
          <Link
            href={href}
            className="relative h-48 w-full flex-shrink-0 overflow-hidden rounded-lg bg-primary-lightest md:w-56"
          >
            <OptimizedImage
              src={image}
              alt={name}
              fill
              sizes="224px"
              className="object-contain p-3 transition-transform duration-500 group-hover:scale-105"
            />
            {visibleSpecs[0] && (
              <span className="absolute bottom-2 left-2 rounded bg-primary/85 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-white backdrop-blur-sm">
                {visibleSpecs[0][1]}
              </span>
            )}
          </Link>
        )}

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                {badge && <AwardBadge type={badge} />}
                <span className="rounded bg-primary-lightest px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.08em] text-primary">
                  #{rank} ranked pick
                </span>
              </div>
              <h3 className="mt-2 font-display text-2xl font-semibold leading-tight tracking-tight text-neutral-900">
                {name}
              </h3>
            </div>
            <div className="flex items-center gap-3 rounded-lg bg-neutral-100 px-3 py-2">
              <div className="text-right">
                <div className="type-label text-accent">Lab Verdict</div>
                <div className="text-xs font-semibold text-neutral-600">
                  {score >= 9 ? 'Excellent' : score >= 8 ? 'Great' : 'Good'}
                </div>
              </div>
              <ScoreBadge score={score} size="md" />
            </div>
          </div>

          <p
            data-testid="ranked-card-summary"
            className="mt-3 text-sm leading-relaxed text-neutral-600"
          >
            {summary}
          </p>

          {visibleSpecs.length > 0 && (
            <div
              data-testid="ranked-card-specs"
              className="mt-4 grid grid-cols-2 gap-2 lg:grid-cols-3"
            >
              {visibleSpecs.map(([key, value]) => (
                <div key={key} className="rounded-lg bg-neutral-50 p-2.5">
                  <span className="block text-[10px] font-bold uppercase tracking-[0.08em] text-neutral-500">
                    {key}
                  </span>
                  <span className="mt-0.5 block text-xs font-semibold text-neutral-900">
                    {value}
                  </span>
                </div>
              ))}
            </div>
          )}

          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-neutral-200 pt-4">
            <div className="text-sm text-neutral-500">
              {price ? (
                <>
                  Street price: <strong className="text-lg text-neutral-900">{price}</strong>
                </>
              ) : (
                <span>Full scoring and trade-offs in the review</span>
              )}
            </div>
            <div className="flex gap-2">
              <Link
                href={href}
                data-testid="ranked-card-cta"
                className="inline-flex h-10 items-center justify-center rounded-lg bg-primary-lightest px-4 text-xs font-bold text-primary hover:bg-primary-light"
              >
                Read Review →
              </Link>
              {buyUrl && (
                <a
                  href={buyUrl}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  className="inline-flex h-10 items-center justify-center rounded-lg bg-accent px-4 text-xs font-bold text-white hover:bg-accent/90"
                >
                  Check Price
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
