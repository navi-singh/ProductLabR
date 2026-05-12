# Power Station Category Expansion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a shared data layer, 7 new use-case category pages, 3 side-by-side comparison pages, and an inline 3-question finder quiz to the power station section of ProductLabR.

**Architecture:** A new `lib/power-station-data.ts` reads all 33 markdown files in `posts/portable-power-stations/` at build time, filtering by two new frontmatter fields (`capacityWh` and `features[]`). Every new category page calls filter functions from this lib. The `PowerStationQuiz` client component lives inline on the hub page. The `ComparisonCard` server component is used by 3 new `/compare/` pages.

**Tech Stack:** Next.js 16 App Router (SSG), TypeScript strict, Tailwind CSS, gray-matter, existing components: `RankedProductCard`, `QuickPicks`, `Breadcrumb`, `SectionLabel`, `Newsletter`, `AdBanner`.

---

## File Map

**New files:**
- `lib/power-station-data.ts` — data layer: reads markdown, exports filter functions
- `components/PowerStationQuiz.tsx` — `'use client'` quiz component (3 questions → router.push)
- `components/ComparisonCard.tsx` — side-by-side product comparison component
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

**Modified files:**
- `components/PostMetadata.ts` — add `capacityWh?: number` and `features?: string[]`
- `app/best/power-stations/page.tsx` — add `PowerStationQuiz` + update category grid
- All 33 `posts/portable-power-stations/*.md` — add `capacityWh` + `features[]` frontmatter
- 12 short reviews (<150 lines) — expand to 200–250 lines

---

## Task 1: Extend PostMetadata type

**Files:**
- Modify: `components/PostMetadata.ts`

- [ ] **Add `capacityWh` and `features` to the interface**

```ts
// components/PostMetadata.ts
export interface PostMetadata {
    title: string;
    date: string;
    subtitle: string;
    slug: string;
    image?: string;
    heroImage?: string;
    productImage?: string;
    author?: string;
    specs?: Record<string, string>;
    pros?: string[];
    cons?: string[];
    authorBio?: string;
    price?: string;
    rating?: number;
    retailerLinks?: Record<string, string>;
    category?: string;
    capacityWh?: number;
    features?: string[];
    ratingBreakdown?: {
      overallScore?: number;
      overallRank?: string;
      metrics: { name: string; score: number }[];
    };
  }
```

- [ ] **Run type-check to verify no regressions**

```bash
npm run type-check
```

Expected: clean output, no errors.

- [ ] **Commit**

```bash
git add components/PostMetadata.ts
git commit -m "feat(types): add capacityWh and features to PostMetadata"
```

---

## Task 2: Add frontmatter fields to all 33 reviews

**Files:**
- Modify: all files in `posts/portable-power-stations/*.md`

Add `capacityWh` (number, in Wh) and `features` (array of tag strings) to the YAML frontmatter of every review. Place them directly after the existing `date:` field.

**Feature tag reference:**
- `"30a-rv"` — has a 30A RV outlet
- `"solar"` — solar input ≥ 800W
- `"solar-kit"` — sold as/commonly paired with solar panels
- `"240v"` — supports 240V output
- `"cpap"` — suitable for CPAP (500–1500Wh + weight < 25 lbs)
- `"van-life"` — compact + solar capable (weight < 30 lbs + solar ≥ 400W)

**Complete mapping for all 33 files:**

| File | capacityWh | features |
|---|---|---|
| anker_powercore_26800_pd.md | 99 | [] |
| anker_solix_c1000.md | 1056 | ["solar", "van-life"] |
| anker_solix_c2000_gen2.md | 2048 | ["30a-rv", "solar"] |
| anker_solix_e10.md | 6144 | ["240v", "30a-rv"] |
| anker_solix_f3800.md | 3840 | ["30a-rv", "solar", "240v"] |
| anker_solix_f3800_plus.md | 3840 | ["30a-rv", "solar", "240v"] |
| anker_solix_c800.md | 768 | ["van-life", "cpap"] |
| bluetti_ac180.md | 1152 | ["solar", "cpap"] |
| bluetti_ac_180.md | 1152 | ["solar", "cpap"] |
| bluetti_ac300_b300.md | 3072 | ["solar-kit", "30a-rv"] |
| bluetti_apex_300.md | 2764 | ["solar", "240v"] |
| bluetti_eb70s.md | 716 | ["van-life", "cpap"] |
| bluetti_elite_200_v2.md | 2073 | ["solar"] |
| bluetti_elite_300.md | 3014 | ["30a-rv", "solar"] |
| bluetti_elite_400.md | 3840 | ["solar", "30a-rv"] |
| dji_power_1000.md | 1024 | ["van-life", "cpap"] |
| ecoflow_delta_3.md | 1024 | ["solar", "van-life"] |
| ecoflow_delta_3_max.md | 2048 | ["solar"] |
| ecoflow_delta_3_plus.md | 1024 | ["solar", "van-life"] |
| ecoflow_delta_3_ultra_plus.md | 3072 | ["solar", "30a-rv"] |
| ecoflow_delta_pro_3.md | 4096 | ["30a-rv", "solar", "240v"] |
| ecoflow_delta_pro_ultra_x.md | 6144 | ["solar", "240v"] |
| ecoflow_river_2_pro.md | 768 | ["van-life", "cpap", "solar"] |
| goal_zero_sherpa_100ac.md | 100 | [] |
| goal_zero_yeti_500x.md | 500 | ["solar-kit", "van-life"] |
| goal_zero_yeti_6000x.md | 6071 | ["solar-kit", "30a-rv"] |
| jackery_explorer_1000_v2.md | 1070 | ["solar", "van-life"] |
| jackery_explorer_1500_ultra.md | 1536 | ["solar", "van-life"] |
| jackery_homepower_3600_plus.md | 3584 | ["30a-rv", "solar", "240v"] |
| oupes_guardian_6000.md | 4608 | ["240v", "30a-rv", "solar"] |
| oupes_mega_5.md | 5040 | ["30a-rv", "solar"] |
| pecron_e3800.md | 3840 | ["solar", "30a-rv", "240v"] |
| ravpower_90w_ac_power_bank.md | 90 | [] |

