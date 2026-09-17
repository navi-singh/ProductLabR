import { test, expect } from '@playwright/test';

/**
 * The article hero is sized by aspect ratio, so its height is a function of
 * column width. Unconstrained, 16:9 at full width rendered ~680px tall on a
 * laptop and pushed the rating and verdict off screen — a reader saw a product
 * photo and nothing else. These guard the height cap that keeps the verdict
 * reachable without a scroll.
 */

const HERO_CAP_PX = 360;
// The wrapper sits inside a 1px border, and layout rounds to fractional pixels.
const TOLERANCE_PX = 4;

const ARTICLES = [
  'articles/anker_solix_f3800', // square source, the worst case for a tall box
  'articles/bluetti_ac180', // already 16:9, should be unaffected by the cap
];

for (const path of ARTICLES) {
  test(`the hero image on /${path} stays within its height cap`, async ({ page }) => {
    await page.goto(path, { waitUntil: 'domcontentloaded' });

    const title = (await page.locator('h1').first().innerText()).trim();
    const hero = page.getByAltText(title, { exact: true }).first();
    await expect(hero).toBeVisible();

    const box = await hero.boundingBox();
    expect(box, 'hero image has no layout box').not.toBeNull();

    expect(
      box!.height,
      `Hero rendered ${Math.round(box!.height)}px tall, above the ${HERO_CAP_PX}px cap. ` +
        'An uncapped aspect-ratio box grows with column width and buries the verdict.',
    ).toBeLessThanOrEqual(HERO_CAP_PX + TOLERANCE_PX);
  });
}

test('the imagery block ends inside the first screen on a laptop', async ({ page }) => {
  test.skip(
    !process.env.E2E_PROD,
    'The dev server renders an ad placeholder above the hero that production ' +
      'does not, which pushes the imagery ~95px lower (930px in dev vs under ' +
      '900 shipped). Only the built site reflects what a reader sees: ' +
      'npm run test:e2e:prod',
  );

  // A common laptop, and the case that prompted this: at 1440x900 the uncapped
  // hero ran to y=1270 and pushed the written review entirely off screen.
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(ARTICLES[0], { waitUntil: 'domcontentloaded' });

  const title = (await page.locator('h1').first().innerText()).trim();
  const hero = page.getByAltText(title, { exact: true }).first();
  await expect(hero).toBeVisible();

  // Where the imagery stops is what the caps control, and unlike a verdict or
  // score block it exists on every review regardless of how complete the copy is.
  const boxes = [await hero.boundingBox()];
  const thumbs = page.getByAltText(/additional angle \d+$/);
  for (let i = 0; i < (await thumbs.count()); i += 1) {
    boxes.push(await thumbs.nth(i).boundingBox());
  }

  const bottom = Math.max(...boxes.filter(Boolean).map((b) => b!.y + b!.height));

  expect(
    bottom,
    `Product imagery runs to ${Math.round(bottom)}px, past the 900px fold. ` +
      'Nothing of the review itself is visible without scrolling.',
  ).toBeLessThan(900);
});

test('gallery thumbnails stay subordinate to the hero', async ({ page }) => {
  await page.goto(ARTICLES[0], { waitUntil: 'domcontentloaded' });

  const thumbs = page.getByAltText(/additional angle \d+$/);
  const count = await thumbs.count();
  test.skip(count === 0, 'this article renders no gallery strip');

  for (let i = 0; i < count; i += 1) {
    const box = await thumbs.nth(i).boundingBox();
    if (!box) continue;

    expect(
      box.height,
      `Gallery thumbnail ${i + 1} rendered ${Math.round(box.height)}px tall. ` +
        'Square thumbnails at column width consume as much fold as the hero itself.',
    ).toBeLessThanOrEqual(140 + TOLERANCE_PX);
  }
});
