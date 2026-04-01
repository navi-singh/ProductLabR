'use client';

import { useEffect, useState } from 'react';

interface ArticleContentProps {
  content: string;
  publishDate?: string;
  author?: string;
}

function estimateReadingTime(content: string): number {
  const text = content.replace(/<[^>]*>/g, '');
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

export default function ArticleContent({ content }: ArticleContentProps) {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight > 0) setScrollProgress((scrollTop / docHeight) * 100);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const readingTime = estimateReadingTime(content);

  return (
    <div className="relative">
      {/* Reading progress bar — below the sticky nav (top-[52px]) */}
      <div className="fixed left-0 top-[52px] z-40 h-0.5 w-full bg-neutral-200">
        <div
          className="h-full bg-primary transition-[width] duration-150 ease-out"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Reading time chip */}
      <div className="mb-5 flex items-center gap-1.5 text-xs text-neutral-400">
        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
        </svg>
        {readingTime} min read
      </div>

      {/* Article body */}
      <article
        className="article-body"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </div>
  );
}
