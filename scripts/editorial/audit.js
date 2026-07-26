#!/usr/bin/env node
'use strict';

/**
 * Editorial audit CLI.
 *
 *   node scripts/editorial/audit.js                       # audit whole corpus
 *   node scripts/editorial/audit.js --category monitors   # audit one category
 *   node scripts/editorial/audit.js --json                # machine-readable
 *   node scripts/editorial/audit.js --report              # write logs/<ts>_editorial-audit.md
 *   node scripts/editorial/audit.js --limit 20            # show worst N only
 */

const fs = require('fs');
const path = require('path');

const { loadCorpus, buildBrandIndex, REPO_ROOT } = require('./lib/corpus');
const { analyzeCorpus } = require('./lib/metrics');
const { scoreArticle, priorityFor, effortFor } = require('./lib/rubric');
const { runGates } = require('./lib/gates');
const { GATES } = require('./config');

function parseArgs(argv) {
  const args = { json: false, report: false, category: null, limit: null, file: null };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--json') args.json = true;
    else if (arg === '--report') args.report = true;
    else if (arg === '--category') args.category = argv[++i];
    else if (arg === '--file') args.file = argv[++i];
    else if (arg === '--limit') args.limit = Number(argv[++i]);
  }
  return args;
}

function buildResults(args) {
  const corpus = loadCorpus(REPO_ROOT);
  const brandIndex = buildBrandIndex(corpus);
  const allMetrics = analyzeCorpus(corpus, brandIndex);

  return allMetrics
    .filter((m) => (args.category ? m.category === args.category : true))
    .filter((m) => (args.file ? m.path.endsWith(args.file) || m.slug === args.file : true))
    .map((metrics) => {
      const score = scoreArticle(metrics);
      const gates = runGates(metrics);
      return {
        path: metrics.path,
        category: metrics.category,
        slug: metrics.slug,
        title: metrics.title,
        score: score.total,
        priority: priorityFor(score.total),
        effort: effortFor(metrics),
        gateStatus: gates.status,
        blocking: gates.blocking_failures,
        recommendedNextAgent: gates.recommended_next_agent,
        metrics,
        breakdown: score.breakdown,
      };
    })
    .sort((a, b) => a.score - b.score);
}

function summarize(results) {
  const count = results.length;
  const mean = count ? results.reduce((s, r) => s + r.score, 0) / count : 0;
  const byCategory = {};
  for (const r of results) {
    byCategory[r.category] = byCategory[r.category] || { count: 0, total: 0, failing: 0 };
    byCategory[r.category].count += 1;
    byCategory[r.category].total += r.score;
    if (r.gateStatus === 'fail') byCategory[r.category].failing += 1;
  }
  const categories = Object.entries(byCategory)
    .map(([name, v]) => ({
      category: name,
      count: v.count,
      meanScore: Number((v.total / v.count).toFixed(1)),
      failing: v.failing,
    }))
    .sort((a, b) => a.meanScore - b.meanScore);

  return {
    articles: count,
    meanScore: Number(mean.toFixed(1)),
    passingGates: results.filter((r) => r.gateStatus === 'pass').length,
    p0: results.filter((r) => r.priority === 'P0').length,
    p1: results.filter((r) => r.priority === 'P1').length,
    p2: results.filter((r) => r.priority === 'P2').length,
    p3: results.filter((r) => r.priority === 'P3').length,
    underMinWords: results.filter((r) => r.metrics.words < GATES.minWords).length,
    missingFaq: results.filter((r) => r.metrics.faqPairs < GATES.minFaqPairs).length,
    placeholderLinks: results.filter((r) => r.metrics.retailerLinks.placeholder > 0).length,
    categories,
  };
}

