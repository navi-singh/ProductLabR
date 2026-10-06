import { test, expect } from '@playwright/test';

/**
 * Scores are stored 0-10 per metric, aggregated 0-100, and displayed 0-5. A past
 * scale mismatch rendered every review as "0.9 / 10", and the later move to a
 * 5-point display left this guard asserting the old scale. These assert the
 * rendered number, since consumers disagreeing about scale is what breaks.
 */

const SCORE = /(\d+\.\d)\s*\/\s*5\b/;

async function scoresOn(page: import('@playwright/test').Page, url: string) {
  await page.goto(url);
  // The explorer renders client-side, so wait for the first score to appear
  // rather than racing hydration.
  await page.locator('text=/\\d+\\.\\d \\/ 5/').first().waitFor();
  const text = await page.locator('body').innerText();
  return [...text.matchAll(/(\d+\.\d)\s*\/\s*5\b/g)].map((m) => Number(m[1]));
}

test.describe('score display', () => {
  test('listing scores are on the published 0-5 scale', async ({ page }) => {
    const scores = await scoresOn(page, '/reviews');
    expect(scores.length).toBeGreaterThan(5);

    // A scale mismatch shows up as values under 1.0 or above 5.0 across the board.
    const offScale = scores.filter((s) => s < 1 || s > 5);
    expect(offScale, 'scores outside 1.0-5.0 indicate a scale mismatch').toEqual([]);

    const text = await page.locator('body').innerText();
    expect(text, 'no listing may render on the retired 10-point scale').not.toMatch(/\d\.\d\s*\/\s*10\b/);
  });

  test('the listing score matches the article it links to', async ({ page }) => {
    await page.goto('/reviews');
    const card = page.locator('a', { hasText: SCORE }).first();
    const listed = Number((await card.innerText()).match(SCORE)![1]);

    await card.click();
    await page.waitForLoadState('domcontentloaded');
    const overall = await page.getByText('Product Lab Rating').locator('..').innerText();
    const shown = Number(overall.match(/(\d+\.\d)/)![1]);

    expect(shown, 'a review must not advertise two different scores').toBeCloseTo(listed, 1);
  });

  test('the highest-rated sort is visibly ordered', async ({ page }) => {
    const scores = await scoresOn(page, '/reviews');
    const sorted = [...scores].sort((a, b) => b - a);
    expect(scores.slice(0, 10)).toEqual(sorted.slice(0, 10));
  });
});
