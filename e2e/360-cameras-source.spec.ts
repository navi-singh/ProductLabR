import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import Cameras360Page, { metadata as guideMetadata } from '../app/best/360-cameras/page';
import BestPage from '../app/best/page';
import ReviewsPage from '../app/reviews/page';
import ArticlePage, {
  generateMetadata as articleMetadata,
  generateStaticParams as articleParams,
} from '../app/articles/[slug]/page';
import { generateStaticParams as genericGuideParams } from '../app/best/[category]/page';
import sitemap from '../app/sitemap';
import { QuickPicks } from '../components/QuickPicks';
import { RankedProductCard } from '../components/RankedProductCard';
import { ReviewsExplorer } from '../components/ReviewsExplorer';
import { ProductComparisonTable } from '../components/guides/ProductComparisonTable';
import { getPostsByCategory, getPostBySlug } from '../lib/Posts';
import { articleScore, calculateOverallScore, scoreToStarRating } from '../lib/articleUtils';
import { NAV_CATEGORIES } from '../lib/nav-categories';
import { getCategoryBySlug, categoryHref, isCategoryPublished } from '../lib/taxonomy';
import { canonicalUrl } from '../lib/site-url';
import manifest from '../data/product-images.json';
import imageExceptions from '../data/image-exceptions.json';
import { IMAGE_POLICY, collectReviewImages } from '../scripts/images/lib/image-policy';

const slugs = [
  'dji_osmo_360',
  'dji_osmo_360_ii',
  'insta360_one_rs_1_inch_360',
  'insta360_x3',
  'insta360_x4',
  'insta360_x5',
  'insta360_x6',
];

interface SourceNode {
  type: unknown;
  props: Record<string, unknown> & { children?: unknown };
}

function nodes(value: unknown): SourceNode[] {
  if (Array.isArray(value)) return value.flatMap(nodes);
  if (!value || typeof value !== 'object' || !('props' in value)) return [];
  const node = value as SourceNode;
  return [node, ...nodes(node.props.children)];
}

function text(value: unknown): string {
  if (Array.isArray(value)) return value.map(text).join(' ');
  if (typeof value === 'string' || typeof value === 'number') return String(value);
  if (!value || typeof value !== 'object' || !('props' in value)) return '';
  return text((value as SourceNode).props.children);
}

test.beforeEach(() => {
  test.skip(!isCategoryPublished('360-cameras'), '360 cameras are unpublished');
});

test('the dedicated category reaches shared navigation, catalog, archive and static routes', async () => {
  expect(getCategoryBySlug('360-cameras')?.contentDir).toBe('360-cameras');
  expect(NAV_CATEGORIES.some((category) => category.href === categoryHref('360-cameras'))).toBe(
    true,
  );
  const catalog = nodes(BestPage());
  expect(catalog.some((node) => node.props.href === categoryHref('360-cameras'))).toBe(true);
  const explorer = nodes(ReviewsPage()).find((node) => node.type === ReviewsExplorer);
  const archive = explorer?.props.reviews as { slug: string; categorySlug: string }[];
  expect(
    archive
      .filter((entry) => entry.categorySlug === '360-cameras')
      .map((entry) => entry.slug)
      .sort(),
  ).toEqual(slugs);
  expect(archive.some((entry) => entry.categorySlug === 'cameras')).toBe(
    isCategoryPublished('cameras'),
  );
  const articleRoutes = (await articleParams()).map((entry) => entry.slug);
  expect(slugs.every((slug) => articleRoutes.includes(slug))).toBe(true);
  expect(await genericGuideParams()).not.toContainEqual({ category: '360-cameras' });
  const urls = sitemap().map((entry) => entry.url);
  expect(urls).toContain(canonicalUrl(categoryHref('360-cameras')));
  expect(urls.includes(canonicalUrl(categoryHref('cameras')))).toBe(isCategoryPublished('cameras'));
  for (const slug of slugs) expect(urls).toContain(canonicalUrl(`/articles/${slug}`));
  expect(guideMetadata.alternates?.canonical).toBe(canonicalUrl(categoryHref('360-cameras')));
});

