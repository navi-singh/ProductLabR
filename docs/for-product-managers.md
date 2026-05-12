# For Product Managers

This guide gives you the **mental model** of ProductLabR you need to plan features, prioritize content, and reason about monetization — without getting into code.

## The product in one sentence

ProductLabR helps shoppers decide *which* product to buy in a specific category, then earns revenue when they click out to retailers or view ads on the way.

## Audience & jobs to be done

| Visitor intent | Entry surface | What we need to deliver |
|---|---|---|
| "Which X is best for me?" | `/best/<category>` hub or finder quiz | Ranked list with clear winners by use-case |
| "Is product Y worth it?" | `/articles/<slug>` (review) | Score, pros/cons, specs, buy buttons |
| "X vs Y — which one?" | `/best/.../compare/<a>-vs-<b>` | Side-by-side specs, verdict |
| "What's new?" | `/` (home) | Latest reviews, editor's pick |

## Information architecture

```
Home (/)
├── Latest reviews
├── Editor's pick (hero)
├── Best Of guides (curated 4)
└── Sidebar: Top 10 Popular · Newsletter · Categories

Best (/best)
├── Featured categories
├── How We Test (methodology)
└── Browse all categories

Best > Vertical (e.g. /best/power-stations)
├── Hero
├── Finder quiz (optional, vertical-specific)
├── Sub-category grid
└── Sidebar: jump-links · guides · compare shortcuts

Best > Vertical > Sub-category (e.g. /best/power-stations/rv-power-stations)
├── Breadcrumb
├── Hero with tag pills
├── Quick Picks (top 3)
├── Ranked list (RankedProductCard)
├── Buying guide prose
└── Sidebar

Article (/articles/<slug>)
├── Hero image + score card
├── Specs · Pros/Cons · Ratings breakdown
├── Body (markdown)
├── Sticky buy bar
└── Related articles
```

## Content inventory (today)

| Category | Reviews | Notes |
|---|---:|---|
| Portable power stations | 33 | The largest vertical; active expansion |
| Cameras | 15 | Hybrid, pro photo, pro generic sub-hubs |
| Laptops | 9 | Under-$1k, gaming, MacBooks |
| Headphones | 8 | Noise-cancelling, wireless earbuds |
| Gaming | 8 | Keyboards, mice |
| Monitors | 8 | 4K, gaming |
| Smart home | 8 | Robot vacuums, smart speakers |
| TVs | 7 | Gaming TVs, OLED |
| Wearables | 4 | Smartwatches |
| Knives & tools | 1 | Seed |
| **Total** | **101** | |

## How a review is ranked

Each review's frontmatter contains a `ratingBreakdown.metrics[]` array — named criteria scored 0–10 (e.g. "Design & Build," "Performance," "Value"). The overall score is the **average** of those metrics (`lib/articleUtils.ts → calculateOverallScore`). Star ratings are derived 0–5 from the 0–10 score.

Position on a category page is determined by score; the top three on a sub-category page are surfaced as **Quick Picks** with award badges:

- 🥇 `best-overall` — top score
- 💸 `best-value` — best score-per-dollar
- 🪙 `budget-pick` — lowest price among acceptable scores

## Monetization model

**Ads** (display, Google AdSense)

| Slot | Where it appears |
|---|---|
| `articleTop`, `articleMid`, `articleBottom` | Inside reviews |
| `sidebar` | Home + category sidebars |
| `homeHeaderMobile`, `homeHeaderDesktop` | Above the fold on home |
| `homeBetweenCategories` | Between home sections |
| `categoryTop`, `categoryBottom` | Top/bottom of category hubs |

Revenue scales with traffic × CPM × ad density. AdSense policies cap density and quality — we don't auto-stack ads.

**Affiliate links** (per-retailer, in frontmatter)

Every review can list multiple `retailerLinks` (Amazon, Best Buy, B&H, etc.). The article's buy button and the sticky buy bar deep-link to these. Conversion attribution is handled by the retailer's affiliate program.

**Revenue expectations** (from `ADSENSE_SETUP.md`)
- Month 1: $0–$50 (during AdSense approval)
- Month 3: $50–$200
- Month 6+: $200+

## What constitutes "shipped" for a new category

To launch a new sub-category page, the bar is:

1. **≥5 reviews** with complete frontmatter for that filter (price, score, relevant features).
2. **Quick Picks** identifiable — at least one of each badge type.
3. **Buying guide prose** unique to the sub-category (not boilerplate).
4. **Sidebar** with jump-links and at least one cross-link (compare page, related guide).
5. **Internal links** from the parent hub and at least one comparison page.

## Success metrics to watch

- **Organic sessions / category** (Search Console). Category pages should outrank individual reviews for "best X" queries.
- **Article → outbound retailer CTR** — the primary conversion event.
- **Quiz completion rate** on hubs that have a finder.
- **Compare page traffic** vs. individual review traffic — confirms head-to-head intent.
- **Core Web Vitals** — LCP < 2.5s, CLS < 0.1, FID < 100ms. Performance directly affects SEO rank.
- **Lighthouse**: target SEO > 95, Performance > 90, Accessibility > 95.

## Constraints you should know about

- **Static export** — there is no server at runtime. Anything personalized, A/B tested, or user-specific has to run **client-side** (e.g. the finder quiz uses `'use client'`). This rules out per-user SSR.
- **GitHub Pages hosting** — no edge functions, no ISR. Content updates require a redeploy (≈2–3 min on push to `main`).
- **AdSense approval gate** — placeholders show in dev. Real ads require an approved publisher ID set via env var.
- **Image domains are whitelisted** in `next.config.mjs`. New CDNs require a config change + redeploy.

## How to request a new vertical

Use the existing power-station expansion as the template:

1. Write a **design spec** under `docs/superpowers/specs/` — IA, page anatomy, filter logic.
2. Write a **plan** under `docs/superpowers/plans/` — task list, file paths, acceptance criteria.
3. Ensure content exists or has a path to existence (≥5 reviews).
4. Hand off to engineering. They'll mirror the `power-stations/` pattern.

## Where to go next

- **Architecture deep dive:** [architecture.md](./architecture.md)
- **Route map:** [reference/routes.md](./reference/routes.md)
- **Content schema (what each frontmatter field means):** [reference/content-schema.md](./reference/content-schema.md)
