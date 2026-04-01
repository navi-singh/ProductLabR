import Link from 'next/link';
import { OptimizedImage } from './OptimizedImage';
import { ScoreBadge } from './ScoreBadge';
import type { PostMetadata } from './PostMetadata';

interface ReviewCardProps {
  post: PostMetadata;
}

export function ReviewCard({ post }: ReviewCardProps) {
  const score = post.ratingBreakdown
    ? post.ratingBreakdown.metrics.reduce((sum, m) => sum + m.score, 0) / post.ratingBreakdown.metrics.length
    : post.rating ? post.rating * 2 : null;

  return (
    <Link href={`/articles/${post.slug}`} className="flex gap-4 rounded-lg p-3 transition-colors hover:bg-primary-lightest/50">
      <div className="relative h-20 w-[120px] flex-shrink-0 overflow-hidden rounded-lg bg-gradient-to-br from-primary-lightest to-primary-light/30">
        <OptimizedImage
          src={post.image || post.productImage || '/images/item.png'}
          alt={post.title}
          fill
          sizes="120px"
          className="object-cover"
        />
      </div>
      <div className="min-w-0 flex-1">
        {post.category && <span className="text-[11px] font-semibold text-primary">{post.category}</span>}
        <h3 className="mt-0.5 line-clamp-2 text-[15px] font-semibold leading-snug text-neutral-900">{post.title}</h3>
        {post.subtitle && <p className="mt-1 line-clamp-2 text-[13px] leading-relaxed text-neutral-500">{post.subtitle}</p>}
        <div className="mt-1.5 flex items-center gap-2">
          {score && <ScoreBadge score={score / 10} />}
          <span className="text-[11px] text-neutral-400">{post.date}</span>
        </div>
      </div>
    </Link>
  );
}
