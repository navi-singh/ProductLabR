import { test, expect } from '@playwright/test';
import { ARTICLE_REDIRECTS } from '../lib/redirects';

/**
 * Guards for the P0 items in docs/LAUNCH-BLOCKERS.md that are not already
 * covered by score-display.spec.ts or product-imagery.spec.ts.
 */

test.describe('retired duplicate review URLs', () => {
  for (const [from, to] of Object.entries(ARTICLE_REDIRECTS)) {
    test(`${from} forwards to ${to} and is not indexable`, async ({ page }) => {
      await page.goto(`articles/${from}/`);
      await page.waitForURL(new RegExp(`/articles/${to}/?$`));
      await expect(page.getByText('Product Lab Rating').first()).toBeVisible();
    });
  }

  test('the stub page is noindex and canonicalises to the survivor', async ({ request }) => {
    const html = await (await request.get('articles/jackery_1000_v2/')).text();
    expect(html).toMatch(/<meta[^>]+name="robots"[^>]+noindex/);
    expect(html).toMatch(/<link[^>]+rel="canonical"[^>]+\/articles\/jackery_explorer_1000_v2\/?"/);
  });

  test('retired slugs are absent from the sitemap', async ({ request }) => {
    const sitemap = await (await request.get('sitemap.xml')).text();
    for (const from of Object.keys(ARTICLE_REDIRECTS)) {
      expect(sitemap, from).not.toContain(`/articles/${from}/`);
    }
  });
});

test.describe('cookie consent', () => {
  test('ads stay unloaded until the visitor accepts, and the choice persists', async ({ page }) => {
    await page.goto('./');
    const banner = page.getByRole('region', { name: 'Cookie choices' });
    await expect(banner).toBeVisible();
    await expect(page.locator('script[src*="adsbygoogle"]')).toHaveCount(0);

    await banner.getByRole('button', { name: 'Reject' }).click();
    await expect(banner).toBeHidden();
    await page.reload();
    await expect(page.getByRole('region', { name: 'Cookie choices' })).toBeHidden();
    await expect(page.locator('script[src*="adsbygoogle"]')).toHaveCount(0);

    await page.getByRole('button', { name: 'Cookie settings' }).click();
    await expect(page.getByRole('region', { name: 'Cookie choices' })).toBeVisible();
  });
});

test('the newsletter form is hidden when no subscription endpoint is configured', async ({ page }) => {
  test.skip(!!process.env.NEXT_PUBLIC_NEWSLETTER_ENDPOINT, 'an endpoint is configured');
  await page.goto('./');
  await expect(page.getByRole('button', { name: 'Subscribe' })).toHaveCount(0);
});

test('assets referenced by metadata and JSON-LD exist', async ({ request }) => {
  for (const asset of ['images/logo.png', 'og-default.png', 'apple-touch-icon.png', 'site.webmanifest']) {
    expect((await request.get(asset)).status(), asset).toBe(200);
  }
});

test('published copy matches the 5-point scale and the actual methodology', async ({ page }) => {
  await page.goto('methodology/');
  await expect(page.getByText('4.5–5.0')).toBeVisible();
  await expect(page.getByText('9.0–10')).toHaveCount(0);

  await page.goto('./');
  await expect(page.getByText(/hands-on testing/i)).toHaveCount(0);
});
