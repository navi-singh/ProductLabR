import { test, expect } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';

/**
 * The static export writes articles/<slug>.html alongside an articles/<slug>/
 * directory that holds RSC payloads but no index.html, so GitHub Pages returned
 * a hard 404 for every trailing-slash URL. trailingSlash fixes that, but it
 * also splits the URL surface in two: Next normalizes the canonical tag it
 * emits, while raw template strings in sitemaps and JSON-LD keep whatever form
 * they were written in. A page that advertises one form and canonicalizes to
 * another is worse than the original bug.
 */

const ROOT = path.join(__dirname, '..');

test('the export emits directory indexes for trailing-slash URLs', () => {
  const config = fs.readFileSync(path.join(ROOT, 'next.config.mjs'), 'utf8');

  expect(
    /trailingSlash:\s*true/.test(config),
    'next.config.mjs no longer sets trailingSlash: true. Without it the static ' +
      'export emits no index.html inside articles/<slug>/, and GitHub Pages ' +
      'serves a 404 for every URL a reader pastes with a trailing slash.',
  ).toBe(true);
});

test('canonicalUrl emits one trailing-slash form for every path shape', async () => {
  const { canonicalUrl, SITE_URL } = await import('../lib/site-url');

  expect(canonicalUrl(''), 'the site root').toBe(`${SITE_URL}/`);
  expect(canonicalUrl('/about')).toBe(`${SITE_URL}/about/`);
  // Callers pass slugs with and without a leading slash, and a double slash
  // would resolve to a different origin entirely.
  expect(canonicalUrl('about')).toBe(`${SITE_URL}/about/`);
  expect(canonicalUrl('/about/')).toBe(`${SITE_URL}/about/`);
  expect(canonicalUrl('//about')).toBe(`${SITE_URL}/about/`);
});

/**
 * The regression this is really guarding: adding a page whose canonical or
 * sitemap entry is built by hand. Those skip the helper, keep the slashless
 * form, and silently disagree with the canonical tag Next emits.
 */
test('no page builds a canonical URL by hand', () => {
  const offenders: string[] = [];

  const walk = (dir: string) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(full);
      } else if (/\.tsx?$/.test(entry.name)) {
        const source = fs.readFileSync(full, 'utf8');
        // eslint-disable-next-line no-template-curly-in-string
        if (/canonical:\s*`\$\{SITE_URL\}/.test(source)) {
          offenders.push(path.relative(ROOT, full));
        }
      }
    }
  };

  walk(path.join(ROOT, 'app'));

  expect(
    offenders,
    'These build a canonical URL from SITE_URL directly, which produces the ' +
      'slashless form and contradicts the trailing-slash URL the site serves. ' +
      'Use canonicalUrl() from lib/site-url instead:\n  ' +
      offenders.join('\n  '),
  ).toEqual([]);
});