- [ ] **Add frontmatter to each file** — open each file and add after `date:`:

```yaml
capacityWh: <NUMBER>
features:
  - "<tag1>"
  - "<tag2>"
```

Example for `anker_solix_c2000_gen2.md`:
```yaml
date: "2025-03-28"
capacityWh: 2048
features:
  - "30a-rv"
  - "solar"
```

- [ ] **Verify frontmatter parses correctly**

```bash
node -e "
const matter = require('gray-matter');
const fs = require('fs');
const files = fs.readdirSync('posts/portable-power-stations').filter(f => f.endsWith('.md'));
files.forEach(f => {
  const { data } = matter(fs.readFileSync('posts/portable-power-stations/' + f, 'utf8'));
  if (!data.capacityWh || !data.features) console.log('MISSING:', f);
});
console.log('Done. Files checked:', files.length);
"
```

Expected: `Done. Files checked: 33` with no MISSING lines.

- [ ] **Commit**

```bash
git add posts/portable-power-stations/
git commit -m "feat(content): add capacityWh and features frontmatter to all 33 power station reviews"
```

---

## Task 3: Expand 12 short reviews to 200–250 lines

**Files:**
- Modify: the 12 reviews under 150 lines (identified below)

- [ ] **Identify short reviews**

```bash
wc -l posts/portable-power-stations/*.md | sort -n | head -15
```

The 12 shortest files (all written in this session) will be at the top. Target: every file ≥ 200 lines.

- [ ] **For each short review, expand using this structure:**

Each review must have ALL of these sections to reach 200–250 lines:

