'use client';

import React, { useEffect, useState } from 'react';
import { ClockIcon, CalendarIcon, UserIcon, CheckCircleIcon } from '../../lib/icons';

interface ArticleContentProps {
  content: string;
  publishDate?: string;
  author?: string;
}

// Reading time estimation (approximately 200 words per minute)
const estimateReadingTime = (content: string): number => {
  const wordsPerMinute = 200;
  const textContent = content.replace(/<[^>]*>/g, ''); // Strip HTML tags
  const wordCount = textContent.trim().split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
};

export default function ArticleContent({ content, publishDate, author }: ArticleContentProps) {
  const [readingTime, setReadingTime] = useState<number>(0);
  const [scrollProgress, setScrollProgress] = useState<number>(0);

  useEffect(() => {
    setReadingTime(estimateReadingTime(content));

    const updateScrollProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollTop / docHeight;
      setScrollProgress(progress * 100);
    };

    window.addEventListener('scroll', updateScrollProgress);
    return () => window.removeEventListener('scroll', updateScrollProgress);
  }, [content]);

  return (

    <div className="relative">
      {/* Reading Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-gray-200 z-50">
        <div 
          className="h-full bg-gradient-to-r from-trustworthy to-blue-600 transition-all duration-300 ease-out"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Article Meta Information - Moved to Top */}
      <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-gray-50 rounded-lg border-l-4 border-trustworthy">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-4 text-sm text-gray-600">
            {/* Reading Time */}
            <div className="flex items-center gap-2">
              <ClockIcon />
              <span className="font-medium">{readingTime} min read</span>
            </div>
            
            {/* Publication Date */}
            {publishDate && (
              <div className="flex items-center gap-2">
                <CalendarIcon />
                <span className="font-medium">{publishDate}</span>
              </div>
            )}

            {/* Author */}
            {author && (
              <div className="flex items-center gap-2">
                <UserIcon />
                <span className="font-medium">By {author}</span>
              </div>
            )}
          </div>
          
          <div className="text-xs text-gray-500 flex items-center gap-1">
            <span>📖</span>
            <span>In-depth review</span>
          </div>
        </div>
      </div>

      {/* Enhanced Article Content */}
      <article className="prose prose-md max-w-none mb-8">
        <div 
          className="enhanced-article-content text-gray-800 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </article>

      {/* Article Footer */}
      <div className="mt-8 p-6 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-trustworthy rounded-full flex items-center justify-center">
              <CheckCircleIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-sm font-semibold text-gray-800">Expert Review Complete</div>
              <div className="text-xs text-gray-600">Thoroughly tested and analyzed</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-gray-500">Share this review</div>
            <div className="flex gap-2 mt-1">
              <button className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors">
                <span className="text-xs font-bold">f</span>
              </button>
              <button className="w-8 h-8 bg-blue-400 text-white rounded-full flex items-center justify-center hover:bg-blue-500 transition-colors">
                <span className="text-xs font-bold">t</span>
              </button>
              <button className="w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center hover:bg-red-700 transition-colors">
                <span className="text-xs font-bold">@</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 
        Custom CSS is required here because:
        1. Dynamic content from markdown needs global styles that can't be applied via className
        2. Complex pseudo-elements (::before, ::marker) require CSS-in-JS for dynamic content
        3. Advanced selectors like :first-of-type need global scope
        4. Tailwind's prose plugin would conflict with our custom design requirements
      */}
      <style jsx global>{`
        .enhanced-article-content {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }
        
        .enhanced-article-content p {
          margin-left: 2rem;
          margin-bottom: 1.5rem;
          line-height: 1.8;
          font-size: 1rem;
          color: #374151;
        }
        
        .enhanced-article-content p:first-of-type {
          font-size: 1rem;
          font-weight: normal;
          color: #374151;
          margin-bottom: 1.5rem;
        }
        
        .enhanced-article-content h1,
        .enhanced-article-content h2,
        .enhanced-article-content h3 {
          scroll-margin-top: 2rem;
        }

        
        .enhanced-article-content img {
          margin: 2rem auto;
          border-radius: 12px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
          transition: transform 0.3s ease;
        }
        
        .enhanced-article-content img:hover {
          transform: scale(1.02);
        }
        
        .enhanced-article-content blockquote {
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
          border-left: 4px solid #3b82f6;
          padding: 1.5rem;
          margin: 2rem 0;
          border-radius: 8px;
          font-style: italic;
          position: relative;
        }
        
        .enhanced-article-content blockquote::before {
          content: '"';
          font-size: 4rem;
          color: #3b82f6;
          position: absolute;
          top: -10px;
          left: 15px;
          opacity: 0.3;
        }
        
        .enhanced-article-content ul,
        .enhanced-article-content ol {
          margin: 1.5rem 0;
          padding-left: 1.5rem;
        }
        
        .enhanced-article-content li {
          margin-bottom: 0.75rem;
          line-height: 1.7;
        }
        
        .enhanced-article-content li::marker {
          color: #3b82f6;
          font-weight: bold;
        }
        
        .enhanced-article-content a {
          color: #3b82f6;
          text-decoration: none;
          border-bottom: 2px solid transparent;
          transition: border-color 0.3s ease;
        }
        
        .enhanced-article-content a:hover {
          border-bottom-color: #3b82f6;
        }
        
        .enhanced-article-content code {
          background: #f1f5f9;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.9rem;
          color: #1e293b;
        }
        
        .enhanced-article-content pre {
          background: #1e293b;
          color: #e2e8f0;
          padding: 1.5rem;
          border-radius: 8px;
          overflow-x: auto;
          margin: 2rem 0;
        }
        
        .enhanced-article-content strong {
          color: #1f2937;
          font-weight: 600;
        }
        
        .enhanced-article-content hr {
          display: none;
        }
      `}</style>
    </div>
  );
}
