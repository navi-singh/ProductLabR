# UI Redesign — Material Design 3 Alignment

**Date:** 2026-05-11
**Scope:** High + medium impact issues only (issues 1–5 from audit)
**Goal:** Maximize user engagement and visual trust on ProductLabR

---

## 1. Context & Problem

A consumer-perspective UI audit surfaced 8 issues against Google Material Design 3 guidelines. This spec covers the 5 high/medium impact issues:

1. Hero section is under-powered (small image, weak headline, no trust signals)
2. ReviewCards are text-heavy with tiny images (120×80px) and show price
3. Mobile navigation is a full-page takeover that kills browsing context
4. Monochromatic blue palette — accent orange underused, no surface differentiation
5. 12 ad-hoc font sizes with no structured type scale

**Cross-cutting change:** Prices removed from all cards (ReviewCard, RankedProductCard, category guide cards, hero). Prices remain only on individual article/review pages.

---

## 2. Design Foundation

### 2.1 Type Scale — 5 roles (replaces 12 ad-hoc sizes)

| Role | Font | Size | Weight | Usage |
|---|---|---|---|---|
| Display | Playfair Display | 32px | 800 | Hero headline, article `<h1>` |
| Headline | Playfair Display | 20px | 700 | Section headings, card H2 |
| Title | Inter | 15px | 600 | Product names in cards |
| Body | Inter | 14px | 400 | Descriptions, summaries, prose |
| Label | Inter | 11px | 600 + uppercase + 0.06em tracking | Badges, metadata, section labels, dates |

**Retired sizes:** `text-[10px]`, `text-[13px]`, `text-[15px]`, `text-xl`, `text-2xl`, `text-3xl`, `text-4xl` as standalone arbitrary sizes — each must map to one of the 5 roles above.

Implement as Tailwind `@layer base` utilities:
```css
.type-display  { @apply font-display text-[32px] font-extrabold leading-tight; }
.type-headline { @apply font-display text-[20px] font-bold leading-snug; }
.type-title    { @apply font-sans text-[15px] font-semibold leading-snug; }
.type-body     { @apply font-sans text-[14px] font-normal leading-relaxed; }
.type-label    { @apply font-sans text-[11px] font-semibold uppercase tracking-[0.06em]; }
```

### 2.2 Color Roles — updated usage rules

Existing CSS variables are unchanged. Only usage rules are updated:

