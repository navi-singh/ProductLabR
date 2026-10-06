# Launch Blockers — Pre-Launch Site Audit

**Audit date:** 2026-02 (current working tree)
**Scope:** All 252 sitemap URLs, 193 reviews, all app routes, components, lib, content frontmatter, CI workflow.
**Method:** Static trace (source + frontmatter) plus a dynamic crawl of every sitemap URL against a clean `next dev` build (cache cleared), plus the repo's own `editorial:qa`, `images:report`, `type-check`, `lint`, and Playwright e2e suites.

**Headline:** the 0–10 → 0–5 migration is incomplete. It is the single highest-impact defect, but it is not the only launch blocker — there are 7 duplicate product reviews, 71 reviews with no image, a newsletter form that silently discards emails, and affiliate links that ship untagged and earn nothing.

## P0 status (2026-10-05)

All P0 code changes are in. Items marked *owner* still need a value supplied outside the repo.

| # | Status | Resolution |
| --- | --- | --- |
| P0-1 | Fixed | Methodology bands rewritten on 0–5, aligned with `getScoreLabel()`; "upper half" claim removed |
| P0-2 | Fixed | `e2e/score-display.spec.ts` asserts `/ 5` and "Product Lab Rating"; green |
| P0-3 | Fixed | Anso Aros retitled, verdict "4.3 out of 5", stray `overallScore: 94` removed |
| P0-4 | Fixed | `components/ScoreCard.tsx` deleted |
| P0-5 | Fixed | Newsletter hidden unless `NEXT_PUBLIC_NEWSLETTER_ENDPOINT` is set; success only on a 2xx; privacy page updated (*owner*: endpoint) |
| P0-6 | Fixed | Affiliate env vars wired into the workflow (*owner*: set repo variables) |
| P0-7 | Fixed | Placeholder/unconfigured ad slots render nothing (*owner*: real slot IDs) |
| P0-8 | Fixed | Consent Mode v2 defaults to denied, consent banner + footer "Cookie settings", AdSense loads only after accept |
| P0-9 | Fixed | "Hands-on testing" removed from hero, site description and "How We Test" headings |
| P0-10 | Fixed | 7 duplicates merged into the cleaner slug; old URLs are noindex meta-refresh stubs (`lib/redirects.ts`), excluded from sitemap/listings; prices refreshed |
| P0-11 | Fixed | Logo, default OG image, apple-touch-icon and web manifest added; OG default wired into root metadata |

Regression coverage: `e2e/launch-blockers.spec.ts`. P1 and P2 items below are still open.

---

**Priority key**

| Tier | Meaning |
| --- | --- |
| **P0** | Must be fixed before launch. Visibly wrong, legally risky, or costs money on day one. |
| **P1** | Fix before launch if possible; otherwise within the first week. Quality/SEO/credibility damage. |
| **P2** | Cleanup and hygiene. Safe to defer. |

---

## Scoring scale reference (read this first)

Any fix in this area must respect the existing conversion chain. There are **three** scales in play and they are easy to confuse:

| Stage | Scale | Where |
| --- | --- | --- |
| Source of truth | **0–10** | `ratingBreakdown.metrics[].score` in markdown frontmatter (verified on all 193 posts) |
| Internal aggregate | **0–100** | `calculateOverallScore()` in `lib/articleUtils.ts` → `Math.round(sum * 10 / count)` |
| Display | **0–5** | `scoreToStarRating()` → `score / 20` |

- `components/ScoreBadge.tsx` takes a **0–10** prop and renders `(score / 2)`.
- `components/article/ScoreCard.tsx` takes the **0–100** value and renders `score / 20`.
- `articleScore(post)` in `lib/articleUtils.ts` is documented as the **single source of truth**. A prior regression where every listing showed "0.9 / 10" is called out in that file's comments.

**Do not "convert the data to 0–5."** The stored metrics are correctly on 0–10; only the presentation layer and the methodology copy are out of sync.

---

# P0 — Launch blockers

## P0-1. The "How we score" page still documents a 10-point scale

**This is the issue originally reported.**

