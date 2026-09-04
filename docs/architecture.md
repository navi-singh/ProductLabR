# Architecture

A single-page deep dive on how ProductLabR is built and why. Read [overview.md](./overview.md) first for the executive summary.

## Rendering model

**Build-time static rendering.** Every route is materialized to HTML during `next build`, written to `./out/`, and served by GitHub Pages.

- No Node runtime in production.
- No `getServerSideProps`, no edge functions, no ISR.
- Dynamic routes (`/articles/[slug]`, `/best/.../compare/[pair]`) enumerate their params with `generateStaticParams()`.
- Pages that Next would otherwise treat as dynamic (`sitemap.ts`, `robots.ts`) are pinned with `export const dynamic = 'force-static'`.

This constraint is the single most important fact about the architecture. Anything personalized has to run **client-side** (`'use client'` islands).

## Data flow

```
┌──────────────────┐
│  posts/*.md      │   YAML frontmatter + markdown body
└────────┬─────────┘
         │ read at build time
         ▼
┌──────────────────────────────────────────┐
│  lib/Posts.ts (React.cache())            │
│   getPostBySlug, getAllPostSlugs,        │
│   getPostsByCategory                     │
└────────┬─────────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────────┐
│  Vertical-specific data layer            │
│   lib/power-station-data.ts              │
│   typed entries + filter functions       │
└────────┬─────────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────────┐
│  app/**/page.tsx (RSC)                   │
│   - generateStaticParams()               │
│   - generateMetadata() per route         │
│   - returns JSX tree of server + client  │
│     components                           │
└────────┬─────────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────────┐
│  marked + lib/markdown.ts                │
│   markdown body → Tailwind-styled HTML   │
└────────┬─────────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────────┐
│  next build → ./out/ (static files)      │
└────────┬─────────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────────┐
│  GitHub Actions → GitHub Pages           │
└──────────────────────────────────────────┘
```

## Why React Server Components

- The vast majority of components have no interactivity. Rendering them as RSC keeps the client bundle small.
- Markdown parsing and frontmatter reads happen on the server side of the build — they never ship to the browser.
- Interactive islands (`PowerStationQuiz`, `SearchBar`, `StickyBuyBar`) opt-in with `'use client'`.

## The data layer

Two-tier:

1. **`lib/Posts.ts`** — generic markdown loader. Knows how to read `posts/<category>/<slug>.md`, validate slugs, parse frontmatter, and list categories. Cached with `React.cache()`.
2. **Vertical-specific helpers** — e.g. `lib/power-station-data.ts` exposes a typed `PowerStationEntry[]` plus filter functions (`getStationsByFeature`, `getStationsUnderPrice`, `getStationsBySlugs`, `getQuickPicks`). New verticals should follow this pattern: lift filtering logic out of route files into a typed helper, and import it from every page that needs the data.

**Why a vertical-specific layer instead of generic queries?** Filters are domain-aware (power stations care about `capacityWh`; cameras would care about sensor size and mount type). Generic ORM-style queries would push that complexity into every page.

## Routing

App Router, file-system based. Three flavors:

| Flavor | Example | Pre-rendered via |
|---|---|---|
| Fully static | `app/best/page.tsx` | Default — no params to enumerate |
| Static with dynamic params | `app/articles/[slug]/page.tsx` | `generateStaticParams()` returns every slug |
| Static via override | `app/sitemap.ts`, `app/robots.ts` | `export const dynamic = 'force-static'` |

Article metadata (OG tags, JSON-LD) is generated per-route with `generateMetadata()`. This is what gets the home page and reviews crawled correctly.

## Markdown pipeline

Files run through `lib/markdown.ts → processMarkdownContent(content)`:

1. `gray-matter` (called earlier in `lib/Posts.ts`) splits frontmatter from body.
2. `marked` with GFM + line breaks converts markdown to HTML.
3. A custom renderer strips raw inline HTML (XSS hardening) — markdown only.
4. Regex pass injects Tailwind classes onto headings, lists, links, code, blockquotes, etc.
5. H2 anchor IDs are derived from heading text, enabling the Table of Contents.

The styled output drops into a `.article-body` container (defined in `styles/global.css`) for finishing touches (line-height, scroll-margin-top, etc.).

## Styling architecture

- **CSS variables** in `styles/theme.css` are the single source of truth for color, radius, font family, max-width.
- **Tailwind** (`tailwind.config.ts`) extends `theme.colors`, `theme.boxShadow`, etc. to consume those variables, so Tailwind utilities become token-aware.
- **`.article-body`** is a layered CSS class that wraps rendered markdown — keeps prose-specific overrides out of inline classes.
- **No CSS Modules, no styled-components.** Tailwind + the design tokens is sufficient.

## Image handling

- Prefer `OptimizedImage` (a thin wrapper around `next/image`) for product imagery.
- Any local asset URL that reaches `next/image` must pass through `withBasePath()` from `lib/basePath.ts`. This is required for GitHub Pages because the deployed site lives under `/ProductLabR`.
- Direct `next/image` call sites exist for legacy article/card surfaces and retailer logos; they call `withBasePath()` themselves.
- Remote domains explicitly whitelisted in `next.config.mjs → images.remotePatterns`. Adding a new CDN means a config change + redeploy.
- `actions/configure-pages` injects `images.unoptimized: true` for the static export, so production cannot rely on the Next image optimizer to rewrite local paths.

