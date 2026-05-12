# For Developers

Everything you need to be productive in this repo: setup, mental model, conventions, and where the bodies are buried.

## Quick start

```bash
# Install
npm ci

# Develop (localhost:3000, fast refresh)
npm run dev

# Validate before pushing
npm run test:build      # lint + type-check + production build

# Format & lint
npm run lint:fix
npm run format
```

Copy `.env.example` → `.env.local` for AdSense / GA env vars (placeholders are fine for local dev).

## Mental model

The site is a **content-driven, statically-rendered Next.js App Router app**.

```
posts/*.md  ──►  lib/Posts.ts  ──►  app/**/page.tsx (RSC)  ──►  static HTML  ──►  GitHub Pages
                        ▲
                        │
                  React.cache() so a single
                  build pass reads each file once
```

No database. No runtime API. The build is the database.

## Repo tour

```
app/                    Next.js App Router routes
├── layout.tsx          Root layout (fonts, header/footer, GA, AdSense bootstrap)
├── page.tsx            Home
├── articles/[slug]/    Individual reviews (SSG, generateStaticParams)
├── best/               Category hub + verticals + sub-categories + compare pages
├── sitemap.ts          Auto-generated sitemap
└── robots.ts           Auto-generated robots.txt

components/             ~30 components (see reference/components.md for the catalog)
├── article/            Article-specific (specs, pros/cons, score card, etc.)
└── ads/                AdBanner, ResponsiveAd

lib/                    Pure helpers, no React
├── Posts.ts            getPostBySlug, getAllPostSlugs, getPostsByCategory
├── power-station-data.ts  Typed filters for the power-stations vertical
├── markdown.ts         marked + Tailwind class injection
├── articleUtils.ts     calculateOverallScore, scoreToStarRating, formatArticleDate
├── adsense-config.ts   Ad slot IDs + shouldShowAds() gate
├── utils.ts            cn(), isSafeUrl()
└── icons.tsx           Feature-flag icons (solar, RV, CPAP, ...)

posts/                  Markdown content — the source of truth
└── <category>/<slug>.md

styles/                 global.css + theme.css (CSS variables)
public/                 Static assets
scripts/                Build/research utilities
```

## Routing conventions

- Routes are defined by **folder structure** under `app/` (App Router).
- **Dynamic segments** use `[param]` folders. Article routes pre-render at build time via `generateStaticParams()`.
- **Static export** means *every* dynamic route must enumerate its params at build time. There is no runtime fallback.
- For pages that the harness might try to render dynamically, we pin them with `export const dynamic = 'force-static'` (see `sitemap.ts`, `robots.ts`).
- Per-article revalidation: `export const revalidate = 86400` (24h). This is moot on Pages but kept for forward-compat with Vercel.

See [reference/routes.md](./reference/routes.md) for the complete route map.

## Data layer

Read [`lib/Posts.ts`](../lib/Posts.ts) first. The contract:

```ts
getPostBySlug(slug)       // → { metadata, content }
getAllPostSlugs()         // → string[]   (for generateStaticParams)
getPostsByCategory(cat)   // → Post[]     (sorted newest first)
getCategoryDisplayName(slug) // → "Portable Power Stations"
```

All readers are wrapped in `React.cache()`. Within a single build pass, a file is parsed once even if 10 pages request it.

For typed vertical-specific filtering, see `lib/power-station-data.ts` — this is the **pattern to copy** for new verticals. It exposes:

```ts
getAllPowerStations()                // PowerStationEntry[]
getStationsByFeature("30a-rv")
getStationsUnderPrice(500)
getStationsBySlugs(["ecoflow-delta-3-plus", "anker-solix-c1000"])
getQuickPicks(entries)               // { bestOverall, bestValue, budgetPick }
```

## Content & frontmatter

Every review is a markdown file with YAML frontmatter. Full schema lives at [reference/content-schema.md](./reference/content-schema.md). The minimum-viable shape:

```yaml
---
title: "EcoFlow Delta 3 Plus"
date: "2026-04-10"
price: "$999"
productImage: "https://..."
specs:
  Capacity: "1024 Wh"
  AC Output: "1800 W"
pros: ["Fast charging", "App control"]
cons: ["Heavy"]
retailerLinks:
  Amazon: "https://www.amazon.com/..."
ratingBreakdown:
  metrics:
    - { name: "Performance", score: 9 }
    - { name: "Value", score: 8 }
---

Body markdown here.
```

Markdown is rendered through `lib/markdown.ts` which:
1. Runs `marked` with GFM + line breaks.
2. Strips inline HTML (XSS hardening).
3. Regex-injects Tailwind classes onto headings/links/code/etc.

If you find yourself wanting MDX, push back — `marked` keeps content authorable by non-developers.

## Styling

