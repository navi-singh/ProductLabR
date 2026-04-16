import React from 'react';
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
import RetailerLinks from '../../../components/article/PriceButton';
import ArticleContent from '../../../components/article/ArticleContent';
import { AuthorBio } from '../../../components/article/AuthorBio';
import { RelatedArticles } from '../../../components/article/RelatedArticles';
import AdBanner from '../../../components/ads/AdBanner';
import { ADSENSE_CONFIG } from '../../../lib/adsense-config';

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
  const imageUrl = metadata.productImage || metadata.heroImage || metadata.image;

  return {
    title: `${metadata.title} Review | Product Lab`,
    description,
    openGraph: {
      title: `${metadata.title} Review | Product Lab`,
      description,
      type: 'article',
      url: `https://productlab.com/articles/${slug}`,
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
      url: 'https://productlab.com',
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
      ...(metadata.productImage ? { image: metadata.productImage } : {}),
    },
    url: `https://productlab.com/articles/${slug}`,
  };

return (
    <main className="w-full px-3 py-4">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Hero Section */}
      <header className="mb-3">
        <h1 className="text-3xl md:text-4xl font-bold mb-2 leading-tight">{metadata.title}</h1>
        {metadata.subtitle && (
          <h2 className="text-lg text-slate-600 mb-2">{metadata.subtitle}</h2>
        )}
        <div className="flex flex-wrap items-center gap-2 text-sm text-slate-400 mb-2">
          {metadata.author && <span>By {metadata.author}</span>}
          <span>• {formattedDate}</span>
        </div>
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
            content={processMarkdownContent(content)} 
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
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-6 space-y-6">
            {/* SIDEBAR AD - Sticky potential */}
            <AdBanner 
              adSlot={ADSENSE_CONFIG.adSlots.sidebar}
              adFormat="vertical"
              className="mb-4"
            />
            {/* Related Articles */}
            <RelatedArticles 
              currentArticleSlug={slug}
              category={metadata.category}
              limit={4}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
