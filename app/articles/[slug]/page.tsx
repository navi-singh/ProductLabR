import React from 'react';
import { resolvePublicImage } from '@/lib/resolve-image';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPostBySlug, getAllPostSlugs } from '../../../lib/Posts';
import { processMarkdownContent } from '../../../lib/markdown';
import { calculateOverallScore, scoreToStarRating, formatArticleDate, hasRatingData } from '../../../lib/articleUtils';

// Components
import ScoreCard from '../../../components/article/ScoreCard';
import StarRating from '../../../components/article/StarRating';
import RatingBadge from '../../../components/article/RatingBadge';
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
import { SITE_URL } from '../../../lib/site-url';

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
  const description =
    metadata.subtitle || `Expert review of the ${metadata.title} by Product Lab.`;
  const imageUrl = resolvePublicImage(
    metadata.productImage || metadata.heroImage || metadata.image
  );

  return {
    title: `${metadata.title} Review | Product Lab`,
    description,
    alternates: { canonical: `/articles/${slug}` },
    openGraph: {
      title: `${metadata.title} Review | Product Lab`,
      description,
      type: 'article',
      url: `${SITE_URL}/articles/${slug}`,
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

export default async function ArticlePage({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}) {
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
    (image) => !processedContent.includes(image.src)
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
      ...(resolvePublicImage(metadata.productImage) ? { image: resolvePublicImage(metadata.productImage) } : {}),
    },
    url: `${SITE_URL}/articles/${slug}`,
  };

return (
    <main className="w-full px-3 py-4">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Hero Section */}
      <Breadcrumb items={breadcrumbItems} />

      <header className="mb-3 mt-4">
        <h1 className="text-3xl md:text-4xl font-bold mb-2 leading-tight">{metadata.title}</h1>
        {metadata.subtitle && (
          <h2 className="text-lg text-slate-600 mb-2">{metadata.subtitle}</h2>
        )}
        <div className="flex flex-wrap items-center gap-2 text-sm text-slate-400 mb-2">
          {metadata.author && <span>By {metadata.author}</span>}
          <span>• {formattedDate}</span>
          {category && (
            <>
              <span>•</span>
              <a href={`/best/${category.slug}`} className="text-primary hover:underline">
                {category.name}
              </a>
            </>
          )}
        </div>
        <AffiliateDisclosure />
      </header>

      {/* TOP AD - High visibility */}
      <AdBanner 
        adSlot={ADSENSE_CONFIG.adSlots.articleTop}
        adFormat="rectangle"
        className="mb-4 text-center"
      />

      {/* Product Image */}
      {metadata.productImage && (
        <ProductImage
          src={metadata.productImage}
          alt={metadata.title}
        />
      )}
      {unplacedGallery.length > 0 && (
        <ProductGallery images={unplacedGallery} alt={metadata.title} />
      )}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Main Content Area */}
        <div className="lg:col-span-3">
          {/* Product Info Box */}
          <aside className="mb-3 bg-white border border-primary/20 rounded-xl p-2 shadow-md">
            <div className="w-full space-y-1.5">
              {/* Product Rating */}
              <div className="text-center bg-gradient-to-r from-primary/10 to-primary/30 rounded-lg p-2 border border-primary/20">
                {showRating && (
                  <div className="flex flex-wrap items-center justify-center gap-2 md:gap-4">
                    {/* Rating Badge */}
                    <div className="inline-flex items-center bg-primary text-white rounded-full px-4 py-2 font-semibold text-sm md:text-base">
                      <span>Product Lab Rating</span>
                    </div>
                    
                    {/* Star Rating Display */}
                    <StarRating 
                      rating={starRating} 
                      size="md"
                      animated={true}
                      showBreakdown={false}
                    />
                    
                    {/* Rating Description */}
                    <RatingBadge 
                      rating={starRating} 
                      isEditorChoice={starRating >= 4.5}
                    />
                  </div>
                )}
              </div>
              
              {/* Rating Breakdown ScoreCard */}
              {metadata.ratingBreakdown && (
                <div className="rounded-xl">
                  <ScoreCard
                    calculatedOverallScore={calculatedOverallScore}
                    metrics={metadata.ratingBreakdown.metrics}
                  />
                </div>
              )}

              {/* Compact Price & Specs Side by Side on larger screens */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-1.5">
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
            <AuthorBio
              authorBio={metadata.authorBio}
              authorName={metadata.author}
            />
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
          <div className="sticky top-6 space-y-6">
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
