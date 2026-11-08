import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import ArticlePage, { generateMetadata, generateStaticParams } from '../app/articles/[slug]/page';
import AboutPage, { metadata as aboutMetadata } from '../app/about/page';
import { metadata as monitorMetadata } from '../app/best/monitors/page';
import sitemap from '../app/sitemap';
import { AuthorBio } from '../components/article/AuthorBio';
import { Footer } from '../components/Footer';
import { getAllPostSlugs, getPostBySlug } from '../lib/Posts';
import { getArticleRedirect } from '../lib/redirects';
import { rootMetadata } from '../lib/site-metadata';
import { SITE_URL } from '../lib/site-url';
import routeBaseline from './fixtures/pre-rebrand-routes.json';

const root = path.join(__dirname, '..');
const read = (file: string) => fs.readFileSync(path.join(root, file), 'utf8');

interface SourceNode {
  type: unknown;
  props: {
    children?: unknown;
    dangerouslySetInnerHTML?: { __html: string };
    [key: string]: unknown;
  };
}

function findNode(
  value: unknown,
  predicate: (node: SourceNode) => boolean,
): SourceNode | undefined {
  if (Array.isArray(value)) {
    for (const child of value) {
      const found = findNode(child, predicate);
      if (found) return found;
    }
    return undefined;
  }
  if (!value || typeof value !== 'object' || !('props' in value)) return undefined;
  const node = value as SourceNode;
  return predicate(node) ? node : findNode(node.props.children, predicate);
}

function textContent(value: unknown): string {
  if (Array.isArray(value)) return value.map(textContent).join('');
  if (typeof value === 'string' || typeof value === 'number') return String(value);
  if (!value || typeof value !== 'object' || !('props' in value)) return '';
  return textContent((value as SourceNode).props.children);
}

function reviewSchema(page: unknown) {
  const script = findNode(
    page,
    (node) => node.type === 'script' && node.props.type === 'application/ld+json',
  );
  expect(script?.props.dangerouslySetInnerHTML?.__html).toBeTruthy();
  return JSON.parse(script!.props.dangerouslySetInnerHTML!.__html);
}

test('publication identity reaches navigation, page copy, metadata and consent copy', () => {
  const header = read('components/Header.tsx');
  const layout = read('app/layout.tsx');
  const consent = read('components/CookieConsent.tsx');
  const about = textContent(AboutPage());
  const footer = textContent(Footer());
  expect(header).toContain('aria-label="Verdict Hound home"');
  expect(header).toContain('VERDICT HOUND');
  expect(layout).toContain('export const metadata: Metadata = rootMetadata;');
  expect(rootMetadata.title.template).toBe('%s | Verdict Hound');
  expect(aboutMetadata.title).toBe('About');
  expect(monitorMetadata.title).toBe('Best Monitors 2025 - Expert Reviews & Buying Guide');
  expect(about).toContain('About Verdict Hound');
  expect(footer).toContain('VERDICT HOUND');
  expect(footer).toContain('Verdict Hound. All rights reserved.');
  expect(consent).toContain('Verdict Hound uses Google Analytics');
  expect(rootMetadata.openGraph.siteName).toBe('Verdict Hound');
  expect(rootMetadata.publisher).toBe('Verdict Hound');
  expect(rootMetadata.openGraph.images[0].url).toBe(`${SITE_URL}/og-default.png`);
  expect(rootMetadata.twitter).not.toHaveProperty('creator');
  expect(consent).toContain("'productlab-cookie-consent'");
  expect(layout).toContain("'productlab-cookie-consent'");
});