`app/methodology/page.tsx`, `SCORE_BANDS` (~lines 13–37) describes bands on the old scale:

```
9.0–10   8.0–8.9   7.0–7.9   6.0–6.9   Below 6
```

Every score surface on the site renders **X / 5** (`components/article/ScoreCard.tsx` "out of 5", `components/ReviewsExplorer.tsx:152`, `app/best/[category]/page.tsx:180`, and `bestRating: 5` in the Review JSON-LD). A reader who sees "3.6" on a card and then reads "9.0–10 = Exceptional" on the methodology page cannot interpret either number.

**Fix:** rewrite `SCORE_BANDS` on the 0–5 scale (e.g. `4.5–5.0`, `4.0–4.4`, `3.5–3.9`, `3.0–3.4`, `Below 3.0`) and align the band labels with `getScoreLabel()` in `components/ScoreBadge.tsx` so the published rubric and the rendered badges agree.

## P0-2. The regression guard for this exact bug is itself still on the old scale

`e2e/score-display.spec.ts` is the test that exists to prevent scale drift, and it currently asserts the **old** scale:

- line 14 — `const SCORE = /(\d+\.\d)\s*\/\s*10/`
- line 20 — `scoresOn()` built around that regex
- line 33 — failure message "scores outside 5.0-10.0 indicate a scale mismatch"
- line 44 — `getByText('Overall Score')`, a label that no longer exists (it is now "Product Lab Rating")

**Result: 6 of the 12 current e2e failures.** The guard has been broken since the migration, which is why P0-1 went unnoticed.

**Fix:** migrate the spec to `/ \/ 5/` and the current labels. Treat a green `score-display.spec.ts` as the definition of done for the scoring work.

## P0-3. A review advertises two different scores on the same page

`posts/knives-tools/anso_aros_knife.md`:

- Title: **"A Perfect 10: Anso of Denmark 'Aros' incredible knife"** — rendered in the `<h1>`, `<title>`, meta description, and OG title.
- Body line 139: **`**Overall: 10 out of 10.**`**
- The page's own ScoreCard computes and displays **4.3 / 5**.

A reader sees "A Perfect 10" in the headline and "4.3 / 5" in the score module. This is also the only post containing the literal string "out of 10" in rendered body copy (confirmed by a full-text scan of all 252 pages).

**Fix:** retitle the review, rewrite line 139 on the 0–5 scale, and regenerate the meta description. See also P1-9 — this file has several other structural problems.

## P0-4. Dead 10-point component still in the tree

`components/ScoreCard.tsx` (repo root `components/`, **not** `components/article/`) renders a 10-point display including `aria-label="Overall score: X out of 10"` (lines 32, 40, 50, 75). It has **zero** references — `components/article/ScoreCard.tsx` superseded it.

It is a working 10-point implementation sitting one import away from reintroducing the bug.

**Fix:** delete it.

## P0-5. Newsletter form silently discards every email and shows a false confirmation

`components/Newsletter.tsx` (~line 18):

```ts
// TODO: wire to subscription API endpoint
```

`handleSubmit` throws the address away and renders **"Thanks! We'll be in touch."** This component is rendered on **54 pages**.

Two problems:
1. Users are told they subscribed when no record exists anywhere.
2. It directly contradicts `/privacy`, which states *"We do not receive your name, email address or any information that identifies you personally."*

**Fix:** either wire it to a real provider (and update `/privacy` accordingly) or remove the component from the 54 pages before launch. Do not ship the false confirmation.

## P0-6. Every affiliate link ships untagged — the site earns $0 on day one

`.github/workflows/nextjs.yml` (build env block, ~lines 80–95) sets `SITE_URL`, the GA ID, and the AdSense client ID, but **does not pass**:

- `NEXT_PUBLIC_AMAZON_ASSOCIATES_TAG`
- `NEXT_PUBLIC_IMPACT_PUBLISHER_ID`

Consequences on the production build:
- Every outbound retailer link is emitted without an affiliate tag — all 564 of them.
- `affiliateRel()` in `lib/affiliate.ts` degrades from `rel="sponsored"` to a plain `nofollow`, so paid links are not disclosed to crawlers in the way Google requires.

