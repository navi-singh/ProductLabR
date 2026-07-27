import { test, expect, type Page } from '@playwright/test';

/**
 * Guards against broken image URLs.
 *
 * The deployed site lives under a /ProductLabR basePath. next/image normally
 * prepends that automatically, but not when images.unoptimized is true — which
 * the GitHub Pages deploy sets, because a static export cannot run the image
 * optimizer. That combination silently 404'd every local image in production
 * while local dev looked perfect.
 *
 * Run against production with: npm run test:e2e:prod
 */

const PAGES = ['best/headphones', 'articles/nikon_z8'];

/** Collects the URL of every image request that came back as an error. */
function trackFailedImageRequests(page: Page): string[] {
  const failed: string[] = [];

  page.on('response', (response) => {
    const isImage = response.request().resourceType() === 'image';
    if (isImage && response.status() >= 400) {
      failed.push(`${response.status()} ${response.url()}`);
    }
  });

  return failed;
}

for (const path of PAGES) {
  test(`images on /${path} resolve and render`, async ({ page }) => {
    const failedRequests = trackFailedImageRequests(page);

    await page.goto(path, { waitUntil: 'networkidle' });

    // Every <img> the browser painted should have real pixel data. naturalWidth
    // is 0 for an image that failed to decode or 404'd.
    const broken = await page.evaluate(() =>
      Array.from(document.images)
        .filter((img) => img.currentSrc !== '' && img.naturalWidth === 0)
        .map((img) => img.currentSrc),
    );

    expect(broken, `Images that rendered but have no pixel data:\n  ${broken.join('\n  ')}`).toEqual(
      [],
    );

    expect(
      failedRequests,
      `Image requests that returned an error status:\n  ${failedRequests.join('\n  ')}`,
    ).toEqual([]);
  });
}

test('local asset URLs carry the deployment basePath', async ({ page, baseURL }) => {  await page.goto(PAGES[0], { waitUntil: 'domcontentloaded' });

  // Whatever subpath the app is served from, same-origin image URLs must sit
  // underneath it. Off-site product imagery is out of scope.
  const prefix = new URL(baseURL!).pathname.replace(/\/$/, '');
  test.skip(prefix === '', 'no basePath in this environment; nothing to assert');

  const misplaced = await page.evaluate((expectedPrefix) => {
    return Array.from(document.images)
      .map((img) => img.getAttribute('src') ?? '')
      .filter((src) => src.startsWith('/') && !src.startsWith('//'))
      .filter((src) => !src.startsWith(`${expectedPrefix}/`));
  }, prefix);

  expect(
    misplaced,
    `Root-relative image srcs missing the "${prefix}" basePath:\n  ${misplaced.join('\n  ')}`,
  ).toEqual([]);
});

/**
 * Most posts point `image:` at a per-product file that was never added to
 * public/images. OptimizedImage is meant to absorb that by falling back to the
 * shared placeholder, but it used to raise its "Image unavailable" overlay at
 * the same moment it swapped the source in — so the overlay covered a
 * placeholder that had loaded perfectly well.
 *
 * This asserts the user-visible contract only. The initial 404 still happens
 * and is expected; what must not happen is an error state on screen.
 */
test('a post with no product image of its own degrades to the placeholder', async ({ page }) => {
  test.skip(
    !process.env.E2E_PROD,
    'Needs a hydrated client. The dev server serves a CSP + HMR runtime that does ' +
      'not reliably hydrate, so the fallback never runs there. Exercise this ' +
      'against a real export: npm run test:e2e:prod',
  );

  await page.goto('articles/sony_wh1000xm5', { waitUntil: 'networkidle' });

  await expect(page.getByText('Image unavailable')).toHaveCount(0);

  const blank = await page.evaluate(() =>
    Array.from(document.images)
      .filter((img) => img.currentSrc !== '' && img.naturalWidth === 0)
      .map((img) => img.currentSrc),
  );

  expect(blank, `Images left with no pixel data:\n  ${blank.join('\n  ')}`).toEqual([]);
});
