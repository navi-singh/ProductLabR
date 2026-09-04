# Reference — Playwright E2E

ProductLabR has a small Playwright suite for browser behaviors that lint, `tsc`, `next build`, jsdom, and React Testing Library cannot see.

## Why Playwright

jsdom has no layout or paint engine. It can assert React output, but it cannot tell which element is physically painted on top of another or which pixel would receive a user click.

That distinction matters here. Two production bugs were invisible to static checks and build validation:

1. Large regions of `RankedProductCard` looked clickable but did not navigate.
2. Local images loaded in dev but 404'd from the deployed `/ProductLabR` GitHub Pages path.

Both require a real browser.

## Test files

| File | What it guards |
|---|---|
| `e2e/ranked-card.spec.ts` | Every visual region of the first ranked card navigates to `/articles/...`, the card exposes exactly one accessible link, and keyboard activation works. |
| `e2e/images.spec.ts` | Images on representative list/article pages resolve, paint real pixels, same-origin local asset URLs include the deployment basePath, and missing product-specific files fall back without showing an error overlay. |
| `playwright.config.ts` | Runs desktop Chrome and Pixel 7 projects, starts `next dev` on port 3100 for local runs, and supports production mode via `E2E_PROD=1`. |

## Commands

| Command | Use |
|---|---|
| `npm run test:e2e` | Run Playwright locally against `next dev` on `http://127.0.0.1:3100/`. |
| `npm run test:e2e:prod` | Run against the deployed GitHub Pages site. Sets `E2E_PROD=1`. |
| `E2E_PROD=1 E2E_PROD_URL=https://example.com/ProductLabR/ npm run test:e2e` | Run against a custom deployed URL. Keep the trailing slash. |
| `npm run test:e2e:ui` | Open Playwright's interactive UI. |
| `npm run test:e2e:headed` | Run with a visible browser. |
| `npm run test:e2e:report` | Open the HTML report after a run that produced one. |

Specs use relative paths such as `best/headphones`, not leading-slash paths, so the same test works against both local dev and a subpath deployment.

## Why production mode exists

The live site is served from `https://navi-singh.github.io/ProductLabR/`, not from the origin root. Local dev has no `basePath`, so it is structurally blind to bugs caused by missing `/ProductLabR` prefixes.

Run production mode when touching:

- `next/image` call sites
- local asset URLs such as `/images/item.png`
- `lib/basePath.ts`
- deploy workflow or GitHub Pages configuration
- routes or links that may behave differently under a subpath

## Bug A — dead click regions on ranked cards

`components/RankedProductCard.tsx` uses a stretched link so the whole card behaves as one review link. The broken version placed that link at `absolute inset-0 z-0`.

Failure mode:

1. The stretched link entered the positioned-descendants paint layer.
2. Siblings later in DOM order painted above it: the image wrapper (`position: relative`) and the "Read Review" CTA (`z-10`).
3. The CTA was a `<span>`, not a link, so it swallowed clicks without navigating.
4. Unpositioned content such as title, summary, and the spec strip still sat below the stretched link, so clicks on text worked. That made the card look only intermittently broken.

Current pattern:

```tsx
<div className="group relative isolate">
  <Link href={href} className="absolute inset-0 z-10" aria-label={`Read ${name} review`} />

  <div className="relative z-0">
    {/* all non-interactive visual content */}
  </div>
</div>
```

Rules for stretched-link cards:

- Put the stretched link above the normal content layer.
- Wrap all non-interactive card content in one `relative z-0` element. That stacking context prevents descendants from raising themselves above the stretched link.
- Keep one accessible link to the review; do not duplicate the same destination for screen readers.
- If a child needs its own click target, such as a future affiliate "Check Price" button, it must be a **sibling** of the content wrapper with a higher z-index than the stretched link, not a descendant of the wrapper.

## Bug B — local images 404'd in production

GitHub Pages deployment runs `actions/configure-pages` with `static_site_generator: next`. That action text-injects Next config for Pages, including:

- `basePath` for `/ProductLabR`
- `output: "export"`
- `images.unoptimized: true`

