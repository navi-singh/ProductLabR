import Link from 'next/link';
import type { PostMetadata } from '@/components/PostMetadata';
import { ScoreBadge } from '@/components/ScoreBadge';
import {
  comparedAgainst,
  deriveBestFor,
  deriveSkipIf,
  evidenceLevelLabel,
  productNameFromTitle,
  reviewDateLabel,
} from '@/lib/guide-data';
import { articleScore } from '@/lib/articleUtils';

interface BestForSkipIfProps {
  metadata: PostMetadata;
}

export function BestForSkipIf({ metadata }: BestForSkipIfProps) {
  if (!metadata.bestFor?.length && !metadata.skipIf?.length) return null;

  const bestFor = deriveBestFor(metadata).slice(0, 3);
  const skipIf = deriveSkipIf(metadata).slice(0, 3);
  if (bestFor.length === 0 && skipIf.length === 0) return null;

  return (
    <section className="grid grid-cols-1 gap-3 md:grid-cols-2">
      <div className="rounded-xl border border-green-200 bg-green-50 p-4">
        <p className="type-label text-success">Best For</p>
        <ul className="mt-3 space-y-2">
          {bestFor.map((item) => (
            <li key={item} className="flex gap-2 text-sm leading-relaxed text-neutral-700">
              <span className="font-bold text-success">✓</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="rounded-xl border border-red-200 bg-red-50 p-4">
        <p className="type-label text-red-600">Skip If</p>
        <ul className="mt-3 space-y-2">
          {skipIf.map((item) => (
            <li key={item} className="flex gap-2 text-sm leading-relaxed text-neutral-700">
              <span className="font-bold text-red-600">×</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

interface WhatWeCheckedProps {
  metadata: PostMetadata;
}

export function WhatWeChecked({ metadata }: WhatWeCheckedProps) {
  const metrics = metadata.ratingBreakdown?.metrics ?? [];
  if (metrics.length === 0) return null;

  return (
    <section className="rounded-xl border border-neutral-200 bg-white p-4 shadow-featured">
      <p className="type-label text-accent">What We Checked</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {metrics.map((metric) => (
          <span
            key={metric.name}
            className="rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 text-xs font-semibold text-neutral-700"
          >
            {metric.name}: {(metric.score / 2).toFixed(1)}/5
          </span>
        ))}
      </div>
    </section>
  );
}

interface ComparedAgainstProps {
  current: PostMetadata;
  candidates: PostMetadata[];
}

export function ComparedAgainst({ current, candidates }: ComparedAgainstProps) {
  const alternatives = comparedAgainst(current, candidates);
  if (alternatives.length === 0) return null;
  const hasExplicitComparisons = !!current.testedAgainst?.length;

  return (
    <section className="rounded-xl border border-neutral-200 bg-white p-4 shadow-featured">
      <p className="type-label text-accent">
        {hasExplicitComparisons ? 'Compared Against' : 'Similar Products'}
      </p>
      <h2 className="mt-1 text-base font-bold text-neutral-900">
        {hasExplicitComparisons
          ? 'Products used as comparison points in this review'
          : 'High-scoring alternatives worth checking before you buy'}
      </h2>
      <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
        {alternatives.map((product) => {
          const score = articleScore(product);
          const displayScore = score == null ? null : score / 10;
          return (
            <Link
              key={product.slug}
              href={`/articles/${product.slug}`}
              className="flex items-start justify-between gap-3 rounded-lg border border-neutral-200 bg-neutral-50 p-3 transition-colors hover:border-primary/40 hover:bg-white"
            >
              <span className="min-w-0">
                <span className="line-clamp-2 text-sm font-bold text-neutral-900">
                  {productNameFromTitle(product.title)}
                </span>
                {product.mainTradeoff || product.cons?.[0] ? (
                  <span className="mt-1 line-clamp-1 block text-xs text-neutral-500">
                    {product.mainTradeoff ?? product.cons?.[0]}
                  </span>
                ) : null}
              </span>
              {displayScore != null && <ScoreBadge score={displayScore} size="sm" />}
            </Link>
          );
        })}
      </div>
    </section>
  );
}

interface EvidenceSnapshotProps {
  metadata: PostMetadata;
}

export function EvidenceSnapshot({ metadata }: EvidenceSnapshotProps) {
  if (
    !metadata.evidenceLevel &&
    !metadata.lastReviewed &&
    !metadata.reviewedBy &&
    !metadata.editedBy &&
    !metadata.updateHistory?.length &&
    !metadata.evidenceSources?.length
  ) {
    return null;
  }

  return (
    <section className="rounded-xl border border-neutral-200 bg-white p-4 shadow-featured">
      <p className="type-label text-accent">Evidence Snapshot</p>
      <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
        {metadata.evidenceLevel && (
          <div className="rounded-lg bg-neutral-50 p-3">
            <span className="block text-[10px] font-bold uppercase tracking-[0.08em] text-neutral-500">
              Evidence Type
            </span>
            <span className="mt-1 block text-sm font-semibold text-neutral-900">
              {evidenceLevelLabel(metadata.evidenceLevel)}
            </span>
          </div>
        )}
        {metadata.lastReviewed && (
          <div className="rounded-lg bg-neutral-50 p-3">
            <span className="block text-[10px] font-bold uppercase tracking-[0.08em] text-neutral-500">
              Last Reviewed
            </span>
            <span className="mt-1 block text-sm font-semibold text-neutral-900">
              {reviewDateLabel(metadata)}
            </span>
          </div>
        )}
        {metadata.reviewedBy && (
          <div className="rounded-lg bg-neutral-50 p-3">
            <span className="block text-[10px] font-bold uppercase tracking-[0.08em] text-neutral-500">
              Reviewed By
            </span>
            <span className="mt-1 block text-sm font-semibold text-neutral-900">
              {metadata.reviewedBy}
            </span>
          </div>
        )}
        {metadata.editedBy && (
          <div className="rounded-lg bg-neutral-50 p-3">
            <span className="block text-[10px] font-bold uppercase tracking-[0.08em] text-neutral-500">
              Edited By
            </span>
            <span className="mt-1 block text-sm font-semibold text-neutral-900">
              {metadata.editedBy}
            </span>
          </div>
        )}
        {metadata.updateHistory?.length ? (
          <div className="rounded-lg bg-neutral-50 p-3">
            <span className="block text-[10px] font-bold uppercase tracking-[0.08em] text-neutral-500">
              Update History
            </span>
            <span className="mt-1 block text-sm font-semibold text-neutral-900">
              {metadata.updateHistory.length} recorded update
              {metadata.updateHistory.length === 1 ? '' : 's'}
            </span>
          </div>
        ) : null}
        {metadata.evidenceSources?.length ? (
          <div className="rounded-lg bg-neutral-50 p-3">
            <span className="block text-[10px] font-bold uppercase tracking-[0.08em] text-neutral-500">
              Evidence Sources
            </span>
            <span className="mt-1 block text-sm font-semibold text-neutral-900">
              {metadata.evidenceSources.length} tracked
            </span>
          </div>
        ) : null}
        <div className="rounded-lg bg-neutral-50 p-3">
          <span className="block text-[10px] font-bold uppercase tracking-[0.08em] text-neutral-500">
            Review Standard
          </span>
          <span className="mt-1 block text-sm font-semibold text-neutral-900">
            Product Lab scoring rubric
          </span>
        </div>
      </div>
    </section>
  );
}
