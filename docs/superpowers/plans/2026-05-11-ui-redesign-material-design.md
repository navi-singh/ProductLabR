# UI Redesign — Material Design 3 Alignment Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign ProductLabR's UI to fix 5 high/medium impact engagement issues: under-powered hero, text-heavy cards, full-page mobile nav takeover, monochromatic palette, and inconsistent type scale — all aligned to Material Design 3 guidelines.

**Architecture:** Approach B (design-system first): establish shared CSS utilities and a corrected color rule in ScoreBadge first, then apply to every component in dependency order. Two new components (TrustBar, MobileBottomNav) are wired into layout.tsx last so they render site-wide without touching individual pages. Prices are removed from all card surfaces; they remain only on full review pages.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript 5 strict, Tailwind CSS 3.4, Inter + Playfair Display (Google Fonts via next/font)

---

## File Map

| Action | File | Responsibility |
|---|---|---|
| Modify | `tailwind.config.ts` | Add `fontFamily.display` so `font-display` utility works |
| Modify | `styles/global.css` | Add `.type-*` utilities + `.state-layer` / `.state-layer-light` |
| Modify | `components/ScoreBadge.tsx` | Swap `bg-green-600` → `bg-accent`, `bg-blue-600` → `bg-primary` |
| Create | `lib/nav-categories.ts` | Shared category list (used by Header + MobileBottomNav) |
| Create | `components/TrustBar.tsx` | RSC trust-signals strip rendered under header on all pages |
| Modify | `components/ReviewCard.tsx` | Image-forward vertical card, remove price, fix score scale |
| Modify | `components/RankedProductCard.tsx` | Remove price + "In Stock", promote score badge, add state layer |
| Modify | `app/page.tsx` | Hero redesign, ReviewCard grid, Best Of guide card icons |
| Create | `components/MobileBottomNav.tsx` | Persistent bottom nav bar + slide-up category sheet |
| Modify | `components/Header.tsx` | Remove mobile nav; import categories from shared lib |
| Modify | `app/layout.tsx` | Add TrustBar + MobileBottomNav; add `pb-16 md:pb-0` to main |

---

## Task 1: Tailwind `font-display` + CSS type utilities + state layer

**Files:**
- Modify: `tailwind.config.ts`
- Modify: `styles/global.css`

- [ ] **Step 1: Add `fontFamily.display` to Tailwind config**

Open `tailwind.config.ts` and add `display` to `theme.extend.fontFamily`:

```ts
// tailwind.config.ts — inside theme.extend.fontFamily
fontFamily: {
  sans: ['var(--font-sans)'],
  display: ['var(--font-display)'],   // ← add this line
},
```

- [ ] **Step 2: Add type utilities and state layer to global.css**

Append to the bottom of `styles/global.css`:

```css
/* ── Type scale — 5 roles ───────────────────────────────────────────────── */
@layer components {
  .type-display  { @apply font-display text-[32px] font-extrabold leading-tight; }
  .type-headline { @apply font-display text-[20px] font-bold leading-snug; }
  .type-title    { @apply font-sans text-[15px] font-semibold leading-snug; }
  .type-body     { @apply font-sans text-[14px] font-normal leading-relaxed; }
  .type-label    { @apply font-sans text-[11px] font-semibold uppercase tracking-[0.06em]; }
}

/* ── MD3 state layers ───────────────────────────────────────────────────── */
@layer components {
  .state-layer {
    @apply relative overflow-hidden;
  }
  .state-layer::after {
    content: '';
    @apply absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-150 pointer-events-none;
    background-color: hsl(var(--primary));
  }
  .state-layer:hover::after  { @apply opacity-[0.06]; }
  .state-layer:active::after { @apply opacity-[0.10]; }

  /* For cards with a coloured/dark surface (e.g. rank-1 amber-50 bg) */
  .state-layer-light::after {
    background-color: white;
  }
}
```

- [ ] **Step 3: Verify build picks up new utilities**

```bash
npm run type-check
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add tailwind.config.ts styles/global.css
git commit -m "feat(design): add type-scale utilities and MD3 state-layer classes"
```

---

## Task 2: Update ScoreBadge color logic

