#!/usr/bin/env node
'use strict';

/**
 * Builds data/trending.json, the snapshot the homepage reads.
 *
 * Trending is deliberately not "most viewed". An evergreen review that has sat
 * at the top of search results for a year would win a raw pageview ranking
 * every week, which tells a returning reader nothing new. This ranks by how
 * much a review grew against its own previous window, so the section surfaces
 * what is actually rising.
 *
 * The input is any analytics export, which keeps the build free of API
 * credentials and vendor SDKs:
 *
 *   npm run trending -- --from-json ga4-export.json --execute
 *
 * Expected rows (extra keys are ignored):
 *   [{ "path": "/articles/dji_power_1000_v2", "views": 420, "priorViews": 180 }]
 *
 * "slug" may be supplied instead of "path". To wire GA4 directly later, fetch a
 * screenPageViews report for the current and previous window and emit the same
 * shape; the ranking below does not care where the numbers came from.
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const OUTPUT = path.join(ROOT, 'data', 'trending.json');
const POSTS_DIR = path.join(ROOT, 'posts');

const DEFAULTS = {
  windowDays: 7,
  /**
   * Below this, percentage growth is meaningless: three views becoming nine is
   * a 200% rise and pure noise, yet it would outrank every real article.
   */
  minViews: 50,
  /**
   * Smoothing constant. Without it, a review going from 1 view to 30 produces a
   * lift of 29 and dominates, while a genuinely popular review going 800 to
   * 1600 scores only 1.
   */
  smoothing: 20,
  limit: 10,
};

const USAGE = `Build the trending snapshot from an analytics export.

  npm run trending -- --from-json <file> [options]

  --from-json <file>   Rows of { path | slug, views, priorViews }.
  --execute            Write data/trending.json. Without it, prints the ranking only.
  --window <n>         Days the export covers (default ${DEFAULTS.windowDays}).
  --min-views <n>      Ignore reviews below this many views (default ${DEFAULTS.minViews}).
  --limit <n>          Entries to keep (default ${DEFAULTS.limit}).
  --help               Show this message.

Trending ranks growth against the previous window, not raw pageviews.`;

function parseArgs(argv) {
  const args = { ...DEFAULTS, fromJson: null, execute: false, help: false };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--help' || arg === '-h') args.help = true;
    else if (arg === '--execute') args.execute = true;
    else if (arg === '--from-json') args.fromJson = argv[++i];
    else if (arg === '--window') args.windowDays = Number(argv[++i]);
    else if (arg === '--min-views') args.minViews = Number(argv[++i]);
    else if (arg === '--limit') args.limit = Number(argv[++i]);
  }
  return args;
}

/** "/articles/foo", "/articles/foo/", "foo?utm=x" and "foo" all yield "foo". */
function slugFromRow(row) {
  const raw = (row.slug || row.path || row.pagePath || '').toString();
  if (!raw) return '';
  const withoutQuery = raw.split(/[?#]/)[0];
  const segments = withoutQuery.split('/').filter(Boolean);
  return segments.length ? segments[segments.length - 1] : '';
}

/**
 * Relative growth, smoothed so small absolute numbers cannot dominate.
 * A review with no prior data is treated as new rather than infinitely trending.
 */
function computeLift(views, priorViews, smoothing = DEFAULTS.smoothing) {
  return (views - priorViews) / (priorViews + smoothing);
}

function knownSlugs() {
  const slugs = new Set();
  for (const entry of fs.readdirSync(POSTS_DIR, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    for (const file of fs.readdirSync(path.join(POSTS_DIR, entry.name))) {
      if (file.endsWith('.md')) slugs.add(file.replace(/\.md$/, ''));
    }
  }
  return slugs;
}

function rank(rows, options = {}) {
  const { minViews, smoothing, limit } = { ...DEFAULTS, ...options };
  const valid = options.validSlugs || null;

  const bySlug = new Map();
  for (const row of rows) {
    const slug = slugFromRow(row);
    if (!slug) continue;
    if (valid && !valid.has(slug)) continue;

    // An export can split one review across several rows (query strings,
    // hostnames), so accumulate rather than overwrite.
    const current = bySlug.get(slug) || { slug, views: 0, priorViews: 0 };
    current.views += Number(row.views) || 0;
    current.priorViews += Number(row.priorViews) || 0;
    bySlug.set(slug, current);
  }

  return [...bySlug.values()]
    .filter((entry) => entry.views >= minViews)
    .map((entry) => ({
      ...entry,
      lift: Number(computeLift(entry.views, entry.priorViews, smoothing).toFixed(4)),
    }))
    .sort((a, b) => b.lift - a.lift || b.views - a.views)
    .slice(0, limit);
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    console.log(USAGE);
    return;
  }
  if (!args.fromJson) {
    throw new Error('--from-json <file> is required. See --help.');
  }

  const raw = JSON.parse(fs.readFileSync(path.resolve(args.fromJson), 'utf8'));
  const rows = Array.isArray(raw) ? raw : raw.rows;
  if (!Array.isArray(rows)) {
    throw new Error('Input must be an array of rows, or an object with a "rows" array.');
  }

  const validSlugs = knownSlugs();
  const items = rank(rows, { ...args, validSlugs });

  console.log(`Ranked ${items.length} of ${rows.length} row(s).`);
  for (const [index, item] of items.entries()) {
    const percent = (item.lift * 100).toFixed(0);
    console.log(
      `  ${index + 1}. ${item.slug} — ${item.views} views (was ${item.priorViews}), ${percent >= 0 ? '+' : ''}${percent}%`
    );
  }

  if (items.length === 0) {
    console.log('\nNothing cleared the thresholds; leaving any existing snapshot alone.');
    return;
  }
  if (!args.execute) {
    console.log('\nDry run only. Re-run with --execute to write data/trending.json.');
    return;
  }

  const snapshot = {
    generatedAt: new Date().toISOString(),
    windowDays: args.windowDays,
    items,
  };
  fs.writeFileSync(OUTPUT, `${JSON.stringify(snapshot, null, 2)}\n`);
  console.log(`\nWrote ${path.relative(ROOT, OUTPUT)}.`);
}

if (require.main === module) {
  try {
    main();
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}

module.exports = { computeLift, rank, slugFromRow };