**Fix:** add both variables to the workflow `env` block (as repository secrets/vars) and verify a production build emits tagged URLs before the site goes live.

## P0-7. All nine AdSense slot IDs are placeholders

`lib/adsense-config.ts` contains nine sequential dummy IDs (`1234567890`, `2345678901`, … `9012345678`). `getPlaceholderAdSlots()` emits a build-time **warning only** — it does not fail.

No ad unit can fill. Every ad slot renders empty space.

**Fix:** replace with real slot IDs, or disable the ad components for launch. Consider promoting the placeholder check from a warning to a build failure.

## P0-8. No cookie consent, with GA + AdSense live

Google Analytics and AdSense both load unconditionally. There is no consent banner, no Consent Mode v2 wiring, and no opt-out. For any EU/UK traffic this is a GDPR/ePrivacy exposure from the first pageview.

**Fix:** add a consent mechanism (or geo-gate the tags) before launch.

## P0-9. "hands-on testing" claim is not supported by any content

`app/page.tsx:79` — the homepage hero reads *"Product Lab turns **hands-on testing**, specs, and real-world trade-offs into clear recommendations."*

Audit of all 193 posts:
- `evidenceLevel: hands-on` — **0 posts**
- `reviewedBy` — **0 posts**
- `lastReviewed` — **0 posts**

`app/methodology/page.tsx` itself describes a documentation-and-synthesis process, not physical testing. The homepage and the methodology page make incompatible claims about how the reviews are produced.

This is an FTC-endorsement-guides risk, not just a copy nit.

**Fix:** either reword the hero to match the actual methodology, or populate real evidence metadata. The safe pre-launch move is the copy change.

## P0-10. Seven duplicate product reviews — same product, two live URLs

Each pair is a separate article with its own score, price, and URL. Two of them disagree materially.

| Product | Slug A | Slug B | Score A/B | Price conflict |
| --- | --- | --- | --- | --- |
| Jackery Explorer 1000 v2 | `jackery_1000_v2` | `jackery_explorer_1000_v2` | 4.2 / 4.2 | **$799 vs $1,099** |
| Anker SOLIX F3800 | `anker_solix_f3800` | `testing_the_anker_f3800` | 4.0 / 3.9 | **$3,999 vs $1,999.99** |
| EcoFlow River 2 Pro | `ecoflow_river_2_pro` | `ecoflow_river_2_pro_power_station` | 4.3 / 4.2 | — |
| EcoFlow Delta 2 Max | `ecoflow_delta_2_max` | `camping_ecoflow_delta_2_max` | 4.1 / 4.1 | — |
| EcoFlow Trail 300 DC | `ecoflow_trail_300_dc` | `ecoflow_trail_300dc` | 4.2 / 4.2 | — |
| Anker SOLIX F3000 | `anker_f3000` | `anker_solix_f3000` | 4.0 / 4.0 | $1,399.99 vs $1,499 |
| EcoFlow Delta Pro Ultra | `ecoflow_delta_pro_ultra` | `testing_the_ecoflow_delta_pro_ultra` | 3.6 / 3.7 | — |

The Jackery pair additionally ships **byte-identical image files** under two different product directories — this is the cause of the `product-imagery.spec.ts` e2e failure.

Impact: self-competing duplicate content for SEO, and a reader can land on two Product Lab pages quoting a 2× price difference for the same unit.

**Fix (needs an editorial decision):** merge each pair into one canonical review and delete the loser. Note the site is a **static export**, so there is no redirect mechanism — if the losing URLs have any inbound equity you will need a client-side redirect page or a host-level rule.

## P0-11. `/images/logo.png` is referenced in JSON-LD on every page and returns 404

`app/layout.tsx:79` sets `orgJsonLd.logo` to `/images/logo.png`. The file does not exist (verified: HTTP 404 on a clean build).

Also missing:
- `/og-default.png`
- `/apple-touch-icon.png`
- `/site.webmanifest`

Broken `Organization.logo` can invalidate the organization entity in Google's structured-data pipeline, on every URL.

**Fix:** add the assets, or remove the references.

---