See [reference/playwright-e2e.md](./reference/playwright-e2e.md#bug-b--local-images-404d-in-production) for the production-only image 404 this prevents.

## Monetization integration

**AdSense** is a build-time-configurable, runtime-rendered concern.

- `lib/adsense-config.ts` holds all slot IDs and a `shouldShowAds()` gate.
- `components/ads/AdBanner.tsx` renders either a labeled placeholder (dev) or the real AdSense script (prod with publisher ID set).
- The publisher ID comes from `NEXT_PUBLIC_GOOGLE_ADSENSE_ID`. If missing in a production build, the build logs a **warning** (not an error) so CI passes on forks without secrets.

**Affiliate links** are pure markup. `retailerLinks` in frontmatter → `RetailerLinks` / `PriceButton` components → `<a rel="noopener noreferrer nofollow">`. Every URL passes `isSafeUrl()` first.

## Security posture

From `next.config.mjs` and observed practice:

- **Content-Security-Policy** header. `script-src` allows `'unsafe-inline'` because AdSense's `adsbygoogle.js` needs it.
- Allow-listed external script origins: Google Analytics, Google Tag Manager, Google AdSense.
- `X-Frame-Options`, `Referrer-Policy`, and friends set conservatively.
- **No raw HTML in markdown** — body is sanitized by the custom `marked` renderer.
- **URL validation** at render time via `isSafeUrl()` — prevents `javascript:` and similar.

## Build & deploy pipeline

`.github/workflows/nextjs.yml`:

1. Trigger: push to `main` (or manual dispatch).
2. Checkout, detect package manager, set up Node 20.
3. Configure GitHub Pages. `actions/configure-pages` text-injects the Pages `basePath`, `output: "export"`, and `images.unoptimized` into the resolved Next config.
4. Restore `.next/cache/`.
5. Install with the detected package manager.
6. Run `next build` with the detected runner — produces `./out/`.
7. Upload `./out/` as artifact.
8. Deploy to GitHub Pages.

Typical pipeline duration: 2–3 minutes.

The repo standardises on **npm**: `package-lock.json` is the only lockfile, and the deploy workflow's
package-manager detection therefore falls through to `npm ci` with `npx --no-install next build`.

A `yarn.lock` used to sit alongside it. Because the workflow prefers yarn whenever that file exists,
CI installed from a lockfile that no one maintained — it pinned an older `next`, double-counted every
Dependabot alert across two lockfiles, and, critically, **yarn v1 ignores the npm `overrides` field**,
so security pins in `package.json` silently never reached production. It was removed for those
reasons.

Do not reintroduce `yarn.lock`. Adding one back silently switches CI to yarn and disables `overrides`.

## Dependency and vulnerability posture

Pinned for security: `next` (>= 16.2.11 fixes a batch of advisories), `postcss` >= 8.5.18 as a direct
devDependency, and `sharp` >= 0.35.0 / `brace-expansion` >= 5.0.8 via `overrides`.

Two advisories are **knowingly accepted**, because fixing them would break the build for no real gain:

| Package | Why it stays |
|---|---|
| `js-yaml` | `gray-matter` calls `yaml.safeLoad`, removed in js-yaml 4.x, and there is no patched 3.x (3.14.2 is the last). Forcing an upgrade breaks frontmatter parsing for every post. |
| `postcss` (nested under `next`) | `next` pins an exact internal copy; an override is rejected as invalid. |

Both are build-time only and process **our own committed content** — markdown frontmatter and Tailwind
source — so neither is reachable by an attacker.

The same reasoning tempers the `next` advisories generally. Most of them target middleware, Server
Actions, rewrites, the image optimizer, or cache behaviour on a **running** Next server. This site is
a static export served by GitHub Pages: there is no server, no middleware, and no Server Actions, so
those code paths do not exist in production. Upgrading is good hygiene, not incident response.

## Performance targets

From `PRODUCTION.md`:

- **LCP** < 2.5s
- **FID** < 100ms
- **CLS** < 0.1
- **Lighthouse:** Performance > 90, Accessibility > 95, Best Practices > 90, SEO > 95

Levers we have:

- Static HTML (zero server time-to-first-byte).
- Explicit image dimensions and stable aspect-ratio containers.
- Tailwind purging keeps CSS small.
- RSC keeps the JS bundle to interactive islands only.
- Playwright image checks catch production-only local asset 404s.

## Known constraints & trade-offs

| Constraint | Consequence | Mitigation |
|---|---|---|
| Static-only hosting (Pages) | No personalization, no A/B testing without client JS | Run experiments via client-side scripts or move to Vercel |
| Markdown source-of-truth | No editorial CMS UI | Frontmatter is human-friendly; a CMS could be layered on top later |
| AdSense `'unsafe-inline'` | CSP is weaker than ideal | Acceptable for the revenue trade-off; revisit if AdSense supports nonces |
| `marked` (not MDX) | No React components inside content | Conscious choice — keeps content authorable by non-devs |
| Playwright not wired into deploy CI | Browser regressions require an explicit `npm run test:e2e` / `npm run test:e2e:prod` run | Keep the focused suite small; run prod mode for basePath-sensitive changes |
| GitHub Pages config is injected at deploy time | Local `next.config.mjs` does not show the final `basePath`, static export, or unoptimized-image settings | Do not hardcode the injected settings locally |

## Where to go next

- **Route map:** [reference/routes.md](./reference/routes.md)
- **Components:** [reference/components.md](./reference/components.md)
- **Content schema:** [reference/content-schema.md](./reference/content-schema.md)
- **Editorial quality tooling:** [reference/editorial-quality-toolchain.md](./reference/editorial-quality-toolchain.md)
- **Playwright E2E:** [reference/playwright-e2e.md](./reference/playwright-e2e.md)
