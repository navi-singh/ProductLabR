# Plan: Next.js upgrade, image fallback fix, lockfile consolidation, docs

## Context

Follow-on to the ranked-card and basePath fixes. Three threads: upgrade Next.js off a
vulnerable patch, document the editorial + UI-testing work, and fix what turned out to be a
second, unrelated broken-image bug found while validating.

## What was found

**1. Next.js 16.2.5 carried a batch of advisories.** All fixed in 16.2.11; 16.2.12 is latest.
The declared range was already `^16.2.4`, so this was a patch bump, not a migration.

Framing: nearly every advisory targets middleware, Server Actions, rewrites, the image
optimizer, or cache behaviour on a *running* Next server. This site is a static export with
none of those. Good hygiene, not incident response.

**2. 69 of 127 posts reference product images that do not exist** in `public/images/`.
Only `item.png`, `amazon.png`, `bestbuy.jpg`, `ebay.svg` and two `posts/` subfolders are present.

**3. `OptimizedImage` had two defects that turned that into a visible error.**
   - `handleError` set `hasError` *and* swapped in the placeholder in the same call, so the
     "Image unavailable" overlay painted on top of a placeholder that loaded fine.
   - The hero is a `priority` image, so it settles before React hydrates. React never
     dispatches a synthetic `onError`/`onLoad` for an event that already fired, so the handler
     never ran at all. The same race could strand a cached image at `opacity-0`.

**4. The dev server cannot test any of this.** Our own CSP omitted `'unsafe-eval'`, which the
webpack HMR runtime needs, so React aborted with `eval() is not supported in this environment`
and no client JS ran.

**5. CI was building from an unmaintained `yarn.lock`.** The workflow prefers yarn whenever that
file exists. It pinned `next@16.2.5`, double-counted Dependabot alerts, and — decisively —
**yarn v1 ignores npm `overrides`**, so security pins never reached production.

## Changes

| Area | Change |
| --- | --- |
| `package.json` | `next` -> `^16.2.12`; `postcss` -> `^8.5.23`; overrides for `sharp` >= 0.35.3, `brace-expansion` >= 5.0.8 |
| `yarn.lock` | Deleted. CI now falls through to `npm ci`, which honours `overrides` |
| `components/OptimizedImage.tsx` | Fallback no longer raises its own error state; post-mount reconciliation against `img.complete` / `naturalWidth`; new `wrapperClassName` prop |
| `components/article/ProductImage.tsx` | Delegates to `OptimizedImage` instead of bare `next/image`, inheriting the fallback |
| `next.config.mjs` | `'unsafe-eval'` in CSP for development only; `headers()` never applies to the static export, so production CSP is unchanged |
| `e2e/images.spec.ts` | Test that a post with no product image degrades to the placeholder with no error overlay |
| `docs/` | Editorial toolchain + Playwright references, dependency posture, lockfile rules |

## Accepted risk

`js-yaml` and `next`'s pinned internal `postcss` stay vulnerable. `gray-matter` calls
`yaml.safeLoad`, removed in 4.x, with no patched 3.x; and `next` pins postcss exactly, so the
override is rejected. Both are build-time only and parse our own committed content.

## Verification

- `npm ci` from a clean tree, then `tsc`, `eslint`, and `npx --no-install next build` — CI's exact runner.
- Image fallback proven against a **real static export**, not the dev server: built with
  `output: 'export'`, served on :3200. Suite **failed with the fix reverted and passed with it restored**.
- Default `npm run test:e2e`: 10 passed, 4 skipped by design.
- `npm audit`: 6 high -> 2 high + 2 moderate, both knowingly accepted.