# P1 — Fix before launch, or in week one

## P1-1. The homepage promotes the worst reviews on the site

`app/page.tsx` lines ~59–61:

```ts
const featured = posts[0];
const recentPosts = posts.slice(1, 7);
```

`getPostMetadata` sorts by **date only**. There is no score gate, so the hero slot is whatever was published last.

As of this audit the **"Featured review"** is *"Anker SOLIX F1500 Review: A Sensible 1.5kWh Backup Box, **If You Can Verify the SKU**"* — scoring **3.6 / 5**, with a subtitle warning the listing looks **discontinued**. The "Latest Reviews" row beneath it shows 3.6, 3.7, …

The most valuable real estate on the site is advertising a mediocre review of a product the review itself says you may not be able to buy.

**Fix:** pick the featured review by score (or add an explicit `featured: true` frontmatter flag), and filter the recent row to a score floor.

## P1-2. Four duplicated score implementations bypass the documented single source of truth

`lib/articleUtils.ts` documents `articleScore()` as the single source of truth, yet four surfaces reimplement the calculation:

1. `app/page.tsx` — `scoreFromPost()` (lines 47–56)
2. `components/ReviewCard.tsx` — inline
3. `lib/guide-data.ts` — `comparisonRowFromPost`
4. `components/article/ReviewTrustModules.tsx`

(1) and (2) additionally fall back to `post.rating * 2` — a legacy field present on exactly **one** post.

This is precisely the shape of the bug that produced the "0.9 / 10" regression documented in `lib/articleUtils.ts`.

**Fix:** route all four through `articleScore()` and delete the local copies.

## P1-3. Verdict labels floor at "Good" — a 2.5/5 product is labelled "Good"

- `components/RankedProductCard.tsx:84`
- `components/article/RelatedArticles.tsx:90`

Both label anything below 8/10 as **"Good"**, with no lower tier. A product scoring **2.5 / 5** renders a red/amber badge sitting next to the words *"Lab Verdict: Good"*.

`getScoreLabel()` in `components/ScoreBadge.tsx` already defines "Average" and "Below Average" tiers — these two components bypass it.

**Fix:** use `getScoreLabel()` in both.

## P1-4. Methodology claims a score distribution the content contradicts

`app/methodology/page.tsx` (~line 130) states scores *"cluster in the upper half of the scale."*

Actual distribution: **36 of 193** reviews score below 4.0 / 5, and three score **2.5 / 5** (`allpowers_s2000_pro`, `sensi_lite`, `sensi_wifi_programmable`).

**Fix:** correct the claim, or state the real distribution.

## P1-5. 71 of 193 reviews (37%) have no product image

`npm run images:report` confirms 71 reviews carry none of `productImage`, `image`, `imageCredit`, `imageSource`, `imageLicense`.

Whole categories are affected — **all 7** `tvs` reviews, most of `headphones`, most of `laptops` and `monitors`.

Downstream effects: blank listing cards, and no `og:image` (see P1-7).

**Fix:** source images with provenance for at least the categories that are 100% empty.

## P1-6. 59 pages advertise the homepage as their own Open Graph identity

All `/best/*` routes, `/about`, and `/` fall through to the root layout's OG defaults (`app/layout.tsx` lines 44–51). Verified on a clean build — `/best/tvs/` emits:

```html
<meta property="og:title"       content="Product Lab - Expert Reviews You Can Trust"/>
<meta property="og:description" content="Expert reviews of power stations, cameras, and tech gear."/>
<meta property="og:url"         content="<site root>"/>
```

**58 pages publish the site root as their own canonical social URL.** Every share of a buying guide renders as a generic homepage card pointing at the wrong destination.

**Fix:** export per-route `openGraph` metadata from each `/best/*` page and `/about`.

## P1-7. 130 of 252 pages have no `og:image`, and there is no default

Confirmed on a clean build. There is no `/og-default.png` to fall back to (see P0-11). Every share of these pages renders as a text-only link.

**Fix:** add a default OG image and wire it into the root metadata; add per-article images where they exist.

## P1-8. Retailer links are mostly search pages; 70 reviews have no product link at all

