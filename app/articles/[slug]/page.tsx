import React from 'react';
import { resolvePublicImage } from '@/lib/resolve-image';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPostBySlug, getAllPostSlugs } from '../../../lib/Posts';
import { processMarkdownContent } from '../../../lib/markdown';
import {
  calculateOverallScore,
  scoreToStarRating,
  formatArticleDate,
  hasRatingData,
} from '../../../lib/articleUtils';

// Components
import ScoreCard from '../../../components/article/ScoreCard';
import { ProductSpecs } from '../../../components/article/ProductSpecs';
import { ProsCons } from '../../../components/article/ProsCons';
import ProductImage from '../../../components/article/ProductImage';
import ProductGallery from '../../../components/article/ProductGallery';
import RetailerLinks from '../../../components/article/PriceButton';
import ArticleContent from '../../../components/article/ArticleContent';
import { AuthorBio } from '../../../components/article/AuthorBio';
import { RelatedArticles } from '../../../components/article/RelatedArticles';
import { Breadcrumb } from '../../../components/Breadcrumb';
import { TableOfContents } from '../../../components/TableOfContents';
import { Newsletter } from '../../../components/Newsletter';
import { StickyBuyBar } from '../../../components/StickyBuyBar';
import { AffiliateDisclosure } from '../../../components/AffiliateDisclosure';
import { getCategoryByContentDir } from '../../../lib/taxonomy';
import AdBanner from '../../../components/ads/AdBanner';
import { ADSENSE_CONFIG } from '../../../lib/adsense-config';
import { SITE_URL, canonicalUrl } from '../../../lib/site-url';

export const revalidate = 86400;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return { title: 'Article Not Found | Product Lab' };
  }

  const { metadata } = post;
  const description = metadata.subtitle || `Expert review of the ${metadata.title} by Product Lab.`;
  const imageUrl = resolvePublicImage(
    metadata.productImage || metadata.heroImage || metadata.image,
  );

  return {
    title: `${metadata.title} Review | Product Lab`,
    description,
    alternates: { canonical: `/articles/${slug}` },
    openGraph: {
      title: `${metadata.title} Review | Product Lab`,
      description,
      type: 'article',
      url: canonicalUrl(`/articles/${slug}`),
      ...(imageUrl ? { images: [{ url: imageUrl }] } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title: `${metadata.title} Review | Product Lab`,
      description,
    },
  };
}

