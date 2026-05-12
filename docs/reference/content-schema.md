# Reference — Content Schema

The complete frontmatter schema for review files at `posts/<category>/<slug>.md`.

## Required fields

| Field | Type | Example | Notes |
|---|---|---|---|
| `title` | string | `"EcoFlow Delta 3 Plus"` | Product name. Becomes `<h1>` and `<title>` |
| `date` | ISO date string | `"2026-04-10"` | Publication date. Used for sort order and OG metadata |
| `price` | string | `"$999"`, `"$799–$999"` | Free-form display string. Ranges allowed |
| `productImage` | URL | `"https://.../delta3plus.jpg"` | Primary hero image. Must be on a whitelisted domain |
| `specs` | object | see below | Key–value spec table |
| `pros` | string[] | `["Fast charging", "Quiet"]` | Bulleted strengths |
| `cons` | string[] | `["Heavy"]` | Bulleted weaknesses |
| `retailerLinks` | object | see below | Affiliate links by retailer name |
| `ratingBreakdown.metrics` | array | see below | Scored criteria, averaged into the overall score |

## Optional fields

| Field | Type | Example | Notes |
|---|---|---|---|
| `subtitle` | string | `"A 1 kWh powerhouse..."` | One-line hook below the title |
| `author` | string | `"Jane Doe"` | Byline |
| `authorBio` | string | `"Jane has reviewed..."` | Used by `AuthorBio` component |
| `image` | URL | | Fallback image if `productImage` is missing |
| `heroImage` | URL | | Optional alternative hero (some templates) |
| `rating` | number | `8.7` | Legacy single score; **deprecated** — prefer `ratingBreakdown` |

## Category-specific fields

### Power stations (`posts/portable-power-stations/*.md`)

| Field | Type | Allowed values | Used by |
|---|---|---|---|
| `capacityWh` | number | `0`–`∞` (no units) | `under-500`, `under-1000`, `for-cpap`, sort orders |
| `features` | string[] | see tag table below | All filtered sub-category pages |

**Feature tags:**

| Tag | Apply when… |
|---|---|
| `30a-rv` | Product has a TT-30 (30A) RV outlet |
| `solar` | Solar input ≥ 200W |
| `solar-kit` | Bundled with a solar panel |
| `240v` | Has true 240V output |
| `cpap` | 500–1500 Wh, < 25 lbs, quiet enough for bedside use |
| `van-life` | < 30 lbs **and** ≥ 400W solar input |

## Nested shapes

### `specs`

Free-form object — keys are display labels.

```yaml
specs:
  Capacity: "1024 Wh"
  AC Output: "1800 W"
  Solar Input: "500 W"
  Weight: "27 lbs"
  Recharge Time: "56 min"
```

**Tip:** keep keys consistent across reviews in the same category so the comparison page tables line up cleanly. The comparison card's "winner" highlight uses `extractNum()` to parse the value — keep numeric values numeric-leading (e.g. `"27 lbs"`, not `"weighs 27 lbs"`).

### `retailerLinks`

```yaml
retailerLinks:
  Amazon: "https://www.amazon.com/dp/XXXX?tag=YOURTAG"
  BestBuy: "https://www.bestbuy.com/site/..."
  EcoFlow: "https://us.ecoflow.com/..."
```

- Keys are retailer display names.
- All URLs are validated by `isSafeUrl()` at render time.
- All outbound links get `rel="noopener noreferrer nofollow"` and `target="_blank"`.

### `ratingBreakdown`

```yaml
ratingBreakdown:
  metrics:
    - name: "Performance"
      score: 9.2
    - name: "Design & Build"
      score: 8.5
    - name: "Value"
      score: 8.0
    - name: "App & Features"
      score: 7.5
```

- `score` is on a **0–10 scale**, decimals allowed.
- The article's overall score is the **arithmetic mean** of all `score` values (`lib/articleUtils.ts → calculateOverallScore`).
- Stars (0–5) are derived as `score / 2` (`scoreToStarRating`).

**Recommended metric vocab** (for consistency within a category):

- Performance, Design & Build, Value, App & Features
- Battery / Runtime (when relevant)
- Sound (audio), Image / Display (visual), Ergonomics (input devices)

## Slug & filename rules

- Filename is the URL slug. `delta_3_plus.md` → `/articles/delta_3_plus`.
- Must match `/^[a-z0-9]+(?:[_-][a-z0-9]+)*$/i`.
- Lowercase only, no spaces, no special characters.

## Validation

There is no schema validator today — invalid frontmatter typically manifests as:

- Build error from `gray-matter` (malformed YAML).
- Runtime fall-through (missing field renders blank in the UI).
- Type error if a component reads a required field as non-optional.

When adding a new required field, also update the `PostMetadata` TypeScript interface in `components/PostMetadata.ts`.

## Worked example

```markdown
---
title: "Anker SOLIX C1000"
subtitle: "The benchmark for sub-$1000 portable power"
date: "2026-03-14"
author: "Sam Kim"
price: "$799"
productImage: "https://example.s3.amazonaws.com/anker-c1000.jpg"
capacityWh: 1056
features:
  - "solar"
  - "cpap"
specs:
  Capacity: "1056 Wh"
  AC Output: "1800 W"
  Solar Input: "600 W"
  Weight: "28.4 lbs"
pros:
  - "Best-in-class fast charging"
  - "Excellent app experience"
  - "Quiet under load"
cons:
  - "No 240V output"
  - "Carry handle could be sturdier"
retailerLinks:
  Amazon: "https://www.amazon.com/dp/XXXX?tag=YOURTAG"
  Anker: "https://www.anker.com/products/a1761"
ratingBreakdown:
  metrics:
    - { name: "Performance", score: 9.0 }
    - { name: "Design & Build", score: 8.5 }
    - { name: "Value", score: 9.5 }
    - { name: "App & Features", score: 9.0 }
---

## Verdict

The C1000 is the easiest recommendation in its bracket...
```
