import { test, expect } from '@playwright/test';
import { affiliateRel, hasAffiliateProgram, withAffiliateTag } from '../lib/affiliate';

/**
 * Retailer links used to render as <button onClick={window.open(...)}>. That
 * had two consequences worth guarding against:
 *
 *  1. A button is not a link. Crawlers cannot follow it, users cannot
 *     middle-click or copy it, and there is nowhere to put rel="sponsored" —
 *     so the monetised outbound links were undisclosed to search engines.
 *  2. /disclosure told readers we earn commission on these links while
 *     essentially none of them carried an affiliate tag.
 *
 * Links are now real anchors, and the tag is applied from environment config.
 */

test('retailer links render as crawlable anchors, not buttons', async ({ page }) => {
  await page.goto('articles/nikon_z8', { waitUntil: 'domcontentloaded' });

  const anchors = page.locator('a[href*="amazon."], a[href*="bestbuy."], a[href*="walmart."]');
  await expect(anchors.first()).toBeVisible();

  const count = await anchors.count();
  expect(count).toBeGreaterThan(0);

  for (let i = 0; i < count; i += 1) {
    const rel = (await anchors.nth(i).getAttribute('rel')) ?? '';
    const href = (await anchors.nth(i).getAttribute('href')) ?? '';

    expect(href, 'retailer anchor must have a real href').toMatch(/^https?:\/\//);

    // Outbound commercial links must never pass ranking signal. Which
    // qualifier is correct depends on whether the link actually earns:
    // "sponsored" once a program is configured, "nofollow" until then.
    expect(rel, `retailer link ${href} is missing a rel qualifier`).toMatch(
      /sponsored|nofollow/,
    );
    expect(rel, `retailer link ${href} must not be exploitable via window.opener`).toContain(
      'noopener',
    );
  }
});

test('affiliate tagging is driven by configuration, never invented', () => {
  const url = 'https://www.amazon.com/s?k=nikon+z8';
  const tagged = withAffiliateTag(url);

  if (hasAffiliateProgram()) {
    expect(tagged).not.toEqual(url);
    expect(affiliateRel()).toContain('sponsored');
  } else {
    // With no program configured we must not fabricate a partner ID, and the
    // disclosure must not imply we earn from the link.
    expect(tagged).toEqual(url);
    expect(affiliateRel()).toContain('nofollow');
  }
});

test('a non-retailer URL is never rewritten', () => {
  const url = 'https://example.com/some/page';
  expect(withAffiliateTag(url)).toEqual(url);
});