A static export cannot run Next's image optimizer, so `images.unoptimized` is required. But Next.js does not prepend `basePath` to unoptimized image `src` values. Production requested `/images/item.png` instead of `/ProductLabR/images/item.png`, so every local image 404'd while local dev looked fine.

`lib/basePath.ts` fixes this:

- `BASE_PATH` reads `process.env.__NEXT_ROUTER_BASEPATH`, the resolved Next basePath inlined at build time.
- `withBasePath(src)` prefixes root-relative local URLs.
- It is idempotent and will not double-prefix.
- It leaves absolute URLs, protocol-relative URLs, data URIs, blob URIs, and other non-root-relative values alone.

Current direct `next/image` call sites apply the helper in:

- `components/OptimizedImage.tsx`
- `components/ArticleReview.tsx`
- `components/card.tsx`
- `components/article/PriceButton.tsx`

`components/article/ProductImage.tsx` reaches `next/image` through `OptimizedImage`, so it inherits the same helper.

Rule: **any new local asset URL must go through `withBasePath()` before reaching `next/image` or another rendered `src`.** Prefer `OptimizedImage` for product imagery; if you use bare `next/image`, call `withBasePath()` yourself.

This fixes the deployment prefix bug only. It does not create missing assets: several reviews still reference product-specific local filenames that are not present in `public/images/`, while others intentionally use `/images/item.png` as placeholder content.

## Deployment gotcha

Do not hardcode `basePath`, `output: "export"`, or `images.unoptimized` in local `next.config.mjs` just to match production. The deploy workflow injects them. Hardcoding them locally risks conflicting with the action and hiding the exact class of production-only issue the Playwright suite is meant to catch.

## Bug C — "Image unavailable" shown over a working placeholder

52 of the 149 reviews point `image:` at a product-specific file that was never added to
`public/images/`. `OptimizedImage` is designed to absorb that by falling back to
`/images/item.png`, but two defects stopped it working.

**1. The fallback was covered by its own error state.** `handleError` swapped the source to the
placeholder *and* set `hasError` in the same call, so the "Image unavailable" overlay painted on
top of a placeholder that then loaded perfectly well. The error state is now raised only if the
placeholder itself fails.

**2. The error never reached React.** The article hero is a `priority` image, so the browser
starts and finishes loading it while parsing the server-rendered HTML — before React hydrates.
React attaches `onError`/`onLoad` during hydration and never dispatches a synthetic event for one
that already fired, so the handler simply never ran.

`OptimizedImage` now reconciles against the element's settled state on mount:

```tsx
useEffect(() => {
  const img = imgRef.current;
  if (!img || !img.complete) return;
  if (img.naturalWidth === 0) handleError();
  else setIsLoading(false);
}, [imgSrc]);
```

The `else` branch matters independently: a cached image that finished before hydration would
otherwise miss `onLoad` and stay stuck at `opacity-0`, i.e. invisible.

Rule: **an SSR'd image cannot rely on React's `onLoad`/`onError` alone.** Always reconcile against
`img.complete` / `img.naturalWidth` after mount.

## Limitation — the dev server does not reliably hydrate

`npm run test:e2e` runs against `next dev`, which **cannot** validate client-side behaviour in this
repo. The CSP in `next.config.mjs` originally omitted `'unsafe-eval'`, which the webpack HMR
runtime requires, so React aborted with `eval() is not supported in this environment` and no client
JS ran at all. `'unsafe-eval'` is now added **in development only** — `headers()` is served by a
running Next server and is ignored by the static export, so production CSP is unchanged.

Hydration in dev is still not dependable (the HMR websocket is also blocked), so any spec that
depends on client-side behaviour must be gated:

```ts
test.skip(!process.env.E2E_PROD, 'needs a hydrated client; run against a real export');
```

To exercise such specs locally, build a real export and point the suite at it:

```bash
# temporarily add output:'export' + images.unoptimized to next.config.mjs, then:
npm run build
npx serve out --listen 3200
E2E_PROD=1 E2E_PROD_URL=http://127.0.0.1:3200/ npx playwright test
```

Remember to revert `next.config.mjs` afterwards — see the deployment gotcha above.
