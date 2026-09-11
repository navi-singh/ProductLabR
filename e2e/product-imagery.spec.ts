import { test, expect } from '@playwright/test';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

/**
 * An audit found that 89 of 149 reviews illustrated the product with an image
 * of something else. Two files were each duplicated fifteen times under
 * fifteen product-specific names, so "leica_m11.webp" was byte-for-byte a
 * photo of a Panasonic Lumix, and every Anker/Jackery/EcoFlow power station
 * showed the same unit with a competitor's logo on it. The shared fallback was
 * a screenshot of a different publisher's review page, complete with their
 * rating badge and buy button, and it rendered on 102 articles.
 *
 * A wrong product photo is a factual claim about the product, so these guard
 * the image layer the same way the claim tests guard the prose.
 */

const POSTS_DIR = path.join(process.cwd(), 'posts');
const PUBLIC_DIR = path.join(process.cwd(), 'public');
const IMAGE_KEYS = ['image', 'productImage', 'heroImage'] as const;

type Ref = { article: string; key: string; value: string };

function imageRefs(): Ref[] {
  const refs: Ref[] = [];
  for (const category of fs.readdirSync(POSTS_DIR)) {
    const dir = path.join(POSTS_DIR, category);
    if (!fs.statSync(dir).isDirectory()) continue;
    for (const file of fs.readdirSync(dir).filter((f) => f.endsWith('.md'))) {
      const { data } = matter(fs.readFileSync(path.join(dir, file), 'utf8'));
      for (const key of IMAGE_KEYS) {
        const value = data[key];
        if (typeof value === 'string' && value.trim()) {
          refs.push({ article: `${category}/${file}`, key, value: value.trim() });
        }
      }
    }
  }
  return refs;
}

function productImageFiles(): string[] {
  const root = path.join(PUBLIC_DIR, 'images', 'posts');
  if (!fs.existsSync(root)) return [];
  const out: string[] = [];
  const walk = (dir: string) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else out.push(full);
    }
  };
  walk(root);
  return out;
}

test.describe('product imagery integrity', () => {
  test('every referenced image actually exists on disk', () => {
    const broken = imageRefs()
      .filter((r) => !r.value.startsWith('http'))
      .filter((r) => !fs.existsSync(path.join(PUBLIC_DIR, r.value.replace(/^\//, ''))));

    expect(
      broken.map((r) => `${r.article} ${r.key}=${r.value}`),
      'frontmatter must not point at an image that does not exist',
    ).toEqual([]);
  });

  test('no image file is reused for more than one product', () => {
    const byHash = new Map<string, string[]>();
    for (const file of productImageFiles()) {
      const hash = crypto.createHash('md5').update(fs.readFileSync(file)).digest('hex');
      byHash.set(hash, [...(byHash.get(hash) ?? []), path.relative(PUBLIC_DIR, file)]);
    }
    const duplicated = [...byHash.values()].filter((files) => {
      // Same bytes under one product's folder is fine; across products is not.
      const products = new Set(files.map((f) => f.split(path.sep).slice(0, 4).join('/')));
      return products.size > 1;
    });

    expect(
      duplicated,
      'byte-identical files under different product names misrepresent the product',
    ).toEqual([]);
  });

  test('no two articles share the same image path', () => {
    const byPath = new Map<string, Set<string>>();
    for (const ref of imageRefs()) {
      byPath.set(ref.value, (byPath.get(ref.value) ?? new Set()).add(ref.article));
    }
    const shared = [...byPath.entries()]
      .filter(([, articles]) => articles.size > 1)
      .map(([value, articles]) => `${value} used by ${articles.size} articles`);

    expect(shared, 'a shared image means at least one article shows the wrong product').toEqual([]);
  });

  test('articles do not hotlink images from third-party origins', () => {
    const external = imageRefs()
      .filter((r) => /^https?:\/\//.test(r.value))
      .map((r) => `${r.article} ${r.key}=${r.value}`);

    expect(external, 'hotlinking republishes another origin bandwidth and content').toEqual([]);
  });

  test('no placeholder graphic stands in for a missing product photo', () => {
    const source = fs.readFileSync(
      path.join(process.cwd(), 'components', 'OptimizedImage.tsx'),
      'utf8',
    );

    // A stand-in graphic reads as "here is the product". Reviews without a
    // licensed photo must render no image at all rather than a substitute.
    expect(source).not.toMatch(/FALLBACK_SRC/);

    const roots = ['app', 'components', 'lib', 'posts'];
    const offenders: string[] = [];
    const walk = (dir: string) => {
      for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) walk(full);
        else if (/\.(tsx?|jsx?|md)$/.test(entry.name)) {
          if (fs.readFileSync(full, 'utf8').includes('placeholder-product')) {
            offenders.push(path.relative(process.cwd(), full));
          }
        }
      }
    };
    for (const root of roots) walk(path.join(process.cwd(), root));

    expect(offenders, 'these still substitute a placeholder image').toEqual([]);
  });

  test('images carry source and licence attribution', () => {
    const manifestPath = path.join(process.cwd(), 'data', 'product-images.json');
    const { images } = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

    // `vendored` entries record provenance for files already committed whose
    // original download URL was never captured, so they carry a sourcePage
    // instead of a fetchable sourceUrl.
    const undocumented = images.filter((i: Record<string, unknown>) =>
      i.vendored ? !i.sourcePage || !i.license || !i.credit : !i.sourceUrl || !i.license || !i.credit,
    );

    expect(undocumented, 'every ingested image needs provenance we can defend').toEqual([]);
  });
});
