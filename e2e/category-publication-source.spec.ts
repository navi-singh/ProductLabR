import { execFileSync } from 'child_process';
import fs from 'fs';
import os from 'os';
import path from 'path';
import ts from 'typescript';
import { expect, test } from '@playwright/test';
import ArticlePage, {
  dynamicParams,
  generateMetadata as generateArticleMetadata,
  generateStaticParams,
} from '../app/articles/[slug]/page';
import CategoryHubPage, {
  generateStaticParams as generateCategoryParams,
} from '../app/best/[category]/page';
import sitemap from '../app/sitemap';
import getPostMetadata from '../components/getPostMetadata';
import { getAllCategories, getAllPostSlugs, getPostBySlug, getPostsByCategory } from '../lib/Posts';
import { createCategoryLayout } from '../lib/category-layout';
import { processMarkdownContent } from '../lib/markdown';
import { NAV_CATEGORIES } from '../lib/nav-categories';
import { getArticleRedirect, getArticleRedirectSlugs } from '../lib/redirects';
import { canonicalUrl } from '../lib/site-url';
import { CATEGORIES, PUBLISHED_CATEGORIES, isCategoryPublished } from '../lib/taxonomy';
import { emptyRouteSlug } from '../data/static-export.json';

const root = path.join(__dirname, '..');

function withTaxonomyConfig(
  settings: Record<string, unknown>,
  check: (taxonomy: typeof import('../lib/taxonomy')) => void,
): void {
  const fixture = fs.mkdtempSync(path.join(os.tmpdir(), 'verdict-taxonomy-'));
  const modulePath = path.join(fixture, 'lib', 'taxonomy.js');
  try {
    fs.mkdirSync(path.join(fixture, 'lib'));
    fs.mkdirSync(path.join(fixture, 'data'));
    fs.writeFileSync(
      path.join(fixture, 'data', 'category-publication.json'),
      JSON.stringify(settings),
    );
    const source = fs.readFileSync(path.join(root, 'lib', 'taxonomy.ts'), 'utf8');
    const { outputText } = ts.transpileModule(source, {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2020,
        esModuleInterop: true,
      },
    });
    fs.writeFileSync(modulePath, outputText);
    check(require(modulePath) as typeof import('../lib/taxonomy'));
  } finally {
    delete require.cache[modulePath];
    fs.rmSync(fixture, { recursive: true, force: true });
  }
}

function reviewSlugs(contentDir: string): string[] {
  const directory = path.join(root, 'posts', contentDir);
  if (!fs.existsSync(directory)) return [];
  return fs
    .readdirSync(directory)
    .filter((name) => name.endsWith('.md'))
    .map((name) => name.slice(0, -3));
}

test('publication settings handle aliases, omitted categories and invalid values', () => {
  withTaxonomyConfig({ 'power-stations': true, headphones: true, cameras: false }, (taxonomy) => {
    expect(taxonomy.isCategoryPublished('power-stations')).toBe(true);
    expect(taxonomy.isCategoryPublished('portable-power-stations')).toBe(true);
    expect(taxonomy.isCategoryPublished('cameras')).toBe(false);
    expect(taxonomy.isCategoryPublished('360-cameras')).toBe(false);
    expect(taxonomy.isCategoryPublished('not-a-category')).toBe(false);
    expect(taxonomy.PUBLISHED_CATEGORIES.map((category) => category.slug)).toEqual([
      'power-stations',
      'headphones',
    ]);
    expect(taxonomy.isPublishedGuidePath('/best/power-stations/off-grid/?ref=nav')).toBe(true);
    expect(taxonomy.isPublishedGuidePath('/best/cameras/hybrid-cameras/#section')).toBe(false);
    expect(taxonomy.isPublishedGuidePath('/reviews/')).toBe(true);
  });
  expect(() => withTaxonomyConfig({ 'not-a-category': true }, () => {})).toThrow(
    'Invalid category publication setting: not-a-category',
  );
  expect(() => withTaxonomyConfig({ headphones: 'true' }, () => {})).toThrow(
    'Invalid category publication setting: headphones',
  );
  withTaxonomyConfig({ 'smart-generators': true }, (taxonomy) => {
    expect(taxonomy.isCategoryPublished('smart-generators')).toBe(true);
    expect(taxonomy.getCategoryByContentDir('smart-generators')?.slug).toBe('smart-generators');
  });
});

