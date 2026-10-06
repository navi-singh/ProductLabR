import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

/* eslint-disable @typescript-eslint/no-var-requires */
const sharp = require('sharp');
const {
  IMAGE_POLICY,
  collectReviewImages,
  loadImageExceptions,
} = require('../scripts/images/lib/image-policy.js');
const { validateCandidate } = require('../scripts/images/promote-image-candidates.js');
const {
  hostBrand,
  mergeCuration,
  readJsonLdImages,
  readOgImages,
} = require('../scripts/images/discover-product-images.js');
const {
  differenceHash,
  hammingDistance,
  NEAR_DUPLICATE_BITS,
} = require('../scripts/images/ingest-product-images.js');
const { loadCorpus, buildBrandIndex, REPO_ROOT } = require('../scripts/editorial/lib/corpus.js');
const { analyzeCorpus } = require('../scripts/editorial/lib/metrics.js');
const { runGates } = require('../scripts/editorial/lib/gates.js');
/* eslint-enable @typescript-eslint/no-var-requires */

const ROOT = path.join(__dirname, '..');

const validCandidate = {
  kind: 'product',
  alt: 'EcoFlow DELTA Pro rear view showing the cooling fans',
  sourceTier: 'product-page',
  sourceUrl: 'https://cdn.shopify.com/a.jpg',
  sourcePage: 'https://us.ecoflow.com/products/delta-pro',
  sourceName: 'EcoFlow product page',
  license: 'Manufacturer product image',
  credit: 'EcoFlow',
};

test.describe('image policy', () => {
  test('counts unique hero, gallery and inline images', () => {
    const data = {
      productImage: '/a.webp',
      gallery: [{ src: '/a.webp' }, { src: '/b.webp' }, {}],
    };
    const body = 'Text ![Side](/b.webp) more ![Rear](/c.webp "title")';
    expect(collectReviewImages(data, body)).toEqual(['/a.webp', '/b.webp', '/c.webp']);
  });
});

test.describe('promote validation', () => {
  test('accepts a complete candidate', () => {
    expect(validateCandidate(validCandidate, 'EcoFlow DELTA Pro')).toEqual([]);
  });

  test('rejects weak alt text, bad kinds, http sources and missing provenance', () => {
    expect(validateCandidate({ ...validCandidate, alt: 'short' }, 'X')).toContain(
      'alt text missing or too short',
    );
    expect(
      validateCandidate({ ...validCandidate, alt: 'EcoFlow DELTA Pro' }, 'EcoFlow DELTA Pro'),
    ).toContain('alt text only repeats the product name');
    expect(
      validateCandidate({ ...validCandidate, alt: 'Front view (with "quotes")' }, 'X').length,
    ).toBe(1);
    expect(validateCandidate({ ...validCandidate, kind: 'infographic' }, 'X').join()).toMatch(
      /kind/,
    );
    expect(
      validateCandidate({ ...validCandidate, sourceUrl: 'http://x.com/a.jpg' }, 'X'),
    ).toContain('sourceUrl must be https');
    expect(validateCandidate({ ...validCandidate, credit: '' }, 'X')).toContain('missing credit');
  });
});

test.describe('discovery', () => {
  test('re-discovery keeps curation and approved candidates that disappeared', () => {
    const previous = {
      candidates: [
        {
          id: 'a',
          kind: 'product',
          alt: 'kept alt text',
          approved: true,
          promoted: true,
          role: 'main',
        },
        { id: 'b', approved: true },
        { id: 'c', approved: false },
      ],
    };
    const merged = mergeCuration(previous, { candidates: [{ id: 'a', sourceUrl: 'https://new' }] });
    expect(merged.candidates.map((c: { id: string }) => c.id)).toEqual(['a', 'b']);
    expect(merged.candidates[0]).toMatchObject({
      sourceUrl: 'https://new',
      promoted: true,
      role: 'main',
    });
  });

  test('derives a readable brand from the product page host', () => {
    expect(hostBrand('https://ca.ecoflow.com/p', 'EcoFlow RIVER 3')).toBe('EcoFlow');
    expect(hostBrand('https://iallpowers.com/p', 'ALLPOWERS S2000 Pro')).toBe('ALLPOWERS');
    expect(hostBrand('https://www.djiusa.com/p', 'DJI Power 500')).toBe('DJI');
    expect(hostBrand('https://shop.example.co.uk/p', 'Other thing')).toBe('Example');
  });

  test('reads Product JSON-LD and og:image', () => {
    const html = `
      <script type="application/ld+json">{"@graph":[{"@type":"Product","image":["https://x/1.jpg",{"url":"https://x/2.jpg"}]},{"@type":"Organization","image":"https://x/logo.png"}]}</script>
      <meta property="og:image" content="https://x/og.jpg">`;
    expect(readJsonLdImages(html)).toEqual(['https://x/1.jpg', 'https://x/2.jpg']);
    expect(readOgImages(html)).toEqual(['https://x/og.jpg']);
  });
});

