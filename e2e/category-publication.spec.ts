import { expect, test } from '@playwright/test';
import { getPostsByCategory } from '../lib/Posts';
import { CATEGORIES, isCategoryPublished } from '../lib/taxonomy';
import { emptyRouteSlug } from '../data/static-export.json';

test('category and review routes follow publication settings', async ({ request }) => {
  const routes = [
    { category: 'power-stations', path: 'best/power-stations/' },
    { category: 'action-cameras', path: 'articles/dji_osmo_action_6/' },
    { category: 'cameras', path: 'best/cameras/' },
    { category: 'cameras', path: 'best/cameras/hybrid-cameras/' },
    { category: 'cameras', path: 'articles/dji_osmo_pocket_3/' },
    { category: 'tvs', path: 'best/tvs/best-oled-tvs/' },
    { category: 'smart-generators', path: 'best/smart-generators/' },
    { category: 'smart-generators', path: 'articles/ecoflow_smart_generator_4000/' },
  ];
  for (const route of routes) {
    const response = await request.get(route.path);
    if (!isCategoryPublished(route.category) && response.status() === 200) {
      expect(process.env.E2E_PROD, route.path).toBeFalsy();
      expect(await response.text(), route.path).toContain(
        '<meta name="next-error" content="not-found"',
      );
    } else {
      expect(response.status(), route.path).toBe(isCategoryPublished(route.category) ? 200 : 404);
    }
  }
  for (const path of [`best/${emptyRouteSlug}/`, `articles/${emptyRouteSlug}/`]) {
    const response = await request.get(path);
    if (!process.env.E2E_PROD && response.status() === 200) {
      expect(await response.text(), path).toContain('<meta name="next-error" content="not-found"');
    } else {
      expect(response.status(), path).toBe(404);
    }
  }
});

test('search and the review archive exclude unpublished categories', async ({ page }) => {
  await page.goto('./');
  if (test.info().project.name === 'mobile') {
    await page.getByRole('button', { name: 'Search reviews', exact: true }).click();
  }
  const header = page.locator('header');
  const search = header.locator('input[placeholder="Search reviews..."]:visible');
  await search.fill('DJI Osmo Pocket 3');
  await expect(header.locator('a[href*="/articles/dji_osmo_pocket_3"]')).toHaveCount(
    isCategoryPublished('cameras') ? 1 : 0,
  );
  await search.fill('DJI Osmo Action 6');
  await expect(header.locator('a[href*="/articles/dji_osmo_action_6"]')).toHaveCount(
    isCategoryPublished('action-cameras') ? 1 : 0,
  );

  await page.goto('reviews/');
  for (const category of CATEGORIES) {
    const visible =
      isCategoryPublished(category.slug) && getPostsByCategory(category.contentDir).length > 0;
    await expect(page.getByRole('button', { name: category.shortName, exact: true })).toHaveCount(
      visible ? 1 : 0,
    );
  }
  const archiveSearch = page.getByRole('searchbox', { name: 'Search reviews', exact: true });
  await archiveSearch.fill('DJI Osmo Pocket 3');
  await expect(page.locator('a[href*="/articles/dji_osmo_pocket_3"]')).toHaveCount(
    isCategoryPublished('cameras') ? 1 : 0,
  );
  await archiveSearch.fill('DJI Osmo Action 6');
  await expect(page.locator('a[href*="/articles/dji_osmo_action_6"]')).toHaveCount(
    isCategoryPublished('action-cameras') ? 1 : 0,
  );
});

test('published reviews retain text but not links to unpublished alternatives', async ({
  page,
}) => {
  test.skip(!isCategoryPublished('action-cameras'), 'Action cameras are unpublished');
  await page.goto('articles/dji_osmo_action_4/');
  await expect(page.locator('body')).toContainText('Pocket 3');
  await expect(page.locator('a[href*="/articles/dji_osmo_pocket_3"]')).toHaveCount(
    isCategoryPublished('cameras') ? 1 : 0,
  );
});