**Files:**
- Modify: `components/ScoreBadge.tsx`

- [ ] **Step 1: Update `getScoreBgClass`**

Replace the existing `getScoreBgClass` function (lines ~16-22):

```ts
function getScoreBgClass(score: number): string {
  if (score >= 9.0) return 'bg-accent';     // was bg-green-600
  if (score >= 8.0) return 'bg-primary';    // was bg-blue-600
  if (score >= 7.0) return 'bg-amber-500';
  return 'bg-neutral-500';
}
```

- [ ] **Step 2: Verify**

```bash
npm run type-check
```

Expected: no errors.

- [ ] **Step 3: Check visually**

Open `http://localhost:3000` and navigate to any category page (e.g. `/best/power-stations/portable-power-stations`). Confirm top-ranked products with score ≥9.0 show **orange** badges and 8.x scores show **blue** badges.

- [ ] **Step 4: Commit**

```bash
git add components/ScoreBadge.tsx
git commit -m "feat(design): score badge ≥9.0 uses accent orange, 8.x uses primary blue"
```

---

## Task 3: Extract shared nav categories + create TrustBar

**Files:**
- Create: `lib/nav-categories.ts`
- Create: `components/TrustBar.tsx`

- [ ] **Step 1: Create `lib/nav-categories.ts`**

```ts
// lib/nav-categories.ts
export interface NavCategory {
  name: string;
  href: string;
  icon: string;
  count: number;
}

export const NAV_CATEGORIES: NavCategory[] = [
  { name: 'Laptops',              href: '/best/laptops',          icon: '💻', count: 0  },
  { name: 'TVs',                  href: '/best/tvs',              icon: '📺', count: 0  },
  { name: 'Headphones & Earbuds', href: '/best/headphones',       icon: '🎧', count: 0  },
  { name: 'Smartphones',          href: '/best/smartphones',      icon: '📱', count: 0  },
  { name: 'Monitors',             href: '/best/monitors',         icon: '🖥️', count: 0  },
  { name: 'Smart Home',           href: '/best/smart-home',       icon: '🏠', count: 0  },
  { name: 'Wearables',            href: '/best/wearables',        icon: '⌚', count: 0  },
  { name: 'Gaming',               href: '/best/gaming',           icon: '🎮', count: 0  },
  { name: 'Cameras',              href: '/best/cameras',          icon: '📷', count: 15 },
  { name: 'Power Stations',       href: '/best/power-stations',   icon: '⚡', count: 33 },
];
```

- [ ] **Step 2: Create `components/TrustBar.tsx`**

```tsx
// components/TrustBar.tsx
import getPostMetadata from '@/components/getPostMetadata';

export function TrustBar() {
  const count = getPostMetadata().length;
  const signals = [
    `${count} products tested`,
    'Real-world conditions',
    'No sponsored reviews',
    `Updated ${new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}`,
  ];

  return (
    <div className="bg-primary-dark px-4 py-1.5 sm:px-6">
      <div className="mx-auto flex max-w-content items-center gap-4 overflow-x-auto">
        {signals.map((signal) => (
          <span key={signal} className="type-label flex flex-shrink-0 items-center gap-1.5 text-white/85">
            <span className="text-success">✓</span>
            {signal}
          </span>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Verify**

```bash
npm run type-check
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add lib/nav-categories.ts components/TrustBar.tsx
git commit -m "feat(design): add shared nav-categories and TrustBar RSC"
```

---

## Task 4: Redesign ReviewCard → image-forward vertical card

**Files:**
- Modify: `components/ReviewCard.tsx`

- [ ] **Step 1: Replace ReviewCard with vertical image-forward layout**

Full file replacement:

```tsx
// components/ReviewCard.tsx
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
      className="state-layer group flex flex-col overflow-hidden rounded-xl border border-neutral-200 bg-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card-hover"
    >
      <div className="relative aspect-[3/2] w-full overflow-hidden bg-gradient-to-br from-primary-lightest to-primary-light/30">
        <OptimizedImage
          src={post.image || post.productImage || '/images/item.png'}
          alt={post.title}
          fill
          sizes="(max-width: 640px) 50vw, 33vw"
          className="object-cover"
        />
        {score !== null && (
          <div className="absolute right-2 top-2">
            <ScoreBadge score={score} size="sm" />
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-3">
        {post.category && (
          <span className="type-label text-primary">{post.category}</span>
        )}
        <h3 className="type-title mt-1 line-clamp-2 text-neutral-900">{post.title}</h3>
        {post.subtitle && (
          <p className="type-body mt-1 line-clamp-2 text-neutral-500">{post.subtitle}</p>
        )}
        <span className="type-label mt-2 text-neutral-400">{post.date}</span>
      </div>
    </Link>
  );
}
```

- [ ] **Step 2: Verify**

```bash
npm run type-check
```

Expected: no errors.

- [ ] **Step 3: Preview visually**

Open `http://localhost:3000`. The "Latest Reviews" section should now show image-forward grid cards instead of the horizontal list. Confirm score badges appear on images and no price is shown.

