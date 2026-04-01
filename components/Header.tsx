'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { SearchBar } from './SearchBar';
import { CategoryDropdown } from './CategoryDropdown';

interface SearchPost {
  title: string;
  slug: string;
  category?: string;
}

interface HeaderProps {
  posts?: SearchPost[];
}

const navLinks = [
  { label: 'Cameras', href: '/best/cameras' },
  { label: 'Power Stations', href: '/best/power-stations' },
];

const categories = [
  { name: 'Cameras', href: '/best/cameras', count: 15 },
  { name: 'Power Stations', href: '/best/power-stations', count: 19 },
  { name: 'Knives & Tools', href: '/best', count: 1 },
];

export function Header({ posts = [] }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-primary to-primary-dark">
      <div className="mx-auto flex max-w-content items-center justify-between px-4 py-3 sm:px-6">
        <div className="flex items-center gap-6">
          <Link href="/" className="text-base font-bold tracking-wide text-white">PRODUCT LAB</Link>
          <nav className="hidden items-center gap-4 md:flex">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className={`text-[13px] text-white/85 hover:text-white ${pathname.startsWith(link.href) ? 'border-b-2 border-white pb-0.5' : ''}`}>
                {link.label}
              </Link>
            ))}
            <CategoryDropdown categories={categories} />
          </nav>
        </div>
        <div className="hidden md:block">
          <SearchBar posts={posts} variant="header" />
        </div>
        <button className="p-1 text-white md:hidden" onClick={() => setMobileOpen(!mobileOpen)} aria-label={mobileOpen ? 'Close menu' : 'Open menu'}>
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>
      {mobileOpen && (
        <div className="border-t border-white/10 bg-primary-dark md:hidden">
          <SearchBar posts={posts} variant="mobile" />
          <nav className="flex flex-col">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)} className="border-b border-white/10 px-4 py-3 text-sm text-white/90 hover:bg-white/5">
                {link.label}
              </Link>
            ))}
            {categories.map((cat) => (
              <Link key={cat.href} href={cat.href} onClick={() => setMobileOpen(false)} className="flex items-center justify-between border-b border-white/10 px-4 py-3 text-sm text-white/75">
                {cat.name}
                <span className="text-xs text-white/50">{cat.count}</span>
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