test.describe('near-duplicate detection', () => {
  const studioShot = (shape: string) =>
    sharp(
      Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="1600">
      <rect width="1600" height="1600" fill="#ffffff"/>${shape}</svg>`),
    )
      .png()
      .toBuffer();

  test('treats a re-compressed copy as a duplicate', async () => {
    const original = await studioShot(
      '<rect x="600" y="600" width="400" height="300" fill="#333"/><circle cx="700" cy="700" r="40" fill="#0af"/>',
    );
    const copy = await sharp(original).resize(900).jpeg({ quality: 60 }).toBuffer();
    const distance = hammingDistance(await differenceHash(original), await differenceHash(copy));
    expect(distance).toBeLessThanOrEqual(NEAR_DUPLICATE_BITS);
  });

  test('keeps different angles of a small product on a flat background apart', async () => {
    const front = await studioShot(
      '<rect x="650" y="650" width="300" height="300" fill="#333"/><rect x="700" y="700" width="200" height="60" fill="#0af"/>',
    );
    const side = await studioShot(
      '<polygon points="620,700 980,650 980,950 620,900" fill="#555"/><circle cx="900" cy="800" r="50" fill="#111"/>',
    );
    const distance = hammingDistance(await differenceHash(front), await differenceHash(side));
    expect(distance).toBeGreaterThan(NEAR_DUPLICATE_BITS);
  });
});

test.describe('image gate', () => {
  const corpus = loadCorpus(REPO_ROOT);
  const article = analyzeCorpus(corpus, buildBrandIndex(corpus))[0];

  test('flags reviews below the minimum without blocking them', () => {
    const result = runGates({ ...article, images: { count: 1, exception: null } });
    const check = result.checks.find((c: { id: string }) => c.id === 'product_images');
    expect(check.status).toBe('fail');
    expect(result.blocking_failures).not.toContain('product_images');
  });

  test('passes reviews with a recorded exception', () => {
    const result = runGates({
      ...article,
      images: { count: 1, exception: { reason: 'Discontinued' } },
    });
    expect(result.checks.find((c: { id: string }) => c.id === 'product_images').status).toBe(
      'pass',
    );
  });
});

test.describe('backfilled corpus', () => {
  const manifest = JSON.parse(
    fs.readFileSync(path.join(ROOT, 'data', 'product-images.json'), 'utf8'),
  ).images;
  const exceptions = loadImageExceptions();

  test('every portable power station review meets the minimum or is flagged', () => {
    const dir = path.join(ROOT, 'posts', 'portable-power-stations');
    const short = fs
      .readdirSync(dir)
      .filter((file) => file.endsWith('.md'))
      .map((file) => {
        const { data, content } = matter(fs.readFileSync(path.join(dir, file), 'utf8'));
        return {
          slug: file.replace(/\.md$/, ''),
          count: collectReviewImages(data, content).length,
        };
      })
      .filter(({ slug, count }) => count < IMAGE_POLICY.minPerReview && !exceptions[slug]);
    expect(short).toEqual([]);
  });

  test('promoted manifest entries carry provenance and alt text', () => {
    const missing = manifest
      .filter((entry: { sourceTier?: string }) => entry.sourceTier)
      .filter((entry: Record<string, string>) =>
        ['sourceUrl', 'sourcePage', 'sourceName', 'license', 'credit', 'alt'].some(
          (field) => !entry[field],
        ),
      )
      .map((entry: { slug: string; role: string }) => `${entry.slug}/${entry.role}`);
    expect(missing).toEqual([]);
  });

  test('image exceptions point at real reviews', () => {
    const slugs = new Set(
      fs
        .readdirSync(path.join(ROOT, 'posts'), { recursive: true })
        .map(String)
        .filter((file) => file.endsWith('.md'))
        .map((file) => path.basename(file, '.md')),
    );
    expect(Object.keys(exceptions).filter((slug) => !slugs.has(slug))).toEqual([]);
  });
});
