import { test, expect } from '@playwright/test';

test('where-to-buy links share one style and carry affiliate rel and disclosure', async ({
  page,
}) => {
  await page.goto('articles/ecoflow_delta_pro', { waitUntil: 'domcontentloaded' });
  const section = page.locator('#where-to-buy');
  const links = section.locator('a[target="_blank"]');
  const count = await links.count();
  expect(count).toBeGreaterThan(1);

  const classes = new Set<string>();
  for (let i = 0; i < count; i += 1) {
    const link = links.nth(i);
    classes.add((await link.getAttribute('class')) ?? '');
    await expect(link).toHaveAttribute('rel', /sponsored|nofollow/);
    await expect(link).toContainText('Check price');
    expect((await link.boundingBox())!.height).toBeGreaterThanOrEqual(44);
  }
  expect(classes.size).toBe(1);
  await expect(section).not.toContainText('$');
  await expect(section.getByRole('link', { name: 'How we make money' })).toBeVisible();
});
