import Link from 'next/link';
import type { Metadata } from 'next';
import getPostMetadata from '@/components/getPostMetadata';
import { OptimizedImage } from '@/components/OptimizedImage';
import { ReviewCard } from '@/components/ReviewCard';
import { ScoreBadge } from '@/components/ScoreBadge';
import { SectionLabel } from '@/components/SectionLabel';
import { TrendingReviews } from '@/components/TrendingReviews';
import { Newsletter } from '@/components/Newsletter';
import AdBanner from '@/components/ads/AdBanner';
import { ADSENSE_CONFIG } from '@/lib/adsense-config';
import { getPostsByCategory } from '@/lib/Posts';
import { CATEGORIES } from '@/lib/taxonomy';
import { getComparisons } from '@/lib/comparisons';

const bestOfGuides = [
  { title: 'Best Hybrid Cameras', href: '/best/cameras/hybrid-cameras', icon: '📷', theme: 'blue' },
  {
    title: 'Best Portable Power Stations',
    href: '/best/power-stations/portable-power-stations',
    icon: '⚡',
    theme: 'orange',
  },
  {
    title: 'Best Camping Power Stations',
    href: '/best/power-stations/camping-power-stations',
    icon: '🏕️',
    theme: 'green',
  },
  {
    title: 'Best Noise-Cancelling Headphones',
    href: '/best/headphones/best-noise-cancelling-headphones',
    icon: '🎧',
    theme: 'blue',
  },
  { title: 'Best OLED TVs', href: '/best/tvs/best-oled-tvs', icon: '📺', theme: 'orange' },
  {
    title: 'Best Smartwatches',
    href: '/best/wearables/best-smartwatches',
    icon: '⌚',
    theme: 'green',
  },
];

export const metadata: Metadata = {
  alternates: { canonical: '/' },
};

function scoreFromPost(post: ReturnType<typeof getPostMetadata>[number]): number | null {
  if (post.ratingBreakdown?.metrics.length) {
    return (
      post.ratingBreakdown.metrics.reduce((sum, metric) => sum + metric.score, 0) /
      post.ratingBreakdown.metrics.length
    );
  }
  return post.rating ? post.rating * 2 : null;
}

