# Reference — Component Catalog

A quick index of every component in `components/` with its purpose and the props that matter most. For exact prop types, open the source file — this catalog favors usefulness over exhaustive type signatures.

## Layout & chrome

| Component | File | Purpose |
|---|---|---|
| `Header` | `components/Header.tsx` | Sticky desktop nav — logo, `NAV_LINKS`, `CategoryDropdown`, `SearchBar`. No mobile nav (see `MobileBottomNav`). |
| `TrustBar` | `components/TrustBar.tsx` | RSC trust-signals strip below header on all pages. Dynamic post count + latest review date. |
| `MobileBottomNav` | `components/MobileBottomNav.tsx` | `'use client'` — persistent bottom bar (mobile only) + slide-up category sheet. |
| `Footer` | `components/Footer.tsx` | Footer links, social, copyright |
| `Breadcrumb` | `components/Breadcrumb.tsx` | Breadcrumb trail (`Home › Best › Power Stations › RV`) |
| `CategoryDropdown` | `components/CategoryDropdown.tsx` | Desktop "More ▾" dropdown, uses `NAV_CATEGORIES` |
| `SearchBar` | `components/SearchBar.tsx` | Client-side search/filter (`'use client'`), desktop-only |

## Product surfaces

### `RankedProductCard`

`components/RankedProductCard.tsx` — the workhorse of category pages.

```tsx
<RankedProductCard
  rank={1}
  name="EcoFlow Delta 3 Plus"
  href="/articles/ecoflow_delta_3_plus"
  image="https://..."
  summary="One-paragraph hook."
  score={9.2}
  badge="best-overall"           // 'best-overall' | 'best-value' | 'budget-pick'
  buyUrl="https://amazon.com/..."  // retained, not rendered yet — for future "Check Price"
  specs={{ Capacity: "1024 Wh" }}
/>
```

**No `price` prop** — prices are not shown on cards (only on full review pages). Stretched-link card (whole card clickable). Score badge at `size="lg"` with label. State layer + lift on hover. "Read Review →" ghost CTA.

### `ReviewCard`

Image-forward vertical card for the home page Latest Reviews grid (`grid-cols-2 sm:grid-cols-3`).

### `QuickPicks`

Three-up grid for "Best Overall / Best Value / Budget Pick" — feed it the output of `getQuickPicks(entries)`.

### `ComparisonCard`

```tsx
<ComparisonCard
  a={stationA}          // PowerStationEntry
  b={stationB}          // PowerStationEntry
  verdict="The Delta 3 Plus wins on recharge speed; the C1000 wins on value."
  buyA="https://..."
  buyB="https://..."
/>
```

Side-by-side spec table with winning rows tinted `--primary-light`. Numeric-leading spec values are parsed via `extractNum()` to compute the winner.

## Article components (`components/article/`)

| Component | Purpose |
|---|---|
| `ArticleContent` | Wraps the rendered markdown body with `.article-body` styling |
| `ProductSpecs` | Renders the `specs` object as a definition list |
| `ProsCons` | Two-column pros / cons lists |
| `ProductImage` | Hero product image |
| `ScoreCard` | Large numeric score + metric breakdown |
| `StarRating` | 0–5 star visual derived from a 0–10 score |
| `RatingBadge` | Compact score badge |
| `PriceButton` / `RetailerLinks` | Buy-now CTAs from `retailerLinks` |
| `AuthorBio` | Byline + bio block |
| `RelatedArticles` | Links to other reviews in the same category |
| `TableOfContents` | Auto-generated from H2/H3 anchors |
| `StickyBuyBar` | Fixed bottom bar with price + buy button (`'use client'`) |

## Interactive

### `PowerStationQuiz`

`'use client'`. Three-question finder. State machine inside the component; routing matrix in `getRoute(answers)` returns a sub-category URL. Submit disabled until all three answered.

### `Newsletter`

Single-input email signup, inline validation, no modal.

### `Top10Popular`

Sidebar widget rendering the top 10 by score across the catalog.

## Badges & labels

| Component | Purpose |
|---|---|
| `ScoreBadge` | Circular score badge, color ramped by value |
| `AwardBadge` | `best-overall` / `best-value` / `budget-pick` chips |
| `SectionLabel` | Uppercase section heading (e.g. "EDITOR'S PICK") |
| `VerdictBox` | Styled verdict callout |
| `BuyBox` | Price + buy-button container |

## Utility

### `OptimizedImage`

Thin wrapper around `next/image` that adds:

- Fallback image on error.
- Loading placeholder.
- Reliable width/height (so CLS stays near zero).

**Always use this instead of raw `<img>` or even bare `next/image`.**

### `card.tsx`

Generic card primitive (shadcn-style). Use it as the base for new card-shaped UIs.

## Ads (`components/ads/`)

### `AdBanner`

```tsx
<AdBanner adSlot="articleTop" adFormat="rectangle" />
```

- `adSlot` must exist in `ADSENSE_CONFIG` (`lib/adsense-config.ts`).
- `adFormat`: `'rectangle' | 'leaderboard' | 'banner' | 'vertical' | 'auto'`.
- Renders a labeled placeholder in dev; real AdSense unit in prod when the publisher ID is set.

### `ResponsiveAd`

Adaptive wrapper that swaps between mobile/desktop slots based on viewport.

## Picking the right component

| You want to… | Reach for |
|---|---|
| Show a ranked product on a category page | `RankedProductCard` |
| Show the top 3 with award badges | `QuickPicks` |
| Compare two products side-by-side | `ComparisonCard` |
| Show a single product in a list (home) | `ReviewCard` |
| Display the overall score and breakdown | `ScoreCard` + `StarRating` |
| Render a markdown body | `ArticleContent` (and let the pipeline do the work) |
| Insert an ad | `AdBanner` (never inline AdSense code) |
| Insert any image | `OptimizedImage` |
| Build a new card-shaped UI | Start from `card.tsx`, extend with `class-variance-authority` |
| Add trust signals below the header | Already there via `TrustBar` in `layout.tsx` — update the `signals` array inside it |
| Add a new top-level nav category | Add an entry to `lib/nav-categories.ts` — appears in desktop dropdown and mobile sheet automatically |