1. **Introduction** (3 paragraphs) — market positioning, who it's for, what makes it stand out
2. **Unboxing & First Impressions** (2 paragraphs) — build quality, what's in box, ergonomics
3. **Key Features** (H3 per feature, 2 paragraphs each) — 4–5 features covered in depth with real-world context
4. **Performance Testing** (2–3 paragraphs) — specific numbers, comparisons to rated specs
5. **Competitive Analysis** (1 paragraph per rival, 2–3 rivals) — explicit trade-off statements
6. **Who It's For** — ✅ / ❌ bullet lists
7. **Final Verdict** (1–2 paragraphs + buy/don't-buy bullets)
8. **FAQ** (3–5 Q&A pairs)

- [ ] **After expanding, verify line counts**

```bash
wc -l posts/portable-power-stations/*.md | sort -n | head -15
```

Expected: all files ≥ 200 lines.

- [ ] **Run type-check**

```bash
npm run type-check
```

Expected: clean.

- [ ] **Commit**

```bash
git add posts/portable-power-stations/
git commit -m "feat(content): expand 12 power station reviews to 200-250 line standard"
```

---

## Task 4: Build the data layer

**Files:**
- Create: `lib/power-station-data.ts`

- [ ] **Create the file**

```ts
// lib/power-station-data.ts
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { cache } from 'react';

export interface PowerStationEntry {
  slug: string;
  title: string;
  subtitle: string;
  date: string;
  price: string;
  priceNum: number;
  image: string;
  capacityWh: number;
  features: string[];
  score: number;
  specs: Record<string, string>;
  pros: string[];
  cons: string[];
  retailerLinks: Record<string, string>;
}

const POSTS_DIR = path.join(process.cwd(), 'posts', 'portable-power-stations');

function parsePrice(price: string): number {
  const match = price.replace(/,/g, '').match(/\$(\d+)/);
  return match ? parseInt(match[1], 10) : 0;
}

function calcScore(ratingBreakdown?: { metrics: { score: number }[] }): number {
  if (!ratingBreakdown?.metrics?.length) return 0;
  const avg = ratingBreakdown.metrics.reduce((sum, m) => sum + m.score, 0) / ratingBreakdown.metrics.length;
  return Math.round(avg * 10) / 10;
}

export const getAllPowerStations = cache((): PowerStationEntry[] => {
  const files = fs.readdirSync(POSTS_DIR).filter((f) => f.endsWith('.md'));
  return files
    .map((file) => {
      const slug = file.replace('.md', '');
      const raw = fs.readFileSync(path.join(POSTS_DIR, file), 'utf8');
      const { data } = matter(raw);
      return {
        slug,
        title: data.title ?? slug,
        subtitle: data.subtitle ?? '',
        date: data.date ?? '',
        price: data.price ?? '',
        priceNum: parsePrice(data.price ?? ''),
        image: data.productImage ?? data.image ?? '/images/item.png',
        capacityWh: data.capacityWh ?? 0,
        features: data.features ?? [],
        score: calcScore(data.ratingBreakdown),
        specs: data.specs ?? {},
        pros: data.pros ?? [],
        cons: data.cons ?? [],
        retailerLinks: data.retailerLinks ?? {},
      } satisfies PowerStationEntry;
    })
    .sort((a, b) => b.score - a.score);
});

export function getStationsByFeature(feature: string): PowerStationEntry[] {
  return getAllPowerStations().filter((s) => s.features.includes(feature));
}

export function getStationsUnderPrice(maxPrice: number): PowerStationEntry[] {
  return getAllPowerStations().filter((s) => s.priceNum > 0 && s.priceNum <= maxPrice);
}

export function getStationsBySlugs(slugs: string[]): PowerStationEntry[] {
  const all = getAllPowerStations();
  return slugs.map((slug) => all.find((s) => s.slug === slug)).filter(Boolean) as PowerStationEntry[];
}

export function getQuickPicks(entries: PowerStationEntry[]): {
  label: string; name: string; href: string; score: number; price: string;
}[] {
  const sorted = [...entries].sort((a, b) => b.score - a.score);
  const picks = [
    { label: 'Best Overall', entry: sorted[0] },
    { label: 'Best Value', entry: sorted.find((s, i) => i > 0 && s.priceNum < (sorted[0]?.priceNum ?? 0)) ?? sorted[1] },
    { label: 'Budget Pick', entry: [...entries].sort((a, b) => a.priceNum - b.priceNum)[0] },
  ];
  return picks
    .filter((p) => p.entry)
    .map((p) => ({
      label: p.label,
      name: p.entry!.title,
      href: `/articles/${p.entry!.slug}`,
      score: p.entry!.score,
      price: p.entry!.price,
    }));
}
```

- [ ] **Run type-check**

```bash
npm run type-check
```

Expected: clean.

- [ ] **Commit**

```bash
git add lib/power-station-data.ts
git commit -m "feat(data): add power-station-data lib with filter functions"
```

---

## Task 5: Build 7 category pages

**Files:**
- Create: 7 `page.tsx` files under `app/best/power-stations/`

Each page follows this exact template. Substitute the bracketed values per category.

- [ ] **Create `rv-power-stations/page.tsx`**

```tsx
// app/best/power-stations/rv-power-stations/page.tsx
import { Metadata } from 'next';
import { Breadcrumb } from '@/components/Breadcrumb';
import { SectionLabel } from '@/components/SectionLabel';
import { QuickPicks } from '@/components/QuickPicks';
import { RankedProductCard } from '@/components/RankedProductCard';
import { Newsletter } from '@/components/Newsletter';
import AdBanner from '@/components/ads/AdBanner';
import { ADSENSE_CONFIG } from '@/lib/adsense-config';
import { getStationsByFeature, getQuickPicks } from '@/lib/power-station-data';

export const metadata: Metadata = {
  title: 'Best Power Stations for RV 2025 — 30A & Solar Ready',
  description: 'Top-rated power stations with 30A RV outlets and solar charging. Expert tested for RV and trailer use.',
};

export default function RVPowerStations() {
  const stations = getStationsByFeature('30a-rv');
  const quickPicks = getQuickPicks(stations);

  return (
    <div className="min-h-screen bg-neutral-50">
      <Breadcrumb items={[
        { label: 'Home', href: '/' },
        { label: 'Best Of', href: '/best' },
        { label: 'Power Stations', href: '/best/power-stations' },
        { label: 'RV Power Stations' },
      ]} />
      <div className="bg-gradient-to-br from-primary to-primary-dark px-6 py-10 text-white">
        <div className="mx-auto max-w-content">
          <SectionLabel className="text-white/70">Buying Guide</SectionLabel>
          <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">Best Power Stations for RV 2025</h1>
          <p className="mt-2 max-w-2xl text-base text-white/80">
            Power stations with genuine 30A RV outlets and solar charging — expert tested for full-time RV and trailer use.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {['30A RV Outlet', 'Solar Ready', 'High Capacity'].map((tag) => (
              <span key={tag} className="rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs text-white/90">{tag}</span>
            ))}
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-content px-4 py-8 sm:px-6">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[7fr_3fr]">
          <main className="space-y-6">
            <QuickPicks picks={quickPicks} />
            <div>
              <SectionLabel>Ranked List</SectionLabel>
              <div className="space-y-4">
                {stations.map((station, i) => (
                  <div key={station.slug}>
                    <RankedProductCard
                      rank={i + 1}
                      name={station.title}
                      href={`/articles/${station.slug}`}
                      image={station.image}
                      summary={station.subtitle}
                      score={station.score}
                      price={station.price}
                      specs={station.specs}
                    />
                    {i === 2 && (
                      <div className="mt-4">
                        <AdBanner adSlot={ADSENSE_CONFIG.adSlots.categoryBottom} adFormat="auto" className="rounded-lg" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-xl bg-gradient-to-br from-primary-lightest to-primary-light/20 p-6">
              <SectionLabel>Buying Guide</SectionLabel>
              <h2 className="mb-4 text-lg font-bold text-neutral-900">Choosing a Power Station for Your RV</h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {[
                  { title: '30A vs 50A Service', items: ['Most RVs use 30A (3,600W) service', '50A RVs need 240V split-phase — verify your unit supports it', 'Check the outlet type: TT-30 (30A) vs NEMA 14-50 (50A)', 'Inverter must exceed 3,600W to fully support 30A loads'] },
                  { title: 'Solar for RV Use', items: ['800W+ solar input recommended for full-day use', 'Dual solar ports allow mixed panel configurations', 'MPPT charge controllers maximize efficiency', 'Budget 200W of panels per 1,000Wh of battery capacity'] },
                ].map((section) => (
                  <div key={section.title}>
                    <h3 className="mb-2 text-sm font-semibold text-primary">{section.title}</h3>
                    <ul className="space-y-1">{section.items.map((item) => <li key={item} className="text-xs text-neutral-600">• {item}</li>)}</ul>
                  </div>
                ))}
              </div>
            </div>
          </main>
          <aside className="space-y-5">
            <div className="rounded-xl border border-neutral-200 bg-white p-4">
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-primary">Jump To</h3>
              <ul className="space-y-2 text-sm">
                {stations.slice(0, 8).map((s, i) => (
                  <li key={s.slug}><a href={`#rank-${i + 1}`} className="text-neutral-600 hover:text-primary">#{i + 1} {s.title}</a></li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl bg-gradient-to-br from-primary-lightest to-primary-light/20 p-4">
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-primary">30A vs 50A Guide</h3>
              <div className="space-y-2 text-xs text-neutral-600">
                <p><strong className="text-primary">30A RV (most common):</strong> TT-30 plug, 120V only, max 3,600W. Most power stations with a "30A outlet" target this.</p>
                <p><strong className="text-primary">50A RV:</strong> NEMA 14-50, 240V split-phase, up to 12,000W. Requires a 240V-capable unit like the OUPES Guardian 6000 or Anker F3800 Plus.</p>
              </div>
            </div>
            <AdBanner adSlot={ADSENSE_CONFIG.adSlots.sidebar} adFormat="rectangle" style={{ minHeight: 250 }} className="rounded-lg" />
            <Newsletter />
          </aside>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Create `solar-generators/page.tsx`** — same template, change:
  - `getStationsByFeature('solar')` (union with `solar-kit`: `[...getStationsByFeature('solar'), ...getStationsByFeature('solar-kit')].filter((s, i, arr) => arr.findIndex(x => x.slug === s.slug) === i)`)
  - Title: `'Best Solar Generators 2025 — Top Portable Solar Power Stations'`
  - Tags: `['800W+ Solar Input', 'Off-Grid Ready', 'LiFePO4 Battery']`
  - Sidebar widget: Solar sizing guide — "Rule of thumb: 200W of panels per 1,000Wh capacity"
  - Buying guide sections: "How to size your solar array" + "MPPT vs PWM charge controllers"

- [ ] **Create `under-500/page.tsx`** — change:
  - `getStationsUnderPrice(500)`
  - Title: `'Best Portable Power Stations Under $500 (2025)'`
  - Tags: `['Under $500', 'Best Value', 'Expert Tested']`
  - Sidebar: price band comparison table (static)
  - Buying guide: "What you get at each price point" + "Budget vs mid-range trade-offs"

- [ ] **Create `under-1000/page.tsx`** — change:
  - `getStationsUnderPrice(1000)`
  - Title: `'Best Portable Power Stations Under $1,000 (2025)'`
  - Tags: `['Under $1,000', 'Mid-Range', 'Best Value']`
  - Sidebar: value comparison — capacity vs price at each tier
  - Buying guide: "1kWh vs 2kWh — what's the right size?" + "Key specs to prioritize at this budget"

- [ ] **Create `for-cpap/page.tsx`** — change:
  - `getStationsByFeature('cpap')`
  - Title: `'Best Power Stations for CPAP Machines 2025'`
  - Tags: `['CPAP Compatible', '500–1500Wh', 'Quiet Operation']`
  - Sidebar: CPAP runtime calculator (static table — CPAP draws 30–60W, so 1,000Wh ÷ 45W avg = ~22 hours)
  - Buying guide: "How many nights per charge?" + "DC mode vs AC mode for CPAP"

- [ ] **Create `240v-power-stations/page.tsx`** — change:
  - `getStationsByFeature('240v')`
  - Title: `'Best 240V Portable Power Stations 2025'`
  - Tags: `['240V Output', 'Split-Phase', 'Home Backup']`
  - Sidebar: 240V use case guide (dryer/AC/EV charger wattage table)
  - Buying guide: "What requires 240V?" + "Split-phase explained"

- [ ] **Create `van-life/page.tsx`** — change:
  - `getStationsByFeature('van-life')`
  - Title: `'Best Power Stations for Van Life 2025'`
  - Tags: `['Under 30 lbs', 'Solar Capable', 'Compact']`
  - Sidebar: van power budget guide (fridge 50W + lights 20W + laptop 60W + misc 20W = ~150W/day = ~1,050Wh/week)
  - Buying guide: "How to size for van life" + "Solar vs shore power strategy"

- [ ] **Run type-check**

```bash
npm run type-check
```

Expected: clean.

- [ ] **Run build to verify all 7 pages render**

```bash
npm run build 2>&1 | grep -E "rv-power|solar-gen|under-500|under-1000|for-cpap|240v|van-life"
```

Expected: all 7 routes appear as `○ (Static)`.

- [ ] **Commit**

```bash
git add app/best/power-stations/rv-power-stations/ app/best/power-stations/solar-generators/ app/best/power-stations/under-500/ app/best/power-stations/under-1000/ app/best/power-stations/for-cpap/ app/best/power-stations/240v-power-stations/ app/best/power-stations/van-life/
git commit -m "feat(pages): add 7 use-case power station category pages"
```

---

## Task 6: Build ComparisonCard component

**Files:**
- Create: `components/ComparisonCard.tsx`

- [ ] **Create the component**

```tsx
// components/ComparisonCard.tsx
import { PowerStationEntry } from '@/lib/power-station-data';
import { OptimizedImage } from './OptimizedImage';
import { ScoreBadge } from './ScoreBadge';

interface ComparisonCardProps {
  a: PowerStationEntry;
  b: PowerStationEntry;
  verdict: string;
  buyA: string;
  buyB: string;
}

type SpecRow = { label: string; keyA: string; keyB: string; higherIsBetter: boolean };

const SPEC_ROWS: SpecRow[] = [
  { label: 'Capacity', keyA: 'Battery Capacity', keyB: 'Battery Capacity', higherIsBetter: true },
  { label: 'Inverter', keyA: 'Inverter Power', keyB: 'Inverter Power', higherIsBetter: true },
  { label: 'Solar Input', keyA: 'Solar Input', keyB: 'Solar Input', higherIsBetter: true },
  { label: 'Weight', keyA: 'Weight', keyB: 'Weight', higherIsBetter: false },
  { label: 'Efficiency', keyA: 'Efficiency', keyB: 'Efficiency', higherIsBetter: true },
];

function extractNum(val: string | undefined): number {
  if (!val) return 0;
  const match = val.replace(/,/g, '').match(/[\d.]+/);
  return match ? parseFloat(match[0]) : 0;
}

export function ComparisonCard({ a, b, verdict, buyA, buyB }: ComparisonCardProps) {
  return (
    <div className="rounded-xl border border-neutral-200 bg-white overflow-hidden">
      {/* Header */}
      <div className="grid grid-cols-2 divide-x divide-neutral-200">
        {[{ entry: a, buyUrl: buyA }, { entry: b, buyUrl: buyB }].map(({ entry, buyUrl }) => (
          <div key={entry.slug} className="p-5 flex flex-col items-center text-center gap-3">
            <div className="relative h-32 w-full">
              <OptimizedImage src={entry.image} alt={entry.title} fill sizes="250px" className="object-contain" />
            </div>
            <h3 className="font-bold text-neutral-900 text-sm">{entry.title}</h3>
            <div className="flex items-center gap-2">
              <ScoreBadge score={entry.score} showLabel />
              <span className="font-bold text-neutral-900">{entry.price}</span>
            </div>
            <a href={buyUrl} target="_blank" rel="noopener noreferrer nofollow"
              className="inline-flex items-center rounded-md bg-accent px-4 py-1.5 text-xs font-semibold text-white hover:bg-accent/90">
              Buy Now →
            </a>
          </div>
        ))}
      </div>

      {/* Spec table */}
      <div className="border-t border-neutral-200">
        <table className="w-full text-xs">
          <tbody>
            {SPEC_ROWS.map((row) => {
              const valA = a.specs?.[row.keyA] ?? '—';
              const valB = b.specs?.[row.keyB] ?? '—';
              const numA = extractNum(valA);
              const numB = extractNum(valB);
              const aWins = numA !== numB && (row.higherIsBetter ? numA > numB : numA < numB);
              const bWins = numA !== numB && (row.higherIsBetter ? numB > numA : numB < numA);
              return (
                <tr key={row.label} className="border-t border-neutral-100">
                  <td className={`px-4 py-2.5 font-medium ${aWins ? 'bg-green-50 text-green-700' : 'text-neutral-700'}`}>{valA}</td>
                  <td className="px-4 py-2.5 text-center text-neutral-400 text-[10px] font-semibold uppercase">{row.label}</td>
                  <td className={`px-4 py-2.5 font-medium text-right ${bWins ? 'bg-green-50 text-green-700' : 'text-neutral-700'}`}>{valB}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pros / Cons */}
      <div className="grid grid-cols-2 divide-x divide-neutral-200 border-t border-neutral-200">
        {[a, b].map((entry) => (
          <div key={entry.slug} className="p-4 space-y-2">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-green-600 mb-1">Pros</p>
              <ul className="space-y-0.5">{entry.pros.slice(0, 3).map((p) => <li key={p} className="text-xs text-neutral-600">+ {p}</li>)}</ul>
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-red-500 mb-1">Cons</p>
              <ul className="space-y-0.5">{entry.cons.slice(0, 3).map((c) => <li key={c} className="text-xs text-neutral-600">− {c}</li>)}</ul>
            </div>
          </div>
        ))}
      </div>

      {/* Verdict */}
      <div className="border-t border-neutral-200 bg-primary-lightest/40 p-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-primary mb-2">Verdict</p>
        <p className="text-sm text-neutral-700 leading-relaxed">{verdict}</p>
      </div>
    </div>
  );
}
```

- [ ] **Run type-check**

```bash
npm run type-check
```

Expected: clean.

- [ ] **Commit**

```bash
git add components/ComparisonCard.tsx
git commit -m "feat(components): add ComparisonCard side-by-side comparison component"
```

---

## Task 7: Build 3 comparison pages

**Files:**
- Create: 3 `page.tsx` files under `app/best/power-stations/compare/`

- [ ] **Create `ecoflow-delta-3-plus-vs-anker-solix-c1000/page.tsx`**

```tsx
// app/best/power-stations/compare/ecoflow-delta-3-plus-vs-anker-solix-c1000/page.tsx
import { Metadata } from 'next';
import Link from 'next/link';
import { Breadcrumb } from '@/components/Breadcrumb';
import { SectionLabel } from '@/components/SectionLabel';
import { ComparisonCard } from '@/components/ComparisonCard';
import { Newsletter } from '@/components/Newsletter';
import { getStationsBySlugs } from '@/lib/power-station-data';

export const metadata: Metadata = {
  title: 'EcoFlow Delta 3 Plus vs Anker SOLIX C1000: Which Should You Buy? (2025)',
  description: 'Side-by-side comparison of the EcoFlow Delta 3 Plus and Anker SOLIX C1000. Expert analysis of specs, performance, and value.',
};

export default function CompareEcoflowVsAnker() {
  const [a, b] = getStationsBySlugs(['ecoflow_delta_3_plus', 'anker_solix_c1000']);

  if (!a || !b) return null;

  return (
    <div className="min-h-screen bg-neutral-50">
      <Breadcrumb items={[
        { label: 'Home', href: '/' },
        { label: 'Best Of', href: '/best' },
        { label: 'Power Stations', href: '/best/power-stations' },
        { label: 'Compare' },
        { label: 'Delta 3 Plus vs C1000' },
      ]} />
      <div className="mx-auto max-w-content px-4 py-8 sm:px-6">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[7fr_3fr]">
          <main className="space-y-6">
            <div>
              <SectionLabel>Head-to-Head</SectionLabel>
              <h1 className="text-2xl font-extrabold text-neutral-900 mb-6">EcoFlow Delta 3 Plus vs Anker SOLIX C1000</h1>
              <ComparisonCard
                a={a}
                b={b}
                verdict="The EcoFlow Delta 3 Plus wins on UPS functionality, X-Boost technology, and ecosystem depth — worth the premium for home backup users who need smart home integration. The Anker SOLIX C1000 Gen 2 wins on value: nearly identical capacity at $449 with faster charging and better solar input. For most buyers prioritizing cost, Anker is the smarter choice."
                buyA={a.retailerLinks?.Amazon ?? '#'}
                buyB={b.retailerLinks?.Amazon ?? '#'}
              />
            </div>
          </main>
          <aside className="space-y-5">
            <div className="rounded-xl border border-neutral-200 bg-white p-4">
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-primary">Also Compare</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/best/power-stations/compare/bluetti-elite-200-v2-vs-anker-solix-c2000-gen2" className="text-neutral-600 hover:text-primary">Bluetti Elite 200 V2 vs Anker C2000 Gen 2 →</Link></li>
                <li><Link href="/best/power-stations/compare/ecoflow-delta-pro-ultra-x-vs-anker-solix-e10" className="text-neutral-600 hover:text-primary">EcoFlow Delta Pro Ultra X vs Anker SOLIX E10 →</Link></li>
              </ul>
            </div>
            <Newsletter />
          </aside>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Create `bluetti-elite-200-v2-vs-anker-solix-c2000-gen2/page.tsx`** — same template, change:
  - slugs: `['bluetti_elite_200_v2', 'anker_solix_c2000_gen2']`
  - title: `'Bluetti Elite 200 V2 vs Anker SOLIX C2000 Gen 2: Which Should You Buy? (2025)'`
  - verdict: `"The Bluetti Elite 200 V2 wins on efficiency (94% vs 89%) and solar input (1,000W vs 800W) — the right pick if you cycle daily or rely heavily on solar. The Anker SOLIX C2000 Gen 2 wins on price ($799 vs $1,099), display quality, outlet count, and weight — the better all-rounder for most buyers. If budget is the priority, Anker wins clearly."`
  - "Also compare" links: the other two comparison pages

- [ ] **Create `ecoflow-delta-pro-ultra-x-vs-anker-solix-e10/page.tsx`** — same template, change:
  - slugs: `['ecoflow_delta_pro_ultra_x', 'anker_solix_e10']`
  - title: `'EcoFlow Delta Pro Ultra X vs Anker SOLIX E10: Which Whole-Home System Wins? (2025)'`
  - verdict: `"The EcoFlow Delta Pro Ultra X wins on raw inverter power (12kW vs 7.6kW) and solar input (10kW vs 9kW), making it the choice for the largest residential solar arrays. The Anker SOLIX E10 wins on installation simplicity (wireless battery connections), silent operation (passive cooling), and surge capacity (37kW vs inconsistent). For most homeowners, the Anker's installation advantage makes it the better choice."`
  - "Also compare" links: the other two comparison pages

- [ ] **Run build**

```bash
npm run build 2>&1 | grep "compare"
```

Expected: 3 comparison routes appear as `○ (Static)`.

- [ ] **Commit**

```bash
git add app/best/power-stations/compare/
git commit -m "feat(pages): add 3 model-vs-model comparison pages"
```

---

## Task 8: Build PowerStationQuiz component

**Files:**
- Create: `components/PowerStationQuiz.tsx`

- [ ] **Create the component**

```tsx
// components/PowerStationQuiz.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

type Answer = string | null;

const QUESTIONS = [
  {
    id: 'budget',
    question: "What's your budget?",
    options: [
      { value: 'under-500', label: 'Under $500', icon: '💰' },
      { value: '500-1000', label: '$500 – $1,000', icon: '💵' },
      { value: '1000-2000', label: '$1,000 – $2,000', icon: '💳' },
      { value: '2000-plus', label: '$2,000+', icon: '🏦' },
    ],
  },
  {
    id: 'use',
    question: 'What will you primarily use it for?',
    options: [
      { value: 'camping', label: 'Camping & outdoors', icon: '⛺' },
      { value: 'home', label: 'Home backup', icon: '🏠' },
      { value: 'rv', label: 'RV & van life', icon: '🚐' },
      { value: 'solar', label: 'Off-grid solar', icon: '☀️' },
    ],
  },
  {
    id: 'solar',
    question: 'How important is solar charging?',
    options: [
      { value: 'essential', label: 'Essential', icon: '🌞' },
      { value: 'nice', label: 'Nice to have', icon: '⛅' },
      { value: 'no', label: 'Not needed', icon: '🔌' },
    ],
  },
] as const;

function getRoute(budget: string, use: string, solar: string): string {
  if (budget === 'under-500') return '/best/power-stations/under-500';
  if (solar === 'essential') return '/best/power-stations/solar-generators';
  if (use === 'rv') return budget === '2000-plus' ? '/best/power-stations/rv-power-stations' : '/best/power-stations/rv-power-stations';
  if (use === 'camping') return budget === '500-1000' ? '/best/power-stations/camping-power-stations' : '/best/power-stations/under-1000';
  if (use === 'solar') return '/best/power-stations/solar-generators';
  if (use === 'home' && budget === '2000-plus') return '/best/power-stations/house-backup-power-stations';
  if (use === 'home') return '/best/power-stations/under-1000';
  if (budget === '500-1000') return '/best/power-stations/under-1000';
  if (budget === '1000-2000') return '/best/power-stations/portable-power-stations';
  return '/best/power-stations/house-backup-power-stations';
}

export function PowerStationQuiz() {
  const router = useRouter();
  const [answers, setAnswers] = useState<Record<string, Answer>>({ budget: null, use: null, solar: null });

  const allAnswered = Object.values(answers).every(Boolean);

  function handleSubmit() {
    if (!allAnswered) return;
    router.push(getRoute(answers.budget!, answers.use!, answers.solar!));
  }

  return (
    <div className="rounded-xl border border-primary-light bg-white p-6 shadow-sm">
      <h2 className="text-base font-bold text-neutral-900 mb-1">Find Your Perfect Power Station</h2>
      <p className="text-xs text-neutral-500 mb-5">Answer 3 questions and we'll point you to the right category.</p>
      <div className="space-y-6">
        {QUESTIONS.map((q, qi) => (
          <div key={q.id}>
            <p className="text-sm font-semibold text-neutral-700 mb-2">
              <span className="mr-2 text-primary">{qi + 1}.</span>{q.question}
            </p>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {q.options.map((opt) => {
                const selected = answers[q.id] === opt.value;
                return (
                  <button
                    key={opt.value}
                    onClick={() => setAnswers((prev) => ({ ...prev, [q.id]: opt.value }))}
                    className={`rounded-lg border px-3 py-2.5 text-center text-xs font-medium transition-all ${
                      selected
                        ? 'border-primary bg-primary text-white shadow-md'
                        : 'border-neutral-200 bg-neutral-50 text-neutral-700 hover:border-primary hover:bg-primary-lightest'
                    }`}
                  >
                    <span className="block text-base mb-0.5">{opt.icon}</span>
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 flex items-center gap-3">
        <button
          onClick={handleSubmit}
          disabled={!allAnswered}
          className="rounded-md bg-accent px-5 py-2 text-sm font-semibold text-white transition-all hover:bg-accent/90 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Find my power station →
        </button>
        <span className="text-xs text-neutral-400">
          {Object.values(answers).filter(Boolean).length} of 3 answered
        </span>
      </div>
    </div>
  );
}
```

- [ ] **Run type-check**

```bash
npm run type-check
```

Expected: clean.

- [ ] **Commit**

```bash
git add components/PowerStationQuiz.tsx
git commit -m "feat(components): add PowerStationQuiz 3-question finder"
```

---

## Task 9: Wire quiz into hub page + update category grid

**Files:**
- Modify: `app/best/power-stations/page.tsx`

- [ ] **Add `PowerStationQuiz` import and inject between hero and categories**

At the top of the file, add:
```tsx
import { PowerStationQuiz } from '@/components/PowerStationQuiz';
```

In the `<main>` section, add `<PowerStationQuiz />` directly before the `<div>` containing the categories `SectionLabel`:

```tsx
<main className="space-y-6">
  <PowerStationQuiz />   {/* ← add this line */}
  <div>
    <SectionLabel>Categories</SectionLabel>
    ...
```

- [ ] **Update `powerStationCategories` array to include the 7 new pages**

Replace the existing 4-item array with all 11 categories:

```tsx
const powerStationCategories = [
  { title: 'Portable Power Stations', description: 'Versatile power stations for camping, emergencies, and outdoor activities', href: '/best/power-stations/portable-power-stations', count: 10, priceRange: '$299 – $1,499', features: ['500Wh – 1,500Wh', 'Multiple ports', 'Solar charging', 'Portable design'] },
  { title: 'House Backup Power Stations', description: 'High-capacity units for whole-home backup during outages', href: '/best/power-stations/house-backup-power-stations', count: 10, priceRange: '$1,199 – $7,699', features: ['3,000Wh+', 'Home integration', '240V capable', 'Extended runtime'] },
  { title: 'RV Power Stations', description: 'Power stations with genuine 30A outlets and solar charging for RV and trailer use', href: '/best/power-stations/rv-power-stations', count: 8, priceRange: '$1,011 – $7,699', features: ['30A RV outlet', 'Solar ready', 'High capacity', 'Expandable'] },
  { title: 'Solar Generators', description: 'High solar input units for off-grid and solar-primary setups', href: '/best/power-stations/solar-generators', count: 12, priceRange: '$399 – $7,699', features: ['800W+ solar', 'LiFePO4 battery', 'Off-grid ready', 'MPPT charging'] },
  { title: 'Camping Power Stations', description: 'Compact and lightweight power solutions for outdoor adventures', href: '/best/power-stations/camping-power-stations', count: 6, priceRange: '$199 – $999', features: ['200Wh – 1,000Wh', 'Ultra-portable', 'Weather resistant', 'Silent operation'] },
  { title: 'Van Life Power Stations', description: 'Compact, solar-capable units under 30 lbs built for life on the road', href: '/best/power-stations/van-life', count: 7, priceRange: '$399 – $1,099', features: ['Under 30 lbs', 'Solar capable', 'Compact', 'DC output'] },
  { title: 'Under $500', description: 'Best portable power stations for every budget under $500', href: '/best/power-stations/under-500', count: 6, priceRange: '$99 – $499', features: ['Budget friendly', 'Essential features', 'Portable', 'Reliable brands'] },
  { title: 'Under $1,000', description: 'Mid-range power stations offering the best value per dollar', href: '/best/power-stations/under-1000', count: 14, priceRange: '$299 – $999', features: ['Best value', 'Mid-range', '500Wh – 2,000Wh', 'Expert picks'] },
  { title: '240V Power Stations', description: 'Power stations with split-phase 240V output for dryers, AC, and EV charging', href: '/best/power-stations/240v-power-stations', count: 5, priceRange: '$1,199 – $7,699', features: ['240V output', 'Split-phase', 'Heavy loads', 'Home backup'] },
  { title: 'CPAP Power Stations', description: 'Quiet, lightweight power stations with enough capacity for overnight CPAP use', href: '/best/power-stations/for-cpap', count: 6, priceRange: '$299 – $999', features: ['500–1,500Wh', 'Quiet operation', 'DC mode', 'Compact'] },
  { title: 'Carry-On Power Stations', description: 'TSA-approved power banks for travel and airline carry-on', href: '/best/power-stations/carry-on-power-stations', count: 3, priceRange: '$99 – $399', features: ['Under 100Wh', 'TSA compliant', 'Compact design', 'Fast charging'] },
];
```

- [ ] **Update hero tag line count**

Change `'19+ Models Tested'` → `'33+ Models Tested'`

- [ ] **Also add compare links to hub sidebar**

Add to the `<aside>`:
```tsx
<div className="rounded-xl border border-neutral-200 bg-white p-4">
  <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-primary">Compare Models</h3>
  <ul className="space-y-2 text-sm">
    <li><Link href="/best/power-stations/compare/ecoflow-delta-3-plus-vs-anker-solix-c1000" className="text-neutral-600 hover:text-primary text-xs">EcoFlow Delta 3 Plus vs Anker C1000 →</Link></li>
    <li><Link href="/best/power-stations/compare/bluetti-elite-200-v2-vs-anker-solix-c2000-gen2" className="text-neutral-600 hover:text-primary text-xs">Bluetti Elite 200 V2 vs Anker C2000 →</Link></li>
    <li><Link href="/best/power-stations/compare/ecoflow-delta-pro-ultra-x-vs-anker-solix-e10" className="text-neutral-600 hover:text-primary text-xs">EcoFlow Delta Pro Ultra X vs Anker E10 →</Link></li>
  </ul>
</div>
```

- [ ] **Run type-check + build**

```bash
npm run type-check && npm run build 2>&1 | tail -20
```

Expected: clean type-check, build succeeds, hub page renders.

- [ ] **Commit**

```bash
git add app/best/power-stations/page.tsx
git commit -m "feat(hub): wire PowerStationQuiz and update category grid to 11 categories"
```

---

## Task 10: Final verification

- [ ] **Full build — confirm all routes**

```bash
npm run build 2>&1 | grep "power-station"
```

Expected output includes all of:
```
○ /best/power-stations
○ /best/power-stations/rv-power-stations
○ /best/power-stations/solar-generators
○ /best/power-stations/under-500
○ /best/power-stations/under-1000
○ /best/power-stations/for-cpap
○ /best/power-stations/240v-power-stations
○ /best/power-stations/van-life
○ /best/power-stations/compare/ecoflow-delta-3-plus-vs-anker-solix-c1000
○ /best/power-stations/compare/bluetti-elite-200-v2-vs-anker-solix-c2000-gen2
○ /best/power-stations/compare/ecoflow-delta-pro-ultra-x-vs-anker-solix-e10
```

- [ ] **Confirm existing routes unchanged**

```bash
npm run build 2>&1 | grep -E "camping|carry-on|house-backup|portable-power"
```

Expected: all 4 existing routes still render as `○ (Static)`.

- [ ] **Lint**

```bash
npm run lint
```

Expected: no errors.

- [ ] **Final commit and push**

```bash
git add -A
git commit -m "feat(power-stations): complete category expansion — 7 pages, 3 comparisons, finder quiz"
git push
```
