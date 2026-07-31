import { Metadata } from 'next';
import Link from 'next/link';
import { Breadcrumb } from '@/components/Breadcrumb';
import { SectionLabel } from '@/components/SectionLabel';
import { Newsletter } from '@/components/Newsletter';
import { OptimizedImage } from '@/components/OptimizedImage';
import { getPostsByCategory } from '@/lib/Posts';
import { CATEGORIES } from '@/lib/taxonomy';
import { GATES } from '@/lib/editorial-standards';
import { SITE_URL } from '@/lib/site-url';

export const metadata: Metadata = {
  title: 'Best Products — Expert Reviews & Buying Guides | Product Lab',
  description:
    'Every Product Lab buying guide in one place. Independently scored recommendations across power stations, headphones, TVs, cameras, laptops and more.',
  alternates: { canonical: `${SITE_URL}/best` },
};

interface CategorySummary {
  slug: string;
  name: string;
  shortName: string;
  icon: string;
  description: string;
  count: number;
  image?: string;
  topPick?: { title: string; slug: string; score: number | null };
}

function averageScore(post: { ratingBreakdown?: { metrics: { score: number }[] } }): number | null {
  const metrics = post.ratingBreakdown?.metrics;
  if (!metrics || metrics.length === 0) return null;
  return metrics.reduce((sum, m) => sum + m.score, 0) / metrics.length;
}

/**
 * Counts and top picks are derived from the content tree rather than hardcoded.
 * The previous version listed five categories, three of which pointed at routes
 * that do not exist, with counts that had drifted from reality.
 */
function getCategorySummaries(): CategorySummary[] {
  return CATEGORIES.map((category) => {
    const posts = getPostsByCategory(category.contentDir);
    const ranked = [...posts].sort((a, b) => (averageScore(b) ?? -1) - (averageScore(a) ?? -1));
    const best = ranked[0];

    return {
      slug: category.slug,
      name: category.name,
      shortName: category.shortName,
      icon: category.icon,
      description: category.description,
      count: posts.length,
      image: posts.find((p) => p.productImage)?.productImage,
      topPick: best
        ? { title: best.title, slug: best.slug, score: averageScore(best) }
        : undefined,
    };
  }).filter((summary) => summary.count > 0);
}