test('publication policy controls loaders, navigation, static params and sitemap', async () => {
  const slugs = new Set(getAllPostSlugs());
  const metadataSlugs = new Set(getPostMetadata().map((post) => post.slug));
  const staticSlugs = new Set((await generateStaticParams()).map((entry) => entry.slug));
  const sitemapUrls = new Set(sitemap().map((entry) => entry.url));
  const categories = new Set(getAllCategories());
  const nav = new Set(NAV_CATEGORIES.map((category) => category.href));

  expect(dynamicParams).toBe(false);
  expect(metadataSlugs).toEqual(slugs);
  for (const category of CATEGORIES) {
    const published = isCategoryPublished(category.slug);
    const directory = path.join(root, 'posts', category.contentDir);
    const sourceSlugs = reviewSlugs(category.contentDir);
    const categorySlugs = getPostsByCategory(category.contentDir).map((post) => post.slug);
    const layout = createCategoryLayout(category.slug);

    expect(isCategoryPublished(category.contentDir), category.slug).toBe(published);
    expect(categories.has(category.contentDir), category.slug).toBe(
      published && fs.existsSync(directory),
    );
    expect(nav.has(`/best/${category.slug}`), category.slug).toBe(published);
    expect(sitemapUrls.has(canonicalUrl(`/best/${category.slug}`)), category.slug).toBe(published);
    expect(categorySlugs.sort(), category.slug).toEqual(published ? sourceSlugs.sort() : []);
    if (published) {
      expect(layout({ children: 'visible' })).toBe('visible');
    } else {
      expect(() => layout({ children: 'hidden' })).toThrow('NEXT_HTTP_ERROR_FALLBACK;404');
    }

    for (const slug of sourceSlugs) {
      expect(slugs.has(slug), slug).toBe(published);
      expect(getPostBySlug(slug) !== null, slug).toBe(published);
      expect(staticSlugs.has(slug), slug).toBe(published);
      expect(sitemapUrls.has(canonicalUrl(`/articles/${slug}`)), slug).toBe(published);
    }
  }

  const knownDirectories = new Set(CATEGORIES.map((category) => category.contentDir));
  const otherDirectories = fs
    .readdirSync(path.join(root, 'posts'), { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && !knownDirectories.has(entry.name));
  for (const directory of otherDirectories) {
    expect(isCategoryPublished(directory.name), directory.name).toBe(false);
    expect(categories.has(directory.name), directory.name).toBe(false);
    expect(getPostsByCategory(directory.name), directory.name).toEqual([]);
    for (const slug of reviewSlugs(directory.name)) {
      expect(slugs.has(slug), slug).toBe(false);
      expect(getPostBySlug(slug), slug).toBeNull();
      expect(staticSlugs.has(slug), slug).toBe(false);
      expect(sitemapUrls.has(canonicalUrl(`/articles/${slug}`)), slug).toBe(false);
    }
  }

  for (const slug of getArticleRedirectSlugs()) {
    const target = getArticleRedirect(slug);
    expect(target, slug).toBeTruthy();
    expect(staticSlugs.has(slug), slug).toBe(getPostBySlug(target!) !== null);
    expect(sitemapUrls.has(canonicalUrl(`/articles/${slug}`)), slug).toBe(false);
  }
});

test('smart-generator reviews and the generic hub follow their publication setting', async () => {
  const published = isCategoryPublished('smart-generators');
  const slug = 'ecoflow_smart_generator_4000';
  const params = { category: 'smart-generators' };

  expect((await generateCategoryParams()).some((entry) => entry.category === params.category)).toBe(
    published,
  );
  expect(getPostBySlug(slug) !== null).toBe(published);
  if (published) {
    expect(await CategoryHubPage({ params: Promise.resolve(params) })).toBeTruthy();
  } else {
    await expect(CategoryHubPage({ params: Promise.resolve(params) })).rejects.toThrow(
      'NEXT_HTTP_ERROR_FALLBACK;404',
    );
  }
});

test('empty dynamic routes use an unpublished placeholder that always returns not found', async () => {
  const articleParams = await generateStaticParams();
  const categoryParams = await generateCategoryParams();
  const publicArticles = articleParams.filter((entry) => entry.slug !== emptyRouteSlug);
  const publicCategories = categoryParams.filter((entry) => entry.category !== emptyRouteSlug);

  expect(articleParams.some((entry) => entry.slug === emptyRouteSlug)).toBe(
    publicArticles.length === 0,
  );
  expect(categoryParams.some((entry) => entry.category === emptyRouteSlug)).toBe(
    publicCategories.length === 0,
  );
  await expect(ArticlePage({ params: Promise.resolve({ slug: emptyRouteSlug }) })).rejects.toThrow(
    'NEXT_HTTP_ERROR_FALLBACK;404',
  );
  await expect(
    generateArticleMetadata({ params: Promise.resolve({ slug: emptyRouteSlug }) }),
  ).rejects.toThrow('NEXT_HTTP_ERROR_FALLBACK;404');
  await expect(
    CategoryHubPage({ params: Promise.resolve({ category: emptyRouteSlug }) }),
  ).rejects.toThrow('NEXT_HTTP_ERROR_FALLBACK;404');
});

test('markdown keeps text but removes links to unpublished reviews and guides', () => {
  const publishedCategory = PUBLISHED_CATEGORIES.find(
    (category) => reviewSlugs(category.contentDir).length > 0,
  );
  const hiddenCategory = CATEGORIES.find(
    (category) =>
      !isCategoryPublished(category.slug) && reviewSlugs(category.contentDir).length > 0,
  );
  test.skip(!publishedCategory || !hiddenCategory, 'Requires published and unpublished reviews');
  if (!publishedCategory || !hiddenCategory) return;

  const publishedSlug = reviewSlugs(publishedCategory.contentDir)[0];
  const hiddenSlug = reviewSlugs(hiddenCategory.contentDir)[0];
  const html = processMarkdownContent(
    [
      `[Visible review](/articles/${publishedSlug})`,
      `[Hidden **review**](/articles/${hiddenSlug}/?source=related)`,
      `[Visible guide](/best/${publishedCategory.slug}/)`,
      `[Hidden guide](/best/${hiddenCategory.slug}/details/#section)`,
      '[External source](https://example.com/)',
    ].join('\n\n'),
  );

  expect(html).toContain(`href="/articles/${publishedSlug}"`);
  expect(html).toContain(`href="/best/${publishedCategory.slug}/"`);
  expect(html).toContain('href="https://example.com/"');
  expect(html).not.toContain(`href="/articles/${hiddenSlug}`);
  expect(html).not.toContain(`href="/best/${hiddenCategory.slug}`);
  expect(html).toContain('Hidden <strong class="font-bold">review</strong>');
  expect(html).toContain('Hidden guide');
});

test('postbuild prunes unpublished static exports but leaves server output intact', () => {
  const cases = [
    { output: 'export', headphones: true, cameras: false },
    { output: 'export', headphones: false, cameras: true },
    { output: 'standalone', headphones: false, cameras: false },
  ];

  for (const config of cases) {
    const fixture = fs.mkdtempSync(path.join(os.tmpdir(), 'verdict-export-'));
    try {
      for (const dir of [
        'scripts',
        'data',
        '.next',
        'out/best/headphones',
        'out/best/cameras',
        'out/best/unknown',
        'out/best/_shared',
        `out/best/${emptyRouteSlug}`,
        `out/articles/${emptyRouteSlug}`,
      ]) {
        fs.mkdirSync(path.join(fixture, dir), { recursive: true });
      }
      fs.copyFileSync(
        path.join(root, 'scripts', 'prune-unpublished-categories.js'),
        path.join(fixture, 'scripts', 'prune-unpublished-categories.js'),
      );
      fs.writeFileSync(
        path.join(fixture, 'data', 'category-publication.json'),
        JSON.stringify({ headphones: config.headphones, cameras: config.cameras }),
      );
      fs.copyFileSync(
        path.join(root, 'data', 'static-export.json'),
        path.join(fixture, 'data', 'static-export.json'),
      );
      fs.writeFileSync(
        path.join(fixture, '.next', 'required-server-files.json'),
        JSON.stringify({ config: { output: config.output } }),
      );
      for (const file of [
        'index.html',
        'index.txt',
        'headphones.html',
        'headphones.txt',
        'cameras.html',
        'cameras.txt',
        'unknown.html',
        'unknown.txt',
      ]) {
        fs.writeFileSync(path.join(fixture, 'out/best', file), file);
      }
      for (const directory of ['best', 'articles']) {
        for (const suffix of ['.html', '.txt', '.segments']) {
          fs.writeFileSync(
            path.join(fixture, 'out', directory, `${emptyRouteSlug}${suffix}`),
            suffix,
          );
        }
      }

      execFileSync(process.execPath, [
        path.join(fixture, 'scripts', 'prune-unpublished-categories.js'),
      ]);

      for (const [slug, enabled] of [
        ['headphones', config.headphones],
        ['cameras', config.cameras],
        ['unknown', false],
      ] as const) {
        const kept = config.output !== 'export' || enabled;
        for (const suffix of ['', '.html', '.txt']) {
          expect(fs.existsSync(path.join(fixture, 'out/best', `${slug}${suffix}`))).toBe(kept);
        }
      }
      for (const name of ['index.html', 'index.txt', '_shared']) {
        expect(fs.existsSync(path.join(fixture, 'out/best', name))).toBe(true);
      }
      for (const directory of ['best', 'articles']) {
        for (const suffix of ['', '.html', '.txt', '.segments']) {
          expect(
            fs.existsSync(path.join(fixture, 'out', directory, `${emptyRouteSlug}${suffix}`)),
          ).toBe(config.output !== 'export');
        }
      }
    } finally {
      fs.rmSync(fixture, { recursive: true, force: true });
    }
  }
});
