import Link from 'next/link';
import getPostMetadata from './getPostMetadata';

/**
 * Posts are sorted newest-first, so this is a recency list. It was previously
 * labelled "Trending", which implied a popularity signal the site does not yet
 * collect. Swap in GA4/Search Console data before reinstating that label.
 */
export function LatestReviews({ limit = 5 }: { limit?: number }) {
  const posts = getPostMetadata().slice(0, limit);

  return (
    <div className="rounded-xl border border-primary-light bg-gradient-to-b from-primary-lightest to-neutral-50 p-4">
      <h3 className="mb-3 text-xs font-semibold uppercase tracking-widest text-primary">Latest Reviews</h3>
      <ol className="space-y-0">
        {posts.map((post, i) => (
          <li key={post.slug} className="flex gap-2 border-b border-primary/10 py-2 last:border-0">
            <span className="text-sm font-bold text-accent">{i + 1}</span>
            <Link href={`/articles/${post.slug}`} className="text-[13px] text-neutral-700 hover:text-primary">{post.title}</Link>
          </li>
        ))}
      </ol>
    </div>
  );
}
