import React from 'react';
import Image from 'next/image';

export interface ArticleReviewProps {
  heroImage: string;
  productImage?: string;
  title: string;
  subtitle?: string;
  author?: string;
  date?: string;
  specs?: Record<string, string>;
  pros?: string[];
  cons?: string[];
  reviewText: string; // markdown or plain text with headings
  authorBio?: string;
}

export const ArticleReview: React.FC<ArticleReviewProps> = ({
  heroImage,
  productImage,
  title,
  subtitle,
  author,
  date,
  specs,
  pros,
  cons,
  reviewText,
  authorBio,
}) => {
  return (
    <main className="max-w-3xl mx-auto px-4 py-8">
      {/* Hero Section */}
      <header className="mb-8">
        <div className="w-full aspect-video relative mb-4 rounded-2xl overflow-hidden">
          <Image
            src={heroImage}
            alt={title}
            fill
            className="object-cover"
            priority
          />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold mb-2 leading-tight">{title}</h1>
        {subtitle && <h2 className="text-lg text-slate-600 mb-2">{subtitle}</h2>}
        <div className="flex flex-wrap items-center gap-2 text-sm text-slate-400 mb-2">
          {author && <span>By {author}</span>}
          {date && <span>• {date}</span>}
        </div>
      </header>

      {/* Product Info Box */}
      {(productImage || specs) && (
        <aside className="mb-8 bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col md:flex-row gap-6 items-center">
          {productImage && (
            <div className="w-40 h-40 relative flex-shrink-0">
              <Image
                src={productImage}
                alt={title}
                fill
                className="object-contain rounded-xl"
              />
            </div>
          )}
          {specs && (
            <div className="flex-1 w-full">
              <ul className="mb-2 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-1 text-sm">
                {Object.entries(specs).map(([key, value]) => (
                  <li key={key}><span className="font-semibold capitalize">{key}:</span> {String(value)}</li>
                ))}
              </ul>
            </div>
          )}
        </aside>
      )}

      {/* Main Review Content */}
      <article className="prose prose-lg max-w-none mb-8">
        {reviewText.split('\n').map((para, i) => (
          para.trim().startsWith('###') ? <h3 key={i}>{para.replace('### ', '')}</h3> : <p key={i}>{para}</p>
        ))}
      </article>

      {/* Pros & Cons */}
      {(pros || cons) && (
        <section className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          {pros && (
            <div>
              <h3 className="font-bold text-green-700 mb-2">Pros</h3>
              <ul className="list-disc pl-5 space-y-1">
                {pros.map((p, i) => <li key={i}>{p}</li>)}
              </ul>
            </div>
          )}
          {cons && (
            <div>
              <h3 className="font-bold text-red-700 mb-2">Cons</h3>
              <ul className="list-disc pl-5 space-y-1">
                {cons.map((c, i) => <li key={i}>{c}</li>)}
              </ul>
            </div>
          )}
        </section>
      )}

      {/* Author Bio */}
      {authorBio && (
        <footer className="mt-12 border-t pt-6 text-sm text-slate-500">
          <div className="font-semibold mb-1">About the author</div>
          <div>{authorBio}</div>
        </footer>
      )}
    </main>
  );
};
