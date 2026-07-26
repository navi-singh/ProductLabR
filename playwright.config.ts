import { defineConfig, devices } from '@playwright/test';

const PORT = 3100;
const DEV_URL = `http://127.0.0.1:${PORT}/`;

/**
 * Set E2E_PROD=1 to run the suite against the deployed GitHub Pages site
 * instead of a local dev server.
 *
 * This matters: the deployed site is served from a /ProductLabR subpath, and
 * some classes of bug (a missing basePath on asset URLs) exist ONLY there. A
 * local dev run has no basePath and is structurally blind to them.
 */
const PROD = !!process.env.E2E_PROD;
const PROD_URL = process.env.E2E_PROD_URL ?? 'https://navi-singh.github.io/ProductLabR/';

// Trailing slash is required, and specs use relative paths, so the same spec
// works against both a bare origin and a subpath deployment.
const BASE_URL = PROD ? PROD_URL : DEV_URL;

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : [['list']],

  use: {
    baseURL: BASE_URL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', use: { ...devices['Pixel 7'] } },
  ],

  webServer: PROD
    ? undefined
    : {
        command: `npx next dev --port ${PORT}`,
        url: DEV_URL,
        reuseExistingServer: !process.env.CI,
        timeout: 180_000,
      },
});
