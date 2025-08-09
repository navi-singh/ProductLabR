import Image from 'next/image';
import React from 'react';
import { notFound } from 'next/navigation';
import { getPostBySlug, getAllPostSlugs } from '../../../lib/Posts';
import { processMarkdownContent } from '../../../lib/markdown';
import { calculateOverallScore, scoreToStarRating, formatArticleDate, hasRatingData } from '../../../lib/articleUtils';

// Components
import ScoreCard from '../../../components/article/ScoreCard';
import StarRating from '../../../components/article/StarRating';
import RatingBadge from '../../../components/article/RatingBadge';
import ProductSpecs from '../../../components/article/ProductSpecs';
import ProsCons from '../../../components/article/ProsCons';
import ProductImage from '../../../components/article/ProductImage';
import RetailerLinks from '../../../components/article/PriceButton';
import ArticleContent from '../../../components/article/ArticleContent';
import AuthorBio from '../../../components/article/AuthorBio';

export async function generateStaticParams() {
  const slugs = getAllPostSlugs();
  return slugs.map((slug: string) => ({
    slug: slug,
  }));
}

export default function ArticlePage({ 
  params 
}: { 
  params: { slug: string } 
}) {
  const post = getPostBySlug(params.slug);
  
  if (!post) {
    notFound();
  }

  const { metadata, content } = post;
  const formattedDate = formatArticleDate(metadata.date);
  const calculatedOverallScore = calculateOverallScore(metadata.ratingBreakdown);
  const starRating = scoreToStarRating(calculatedOverallScore);
  const showRating = hasRatingData(metadata);

return (
    <main className="w-full px-4 py-6">
      {/* Hero Section */}
      <header className="mb-4">
        <h1 className="text-3xl md:text-4xl font-bold mb-2 leading-tight">{metadata.title}</h1>
        {metadata.subtitle && (
          <h2 className="text-lg text-slate-600 mb-2">{metadata.subtitle}</h2>
        )}
        <div className="flex flex-wrap items-center gap-2 text-sm text-slate-400 mb-2">
          {metadata.author && <span>By {metadata.author}</span>}
          <span>• {formattedDate}</span>
        </div>
      </header>

      {/* Product Image */}
      {metadata.productImage && (
        <ProductImage
          src={metadata.productImage}
          alt={metadata.title}
        />
      )}

      {/* Product Info Box */}
      <aside className="mb-4 bg-white border-2 border-trustworthy/20 rounded-2xl p-2 shadow-lg">
        <div className="w-full space-y-2">
          {/* Product Rating */}
          <div className="text-center bg-gradient-to-r from-trustworthy/10 to-trustworthy/30 rounded-xl p-3 border border-trustworthy/20">
            {showRating && (
              <div className="flex flex-wrap items-center justify-center gap-3 md:gap-6">
                {/* Rating Badge */}
                <div className="inline-flex items-center bg-trustworthy text-white rounded-full px-4 py-2 font-semibold text-sm md:text-base">
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
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

      {/* Main Review Content */}
      <ArticleContent 
        content={processMarkdownContent(content)} 
        publishDate={formattedDate}
        author={metadata.author}
      />
  
      {/* Author Bio */}
      {metadata.authorBio && (
        <AuthorBio 
          authorBio={metadata.authorBio}
          authorName={metadata.author || "ProductLab Editorial Team"}
          authorTitle="Product Review Specialist"
        />
      )}
    </main>
  );
}
