import { PostMetadata } from '../components/PostMetadata';

/**
 * Calculate overall score from rating breakdown metrics
 */
export function calculateOverallScore(ratingBreakdown?: PostMetadata['ratingBreakdown']): number {
  if (!ratingBreakdown?.metrics || ratingBreakdown.metrics.length === 0) {
    return 0;
  }

  const totalScore = ratingBreakdown.metrics.reduce(
    (acc: number, metric: { name: string; score: number }) => acc + metric.score,
    0
  );
  return Math.round((totalScore * 10) / ratingBreakdown.metrics.length);
}

/**
 * Convert overall score to star rating (0-5 scale)
 */
export function scoreToStarRating(score: number): number {
  return Number((score / 20).toFixed(1));
}

/**
 * The out-of-100 score for a review, or null when it has no rating metrics.
 *
 * Listing, related and best-of pages each grew their own copy of this that
 * averaged the metrics on their native 0-10 scale, then rendered the result
 * through the same `/ 10` the out-of-100 scale needs. Every score on those
 * pages displayed as 0.8 or 0.9 out of 10, which also made the "highest
 * rated" sort look broken because every row showed the same number. One
 * definition, on the same scale the article page uses, so they cannot drift.
 */
export function articleScore(post: {
  ratingBreakdown?: PostMetadata['ratingBreakdown'];
}): number | null {
  const metrics = post.ratingBreakdown?.metrics;
  if (!metrics || metrics.length === 0) return null;
  return calculateOverallScore(post.ratingBreakdown);
}

/**
 * Format date for display
 */
export function formatArticleDate(date: string): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Check if article has rating data
 */
export function hasRatingData(metadata: PostMetadata): boolean {
  return !!(metadata.ratingBreakdown?.metrics && metadata.ratingBreakdown.metrics.length > 0);
}
