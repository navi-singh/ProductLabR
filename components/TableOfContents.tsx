'use client';

import { useState, useEffect } from 'react';

interface TocItem {
  id: string;
  text: string;
}

interface TableOfContentsProps {
  contentHtml: string;
}

export function TableOfContents({ contentHtml }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState('');

  const headings: TocItem[] = [];
  const regex = /<h2[^>]*id="([^"]*)"[^>]*>(.*?)<\/h2>/gi;
  let match;
  while ((match = regex.exec(contentHtml)) !== null) {
    headings.push({ id: match[1], text: match[2].replace(/<[^>]*>/g, '') });
  }

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        });
      },
      { rootMargin: '-80px 0px -60% 0px' },
    );
    headings.forEach((h) => {
      const el = document.getElementById(h.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (headings.length === 0) return null;

  return (
    <nav className="rounded-lg border border-neutral-200 bg-white p-4">
      <h3 className="mb-2.5 text-xs font-semibold uppercase tracking-wider text-primary">In This Review</h3>
      <ul className="space-y-1">
        {headings.map((h) => (
          <li key={h.id}>
            <a
              href={`#${h.id}`}
              className={`block py-1 text-xs transition-colors ${
                activeId === h.id
                  ? 'border-l-2 border-primary pl-2.5 font-medium text-neutral-900'
                  : 'pl-3 text-neutral-500 hover:text-primary'
              }`}
            >
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
