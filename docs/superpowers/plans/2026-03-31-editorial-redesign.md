# Editorial Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform Product Lab from a generic product review site into a clean, editorial-grade publication with consistent design tokens, professional layouts, and tasteful AdSense integration.

**Architecture:** Bottom-up approach — design tokens and shared components first, then page-by-page rewrites. Each task produces a working site (no broken intermediate states). The existing markdown content workflow and file-based routing are unchanged.

**Tech Stack:** Next.js 15 (App Router), React 19, Tailwind CSS 3.4, Framer Motion (new), Inter font via next/font (new), existing Shadcn/Radix/Lucide.

**Spec:** `docs/superpowers/specs/2026-03-31-editorial-redesign-design.md`

---

## File Structure

### New Files
```
components/
  SectionLabel.tsx          — Reusable uppercase label with blue bar accent
  Breadcrumb.tsx            — Navigation breadcrumb with linked segments
  ScoreBadge.tsx            — Compact score pill (e.g., "9.2 Excellent")
  ReviewCard.tsx            — Horizontal review card for home page
  VerdictBox.tsx            — Score + summary + breakdown bars (article page)
  BuyBox.tsx                — Price + retailer CTAs (article page)
  TableOfContents.tsx       — Sticky sidebar TOC with scroll tracking
  QuickPicks.tsx            — 3-column best/value/budget summary (category page)
  RankedProductCard.tsx     — Ranked product with badge + specs strip (category page)
  AwardBadge.tsx            — Color-coded award labels
  SearchBar.tsx             — Client-side search filtering by title/category
  CategoryDropdown.tsx      — "All Categories" flyout menu
```

### Modified Files
```
styles/theme.css            — Full design token system (CSS custom properties)
tailwind.config.ts          — Extended color palette mapping to CSS variables
app/layout.tsx              — Inter font, full-width container, updated structure
components/Header.tsx       — Blue gradient nav, search, category dropdown
components/Footer.tsx       — Dark theme, 4-column layout
components/Newsletter.tsx   — Blue gradient card with orange CTA (uncommented + restyled)
components/Top10Popular.tsx — Blue-tinted trending card with orange numbers
components/article/ProsCons.tsx          — Green/red tinted cards
components/article/ProductSpecs.tsx      — Collapsible with framer-motion
components/article/ArticleContent.tsx    — Updated typography, blue heading borders
components/article/AuthorBio.tsx         — Avatar circle + light blue background
components/article/RelatedArticles.tsx   — Compact sidebar format with score badges
components/article/PriceButton.tsx       — Orange primary CTA styling
components/OptimizedImage.tsx            — Blue-tinted fallback
app/page.tsx                — Full home page rewrite
app/articles/[slug]/articlePage.tsx      — New article layout with verdict, buy box, TOC, sidebar
app/best/page.tsx           — Aligned with design system
app/best/cameras/page.tsx   — Quick picks, product cards, new sidebar
app/best/cameras/hybrid-cameras/page.tsx — Template for all subcategory pages
app/best/power-stations/page.tsx         — Aligned with category template
```

---

## Task 1: Install Dependencies & Set Up Inter Font

**Files:**
- Modify: `package.json`
- Modify: `app/layout.tsx`

- [ ] **Step 1: Install framer-motion**

```bash
cd /Users/nmehrok/Downloads/persProjects/ProductLabR
npm install framer-motion
```

Expected: Package added to `dependencies` in package.json.

- [ ] **Step 2: Add Inter font to layout**

Replace the full contents of `app/layout.tsx` with:

```tsx
import type { Metadata } from 'next';
import Script from 'next/script';
import { Inter } from 'next/font/google';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ADSENSE_CONFIG } from '@/lib/adsense-config';
import '../styles/global.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'Product Lab - Expert Reviews You Can Trust',
  description:
    'Expert reviews of power stations, cameras, and tech gear. Professional testing and honest comparisons to help you make informed buying decisions.',
  keywords:
    'product reviews, power stations, cameras, tech reviews, buying guides, expert testing',
  authors: [{ name: 'Product Lab Team' }],
  creator: 'Product Lab',
  publisher: 'Product Lab',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://productlab.com',
    title: 'Product Lab - Expert Reviews You Can Trust',
    description:
      'Expert reviews of power stations, cameras, and tech gear.',
    siteName: 'Product Lab',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Product Lab - Expert Reviews You Can Trust',
    description:
      'Expert reviews of power stations, cameras, and tech gear.',
    creator: '@productlab',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <link rel="canonical" href="https://productlab.com" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#007ACC" />
      </head>
      <body className="font-sans antialiased bg-neutral-50 text-neutral-700">
        <Script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CONFIG.publisherId}`}
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
        <Header />
        <main className="mx-auto max-w-[1280px] px-4 sm:px-6">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
