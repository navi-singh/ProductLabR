import Link from 'next/link';
import { getPostsByCategory } from '@/lib/Posts';

interface RelatedArticlesProps {
  currentArticleSlug: string;
  category?: string;
  limit?: number;
  title?: string;
}

const STOP_WORDS = new Set([
  'the', 'a', 'an', 'and', 'or', 'for', 'with', 'best', 'review', 'vs', 'top',
  'of', 'in', 'to', 'is', 'our', 'we', '2024', '2025', '2026',
]);

function tokenize(value: string): Set<string> {
  return new Set(
    value
      .toLowerCase()
      .split(/[^a-z0-9]+/)
      .filter((token) => token.length > 1 && !STOP_WORDS.has(token))
  );
}

function averageScore(post: { ratingBreakdown?: { metrics: { score: number }[] } }): number | null {
  const metrics = post.ratingBreakdown?.metrics;
  if (!metrics || metrics.length === 0) return null;
  return metrics.reduce((sum, m) => sum + m.score, 0) / metrics.length;
}

/**
 * Ranks siblings instead of taking the first N in directory order.
 *
 * The previous implementation sliced the category listing, so every article in a
 * large category (portable power stations has 33) linked to the same four posts.
 * Ranking on name overlap, then rating, then recency gives each article a
 * distinct and genuinely relevant set.
 */
export function RelatedArticles({
  currentArticleSlug,
  category,
  limit = 4,
  title,
}: RelatedArticlesProps) {
  if (!category) return null;

  const currentTokens = tokenize(`${title ?? ''} ${currentArticleSlug}`);

  const posts = getPostsByCategory(category)
    .filter((p) => p.slug !== currentArticleSlug)
    .map((post, index) => {
      const tokens = tokenize(`${post.title} ${post.slug}`);
      let overlap = 0;
      tokens.forEach((token) => {
        if (currentTokens.has(token)) overlap += 1;
      });

      const score = averageScore(post);

      return {
        post,
        index,
        // Similarity dominates, rating breaks ties among equally related posts,
        // and the source order (already date-desc) breaks the remaining ties.
        rank: overlap * 100 + (score ?? 0),
      };
    })
    .sort((a, b) => b.rank - a.rank || a.index - b.index)
    .slice(0, limit)
    .map((entry) => entry.post);

  if (posts.length === 0) return null;

  return (
    <div className="mt-4">
      <h3 className="mb-2.5 text-xs font-semibold uppercase tracking-wider text-primary">
        Related reviews
      </h3>
      <div className="space-y-0">
        {posts.map((post) => {
          const score = averageScore(post);
          return (
            <Link
              key={post.slug}
              href={`/articles/${post.slug}`}
              className="block border-b border-neutral-100 py-2 last:border-0"
            >
              <div className="text-xs font-medium text-neutral-700 hover:text-primary">
                {post.title}
              </div>
              {score !== null && (
                <div className="mt-0.5 text-[11px] text-primary">
                  {(score / 10).toFixed(1)}{' '}
                  {score / 10 >= 9 ? 'Excellent' : score / 10 >= 8 ? 'Great' : 'Good'}
                </div>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