export async function generateStaticParams() {
  const slugs = getAllPostSlugs();
  return slugs.map((slug: string) => ({
    slug: slug,
  }));
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const { metadata, content } = post;
  const formattedDate = formatArticleDate(metadata.date);
  const calculatedOverallScore = calculateOverallScore(metadata.ratingBreakdown);
  const starRating = scoreToStarRating(calculatedOverallScore);
  const showRating = hasRatingData(metadata);

  const processedContent = processMarkdownContent(content);

  // Images distributed through the article body already carry their own credit
  // line, so repeating them in the thumbnail strip is pure duplication.
  const unplacedGallery = (metadata.gallery ?? []).filter(
    (image) => !processedContent.includes(image.src),
  );
  const category = metadata.category ? getCategoryByContentDir(metadata.category) : undefined;

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    ...(category ? [{ label: category.shortName, href: `/best/${category.slug}` }] : []),
    { label: metadata.title },
  ];

  // The sticky bar needs a single primary destination; retailerLinks is an
  // ordered map, so the first entry is the preferred retailer.
  const primaryRetailer = metadata.retailerLinks
    ? Object.entries(metadata.retailerLinks)[0]
    : undefined;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Review',
    name: metadata.title,
    description: metadata.subtitle ?? undefined,
    author: {
      '@type': 'Person',
      name: metadata.author ?? 'Product Lab Team',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Product Lab',
      url: SITE_URL,
    },
    datePublished: metadata.date,
    reviewRating: showRating
      ? {
          '@type': 'Rating',
          ratingValue: starRating,
          bestRating: 5,
          worstRating: 0,
        }
      : undefined,
    itemReviewed: {
      '@type': 'Product',
      name: metadata.title,
      ...(resolvePublicImage(metadata.productImage)
        ? { image: resolvePublicImage(metadata.productImage) }
        : {}),
    },
    url: canonicalUrl(`/articles/${slug}`),
  };

  return (
    <main className="w-full py-5">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Hero Section */}
      <Breadcrumb items={breadcrumbItems} />

      <header className="mb-5 mt-4 overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-featured">
        <div className="bg-gradient-to-br from-primary-lightest via-white to-neutral-50 p-5 md:p-7">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded bg-accent px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.08em] text-white">
                Product Review
              </span>
              {category && (
                <a
                  href={`/best/${category.slug}`}
                  className="type-label text-primary hover:text-accent"
                >
                  {category.name}
                </a>
              )}
            </div>
            <span className="text-sm font-medium text-neutral-500">{formattedDate}</span>
          </div>
          <h1 className="mt-3 max-w-4xl font-display text-4xl font-semibold leading-tight tracking-tight text-neutral-900 md:text-5xl">
            {metadata.title}
          </h1>
          {metadata.subtitle && (
            <p className="mt-3 max-w-3xl text-lg leading-relaxed text-neutral-600">
              {metadata.subtitle}
            </p>
          )}
        </div>
      </header>

      {/* TOP AD - High visibility */}
      <AdBanner
        adSlot={ADSENSE_CONFIG.adSlots.articleTop}
        adFormat="rectangle"
        className="mb-4 text-center"
      />

      {/* Product Image */}
      {metadata.productImage && <ProductImage src={metadata.productImage} alt={metadata.title} />}
      {unplacedGallery.length > 0 && (
        <ProductGallery images={unplacedGallery} alt={metadata.title} />
      )}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        {/* Main Content Area */}
        <div className="lg:col-span-3">
          {/* Product Info Box */}
          <aside className="mb-5 rounded-xl border border-neutral-200 bg-white p-4 shadow-featured">
            <div className="w-full space-y-4">
              {/* Rating Breakdown ScoreCard: single unified section with the
                  overall Product Lab Rating (5-point scale) and metric bars,
                  replacing the previously separate star-rating box. */}
              {metadata.ratingBreakdown && (
                <div className="rounded-xl">
                  <ScoreCard
                    calculatedOverallScore={calculatedOverallScore}
                    metrics={metadata.ratingBreakdown.metrics}
                  />
                </div>
              )}

              {/* Compact Price & Specs Side by Side on larger screens */}
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_2fr]">
                {/* Retailer Links */}
                {metadata.retailerLinks && (
                  <RetailerLinks
                    retailerLinks={metadata.retailerLinks}
                    productName={metadata.title}
                  />
                )}

                {/* Specifications */}
                <ProductSpecs specs={metadata.specs} />
              </div>
            </div>
          </aside>

          {/* Pros & Cons */}
          <ProsCons pros={metadata.pros} cons={metadata.cons} />

          {/* MID-ARTICLE AD - Best performing */}
          <AdBanner
            adSlot={ADSENSE_CONFIG.adSlots.articleMid}
            adFormat="rectangle"
            className="my-6 text-center"
          />

          {/* Main Review Content */}
          <ArticleContent
            content={processedContent}
            publishDate={formattedDate}
            author={metadata.author}
          />

          {/* BOTTOM AD - Good for engagement */}
          <AdBanner
            adSlot={ADSENSE_CONFIG.adSlots.articleBottom}
            adFormat="rectangle"
            className="mt-6 text-center"
          />

          {/* Author Bio */}
          {metadata.authorBio && (
            <AuthorBio authorBio={metadata.authorBio} authorName={metadata.author} />
          )}

          {/* Terminal CTA: a reader who finishes the review should land on the
              buying guide for the category, not on a dead end. */}
          {category && (
            <a
              href={`/best/${category.slug}`}
              className="mt-6 flex items-center justify-between gap-4 rounded-xl border border-primary/20 bg-primary/5 p-4 transition-colors hover:bg-primary/10"
            >
              <span>
                <span className="block text-xs font-semibold uppercase tracking-wider text-primary">
                  Keep comparing
                </span>
                <span className="mt-1 block text-sm font-medium text-neutral-800">
                  See how this ranks in our {category.name.toLowerCase()} guide
                </span>
              </span>
              <span aria-hidden="true" className="text-xl text-primary">
                →
              </span>
            </a>
          )}

          <div className="mt-6">
            <AffiliateDisclosure variant="box" />
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-28 space-y-6">
            {/* On-page navigation comes first: these reviews are long, and a
                reader who cannot see the structure will scan and leave. */}
            <TableOfContents contentHtml={processedContent} />

            {/* Related Articles */}
            <RelatedArticles
              currentArticleSlug={slug}
              category={metadata.category}
              title={metadata.title}
              limit={5}
            />

            <Newsletter />

            {/* SIDEBAR AD */}
            <AdBanner
              adSlot={ADSENSE_CONFIG.adSlots.sidebar}
              adFormat="vertical"
              className="mb-4"
            />
          </div>
        </div>
      </div>

      {primaryRetailer && (
        <StickyBuyBar
          productName={metadata.title}
          primaryRetailerName={primaryRetailer[0]}
          primaryRetailerUrl={primaryRetailer[1]}
        />
      )}
    </main>
  );
}