```

Key changes:
- Inter font loaded via `next/font/google` with CSS variable `--font-inter`
- `font-sans` on body uses the Inter variable
- Container is now `max-w-[1280px]` centered (was `w-3/4 on lg`)
- Header/Footer moved outside the container (they go full-width)
- Body background: `bg-neutral-50` (was default white)
- Theme color updated to #007ACC

- [ ] **Step 3: Verify the app still builds**

```bash
npm run dev
```

Open http://localhost:3000 — site should load with Inter font applied. Layout may look slightly different due to container width change — that's expected.

- [ ] **Step 4: Commit**

```bash
git add package.json package-lock.json app/layout.tsx
git commit -m "feat: add framer-motion and Inter font, update root layout container"
```

---

## Task 2: Design Tokens — Theme CSS & Tailwind Config

**Files:**
- Modify: `styles/theme.css`
- Modify: `tailwind.config.ts`

- [ ] **Step 1: Replace theme.css with full design token system**

Replace the full contents of `styles/theme.css` with:

```css
:root {
  /* Primary (blue) */
  --primary: 204 100% 40%;         /* #007ACC */
  --primary-dark: 204 100% 31%;    /* #005C99 */
  --primary-darker: 204 100% 20%;  /* #003D66 */
  --primary-light: 204 100% 85%;   /* #B3D9FF */
  --primary-lightest: 204 100% 95%;/* #E6F2FF */
  --primary-foreground: 0 0% 100%;

  /* Accent (orange) */
  --accent: 24 79% 56%;            /* #E87B35 */
  --accent-foreground: 0 0% 100%;

  /* Neutrals (warm grays) */
  --neutral-50: 210 20% 98%;       /* #f9fafb */
  --neutral-100: 220 14% 96%;      /* #f3f4f6 */
  --neutral-200: 220 13% 91%;      /* #e5e7eb */
  --neutral-300: 216 12% 84%;      /* #d1d5db */
  --neutral-500: 220 9% 46%;       /* #6b7280 */
  --neutral-700: 217 19% 27%;      /* #374151 */
  --neutral-900: 221 39% 11%;      /* #111827 */

  /* Semantic */
  --success: 160 84% 39%;          /* #059669 */
  --success-light: 141 84% 93%;    /* #f0fdf4 */
  --error: 0 69% 35%;              /* #991b1b */
  --error-light: 0 86% 97%;        /* #fef2f2 */

  /* Shadcn compatibility */
  --background: var(--neutral-50);
  --foreground: var(--neutral-900);
  --card: 0 0% 100%;
  --card-foreground: var(--neutral-900);
  --muted: var(--neutral-100);
  --muted-foreground: var(--neutral-500);
  --border: var(--neutral-200);
  --input: var(--neutral-200);
  --ring: var(--primary);

  /* Layout */
  --radius: 0.5rem;
  --max-width: 1280px;

  /* Font */
  --font-sans: var(--font-inter), ui-sans-serif, system-ui, -apple-system, sans-serif;
}
```

- [ ] **Step 2: Update tailwind.config.ts with new token mappings**

Replace the full contents of `tailwind.config.ts` with:

```ts
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-sans)'],
      },
      colors: {
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          dark: 'hsl(var(--primary-dark))',
          darker: 'hsl(var(--primary-darker))',
          light: 'hsl(var(--primary-light))',
          lightest: 'hsl(var(--primary-lightest))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        neutral: {
          50: 'hsl(var(--neutral-50))',
          100: 'hsl(var(--neutral-100))',
          200: 'hsl(var(--neutral-200))',
          300: 'hsl(var(--neutral-300))',
          500: 'hsl(var(--neutral-500))',
          700: 'hsl(var(--neutral-700))',
          900: 'hsl(var(--neutral-900))',
        },
        success: {
          DEFAULT: 'hsl(var(--success))',
          light: 'hsl(var(--success-light))',
        },
        error: {
          DEFAULT: 'hsl(var(--error))',
          light: 'hsl(var(--error-light))',
        },
        // Shadcn compatibility
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      boxShadow: {
        'card-hover': '0 2px 8px rgba(0,0,0,0.06)',
        'featured': '0 1px 4px rgba(0,0,0,0.04)',
      },
      maxWidth: {
        'content': 'var(--max-width)',
      },
    },
  },
  plugins: [
    require('tailwindcss-animate'),
    require('@tailwindcss/typography'),
  ],
};
export default config;
```

Key changes:
- All colors now reference CSS variables (single source of truth)
- New color tokens: `primary-dark`, `primary-darker`, `primary-light`, `primary-lightest`, `accent`, `success`, `error`
- Old `trustworthy`/`lighttrustworthy` tokens removed (replaced by `primary`/`primary-lightest`)
- New box shadows: `card-hover` and `featured`
- Font family references Inter CSS variable

- [ ] **Step 3: Update existing color references**

Search the codebase for `trustworthy` and `lighttrustworthy` Tailwind classes and replace them:

- `bg-trustworthy` → `bg-primary`
- `text-trustworthy` → `text-primary`
- `border-trustworthy` → `border-primary`
- `bg-lighttrustworthy` → `bg-primary-lightest`

Use find-and-replace across all `.tsx` files. The old color names will stop working after the tailwind config change.

- [ ] **Step 4: Verify the app still builds**

```bash
npm run dev
```

Colors should still render correctly. The site uses the new token names now.

- [ ] **Step 5: Commit**

```bash
git add styles/theme.css tailwind.config.ts
git add -u  # catch any files with trustworthy→primary renames
git commit -m "feat: implement design token system with CSS custom properties"
```

---

## Task 3: Shared UI Components — SectionLabel, ScoreBadge, AwardBadge, Breadcrumb

**Files:**
- Create: `components/SectionLabel.tsx`
- Create: `components/ScoreBadge.tsx`
- Create: `components/AwardBadge.tsx`
- Create: `components/Breadcrumb.tsx`

- [ ] **Step 1: Create SectionLabel component**

Create `components/SectionLabel.tsx`:

```tsx
interface SectionLabelProps {
  children: React.ReactNode;
  className?: string;
}

export function SectionLabel({ children, className = '' }: SectionLabelProps) {
  return (
    <div
      className={`mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-primary ${className}`}
    >
      <span className="h-[3px] w-5 rounded-full bg-primary" />
      {children}
    </div>
  );
}
```

- [ ] **Step 2: Create ScoreBadge component**

Create `components/ScoreBadge.tsx`:

```tsx
import { cn } from '@/lib/utils';

interface ScoreBadgeProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

function getScoreLabel(score: number): string {
  if (score >= 9) return 'Excellent';
  if (score >= 8) return 'Great';
  if (score >= 7) return 'Good';
  if (score >= 6) return 'Average';
  return 'Below Average';
}

export function ScoreBadge({
  score,
  size = 'sm',
  showLabel = false,
  className,
}: ScoreBadgeProps) {
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'h-16 w-16 text-2xl',
  };

  if (size === 'lg') {
    return (
      <div className={cn('flex flex-col items-center', className)}>
        <div
          className={cn(
            'flex items-center justify-center rounded-xl bg-primary font-bold text-white',
            sizeClasses.lg,
          )}
        >
          {score.toFixed(1)}
        </div>
        {showLabel && (
          <span className="mt-1 text-xs font-semibold text-primary">
            {getScoreLabel(score)}
          </span>
        )}
      </div>
    );
  }

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded bg-primary font-semibold text-white',
        sizeClasses[size],
        className,
      )}
    >
      {score.toFixed(1)}
      {showLabel && (
        <span className="text-white/80">{getScoreLabel(score)}</span>
      )}
    </span>
  );
}
```

- [ ] **Step 3: Create AwardBadge component**

Create `components/AwardBadge.tsx`:

```tsx
import { cn } from '@/lib/utils';

interface AwardBadgeProps {
  type: 'best-overall' | 'best-value' | 'budget-pick';
  className?: string;
}

const badgeConfig = {
  'best-overall': { label: 'BEST OVERALL', bg: 'bg-accent', text: 'text-white' },
  'best-value': { label: 'BEST VALUE', bg: 'bg-primary', text: 'text-white' },
  'budget-pick': { label: 'BUDGET PICK', bg: 'bg-success', text: 'text-white' },
};

