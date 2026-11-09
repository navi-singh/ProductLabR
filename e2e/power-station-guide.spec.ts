import { expect, test } from '@playwright/test';
import {
  getQuickPicks,
  parseStationAcOutputW,
  type PowerStationEntry,
} from '../lib/power-station-data';

test('prefers the continuous inverter rating over a per-outlet wattage', () => {
  expect(
    parseStationAcOutputW({
      'AC Output': '4 x 1,800W 120V outlets, 1 x 3,600W 30A outlet',
      'Inverter Power': '3,600W continuous (7,200W surge)',
    }),
  ).toBe(3600);
  expect(
    parseStationAcOutputW({
      'AC Output': '3 x 120V outlets',
      'Inverter Power': '1,800W (Surge 2,400W)',
    }),
  ).toBe(1800);
  expect(parseStationAcOutputW({ 'AC Output': '300W (3 outlets)' })).toBe(300);
  expect(parseStationAcOutputW({ 'AC Output': '3 x 120V outlets' })).toBeUndefined();
});

test('budget and value picks exclude reviews without a listed price', () => {
  const station = (slug: string, score: number, priceNum: number): PowerStationEntry => ({
    slug,
    title: slug,
    subtitle: '',
    date: '',
    price: priceNum ? `$${priceNum}` : '',
    priceNum,
    capacityWh: 1000,
    features: [],
    score,
    specs: {},
    pros: [],
    cons: [],
    retailerLinks: {},
  });
  const picks = getQuickPicks([
    station('unpriced', 9, 0),
    station('value', 8, 129),
    station('budget', 7, 99),
  ]);
  expect(picks.find((pick) => pick.label === 'Best Overall')?.name).toBe('unpriced');
  expect(picks.find((pick) => pick.label === 'Best Value')?.name).toBe('value');
  expect(picks.find((pick) => pick.label === 'Budget Pick')?.name).toBe('budget');
  expect(getQuickPicks([station('unpriced', 9, 0)]).map((pick) => pick.label)).toEqual([
    'Best Overall',
  ]);
});

test('runtime estimator applies the selected load and rejects invalid input', async ({ page }) => {
  await page.goto('best/power-stations/');

  const calculator = page.locator('#runtime-calculator');
  const input = calculator.getByRole('spinbutton');
  const cpap = calculator.getByRole('button', { name: /CPAP \(no heated humidifier\)/ });
  await expect(cpap).toBeEnabled();
  await cpap.click();
  await expect(cpap).toHaveAttribute('aria-pressed', 'true');
  await expect(input).toHaveValue('40');

  await input.fill('750');
  await expect(cpap).toHaveAttribute('aria-pressed', 'false');
  await expect(calculator.getByLabel('Your load (watts)')).toHaveValue('750');
  const results = calculator.locator('li');
  await expect(results.first()).toBeVisible();
  for (const text of await results.allTextContents()) {
    const match = text.match(
      /About\s+([\d.]+)\s+(hours|minutes)\s*·\s*([\d,]+)Wh\s*·\s*([\d,]+)W\s+listed output/,
    );
    expect(match, text).not.toBeNull();
    if (!match) continue;
    const capacityWh = Number(match[3].replace(/,/g, ''));
    const outputW = Number(match[4].replace(/,/g, ''));
    const hours = (capacityWh * 0.85) / 750;
    const expected = hours < 1 ? Math.max(1, Math.round(hours * 60)) : Number(hours.toFixed(1));
    expect(outputW).toBeGreaterThanOrEqual(750);
    expect(match[2]).toBe(hours < 1 ? 'minutes' : 'hours');
    expect(Number(match[1])).toBe(expected);
  }

  for (const value of ['0', '5001']) {
    await input.fill(value);
    await expect(calculator.getByRole('status')).toContainText('between 1W and 5,000W');
    await expect(results).toHaveCount(0);
  }
});

test.describe('without JavaScript', () => {
  test.use({ javaScriptEnabled: false });

  test('server-rendered controls stay disabled before hydration', async ({ page }) => {
    await page.goto('best/power-stations/');

    const calculator = page.locator('#runtime-calculator');
    await expect(calculator).toHaveCount(1);
    await expect(calculator.locator('button').filter({ hasText: 'CPAP' })).toBeDisabled();
    await expect(calculator.locator('input')).toBeDisabled();
    await expect(calculator.locator('li').first()).toHaveCount(1);
  });
});

test('under-$300 guide uses recorded prices and distinct eligible picks', async ({ page }) => {
  await page.goto('best/power-stations/');
  await page.getByRole('link', { name: 'Under $300', exact: true }).click();
  await expect(page).toHaveURL(/\/best\/power-stations\/under-300\/?$/);
  const sitemap = await page.request.get('sitemap.xml');
  expect(sitemap.ok()).toBe(true);
  expect(await sitemap.text()).toContain('/best/power-stations/under-300/');

  const cards = page.getByTestId('ranked-card');
  const count = await cards.count();
  expect(count).toBeGreaterThan(0);
  await expect(
    page.getByRole('heading', { name: `${count} reviews in this price range` }),
  ).toBeVisible();
  for (const card of await cards.all()) {
    const text = await card.innerText();
    expect(text).not.toMatch(/not a power station/i);
    const price = text.match(/Recorded price:\s*[^\n]*?\$([\d,]+(?:\.\d{1,2})?)/);
    expect(price, text).not.toBeNull();
    if (price) expect(Number(price[1].replace(/,/g, ''))).toBeLessThanOrEqual(300);
  }

  const shortlist = page.locator('section').filter({
    has: page.getByRole('heading', { name: 'Start with the right shortlist' }),
  });
  const hrefs = await shortlist
    .locator('a')
    .evaluateAll((links) => links.map((link) => link.getAttribute('href')));
  expect(hrefs.length).toBeGreaterThan(0);
  expect(new Set(hrefs).size).toBe(hrefs.length);
  await expect(shortlist).not.toContainText(/in stock/i);
});

test('home-backup list is capped and includes home-wiring guidance', async ({ page }) => {
  await page.goto('best/power-stations/house-backup-power-stations/');

  const count = await page.getByTestId('ranked-card').count();
  expect(count).toBeGreaterThan(0);
  expect(count).toBeLessThanOrEqual(12);
  await expect(
    page.getByRole('heading', { name: new RegExp(`Top ${count} of \\d+ matching`) }),
  ).toBeVisible();
  await expect(
    page.getByText('Never connect a power station to house wiring', { exact: false }),
  ).toBeVisible();
});

test('FAQ structured data matches the visible questions', async ({ page }) => {
  await page.goto('best/power-stations/');

  const faq = page.locator('#power-station-faq');
  const questions = await faq
    .locator('summary')
    .evaluateAll((summaries) =>
      summaries.map((summary) => summary.childNodes[0]?.textContent?.trim() ?? ''),
    );
  const schemaQuestions = await page.locator('script[type="application/ld+json"]').evaluateAll(
    (scripts) =>
      scripts
        .map(
          (script) =>
            JSON.parse(script.textContent || '{}') as {
              '@type'?: string;
              mainEntity?: { name: string }[];
            },
        )
        .find((schema) => schema['@type'] === 'FAQPage')
        ?.mainEntity?.map((question) => question.name) ?? [],
  );
  expect(questions.length).toBeGreaterThan(0);
  expect(schemaQuestions).toEqual(questions);

  await faq.locator('summary').first().click();
  await expect(faq.locator('details').first()).toHaveAttribute('open', '');
});
