import { defineConfig } from '@playwright/test';

process.env.NEXT_PUBLIC_SITE_URL = 'https://navi-singh.github.io/ProductLabR';
process.env.__NEXT_ROUTER_BASEPATH = '/ProductLabR';

export default defineConfig({
  testDir: './e2e',
  testMatch: ['brand-source.spec.ts', 'editorial-claims.spec.ts', 'url-canonicalization.spec.ts'],
  reporter: 'list',
});
