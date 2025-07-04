import Image from 'next/image';
import React from 'react';
import { notFound } from 'next/navigation';
import { getPostBySlug, getAllPostSlugs } from '../../../lib/Posts';
import { processMarkdownContent } from '../../../lib/markdown';

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
  const formattedDate = new Date(metadata.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

return (
    <main className="w-full md:w-3/4 ml-0 md:ml-8 px-4 py-8">
      {/* Hero Section */}
      <header className="mb-8">
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
        <div className="mb-4">
          <div className="relative w-full aspect-[2/1] bg-gray-50 rounded-xl overflow-hidden">
            <Image
              src={metadata.productImage}
              alt={metadata.title}
              fill
              className="object-cover w-full h-full"
              sizes="100vw"
              priority
            />
          </div>
        </div>
      )}

      {/* Product Info Box */}
      <aside className="mb-8 bg-white border-2 border-trustworthy/20 rounded-2xl p-6 shadow-lg">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Product Details */}
          <div className="w-full space-y-8">
            {/* Product Rating */}
            <div className="text-center bg-gradient-to-r from-trustworthy/10 to-trustworthy/30 rounded-xl p-6 border border-trustworthy/20">
              
              {metadata.rating && (
                <div className="flex flex-wrap items-center justify-center gap-3 md:gap-6">
                  {/* Rating Badge */}
                  <div className="inline-flex items-center bg-trustworthy text-white rounded-full px-4 py-2 font-semibold text-sm md:text-base">
                    <span>Product Lab Rating</span>
                  </div>
                  
                  {/* Star Rating Display */}
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => {
                      const starValue = (metadata.rating || 0);
                      const isFilled = i < Math.floor(starValue);
                      const isHalfFilled = i === Math.floor(starValue) && starValue % 1 >= 0.5;
                      
                      return (
                        <div key={i} className="relative text-xl md:text-2xl">
                          {isFilled ? (
                            <span className="text-yellow-400">★</span>
                          ) : isHalfFilled ? (
                            <>
                              <span className="text-gray-300">★</span>
                              <span 
                                className="absolute left-0 top-0 text-yellow-400 overflow-hidden" 
                                style={{ width: '50%' }}
                              >
                                ★
                              </span>
                            </>
                          ) : (
                            <span className="text-gray-300">★</span>
                          )}
                        </div>
                      );
                    })}
                    <span className="ml-2 text-sm text-gray-600 font-medium">
                      ({metadata.rating}/5)
                    </span>
                  </div>
                  
                  {/* Rating Description */}
                  <div className="text-sm md:text-base">
                    {metadata.rating >= 4.5 ? (
                      <span className="text-green-600 font-semibold">★ Exceptional Product</span>
                    ) : metadata.rating >= 4 ? (
                      <span className="text-trustworthy font-semibold">⭐ Highly Recommended</span>
                    ) : metadata.rating >= 3 ? (
                      <span className="text-orange-600 font-semibold">👍 Good Choice</span>
                    ) : (
                      <span className="text-red-600 font-semibold">⚠️ Consider Alternatives</span>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Price & Buy Button */}
            {metadata.price && (
              <div className="bg-trustworthy/10 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Price</p>
                    <p className="text-2xl font-bold text-trustworthy">{metadata.price}</p>
                  </div>
                  <button className="bg-trustworthy hover:bg-trustworthy/80 text-white font-semibold px-6 py-3 rounded-lg transition-colors">
                    VIEW PRODUCT
                  </button>
                </div>
              </div>
            )}

            {/* Specifications */}
            {metadata.specs && (
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Specifications</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
                  {Object.entries(metadata.specs).map(([key, value]) => (
                    <div key={key} className="flex justify-between border-b border-gray-100 pb-1">
                      <span className="font-medium text-gray-700">{key}:</span>
                      <span className="text-gray-600">{String(value)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Pros & Cons */}
      {(metadata.pros || metadata.cons) && (
        <section className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          {metadata.pros && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
              <h3 className="font-bold text-green-700 mb-3 flex items-center">
                <span className="mr-2">✓</span>
                Pros
              </h3>
              <ul className="space-y-2">
                {metadata.pros.map((pro: string, i: number) => (
                  <li key={i} className="flex items-start">
                    <span className="text-green-600 mr-2 mt-1">•</span>
                    <span className="text-green-800">{pro}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {metadata.cons && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <h3 className="font-bold text-red-700 mb-3 flex items-center">
                <span className="mr-2">✗</span>
                Cons
              </h3>
              <ul className="space-y-2">
                {metadata.cons.map((con: string, i: number) => (
                  <li key={i} className="flex items-start">
                    <span className="text-red-600 mr-2 mt-1">•</span>
                    <span className="text-red-800">{con}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>
      )}

      {/* Main Review Content */}
      <article className="prose prose-lg max-w-none mb-8">
        <div 
          className="text-gray-700 leading-relaxed prose-img:mx-auto prose-img:max-w-xl prose-img:rounded-xl"
          dangerouslySetInnerHTML={{ __html: processMarkdownContent(content) }}
        />
      </article>

      {/* Author Bio */}
      {metadata.authorBio && (
        <footer className="mt-12 border-t pt-6 text-sm text-slate-500">
          <div className="font-semibold mb-1">About the author</div>
          <div>{metadata.authorBio}</div>
        </footer>
      )}
    </main>
  );
}
