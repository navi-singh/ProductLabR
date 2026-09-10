import { test, expect } from '@playwright/test';

/**
 * Every listing rendered its score through `/ 10` while its local averageScore
 * helper already returned a 0-10 mean, so all 149 reviews displayed as "0.9 /
 * 10". Because the wrong value was identically wrong everywhere, the "highest
 * rated" sort also looked broken: correctly ordered rows all showed 0.9.
 *
 * The helper is shared now. These assert the rendered number, since that is
 * the thing that was wrong and a unit test on the helper would not have
 * noticed the consumers disagreeing with it about scale.
 */

const SCORE = /(\d+\.\d)\s*\/\s*10/;

async function scoresOn(page: import('@playwright/test').Page, url: string) {
  await page.goto(url);
  // The explorer renders client-side, so wait for the first score to appear
  // rather than racing hydration.
  await page.locator('text=/\\d+\\.\\d \\/ 10/').first().waitFor();
  const text = await page.locator('body').innerText();
  return [...text.matchAll(/(\d+\.\d)\s*\/\s*10/g)].map((m) => Number(m[1]));
}

test.describe('score display', () => {
  test('listing scores are on the published 0-10 scale', async ({ page }) => {
    const scores = await scoresOn(page, '/reviews');
    expect(scores.length).toBeGreaterThan(5);

    // The rubric floor means nothing publishable lands below 5, and the bug
    // produced values under 1.0 across the board.
    const offScale = scores.filter((s) => s < 5 || s > 10);
    expect(offScale, 'scores outside 5.0-10.0 indicate a scale mismatch').toEqual([]);
  });

  test('the listing score matches the article it links to', async ({ page }) => {
    await page.goto('/reviews');
    const card = page.locator('a', { hasText: SCORE }).first();
    const listed = Number((await card.innerText()).match(SCORE)![1]);

    await card.click();
    await page.waitForLoadState('domcontentloaded');
    const overall = await page.getByText('Overall Score').locator('..').innerText();
    const shown = Number(overall.match(/(\d+\.\d)/)![1]);

    expect(shown, 'a review must not advertise two different scores').toBeCloseTo(listed, 1);
  });

  test('the highest-rated sort is visibly ordered', async ({ page }) => {
    const scores = await scoresOn(page, '/reviews');
    const sorted = [...scores].sort((a, b) => b - a);
    expect(scores.slice(0, 10)).toEqual(sorted.slice(0, 10));
  });
});
