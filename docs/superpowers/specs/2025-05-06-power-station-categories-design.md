# Power Station Category Expansion — Design Spec

**Date:** 2025-05-06  
**Status:** Approved  
**Scope:** 7 new category pages + 3 comparison pages + 1 finder quiz

---

## Context

ProductLabR has 33 power station reviews but only 4 category landing pages organized by spec (capacity/portability). Research shows top review sites drive significantly more traffic and engagement through use-case-first categorization. This spec covers expanding to use-case and price-intent category pages, adding model-vs-model comparison pages, and embedding a 3-question finder quiz on the power station hub.

---

## 1. Data Layer

**File:** `lib/power-station-data.ts`

Single source of truth for all power station category pages. Reads markdown frontmatter at build time via the existing `getPostMetadata()` + `gray-matter` pattern (already `React.cache`d).

### Frontmatter additions required across existing reviews

Two new fields added to each `posts/portable-power-stations/*.md` file:

```yaml
capacityWh: 1024          # numeric, for price/capacity filtering
features:
  - "30a-rv"              # has 30A RV outlet
  - "solar"               # solar input ≥ 800W
  - "240v"                # supports 240V output
  - "cpap"                # suitable for CPAP (500–1500Wh, < 25 lbs)
  - "van-life"            # compact + solar-capable (< 30 lbs, solar ≥ 400W)
  - "solar-kit"           # sold as/commonly paired with solar panels
```

New reviews (added in this session) also need `category` field aligned:
- `"large"` = 1,500–4,000Wh
- `"home-backup"` = 4,000Wh+

### Exported functions

```ts
getStationsByCategory(cat: string): PowerStationEntry[]
getStationsUnderPrice(maxPrice: number): PowerStationEntry[]
getStationsByFeature(feature: string): PowerStationEntry[]
getStationsBySlugs(slugs: string[]): PowerStationEntry[]   // comparison pages
getQuickPicks(entries: PowerStationEntry[]): PowerStationEntry[]  // top 3 by score
```

`PowerStationEntry` shape mirrors the existing `StationEntry` interface on category pages, extended with `capacityWh`, `features[]`, and `slug`.

---

## 2. Category Pages (7 new)

All pages follow the identical structure as existing pages. New directories under `app/best/power-stations/`.

### URL → filter mapping

| Directory | Filter | Sidebar widget |
|---|---|---|
| `rv-power-stations/` | `features` includes `"30a-rv"` | 30A vs 50A explained |
| `solar-generators/` | `features` includes `"solar"` or `"solar-kit"` | Solar sizing guide (static) |
| `under-500/` | `price` ≤ 500 | What you get at each price band |
| `under-1000/` | `price` ≤ 1000 | Value comparison chart |
| `for-cpap/` | `features` includes `"cpap"` | CPAP runtime calculator (static) |
| `240v-power-stations/` | `features` includes `"240v"` | 240V use case guide |
| `van-life/` | `features` includes `"van-life"` | Van power budget guide |

### Page structure (each)

1. `Breadcrumb` — Home → Best Of → Power Stations → [Category]
2. Hero banner — gradient, h1, description, 3 tag pills
3. `QuickPicks` — top 3 by score from filtered set
4. Ranked list — `RankedProductCard` × N, `AdBanner` injected after rank 3
5. Buying guide / methodology section — unique prose per category
6. Sidebar — Jump-to links + category-specific widget + `Newsletter`

### Metadata
Each page exports `metadata` with a keyword-optimised title and description targeting the primary search intent for that category.

---

## 3. Comparison Pages (3)

**Base URL:** `/best/power-stations/compare/[slug-a]-vs-[slug-b]`

### Initial pages
1. `ecoflow-delta-3-plus-vs-anker-solix-c1000`
2. `bluetti-elite-200-v2-vs-anker-solix-c2000-gen2`
3. `ecoflow-delta-pro-ultra-x-vs-anker-solix-e10`

### New component: `ComparisonCard`

**File:** `components/ComparisonCard.tsx`

Side-by-side layout:
- Top row: product name, image, score, price, badge (winner/runner-up)
- Spec table: capacity, inverter, solar input, weight, efficiency, price — winning value highlighted green per row
- Pros/cons columns side by side
- Verdict section: clear winner declaration + "who should buy which" paragraph

Data sourced from `getStationsBySlugs([slugA, slugB])` — no hardcoded spec data beyond slug pairs.

### Page structure (each)
1. `Breadcrumb` — Home → Best Of → Power Stations → Compare → [title]
2. `<title>` tag: "[Product A] vs [Product B]: Which Should You Buy? (2025)"
3. `ComparisonCard`
4. "Also compare" sidebar: links to the other 2 comparison pages
5. `Newsletter`

