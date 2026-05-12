'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NAV_CATEGORIES } from '@/lib/nav-categories';

const NAV_ITEMS = [
  { label: 'Home',    href: '/',     icon: '🏠' },
  { label: 'Best Of', href: '/best', icon: '🏆' },
] as const;

export function MobileBottomNav() {
  const [sheetOpen, setSheetOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string | null) => href !== null && pathname === href;

  return (
    <>
      {/* Slide-up category sheet */}
      {sheetOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40 bg-black/30 md:hidden"
            onClick={() => setSheetOpen(false)}
            aria-hidden="true"
          />

          {/* Sheet */}
          <div
            role="dialog"
            aria-modal="true"
            aria-label="All Categories"
            className="fixed inset-x-0 bottom-16 z-50 max-h-[60vh] overflow-y-auto rounded-t-2xl bg-white pb-4 shadow-xl md:hidden"
          >
            <div className="sticky top-0 bg-white px-4 pb-2 pt-3">
              <div className="mx-auto h-1 w-8 rounded-full bg-neutral-300" />
              <p className="type-label mt-2 text-neutral-500">All Categories</p>
            </div>
            <div className="grid grid-cols-2 gap-2 px-4">
              {NAV_CATEGORIES.map((cat) => (
                <Link
                  key={cat.href}
                  href={cat.href}
                  onClick={() => setSheetOpen(false)}
                  className="flex items-center gap-2 rounded-lg bg-neutral-50 px-3 py-3 transition-colors hover:bg-primary-lightest"
                >
                  <span className="text-lg">{cat.icon}</span>
                  <span className="type-title text-neutral-800">{cat.name}</span>
                </Link>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Bottom nav bar */}
      <nav className="fixed inset-x-0 bottom-0 z-50 grid grid-cols-4 border-t border-neutral-200 bg-white md:hidden">
        {NAV_ITEMS.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.label}
              href={item.href ?? '#'}
              className="flex flex-col items-center gap-0.5 py-2"
              aria-current={active ? 'page' : undefined}
            >
              <span className="text-xl leading-none">{item.icon}</span>
              <span className={`type-label ${active ? 'text-primary' : 'text-neutral-400'}`}>
                {item.label}
              </span>
              {active && <span className="h-0.5 w-4 rounded-full bg-primary" />}
            </Link>
          );
        })}

        {/* Search — placeholder for future search feature */}
        <button
          type="button"
          className="flex flex-col items-center gap-0.5 py-2"
          aria-label="Search"
          disabled
        >
          <span className="text-xl leading-none opacity-40">🔍</span>
          <span className="type-label text-neutral-300">Search</span>
        </button>

        {/* Categories — opens sheet, not a link */}
        <button
          type="button"
          onClick={() => setSheetOpen((prev) => !prev)}
          className="flex flex-col items-center gap-0.5 py-2"
          aria-expanded={sheetOpen}
          aria-label="Open categories"
        >
          <span className="text-xl leading-none">☰</span>
          <span className={`type-label ${sheetOpen ? 'text-primary' : 'text-neutral-400'}`}>
            Categories
          </span>
          {sheetOpen && <span className="h-0.5 w-4 rounded-full bg-primary" />}
        </button>
      </nav>
    </>
  );
}