export default function Home() {
  const posts = getPostMetadata();
  const featured = posts[0];
  const recentPosts = posts.slice(1, 7);
  const decisionPosts = posts.slice(0, 3);
  const comparisons = getComparisons();
  const latestDate = posts[0]?.date
    ? new Date(posts[0].date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : 'recently';

  const featuredScore = featured ? scoreFromPost(featured) : null;

  return (
    <>
      <section className="-mx-4 bg-gradient-to-b from-primary-lightest via-neutral-50 to-neutral-50 px-4 py-10 sm:-mx-6 sm:px-6 lg:py-14">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-end">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 rounded bg-white px-3 py-1 text-[11px] font-bold uppercase tracking-[0.08em] text-primary shadow-sm ring-1 ring-neutral-200">
              <span className="h-2 w-2 rounded-full bg-accent" />
              Independent benchmark reviews
            </div>
            <h1 className="mt-4 max-w-3xl font-display text-4xl font-semibold leading-tight tracking-tight text-neutral-900 md:text-6xl">
              Evidence-first tech reviews for faster buying decisions.
            </h1>
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-neutral-600">
              Product Lab turns hands-on testing, specs, and real-world trade-offs into clear
              recommendations across power stations, audio, TVs, cameras, and everyday tech.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/best"
                className="inline-flex h-11 items-center justify-center rounded-lg bg-accent px-5 text-sm font-bold text-white hover:bg-accent/90"
              >
                Browse buying guides
              </Link>
              <Link
                href="/methodology"
                className="inline-flex h-11 items-center justify-center rounded-lg border border-primary px-5 text-sm font-bold text-primary hover:bg-primary hover:text-white"
              >
                How we score
              </Link>
            </div>
          </div>

          <aside className="rounded-xl border border-neutral-200 bg-white p-5 shadow-featured">
            <p className="type-label text-accent">Testing Snapshot</p>
            <div className="mt-4 space-y-3">
              {[
                [`${posts.length}`, 'products tested and scored'],
                [`${CATEGORIES.length}`, 'active product categories'],
                [latestDate, 'latest review refresh'],
              ].map(([value, label]) => (
                <div
                  key={label}
                  className="flex items-center justify-between gap-4 border-b border-neutral-100 pb-3 last:border-0 last:pb-0"
                >
                  <span className="text-sm text-neutral-500">{label}</span>
                  <strong className="text-right text-lg text-neutral-900">{value}</strong>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </section>

      {featured && (
        <section className="mt-8 rounded-2xl border border-neutral-200 bg-white p-5 shadow-featured lg:p-6">
          <div
            className={`grid gap-6 ${featured.image || featured.productImage ? 'lg:grid-cols-[1.05fr_0.95fr]' : ''}`}
          >
            <div className="flex flex-col justify-center">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded bg-accent px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.08em] text-white">
                  Editor&apos;s Pick
                </span>
                {featured.category && (
                  <span className="type-label text-neutral-500">{featured.category}</span>
                )}
              </div>
              <h2 className="mt-3 font-display text-3xl font-semibold leading-tight tracking-tight text-neutral-900 md:text-4xl">
                {featured.title}
              </h2>
              {featured.subtitle && (
                <p className="mt-3 max-w-2xl text-base leading-relaxed text-neutral-600">
                  {featured.subtitle}
                </p>
              )}
              <div className="mt-5 flex flex-wrap items-center gap-4">
                {featuredScore !== null && <ScoreBadge score={featuredScore} size="lg" showLabel />}
                <Link
                  href={`/articles/${featured.slug}`}
                  className="inline-flex h-11 items-center justify-center rounded-lg bg-primary px-5 text-sm font-bold text-white hover:bg-primary-dark"
                >
                  Read full review →
                </Link>
              </div>
            </div>

            {(featured.image || featured.productImage) && (
              <div className="relative h-64 overflow-hidden rounded-xl border border-neutral-200 bg-gradient-to-br from-primary-lightest to-neutral-50 md:h-80">
                <OptimizedImage
                  src={featured.image || featured.productImage}
                  alt={featured.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-contain p-5"
                />
              </div>
            )}
          </div>
        </section>
      )}

      {decisionPosts.length > 0 && (
        <section className="mt-8 rounded-xl border border-neutral-200 bg-primary-lightest p-5">
          <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="type-label text-accent">Lab Decision Matrix</p>
              <h2 className="type-headline mt-1 text-neutral-900">
                Start with the latest top picks
              </h2>
            </div>
            <Link href="/reviews" className="text-sm font-bold text-primary hover:text-accent">
              All reviews →
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {decisionPosts.map((post) => {
              const score = scoreFromPost(post);
              return (
                <Link
                  key={post.slug}
                  href={`/articles/${post.slug}`}
                  className="group rounded-xl border border-neutral-200 bg-white p-4 shadow-featured transition-all hover:-translate-y-0.5 hover:shadow-card-hover"
                >
                  <div className="flex items-start justify-between gap-3">
                    <span className="type-label text-accent">{post.category || 'Review'}</span>
                    {score !== null && <ScoreBadge score={score} />}
                  </div>
                  <h3 className="mt-2 line-clamp-2 text-[15px] font-bold leading-snug text-neutral-900 group-hover:text-accent">
                    {post.title}
                  </h3>
                  {post.subtitle && (
                    <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-neutral-500">
                      {post.subtitle}
                    </p>
                  )}
                  <span className="mt-4 inline-flex text-xs font-bold text-primary">
                    Read verdict →
                  </span>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[7fr_3fr]">
        <div>
          <SectionLabel>Latest Reviews</SectionLabel>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {recentPosts.map((post) => (
              <ReviewCard key={post.slug} post={post} />
            ))}
          </div>

          <div className="my-6">
            <AdBanner
              adSlot={ADSENSE_CONFIG.adSlots.homeBetweenCategories}
              adFormat="auto"
              className="mx-auto"
            />
          </div>

          <SectionLabel>Best Of Guides</SectionLabel>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {bestOfGuides.map((guide) => {
              const tintClass =
                guide.theme === 'orange'
                  ? 'bg-amber-50'
                  : guide.theme === 'green'
                    ? 'bg-green-50'
                    : 'bg-primary-lightest';
              const badgeClass =
                guide.theme === 'orange'
                  ? 'bg-amber-50 text-accent'
                  : guide.theme === 'green'
                    ? 'bg-green-50 text-success'
                    : 'bg-primary-lightest text-primary';

              return (
                <Link
                  key={guide.href}
                  href={guide.href}
                  className="state-layer relative overflow-hidden rounded-xl border border-neutral-200 bg-white p-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card-hover"
                >
                  <div
                    className={`pointer-events-none absolute right-0 top-0 h-16 w-16 rounded-bl-[70px] rounded-tr-xl ${tintClass} opacity-80`}
                  />
                  <span className="text-2xl">{guide.icon}</span>
                  <h3 className="type-title mt-2 text-neutral-900">{guide.title}</h3>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="type-label text-neutral-400">Buying guide</span>
                    <span className={`type-label rounded-full px-2 py-0.5 ${badgeClass}`}>
                      View picks →
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>

          {comparisons.length > 0 && (
            <div className="mt-8">
              <SectionLabel>Head To Head</SectionLabel>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {comparisons.slice(0, 4).map((comparison) => (
                  <Link
                    key={comparison.href}
                    href={comparison.href}
                    className="rounded-xl border border-neutral-200 bg-white p-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card-hover"
                  >
                    <span className="type-label text-neutral-400">{comparison.categoryName}</span>
                    <h3 className="type-title mt-1 text-neutral-900">{comparison.title}</h3>
                    <span className="type-label mt-2 block text-primary">Compare →</span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        <aside className="space-y-4">
          <TrendingReviews />
          <AdBanner
            adSlot={ADSENSE_CONFIG.adSlots.sidebar}
            adFormat="rectangle"
            className="mx-auto"
          />
          <Newsletter />
          <div className="rounded-xl border border-neutral-200 bg-white p-4 shadow-featured">
            <h3 className="mb-3 text-xs font-bold uppercase tracking-widest text-primary">
              Categories
            </h3>
            <div className="space-y-1">
              {CATEGORIES.map((cat) => {
                const catPosts = getPostsByCategory(cat.contentDir);
                if (catPosts.length === 0) return null;
                return (
                  <Link
                    key={cat.slug}
                    href={`/best/${cat.slug}`}
                    className="flex items-center justify-between rounded-md bg-primary-lightest/70 px-3 py-2 text-sm text-neutral-600 hover:bg-primary-lightest hover:text-primary"
                  >
                    <span>
                      <span className="mr-1.5">{cat.icon}</span>
                      {cat.shortName}
                    </span>
                    <span className="type-label rounded-full bg-primary px-1.5 text-white">
                      {catPosts.length}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}
