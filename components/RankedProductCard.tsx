import Link from 'next/link';
import { ExternalLink } from 'lucide-react';
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
  return (
    <div className={`rounded-xl border border-neutral-200 bg-white p-5 ${rank === 1 ? 'border-l-4 border-l-accent' : ''}`}>
      <div className="flex flex-col gap-5 sm:flex-row">
        <div className="relative h-36 w-full flex-shrink-0 overflow-hidden rounded-lg bg-gradient-to-br from-primary-lightest to-primary-light/30 sm:w-44">
          <OptimizedImage src={image} alt={name} fill sizes="180px" className="object-contain p-2" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            {badge && <AwardBadge type={badge} />}
            <span className="text-[11px] text-neutral-400">#{rank}</span>
          </div>
          <h3 className="mt-1 text-lg font-bold text-neutral-900">{name}</h3>
          <p className="mt-1.5 text-[13px] leading-relaxed text-neutral-500">{summary}</p>
          <div className="mt-2.5 flex items-center gap-3">
            <ScoreBadge score={score} showLabel />
            <span className="text-sm font-semibold text-neutral-900">{price}</span>
          </div>
          <div className="mt-2.5 flex gap-2">
            {buyUrl && (
              <a href={buyUrl} target="_blank" rel="noopener noreferrer nofollow" className="inline-flex items-center gap-1 rounded-md bg-accent px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-accent/90">
                {buyLabel}<ExternalLink className="h-3 w-3" />
              </a>
            )}
            <Link href={href} className="inline-flex items-center rounded-md border border-primary px-3.5 py-1.5 text-xs font-medium text-primary hover:bg-primary-lightest">
              Read Review →
            </Link>
          </div>
        </div>
      </div>
      {specs && Object.keys(specs).length > 0 && (
        <div className="mt-3.5 flex flex-wrap gap-4 border-t border-neutral-100 pt-3.5 text-xs">
          {Object.entries(specs).slice(0, 5).map(([key, value]) => (
            <span key={key} className="text-neutral-400">{key}: <strong className="text-neutral-700">{value}</strong></span>
          ))}
        </div>
      )}
    </div>
  );
}
