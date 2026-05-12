// components/ReviewCard.tsx
import Link from 'next/link';
import { OptimizedImage } from './OptimizedImage';
import { ScoreBadge } from './ScoreBadge';
import type { PostMetadata } from './PostMetadata';

interface ReviewCardProps {
  post: PostMetadata;
}

export function ReviewCard({ post }: ReviewCardProps) {
  const score = post.ratingBreakdown
    ? post.ratingBreakdown.metrics.length > 0
      ? post.ratingBreakdown.metrics.reduce((sum, m) => sum + m.score, 0) /
        post.ratingBreakdown.metrics.length
      : null
    : post.rating
      ? post.rating * 2
      : null;

  return (
    <Link
      href={`/articles/${post.slug}`}
      className="state-layer group flex flex-col overflow-hidden rounded-xl border border-neutral-200 bg-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card-hover"
    >
      <div className="relative aspect-[3/2] w-full overflow-hidden bg-gradient-to-br from-primary-lightest to-primary-light/30">
        <OptimizedImage
          src={post.image || post.productImage || '/images/item.png'}
          alt={post.title}
          fill
          sizes="(max-width: 640px) 50vw, 33vw"
          className="object-cover"
        />
        {score !== null && (
          <div className="absolute right-2 top-2">
            <ScoreBadge score={score} size="sm" />
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-3">
        {post.category && (
          <span className="type-label text-primary">{post.category}</span>
        )}
        <h3 className="type-title mt-1 line-clamp-2 text-neutral-900">{post.title}</h3>
        {post.subtitle && (
          <p className="type-body mt-1 line-clamp-2 text-neutral-500">{post.subtitle}</p>
        )}
        <span className="type-label mt-2 text-neutral-400">{post.date}</span>
      </div>
    </Link>
  );
}
