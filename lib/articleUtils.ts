import { PostMetadata } from '../components/PostMetadata';

/**
 * Calculate overall score from rating breakdown metrics
 */
export function calculateOverallScore(ratingBreakdown?: PostMetadata['ratingBreakdown']): number {
  if (!ratingBreakdown?.metrics || ratingBreakdown.metrics.length === 0) {
    return 0;
  }

  const totalScore = ratingBreakdown.metrics.reduce((acc: number, metric: any) => acc + metric.score, 0);
  return Math.round((totalScore * 10) / ratingBreakdown.metrics.length);
}

/**
 * Convert overall score to star rating (0-5 scale)
 */
export function scoreToStarRating(score: number): number {
  return Number((score / 20).toFixed(1));
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
