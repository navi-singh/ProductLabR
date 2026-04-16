import { Breadcrumb } from '@/components/Breadcrumb';
import { VerdictBox } from '@/components/VerdictBox';
import { BuyBox } from '@/components/BuyBox';
import { StickyBuyBar } from '@/components/StickyBuyBar';
import { TableOfContents } from '@/components/TableOfContents';
import AdBanner from '@/components/ads/AdBanner';
import { ADSENSE_CONFIG } from '@/lib/adsense-config';
import ProductImage from '@/components/article/ProductImage';
import { ProsCons } from '@/components/article/ProsCons';
import { ProductSpecs } from '@/components/article/ProductSpecs';
import ArticleContent from '@/components/article/ArticleContent';
import { RelatedArticles } from '@/components/article/RelatedArticles';
import { AuthorBio } from '@/components/article/AuthorBio';
import { processMarkdownContent } from '@/lib/markdown';
import { calculateOverallScore } from '@/lib/articleUtils';
import { getCategoryDisplayName } from '@/lib/Posts';
import type { PostMetadata } from '@/components/PostMetadata';

interface ArticlePageProps {
  metadata: PostMetadata;
  content: string;
}

export default function ArticlePage({ metadata, content }: ArticlePageProps) {
  const processedContent = processMarkdownContent(content);
  const overallScore = metadata.ratingBreakdown
    ? calculateOverallScore(metadata.ratingBreakdown)
    : null;
  const categoryDisplay = metadata.category
    ? getCategoryDisplayName(metadata.category)
    : null;

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    ...(metadata.category
      ? [{ label: categoryDisplay || metadata.category, href: `/best/${metadata.category}` }]
      : []),
    { label: metadata.title },
  ];

  const verdict = metadata.subtitle || `A comprehensive look at the ${metadata.title}.`;

  return (
    <>
      {/* Breadcrumb -- full width */}
      <div className="-mx-4 sm:-mx-6">
        <Breadcrumb items={breadcrumbItems} />
      </div>

      {/* Article Header */}
      <div className="-mx-4 bg-gradient-to-b from-primary-lightest to-neutral-50 px-4 pb-5 pt-7 sm:-mx-6 sm:px-6">
        <div className="max-w-[780px]">
          <div className="flex items-center gap-2">
            <span className="rounded bg-primary px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-white">
              Review
            </span>
            {categoryDisplay && (
              <span className="text-xs font-medium text-primary">{categoryDisplay}</span>
            )}
          </div>
          <h1 className="mt-2 text-2xl font-bold leading-tight tracking-tight text-neutral-900 md:text-[28px]">
            {metadata.title}
          </h1>
          {metadata.subtitle && (
            <p className="mt-2 text-[15px] leading-relaxed text-neutral-500">{metadata.subtitle}</p>
          )}
          <div className="mt-3 flex items-center gap-4 text-xs text-neutral-400">
            {metadata.author && (
              <span>By <strong className="text-neutral-700">{metadata.author}</strong></span>
            )}
            {metadata.date && <span>Updated {metadata.date}</span>}
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-[7fr_3fr]">
        {/* Main Article Column */}
        <div className="min-w-0">
          {overallScore && metadata.ratingBreakdown && (
            <VerdictBox
              overallScore={overallScore}
              verdict={verdict}
              metrics={metadata.ratingBreakdown.metrics}
            />
          )}

          {(metadata.productImage || metadata.image) && (
            <div className="mt-5">
              <ProductImage
                src={metadata.productImage || metadata.image || ''}
                alt={metadata.title}
              />
            </div>
          )}

          {metadata.retailerLinks && (
            <div className="mt-5">
              <BuyBox
                price={metadata.price}
                retailerLinks={metadata.retailerLinks}
                productName={metadata.title}
              />
            </div>
          )}

          {(metadata.pros || metadata.cons) && (
            <div className="mt-5">
              <ProsCons pros={metadata.pros} cons={metadata.cons} />
            </div>
          )}

          {metadata.specs && (
            <div className="mt-5">
              <ProductSpecs specs={metadata.specs} />
            </div>
          )}

          <div className="mt-6">
            <ArticleContent
              content={processedContent}
              publishDate={metadata.date}
              author={metadata.author}
            />
          </div>

          <div className="my-6">
            <AdBanner adSlot={ADSENSE_CONFIG.adSlots.articleMid} adFormat="auto" />
          </div>

          {metadata.authorBio && (
            <AuthorBio authorBio={metadata.authorBio} authorName={metadata.author} />
          )}
        </div>

        {/* Sidebar */}
        <aside className="hidden lg:block">
          <div className="sticky top-20 space-y-4">
            <TableOfContents contentHtml={processedContent} />
            <AdBanner adSlot={ADSENSE_CONFIG.adSlots.sidebar} adFormat="rectangle" />
            <RelatedArticles
              currentArticleSlug={metadata.slug}
              category={metadata.category}
            />
          </div>
        </aside>
      </div>

      {metadata.retailerLinks && Object.keys(metadata.retailerLinks).length > 0 && (() => {
        const [primaryRetailerName, primaryRetailerUrl] = Object.entries(metadata.retailerLinks!)[0];
        return (
          <StickyBuyBar
            productName={metadata.title}
            price={metadata.price}
            primaryRetailerName={primaryRetailerName}
            primaryRetailerUrl={primaryRetailerUrl}
          />
        );
      })()}
    </>
  );
}