| Token | New rule |
|---|---|
| `--primary` (#007ACC) | Header bg, primary buttons, score badges 8.0–8.9, active nav indicators |
| `--accent` (#E87B35) | **Promoted:** all score badges ≥9.0, all primary CTA buttons, award badges, Editor's Pick dot, trust bar checkmarks |
| `--primary-lightest` | Card hover surface tint, selected chip bg, trending widget bg |
| `--success` | "In Stock" states only — no longer used for score badges |
| Neutral-900 | All heading text — never use primary blue for large text blocks |

**New rule for score badges:**
- Score ≥ 9.0 → `bg-accent` (orange)
- Score 8.0–8.9 → `bg-primary` (blue)
- Score 7.0–7.9 → `bg-amber-500`
- Score < 7.0 → `bg-neutral-500`

### 2.3 State Layers — MD3 interaction model

Replace ad-hoc hover background-color changes with consistent state layers:

```css
/* Applied to all interactive card surfaces */
.state-layer {
  @apply relative overflow-hidden;
}
.state-layer::after {
  content: '';
  @apply absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-150 pointer-events-none;
  /* white surface cards: primary tint; colored-surface cards override to bg-white */
  background-color: hsl(var(--primary));
}
.state-layer:hover::after  { @apply opacity-[0.06]; }
.state-layer:active::after { @apply opacity-[0.10]; }

/* Variant for cards with a colored/dark surface (e.g. rank-1 amber-50 card) */
.state-layer-light::after {
  background-color: white;
}
```

Cards additionally get `hover:-translate-y-0.5 hover:shadow-card-hover` for lift effect. The rank-1 `RankedProductCard` (amber-50 bg) uses `.state-layer-light`.

---

## 3. Component Changes

### 3.1 Hero Section (`app/page.tsx`)

**Changes:**
- Trust bar: add a slim `<div>` between `<Header>` and the hero section with 4 credibility signals
- Hero image: increase container from `h-44 md:h-52` → `h-52 md:h-64`; change `object-contain p-4` → `object-cover` with white-bg container
- Headline: change from `text-2xl md:text-[26px]` → `type-display` (Playfair 32px/800)
- Subtitle: `type-body` (14px/400)
- Score badge: increase to `size="lg"` (36×36 block); use accent color for ≥9.0
- Remove price display from hero
- CTA: Keep "Read Full Review" as primary accent button; remove "Buy Now" button (price strategy change)

**Trust bar markup** (new component `components/TrustBar.tsx`, RSC):
```tsx
import getPostMetadata from '@/components/getPostMetadata';
// post count derived at build time — stays accurate as content grows
const count = getPostMetadata().length;
const signals = [
  `${count} products tested`,
  'Real-world conditions',
  'No sponsored reviews',
  `Updated ${new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}`,
];
// Rendered as slim strip below header: bg-primary-dark, 5px py, label-type text
```

### 3.2 ReviewCard (`components/ReviewCard.tsx`)

**Layout change:** horizontal list → vertical image-forward card.

```
┌────────────────────┐
│  [image — 3:2]     │  ← score badge overlaid top-right
│  ← full width →    │
├────────────────────┤
│  LABEL (category)  │
│  Title (15px/600)  │
│  Body (14px/400)   │
│  date · · · · · ·  │
└────────────────────┘
```

- **Image:** `aspect-[3/2]` full width, `object-cover`, white bg
- **Score badge:** `absolute top-2 right-2`, sized `px-2 py-0.5`, color by score rule above
- **Remove:** `{post.price}` — not rendered
- **Grid:** home page changes from `space-y-1` list → `grid grid-cols-2 gap-4 sm:grid-cols-3`
- **Hover:** state layer + `hover:-translate-y-0.5 hover:shadow-card-hover`

### 3.3 RankedProductCard (`components/RankedProductCard.tsx`)

**Changes:**
- Remove `{price}` and "In Stock" text entirely from render
- Score badge: promote to `size="lg"` 36×36 block; apply new color rule
- Score label ("Excellent") shown in accent color next to badge
- `buyUrl` CTA: keep as ghost button `"Read Review →"` (label change); `buyLabel` prop deprecated
- State layer added to card wrapper

**Props change:** `price` removed from interface. `buyLabel` prop removed. `buyUrl` made optional and **not rendered** — retained on the interface so a future "Check Price" CTA can be wired in without a breaking change. The "Read Review →" link uses the existing `href` prop.

### 3.4 Best Of Guide Cards (home page, `app/page.tsx`)

Replace `bestOfGuides` array cards with new `CategoryGuideCard` pattern:

Each card gets:
- **Emoji icon** (configured per guide in the `bestOfGuides` array)
- **Tinted corner accent** (top-right quarter-circle, color matches category theme)
- **"N tested" pill badge** (accent/primary/success color by category)
- Remove border-left colored stripe
- Remove price-range text

```tsx
const bestOfGuides = [
  { title: 'Best Hybrid Cameras',            href: '...', count: 8,  icon: '📷', theme: 'blue',   updated: 'Mar 2026' },
  { title: 'Best Portable Power Stations',   href: '...', count: 12, icon: '⚡', theme: 'orange', updated: 'Mar 2026' },
  { title: 'Best Camping Power Stations',    href: '...', count: 6,  icon: '🏕️', theme: 'green',  updated: 'Feb 2026' },
  { title: 'Best Pro Photo Cameras',         href: '...', count: 5,  icon: '🎞️', theme: 'blue',   updated: 'Mar 2026' },
];
```

Theme → tint mapping: `blue` = primary-lightest, `orange` = amber-50, `green` = green-50.

### 3.5 Mobile Navigation (`components/Header.tsx`)

**Replace** the existing hamburger full-page nav with a two-piece mobile pattern:

**A. Persistent bottom nav bar** (new component `components/MobileBottomNav.tsx`, `'use client'`):
- Fixed bottom, `z-50`, white bg, border-top
- 4 destinations: Home · Best Of · Categories · Search
- Active tab: primary color icon + label + 2px indicator line
- "Categories" tap opens the slide-up sheet
- Hidden on `md+` breakpoints

**B. Slide-up category sheet** (within `MobileBottomNav`):
- Triggered by "Categories" tap; state: `sheetOpen: boolean`
- `fixed inset-x-0 bottom-0 z-50`, slides up via `transform translate-y`
- Drag handle pill at top
- `grid grid-cols-2 gap-2` of category tiles — each with emoji icon + name
- Backdrop `div` at `z-40` closes sheet on tap
- `max-h-[60vh] overflow-y-auto`

**Remove** from `Header.tsx`:
- `mobileOpen` state
- hamburger `<button>` on mobile
- Mobile nav `<div>` (the full-column dropdown)

`Header.tsx` retains its sticky desktop nav; `MobileBottomNav` is added to `app/layout.tsx` alongside `<Header>`.

**Body padding:** add `pb-16 md:pb-0` to `<main>` in `app/layout.tsx` to prevent content from hiding behind the bottom bar.

---

## 4. Files Changed

| File | Change |
|---|---|
| `styles/global.css` | Add `.type-*` utility classes, `.state-layer` mixin |
| `styles/theme.css` | No token changes — usage rule changes only |
| `components/TrustBar.tsx` | New RSC — trust signals strip |
| `components/MobileBottomNav.tsx` | New client component — bottom bar + slide-up sheet |
| `components/ReviewCard.tsx` | Layout → image-forward grid card; remove price |
| `components/RankedProductCard.tsx` | Remove price + "In Stock"; promote score badge; state layer |
| `components/ScoreBadge.tsx` | Update `getScoreBgClass` — accent for ≥9.0 |
| `app/page.tsx` | Hero redesign; trust bar; ReviewCard grid layout; Best Of card icons |
| `app/layout.tsx` | Add `<TrustBar>`, `<MobileBottomNav>`; add `pb-16 md:pb-0` to main |

---

## 5. Out of Scope

- Article page redesign (prices stay on review pages — no change needed)
- Dark mode
- Animation library changes (Framer Motion usage stays as-is)
- AdSense slot positions
- Any new routes or content changes

---

## 6. Acceptance Criteria

- [ ] All 5 type roles defined as Tailwind utilities; no arbitrary `text-[Npx]` sizes remain in the changed files
- [ ] Score badge is accent orange for ≥9.0, primary blue for 8.0–8.9 across ReviewCard, RankedProductCard, and hero
- [ ] Price field not rendered on ReviewCard, RankedProductCard, hero, or Best Of guide cards
- [ ] Bottom nav bar visible on mobile (`< md`), hidden on desktop
- [ ] Slide-up category sheet opens/closes correctly; backdrop closes it
- [ ] Trust bar renders below header on all pages
- [ ] Hover states use state layer + lift on all cards (no background-color-only hover)
- [ ] Best Of guide cards show emoji icon + "N tested" badge + tinted corner accent
- [ ] `npm run test:build` passes (lint + type-check + build)