test('review metadata contract and structured data preserve team and named authors', async () => {
  const slug = 'anker_solix_c1000';
  const metadata = await generateMetadata({ params: Promise.resolve({ slug }) });
  const page = await ArticlePage({ params: Promise.resolve({ slug }) });
  const review = reviewSchema(page);

  expect(metadata.title).toBe(`${getPostBySlug(slug)?.metadata.title} Review`);
  expect(metadata.openGraph?.title).toContain('Review | Verdict Hound');
  expect(metadata.openGraph?.siteName).toBe('Verdict Hound');
  expect(metadata.twitter?.title).toContain('Review | Verdict Hound');
  const teamMetadata = { ...rootMetadata, ...metadata };
  expect(teamMetadata.authors).toEqual([{ name: 'Verdict Hound Team' }]);
  expect(teamMetadata.publisher).toBe('Verdict Hound');
  expect(teamMetadata.openGraph).toEqual(metadata.openGraph);
  expect(review.publisher).toMatchObject({
    '@type': 'Organization',
    name: 'Verdict Hound',
    url: SITE_URL,
  });
  expect(review.author).toEqual({ '@type': 'Organization', name: 'Verdict Hound Team' });
  expect(review.url).toBe(`${SITE_URL}/articles/${slug}/`);
  expect(read('components/article/ScoreCard.tsx')).toContain('Verdict Hound Rating');
  expect(findNode(page, (node) => node.type === AuthorBio)?.props.authorName).toBe(
    'Verdict Hound Team',
  );

  const namedSlug = 'anso_aros_knife';
  const namedMetadata = await generateMetadata({ params: Promise.resolve({ slug: namedSlug }) });
  const namedMerged = { ...rootMetadata, ...namedMetadata };
  expect(namedMerged.authors).toEqual([{ name: 'Anthony Sculimbrene' }]);
  expect(namedMerged.publisher).toBe('Verdict Hound');
  const named = await ArticlePage({ params: Promise.resolve({ slug: namedSlug }) });
  expect(reviewSchema(named).author).toEqual({ '@type': 'Person', name: 'Anthony Sculimbrene' });
  expect(textContent(AuthorBio({ authorBio: 'Editorial team' }))).toContain('VH');
});

test('review attribution is rebranded without changing the independent byline', () => {
  const slugs = getAllPostSlugs();
  let teamCount = 0;
  for (const slug of slugs) {
    const metadata = getPostBySlug(slug)?.metadata;
    expect(metadata, slug).toBeTruthy();
    expect(metadata?.author ?? '', slug).not.toMatch(/product[\s_-]*lab(?:r)?/i);
    expect(metadata?.authorBio ?? '', slug).not.toMatch(/product[\s_-]*lab(?:r)?/i);
    if (metadata?.author === 'Verdict Hound Team') {
      teamCount++;
    }
  }
  expect(teamCount).toBeGreaterThan(0);
  expect(getPostBySlug('anso_aros_knife')?.metadata.author).toBe('Anthony Sculimbrene');
});

test('representative team biographies avoid claims about review methodology', async () => {
  for (const slug of ['tcl_s5_2024', 'ecoflow_delta_3']) {
    const metadata = getPostBySlug(slug)?.metadata;
    const page = await ArticlePage({ params: Promise.resolve({ slug }) });
    expect(metadata?.authorBio).toBe(
      'The Verdict Hound editorial team covers consumer products and buying guides.',
    );
    expect(findNode(page, (node) => node.type === AuthorBio)?.props.authorBio).toBe(
      metadata?.authorBio,
    );
  }
});

