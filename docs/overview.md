# ProductLabR — Overview

ProductLabR is an **editorial product-review site**: long-form, ranked, "best of" buying guides for consumer electronics and outdoor gear. It is content-driven (every review is a markdown file), statically rendered, and monetized through display ads and affiliate links.

## In one diagram

```
┌─────────────────────────────────────────────────────────────────┐
│  CONTENT                                                        │
│  posts/<category>/<slug>.md   — YAML frontmatter + markdown     │
│                          │                                      │
│                          ▼                                      │
│  DATA LAYER          lib/Posts.ts, lib/power-station-data.ts    │
│  (cached readers, filters, slug helpers)                        │
│                          │                                      │
│                          ▼                                      │
│  ROUTES (Next.js App Router)                                    │
│  /                  → home (latest, best-of, sidebar)           │
│  /articles/[slug]   → single review (SSG, generateStaticParams) │
│  /best              → category hub                              │
│  /best/<vertical>/<sub>  → ranked list pages                    │
│  /best/.../compare/<a>-vs-<b>  → head-to-head                   │
│                          │                                      │
│                          ▼                                      │
│  RENDER  React Server Components → static HTML (export to /out) │
│                          │                                      │
│                          ▼                                      │
│  DEPLOY  GitHub Actions → GitHub Pages (static hosting)         │
│                                                                 │
│  MONETIZE  Google AdSense slots + affiliate retailer links      │
└─────────────────────────────────────────────────────────────────┘
```

## What's on the site

- **101 reviews** across 10 categories — the largest is **portable power stations** (33 reviews).
- **Category hubs** under `/best/` with ranked lists, "quick picks," and buying guides.
- **Comparison pages** for head-to-head matchups (initially power stations).
- **Interactive finder quizzes** (e.g. `PowerStationQuiz`) that route users to the right category page.

## How it makes money

1. **Display ads** — Google AdSense slots placed in article tops/mids/bottoms, sidebars, and between home sections. Configured in `lib/adsense-config.ts`. Dev shows placeholders; prod shows real ads once the publisher ID env var is set.
2. **Affiliate links** — Each review's frontmatter has a `retailerLinks` map (Amazon, Best Buy, etc.). All outbound links use `rel="noopener noreferrer nofollow"` and are validated by `isSafeUrl()` before render.

## Tech stack at a glance

| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router) + React 19 + TypeScript 5 strict |
| Styling | Tailwind CSS 3.4 + CSS variables + Playfair Display / Inter |
| Content | Markdown (`marked`) + YAML frontmatter (`gray-matter`) |
| Motion | Framer Motion (used sparingly — see designer guide) |
| Analytics | `@next/third-parties` (Google Analytics, AdSense) |
| Hosting | GitHub Pages (static export) |
| CI | GitHub Actions (`.github/workflows/nextjs.yml`) |

## Roadmap (active)

The current in-flight effort is the **power station category expansion** (see [spec](./superpowers/specs/2025-05-06-power-station-categories-design.md) and [plan](./superpowers/plans/2025-05-06-power-station-category-expansion.md)):

- Add `capacityWh` and `features` frontmatter to the 33 power-station reviews.
- Ship 7 new sub-category pages (RV, solar, under-$500, under-$1000, CPAP, 240V, van-life).
- Ship 3 head-to-head comparison pages.
- Ship a `PowerStationQuiz` finder on the hub.
- Centralize filtering in a new `lib/power-station-data.ts`.

## Where to go next

- **PMs:** [for-product-managers.md](./for-product-managers.md)
- **Devs:** [for-developers.md](./for-developers.md)
- **Designers:** [for-designers.md](./for-designers.md)
- **Editors:** [for-content-editors.md](./for-content-editors.md)