- [ ] **Step 4: Commit**

```bash
git add components/ReviewCard.tsx
git commit -m "feat(design): ReviewCard → image-forward vertical grid card, remove price"
```

---

## Task 5: Update RankedProductCard — remove price, promote score badge, add state layer

**Files:**
- Modify: `components/RankedProductCard.tsx`

- [ ] **Step 1: Replace RankedProductCard**

Full file replacement:

```tsx
// components/RankedProductCard.tsx
import Link from 'next/link';
import { isSafeUrl } from '@/lib/utils';
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
  badge?: 'best-overall' | 'best-value' | 'budget-pick';
  buyUrl?: string;  // retained for future "Check Price" wiring — not rendered yet
  specs?: Record<string, string>;
}

export function RankedProductCard({
  rank, name, href, image, summary, score, badge, buyUrl, specs,
}: RankedProductCardProps) {
  const isTopRanked = rank === 1;

  return (
    <div
      className={[
        'group relative rounded-xl border border-neutral-200 p-5 cursor-pointer',
        'transition-all duration-200 ease-out',
        'hover:-translate-y-1 hover:shadow-xl hover:shadow-neutral-200/80',
        isTopRanked
          ? 'state-layer-light border-l-4 border-l-accent bg-amber-50/30'
          : 'state-layer bg-white',
      ].join(' ')}
    >
      {/* Stretched link — whole card clickable */}
      <Link href={href} className="absolute inset-0 z-0 rounded-xl" aria-label={`Read ${name} review`} />

      <div className="flex flex-col gap-5 sm:flex-row">
        <div className="relative h-36 w-full flex-shrink-0 overflow-hidden rounded-lg bg-gradient-to-br from-primary-lightest to-primary-light/30 sm:w-44">
          <OptimizedImage src={image} alt={name} fill sizes="180px" className="object-contain p-2" />
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-2">
            {badge && <AwardBadge type={badge} />}
            <span className="type-label text-neutral-400">#{rank}</span>
          </div>

          <h3 className="type-title mt-1 text-neutral-900">{name}</h3>
          <p className="type-body mt-1.5 text-neutral-500">{summary}</p>

          <div className="mt-3 flex items-center gap-3">
            <ScoreBadge score={score} size="lg" showLabel />
            <span className="relative z-10 type-label text-primary hover:text-primary-dark">
              Read Review →
            </span>
          </div>
        </div>
      </div>

      {specs && Object.keys(specs).length > 0 && (
        <div className="mt-3.5 flex flex-wrap gap-4 border-t border-neutral-100 pt-3.5">
          {Object.entries(specs).slice(0, 5).map(([key, value]) => (
            <span key={key} className="type-label text-neutral-400">
              {key}: <strong className="font-semibold text-neutral-700">{value}</strong>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Check all callers still compile**

Any page that passes `price` or `buyLabel` to `RankedProductCard` will now get a TypeScript error (those props were removed). Search for usages:

```bash
grep -r "RankedProductCard" app/ --include="*.tsx" -l
```

Open each file returned and remove the `price={...}` and `buyLabel={...}` props from every `<RankedProductCard>` call.

- [ ] **Step 3: Verify**

```bash
npm run type-check
```

Expected: no errors.

- [ ] **Step 4: Preview visually**

Open a category page e.g. `http://localhost:3000/best/power-stations/portable-power-stations`. Confirm: no prices shown, score badge is prominent (36×36), rank-1 card has amber tint + left accent border.

