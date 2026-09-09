import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

/**
 * /methodology and /disclosure make specific, checkable promises to readers.
 * An audit found several of them were simply untrue — the publish gate was
 * advertised as a floor while 108 of 149 articles missed it, and the affiliate
 * disclosure claimed commission on links that carried no affiliate tag.
 *
 * These tests exist so a published claim cannot silently drift away from the
 * corpus again. They read the markdown directly rather than the rendered site,
 * because the claim is about every article, not the handful a crawl would hit.
 */

const POSTS_DIR = path.join(process.cwd(), 'posts');

type Article = { slug: string; category: string; body: string; data: Record<string, unknown> };

function readCorpus(): Article[] {
  const out: Article[] = [];
  for (const category of fs.readdirSync(POSTS_DIR)) {
    const dir = path.join(POSTS_DIR, category);
    if (!fs.statSync(dir).isDirectory()) continue;
    for (const file of fs.readdirSync(dir).filter((f) => f.endsWith('.md'))) {
      const parsed = matter(fs.readFileSync(path.join(dir, file), 'utf8'));
      out.push({
        slug: file.replace(/\.md$/, ''),
        category,
        body: parsed.content,
        data: parsed.data as Record<string, unknown>,
      });
    }
  }
  return out;
}

const corpus = readCorpus();

test('the corpus is non-empty, so the assertions below are meaningful', () => {
  expect(corpus.length).toBeGreaterThan(100);
});

/**
 * A portable power station cannot be presented as suitable for life-support
 * equipment on our say-so. The template these articles came from asserted
 * tested "medical equipment" support on units whose inverters cannot start a
 * fridge compressor, let alone be trusted with a ventilator.
 *
 * Mentioning medical devices is fine and often useful; asserting that we tested
 * one, or implying guaranteed suitability, is not.
 */
test('no article claims tested or guaranteed support for medical equipment', () => {
  const forbidden = [
    /confirmed reliable operation of[^.]*medical/i,
    /successfully powered[^.]*medical/i,
    /guaranteed runtime/i,
    /ensuring zero interruptions for critical devices including medical/i,
  ];

  const offenders = corpus.flatMap((a) =>
    forbidden.filter((re) => re.test(a.body)).map((re) => `${a.category}/${a.slug} :: ${re}`),
  );

  expect(offenders, `Unqualified medical-equipment claims:\n  ${offenders.join('\n  ')}`).toEqual(
    [],
  );
});

/**
 * The original template printed a fixed "150W average consumption" fridge
 * runtime on every power station, including a 96Wh USB-only power bank with no
 * AC outlet at all — which produced a claim of ~54 hours for a device that
 * cannot run a fridge for one second. Runtime figures must not come from that
 * template.
 */
test('no article carries the templated fridge-runtime arithmetic', () => {
  const offenders = corpus
    .filter((a) => /refrigerator operation \(based on/i.test(a.body))
    .map((a) => `${a.category}/${a.slug}`);

  expect(offenders, `Templated runtime claims:\n  ${offenders.join('\n  ')}`).toEqual([]);
});

/**
 * Every review carries a ratingBreakdown, and the site computes the headline
 * score from it. Articles used to also hardcode "**Overall Score: X.X / 10**"
 * in the prose, which disagreed with the computed mean in 73 cases. The
 * breakdown is the single source of truth.
 */
test('no article hardcodes an overall score in its prose', () => {
  const offenders = corpus
    .filter((a) => /\*\*Overall Score/i.test(a.body))
    .map((a) => `${a.category}/${a.slug}`);

  expect(offenders, `Hardcoded prose scores:\n  ${offenders.join('\n  ')}`).toEqual([]);
});

/** Readers are told who wrote a review; an unattributed review is not publishable. */
test('every article is attributed to an author', () => {
  const offenders = corpus.filter((a) => !a.data.author).map((a) => `${a.category}/${a.slug}`);
  expect(offenders, `Articles with no author:\n  ${offenders.join('\n  ')}`).toEqual([]);
});

/**
 * Prices in frontmatter are shown as current. Time-bound promotional pricing
 * ("use code TSL5", "early-bird") goes stale the moment the promotion ends and
 * then misinforms every subsequent reader.
 */
test('no article advertises a stale promo code as its price', () => {
  const offenders = corpus
    .filter((a) => /use code|early-bird|early bird/i.test(String(a.data.price ?? '')))
    .map((a) => `${a.category}/${a.slug}: ${String(a.data.price)}`);

  expect(offenders, `Promotional pricing in frontmatter:\n  ${offenders.join('\n  ')}`).toEqual([]);
});
