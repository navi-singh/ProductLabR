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
    <main className="max-w-3xl mx-auto px-4 py-8">
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
          <div className="relative aspect-square w-full max-w-md mx-auto bg-gray-50 rounded-xl overflow-hidden">
            <Image
              src={metadata.productImage}
              alt={metadata.title}
              fill
              className="object-contain p-2"
            />
          </div>
        </div>
      )}

      {/* Product Info Box */}
      <aside className="mb-8 bg-white border-2 border-gray-200 rounded-2xl p-6 shadow-lg">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Product Details */}
          <div className="w-full space-y-6">
            {/* Product Title & Rating */}
            <div>
              {/* <h3 className="text-2xl font-bold text-gray-900 mb-2">{metadata.title}</h3> */}
              {metadata.rating && (
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center">
                    <span className="text-gray-600 ml-1 text-3xl font-bold">Product Lab Rating:</span>
                    <span className="text-3xl font-bold text-blue-600">{metadata.rating}/5</span>
                    {/* <span className="text-gray-600 ml-1">/5</span> */}
                  </div>
                    <div className="flex text-yellow-400">
                    {Array.from({ length: 5 }).map((_, i) => {
                      const starValue = (metadata.rating || 0) / 2;
                      if (i < Math.floor(starValue)) {
                      return <span key={i}>★</span>;
                      } else if (i === Math.floor(starValue) && starValue % 1 >= 0.5) {
                      return (
                        <span key={i} className="relative">
                        <span className="absolute left-0 overflow-hidden" style={{ width: '50%' }}>★</span>
                        <span className="opacity-30">★</span>
                        </span>
                      );
                      } else {
                      return <span key={i} className="opacity-30">★</span>;
                      }
                    })}
                    </div>
                </div>
              )}
            </div>

            {/* Price & Buy Button */}
            {metadata.price && (
              <div className="bg-blue-50 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Price</p>
                    <p className="text-2xl font-bold text-blue-600">{metadata.price}</p>
                  </div>
                  <button className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors">
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
          className="text-gray-700 leading-relaxed"
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
