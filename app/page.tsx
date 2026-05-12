import Link from 'next/link';
import getPostMetadata from '@/components/getPostMetadata';
import { OptimizedImage } from '@/components/OptimizedImage';
import { ReviewCard } from '@/components/ReviewCard';
import { ScoreBadge } from '@/components/ScoreBadge';
import { SectionLabel } from '@/components/SectionLabel';
import { Top10Popular } from '@/components/Top10Popular';
import { Newsletter } from '@/components/Newsletter';
import AdBanner from '@/components/ads/AdBanner';
import { ADSENSE_CONFIG } from '@/lib/adsense-config';
import { getAllCategories, getPostsByCategory } from '@/lib/Posts';

const bestOfGuides = [
  { title: 'Best Hybrid Cameras',          href: '/best/cameras/hybrid-cameras',                count: 8,  icon: '📷', theme: 'blue',   updated: 'Mar 2026' },
  { title: 'Best Portable Power Stations', href: '/best/power-stations/portable-power-stations', count: 12, icon: '⚡', theme: 'orange', updated: 'Mar 2026' },
  { title: 'Best Camping Power Stations',  href: '/best/power-stations/camping-power-stations',  count: 6,  icon: '🏕️', theme: 'green',  updated: 'Feb 2026' },
  { title: 'Best Pro Photo Cameras',       href: '/best/cameras/professional-photo-cameras',     count: 5,  icon: '🎞️', theme: 'blue',   updated: 'Mar 2026' },
];

export default function Home() {
  const posts = getPostMetadata();
  const featured = posts[0];
  const recentPosts = posts.slice(1, 7);
  const categories = getAllCategories();

  const featuredScore = featured?.ratingBreakdown
    ? featured.ratingBreakdown.metrics.length > 0
      ? featured.ratingBreakdown.metrics.reduce((sum, m) => sum + m.score, 0) /
        featured.ratingBreakdown.metrics.length
      : null
    : featured?.rating
      ? featured.rating * 2
      : null;

  return (
    <>
      {/* Hero — Editor's Pick */}
      <section className="-mx-4 bg-gradient-to-b from-primary-lightest via-blue-50 to-neutral-50 px-4 py-10 sm:-mx-6 sm:px-6">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-accent" />
          <span className="type-label text-accent">Editor&apos;s Pick</span>
        </div>

        {featured && (
          <div className="mt-5 grid items-center gap-6 md:grid-cols-2">
            <div>
              <h1 className="type-display text-neutral-900">{featured.title}</h1>
              {featured.subtitle && (
                <p className="type-body mt-3 max-w-md text-neutral-500">{featured.subtitle}</p>
              )}

              {featuredScore !== null && (
                <div className="mt-4 flex items-center gap-3">
                  <ScoreBadge score={featuredScore} size="lg" showLabel />
                </div>
              )}

              <div className="mt-5">
                <Link
                  href={`/articles/${featured.slug}`}
                  className="inline-block rounded-md bg-accent px-6 py-3 type-title text-white transition-opacity hover:opacity-90"
                >
                  Read Full Review →
                </Link>
              </div>
            </div>

            <div className="relative h-52 overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-featured md:h-64">
              <OptimizedImage
                src={featured.image || featured.productImage || '/images/item.png'}
                alt={featured.title}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-contain p-4"
              />
            </div>
          </div>
        )}
      </section>

      {/* Content Grid */}
      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[7fr_3fr]">
        {/* Main Column */}
        <div>
          {/* Latest Reviews */}
          <SectionLabel>Latest Reviews</SectionLabel>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {recentPosts.map((post) => (
              <ReviewCard key={post.slug} post={post} />
            ))}
          </div>

          {/* Ad — between sections */}
          <div className="my-6">
            <AdBanner
              adSlot={ADSENSE_CONFIG.adSlots.homeBetweenCategories}
              adFormat="auto"
              className="mx-auto"
            />
          </div>

          {/* Best Of Guides */}
          <SectionLabel>Best Of Guides</SectionLabel>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {bestOfGuides.map((guide) => {
              const tintClass =
                guide.theme === 'orange' ? 'bg-amber-50'
                : guide.theme === 'green' ? 'bg-green-50'
                : 'bg-primary-lightest';
              const badgeClass =
                guide.theme === 'orange' ? 'bg-amber-50 text-accent'
                : guide.theme === 'green' ? 'bg-green-50 text-success'
                : 'bg-primary-lightest text-primary';

              return (
                <Link
                  key={guide.href}
                  href={guide.href}
                  className="state-layer relative overflow-hidden rounded-xl border border-neutral-200 bg-white p-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card-hover"
                >
                  {/* Tinted corner accent */}
                  <div
                    className={`pointer-events-none absolute right-0 top-0 h-14 w-14 rounded-bl-[60px] rounded-tr-xl ${tintClass} opacity-70`}
                  />
                  <span className="text-2xl">{guide.icon}</span>
                  <h3 className="type-title mt-2 text-neutral-900">{guide.title}</h3>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="type-label text-neutral-400">Updated {guide.updated}</span>
                    <span className={`type-label rounded-full px-2 py-0.5 ${badgeClass}`}>
                      {guide.count} tested
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Sidebar */}
        <aside className="space-y-4">
          <Top10Popular />

          <AdBanner
            adSlot={ADSENSE_CONFIG.adSlots.sidebar}
            adFormat="rectangle"
            className="mx-auto"
          />

          <Newsletter />

          {/* Categories */}
          <div>
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-widest text-primary">
              Categories
            </h3>
            <div className="space-y-1">
              {categories.map((cat) => {
                const catPosts = getPostsByCategory(cat);
                return (
                  <Link
                    key={cat}
                    href={`/best/${cat}`}
                    className="flex items-center justify-between rounded-md bg-primary-lightest/50 px-3 py-2 text-sm text-neutral-500 hover:bg-primary-lightest"
                  >
                    {cat.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
                    <span className="rounded-full bg-primary px-1.5 type-label text-white">
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
