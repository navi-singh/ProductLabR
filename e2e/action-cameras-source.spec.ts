import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import BestPage from '../app/best/page';
import CamerasPage from '../app/best/cameras/page';
import ReviewsPage from '../app/reviews/page';
import { generateStaticParams as articleParams } from '../app/articles/[slug]/page';
import { generateStaticParams as genericGuideParams } from '../app/best/[category]/page';
import sitemap from '../app/sitemap';
import { ReviewsExplorer } from '../components/ReviewsExplorer';
import { getCategoryDisplayName, getPostBySlug, getPostsByCategory } from '../lib/Posts';
import { articleScore, calculateOverallScore } from '../lib/articleUtils';
import { NAV_CATEGORIES } from '../lib/nav-categories';
import { categoryHref, getCategoryBySlug } from '../lib/taxonomy';
import { canonicalUrl } from '../lib/site-url';
import manifest from '../data/product-images.json';
import imageExceptions from '../data/image-exceptions.json';
import { IMAGE_POLICY, collectReviewImages } from '../scripts/images/lib/image-policy';

const slugs = [
  'dji_osmo_action_4',
  'dji_osmo_action_5_pro',
  'dji_osmo_action_6',
  'gopro_hero12_black',
  'gopro_hero13_black',
  'gopro_hero_2024',
  'gopro_lit_hero',
  'gopro_mission_1',
  'gopro_mission_1_pro',
  'gopro_mission_1_pro_ils',
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

test('action cameras are a discoverable category served by the generic guide route', async () => {
  expect(getCategoryBySlug('action-cameras')?.contentDir).toBe('action-cameras');
  expect(getCategoryDisplayName('action-cameras')).toBe('Action Cameras');
  const href = categoryHref('action-cameras');
  expect(NAV_CATEGORIES.some((category) => category.href === href)).toBe(true);
  expect(nodes(BestPage()).some((node) => node.props.href === href)).toBe(true);
  expect(nodes(CamerasPage()).some((node) => node.props.href === href)).toBe(true);
  expect(await genericGuideParams()).toContainEqual({ category: 'action-cameras' });

  const explorer = nodes(ReviewsPage()).find((node) => node.type === ReviewsExplorer);
  const archive = explorer?.props.reviews as { slug: string; categorySlug: string }[];
  expect(
    archive
      .filter((entry) => entry.categorySlug === 'action-cameras')
      .map((entry) => entry.slug)
      .sort(),
  ).toEqual(slugs);

  const articleRoutes = (await articleParams()).map((entry) => entry.slug);
  const urls = sitemap().map((entry) => entry.url);
  expect(urls).toContain(canonicalUrl(href));
  for (const slug of [...slugs, 'dji_osmo_pocket_3']) {
    expect(articleRoutes).toContain(slug);
    expect(urls).toContain(canonicalUrl(`/articles/${slug}`));
  }
  expect(getPostBySlug('dji_osmo_pocket_3')?.metadata.category).toBe('cameras');
});

test('every action-camera review uses a six-metric scoring contract', () => {
  const posts = getPostsByCategory('action-cameras');
  expect(posts.map((post) => post.slug).sort()).toEqual(slugs);
  for (const post of posts) {
    expect(post.author).toBe('Verdict Hound Team');
    expect(post.evidenceLevel).toBe('independent-source-synthesis');
    const metricNames = post.ratingBreakdown!.metrics.map((metric) => metric.name);
    expect(metricNames).toHaveLength(6);
    expect(metricNames[0]).toMatch(/^Image Quality/);
    expect(metricNames[5]).toMatch(/^Value/);
    expect(
      post.ratingBreakdown!.metrics.every((metric) => metric.score >= 0 && metric.score <= 10),
    ).toBe(true);
    expect(articleScore(post)).toBeCloseTo(calculateOverallScore(post.ratingBreakdown));
    expect(post.evidenceSources?.some((source) => source.type === 'manufacturer')).toBe(true);
    expect(post.evidenceSources?.some((source) => source.type?.startsWith('independent'))).toBe(
      true,
    );
    for (const source of post.evidenceSources ?? [])
      expect(new URL(source.url).protocol).toBe('https:');
  }
});

test('action-camera images are licensed, processed, or explicitly excepted', async () => {
  const images = manifest.images.filter((entry) => entry.category === 'action-cameras');
  expect(images.length).toBeGreaterThan(0);
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
    expect(getPostBySlug(entry.slug)!.metadata.imageCredit).toBe(entry.credit);
  }
  const exceptions = imageExceptions.reviews as Record<string, { reason: string }>;
  for (const slug of slugs) {
    const article = getPostBySlug(slug)!;
    if (collectReviewImages(article.metadata, article.content).length < IMAGE_POLICY.minPerReview) {
      expect(exceptions[slug]?.reason.length).toBeGreaterThan(30);
    }
  }
});