function renderMarkdown(results, summary) {
  const lines = [];
  lines.push('# Editorial baseline audit');
  lines.push('');
  lines.push(`Generated: ${new Date().toISOString()}`);
  lines.push('');
  lines.push('## Corpus summary');
  lines.push('');
  lines.push('| Metric | Value |');
  lines.push('| --- | --- |');
  lines.push(`| Articles audited | ${summary.articles} |`);
  lines.push(`| Mean rubric score | ${summary.meanScore} / 100 |`);
  lines.push(`| Passing all hard gates | ${summary.passingGates} |`);
  lines.push(`| P0 / P1 / P2 / P3 | ${summary.p0} / ${summary.p1} / ${summary.p2} / ${summary.p3} |`);
  lines.push(`| Below ${GATES.minWords} words | ${summary.underMinWords} |`);
  lines.push(`| Below ${GATES.minFaqPairs} FAQ pairs | ${summary.missingFaq} |`);
  lines.push(`| With placeholder retailer links | ${summary.placeholderLinks} |`);
  lines.push('');
  lines.push('## Category ranking (worst first)');
  lines.push('');
  lines.push('| Category | Articles | Mean score | Failing gates |');
  lines.push('| --- | --- | --- | --- |');
  for (const c of summary.categories) {
    lines.push(`| ${c.category} | ${c.count} | ${c.meanScore} | ${c.failing} |`);
  }
  lines.push('');
  lines.push('## Remediation backlog (lowest score first)');
  lines.push('');
  lines.push('| Priority | Score | Effort | Article | Words | FAQ | Blocking gates |');
  lines.push('| --- | --- | --- | --- | --- | --- | --- |');
  for (const r of results) {
    lines.push(
      `| ${r.priority} | ${r.score} | ${r.effort} | ${r.path} | ${r.metrics.words} | ${r.metrics.faqPairs} | ${
        r.blocking.join(', ') || 'none'
      } |`
    );
  }
  lines.push('');
  return lines.join('\n');
}

function printTable(results, summary, limit) {
  const shown = limit ? results.slice(0, limit) : results;
  console.log('');
  console.log(`Editorial audit: ${summary.articles} articles, mean score ${summary.meanScore}/100`);
  console.log(
    `Gates passing: ${summary.passingGates}/${summary.articles} | P0 ${summary.p0} P1 ${summary.p1} P2 ${summary.p2} P3 ${summary.p3}`
  );
  console.log('');
  console.log('Worst categories:');
  for (const c of summary.categories.slice(0, 5)) {
    console.log(`  ${c.category.padEnd(26)} mean ${String(c.meanScore).padStart(5)}  (${c.count} articles)`);
  }
  console.log('');
  console.log(`Backlog${limit ? ` (worst ${shown.length})` : ''}:`);
  for (const r of shown) {
    console.log(
      `  ${r.priority} ${String(r.score).padStart(5)}  ${r.path.padEnd(52)} ${String(r.metrics.words).padStart(
        5
      )}w faq=${r.metrics.faqPairs} -> ${r.recommendedNextAgent || 'publish'}`
    );
  }
  console.log('');
}

function timestamp() {
  return new Date().toISOString().replace(/:/g, '-').replace(/\..+$/, '');
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const results = buildResults(args);
  const summary = summarize(results);

  if (args.json) {
    console.log(JSON.stringify({ summary, results }, null, 2));
    return;
  }

  printTable(results, summary, args.limit);

  if (args.report) {
    const logsDir = path.join(REPO_ROOT, 'logs');
    fs.mkdirSync(logsDir, { recursive: true });
    const target = path.join(logsDir, `${timestamp()}_editorial-audit.md`);
    fs.writeFileSync(target, renderMarkdown(results, summary), 'utf8');
    console.log(`Report written to ${path.relative(REPO_ROOT, target)}`);
    const jsonTarget = path.join(logsDir, `${timestamp()}_editorial-audit.json`);
    fs.writeFileSync(jsonTarget, JSON.stringify({ summary, results }, null, 2), 'utf8');
    console.log(`Data written to ${path.relative(REPO_ROOT, jsonTarget)}`);
  }
}

main();