- [ ] **Step 5: Commit**

```bash
git add components/RankedProductCard.tsx app/
git commit -m "feat(design): RankedProductCard removes price, promotes score badge, adds state layer"
```

---

## Task 6: Update Best Of Guide Cards on home page

**Files:**
- Modify: `app/page.tsx` (bestOfGuides section only)

- [ ] **Step 1: Update `bestOfGuides` array in `app/page.tsx`**

Replace the existing `bestOfGuides` const (near top of file):

```ts
const bestOfGuides = [
  { title: 'Best Hybrid Cameras',          href: '/best/cameras/hybrid-cameras',                          count: 8,  icon: '📷', theme: 'blue',   updated: 'Mar 2026' },
  { title: 'Best Portable Power Stations', href: '/best/power-stations/portable-power-stations',           count: 12, icon: '⚡', theme: 'orange', updated: 'Mar 2026' },
  { title: 'Best Camping Power Stations',  href: '/best/power-stations/camping-power-stations',            count: 6,  icon: '🏕️', theme: 'green',  updated: 'Feb 2026' },
  { title: 'Best Pro Photo Cameras',       href: '/best/cameras/professional-photo-cameras',               count: 5,  icon: '🎞️', theme: 'blue',   updated: 'Mar 2026' },
];
```

- [ ] **Step 2: Replace the Best Of Guides JSX in `app/page.tsx`**

Find the `{/* Best Of Guides */}` section and replace the entire `<div className="grid grid-cols-1 gap-3 sm:grid-cols-2">` block:

```tsx
{/* Best Of Guides */}
<SectionLabel>Best Of Guides</SectionLabel>
<div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
  {bestOfGuides.map((guide) => {
    const tintClass =
      guide.theme === 'orange' ? 'bg-amber-50'
      : guide.theme === 'green' ? 'bg-green-50'
      : 'bg-primary-lightest';
    const badgeClass =
      guide.theme === 'orange' ? 'bg-amber-50 text-accent'
      : guide.theme === 'green' ? 'bg-green-50 text-success'
      : 'bg-primary-lightest text-primary';

    return (
      <Link
        key={guide.href}
        href={guide.href}
        className="state-layer relative overflow-hidden rounded-xl border border-neutral-200 bg-white p-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card-hover"
      >
        {/* Tinted corner accent */}
        <div
          className={`pointer-events-none absolute right-0 top-0 h-14 w-14 rounded-bl-[60px] rounded-tr-xl ${tintClass} opacity-70`}
        />
        <span className="text-2xl">{guide.icon}</span>
        <h3 className="type-title mt-2 text-neutral-900">{guide.title}</h3>
        <div className="mt-2 flex items-center justify-between">
          <span className="type-label text-neutral-400">Updated {guide.updated}</span>
          <span className={`type-label rounded-full px-2 py-0.5 ${badgeClass}`}>
            {guide.count} tested
          </span>
        </div>
      </Link>
    );
  })}
</div>
```

- [ ] **Step 3: Verify**

```bash
npm run type-check
```

Expected: no errors.

- [ ] **Step 4: Preview visually**

Open `http://localhost:3000`. The "Best Of Guides" section should show cards with emoji icons, tinted corner accents (blue/orange/green), and "N tested" pill badges. No border-left stripes.

- [ ] **Step 5: Commit**

```bash
git add app/page.tsx
git commit -m "feat(design): Best Of guide cards get emoji icon, tinted corner, tested-count badge"
```

---

## Task 7: Redesign Hero section

**Files:**
- Modify: `app/page.tsx` (hero section only)

- [ ] **Step 1: Replace the hero `<section>` in `app/page.tsx`**

Find the `{/* Hero — Editor's Pick */}` section and replace the entire `<section>` block:

