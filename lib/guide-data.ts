import type { PostMetadata } from '@/components/PostMetadata';
import { articleScore, formatArticleDate } from '@/lib/articleUtils';

export interface GuideQuickPick {
  label: string;
  name: string;
  href: string;
  score?: number;
  price?: string;
  reason?: string;
}

export interface ComparisonColumn {
  key: string;
  label: string;
}

export interface ComparisonRow {
  rank?: number;
  name: string;
  href: string;
  /** Published 0-10 score scale. UI components convert this to 5-point display. */
  score?: number | null;
  price?: string;
  bestFor?: string;
  keyStrength?: string;
  mainTradeoff?: string;
  specs?: Record<string, string>;
}

export function productNameFromTitle(title: string): string {
  return title
    .replace(/\s+review\b.*$/i, '')
    .replace(/\s+Review:.*$/i, '')
    .trim();
}

export function firstAvailableSpec(
  specs: Record<string, string> | undefined,
  candidates: string[],
): string | undefined {
  if (!specs) return undefined;
  const entries = Object.entries(specs);
  for (const candidate of candidates) {
    const found = entries.find(([key]) => key.toLowerCase().includes(candidate.toLowerCase()));
    if (found) return found[1];
  }
  return undefined;
}

export function deriveBestFor(metadata: PostMetadata): string[] {
  if (metadata.bestFor?.length) return metadata.bestFor;
  return (metadata.pros ?? []).slice(0, 3);
}

export function deriveSkipIf(metadata: PostMetadata): string[] {
  if (metadata.skipIf?.length) return metadata.skipIf;
  return (metadata.cons ?? []).slice(0, 3);
}

export function evidenceLevelLabel(level?: PostMetadata['evidenceLevel']): string {
  if (level === 'hands-on') return 'Hands-on tested';
  if (level === 'spec-analysis') return 'Spec analysis';
  return 'Spec analysis + independent-source synthesis';
}

export function comparisonRowFromPost(post: PostMetadata, rank?: number): ComparisonRow {
  const score = articleScore(post);
  return {
    rank,
    name: productNameFromTitle(post.title),
    href: `/articles/${post.slug}`,
    score: score == null ? null : score / 10,
    price: post.price,
    bestFor: deriveBestFor(post)[0],
    keyStrength: post.keyStrength ?? post.pros?.[0],
    mainTradeoff: post.mainTradeoff ?? post.cons?.[0],
    specs: post.specs,
  };
}

export function comparedAgainst(
  current: PostMetadata,
  candidates: PostMetadata[],
  limit = 4,
): PostMetadata[] {
  if (current.testedAgainst?.length) {
    const bySlug = new Map(candidates.map((candidate) => [candidate.slug, candidate]));
    const selected = current.testedAgainst
      .map((slug) => bySlug.get(slug))
      .filter(Boolean) as PostMetadata[];
    if (selected.length) return selected.slice(0, limit);
  }

  return candidates
    .filter((candidate) => candidate.slug !== current.slug)
    .sort((a, b) => (articleScore(b) ?? -1) - (articleScore(a) ?? -1))
    .slice(0, limit);
}

export function reviewDateLabel(metadata: PostMetadata): string {
  return formatArticleDate(metadata.lastReviewed ?? metadata.date);
}