- **Tailwind CSS 3.4**, configured in `tailwind.config.ts`. Content paths cover `app/` and `components/`.
- **Design tokens** live as CSS variables in `styles/theme.css` (consumed via Tailwind's `theme.extend`). Don't hardcode colors — reach for `--primary`, `--accent`, `--neutral-*`.
- **Two fonts**: `--font-sans: Inter` (body), `--font-display: Playfair Display` (headings).
- **Article body** has bespoke prose styling in `.article-body` (see `styles/global.css`). Use it on any rendered-markdown container.

Designers' deeper take: [for-designers.md](./for-designers.md).

## Conventions

From `copilot-instructions.md` and observed practice:

- **TypeScript strict.** Prefer `interface` over `type`. No `enum` — use string literal unions.
- **Default to RSC.** Add `'use client'` only when a component needs state/effects/event handlers (e.g. `PowerStationQuiz`, `SearchBar`).
- **No `useEffect` for data.** Fetch in server components; pass props down.
- **Images:** always `OptimizedImage` (wraps `next/image`). Don't inline `<img>`.
- **External URLs:** always run through `isSafeUrl()` in `lib/utils.ts` before rendering an href.
- **Class merging:** use `cn()` (clsx + tailwind-merge).
- **Component variants:** use `class-variance-authority` when you have ≥3 visual variants.
- **No emojis in code or comments** unless the user asks for them.
- **Comments** are for non-obvious *why*, not *what*. Skip them otherwise.

## Build, deploy, and CI

- **Build:** `npm run build` produces a static export in `./out/`.
- **CI:** `.github/workflows/nextjs.yml` runs on push to `main`. Steps: install → build → upload `./out/` → deploy to Pages.
- **No tests in CI yet.** `npm run test:build` is the closest thing to a test gate (lint + type-check + build). Coverage is a known gap.
- **Bundle analysis:** `npm run build:analyze` (sets `ANALYZE=true`).
- **Preview prod locally:** `npm run preview` (build + start).

Full deploy notes: [`PRODUCTION.md`](../PRODUCTION.md).

## Working with ads

- All ad placement goes through `<AdBanner adSlot="..." adFormat="..." />`.
- Slots are typed via `ADSENSE_CONFIG` in `lib/adsense-config.ts`. Add a new slot there before referencing it.
- `shouldShowAds()` gates rendering: dev shows a labeled placeholder; prod shows real ads only when `NEXT_PUBLIC_ADSENSE_PUBLISHER_ID` is set to a real `ca-pub-...` value.
- The build emits a **warning** (not an error) if the env var is missing — see commit `89e8987`. Don't tighten this back to an error or CI will fail on forks.

## Local-dev gotchas

| Symptom | Cause / Fix |
|---|---|
| New image domain 403s | Add it to `images.remotePatterns` in `next.config.mjs` |
| Static export complains about a dynamic route | Add `generateStaticParams()`, or set `export const dynamic = 'force-static'` |
| AdSense placeholder shows in prod | Env var `NEXT_PUBLIC_ADSENSE_PUBLISHER_ID` not set in the deploy environment |
| Stale build output | Delete `.next/` and `out/`, rebuild |
| Slug not found at runtime | The slug isn't in `posts/<category>/`, or has invalid characters (must match `/^[a-z0-9]+(?:[_-][a-z0-9]+)*$/i`) |

## Branching & PR conventions (user preference)

From `~/.claude/rules/preferences.md`:

- Branch names: `nmehrok/<camelCaseDescription>`, e.g. `nmehrok/addPowerStationQuiz`.
- PRs created in **draft mode** (`gh pr create --draft`).
- PR body must have **Summary** (1–2 sentence prose), **Details** (bullets grouped by area), **Testing Done** (checkboxes).
- Don't auto-push after fixing review issues — wait for approval.

## Adding a new sub-category page (worked example)

The power-station expansion is the reference implementation. To add a new one:

1. Ensure source data has the filter field (e.g. add `features: ["my-tag"]` to relevant reviews).
2. Add a filter to `lib/power-station-data.ts` (or its equivalent for your vertical).
3. Copy an existing page directory under `app/best/power-stations/` and adapt:
   - Hero (title, description, tag pills, gradient class).
   - `<QuickPicks />` fed by `getQuickPicks(filtered)`.
   - Ranked list mapping `filtered.map(...)` to `<RankedProductCard />`.
   - Unique buying-guide prose.
   - Sidebar with at least one cross-link.
4. Link the new page from the parent hub's category grid.
5. Add it to the relevant finder-quiz routing matrix (`PowerStationQuiz.getRoute`).
6. Run `npm run test:build` and verify the route in the build output.

## Where to go next

- **Architecture deep dive:** [architecture.md](./architecture.md)
- **Component catalog with props:** [reference/components.md](./reference/components.md)
- **Route map:** [reference/routes.md](./reference/routes.md)
- **Production checklist:** [`PRODUCTION.md`](../PRODUCTION.md)