```tsx
{/* Hero — Editor's Pick */}
<section className="-mx-4 bg-gradient-to-b from-primary-lightest via-blue-50 to-neutral-50 px-4 py-10 sm:-mx-6 sm:px-6">
  <div className="flex items-center gap-2">
    <span className="h-2 w-2 rounded-full bg-accent" />
    <span className="type-label text-accent">Editor&apos;s Pick</span>
  </div>

  {featured && (
    <div className="mt-5 grid items-center gap-6 md:grid-cols-2">
      <div>
        <h1 className="type-display text-neutral-900">{featured.title}</h1>
        {featured.subtitle && (
          <p className="type-body mt-3 max-w-md text-neutral-500">{featured.subtitle}</p>
        )}

        {featuredScore !== null && (
          <div className="mt-4 flex items-center gap-3">
            <ScoreBadge score={featuredScore} size="lg" showLabel />
          </div>
        )}

        <div className="mt-5">
          <Link
            href={`/articles/${featured.slug}`}
            className="inline-block rounded-md bg-accent px-6 py-3 type-title text-white transition-opacity hover:opacity-90"
          >
            Read Full Review →
          </Link>
        </div>
      </div>

      <div className="relative h-52 overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-featured md:h-64">
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
```

- [ ] **Step 2: Fix `featuredScore` calculation** (remove the erroneous `/10` division)

Find the `featuredScore` const near the top of the `Home` function and replace it:

```ts
const featuredScore = featured?.ratingBreakdown
  ? featured.ratingBreakdown.metrics.reduce((sum, m) => sum + m.score, 0) /
    featured.ratingBreakdown.metrics.length
  : featured?.rating
    ? featured.rating * 2
    : null;
```

- [ ] **Step 3: Verify**

```bash
npm run type-check
```

Expected: no errors.

- [ ] **Step 4: Preview visually**

Open `http://localhost:3000`. The hero should now have:
- Larger Playfair headline (32px)
- Score badge in accent orange (if score ≥ 9.0)
- Taller product image (h-64 on desktop)
- Single "Read Full Review →" CTA in accent orange
- No price shown

- [ ] **Step 5: Commit**

```bash
git add app/page.tsx
git commit -m "feat(design): hero display headline, taller image, accent CTA, remove price + Buy Now"
```

---

## Task 8: Update home page ReviewCard grid layout

> Note: Tasks 6, 7, and 8 all edit `app/page.tsx`. Execute them in order — each step modifies a different section of the file.

**Files:**
- Modify: `app/page.tsx` (Latest Reviews section only)

- [ ] **Step 1: Change `space-y-1` list to a 2/3-col grid**

Find the `{/* Latest Reviews */}` section and replace the wrapper `<div>`:

```tsx
{/* Latest Reviews */}
<SectionLabel>Latest Reviews</SectionLabel>
<div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
  {recentPosts.map((post) => (
    <ReviewCard key={post.slug} post={post} />
  ))}
</div>
```

- [ ] **Step 2: Verify**

```bash
npm run type-check
```

Expected: no errors.

- [ ] **Step 3: Preview visually**

Open `http://localhost:3000`. Latest Reviews should be a 2-column grid on mobile, 3-column on sm+. Cards are image-forward with score badge overlaid.

- [ ] **Step 4: Commit**

```bash
git add app/page.tsx
git commit -m "feat(design): Latest Reviews changes from list to 2/3-col image-forward grid"
```

---

## Task 9: Create MobileBottomNav component

**Files:**
- Create: `components/MobileBottomNav.tsx`

- [ ] **Step 1: Create `components/MobileBottomNav.tsx`**

```tsx
// components/MobileBottomNav.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NAV_CATEGORIES } from '@/lib/nav-categories';

const NAV_ITEMS = [
  { label: 'Home',       href: '/',      icon: '🏠' },
  { label: 'Best Of',    href: '/best',  icon: '🏆' },
  { label: 'Search',     href: null,     icon: '🔍' }, // triggers search — future hook
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
          <div className="fixed inset-x-0 bottom-16 z-50 max-h-[60vh] overflow-y-auto rounded-t-2xl bg-white pb-4 shadow-xl md:hidden">
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
```

- [ ] **Step 2: Verify**

```bash
npm run type-check
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add components/MobileBottomNav.tsx
git commit -m "feat(design): add MobileBottomNav with persistent bottom bar and slide-up sheet"
```

