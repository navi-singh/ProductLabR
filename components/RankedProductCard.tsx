// components/RankedProductCard.tsx
import Link from 'next/link';
import { OptimizedImage } from './OptimizedImage';
import { ScoreBadge } from './ScoreBadge';
import { AwardBadge } from './AwardBadge';

interface RankedProductCardProps {
  rank: number;
  name: string;
  href: string;
  image: string;
  summary: string;
  score: number;
  badge?: 'best-overall' | 'best-value' | 'budget-pick';
  buyUrl?: string;  // retained for future "Check Price" wiring — not rendered yet
  specs?: Record<string, string>;
}

export function RankedProductCard({
  rank, name, href, image, summary, score, badge, buyUrl: _buyUrl, specs,
}: RankedProductCardProps) {
  const isTopRanked = rank === 1;

  return (
    <div
      data-testid="ranked-card"
      className={[
        'group relative isolate rounded-xl border border-neutral-200 p-5 cursor-pointer',
        'transition-all duration-200 ease-out',
        'hover:-translate-y-1 hover:shadow-xl hover:shadow-neutral-200/80',
        'focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2',
        isTopRanked
          ? 'state-layer-light border-l-4 border-l-accent bg-amber-50/30'
          : 'state-layer bg-white',
      ].join(' ')}
    >
      {/* Stretched link. Sits ABOVE the content layer so every pixel of the card
          routes to the review. Previously this was z-0, which put it in the same
          paint layer as positioned siblings: the image wrapper (relative) and the
          "Read Review" CTA (z-10) both painted over it and swallowed the click. */}
      <Link href={href} className="absolute inset-0 z-10 rounded-xl" aria-label={`Read ${name} review`} />

      {/* Content layer. position+z-index makes this its own stacking context, so
          no descendant can raise itself above the stretched link, whatever
          z-index it uses. Anything that must be independently clickable (a future
          "Check Price" affiliate link) has to be a sibling of this div with a
          higher z-index, not a child of it. */}
      <div className="relative z-0">
        <div className="flex flex-col gap-5 sm:flex-row">
          <div data-testid="ranked-card-media" className="relative h-36 w-full flex-shrink-0 overflow-hidden rounded-lg bg-gradient-to-br from-primary-lightest to-primary-light/30 sm:w-44">
            <OptimizedImage src={image} alt={name} fill sizes="180px" className="object-contain p-2" />
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-2">
              {badge && <AwardBadge type={badge} />}
              <span className="type-label text-neutral-400">#{rank}</span>
            </div>

            <h3 className="type-title mt-1 text-neutral-900">{name}</h3>
            <p data-testid="ranked-card-summary" className="type-body mt-1.5 text-neutral-500">{summary}</p>

            <div className="mt-3 flex items-center gap-3">
              <div data-testid="ranked-card-score" className="flex">
                <ScoreBadge score={score} size="lg" showLabel />
              </div>
              <span data-testid="ranked-card-cta" className="type-label text-primary group-hover:text-primary-dark">
                Read Review →
              </span>
            </div>
          </div>
        </div>

        {specs && Object.keys(specs).length > 0 && (
          <div data-testid="ranked-card-specs" className="mt-3.5 flex flex-wrap gap-4 border-t border-neutral-100 pt-3.5">
            {Object.entries(specs).slice(0, 5).map(([key, value]) => (
              <span key={key} className="type-label text-neutral-400">
                {key}: <strong className="font-semibold text-neutral-700">{value}</strong>
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
