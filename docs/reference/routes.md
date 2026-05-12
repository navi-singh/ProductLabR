# Reference — Route Map

Every route in the app, what it renders, and how it's generated.

## Home & meta

| Route | File | Rendering |
|---|---|---|
| `/` | `app/page.tsx` | Static — home with editor's pick, latest, best-of, sidebar |
| `/sitemap.xml` | `app/sitemap.ts` | `force-static` — auto-enumerates all routes |
| `/robots.txt` | `app/robots.ts` | `force-static` |

## Articles

| Route | File | Rendering |
|---|---|---|
| `/articles/[slug]` | `app/articles/[slug]/page.tsx` | SSG via `generateStaticParams()` over `getAllPostSlugs()` |

Each article also emits per-route OG metadata and a JSON-LD `Review` schema.

## Best (category hub)

| Route | File | Notes |
|---|---|---|
| `/best` | `app/best/page.tsx` | Top-level hub: featured categories, methodology, browse-all |

## Best — Power Stations

| Route | File | Filter |
|---|---|---|
| `/best/power-stations` | `app/best/power-stations/page.tsx` | Hub: hero, finder quiz, sub-category grid |
| `/best/power-stations/portable-power-stations` | `…/portable-power-stations/page.tsx` | All portable stations |
| `/best/power-stations/house-backup-power-stations` | `…/house-backup-power-stations/page.tsx` | Whole-home backup |
| `/best/power-stations/camping-power-stations` | `…/camping-power-stations/page.tsx` | Camping |
| `/best/power-stations/carry-on-power-stations` | `…/carry-on-power-stations/page.tsx` | Travel-sized |
| `/best/power-stations/rv-power-stations` | `…/rv-power-stations/page.tsx` | `features` includes `30a-rv` |
| `/best/power-stations/solar-generators` | `…/solar-generators/page.tsx` | `features` includes `solar` or `solar-kit` |
| `/best/power-stations/under-500` | `…/under-500/page.tsx` | Price ≤ $500 |
| `/best/power-stations/under-1000` | `…/under-1000/page.tsx` | Price ≤ $1,000 |
| `/best/power-stations/for-cpap` | `…/for-cpap/page.tsx` | `features` includes `cpap` |
| `/best/power-stations/240v-power-stations` | `…/240v-power-stations/page.tsx` | `features` includes `240v` |
| `/best/power-stations/van-life` | `…/van-life/page.tsx` | `features` includes `van-life` |

### Power Station comparisons

| Route | Comparison |
|---|---|
| `/best/power-stations/compare/ecoflow-delta-3-plus-vs-anker-solix-c1000` | Mid-size, 1 kWh class |
| `/best/power-stations/compare/bluetti-elite-200-v2-vs-anker-solix-c2000-gen2` | Mid-large, 2 kWh class |
| `/best/power-stations/compare/ecoflow-delta-pro-ultra-x-vs-anker-solix-e10` | Flagship / whole-home |

## Best — other verticals

| Route | Notes |
|---|---|
| `/best/cameras` | Hub: hybrid, pro photo, pro generic |
| `/best/cameras/hybrid-cameras` | Sub |
| `/best/cameras/professional-photo-cameras` | Sub |
| `/best/cameras/professional-cameras` | Sub |
| `/best/gaming` | Hub: keyboards, mice |
| `/best/gaming/gaming-keyboards` | Sub |
| `/best/gaming/gaming-mice` | Sub |
| `/best/headphones` | Hub |
| `/best/headphones/noise-cancelling-headphones` | Sub |
| `/best/headphones/wireless-earbuds` | Sub |
| `/best/laptops` | Hub |
| `/best/laptops/laptops-under-1000` | Sub |
| `/best/laptops/gaming-laptops` | Sub |
| `/best/laptops/macbooks` | Sub |
| `/best/monitors` | Hub |
| `/best/monitors/4k-monitors` | Sub |
| `/best/monitors/gaming-monitors` | Sub |
| `/best/smartphones` | Hub |
| `/best/smart-home` | Hub |
| `/best/smart-home/robot-vacuums` | Sub |
| `/best/smart-home/smart-speakers` | Sub |
| `/best/tvs` | Hub |
| `/best/tvs/gaming-tvs` | Sub |
| `/best/tvs/oled-tvs` | Sub |
| `/best/wearables` | Hub |
| `/best/wearables/smartwatches` | Sub |

> Some sub-routes may exist as scaffolding without populated content yet. Check the directory under `app/best/` for the authoritative list.

## How dynamic routes are precompiled

- `app/articles/[slug]/page.tsx` exports `generateStaticParams()` which calls `getAllPostSlugs()` and returns `[{ slug }, …]`.
- Comparison routes are explicit folders (not `[slug]`) because there are only three.
- New comparison pages = new folders; new article pages happen automatically when a `.md` file is added.

## Adding a new route

| New thing you need | Steps |
|---|---|
| A new sub-category page | Create `app/best/<vertical>/<sub>/page.tsx`. Mirror an existing sibling. Add a card to the hub. |
| A new comparison page | Create `app/best/<vertical>/compare/<a>-vs-<b>/page.tsx`. Pull entries with `getStationsBySlugs([...])`. |
| A new vertical hub | Create `app/best/<vertical>/page.tsx` + at least one sub-category. Link from `/best`. Add to the header nav. |
| A new article | Drop a `.md` file under `posts/<category>/`. No code change needed. |
