import { test, expect, type Locator, type Page } from '@playwright/test';

/**
 * These tests exist because of a real bug: the ranked product card advertises
 * itself as fully clickable (cursor-pointer, hover lift, a stretched link
 * covering the whole card) but large parts of it swallowed the click.
 *
 * This class of bug is invisible to jsdom-based unit tests. jsdom has no
 * layout or paint engine, so it cannot tell that a positioned sibling is
 * painted on top of the stretched link. Only a real browser can.
 */

// Relative (no leading slash) so the same spec works against both the local dev
// server and the /ProductLabR subpath deployment.
const LISTING = 'best/headphones';

/** Clicks the visual centre of a region the way a user would: a raw pixel click.
 *
 * Deliberately avoids locator.click(), which refuses to click when another
 * element would receive the event. That actionability guard is the opposite of
 * what we want here — we specifically want to observe which element wins the
 * click, not to force the event onto the intended target.
 */
async function clickAndGetDestination(page: Page, target: Locator, name: string): Promise<string> {
  // Wait for layout: styles are injected asynchronously, and measuring too
  // early yields a 0x0 box that has nothing to do with the bug under test.
  await target.waitFor({ state: 'visible' });

  // Centre the region vertically so the sticky header cannot swallow the click.
  await target.evaluate((el) => el.scrollIntoView({ block: 'center', behavior: 'instant' }));

  const box = await target.boundingBox();
  if (!box) throw new Error(`region "${name}" has no bounding box (zero-size or hidden)`);

  await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
  await page.waitForURL(/\/articles\//, { timeout: 3000 }).catch(() => undefined);
  return new URL(page.url()).pathname;
}

test.describe('RankedProductCard click target', () => {
  test('the whole card surface navigates to the review', async ({ page }) => {
    await page.goto(LISTING);

    const card = page.getByTestId('ranked-card').first();
    await expect(card).toBeVisible();

    // Regions a user would reasonably click, and would expect to work given
    // the card renders with cursor:pointer across its entire surface.
    const regionNames = [
      'product image',
      'product title',
      'summary text',
      'score badge',
      'read review CTA',
      'spec strip',
    ] as const;

    const locatorFor = (c: Locator, name: (typeof regionNames)[number]): Locator => {
      switch (name) {
        case 'product image':
          return c.getByTestId('ranked-card-media');
        case 'product title':
          return c.getByRole('heading').first();
        case 'summary text':
          return c.getByTestId('ranked-card-summary');
        case 'score badge':
          return c.getByTestId('ranked-card-score');
        case 'read review CTA':
          return c.getByTestId('ranked-card-cta');
        case 'spec strip':
          return c.getByTestId('ranked-card-specs');
      }
    };

    const failures: string[] = [];

    for (const name of regionNames) {
      await page.goto(LISTING);
      const freshCard = page.getByTestId('ranked-card').first();
      const locator = locatorFor(freshCard, name);

      if ((await locator.count()) === 0) continue;

      const destination = await clickAndGetDestination(page, locator, name);
      if (!destination.includes('/articles/')) {
        failures.push(`${name} -> stayed on ${destination}`);
      }
    }

    expect(failures, `Dead click regions on the card:\n  ${failures.join('\n  ')}`).toEqual([]);
  });

  test('the card exposes exactly one accessible link to the review', async ({ page }) => {
    await page.goto(LISTING);

    const card = page.getByTestId('ranked-card').first();
    const links = card.getByRole('link');

    // Duplicated links inside one card are an a11y problem: screen reader users
    // hear the same destination announced repeatedly while tabbing.
    await expect(links).toHaveCount(1);
    await expect(links.first()).toHaveAttribute('href', /\/articles\//);
  });

  test('the card is reachable and activatable by keyboard', async ({ page }) => {
    await page.goto(LISTING);

    const cardLink = page.getByTestId('ranked-card').first().getByRole('link').first();
    await cardLink.focus();
    await expect(cardLink).toBeFocused();

    await page.keyboard.press('Enter');
    await page.waitForURL(/\/articles\//, { timeout: 5000 });
    expect(new URL(page.url()).pathname).toContain('/articles/');
  });
});
