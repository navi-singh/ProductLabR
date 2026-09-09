import { test, expect } from '@playwright/test';
import { GATES } from '../lib/editorial-standards';

/* eslint-disable @typescript-eslint/no-var-requires */
const { loadCorpus, buildBrandIndex, REPO_ROOT } = require('../scripts/editorial/lib/corpus.js');
const { analyzeCorpus } = require('../scripts/editorial/lib/metrics.js');
const { runGates } = require('../scripts/editorial/lib/gates.js');
/* eslint-enable @typescript-eslint/no-var-requires */

/**
 * /methodology publishes GATES to readers as a floor: "Every review on the site
 * clears every number in the left column."
 *
 * That claim was previously false — the advertised thresholds were aspirational
 * and 108 of 149 articles missed at least one. The numbers were then split into
 * a hard floor (GATES, a real promise) and editorial targets (TARGETS, which
 * shape the backlog but do not block).
 *
 * This test is the thing that keeps the published promise honest. If it fails,
 * the correct fix is to raise the article or lower the published claim — never
 * to weaken this assertion.
 */

const corpus = loadCorpus(REPO_ROOT);
const articles = analyzeCorpus(corpus, buildBrandIndex(corpus));

test('the analyzer sees the whole corpus', () => {
  expect(articles.length).toBeGreaterThan(100);
});

test('every published article clears the publicly advertised gate floor', () => {
  const failures = articles
    .map((article: { slug: string; category: string }) => {
      const result = runGates(article) as {
        status: string;
        blocking_failures: string[];
        checks: Array<{ id: string; status: string; detail: string }>;
      };
      if (result.status === 'pass') return null;
      const detail = result.blocking_failures
        .map((id) => {
          const check = result.checks.find((c) => c.id === id);
          return check ? `${id} (${check.detail})` : id;
        })
        .join(', ');
      return `${article.category}/${article.slug}: ${detail}`;
    })
    .filter(Boolean);

  expect(
    failures,
    `Articles that miss the floor published on /methodology:\n  ${failures.join('\n  ')}`,
  ).toEqual([]);
});

/**
 * The similarity ceiling is the one gate that protects against the failure the
 * audit actually found: 18 articles built from a shared template, recycling
 * 60-82% of their sentences from each other. Near-duplicate reviews are worse
 * than no review, because they look like independent corroboration.
 */
test('no two reviews exceed the published similarity ceiling', () => {
  const offenders = articles
    .filter(
      (a: { similarity: { max: number } }) => a.similarity.max > GATES.maxCorpusSimilarity,
    )
    .map(
      (a: { slug: string; similarity: { max: number; nearest: string } }) =>
        `${a.slug}: ${a.similarity.max.toFixed(3)} vs ${a.similarity.nearest}`,
    );

  expect(
    offenders,
    `Articles over the ${GATES.maxCorpusSimilarity} similarity ceiling:\n  ${offenders.join('\n  ')}`,
  ).toEqual([]);
});