---

## 4. Finder Quiz

**Location:** Inline on `app/best/power-stations/page.tsx`, between hero and category grid.

**Component:** `components/PowerStationQuiz.tsx` — `'use client'`

### Questions

1. **Budget** — Under $500 / $500–$1,000 / $1,000–$2,000 / $2,000+
2. **Primary use** — Camping & outdoors / Home backup / RV & van life / Off-grid solar
3. **Solar needed?** — Yes, essential / Nice to have / No, grid only

### Routing matrix

| Budget | Use | Solar | Route |
|---|---|---|---|
| <$500 | any | any | `/best/power-stations/under-500` |
| $500–$1k | camping | yes/maybe | `/best/power-stations/solar-generators` |
| $500–$1k | camping | no | `/best/power-stations/camping-power-stations` |
| $500–$1k | home | any | `/best/power-stations/under-1000` |
| $500–$1k | rv/van | any | `/best/power-stations/van-life` |
| $1k–$2k | rv/van | any | `/best/power-stations/rv-power-stations` |
| $1k–$2k | home | yes | `/best/power-stations/solar-generators` |
| $1k–$2k | home | no | `/best/power-stations/house-backup-power-stations` |
| $1k–$2k | solar | any | `/best/power-stations/solar-generators` |
| $2k+ | any | any | `/best/power-stations/house-backup-power-stations` |
| any | any | yes (essential) | `/best/power-stations/solar-generators` |

### UI behaviour
- Card-based answers with icons, single-select per question
- Progress indicator (Step 1 of 3 etc.)
- "Find my power station →" button activates only after all 3 answered
- `useRouter().push()` on submit — no page reload
- No external state, no API calls

---

## 5. Files Changed / Created

### New files
- `lib/power-station-data.ts`
- `components/ComparisonCard.tsx`
- `components/PowerStationQuiz.tsx`
- `app/best/power-stations/rv-power-stations/page.tsx`
- `app/best/power-stations/solar-generators/page.tsx`
- `app/best/power-stations/under-500/page.tsx`
- `app/best/power-stations/under-1000/page.tsx`
- `app/best/power-stations/for-cpap/page.tsx`
- `app/best/power-stations/240v-power-stations/page.tsx`
- `app/best/power-stations/van-life/page.tsx`
- `app/best/power-stations/compare/ecoflow-delta-3-plus-vs-anker-solix-c1000/page.tsx`
- `app/best/power-stations/compare/bluetti-elite-200-v2-vs-anker-solix-c2000-gen2/page.tsx`
- `app/best/power-stations/compare/ecoflow-delta-pro-ultra-x-vs-anker-solix-e10/page.tsx`

### Modified files
- `app/best/power-stations/page.tsx` — add `PowerStationQuiz` component
- `posts/portable-power-stations/*.md` — add `capacityWh` and `features[]` to all 33 reviews

### Unchanged
- All existing category pages (`camping`, `carry-on`, `house-backup`, `portable`)
- All existing components
- Routing structure for existing URLs (no breaking changes)

---

## 6. Review Content Length Standard

All new review markdown files must match the depth of pre-existing reviews. The benchmark is `ecoflow_delta_3_plus.md` at ~236 lines.

**Minimum structure per review:**
- Frontmatter (specs, pros, cons, ratings) — ~40 lines
- Introduction — 2–3 paragraphs establishing the product's market position
- Unboxing & First Impressions — 1–2 paragraphs
- 4–6 feature/performance sections — each with an H2 + 2–3 paragraphs of depth (real-world context, not just spec restatement)
- Competitive Analysis — compare against 2–3 direct rivals with specific trade-offs
- Who It's For section — explicit ✅ / ❌ bullet lists
- Final Verdict — 1–2 paragraphs + buy/don't-buy bullets
- FAQ — 3–5 questions (optional but preferred for SEO)

**Target:** 200–250 lines per file. Reviews under 150 lines must be expanded before publishing.

This applies to all reviews written as part of implementation — both the 33 existing reviews that need `capacityWh`/`features[]` added, and any new reviews written to fill category gaps.

---

## 7. Verification

1. `npm run build` — all 11 new routes appear in build output, no TypeScript errors
2. Each category page shows ≥ 3 ranked products pulled from markdown
3. Quiz routes correctly for all 11 routing matrix combinations
4. Comparison pages render spec table with green winner highlights
5. No existing URLs broken (check `camping`, `carry-on`, `house-backup`, `portable`)
6. `npm run lint` — clean
