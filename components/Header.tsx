'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, X } from 'lucide-react';
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

// Ordered by catalogue depth, not alphabetically: these are the categories where
// we have enough reviews to be worth a direct entry point.
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
    <header className="sticky top-0 z-50 bg-gradient-to-r from-primary to-primary-dark">
      <div className="mx-auto flex max-w-content items-center justify-between px-4 py-3 sm:px-6">
        <div className="flex items-center gap-6">
          <Link href="/" className="text-base font-bold tracking-wide text-white">
            PRODUCT LAB
          </Link>
          <nav className="hidden items-center gap-4 md:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-[13px] text-white/85 hover:text-white ${
                  pathname.startsWith(link.href) ? 'border-b-2 border-white pb-0.5' : ''
                }`}
              >
                {link.label}
              </Link>
            ))}
            <CategoryDropdown categories={NAV_CATEGORIES} />
            <Link
              href="/compare"
              className={`text-[13px] text-white/85 hover:text-white ${
                pathname.startsWith('/compare') ? 'border-b-2 border-white pb-0.5' : ''
              }`}
            >
              Compare
            </Link>
            <Link
              href="/reviews"
              className={`text-[13px] text-white/85 hover:text-white ${
                pathname.startsWith('/reviews') ? 'border-b-2 border-white pb-0.5' : ''
              }`}
            >
              All reviews
            </Link>
          </nav>
        </div>

        <div className="hidden md:block">
          <SearchBar posts={posts} variant="header" />
        </div>

        {/* Search was previously desktop-only, leaving mobile readers with no way
            to look up a product by name. */}
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
        <div id="mobile-search-panel" className="bg-white pt-3 md:hidden">
          <SearchBar posts={posts} variant="mobile" />
        </div>
      )}
    </header>
  );
}
