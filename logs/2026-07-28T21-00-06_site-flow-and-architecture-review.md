# Site flow & architecture review — engagement critique

Reviewed against the live site and the codebase. Every claim below was verified, not assumed:
route inventory, live HTTP status codes, sitemap contents, and component usage counts.

**Headline:** the site's structural problem is *inversion*. The 51 hand-built `/best/*` pages are
feature-rich but largely invisible to search, while the 127 articles — which receive essentially all
organic traffic — are the thinnest pages on the site for navigation, trust, and conversion.

---

## 1. Blocking defects (fix first — these leak traffic today)

### 1.1 Two dead links in the homepage's primary category nav

The homepage sidebar builds links as `/best/{dir}` from the `posts/` folder names, but the routes
use different slugs. Verified live:

| Link rendered | Status |
| --- | --- |
| `/best/portable-power-stations` | **404** |
| `/best/knives-tools` | **404** |
| other 8 categories | 200 |

`portable-power-stations` is the **largest category on the site — 33 posts, 26% of the catalogue**.
Its category link from the homepage is broken. The real hub lives at `/best/power-stations`.

**Fix:** map content directory → route slug in one place, or rename the directory. See §2.

### 1.2 ~38 of 50 `/best` pages are missing from the sitemap

`app/sitemap.ts` hardcodes 12 static paths, covering only power-stations and cameras. Verified:
the live sitemap contains 139 URLs — 127 articles, but only ~10 `/best` URLs.

Entirely absent, including their category hubs: **headphones, TVs, laptops, monitors, gaming,
smart-home, wearables**. These "best X" guides are the highest commercial-intent, highest-monetising
pages on the site, and search engines are not being told they exist.

**Fix:** generate the sitemap from the route tree rather than a hand-maintained array.

### 1.3 No affiliate disclosure

Articles carry retailer links and the site monetises via affiliate + AdSense, but no disclosure
string appears on article pages. This is an FTC compliance exposure as well as a trust signal
Google explicitly rewards.

**Fix:** disclosure line in the article template, above the fold, plus a `/disclosure` page.

---

## 2. Taxonomy has no single source of truth

Five independent, hand-maintained category lists currently disagree:

| Source | Entries | Problem |
| --- | --- | --- |
| `lib/nav-categories.ts` | 4 | Omits 6 of 10 categories |
| Homepage `bestOfGuides` | 4 | Hardcoded counts + "Updated Mar 2026" strings that will silently rot |
| Homepage sidebar `getAllCategories()` | 10 | Derived from `posts/`; produces the two 404s |
| `app/best/*` directories | 10 | Different slugs (`power-stations` vs `portable-power-stations`) |
| `app/sitemap.ts` | 12 | Hardcoded; misses most pages |

Also: **`smartphones` has a hub page but zero posts** (empty category), and **`knives-tools` has a
post but no hub** (orphaned content).

**Recommendation:** one `lib/taxonomy.ts` exporting category slug, route, display name, icon, and
content directory. Nav, homepage, sitemap, and breadcrumbs all derive from it. This single change
eliminates §1.1, §1.2, and the drift risk in one move.

---

## 3. The article template is the weakest page on the site

`app/articles/[slug]/page.tsx` serves all 127 articles. Component usage across the repo:

| Component | Used on `/best/*` pages | Used on articles |
| --- | --- | --- |
| `Breadcrumb` | 51 | **0** |
| `Newsletter` | 51 | **0** |
| `QuickPicks` | 45 | **0** |
| `TableOfContents` | — | **0** |
| `StickyBuyBar` | — | **0** |
| `AdBanner` | — | **4** |

So the pages that receive the traffic have **no breadcrumb, no email capture, no table of contents,
no sticky buy bar — and four ad units.** Every one of those components already exists and is built.

Consequences for engagement:

- **No way back up.** An article has no breadcrumb and no link to its parent "best X" guide, so the
  natural next step in the buying journey is a dead end. This is the single highest-value fix.
- **No TOC.** The editorial rewrite made these reviews long and comprehensive; long pages without
  jump links get scanned and abandoned.
- **Email capture is on the pages that don't get traffic.** The newsletter unit sits on the homepage
  and hubs, not on the 127 pages people actually land on.