---

## Task 10: Remove mobile nav from Header + import shared categories

**Files:**
- Modify: `components/Header.tsx`

- [ ] **Step 1: Replace Header.tsx**

Full file replacement:

```tsx
// components/Header.tsx
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
  { label: 'Laptops',     href: '/best/laptops'     },
  { label: 'TVs',         href: '/best/tvs'          },
  { label: 'Headphones',  href: '/best/headphones'   },
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
```

- [ ] **Step 2: Verify `CategoryDropdown` still accepts `NAV_CATEGORIES`**

`CategoryDropdown` expects `{ name, href, count }[]`. `NAV_CATEGORIES` has `{ name, href, icon, count }` — the extra `icon` field is fine (TypeScript structural typing allows extra props on objects passed to functions).

```bash
npm run type-check
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add components/Header.tsx
git commit -m "feat(design): Header removes mobile nav takeover, uses shared nav-categories"
```

---

## Task 11: Wire TrustBar + MobileBottomNav into layout.tsx

**Files:**
- Modify: `app/layout.tsx`

- [ ] **Step 1: Update `app/layout.tsx`**

Add the two new imports and update the `<body>` JSX. Replace the full `<body>` block:

```tsx
// Add to imports at top of app/layout.tsx:
import { TrustBar } from '@/components/TrustBar';
import { MobileBottomNav } from '@/components/MobileBottomNav';
```

Replace the `<body>` contents:

```tsx
<body className="font-sans antialiased bg-neutral-50 text-neutral-700">
  <script
    type="application/ld+json"
    dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
  />
  <Script
    async
    src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CONFIG.publisherId}`}
    crossOrigin="anonymous"
    strategy="afterInteractive"
  />
  <Header posts={posts} />
  <TrustBar />
  <main className="mx-auto max-w-[1280px] px-4 pb-16 sm:px-6 md:pb-0">
    {children}
  </main>
  <Footer />
  <MobileBottomNav />
  {gaId && <GoogleAnalytics gaId={gaId} />}
</body>
```

- [ ] **Step 2: Verify**

```bash
npm run type-check
```

Expected: no errors.

- [ ] **Step 3: Preview the full site**

Open `http://localhost:3000`:
- Trust bar (dark blue strip with ✓ signals) should appear directly below the header on every page
- Resize to mobile width (< 768px): bottom nav bar should be visible with Home / Best Of / Search / Categories tabs
- Tap "Categories" on mobile: slide-up sheet should open with 2-column category grid
- Page content should not be hidden behind the bottom bar (pb-16 padding)
- Tap the backdrop or tap a category link: sheet should close

- [ ] **Step 4: Commit**

```bash
git add app/layout.tsx
git commit -m "feat(design): wire TrustBar and MobileBottomNav into root layout"
```

---

## Task 12: Final verification

- [ ] **Step 1: Full build check**

```bash
npm run test:build
```

Expected: lint passes, type-check passes, build completes with all routes prerendered.

- [ ] **Step 2: Acceptance criteria walkthrough**

Check each item against the running dev server at `http://localhost:3000`:

| Criterion | Where to check |
|---|---|
| 5 type roles as Tailwind utilities; no `text-[Npx]` in changed files | `grep -n 'text-\[' components/ReviewCard.tsx components/RankedProductCard.tsx app/page.tsx` — expect 0 hits |
| Score ≥9.0 = accent orange, 8.x = primary blue | `/best/power-stations/portable-power-stations` |
| No price on ReviewCard, RankedProductCard, hero, Best Of cards | Home page + any category page |
| Bottom nav bar visible on mobile, hidden on desktop | Resize browser / DevTools mobile emulation |
| Slide-up sheet opens/closes; backdrop closes it | Mobile view, tap Categories |
| Trust bar below header on all pages | Home + article page + category page |
| Hover = state layer + lift on cards | Hover any ReviewCard or RankedProductCard |
| Best Of cards: emoji icon + "N tested" + tinted corner | Home page Best Of section |

- [ ] **Step 3: Final commit if any last fixes applied**

```bash
git add -p
git commit -m "fix(design): final polish from acceptance criteria walkthrough"
```
