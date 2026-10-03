import Link from 'next/link';
import { getTrendingPosts } from '@/lib/trending';

export function TrendingReviews({ limit = 5 }: { limit?: number }) {
  const trending = getTrendingPosts(limit);

  if (trending.length === 0) {
    return null;
  }

  return (
    <div className="rounded-xl border border-primary-light bg-gradient-to-b from-primary-lightest to-neutral-50 p-4">
      <h3 className="mb-3 text-xs font-semibold uppercase tracking-widest text-primary">
        Trending
      </h3>
      <ol className="space-y-0">
        {trending.map((entry, i) => (
          <li key={entry.slug} className="flex gap-2 border-b border-primary/10 py-2 last:border-0">
            <span className="text-sm font-bold text-accent">{i + 1}</span>
            <Link
              href={`/articles/${entry.slug}`}
              className="text-[13px] text-neutral-700 hover:text-primary"
            >
              {entry.post.title}
            </Link>
          </li>
        ))}
      </ol>
    </div>
  );
}
