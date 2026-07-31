'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { CATEGORIES } from '@/lib/taxonomy';

export interface ReviewEntry {
  slug: string;
  title: string;
  subtitle: string;
  date: string;
  categorySlug: string;
  categoryName: string;
  score: number | null;
}

type SortKey = 'rating' | 'newest' | 'title';

const SORTS: { key: SortKey; label: string }[] = [
  { key: 'rating', label: 'Highest rated' },
  { key: 'newest', label: 'Newest first' },
  { key: 'title', label: 'A–Z' },
];

export function ReviewsExplorer({ reviews }: { reviews: ReviewEntry[] }) {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [sort, setSort] = useState<SortKey>('rating');

  const availableCategories = useMemo(() => {
    const present = new Set(reviews.map((r) => r.categorySlug));
    return CATEGORIES.filter((c) => present.has(c.slug));
  }, [reviews]);

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();

    const filtered = reviews.filter((review) => {
      if (activeCategory !== 'all' && review.categorySlug !== activeCategory) return false;
      if (!needle) return true;
      return (
        review.title.toLowerCase().includes(needle) ||
        review.subtitle.toLowerCase().includes(needle)
      );
    });

    return [...filtered].sort((a, b) => {
      if (sort === 'title') return a.title.localeCompare(b.title);
      if (sort === 'newest') return b.date.localeCompare(a.date);
      // Unrated reviews sort last rather than as a zero score.
      const aScore = a.score ?? -1;
      const bScore = b.score ?? -1;
      return bScore - aScore || a.title.localeCompare(b.title);
    });
  }, [reviews, query, activeCategory, sort]);

  return (
    <div>
      <div className="mb-6 space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex-1">
            <label htmlFor="reviews-search" className="sr-only">
              Search reviews
            </label>
            <input
              id="reviews-search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search all reviews…"
              className="w-full rounded-lg border border-neutral-300 px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <div>
            <label htmlFor="reviews-sort" className="sr-only">
              Sort reviews
            </label>
            <select
              id="reviews-sort"
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              className="w-full rounded-lg border border-neutral-300 px-3 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:w-auto"
            >
              {SORTS.map((option) => (
                <option key={option.key} value={option.key}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setActiveCategory('all')}
            aria-pressed={activeCategory === 'all'}
            className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
              activeCategory === 'all'
                ? 'border-primary bg-primary text-white'
                : 'border-neutral-300 text-neutral-600 hover:border-primary hover:text-primary'
            }`}
          >
            All ({reviews.length})
          </button>
          {availableCategories.map((category) => {
            const count = reviews.filter((r) => r.categorySlug === category.slug).length;
            const isActive = activeCategory === category.slug;
            return (
              <button
                key={category.slug}
                type="button"
                onClick={() => setActiveCategory(category.slug)}
                aria-pressed={isActive}
                className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                  isActive
                    ? 'border-primary bg-primary text-white'
                    : 'border-neutral-300 text-neutral-600 hover:border-primary hover:text-primary'
                }`}
              >
                {category.shortName} ({count})
              </button>
            );
          })}
        </div>
      </div>

      <p className="mb-3 text-xs text-neutral-500" role="status" aria-live="polite">
        Showing {visible.length} of {reviews.length} reviews
      </p>

      {visible.length === 0 ? (
        <p className="rounded-lg border border-dashed border-neutral-300 p-8 text-center text-sm text-neutral-500">
          No reviews match that search. Try a different term or clear the category filter.
        </p>
      ) : (
        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((review) => (
            <li key={review.slug}>
              <Link
                href={`/articles/${review.slug}`}
                className="flex h-full flex-col rounded-xl border border-neutral-200 bg-white p-4 transition-shadow hover:border-primary/40 hover:shadow-md"
              >
                <span className="text-[11px] font-semibold uppercase tracking-wider text-primary">
                  {review.categoryName}
                </span>
                <span className="mt-1.5 text-sm font-semibold leading-snug text-neutral-800">
                  {review.title}
                </span>
                {review.subtitle && (
                  <span className="mt-1 line-clamp-2 text-xs text-neutral-500">
                    {review.subtitle}
                  </span>
                )}
                {review.score !== null && (
                  <span className="mt-auto pt-3 text-xs font-semibold text-primary">
                    {(review.score / 10).toFixed(1)} / 10
                  </span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
