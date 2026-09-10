import fs from 'fs';
import path from 'path';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Breadcrumb } from '@/components/Breadcrumb';
import { Newsletter } from '@/components/Newsletter';
import { OptimizedImage } from '@/components/OptimizedImage';
import { AffiliateDisclosure } from '@/components/AffiliateDisclosure';
import { getPostsByCategory } from '@/lib/Posts';
import { articleScore } from '@/lib/articleUtils';
import { CATEGORIES, getCategoryBySlug } from '@/lib/taxonomy';
import { SITE_URL } from '@/lib/site-url';

/**
 * Generic hub for any taxonomy category without a bespoke page.
 *
 * Hand-written hubs under app/best/ take precedence over this dynamic segment,
 * so this exists purely so that adding a category to CATEGORIES can never again
 * produce a 404 from the footer, sitemap or article breadcrumbs.
 */
function slugsWithStaticRoute(): Set<string> {
  const bestDir = path.join(process.cwd(), 'app', 'best');
  const entries = fs.readdirSync(bestDir, { withFileTypes: true });
  return new Set(
    entries
      .filter((entry) => entry.isDirectory() && !entry.name.startsWith('['))
      .map((entry) => entry.name)
  );
}

export function generateStaticParams() {
  const staticSlugs = slugsWithStaticRoute();
  return CATEGORIES.filter((category) => !staticSlugs.has(category.slug)).map((category) => ({
    category: category.slug,
  }));
}

// Without this, an unknown slug renders the not-found body with a 200 status —
// a soft 404 that search engines will happily index.
export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category: slug } = await params;
  const category = getCategoryBySlug(slug);

  if (!category) {
    return { title: 'Category Not Found | Product Lab' };
  }

  return {
    title: `Best ${category.name} — Reviews & Buying Guide | Product Lab`,
    description: category.description,
    alternates: { canonical: `${SITE_URL}/best/${category.slug}` },
  };
}


export default async function CategoryHubPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category: slug } = await params;
  const category = getCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  const posts = [...getPostsByCategory(category.contentDir)].sort(
    (a, b) => (articleScore(b) ?? -1) - (articleScore(a) ?? -1)
  );

  return (
    <div className="min-h-screen bg-neutral-50">
      <Breadcrumb
        items={[
          { label: 'Home', href: '/' },
          { label: 'Buying guides', href: '/best' },
          { label: category.shortName },
        ]}
      />

      <div className="bg-gradient-to-br from-primary to-primary-dark px-6 py-10 text-white">
        <div className="mx-auto max-w-content">
          <span aria-hidden="true" className="text-2xl">
            {category.icon}
          </span>
          <h1 className="mt-1 text-3xl font-extrabold tracking-tight md:text-4xl">
            Best {category.name}
          </h1>
          <p className="mt-2 max-w-2xl text-base text-white/80">{category.description}</p>
          <p className="mt-3 text-xs text-white/70">
            {posts.length} {posts.length === 1 ? 'review' : 'reviews'}, ranked by our score.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-content px-4 py-8 sm:px-6">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[7fr_3fr]">
          <main>
            {posts.length === 0 ? (
              <p className="rounded-lg border border-dashed border-neutral-300 bg-white p-8 text-center text-sm text-neutral-500">
                We have not published reviews in this category yet.{' '}
                <Link href="/reviews" className="text-primary hover:underline">
                  Browse all reviews
                </Link>
                .
              </p>
            ) : (
              <ol className="space-y-4">
                {posts.map((post, index) => {
                  const score = articleScore(post);
                  return (
                    <li key={post.slug}>
                      <Link
                        href={`/articles/${post.slug}`}
                        className="group flex gap-4 rounded-xl border border-neutral-200 bg-white p-4 transition-shadow hover:shadow-md"
                      >
                        <div className="relative hidden h-28 w-40 shrink-0 overflow-hidden rounded-lg bg-neutral-100 sm:block">
                          {post.productImage && (
                            <OptimizedImage
                              src={post.productImage}
                              alt={post.title}
                              fill
                              sizes="160px"
                              className="object-cover"
                            />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <span className="text-[11px] font-semibold uppercase tracking-wide text-primary">
                            #{index + 1} in {category.shortName}
                          </span>
                          <h2 className="mt-1 text-base font-bold text-neutral-900 transition-colors group-hover:text-primary">
                            {post.title}
                          </h2>
                          {post.subtitle && (
                            <p className="mt-1 line-clamp-2 text-[13px] leading-relaxed text-neutral-500">
                              {post.subtitle}
                            </p>
                          )}
                          <div className="mt-2 flex items-center gap-3 text-xs">
                            {score !== null && (
                              <span className="font-semibold text-primary">
                                {(score / 10).toFixed(1)} / 10
                              </span>
                            )}
                            {post.price && <span className="text-neutral-600">{post.price}</span>}
                          </div>
                        </div>
                      </Link>
                    </li>
                  );
                })}
              </ol>
            )}

            <div className="mt-8">
              <AffiliateDisclosure variant="box" />
            </div>
          </main>

          <aside className="space-y-5">
            <div className="rounded-xl border border-neutral-200 bg-white p-4">
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-primary">
                Other categories
              </h3>
              <ul className="space-y-1">
                {CATEGORIES.filter((c) => c.slug !== category.slug).map((other) => (
                  <li key={other.slug}>
                    <Link
                      href={`/best/${other.slug}`}
                      className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-neutral-700 hover:bg-primary-lightest"
                    >
                      <span aria-hidden="true">{other.icon}</span>
                      {other.shortName}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <Newsletter />
          </aside>
        </div>
      </div>
    </div>
  );
}
