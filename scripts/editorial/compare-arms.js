#!/usr/bin/env node
'use strict';

/**
 * Scores the A/B pilot: re-audits every assigned article and compares each arm
 * against its own recorded baseline.
 *
 *   node scripts/editorial/compare-arms.js
 *   node scripts/editorial/compare-arms.js --assignment logs/<file>.json --report
 *
 * Uses the newest assignment file in logs/ when none is supplied.
 */

const fs = require('fs');
const path = require('path');

const { loadCorpus, buildBrandIndex, REPO_ROOT } = require('./lib/corpus');
const { analyzeCorpus } = require('./lib/metrics');
const { scoreArticle } = require('./lib/rubric');
const { runGates } = require('./lib/gates');

function newestAssignment() {
  const logsDir = path.join(REPO_ROOT, 'logs');
  if (!fs.existsSync(logsDir)) return null;
  const files = fs
    .readdirSync(logsDir)
    .filter((f) => f.endsWith('_editorial-pilot-assignment.json'))
    .sort();
  return files.length ? path.join(logsDir, files[files.length - 1]) : null;
}

function mean(values) {
  return values.length ? Number((values.reduce((a, b) => a + b, 0) / values.length).toFixed(2)) : 0;
}

function main() {
  const argv = process.argv.slice(2);
  const idx = argv.indexOf('--assignment');
  const assignmentPath = idx >= 0 ? path.resolve(argv[idx + 1]) : newestAssignment();
  const report = argv.includes('--report');

  if (!assignmentPath || !fs.existsSync(assignmentPath)) {
    console.error('No pilot assignment file found. Run select-pilot.js --write first.');
    process.exit(2);
  }

  const assignment = JSON.parse(fs.readFileSync(assignmentPath, 'utf8'));
  const corpus = loadCorpus(REPO_ROOT);
  const metrics = analyzeCorpus(corpus, buildBrandIndex(corpus));
  const byPath = new Map(metrics.map((m) => [m.path, m]));

  const rows = assignment.assignments.map((a) => {
    const m = byPath.get(a.path);
    if (!m) return { ...a, missing: true };
    const score = scoreArticle(m).total;
    const gates = runGates(m);
    return {
      arm: a.arm,
      path: a.path,
      category: a.category,
      baselineScore: a.baselineScore,
      finalScore: score,
      delta: Number((score - a.baselineScore).toFixed(2)),
      baselineWords: a.words,
      finalWords: m.words,
      baselineFaq: a.faqPairs,
      finalFaq: m.faqPairs,
      gateStatus: gates.status,
      blocking: gates.blocking_failures,
      advisory: gates.advisory_failures,
      competitors: m.competitors.count,
      numericClaims: m.numericClaims,
      similarity: m.similarity.max,
    };
  });

  const arms = ['A', 'B'].map((arm) => {
    const armRows = rows.filter((r) => r.arm === arm && !r.missing);
    return {
      arm,
      articles: armRows.length,
      baselineMean: mean(armRows.map((r) => r.baselineScore)),
      finalMean: mean(armRows.map((r) => r.finalScore)),
      meanDelta: mean(armRows.map((r) => r.delta)),
      gatesPassing: armRows.filter((r) => r.gateStatus === 'pass').length,
      meanWords: Math.round(mean(armRows.map((r) => r.finalWords))),
      meanFaq: mean(armRows.map((r) => r.finalFaq)),
      maxSimilarity: Math.max(...armRows.map((r) => r.similarity), 0),
    };
  });

  const [a, b] = arms;
  let winner = 'tie';
  if (a.gatesPassing === 0 && b.gatesPassing === 0) winner = 'inconclusive';
  else if (a.gatesPassing !== b.gatesPassing) winner = a.gatesPassing > b.gatesPassing ? 'A' : 'B';
  else if (Math.abs(a.finalMean - b.finalMean) >= 2) winner = a.finalMean > b.finalMean ? 'A' : 'B';

  console.log('');
  console.log(`Pilot comparison (assignment: ${path.relative(REPO_ROOT, assignmentPath)})`);
  console.log('');
  for (const armSummary of arms) {
    console.log(
      `Arm ${armSummary.arm}: ${armSummary.baselineMean} -> ${armSummary.finalMean} (${
        armSummary.meanDelta >= 0 ? '+' : ''
      }${armSummary.meanDelta})  gates ${armSummary.gatesPassing}/${armSummary.articles}  words ${
        armSummary.meanWords
      }  faq ${armSummary.meanFaq}  maxSim ${armSummary.maxSimilarity}`
    );
  }
  console.log('');
  for (const r of rows) {
    console.log(
      `  ${r.arm}  ${String(r.baselineScore).padStart(5)} -> ${String(r.finalScore).padStart(5)}  ${
        r.gateStatus === 'pass' ? 'PASS' : 'FAIL'
      }  ${r.path.padEnd(46)} ${r.finalWords}w faq=${r.finalFaq}${
        r.blocking && r.blocking.length ? ` blocking=[${r.blocking.join(',')}]` : ''
      }`
    );
  }
  console.log('');
  console.log(
    `Winner: ${
      winner === 'tie'
        ? 'tie (no material difference)'
        : winner === 'inconclusive'
          ? 'inconclusive (neither arm produced a gate-passing article)'
          : `Arm ${winner}`
    }`
  );
  console.log('');

  if (report) {
    const stamp = new Date().toISOString().replace(/:/g, '-').replace(/\..+$/, '');
    const target = path.join(REPO_ROOT, 'logs', `${stamp}_editorial-ab-results.json`);
    fs.writeFileSync(target, JSON.stringify({ assignmentPath, arms, rows, winner }, null, 2), 'utf8');
    console.log(`Results written to ${path.relative(REPO_ROOT, target)}`);
  }
}

main();