export default function BestPage() {
  const categories = getCategorySummaries();
  const totalReviews = categories.reduce((sum, c) => sum + c.count, 0);
  const featured = categories.filter((c) => c.count >= 5).slice(0, 4);
  const featuredSlugs = new Set(featured.map((c) => c.slug));
  const remaining = categories.filter((c) => !featuredSlugs.has(c.slug));

  return (
    <div className="min-h-screen bg-neutral-50">
      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Buying guides' }]} />

      <div className="bg-gradient-to-br from-primary to-primary-dark px-6 py-10 text-white">
        <div className="mx-auto max-w-content">
          <SectionLabel className="text-white/70">Buying Guides</SectionLabel>
          <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">
            Every Product Lab buying guide
          </h1>
          <p className="mt-2 max-w-2xl text-base text-white/80">
            Start with the category you are shopping. Each guide ranks the products we have tested
            against the same rubric, so the ordering means something.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs text-white/90">
              {totalReviews} reviews
            </span>
            <span className="rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs text-white/90">
              {categories.length} categories
            </span>
            <span className="rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs text-white/90">
              Independently scored
            </span>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-content px-4 py-8 sm:px-6">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[7fr_3fr]">
          <main className="space-y-10">
            <section>
              <SectionLabel>Start here</SectionLabel>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                {featured.map((category) => (
                  <Link
                    key={category.slug}
                    href={`/best/${category.slug}`}
                    className="group overflow-hidden rounded-xl border border-neutral-200 bg-white transition-shadow hover:shadow-md"
                  >
                    <div className="relative h-48 w-full overflow-hidden bg-neutral-100">
                      {category.image && (
                        <OptimizedImage
                          src={category.image}
                          alt={category.name}
                          fill
                          sizes="(max-width: 640px) 100vw, 50vw"
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      )}
                      <span className="absolute left-3 top-3 rounded-full bg-accent px-2.5 py-0.5 text-[11px] font-semibold text-white">
                        {category.count} reviews
                      </span>
                    </div>
                    <div className="p-5">
                      <div className="text-[11px] font-semibold uppercase tracking-wide text-primary">
                        {category.icon} {category.shortName}
                      </div>
                      <h2 className="mt-1 text-base font-bold text-neutral-900 transition-colors group-hover:text-primary">
                        {category.name}
                      </h2>
                      <p className="mt-1.5 line-clamp-2 text-[13px] leading-relaxed text-neutral-500">
                        {category.description}
                      </p>
                      {category.topPick && (
                        <p className="mt-3 text-xs text-neutral-600">
                          Top pick:{' '}
                          <span className="font-semibold text-neutral-800">
                            {category.topPick.title}
                          </span>
                        </p>
                      )}
                      <span className="mt-3 block text-xs font-semibold text-primary group-hover:underline">
                        View guide →
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </section>

            {remaining.length > 0 && (
              <section>
                <SectionLabel>More categories</SectionLabel>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {remaining.map((category) => (
                    <Link
                      key={category.slug}
                      href={`/best/${category.slug}`}
                      className="flex items-start gap-3 rounded-xl border border-neutral-200 bg-white p-4 transition-colors hover:border-primary/40"
                    >
                      <span aria-hidden="true" className="text-lg">
                        {category.icon}
                      </span>
                      <span className="min-w-0">
                        <span className="block text-sm font-semibold text-neutral-900">
                          {category.name}
                        </span>
                        <span className="mt-0.5 block line-clamp-2 text-xs text-neutral-500">
                          {category.description}
                        </span>
                        <span className="mt-1 block text-[11px] text-primary">
                          {category.count} {category.count === 1 ? 'review' : 'reviews'}
                        </span>
                      </span>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            <section>
              <SectionLabel>Our Process</SectionLabel>
              <div className="rounded-xl bg-gradient-to-br from-primary-lightest to-primary-light/20 p-6">
                <h2 className="mb-2 text-lg font-bold text-neutral-900">How we test</h2>
                <p className="mb-5 text-sm leading-relaxed text-neutral-600">
                  Reviews are scored on a fixed rubric and blocked from publication until they clear
                  objective thresholds.
                </p>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                  {[
                    {
                      title: 'Real-world performance',
                      desc: 'We score how a product behaves in the situations people buy it for, not peak spec-sheet numbers.',
                    },
                    {
                      title: 'Named comparisons',
                      desc: `Every review compares at least ${GATES.minNamedCompetitors} named competitors, so a recommendation has context.`,
                    },
                    {
                      title: 'Evidence density',
                      desc: `A review needs at least ${GATES.minNumericClaims} concrete numeric claims before it can publish.`,
                    },
                  ].map((item) => (
                    <div key={item.title} className="rounded-lg bg-white p-4">
                      <h3 className="mb-1.5 text-sm font-semibold text-neutral-900">{item.title}</h3>
                      <p className="text-xs leading-relaxed text-neutral-500">{item.desc}</p>
                    </div>
                  ))}
                </div>
                <Link
                  href="/methodology"
                  className="mt-5 inline-block text-xs font-semibold text-primary hover:underline"
                >
                  Read the full methodology →
                </Link>
              </div>
            </section>
          </main>

          <aside className="space-y-5">
            <div className="rounded-xl border border-neutral-200 bg-white p-4">
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-primary">
                Browse categories
              </h3>
              <ul className="space-y-1">
                {categories.map((category) => (
                  <li key={category.slug}>
                    <Link
                      href={`/best/${category.slug}`}
                      className="flex items-center justify-between rounded-md px-3 py-2 text-sm hover:bg-primary-lightest"
                    >
                      <span className="font-medium text-neutral-700">{category.shortName}</span>
                      <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-[11px] text-neutral-500">
                        {category.count}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
              <Link
                href="/reviews"
                className="mt-3 block px-3 text-xs font-semibold text-primary hover:underline"
              >
                Browse all {totalReviews} reviews →
              </Link>
            </div>

            <div className="rounded-xl border border-neutral-200 bg-white p-4">
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-primary">
                Highest rated right now
              </h3>
              <ul className="space-y-3">
                {categories
                  .filter((c) => c.topPick?.score != null)
                  .sort((a, b) => (b.topPick?.score ?? 0) - (a.topPick?.score ?? 0))
                  .slice(0, 5)
                  .map((category) => (
                    <li key={category.slug}>
                      <Link
                        href={`/articles/${category.topPick!.slug}`}
                        className="block text-sm text-neutral-700 hover:text-primary"
                      >
                        {category.topPick!.title}
                      </Link>
                      <p className="text-[11px] text-primary">
                        {((category.topPick!.score ?? 0) / 10).toFixed(1)} / 10 ·{' '}
                        {category.shortName}
                      </p>
                    </li>
                  ))}
              </ul>
            </div>

            <Newsletter
              title="Stay updated"
              description="Get notified when we publish new reviews and buying guides."
            />
          </aside>
        </div>
      </div>
    </div>
  );
}