export function AwardBadge({ type, className }: AwardBadgeProps) {
  const config = badgeConfig[type];
  return (
    <span
      className={cn(
        'inline-block rounded px-1.5 py-0.5 text-[10px] font-semibold',
        config.bg,
        config.text,
        className,
      )}
    >
      {config.label}
    </span>
  );
}
```

- [ ] **Step 4: Create Breadcrumb component**

Create `components/Breadcrumb.tsx`:

```tsx
import Link from 'next/link';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="border-b border-neutral-200 bg-white px-6 py-2.5 text-xs text-neutral-500"
    >
      <ol className="mx-auto flex max-w-content items-center gap-1">
        {items.map((item, i) => (
          <li key={i} className="flex items-center gap-1">
            {i > 0 && <span className="text-neutral-300">›</span>}
            {item.href ? (
              <Link href={item.href} className="text-primary hover:underline">
                {item.label}
              </Link>
            ) : (
              <span className="text-neutral-700">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
```

- [ ] **Step 5: Commit**

```bash
git add components/SectionLabel.tsx components/ScoreBadge.tsx components/AwardBadge.tsx components/Breadcrumb.tsx
git commit -m "feat: add shared UI components — SectionLabel, ScoreBadge, AwardBadge, Breadcrumb"
```

---

## Task 4: Header Redesign

**Files:**
- Modify: `components/Header.tsx`
- Create: `components/SearchBar.tsx`
- Create: `components/CategoryDropdown.tsx`

- [ ] **Step 1: Create SearchBar component**

Create `components/SearchBar.tsx`:

```tsx
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
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const results =
    query.length >= 2
      ? posts
          .filter(
            (p) =>
              p.title.toLowerCase().includes(query.toLowerCase()) ||
              (p.category ?? '').toLowerCase().includes(query.toLowerCase()),
          )
          .slice(0, 5)
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
            ref={inputRef}
            type="text"
            placeholder="Search reviews..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            className="w-36 bg-transparent text-xs text-white placeholder:text-white/60 focus:outline-none"
          />
          {query && (
            <button onClick={() => { setQuery(''); setIsOpen(false); }}>
              <X className="h-3 w-3 text-white/70" />
            </button>
          )}
        </div>
        {isOpen && results.length > 0 && (
          <div className="absolute right-0 top-full z-50 mt-2 w-72 rounded-lg border border-neutral-200 bg-white shadow-lg">
            {results.map((r) => (
              <Link
                key={r.slug}
                href={`/articles/${r.slug}`}
                onClick={() => { setIsOpen(false); setQuery(''); }}
                className="block px-4 py-2.5 hover:bg-primary-lightest"
              >
                <div className="text-sm font-medium text-neutral-900">{r.title}</div>
                {r.category && (
                  <div className="text-xs text-primary">{r.category}</div>
                )}
              </Link>
            ))}
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
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          className="flex-1 bg-transparent text-sm text-neutral-900 placeholder:text-neutral-500 focus:outline-none"
        />
      </div>
      {isOpen && results.length > 0 && (
        <div className="mt-1 rounded-lg border border-neutral-200 bg-white shadow-lg">
          {results.map((r) => (
            <Link
              key={r.slug}
              href={`/articles/${r.slug}`}
              onClick={() => { setIsOpen(false); setQuery(''); }}
              className="block px-4 py-2.5 hover:bg-primary-lightest"
            >
              <div className="text-sm font-medium text-neutral-900">{r.title}</div>
              {r.category && (
                <div className="text-xs text-primary">{r.category}</div>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Create CategoryDropdown component**

Create `components/CategoryDropdown.tsx`:

```tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';

interface CategoryItem {
  name: string;
  href: string;
  count: number;
}

interface CategoryDropdownProps {
  categories: CategoryItem[];
}

export function CategoryDropdown({ categories }: CategoryDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 text-[13px] text-white/85 hover:text-white"
      >
        All Categories
        <ChevronDown className="h-3 w-3" />
      </button>
      {isOpen && (
        <div className="absolute left-0 top-full z-50 mt-3 w-56 rounded-lg border border-neutral-200 bg-white py-2 shadow-lg">
          {categories.map((cat) => (
            <Link
              key={cat.href}
              href={cat.href}
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-between px-4 py-2 text-sm text-neutral-700 hover:bg-primary-lightest"
            >
              {cat.name}
              <span className="rounded-full bg-primary px-1.5 text-[10px] text-white">
                {cat.count}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 3: Rewrite Header component**

Replace the full contents of `components/Header.tsx` with:

```tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { SearchBar } from './SearchBar';
import { CategoryDropdown } from './CategoryDropdown';
import getPostMetadata from './getPostMetadata';

const navLinks = [
  { label: 'Cameras', href: '/best/cameras' },
  { label: 'Power Stations', href: '/best/power-stations' },
];

const categories = [
  { name: 'Cameras', href: '/best/cameras', count: 15 },
  { name: 'Power Stations', href: '/best/power-stations', count: 19 },
  { name: 'Knives & Tools', href: '/best', count: 1 },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const posts = getPostMetadata().map((p) => ({
    title: p.title,
    slug: p.slug,
    category: p.category,
  }));

  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-primary to-primary-dark">
      <div className="mx-auto flex max-w-content items-center justify-between px-4 py-3 sm:px-6">
        {/* Logo */}
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="text-base font-bold tracking-wide text-white"
          >
            PRODUCT LAB
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden items-center gap-4 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-[13px] text-white/85 hover:text-white ${
                  pathname.startsWith(link.href)
                    ? 'border-b-2 border-white pb-0.5'
                    : ''
                }`}
              >
                {link.label}
              </Link>
            ))}
            <CategoryDropdown categories={categories} />
          </nav>
        </div>

        {/* Desktop Search */}
        <div className="hidden md:block">
          <SearchBar posts={posts} variant="header" />
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden p-1 text-white"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="border-t border-white/10 bg-primary-dark md:hidden">
          <SearchBar posts={posts} variant="mobile" />
          <nav className="flex flex-col">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="border-b border-white/10 px-4 py-3 text-sm text-white/90 hover:bg-white/5"
              >
                {link.label}
              </Link>
            ))}
            {categories.map((cat) => (
              <Link
                key={cat.href}
                href={cat.href}
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-between border-b border-white/10 px-4 py-3 text-sm text-white/75"
              >
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
```

- [ ] **Step 4: Verify header renders correctly**

```bash
npm run dev
```

Open http://localhost:3000. Header should show blue gradient with white logo, nav links, category dropdown, and search. Mobile view should show hamburger.

- [ ] **Step 5: Commit**

```bash
git add components/Header.tsx components/SearchBar.tsx components/CategoryDropdown.tsx
git commit -m "feat: redesign header with blue gradient, search, and category dropdown"
```

---

## Task 5: Footer Redesign

**Files:**
- Modify: `components/Footer.tsx`

- [ ] **Step 1: Rewrite Footer component**

Replace the full contents of `components/Footer.tsx` with:

```tsx
import Link from 'next/link';

const footerSections = [
  {
    title: 'Categories',
    links: [
      { label: 'Cameras', href: '/best/cameras' },
      { label: 'Power Stations', href: '/best/power-stations' },
      { label: 'Knives & Tools', href: '/best' },
    ],
  },
  {
    title: 'Best Of',
    links: [
      { label: 'Best Hybrid Cameras', href: '/best/cameras/hybrid-cameras' },
      { label: 'Best Pro Cameras', href: '/best/cameras/professional-cameras' },
      { label: 'Best Portable Power Stations', href: '/best/power-stations/portable-power-stations' },
      { label: 'Best Camping Power Stations', href: '/best/power-stations/camping-power-stations' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', href: '/about' },
      { label: 'Contact', href: '/contact' },
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Use', href: '/terms' },
    ],
  },
];

export function Footer() {
  return (
    <footer className="mt-16 bg-neutral-900 text-white">
      <div className="mx-auto max-w-content px-4 py-12 sm:px-6">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <Link href="/" className="text-base font-bold tracking-wide">
              PRODUCT LAB
            </Link>
            <p className="mt-3 text-sm leading-relaxed text-neutral-400">
              Expert product reviews you can trust. Professional testing and
              honest comparisons to help you make informed buying decisions.
            </p>
          </div>

          {/* Link Sections */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-neutral-300">
                {section.title}
              </h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-neutral-400 hover:text-primary-light"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-10 border-t border-neutral-800 pt-6 text-center text-xs text-neutral-500">
          © {new Date().getFullYear()} Product Lab. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
```

- [ ] **Step 2: Verify footer renders**

```bash
npm run dev
```

Footer should be dark with 4-column layout on desktop, stacking on mobile.

- [ ] **Step 3: Commit**

```bash
git add components/Footer.tsx
git commit -m "feat: redesign footer with dark theme and 4-column layout"
```

---

## Task 6: Newsletter & Top10Popular Component Restyling

**Files:**
- Modify: `components/Newsletter.tsx`
- Modify: `components/Top10Popular.tsx`

- [ ] **Step 1: Rewrite Newsletter component**

Replace the full contents of `components/Newsletter.tsx` with:

```tsx
'use client';

import { useState } from 'react';

interface NewsletterProps {
  title?: string;
  description?: string;
}

export function Newsletter({
  title = 'Get our picks',
  description = 'Weekly roundup of our best reviews and deals.',
}: NewsletterProps) {
  const [email, setEmail] = useState('');

  return (
    <div className="rounded-xl bg-gradient-to-br from-primary to-primary-dark p-4 text-white">
      <h3 className="text-sm font-semibold">{title}</h3>
      <p className="mt-1 text-xs text-white/85">{description}</p>
      <input
        type="email"
        placeholder="your@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="mt-2.5 w-full rounded border border-white/25 bg-white/15 px-3 py-2 text-xs text-white placeholder:text-white/60 focus:outline-none focus:ring-1 focus:ring-white/40"
      />
      <button className="mt-1.5 w-full rounded bg-accent py-2 text-xs font-semibold text-white hover:bg-accent/90">
        Subscribe
      </button>
    </div>
  );
}
```

- [ ] **Step 2: Rewrite Top10Popular as Trending component**

Replace the full contents of `components/Top10Popular.tsx` with:

```tsx
import Link from 'next/link';
import getPostMetadata from './getPostMetadata';

export function Top10Popular() {
  const posts = getPostMetadata().slice(0, 5);

  return (
    <div className="rounded-xl border border-primary-light bg-gradient-to-b from-primary-lightest to-neutral-50 p-4">
      <h3 className="mb-3 text-xs font-semibold uppercase tracking-widest text-primary">
        Trending
      </h3>
      <ol className="space-y-0">
        {posts.map((post, i) => (
          <li
            key={post.slug}
            className="flex gap-2 border-b border-primary/10 py-2 last:border-0"
          >
            <span className="text-sm font-bold text-accent">{i + 1}</span>
            <Link
              href={`/articles/${post.slug}`}
              className="text-[13px] text-neutral-700 hover:text-primary"
            >
              {post.title}
            </Link>
          </li>
        ))}
      </ol>
    </div>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add components/Newsletter.tsx components/Top10Popular.tsx
git commit -m "feat: restyle Newsletter (blue gradient) and Top10Popular (trending card)"
```

---

## Task 7: ReviewCard Component (Home Page)

**Files:**
- Create: `components/ReviewCard.tsx`

- [ ] **Step 1: Create ReviewCard component**

Create `components/ReviewCard.tsx`:

```tsx
import Link from 'next/link';
import { OptimizedImage } from './OptimizedImage';
import { ScoreBadge } from './ScoreBadge';
import type { PostMetadata } from './PostMetadata';

interface ReviewCardProps {
  post: PostMetadata;
}

export function ReviewCard({ post }: ReviewCardProps) {
  const score = post.ratingBreakdown
    ? post.ratingBreakdown.metrics.reduce((sum, m) => sum + m.score, 0) /
      post.ratingBreakdown.metrics.length
    : post.rating
      ? post.rating * 2
      : null;

  return (
    <Link
      href={`/articles/${post.slug}`}
      className="flex gap-4 rounded-lg p-3 transition-colors hover:bg-primary-lightest/50"
    >
      <div className="relative h-20 w-[120px] flex-shrink-0 overflow-hidden rounded-lg bg-gradient-to-br from-primary-lightest to-primary-light/30">
        <OptimizedImage
          src={post.image || post.productImage || '/images/item.png'}
          alt={post.title}
          fill
          sizes="120px"
          className="object-cover"
        />
      </div>
      <div className="flex-1 min-w-0">
        {post.category && (
          <span className="text-[11px] font-semibold text-primary">
            {post.category}
          </span>
        )}
        <h3 className="mt-0.5 text-[15px] font-semibold leading-snug text-neutral-900 line-clamp-2">
          {post.title}
        </h3>
        {post.subtitle && (
          <p className="mt-1 text-[13px] leading-relaxed text-neutral-500 line-clamp-2">
            {post.subtitle}
          </p>
        )}
        <div className="mt-1.5 flex items-center gap-2">
          {score && <ScoreBadge score={score / 10} />}
          <span className="text-[11px] text-neutral-400">{post.date}</span>
        </div>
      </div>
    </Link>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/ReviewCard.tsx
git commit -m "feat: add ReviewCard component for horizontal review list"
```

---

## Task 8: Home Page Rewrite

**Files:**
- Modify: `app/page.tsx`

- [ ] **Step 1: Rewrite the home page**

Replace the full contents of `app/page.tsx` with:

```tsx
import Link from 'next/link';
import getPostMetadata from '@/components/getPostMetadata';
import { OptimizedImage } from '@/components/OptimizedImage';
import { ReviewCard } from '@/components/ReviewCard';
import { ScoreBadge } from '@/components/ScoreBadge';
import { SectionLabel } from '@/components/SectionLabel';
import { Top10Popular } from '@/components/Top10Popular';
import { Newsletter } from '@/components/Newsletter';
import { AdBanner } from '@/components/ads/AdBanner';
import { ADSENSE_CONFIG } from '@/lib/adsense-config';
import { getAllCategories, getPostsByCategory } from '@/lib/Posts';

const bestOfGuides = [
  { title: 'Best Hybrid Cameras', href: '/best/cameras/hybrid-cameras', count: 8, updated: 'Mar 2026', color: 'border-primary' },
  { title: 'Best Portable Power Stations', href: '/best/power-stations/portable-power-stations', count: 12, updated: 'Mar 2026', color: 'border-accent' },
  { title: 'Best Camping Power Stations', href: '/best/power-stations/camping-power-stations', count: 6, updated: 'Feb 2026', color: 'border-primary' },
  { title: 'Best Pro Photo Cameras', href: '/best/cameras/professional-photo-cameras', count: 5, updated: 'Mar 2026', color: 'border-accent' },
];

export default function Home() {
  const posts = getPostMetadata();
  const featured = posts[0];
  const recentPosts = posts.slice(1, 7);
  const categories = getAllCategories();

  const featuredScore = featured?.ratingBreakdown
    ? featured.ratingBreakdown.metrics.reduce((sum, m) => sum + m.score, 0) /
      featured.ratingBreakdown.metrics.length / 10
    : featured?.rating
      ? (featured.rating * 2) / 10
      : null;

  return (
    <>
      {/* Hero — Editor's Pick */}
      <section className="-mx-4 bg-gradient-to-b from-primary-lightest to-neutral-50 px-4 py-8 sm:-mx-6 sm:px-6">
        <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-widest text-primary">
          <span className="h-1.5 w-1.5 rounded-full bg-accent" />
          Editor&apos;s Pick
        </div>
        {featured && (
          <div className="mt-4 grid items-center gap-6 md:grid-cols-2">
            <div>
              <h1 className="text-2xl font-bold leading-tight text-neutral-900 md:text-[26px]">
                {featured.title}
              </h1>
              {featured.subtitle && (
                <p className="mt-2 text-sm leading-relaxed text-neutral-500">
                  {featured.subtitle}
                </p>
              )}
              <div className="mt-3 flex items-center gap-3">
                {featuredScore && <ScoreBadge score={featuredScore} showLabel />}
                <Link
                  href={`/articles/${featured.slug}`}
                  className="text-sm font-medium text-primary hover:underline"
                >
                  Read full review →
                </Link>
              </div>
            </div>
            <div className="relative h-44 overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-featured md:h-52">
              <OptimizedImage
                src={featured.image || featured.productImage || '/images/item.png'}
                alt={featured.title}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-contain p-4"
              />
            </div>
          </div>
        )}
      </section>

      {/* Content Grid */}
      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[7fr_3fr]">
        {/* Main Column */}
        <div>
          {/* Latest Reviews */}
          <SectionLabel>Latest Reviews</SectionLabel>
          <div className="space-y-1">
            {recentPosts.map((post) => (
              <ReviewCard key={post.slug} post={post} />
            ))}
          </div>

          {/* Ad — between sections */}
          <div className="my-6">
            <AdBanner
              adSlot={ADSENSE_CONFIG.adSlots.homeBetweenCategories}
              adFormat="auto"
              className="mx-auto"
            />
          </div>

          {/* Best Of Guides */}
          <SectionLabel>Best Of Guides</SectionLabel>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {bestOfGuides.map((guide) => (
              <Link
                key={guide.href}
                href={guide.href}
                className={`rounded-lg border border-neutral-200 border-l-[3px] ${guide.color} bg-white p-4 transition-shadow hover:shadow-card-hover`}
              >
                <span className={`text-[11px] font-medium ${guide.color === 'border-accent' ? 'text-accent' : 'text-primary'}`}>
                  Updated {guide.updated}
                </span>
                <h3 className="mt-1 text-sm font-semibold text-neutral-900">
                  {guide.title}
                </h3>
                <span className="mt-1 text-xs text-neutral-400">
                  {guide.count} products tested →
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <aside className="space-y-4">
          <Top10Popular />

          <AdBanner
            adSlot={ADSENSE_CONFIG.adSlots.sidebar}
            adFormat="rectangle"
            className="mx-auto"
          />

          <Newsletter />

          {/* Categories */}
          <div>
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-widest text-primary">
              Categories
            </h3>
            <div className="space-y-1">
              {categories.map((cat) => {
                const catPosts = getPostsByCategory(cat);
                return (
                  <Link
                    key={cat}
                    href={`/best/${cat}`}
                    className="flex items-center justify-between rounded-md bg-primary-lightest/50 px-3 py-2 text-[13px] text-neutral-500 hover:bg-primary-lightest"
                  >
                    {cat.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
                    <span className="rounded-full bg-primary px-1.5 text-[10px] text-white">
                      {catPosts.length}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}
```

- [ ] **Step 2: Verify the home page renders**

```bash
npm run dev
```

Open http://localhost:3000. Should see: blue gradient hero with editor's pick, latest reviews list, best of guides grid, and sidebar with trending/newsletter/categories.

- [ ] **Step 3: Commit**

```bash
git add app/page.tsx
git commit -m "feat: rewrite home page with editorial layout — hero, reviews, best-of guides, sidebar"
```

---

## Task 9: Article Page Components — VerdictBox, BuyBox, TableOfContents

**Files:**
- Create: `components/VerdictBox.tsx`
- Create: `components/BuyBox.tsx`
- Create: `components/TableOfContents.tsx`

- [ ] **Step 1: Create VerdictBox component**

Create `components/VerdictBox.tsx`:

```tsx
import { ScoreBadge } from './ScoreBadge';

interface Metric {
  name: string;
  score: number;
}

interface VerdictBoxProps {
  overallScore: number;
  verdict: string;
  metrics: Metric[];
}

export function VerdictBox({ overallScore, verdict, metrics }: VerdictBoxProps) {
  const displayScore = overallScore / 10;

  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-featured">
      <div className="flex items-start gap-5">
        <ScoreBadge score={displayScore} size="lg" showLabel />
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-neutral-900">Our Verdict</h3>
          <p className="mt-1 text-[13px] leading-relaxed text-neutral-500">
            {verdict}
          </p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 border-t border-neutral-100 pt-4 sm:grid-cols-4">
        {metrics.slice(0, 4).map((metric) => (
          <div key={metric.name}>
            <div className="text-[11px] text-neutral-400">{metric.name}</div>
            <div className="mt-1 flex items-center gap-1.5">
              <div className="h-1 flex-1 rounded-full bg-neutral-200">
                <div
                  className="h-1 rounded-full bg-primary"
                  style={{ width: `${(metric.score / 10) * 100}%` }}
                />
              </div>
              <span className="text-xs font-semibold text-neutral-700">
                {metric.score.toFixed(1)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create BuyBox component**

Create `components/BuyBox.tsx`:

```tsx
import { ExternalLink } from 'lucide-react';

interface BuyBoxProps {
  price?: string;
  retailerLinks?: Record<string, string>;
  productName?: string;
}

export function BuyBox({ price, retailerLinks, productName }: BuyBoxProps) {
  if (!retailerLinks || Object.keys(retailerLinks).length === 0) return null;

  const retailers = Object.entries(retailerLinks);
  const primaryRetailer = retailers[0];
  const secondaryRetailers = retailers.slice(1, 3);

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-neutral-200 bg-white p-4">
      <div>
        {price && (
          <div className="text-xl font-bold text-neutral-900">{price}</div>
        )}
        <div className="text-xs text-neutral-400">Best price across retailers</div>
      </div>
      <div className="flex flex-wrap gap-2">
        <a
          href={primaryRetailer[1]}
          target="_blank"
          rel="noopener noreferrer nofollow"
          className="inline-flex items-center gap-1.5 rounded-md bg-accent px-4 py-2.5 text-[13px] font-semibold text-white hover:bg-accent/90"
          aria-label={`Buy ${productName || 'product'} at ${primaryRetailer[0]}`}
        >
          Buy at {primaryRetailer[0]}
          <ExternalLink className="h-3 w-3" />
        </a>
        {secondaryRetailers.map(([name, url]) => (
          <a
            key={name}
            href={url}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="inline-flex items-center gap-1.5 rounded-md border border-neutral-200 px-4 py-2.5 text-[13px] font-medium text-neutral-500 hover:border-neutral-300"
            aria-label={`Buy ${productName || 'product'} at ${name}`}
          >
            {name}
            <ExternalLink className="h-3 w-3" />
          </a>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Create TableOfContents component**

Create `components/TableOfContents.tsx`:

```tsx
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

  // Extract h2 headings from HTML
  const headings: TocItem[] = [];
  const regex = /<h2[^>]*id="([^"]*)"[^>]*>(.*?)<\/h2>/gi;
  let match;
  while ((match = regex.exec(contentHtml)) !== null) {
    headings.push({
      id: match[1],
      text: match[2].replace(/<[^>]*>/g, ''),
    });
  }

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '-80px 0px -60% 0px' },
    );

    headings.forEach((h) => {
      const el = document.getElementById(h.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <nav className="rounded-lg border border-neutral-200 bg-white p-4">
      <h3 className="mb-2.5 text-xs font-semibold uppercase tracking-wider text-primary">
        In This Review
      </h3>
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
```

- [ ] **Step 4: Commit**

```bash
git add components/VerdictBox.tsx components/BuyBox.tsx components/TableOfContents.tsx
git commit -m "feat: add VerdictBox, BuyBox, and TableOfContents components"
```

---

## Task 10: Update Article Sub-Components

**Files:**
- Modify: `components/article/ProsCons.tsx`
- Modify: `components/article/ProductSpecs.tsx`
- Modify: `components/article/AuthorBio.tsx`
- Modify: `components/article/ArticleContent.tsx`
- Modify: `components/article/RelatedArticles.tsx`
- Modify: `components/OptimizedImage.tsx`

- [ ] **Step 1: Update ProsCons with green/red tinted cards**

Replace the full contents of `components/article/ProsCons.tsx` with:

```tsx
interface ProsConsProps {
  pros?: string[];
  cons?: string[];
}

export function ProsCons({ pros, cons }: ProsConsProps) {
  if (!pros?.length && !cons?.length) return null;

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {pros && pros.length > 0 && (
        <div className="rounded-lg border border-green-200 bg-success-light p-4">
          <h4 className="mb-2 text-[13px] font-semibold text-green-800">✓ Pros</h4>
          <ul className="space-y-1.5">
            {pros.map((pro, i) => (
              <li key={i} className="text-[13px] leading-relaxed text-neutral-700">
                • {pro}
              </li>
            ))}
          </ul>
        </div>
      )}
      {cons && cons.length > 0 && (
        <div className="rounded-lg border border-red-200 bg-error-light p-4">
          <h4 className="mb-2 text-[13px] font-semibold text-error">✗ Cons</h4>
          <ul className="space-y-1.5">
            {cons.map((con, i) => (
              <li key={i} className="text-[13px] leading-relaxed text-neutral-700">
                • {con}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Update ProductSpecs with collapsible animation**

Replace the full contents of `components/article/ProductSpecs.tsx` with:

```tsx
'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

interface ProductSpecsProps {
  specs?: Record<string, string>;
}

export function ProductSpecs({ specs }: ProductSpecsProps) {
  const [expanded, setExpanded] = useState(false);
  if (!specs || Object.keys(specs).length === 0) return null;

  const entries = Object.entries(specs);
  const visibleEntries = expanded ? entries : entries.slice(0, 4);

  return (
    <div className="rounded-lg border border-neutral-200 bg-white p-4">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center justify-between"
      >
        <h3 className="text-[15px] font-semibold text-neutral-900">
          Full Specifications
        </h3>
        <span className="flex items-center gap-1 text-xs font-medium text-primary">
          {expanded ? 'Collapse' : 'Expand'}
          <ChevronDown
            className={`h-3.5 w-3.5 transition-transform ${expanded ? 'rotate-180' : ''}`}
          />
        </span>
      </button>
      <div className="mt-3">
        <AnimatePresence initial={false}>
          <motion.div
            key={expanded ? 'expanded' : 'collapsed'}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="grid grid-cols-[140px_1fr] text-[13px]">
              {visibleEntries.map(([key, value], i) => (
                <div key={key} className="contents">
                  <div
                    className={`py-2 text-neutral-400 ${i < visibleEntries.length - 1 ? 'border-b border-neutral-100' : ''}`}
                  >
                    {key}
                  </div>
                  <div
                    className={`py-2 text-neutral-700 ${i < visibleEntries.length - 1 ? 'border-b border-neutral-100' : ''}`}
                  >
                    {value}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Update AuthorBio with avatar and light blue background**

Replace the full contents of `components/article/AuthorBio.tsx` with:

```tsx
interface AuthorBioProps {
  authorBio: string;
  authorName?: string;
}

export function AuthorBio({ authorBio, authorName }: AuthorBioProps) {
  const initials = authorName
    ? authorName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'PL';

  return (
    <div className="mt-6 flex items-center gap-3.5 rounded-xl bg-primary-lightest/50 p-4">
      <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary-dark text-sm font-semibold text-white">
        {initials}
      </div>
      <div>
        {authorName && (
          <div className="text-[13px] font-semibold text-neutral-900">
            {authorName}
          </div>
        )}
        <p className="text-xs leading-relaxed text-neutral-500">{authorBio}</p>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Update ArticleContent typography**

In `components/article/ArticleContent.tsx`, find the `<style jsx global>` block and update the heading styles. The key changes are:

- Replace any `h2` styles to use: `font-size: 20px; font-weight: 700; color: #111827; border-bottom: 2px solid #007ACC; padding-bottom: 8px; margin-top: 32px; margin-bottom: 16px;`
- Replace `h3` styles to use: `font-size: 16px; font-weight: 700; color: #111827; margin-top: 24px; margin-bottom: 12px;`
- Update body text: `font-size: 14.5px; line-height: 1.8; color: #374151;`
- Update blockquotes: `border-left: 3px solid #007ACC; background: #f0f7ff; padding: 12px 16px;`

Also, update the markdown processing in `lib/markdown.ts` to add `id` attributes to `<h2>` tags for the Table of Contents scroll tracking. Change the h2 regex replacement to include a slugified id:

In `lib/markdown.ts`, update the h2 replacement line to:
```ts
.replace(
  /<h2>(.*?)<\/h2>/g,
  (_, content) => {
    const id = content.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    return `<h2 id="${id}" class="text-xl font-bold text-neutral-900 border-b-2 border-primary pb-2 mt-8 mb-4">${content}</h2>`;
  }
)
```

- [ ] **Step 5: Update RelatedArticles for compact sidebar format**

Replace the full contents of `components/article/RelatedArticles.tsx` with:

```tsx
import Link from 'next/link';
import { getPostsByCategory } from '@/lib/Posts';

interface RelatedArticlesProps {
  currentArticleSlug: string;
  category?: string;
  limit?: number;
}

export function RelatedArticles({
  currentArticleSlug,
  category,
  limit = 4,
}: RelatedArticlesProps) {
  if (!category) return null;

  const posts = getPostsByCategory(category)
    .filter((p) => p.slug !== currentArticleSlug)
    .slice(0, limit);

  if (posts.length === 0) return null;

  return (
    <div className="mt-4">
      <h3 className="mb-2.5 text-xs font-semibold uppercase tracking-wider text-primary">
        Related
      </h3>
      <div className="space-y-0">
        {posts.map((post) => {
          const score = post.ratingBreakdown
            ? post.ratingBreakdown.metrics.reduce((s, m) => s + m.score, 0) /
              post.ratingBreakdown.metrics.length
            : null;
          return (
            <Link
              key={post.slug}
              href={`/articles/${post.slug}`}
              className="block border-b border-neutral-100 py-2 last:border-0"
            >
              <div className="text-xs font-medium text-neutral-700 hover:text-primary">
                {post.title}
              </div>
              {score && (
                <div className="mt-0.5 text-[11px] text-primary">
                  {(score / 10).toFixed(1)}{' '}
                  {score / 10 >= 9 ? 'Excellent' : score / 10 >= 8 ? 'Great' : 'Good'}
                </div>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
```

- [ ] **Step 6: Update OptimizedImage fallback to blue tint**

In `components/OptimizedImage.tsx`, find the fallback/error state div (the one with gray background) and change:
- `bg-gray-100` → `bg-gradient-to-br from-primary-lightest to-primary-light/30`
- Any gray placeholder text → `text-primary-light`

- [ ] **Step 7: Commit**

```bash
git add components/article/ProsCons.tsx components/article/ProductSpecs.tsx components/article/AuthorBio.tsx components/article/ArticleContent.tsx components/article/RelatedArticles.tsx components/OptimizedImage.tsx lib/markdown.ts
git commit -m "feat: update article sub-components with editorial styling"
```

---

## Task 11: Article Page Layout Rewrite

**Files:**
- Modify: `app/articles/[slug]/articlePage.tsx`

- [ ] **Step 1: Rewrite articlePage.tsx with new layout**

Replace the full contents of `app/articles/[slug]/articlePage.tsx` with:

```tsx
import { Breadcrumb } from '@/components/Breadcrumb';
import { VerdictBox } from '@/components/VerdictBox';
import { BuyBox } from '@/components/BuyBox';
import { TableOfContents } from '@/components/TableOfContents';
import { ScoreBadge } from '@/components/ScoreBadge';
import { AdBanner } from '@/components/ads/AdBanner';
import { ADSENSE_CONFIG } from '@/lib/adsense-config';
import { ProductImage } from '@/components/article/ProductImage';
import { ProsCons } from '@/components/article/ProsCons';
import { ProductSpecs } from '@/components/article/ProductSpecs';
import { ArticleContent } from '@/components/article/ArticleContent';
import { RelatedArticles } from '@/components/article/RelatedArticles';
import { AuthorBio } from '@/components/article/AuthorBio';
import { processMarkdownContent } from '@/lib/markdown';
import { calculateOverallScore } from '@/lib/articleUtils';
import { getCategoryDisplayName } from '@/lib/Posts';
import type { PostMetadata } from '@/components/PostMetadata';

interface ArticlePageProps {
  metadata: PostMetadata;
  content: string;
}

export default function ArticlePage({ metadata, content }: ArticlePageProps) {
  const processedContent = processMarkdownContent(content);
  const overallScore = metadata.ratingBreakdown
    ? calculateOverallScore(metadata.ratingBreakdown)
    : null;
  const displayScore = overallScore ? overallScore / 10 : null;
  const categoryDisplay = metadata.category
    ? getCategoryDisplayName(metadata.category)
    : null;

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    ...(metadata.category
      ? [{ label: categoryDisplay || metadata.category, href: `/best/${metadata.category}` }]
      : []),
    { label: metadata.title },
  ];

  const verdict = metadata.subtitle || `A comprehensive look at the ${metadata.title}.`;

  return (
    <>
      {/* Breadcrumb — full width */}
      <div className="-mx-4 sm:-mx-6">
        <Breadcrumb items={breadcrumbItems} />
      </div>

      {/* Article Header */}
      <div className="-mx-4 bg-gradient-to-b from-primary-lightest to-neutral-50 px-4 pb-5 pt-7 sm:-mx-6 sm:px-6">
        <div className="max-w-[780px]">
          <div className="flex items-center gap-2">
            <span className="rounded bg-primary px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-white">
              Review
            </span>
            {categoryDisplay && (
              <span className="text-xs font-medium text-primary">
                {categoryDisplay}
              </span>
            )}
          </div>
          <h1 className="mt-2 text-2xl font-bold leading-tight tracking-tight text-neutral-900 md:text-[28px]">
            {metadata.title}
          </h1>
          {metadata.subtitle && (
            <p className="mt-2 text-[15px] leading-relaxed text-neutral-500">
              {metadata.subtitle}
            </p>
          )}
          <div className="mt-3 flex items-center gap-4 text-xs text-neutral-400">
            {metadata.author && (
              <span>
                By <strong className="text-neutral-700">{metadata.author}</strong>
              </span>
            )}
            {metadata.date && <span>Updated {metadata.date}</span>}
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-[7fr_3fr]">
        {/* Main Article Column */}
        <div className="min-w-0">
          {/* Verdict Box */}
          {overallScore && metadata.ratingBreakdown && (
            <VerdictBox
              overallScore={overallScore}
              verdict={verdict}
              metrics={metadata.ratingBreakdown.metrics}
            />
          )}

          {/* Product Image */}
          {(metadata.productImage || metadata.image) && (
            <div className="mt-5">
              <ProductImage
                src={metadata.productImage || metadata.image || ''}
                alt={metadata.title}
              />
            </div>
          )}

          {/* Buy Box */}
          {metadata.retailerLinks && (
            <div className="mt-5">
              <BuyBox
                price={metadata.price}
                retailerLinks={metadata.retailerLinks}
                productName={metadata.title}
              />
            </div>
          )}

          {/* Pros / Cons */}
          {(metadata.pros || metadata.cons) && (
            <div className="mt-5">
              <ProsCons pros={metadata.pros} cons={metadata.cons} />
            </div>
          )}

          {/* Article Content */}
          <div className="mt-6">
            <ArticleContent
              content={processedContent}
              publishDate={metadata.date}
              author={metadata.author}
            />
          </div>

          {/* Mid-article Ad */}
          <div className="my-6">
            <AdBanner
              adSlot={ADSENSE_CONFIG.adSlots.articleMid}
              adFormat="auto"
            />
          </div>

          {/* Specs */}
          {metadata.specs && (
            <div className="mt-4">
              <ProductSpecs specs={metadata.specs} />
            </div>
          )}

          {/* Author Bio */}
          {metadata.authorBio && (
            <AuthorBio
              authorBio={metadata.authorBio}
              authorName={metadata.author}
            />
          )}
        </div>

        {/* Sidebar */}
        <aside className="hidden lg:block">
          <div className="sticky top-20 space-y-4">
            <TableOfContents contentHtml={processedContent} />

            <AdBanner
              adSlot={ADSENSE_CONFIG.adSlots.sidebar}
              adFormat="rectangle"
            />

            <RelatedArticles
              currentArticleSlug={metadata.slug}
              category={metadata.category}
            />
          </div>
        </aside>
      </div>
    </>
  );
}
```

- [ ] **Step 2: Verify an article page renders**

```bash
npm run dev
```

Open http://localhost:3000/articles/sony_a7_iv (or any valid article slug). Should see: breadcrumbs, blue header area, verdict box with scores, product image, buy box, pros/cons, article content, sticky sidebar with TOC.

- [ ] **Step 3: Commit**

```bash
git add app/articles/[slug]/articlePage.tsx
git commit -m "feat: rewrite article page with verdict box, buy box, TOC sidebar, and editorial layout"
```

---

## Task 12: Category Page Components — QuickPicks, RankedProductCard

**Files:**
- Create: `components/QuickPicks.tsx`
- Create: `components/RankedProductCard.tsx`

- [ ] **Step 1: Create QuickPicks component**

Create `components/QuickPicks.tsx`:

```tsx
import Link from 'next/link';
import { ScoreBadge } from './ScoreBadge';

interface QuickPick {
  label: string;
  name: string;
  href: string;
  score: number;
  price: string;
}

interface QuickPicksProps {
  picks: QuickPick[];
}

export function QuickPicks({ picks }: QuickPicksProps) {
  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-4">
      <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-primary">
        Quick Picks
      </h3>
      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
        {picks.map((pick) => (
          <Link
            key={pick.href}
            href={pick.href}
            className="rounded-lg border border-primary-light bg-primary-lightest/50 p-3 text-center hover:bg-primary-lightest"
          >
            <div className="text-[10px] font-semibold uppercase tracking-wide text-accent">
              {pick.label}
            </div>
            <div className="mt-1 text-[13px] font-semibold text-neutral-900">
              {pick.name}
            </div>
            <div className="mt-1 flex items-center justify-center gap-1.5">
              <ScoreBadge score={pick.score} />
              <span className="text-[11px] text-neutral-500">— {pick.price}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create RankedProductCard component**

Create `components/RankedProductCard.tsx`:

```tsx
import Link from 'next/link';
import { ExternalLink } from 'lucide-react';
import { OptimizedImage } from './OptimizedImage';
import { ScoreBadge } from './ScoreBadge';
import { AwardBadge } from './AwardBadge';

interface RankedProductCardProps {
  rank: number;
  name: string;
  href: string;
  image: string;
  summary: string;
  score: number;
  price: string;
  badge?: 'best-overall' | 'best-value' | 'budget-pick';
  buyUrl?: string;
  buyLabel?: string;
  specs?: Record<string, string>;
}

export function RankedProductCard({
  rank,
  name,
  href,
  image,
  summary,
  score,
  price,
  badge,
  buyUrl,
  buyLabel = 'Buy at Amazon',
  specs,
}: RankedProductCardProps) {
  return (
    <div
      className={`rounded-xl border border-neutral-200 bg-white p-5 ${
        rank === 1 ? 'border-l-4 border-l-accent' : ''
      }`}
    >
      <div className="flex flex-col gap-5 sm:flex-row">
        {/* Image */}
        <div className="relative h-36 w-full flex-shrink-0 overflow-hidden rounded-lg bg-gradient-to-br from-primary-lightest to-primary-light/30 sm:w-44">
          <OptimizedImage
            src={image}
            alt={name}
            fill
            sizes="180px"
            className="object-contain p-2"
          />
        </div>

        {/* Info */}
        <div className="flex-1">
          <div className="flex items-center gap-2">
            {badge && <AwardBadge type={badge} />}
            <span className="text-[11px] text-neutral-400">#{rank}</span>
          </div>
          <h3 className="mt-1 text-lg font-bold text-neutral-900">{name}</h3>
          <p className="mt-1.5 text-[13px] leading-relaxed text-neutral-500">
            {summary}
          </p>
          <div className="mt-2.5 flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <ScoreBadge score={score} showLabel />
            </div>
            <span className="text-sm font-semibold text-neutral-900">{price}</span>
          </div>
          <div className="mt-2.5 flex gap-2">
            {buyUrl && (
              <a
                href={buyUrl}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="inline-flex items-center gap-1 rounded-md bg-accent px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-accent/90"
              >
                {buyLabel}
                <ExternalLink className="h-3 w-3" />
              </a>
            )}
            <Link
              href={href}
              className="inline-flex items-center rounded-md border border-primary px-3.5 py-1.5 text-xs font-medium text-primary hover:bg-primary-lightest"
            >
              Read Review →
            </Link>
          </div>
        </div>
      </div>

      {/* Specs strip */}
      {specs && Object.keys(specs).length > 0 && (
        <div className="mt-3.5 flex flex-wrap gap-4 border-t border-neutral-100 pt-3.5 text-xs">
          {Object.entries(specs).slice(0, 5).map(([key, value]) => (
            <span key={key} className="text-neutral-400">
              {key}: <strong className="text-neutral-700">{value}</strong>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add components/QuickPicks.tsx components/RankedProductCard.tsx
git commit -m "feat: add QuickPicks and RankedProductCard components for category pages"
```

---

## Task 13: Category Pages Rewrite (Cameras Hub)

**Files:**
- Modify: `app/best/cameras/page.tsx`

- [ ] **Step 1: Rewrite the cameras hub page**

This is a large file (443 lines). Replace its full contents with the new editorial layout that uses `Breadcrumb`, `QuickPicks`, `RankedProductCard`, `SectionLabel`, `Newsletter`, `AdBanner`, and the "How We Test" pattern from the spec.

Key structural changes:
- Add `Breadcrumb` at top: `Home › Cameras`
- Blue gradient header with "Best Of" badge, title, subtitle, meta
- `7fr / 3fr` grid layout
- Main column: QuickPicks bar → RankedProductCard list → Ad → How We Test section
- Sidebar: Jump To nav → Related Guides (blue-tinted) → Ad → Newsletter

Use the existing static camera data but restructure it to feed the new components. Map each camera's `badge` field to the `AwardBadge` type (`'best-overall' | 'best-value' | 'budget-pick'`).

The pattern is identical to what was shown in the spec mockup. Maintain all existing camera data — just present it through the new components.

- [ ] **Step 2: Apply the same pattern to the hybrid-cameras subcategory**

Update `app/best/cameras/hybrid-cameras/page.tsx` to follow the same layout pattern:
- Breadcrumb, blue gradient header, QuickPicks, RankedProductCard list, sidebar

- [ ] **Step 3: Apply the same pattern to power-stations hub**

Update `app/best/power-stations/page.tsx` with the same editorial layout.

- [ ] **Step 4: Apply to remaining subcategory pages**

Update all remaining subcategory pages under `app/best/cameras/` and `app/best/power-stations/` with the same template pattern. Each page uses the same components — only the data differs.

- [ ] **Step 5: Verify category pages render**

```bash
npm run dev
```

Check:
- http://localhost:3000/best/cameras
- http://localhost:3000/best/cameras/hybrid-cameras
- http://localhost:3000/best/power-stations

Each should show: breadcrumbs, blue header, quick picks, ranked product cards with specs strips, how-we-test section, sidebar.

- [ ] **Step 6: Commit**

```bash
git add app/best/
git commit -m "feat: rewrite category pages with editorial layout — quick picks, ranked cards, sidebar"
```

---

## Task 14: Best Hub Page Update

**Files:**
- Modify: `app/best/page.tsx`

- [ ] **Step 1: Update Best hub page to match design system**

Update `app/best/page.tsx` to use the new design tokens and components:
- Blue gradient header with SectionLabel
- Featured categories using the new card styles (border-l accent colors, neutral backgrounds)
- "How We Test" section with blue-tinted background
- Sidebar with category browser, newsletter
- Replace any `trustworthy`/`lighttrustworthy` color references with `primary`/`primary-lightest`

- [ ] **Step 2: Commit**

```bash
git add app/best/page.tsx
git commit -m "feat: update best hub page with editorial design system"
```

---

## Task 15: Error & 404 Pages

**Files:**
- Modify: `app/error.tsx`
- Modify: `app/not-found.tsx`

- [ ] **Step 1: Update error.tsx with brand styling**

Update `app/error.tsx` to use:
- `bg-neutral-50` background
- `text-primary` for accent elements
- Brand-consistent typography (Inter)
- A "Return home" link styled as the accent CTA

- [ ] **Step 2: Update not-found.tsx with brand styling**

Update `app/not-found.tsx` similarly:
- Clean 404 page with brand colors
- "Back to home" link in primary blue

- [ ] **Step 3: Commit**

```bash
git add app/error.tsx app/not-found.tsx
git commit -m "feat: update error and 404 pages with brand styling"
```

---

## Task 16: Final Polish & Cleanup

**Files:**
- Multiple files (cleanup pass)

- [ ] **Step 1: Search for any remaining old color references**

```bash
grep -r "trustworthy\|lighttrustworthy\|bg-blue-700\|text-blue-700\|bg-green-700\|text-green-700" --include="*.tsx" --include="*.ts" app/ components/ lib/
```

Replace any remaining old color references with design token equivalents.

- [ ] **Step 2: Remove unused components**

If `components/PostPreview.tsx` and the old `components/ScoreCard.tsx` (root-level, not article/) are no longer imported anywhere, delete them.

```bash
grep -r "PostPreview\|from.*ScoreCard" --include="*.tsx" app/ components/
```

Only delete if zero imports found.

- [ ] **Step 3: Add .superpowers to .gitignore**

```bash
echo ".superpowers/" >> .gitignore
```

- [ ] **Step 4: Verify full build**

```bash
npm run build
```

The build should complete without errors. Fix any TypeScript or build issues that arise.

- [ ] **Step 5: Final commit**

```bash
git add -A
git commit -m "chore: cleanup old color references, remove unused components, add .superpowers to gitignore"
```

---

## Summary

| Task | Description | Key Files |
|------|-------------|-----------|
| 1 | Install deps, Inter font, root layout | `package.json`, `app/layout.tsx` |
| 2 | Design tokens — CSS vars & Tailwind config | `styles/theme.css`, `tailwind.config.ts` |
| 3 | Shared components — SectionLabel, ScoreBadge, AwardBadge, Breadcrumb | `components/*.tsx` |
| 4 | Header redesign — gradient, search, dropdown | `components/Header.tsx`, new components |
| 5 | Footer redesign — dark, 4-column | `components/Footer.tsx` |
| 6 | Newsletter & Trending restyle | `components/Newsletter.tsx`, `Top10Popular.tsx` |
| 7 | ReviewCard component | `components/ReviewCard.tsx` |
| 8 | Home page rewrite | `app/page.tsx` |
| 9 | Article components — VerdictBox, BuyBox, TOC | New components |
| 10 | Article sub-component updates | `components/article/*.tsx` |
| 11 | Article page layout rewrite | `app/articles/[slug]/articlePage.tsx` |
| 12 | Category components — QuickPicks, RankedProductCard | New components |
| 13 | Category pages rewrite | `app/best/**` |
| 14 | Best hub page update | `app/best/page.tsx` |
| 15 | Error & 404 pages | `app/error.tsx`, `app/not-found.tsx` |
| 16 | Final polish & cleanup | Multiple files |
