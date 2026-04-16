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
  { title: 'Best Hybrid Cameras', href: '/best/cameras/hybrid-cameras', count: 8, updated: 'Mar 2026', color: 'border-primary' },
  { title: 'Best Portable Power Stations', href: '/best/power-stations/portable-power-stations', count: 12, updated: 'Mar 2026', color: 'border-accent' },
  { title: 'Best Camping Power Stations', href: '/best/power-stations/camping-power-stations', count: 6, updated: 'Feb 2026', color: 'border-primary' },
  { title: 'Best Pro Photo Cameras', href: '/best/cameras/professional-photo-cameras', count: 5, updated: 'Mar 2026', color: 'border-accent' },
];

export default function Home() {
  const posts = getPostMetadata();
  const featured = posts[0];
  const recentPosts = posts.slice(1, 7);
  const categories = getAllCategories();

  const featuredScore = featured?.ratingBreakdown
    ? featured.ratingBreakdown.metrics.reduce((sum, m) => sum + m.score, 0) /
      featured.ratingBreakdown.metrics.length / 10
    : featured?.rating
      ? (featured.rating * 2) / 10
      : null;

  return (
    <>
      {/* Hero — Editor's Pick */}
      <section className="-mx-4 bg-gradient-to-b from-primary-lightest via-blue-50 to-neutral-50 px-4 py-8 sm:-mx-6 sm:px-6">
        <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.15em] text-primary">
          <span className="h-1.5 w-1.5 rounded-full bg-accent" />
          Editor&apos;s Pick
        </div>
        {featured && (
          <div className="mt-4 grid items-center gap-6 md:grid-cols-2">
            <div>
              <h1 className="text-2xl font-bold leading-tight text-neutral-900 md:text-[26px]">
                {featured.title}
              </h1>
              {featured.subtitle && (
                <p className="mt-2 text-sm leading-relaxed text-neutral-500">
                  {featured.subtitle}
                </p>
              )}
              <div className="mt-3 flex flex-wrap items-center gap-3">
                {featuredScore && <ScoreBadge score={featuredScore} showLabel />}
                {featured.price && (
                  <span className="text-base font-bold text-neutral-900">{featured.price}</span>
                )}
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <Link
                  href={`/articles/${featured.slug}`}
                  className="bg-accent text-white px-5 py-2.5 rounded-md font-semibold text-sm hover:opacity-90 transition-opacity"
                >
                  Read Full Review
                </Link>
                {featured.retailerLinks && Object.keys(featured.retailerLinks).length > 0 && (
                  <a
                    href={Object.values(featured.retailerLinks)[0]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="border border-neutral-300 text-neutral-700 px-5 py-2.5 rounded-md font-semibold text-sm hover:bg-neutral-50 transition-colors"
                  >
                    Buy Now
                  </a>
                )}
              </div>
            </div>
            <div className="relative h-44 overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-featured md:h-52">
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
          <div className="space-y-1">
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
            {bestOfGuides.map((guide) => (
              <Link
                key={guide.href}
                href={guide.href}
                className={`rounded-lg border border-neutral-200 border-l-[3px] ${guide.color} bg-white p-4 transition-shadow hover:shadow-card-hover`}
              >
                <span className={`text-[11px] font-medium ${guide.color === 'border-accent' ? 'text-accent' : 'text-primary'}`}>
                  Updated {guide.updated}
                </span>
                <h3 className="mt-1 text-sm font-semibold text-neutral-900">
                  {guide.title}
                </h3>
                <span className="mt-1 text-xs text-neutral-400">
                  {guide.count} products tested →
                </span>
              </Link>
            ))}
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
                    className="flex items-center justify-between rounded-md bg-primary-lightest/50 px-3 py-2 text-[13px] text-neutral-500 hover:bg-primary-lightest"
                  >
                    {cat.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
                    <span className="rounded-full bg-primary px-1.5 text-[10px] text-white">
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