- **421 of 564** retailer links (75%) point at a **search-results page**, not a product page.
- **70 of 193** reviews have **no direct product link whatsoever**.

A reader who clicks "Check price" lands on a search listing and has to find the product themselves. Affiliate attribution on search pages is also unreliable.

**Fix:** replace search URLs with direct product URLs, at minimum for every review that currently has zero direct links.

## P1-9. `posts/knives-tools/anso_aros_knife.md` is a structural and provenance outlier

Beyond the scale problem in P0-3, this single file is unlike all 192 others:

- The only post with `rating: 5` and `pros_extra`.
- The only post with `ratingBreakdown.overallScore` — declared **94**, while the computed value is **85**. Nothing else in the repo declares an overall score.
- The only post embedding weights in metric names (`"Blade Steel & Edge Retention - 45%"`).
- The only post with an external byline: **Anthony Sculimbrene**, whose bio cites an AKTI affiliation. All 192 other reviews are bylined "Product Lab Team".

The combination suggests the content was ingested from an external source. Please confirm licensing/attribution before launch.

Related: `knives-tools` is a full top-level nav category containing **exactly this one review**, and `/best/knives-tools` renders **zero** ranked cards.

**Fix:** verify provenance; normalise the frontmatter; and either grow or drop the `knives-tools` category.

## P1-10. 64 reviews render prose where a price is expected

`components/RankedProductCard.tsx:120` renders `Street price: {price}`. 64 posts store a sentence in `price`.

On `/best/power-stations` this renders as:

> Street price: **Current price varies by retailer; check the linked listings**

Worst case (`allpowers_s2000_pro`):

> Street price: **No single confirmed MSRP as of this review — retail listings bundle the unit with a 200W solar panel kit and the total varies by promotion**

**Fix:** separate a numeric `priceUsd` from an optional `priceNote`, and render the note outside the "Street price:" label.

## P1-11. `/learn` is a stub in the primary navigation

`app/learn/page.tsx` (`learningCards`, ~lines 15–45): four cards whose "Read more →" links go to `/best/power-stations` (×2), `/methodology`, and `/compare`.

"Battery capacity explained" promises an explainer that does not exist — it links to a product guide instead.

**Fix:** write the explainers, or remove `/learn` from the nav until it has content.

## P1-12. `posts/smart-generators/` is orphaned from the taxonomy

`posts/smart-generators/` contains `ecoflow_smart_generator_4000.md`, but `smart-generators` is not in `CATEGORIES` in `lib/taxonomy.ts`.

Consequence: no `/best/smart-generators` route, and the post is absent from nav, breadcrumbs, and related-article modules. It is reachable only by direct URL.

**Fix:** add the category, or move the post into an existing one.

## P1-13. The entire evidence/trust module is dead

`EvidenceSnapshot` in `components/article/ReviewTrustModules.tsx` reads `evidenceLevel`, `lastReviewed`, `reviewedBy`, `editedBy`, `updateHistory`, and `evidenceSources`.

**All six fields are absent on all 193 posts.** The module renders only its one static tile — "Review Standard: Product Lab scoring rubric".

So the site ships a prominent trust module that conveys no information, while simultaneously claiming hands-on testing (P0-9).

**Fix:** populate the fields, or hide the module when it has no data.

## P1-14. 21 in-body commercial links carry no `rel` disclosure

Markdown body links bypass `lib/affiliate.ts` entirely — it only tags links rendered through `PriceButton` and the retailer components. 21 in-body links to manufacturer/retailer product pages therefore ship with neither `nofollow` nor `sponsored`.

Examples: `anker_solix_f1500`, `bluetti_ac500`, `camping_ecoflow_delta_2_max`, `pecron_f1000`.

**Fix:** apply `rel` in the markdown renderer for external commercial hosts.

## P1-15. Two reviews cite a competing review site as a source

- `posts/portable-power-stations/pecron_f1000.md:77`
- `posts/portable-power-stations/ecoflow_delta_3_1000_air.md:43`

Both link to **thesolarlab.com**, a competing review site, as a cited source / retailer link.

**Fix:** replace with a primary source (manufacturer spec sheet or retailer listing).