test('all seven reviews share an evidence-based scoring contract and substantive alternatives', () => {
  const posts = getPostsByCategory('360-cameras');
  expect(posts.map((post) => post.slug).sort()).toEqual(slugs);
  const metricNames = posts[0].ratingBreakdown!.metrics.map((metric) => metric.name);
  expect(metricNames).toHaveLength(6);
  for (const post of posts) {
    const article = getPostBySlug(post.slug)!;
    expect(post.author).toBe('Verdict Hound Team');
    expect(post.evidenceLevel).toBe('independent-source-synthesis');
    expect(post.ratingBreakdown!.metrics.map((metric) => metric.name)).toEqual(metricNames);
    expect(
      post.ratingBreakdown!.metrics.every((metric) => metric.score >= 0 && metric.score <= 10),
    ).toBe(true);
    expect(articleScore(post)).toBeCloseTo(calculateOverallScore(post.ratingBreakdown));
    expect(post.evidenceSources?.some((source) => source.type === 'manufacturer')).toBe(true);
    expect(post.evidenceSources?.some((source) => source.type === 'independent review')).toBe(true);
    for (const source of post.evidenceSources ?? [])
      expect(new URL(source.url).protocol).toBe('https:');
    expect(article.content).toMatch(/Verdict Hound has not (?:tested|used|handled)/);
    expect(article.content.match(/^### .+\?/gm)).toHaveLength(8);
    const alternatives = new Set(
      [...article.content.matchAll(/\]\(\/articles\/([a-z0-9_]+)\)/g)]
        .map((match) => match[1])
        .filter((slug) => slug !== post.slug),
    );
    expect(alternatives.size).toBeGreaterThanOrEqual(3);
    expect(post.price).toMatch(/launch/i);
  }
});

test('guide order and displayed scores derive from reviews without invented live inventory', () => {
  const tree = nodes(Cameras360Page());
  const cards = tree.filter((node) => node.type === RankedProductCard);
  const expected = [...getPostsByCategory('360-cameras')].sort(
    (a, b) => articleScore(b)! - articleScore(a)! || a.title.localeCompare(b.title),
  );
  expect(cards).toHaveLength(7);
  cards.forEach((card, index) => {
    expect(card.props.href).toBe(`/articles/${expected[index].slug}`);
    expect(card.props.score).toBeCloseTo(articleScore(expected[index])! / 10);
    expect(card.props.rank).toBe(index + 1);
    expect(card.props.price).toBeUndefined();
  });
  const table = tree.find((node) => node.type === ProductComparisonTable);
  expect((table?.props.rows as { href: string }[]).map((row) => row.href)).toEqual(
    cards.map((card) => card.props.href),
  );
  const quick = tree.find((node) => node.type === QuickPicks)!;
  const quickText = text(
    QuickPicks({ picks: quick.props.picks as Parameters<typeof QuickPicks>[0]['picks'] }),
  );
  expect(
    (quick.props.picks as Parameters<typeof QuickPicks>[0]['picks']).every(
      (pick) => pick.price === undefined,
    ),
  ).toBe(true);
  expect(quickText).toContain('Check local availability');
  expect(quickText).not.toContain('In stock');
  expect(quickText).not.toContain('Street price');
  expect(text(Cameras360Page())).toContain('Verdict Hound has not tested these');
});

test('articles retain source attribution, category return links and honest image-free metadata', async () => {
  for (const slug of slugs) {
    const metadata = await articleMetadata({ params: Promise.resolve({ slug }) });
    expect(metadata.alternates?.canonical).toBe(`/articles/${slug}`);
    const page = nodes(await ArticlePage({ params: Promise.resolve({ slug }) }));
    expect(page.some((node) => node.props.href === categoryHref('360-cameras'))).toBe(true);
    const script = page.find(
      (node) => node.type === 'script' && node.props.type === 'application/ld+json',
    )!;
    const json = JSON.parse((script.props.dangerouslySetInnerHTML as { __html: string }).__html);
    expect(json.author).toEqual({ '@type': 'Organization', name: 'Verdict Hound Team' });
    expect(json.url).toBe(canonicalUrl(`/articles/${slug}`));
    expect(json.reviewRating.ratingValue).toBe(
      scoreToStarRating(articleScore(getPostBySlug(slug)!.metadata)!),
    );
    if (slug.startsWith('dji_') || slug.includes('one_rs')) {
      expect(getPostBySlug(slug)!.metadata.productImage).toBeUndefined();
      expect(json.itemReviewed.image).toBeUndefined();
    }
    const article = getPostBySlug(slug)!;
    const renderedBody = page.find((node) => typeof node.props.content === 'string')?.props.content;
    expect(String(renderedBody).match(/<details class="article-faq-item">/g)).toHaveLength(8);
    if (article.metadata.gallery?.length) {
      expect(renderedBody).toContain('/ProductLabR/images/posts/360-cameras/');
    }
  }
});

test('new images have reusable provenance, valid local files and linked derivative credits', async () => {
  const images = manifest.images.filter((entry) => entry.category === '360-cameras');
  expect(images).toHaveLength(10);
  for (const entry of images) {
    expect(entry.license).toMatch(/^CC BY(?:-SA)? 4\.0$/);
    expect(new URL(entry.sourcePage!).hostname).toBe('commons.wikimedia.org');
    expect(entry.credit).toBeTruthy();
    const file = path.join(
      process.cwd(),
      'public/images/posts',
      entry.category,
      entry.slug,
      `${entry.slug}_${entry.role}.webp`,
    );
    expect(fs.existsSync(file)).toBe(true);
    const image = await sharp(file).metadata();
    expect(image.format).toBe('webp');
    expect(image.width).toBeLessThanOrEqual(IMAGE_POLICY.maxOutputWidth);
    expect(fs.statSync(file).size).toBeLessThanOrEqual(IMAGE_POLICY.targetOutputBytes);
    const article = getPostBySlug(entry.slug)!;
    expect(article.content).toContain(entry.sourcePage);
    expect(article.content).toContain('https://creativecommons.org/licenses/');
    if (entry.role !== 'main') {
      expect(article.content).toContain(
        `/images/posts/360-cameras/${entry.slug}/${entry.slug}_${entry.role}.webp`,
      );
    }
  }
  const exceptions = imageExceptions.reviews as Record<string, { reason: string }>;
  for (const slug of slugs) {
    const article = getPostBySlug(slug)!;
    if (collectReviewImages(article.metadata, article.content).length < IMAGE_POLICY.minPerReview) {
      expect(exceptions[slug]?.reason.length).toBeGreaterThan(30);
    }
  }
});
