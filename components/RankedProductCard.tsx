import Link from 'next/link';
import { ExternalLink, ArrowRight } from 'lucide-react';
import { isSafeUrl } from '@/lib/utils';
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
  price: string;
  badge?: 'best-overall' | 'best-value' | 'budget-pick';
  buyUrl?: string;
  buyLabel?: string;
  specs?: Record<string, string>;
}

export function RankedProductCard({
  rank, name, href, image, summary, score, price, badge, buyUrl, buyLabel = 'Buy at Amazon', specs,
}: RankedProductCardProps) {
  const isTopRanked = rank === 1;

  return (
    <div
      className={`
        group relative rounded-xl border border-neutral-200 p-5 cursor-pointer
        transition-all duration-200 ease-out
        hover:-translate-y-1 hover:shadow-xl hover:shadow-neutral-200/80
        hover:border-neutral-300
        ${isTopRanked ? 'border-l-4 border-l-accent bg-amber-50/30' : 'bg-white'}
      `}
    >
      {/* Stretched link — makes the whole card clickable */}
      <Link href={href} className="absolute inset-0 z-0 rounded-xl" aria-label={`Read ${name} review`} />

      {/* Hover accent bar — slides in from left */}
      {!isTopRanked && (
        <div className="absolute left-0 top-0 h-full w-0.5 rounded-l-xl bg-accent opacity-0 transition-all duration-200 group-hover:opacity-100" />
      )}

      <div className="flex flex-col gap-5 sm:flex-row">
        {/* Image container — zooms on hover */}
        <div className="relative h-36 w-full flex-shrink-0 overflow-hidden rounded-lg bg-gradient-to-br from-primary-lightest to-primary-light/30 sm:w-44">
          <div className="h-full w-full transition-transform duration-300 ease-out group-hover:scale-110">
            <OptimizedImage src={image} alt={name} fill sizes="180px" className="object-contain p-2" />
          </div>
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-2">
            {badge && <AwardBadge type={badge} />}
            <span className="text-[11px] text-neutral-400">#{rank}</span>
          </div>

          <h3 className="mt-1 text-lg font-bold text-neutral-900 transition-colors duration-150 group-hover:text-primary">
            {name}
          </h3>

          <p className="mt-1.5 text-[13px] leading-relaxed text-neutral-500">{summary}</p>

          <div className="mt-2.5 flex items-center gap-3">
            <ScoreBadge score={score} showLabel />
            <span className="text-base font-bold text-neutral-900">{price}</span>
            <span className="text-xs font-medium text-green-600">In Stock</span>
          </div>

          <div className="mt-3 flex items-center gap-2">
            {/* Buy button — sits above the stretched link via z-10 */}
            {buyUrl && isSafeUrl(buyUrl) && (
              <a
                href={buyUrl}
                target="_blank"
                rel="noopener noreferrer nofollow"
                onClick={(e) => e.stopPropagation()}
                className="relative z-10 inline-flex items-center gap-1 rounded-md bg-accent px-5 py-2 text-sm font-semibold text-white transition-all hover:scale-105 hover:bg-accent/90"
              >
                {buyLabel}<ExternalLink className="h-3 w-3" />
              </a>
            )}

            {/* CTA — resting state: small text link. Hover state: filled pill */}
            <span
              className="
                relative z-10 inline-flex items-center gap-1 rounded-md px-3 py-2 text-xs font-semibold
                text-primary border border-transparent
                transition-all duration-150
                group-hover:border-primary group-hover:bg-primary group-hover:text-white
              "
            >
              Read Review <ArrowRight className="h-3 w-3 transition-transform duration-150 group-hover:translate-x-0.5" />
            </span>
          </div>
        </div>
      </div>

      {specs && Object.keys(specs).length > 0 && (
        <div className="mt-3.5 flex flex-wrap gap-4 border-t border-neutral-100 pt-3.5 text-xs">
          {Object.entries(specs).slice(0, 5).map(([key, value]) => (
            <span key={key} className="text-neutral-400">
              {key}: <strong className="text-neutral-700">{value}</strong>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
