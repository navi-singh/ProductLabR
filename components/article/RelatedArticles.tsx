import Link from 'next/link';
import { getPostsByCategory } from '@/lib/Posts';

interface RelatedArticlesProps {
  currentArticleSlug: string;
  category?: string;
  limit?: number;
}

export function RelatedArticles({ currentArticleSlug, category, limit = 4 }: RelatedArticlesProps) {
  if (!category) return null;

  const posts = getPostsByCategory(category)
    .filter((p) => p.slug !== currentArticleSlug)
    .slice(0, limit);

  if (posts.length === 0) return null;

  return (
    <div className="mt-4">
      <h3 className="mb-2.5 text-xs font-semibold uppercase tracking-wider text-primary">Related</h3>
      <div className="space-y-0">
        {posts.map((post) => {
          const score = post.ratingBreakdown
            ? post.ratingBreakdown.metrics.reduce((s, m) => s + m.score, 0) / post.ratingBreakdown.metrics.length
            : null;
          return (
            <Link key={post.slug} href={`/articles/${post.slug}`} className="block border-b border-neutral-100 py-2 last:border-0">
              <div className="text-xs font-medium text-neutral-700 hover:text-primary">{post.title}</div>
              {score && (
                <div className="mt-0.5 text-[11px] text-primary">
                  {(score / 10).toFixed(1)} {score / 10 >= 9 ? 'Excellent' : score / 10 >= 8 ? 'Great' : 'Good'}
                </div>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
