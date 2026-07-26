#!/usr/bin/env node
'use strict';

/**
 * Selects the A/B pilot set and assigns articles to arms.
 *
 *   node scripts/editorial/select-pilot.js --size 6 --write
 *
 * Selection is worst-first within the weakest categories, then arms are
 * assigned by alternating down the ranked list so both arms receive a
 * comparable difficulty and category mix. Deterministic: same corpus in, same
 * assignment out, which keeps the experiment reproducible.
 */

const fs = require('fs');
const path = require('path');

const { loadCorpus, buildBrandIndex, REPO_ROOT } = require('./lib/corpus');
const { analyzeCorpus } = require('./lib/metrics');
const { scoreArticle, priorityFor, effortFor } = require('./lib/rubric');

function parseArgs(argv) {
  const args = { size: 6, write: false, categories: null };
  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i] === '--size') args.size = Number(argv[++i]);
    else if (argv[i] === '--write') args.write = true;
    else if (argv[i] === '--categories') args.categories = argv[++i].split(',');
  }
  return args;
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const corpus = loadCorpus(REPO_ROOT);
  const brandIndex = buildBrandIndex(corpus);
  const metrics = analyzeCorpus(corpus, brandIndex);

  const scored = metrics
    .map((m) => ({ metrics: m, score: scoreArticle(m).total }))
    .map((r) => ({ ...r, priority: priorityFor(r.score), effort: effortFor(r.metrics) }))
    .sort((a, b) => a.score - b.score);

  // Rank categories by mean score so the pilot targets the real weak spots.
  const byCategory = new Map();
  for (const r of scored) {
    const bucket = byCategory.get(r.metrics.category) || [];
    bucket.push(r);
    byCategory.set(r.metrics.category, bucket);
  }
  const categoryRank = [...byCategory.entries()]
    .map(([name, rows]) => ({ name, mean: rows.reduce((s, r) => s + r.score, 0) / rows.length, rows }))
    .sort((a, b) => a.mean - b.mean);

  const targetCategories = args.categories || categoryRank.slice(0, 4).map((c) => c.name);

  const eligible = scored.filter((r) => targetCategories.includes(r.metrics.category));
  const selected = eligible.slice(0, args.size);

  // Alternate assignment down the ranked list to balance difficulty per arm.
  const assignments = selected.map((r, index) => ({
    arm: index % 2 === 0 ? 'A' : 'B',
    path: r.metrics.path,
    category: r.metrics.category,
    title: r.metrics.title,
    baselineScore: r.score,
    priority: r.priority,
    effort: r.effort,
    words: r.metrics.words,
    faqPairs: r.metrics.faqPairs,
    missingSections: Object.entries(r.metrics.sections)
      .filter(([, present]) => !present)
      .map(([id]) => id),
  }));

  const armMean = (arm) => {
    const rows = assignments.filter((a) => a.arm === arm);
    return rows.length ? Number((rows.reduce((s, a) => s + a.baselineScore, 0) / rows.length).toFixed(1)) : 0;
  };

  console.log('');
  console.log(`Pilot categories: ${targetCategories.join(', ')}`);
  console.log(`Selected ${assignments.length} articles. Arm A mean ${armMean('A')}, Arm B mean ${armMean('B')}`);
  console.log('');
  for (const a of assignments) {
    console.log(
      `  arm ${a.arm}  ${String(a.baselineScore).padStart(5)}  ${a.path.padEnd(46)} ${String(a.words).padStart(
        5
      )}w faq=${a.faqPairs} missing=[${a.missingSections.join(',')}]`
    );
  }
  console.log('');

  if (args.write) {
    const logsDir = path.join(REPO_ROOT, 'logs');
    fs.mkdirSync(logsDir, { recursive: true });
    const stamp = new Date().toISOString().replace(/:/g, '-').replace(/\..+$/, '');
    const target = path.join(logsDir, `${stamp}_editorial-pilot-assignment.json`);
    fs.writeFileSync(
      target,
      JSON.stringify(
        { generatedAt: new Date().toISOString(), targetCategories, armMeans: { A: armMean('A'), B: armMean('B') }, assignments },
        null,
        2
      ),
      'utf8'
    );
    console.log(`Assignment written to ${path.relative(REPO_ROOT, target)}`);
  }
}

main();
