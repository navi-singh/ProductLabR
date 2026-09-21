'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Beaker, Search, X } from 'lucide-react';
import { SearchBar } from './SearchBar';
import { CategoryDropdown } from './CategoryDropdown';
import { NAV_CATEGORIES } from '@/lib/nav-categories';

interface SearchPost {
  title: string;
  slug: string;
  category?: string;
}

interface HeaderProps {
  posts?: SearchPost[];
}

const NAV_LINKS = [
  { label: 'Power Stations', href: '/best/power-stations' },
  { label: 'Headphones', href: '/best/headphones' },
  { label: 'TVs', href: '/best/tvs' },
  { label: 'Cameras', href: '/best/cameras' },
];

export function Header({ posts = [] }: HeaderProps) {
  const pathname = usePathname();
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-primary text-white shadow-[0_1px_12px_rgba(10,37,64,0.16)]">
      <div className="mx-auto flex max-w-content items-center justify-between gap-5 px-4 py-3 sm:px-6">
        <div className="flex min-w-0 items-center gap-7">
          <Link
            href="/"
            className="group flex shrink-0 items-center gap-2.5"
            aria-label="Product Lab home"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-white shadow-sm transition-transform group-hover:-translate-y-0.5">
              <Beaker className="h-5 w-5" aria-hidden="true" />
            </span>
            <span className="flex flex-col leading-none">
              <span className="text-base font-extrabold tracking-[0.12em]">PRODUCT LAB</span>
              <span className="mt-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-primary-light">
                Independent Testing
              </span>
            </span>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary navigation">
            {NAV_LINKS.map((link) => {
              const active = pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`rounded-lg px-3 py-2 text-[13px] font-semibold transition-colors ${
                    active
                      ? 'bg-white/12 text-white'
                      : 'text-white/75 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            <CategoryDropdown categories={NAV_CATEGORIES} />
            <Link
              href="/compare"
              className={`rounded-lg px-3 py-2 text-[13px] font-semibold transition-colors ${
                pathname.startsWith('/compare')
                  ? 'bg-white/12 text-white'
                  : 'text-white/75 hover:bg-white/10 hover:text-white'
              }`}
            >
              Compare
            </Link>
            <Link
              href="/reviews"
              className={`rounded-lg px-3 py-2 text-[13px] font-semibold transition-colors ${
                pathname.startsWith('/reviews')
                  ? 'bg-white/12 text-white'
                  : 'text-white/75 hover:bg-white/10 hover:text-white'
              }`}
            >
              All Reviews
            </Link>
          </nav>
        </div>

        <div className="hidden min-w-[280px] max-w-[390px] flex-1 md:block">
          <SearchBar posts={posts} variant="header" />
        </div>

        <button
          type="button"
          onClick={() => setIsMobileSearchOpen((open) => !open)}
          aria-expanded={isMobileSearchOpen}
          aria-controls="mobile-search-panel"
          aria-label={isMobileSearchOpen ? 'Close search' : 'Search reviews'}
          className="rounded-md p-2 text-white/90 hover:bg-white/10 hover:text-white md:hidden"
        >
          {isMobileSearchOpen ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
        </button>
      </div>

      {isMobileSearchOpen && (
        <div id="mobile-search-panel" className="border-t border-white/10 bg-white pt-3 md:hidden">
          <SearchBar posts={posts} variant="mobile" />
        </div>
      )}
    </header>
  );
}
