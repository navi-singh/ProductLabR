'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Search, X } from 'lucide-react';

interface SearchResult {
  title: string;
  slug: string;
  category?: string;
}

interface SearchBarProps {
  posts: SearchResult[];
  variant?: 'header' | 'mobile';
}

export function SearchBar({ posts, variant = 'header' }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const results = query.length >= 2
    ? posts.filter((p) =>
        p.title.toLowerCase().includes(query.toLowerCase()) ||
        (p.category ?? '').toLowerCase().includes(query.toLowerCase())
      ).slice(0, 5)
    : [];

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (variant === 'header') {
    return (
      <div ref={containerRef} className="relative">
        <div className="flex items-center rounded-md border border-white/25 bg-white/15 px-3 py-1.5">
          <Search className="mr-2 h-3.5 w-3.5 text-white/70" />
          <input
            type="text"
            placeholder="Search reviews..."
            value={query}
            onChange={(e) => { setQuery(e.target.value); setIsOpen(true); }}
            onFocus={() => setIsOpen(true)}
            className="w-36 bg-transparent text-xs text-white placeholder:text-white/60 focus:outline-none"
          />
          {query && (
            <button onClick={() => { setQuery(''); setIsOpen(false); }}>
              <X className="h-3 w-3 text-white/70" />
            </button>
          )}
        </div>
        {isOpen && query.length >= 2 && (
          <div className="absolute right-0 top-full z-50 mt-2 w-72 rounded-lg border border-neutral-200 bg-white shadow-lg">
            {results.length > 0 ? results.map((r) => (
              <Link key={r.slug} href={`/articles/${r.slug}`} onClick={() => { setIsOpen(false); setQuery(''); }} className="block px-4 py-2.5 hover:bg-primary-lightest">
                <div className="text-sm font-medium text-neutral-900">{r.title}</div>
                {r.category && <div className="text-xs text-primary">{r.category}</div>}
              </Link>
            )) : (
              <div className="px-4 py-3 text-sm text-neutral-500">
                No results for &ldquo;{query}&rdquo;
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  // Mobile variant
  return (
    <div ref={containerRef} className="relative px-4 pb-3">
      <div className="flex items-center rounded-md border border-neutral-200 bg-neutral-100 px-3 py-2.5">
        <Search className="mr-2 h-4 w-4 text-neutral-500" />
        <input
          type="text"
          placeholder="Search reviews..."
          value={query}
          onChange={(e) => { setQuery(e.target.value); setIsOpen(true); }}
          onFocus={() => setIsOpen(true)}
          className="flex-1 bg-transparent text-sm text-neutral-900 placeholder:text-neutral-500 focus:outline-none"
        />
      </div>
      {isOpen && query.length >= 2 && (
        <div className="mt-1 rounded-lg border border-neutral-200 bg-white shadow-lg">
          {results.length > 0 ? results.map((r) => (
            <Link key={r.slug} href={`/articles/${r.slug}`} onClick={() => { setIsOpen(false); setQuery(''); }} className="block px-4 py-2.5 hover:bg-primary-lightest">
              <div className="text-sm font-medium text-neutral-900">{r.title}</div>
              {r.category && <div className="text-xs text-primary">{r.category}</div>}
            </Link>
          )) : (
            <div className="px-4 py-3 text-sm text-neutral-500">
              No results for &ldquo;{query}&rdquo;
            </div>
          )}
        </div>
      )}
    </div>
  );
}
