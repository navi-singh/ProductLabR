'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
  { label: 'Laptops',    href: '/best/laptops'   },
  { label: 'TVs',        href: '/best/tvs'        },
  { label: 'Headphones', href: '/best/headphones' },
];

export function Header({ posts = [] }: HeaderProps) {
  const pathname = usePathname();

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
          </nav>
        </div>

        <div className="hidden md:block">
          <SearchBar posts={posts} variant="header" />
        </div>
      </div>
    </header>
  );
}