## P1-16. No contact route anywhere on the site

`/about` has a "Get in touch" section inviting corrections, but there is **no email address, contact form, or contact link anywhere on the site**, and no contact page in the footer.

This matters for E-E-A-T, for AdSense review, and for anyone trying to report an error.

**Fix:** add a contact email or form, and link it from the footer.

## P1-17. Remaining e2e failures (6 of 12, beyond the scoring specs)

| Spec | Failure |
| --- | --- |
| `ranked-card.spec.ts` | **Dead click regions** — the product title, summary text, and spec strip on `RankedProductCard` are not clickable. Verified manually on `/best/headphones/`. Users click the headline and nothing happens. |
| `product-imagery.spec.ts` | Byte-identical images across two product directories — caused by the Jackery duplicate in P0-10. |
| `article-hero.spec.ts` (desktop ×2) | Hero renders **380px** against the 360px (+4 tolerance) cap, on `/articles/bluetti_ac180` and `/articles/anker_solix_f3800`. |

**Fix:** make the whole `RankedProductCard` a link target (that one is user-facing and should be treated as near-P0); resolve the imagery failure via P0-10; adjust the hero height or the assertion.

## P1-18. `worstRating: 0` in Review JSON-LD

`app/articles/[slug]/page.tsx:142`. Google's convention for a star rating is `worstRating: 1`. A `0` floor can cause the rich result to be dropped.

**Fix:** set it to `1`.

---

# P2 — Cleanup

| # | Item | Evidence |
| --- | --- | --- |
| P2-1 | Raw ISO dates rendered to users — cards show `2026-09-19` instead of a formatted date | `components/ReviewCard.tsx:60` |
| P2-2 | `/compare` has only 3 comparisons, all power stations — thin for a top-level nav item | `/compare` |
| P2-3 | Bad slug containing both "review" and a price | `posts/portable-power-stations/dabbsson_600l_review_a_capable_power_station_for_under_300.md` |
| P2-4 | A brand opinion piece carries a `ratingBreakdown` and appears in the reviews feed as a product review | `bluetti_power_station_redemption` |
| P2-5 | Unused components (0 references): `components/VerdictBox.tsx`, `components/ArticleReview.tsx`, `components/PostsList.tsx` | — |
| P2-6 | Repo hygiene: stray `test.txt` at root, committed `logs/` directory, tracked `tsconfig.tsbuildinfo` (150KB) | — |
| P2-7 | `scripts/editorial/qa-gate.js` gates prose quality only — it does not check scale consistency, images, link quality, or duplicates, which is why **193/193 pass** while 71 reviews have no image and 7 are duplicates | — |

---

# What is already healthy

Worth stating, so the list above is read in proportion:

- **0** non-200 pages across all 252 sitemap URLs.
- **0** broken internal links.
- **0** missing local image files (502 checked).
- **0** duplicate `<title>` or meta descriptions; every page has a canonical and exactly one `<h1>`.
- **0** `<img>` elements missing `alt`.
- `npm run type-check` and `npm run lint` — clean.
- `node scripts/editorial/qa-gate.js --all` — **193/193** articles pass every blocking content gate.
- All 193 posts store metrics consistently on the 0–10 scale. **There is no data drift** — the scoring problem is confined to the presentation and copy layers.

---

# Suggested order of work

1. **Scoring migration** (P0-1 → P0-4, P1-2, P1-3, P1-4). Fix `e2e/score-display.spec.ts` *first* so it can verify the rest. Done when `score-display.spec.ts` is green.
2. **Money and legal** (P0-5 → P0-8). Small, independent, high-consequence.
3. **Duplicate reviews** (P0-10). Needs an editorial call; also clears one e2e failure.
4. **Assets and metadata** (P0-11, P1-5 → P1-7).
5. **Homepage and trust copy** (P0-9, P1-1, P1-13, P1-16).
6. **Content depth** (P1-8 → P1-12, P1-14, P1-15).
7. **P2 cleanup.**

Then extend `qa-gate.js` to cover the classes of defect it currently misses (P2-7), so this audit does not have to be repeated by hand.