- **Ad-to-content ratio is inverted** relative to navigation aids.

### 3.1 Related articles are static and buried

`RelatedArticles` takes `.slice(0, limit)` of the category in file order — no scoring, no
recency, no similarity. For power stations, **the same 4 links appear on all 33 articles**, and they
render last, after the author bio and a third ad unit. Returning visitors see identical suggestions
every time.

**Fix:** rank by score/recency/price band, exclude already-seen, surface mid-article as well as at
the end, and add a "Compare with…" affordance.

---

## 4. Navigation and discovery gaps

- **No "all reviews" index.** With 127 reviews there is no browsable archive — only the homepage's
  6 most recent. Most of the catalogue is reachable only via search or a category hub.
- **Header nav is 3 hardcoded links** (Laptops, TVs, Headphones) — not the largest categories. Power
  stations (33 posts) is absent from the top-level nav.
- **Category dropdown exposes 4 of 10 categories.**
- **Desktop-only search.** `SearchBar` is `hidden md:block` in the header; mobile depends entirely on
  the bottom-nav search affordance.
- **No comparison hub.** Only 3 hardcoded power-station comparisons exist, yet head-to-head
  comparison is among the highest-engagement, highest-intent formats for review sites.
- **No filtering or sorting** anywhere — no price band, score threshold, or use-case filter.

---

## 5. Content portfolio is severely unbalanced

| Category | Posts | Sub-guides |
| --- | --- | --- |
| portable-power-stations | 33 | 14 |
| wearables / tvs / headphones / cameras | 15 each | 2–4 |
| laptops | 9 | 3 |
| smart-home / monitors / gaming | 8 each | 2 |
| knives-tools | 1 | **0** |
| smartphones | **0** | 1 |

Power stations account for 26% of articles and 28% of routes. Meanwhile four categories with 15
reviews each have only 2–4 guides — the cheapest available growth is **building hub//best pages for
content that already exists**, not writing new reviews.

---

## 6. Trust & authority (E-E-A-T) is missing

No `/about`, `/methodology`, `/how-we-test`, `/contact`, or `/disclosure` — all verified 404. For a
review site this directly suppresses search performance and conversion: Google's quality guidelines
weight demonstrable expertise and testing methodology heavily for exactly this content type, and
buyers check "how did they test this?" before trusting a recommendation.

The site already runs a rigorous editorial audit/QA-gate toolchain — **that is a genuine
differentiator that is currently invisible to users.** Publishing the methodology converts internal
process into a trust asset.

---

## 7. Dead code

`app/articles/[slug]/articlePage.tsx` is imported nowhere. It duplicates the article template and
will drift out of sync with the live one.

---

## Prioritised recommendations

Ordered by engagement impact per unit of effort.

| # | Action | Why | Effort |
| --- | --- | --- | --- |
| 1 | Single `lib/taxonomy.ts`; derive nav, sidebar, breadcrumbs, sitemap from it | Kills 2 live 404s incl. the largest category, and prevents recurrence | S |
| 2 | Generate sitemap from the route tree | Exposes ~38 hidden money pages to search | S |
| 3 | Add breadcrumb + parent-guide link to the article template | Gives 127 landing pages an onward path | S |
| 4 | Add TOC + newsletter + sticky buy bar to the article template | Components already exist; applies them where the traffic is | S |
| 5 | Publish `/methodology`, `/about`, `/disclosure` | E-E-A-T + FTC compliance; converts existing QA rigour into trust | M |
| 6 | Rank `RelatedArticles`; surface mid-article | Ends identical suggestions across 33 power-station pages | M |
| 7 | Build `/reviews` archive with filter + sort | Makes 127 reviews browsable for the first time | M |
| 8 | Expand nav to all 10 categories; enable mobile header search | Removes discovery ceiling | S |
| 9 | Build comparison hub beyond the 3 hardcoded pages | Highest-intent format; strong internal linking | L |
| 10 | Rebalance portfolio — hubs for the 15-post categories; fix `knives-tools` / `smartphones` | Monetises content that already exists | M |
| 11 | Delete `articlePage.tsx` | Removes drift risk | XS |

**If only three things are done:** #1, #2, #3. They are all small, they stop active traffic loss,
and they turn the article pages from terminal nodes into entry points for a buying journey.
