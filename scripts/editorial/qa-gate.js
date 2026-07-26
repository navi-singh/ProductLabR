#!/usr/bin/env node
'use strict';

/**
 * Deterministic publish gate for one or many articles.
 *
 *   node scripts/editorial/qa-gate.js posts/monitors/lg_27uk850w.md
 *   node scripts/editorial/qa-gate.js --category monitors
 *   node scripts/editorial/qa-gate.js --all --json
 *
 * Exit code 1 when any evaluated article has a blocking failure, so this can be
 * wired into CI or used directly by the qa-gate agent.
 */

const path = require('path');

const { loadCorpus, buildBrandIndex, REPO_ROOT } = require('./lib/corpus');
const { analyzeCorpus } = require('./lib/metrics');
const { runGates } = require('./lib/gates');
const { scoreArticle } = require('./lib/rubric');

function parseArgs(argv) {
  const args = { json: false, all: false, category: null, targets: [] };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--json') args.json = true;
    else if (arg === '--all') args.all = true;
    else if (arg === '--category') args.category = argv[++i];
    else args.targets.push(arg);
  }
  return args;
}

function normalize(target) {
  return path.relative(REPO_ROOT, path.resolve(process.cwd(), target));
}

function main() {
  const args = parseArgs(process.argv.slice(2));

  if (!args.all && !args.category && args.targets.length === 0) {
    console.error('Usage: qa-gate.js <file.md> [...] | --category <name> | --all');
    process.exit(2);
  }

  const corpus = loadCorpus(REPO_ROOT);
  const brandIndex = buildBrandIndex(corpus);
  const allMetrics = analyzeCorpus(corpus, brandIndex);

  const wanted = new Set(args.targets.map(normalize));
  const selected = allMetrics.filter((m) => {
    if (args.all) return true;
    if (args.category) return m.category === args.category;
    return wanted.has(m.path) || args.targets.includes(m.slug);
  });

  if (selected.length === 0) {
    console.error('No matching articles found.');
    process.exit(2);
  }

  const reports = selected.map((metrics) => ({
    ...runGates(metrics),
    rubric_score: scoreArticle(metrics).total,
  }));

  if (args.json) {
    console.log(JSON.stringify(reports.length === 1 ? reports[0] : reports, null, 2));
  } else {
    for (const report of reports) {
      const badge = report.status === 'pass' ? 'PASS' : 'FAIL';
      console.log('');
      console.log(`${badge}  ${report.path}  (rubric ${report.rubric_score}/100)`);
      for (const check of report.checks) {
        const mark = check.status === 'pass' ? '  ok  ' : check.blocking ? ' FAIL ' : ' warn ';
        console.log(`${mark}${check.label.padEnd(48)} ${check.detail}`);
      }
      if (report.recommended_next_agent) {
        console.log(`  -> route to: ${report.recommended_next_agent}`);
      }
    }
    console.log('');
    const failing = reports.filter((r) => r.status === 'fail').length;
    console.log(`${reports.length - failing}/${reports.length} articles pass all blocking gates.`);
  }

  process.exit(reports.some((r) => r.status === 'fail') ? 1 : 0);
}

main();
