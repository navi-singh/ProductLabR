# For Content Editors

How to write, structure, and publish a review on ProductLabR. No code required — just markdown, a text editor, and good editorial judgment.

## The shape of a review

Every review is a single markdown file at:

```
posts/<category>/<slug>.md
```

- `<category>` is the directory: `portable-power-stations`, `cameras`, `laptops`, etc.
- `<slug>` is the URL-safe filename: lowercase, words separated by underscores or hyphens. Example: `ecoflow_delta_3_plus.md` → `/articles/ecoflow_delta_3_plus`.

The file has **two parts**:

1. **Frontmatter** — YAML between two `---` lines. Structured metadata.
2. **Body** — Markdown prose underneath. The review itself.

## Minimum-viable frontmatter

```yaml
---
title: "EcoFlow Delta 3 Plus"
subtitle: "A 1 kWh powerhouse with the fastest recharge in its class"
date: "2026-04-10"
author: "Jane Doe"
price: "$999"
productImage: "https://example.com/path/to/image.jpg"
specs:
  Capacity: "1024 Wh"
  AC Output: "1800 W"
  Solar Input: "500 W"
  Weight: "27 lbs"
pros:
  - "Sub-1-hour AC recharge"
  - "X-Boost handles 1800 W appliances"
  - "Quiet under 500 W load"
cons:
  - "App is iOS-only at launch"
  - "Heavy for its category"
retailerLinks:
  Amazon: "https://www.amazon.com/dp/XXXX?tag=YOURTAG"
  BestBuy: "https://www.bestbuy.com/site/..."
ratingBreakdown:
  metrics:
    - { name: "Performance", score: 9.2 }
    - { name: "Design & Build", score: 8.5 }
    - { name: "Value", score: 8.0 }
    - { name: "App & Features", score: 7.5 }
---
```

**Full schema with every optional field:** [reference/content-schema.md](./reference/content-schema.md).

## Category-specific extras

Some categories require extra frontmatter so the review can appear on filtered sub-category pages. For **power stations**:

```yaml
capacityWh: 1024            # number, no units
features:                   # any subset of these tags
  - "30a-rv"
  - "solar"
  - "solar-kit"
  - "240v"
  - "cpap"
  - "van-life"
```

If you skip these, the review won't surface on the new sub-category pages (RV, solar, CPAP, van-life, etc.). Detail by feature:

| Tag | When to apply it |
|---|---|
| `30a-rv` | Has a TT-30 (30A) RV outlet |
| `solar` | Solar input ≥ 200W |
| `solar-kit` | Sold/bundled with a panel |
| `240v` | True 240V output (not just 120V split-phase trick) |
| `cpap` | 500–1500 Wh, < 25 lbs, quiet — a viable CPAP companion |
| `van-life` | < 30 lbs and ≥ 400W solar input |

## How rankings work

The overall score shown on the article and used for ranking on category pages is the **average of `ratingBreakdown.metrics[].score`**. There's no separate "overall score" field — keep the metrics honest and the average will be right.

Common metric names (consistency helps readers compare across reviews):

- **Performance** — does it do the job?
- **Design & Build** — quality, fit, finish, ergonomics
- **Value** — for the price
- **App & Features** — software, connectivity
- **Battery / Runtime** — where relevant
- **Sound / Image / Display** — category-specific

Use the same metric names across reviews in the same category whenever possible.

## Writing the body

The body is rendered through a custom markdown pipeline (`lib/markdown.ts`) that styles standard markdown into the article look. **Stick to standard markdown.** Inline HTML is stripped for security.

Supported:

- `# H1` (rare — the title comes from frontmatter)
- `## H2` — becomes an anchored, underlined section heading. These appear in the Table of Contents.
- `### H3` — sub-headings
- **Bold**, *italic*, `inline code`
- Bulleted and numbered lists
- > Blockquotes — render with a light-blue surface and a primary-blue left border
- Code blocks (rarely needed)
- Links — `[text](https://...)` — always full URLs
- Images — `![alt](url)` — see image rules below

### Suggested structure

A consistently structured review reads better and ranks better.

```
## Verdict (1 paragraph)
## Who it's for (bullets or short prose)
## Design & build
## Performance
## In real-world use
## Value & alternatives
## The bottom line
```

Keep paragraphs short — 2–4 sentences. The body type is 15px / 1.8, optimized for scanability on mobile.

## Image rules

- Use full https URLs. Allowed domains today: Amazon S3 (`*.s3.amazonaws.com`), Bob Vila CDN, Future CDN. New domains need engineering to whitelist.
- Always provide **descriptive alt text** — it's an accessibility requirement and an SEO signal.
- **Hero / product image** goes in frontmatter (`productImage`), not the body.
- Body images should be photos that *add* something (in-use shots, comparison shots). Don't pad.

## Affiliate links

- Every retailer link goes in `retailerLinks` — not in the body. The article auto-renders buy buttons from this map.
- The site adds `rel="noopener noreferrer nofollow"` and validates URLs through a safety check. `javascript:` URLs are rejected.
- Use **canonical product URLs** with your affiliate tag appended. Avoid shorteners — they look spammy and break occasionally.

## Slug & filename rules

- Lowercase only.
- Words separated by `_` or `-`.
- Must match the regex `/^[a-z0-9]+(?:[_-][a-z0-9]+)*$/i` — no spaces, no special characters.
- The filename **is** the URL slug (`my_product.md` → `/articles/my_product`). Don't rename after publishing — you'll break inbound links.

## Publishing a review

1. Create the file under the right `posts/<category>/` directory.
2. Fill in **all required frontmatter** (title, date, price, productImage, specs, pros, cons, retailerLinks, ratingBreakdown).
3. Write the body.
4. Commit on a feature branch (`nmehrok/addReviewEcoflowDelta3Plus`).
5. Open a draft PR. Engineering will build and preview.
6. Once merged to `main`, GitHub Actions builds and deploys to GitHub Pages within ~2–3 minutes.

If you don't have engineering access, hand the markdown file to an engineer and they'll commit it.

## Quality checklist before you hit publish

- [ ] Title is the product name, no editorializing
- [ ] `date` is today's date in `YYYY-MM-DD` format
- [ ] Subtitle gives a one-sentence hook
- [ ] `productImage` resolves (open it in a browser)
- [ ] At least 3 specs, 2 pros, 2 cons
- [ ] At least one retailer link, tested in a private/incognito tab
- [ ] All `ratingBreakdown.metrics` filled in with thoughtful scores
- [ ] H2 headings used (so the Table of Contents has anchors)
- [ ] No raw HTML in the body
- [ ] No internal-only notes accidentally left in the body
- [ ] Category-specific frontmatter present (e.g. `capacityWh`, `features` for power stations)

## Common mistakes

| Mistake | Why it matters |
|---|---|
| Putting buy links in the body | The article's buy buttons are auto-generated from frontmatter; body links bypass affiliate styling |
| Score fields outside 0–10 | The star derivation and average break |
| Using emojis in titles | We don't put emojis in the product itself; reserve them for the finder quiz UI |
| Spaces in slugs / filenames | Build fails; URL becomes ugly |
| Missing `productImage` | Card layouts fall back to a placeholder — looks unprofessional |
| Reusing scores across many reviews | Readers calibrate quickly; 9s lose meaning if everything's a 9 |

## Where to go next

- **Full frontmatter reference:** [reference/content-schema.md](./reference/content-schema.md)
- **How the rendered prose is styled (so you know what your H2s will look like):** [for-designers.md](./for-designers.md#typography)
