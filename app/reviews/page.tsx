import type { Metadata } from 'next';
import { Breadcrumb } from '@/components/Breadcrumb';
import { ReviewsExplorer, type ReviewEntry } from '@/components/ReviewsExplorer';
import { getPostsByCategory } from '@/lib/Posts';
import { articleScore } from '@/lib/articleUtils';
import { CATEGORIES } from '@/lib/taxonomy';
import { SITE_URL } from '@/lib/site-url';

export const metadata: Metadata = {
  title: 'All Reviews | Product Lab',
  description:
    'Browse every Product Lab review. Filter by category, search by product, and sort by rating or recency.',
  alternates: { canonical: `${SITE_URL}/reviews` },
};


function getAllReviews(): ReviewEntry[] {
  return CATEGORIES.flatMap((category) =>
    getPostsByCategory(category.contentDir).map((post) => ({
      slug: post.slug,
      title: post.title,
      subtitle: post.subtitle ?? '',
      date: post.date ?? '',
      categorySlug: category.slug,
      categoryName: category.shortName,
      score: articleScore(post),
    }))
  );
}

export default function ReviewsPage() {
  const reviews = getAllReviews();

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-6">
      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'All reviews' }]} />

      <header className="mb-6 mt-5">
        <h1 className="text-3xl font-bold text-neutral-900 md:text-4xl">All reviews</h1>
        <p className="mt-2 max-w-2xl text-sm text-neutral-600">
          Every product we have tested, scored against the same{' '}
          <a href="/methodology" className="text-primary hover:underline">
            rubric
          </a>
          . {reviews.length} reviews across {CATEGORIES.length} categories.
        </p>
      </header>

      <ReviewsExplorer reviews={reviews} />
    </main>
  );
}