test('review biographies retain supported distinctions between sources and evidence', async () => {
  const examples = [
    {
      slug: 'ecoflow_delta_3_1000_air',
      bio: [
        "EcoFlow's specifications",
        'The Solar Lab',
        'does not claim hands-on testing it did not perform',
      ],
      body: ['The Solar Lab reported 88% overall efficiency'],
    },
    {
      slug: 'pecron_e300lfp',
      bio: ['official product and storefront metadata', 'independent discovery review'],
      body: [
        "official Pecron storefront's product metadata",
        'The discovery review measured about 12W',
      ],
    },
    {
      slug: 'bluetti_ac500',
      bio: ["BLUETTI's documented specifications", 'runtime estimates'],
      body: ['Those are planning estimates, not lab results'],
    },
    {
      slug: 'pecron_e3600lfp_bundle',
      bio: ['official product documentation', 'storefront pricing'],
      body: ['official Pecron storefront'],
    },
    {
      slug: 'airpods_5',
      bio: [
        "Apple's product and buying information",
        'unavailable in the reviewed sources at publication',
      ],
      body: ['Independent measurements were not available in the reviewed sources at publication'],
    },
    {
      slug: 'anker_solix_s2000',
      bio: ['internal test results as manufacturer claims, not independent measurements'],
      body: ['not an independent laboratory result'],
    },
    {
      slug: 'samsung_s95h_oled',
      bio: ["Samsung's product information", 'testing reported by RTINGS'],
      body: ['RTINGS tested the 77-inch version'],
    },
  ];

  for (const { slug, bio, body } of examples) {
    const post = getPostBySlug(slug);
    expect(post, slug).toBeTruthy();
    for (const detail of bio) expect(post?.metadata.authorBio, slug).toContain(detail);
    for (const detail of body) expect(post?.content, slug).toContain(detail);
    const page = await ArticlePage({ params: Promise.resolve({ slug }) });
    expect(findNode(page, (node) => node.type === AuthorBio)?.props.authorBio).toBe(
      post?.metadata.authorBio,
    );
  }
});

test('the sitemap and static article params retain pre-rebrand routes and redirects', async () => {
  const urls = sitemap().map((entry) => entry.url);
  const urlSet = new Set(urls);
  const staticSlugs = new Set((await generateStaticParams()).map(({ slug }) => slug));
  expect(SITE_URL).toBe(
    (process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000').replace(/\/$/, ''),
  );
  expect(routeBaseline.sitemapPaths).toHaveLength(245);
  expect(urlSet.size).toBe(urls.length);
  for (const route of routeBaseline.sitemapPaths) {
    expect(urlSet.has(`${SITE_URL}${route}`), route).toBe(true);
    if (route.startsWith('/articles/')) {
      expect(staticSlugs.has(route.slice('/articles/'.length, -1)), route).toBe(true);
    }
  }
  expect(Object.keys(routeBaseline.retiredArticleRedirects)).toHaveLength(7);
  for (const [slug, target] of Object.entries(routeBaseline.retiredArticleRedirects)) {
    expect(staticSlugs.has(slug), slug).toBe(true);
    expect(getArticleRedirect(slug), slug).toBe(target);
    expect(urlSet.has(`${SITE_URL}/articles/${target}/`), target).toBe(true);
  }
});

test('installed-app and social assets use the new identity and expected dimensions', async () => {
  const manifest = JSON.parse(read('public/site.webmanifest'));
  expect(manifest.name).toBe('Verdict Hound');
  expect(manifest.short_name).toBe('Verdict Hound');
  expect(read('public/images/brand-mark.svg')).toContain('>VH</text>');
  expect(read('public/og-default.svg')).toContain('>Verdict Hound</text>');

  for (const [file, width, height] of [
    ['public/images/logo.png', 512, 512],
    ['public/apple-touch-icon.png', 180, 180],
    ['public/og-default.png', 1200, 630],
  ] as const) {
    const image = await sharp(path.join(root, file)).metadata();
    expect([image.width, image.height], file).toEqual([width, height]);
  }

  const favicon = fs.readFileSync(path.join(root, 'app/favicon.ico'));
  expect(favicon.readUInt16LE(2)).toBe(1);
  expect(favicon.readUInt16LE(4)).toBe(4);
  for (const [index, size] of [16, 32, 48, 256].entries()) {
    const entry = 6 + index * 16;
    const length = favicon.readUInt32LE(entry + 8);
    const offset = favicon.readUInt32LE(entry + 12);
    const image = await sharp(favicon.subarray(offset, offset + length)).metadata();
    expect([image.width, image.height]).toEqual([size, size]);
  }
});
