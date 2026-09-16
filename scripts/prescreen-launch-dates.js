#!/usr/bin/env node
'use strict';

/**
 * The queue was seeded from a sitemap with no date filter, so most items are
 * products that predate the 2025-01-01 editorial cutoff. Discovering that inside
 * the review agent costs a full research run (~6 credits) per item and always
 * ends in the same block, so this screens many products in a single call and
 * retires the hopeless ones up front.
 *
 * Only high-confidence pre-2025 answers are blocked. Anything unknown or recent
 * stays pending, because the review agent re-verifies the launch date anyway --
 * letting an old product through is cheap, wrongly retiring a good one is not.
 */

const { spawnSync } = require('child_process');

const {
  classifyBlocker,
  displayProduct,
  isEligible,
  readQueue,
  slugFor,
  writeQueue,
} = require('./lib/queue-core');

const CUTOFF_YEAR = 2025;
const CHUNK_SIZE = 40;

const USAGE = `Retire queue items whose product launched before ${CUTOFF_YEAR}.

  npm run review:prescreen -- [options]

  --execute        Apply the results. Without it, only reports what would change.
  --limit <n>      Screen at most n pending items.
  --chunk <n>      Products per model call (default ${CHUNK_SIZE}).
  --help           Show this message.

Only high-confidence pre-${CUTOFF_YEAR} answers are blocked; unknowns stay pending.
Use "npm run review:reset -- --blocked --force" to undo.`;

function parseArgs(argv) {
  const args = { execute: false, limit: Infinity, chunk: CHUNK_SIZE, help: false };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--help' || arg === '-h') args.help = true;
    else if (arg === '--execute') args.execute = true;
    else if (arg === '--limit') args.limit = Number(argv[++i]);
    else if (arg === '--chunk') args.chunk = Number(argv[++i]);
  }
  return args;
}

function buildPrompt(items) {
  const list = items
    .map((item) => `- ${slugFor(item)}: ${displayProduct(item)}`)
    .join('\n');

  return `For each product below, give the year its FIRST official retail release happened.

${list}

Rules:
- "year" is the original launch year of that exact model, not a later revision,
  restock, bundle, or regional re-release.
- A "V2", "Gen 2", "Plus", or "Pro" model is a distinct product; date that model,
  not the original it replaced.
- Set "confidence" to "high" only if you actually know this product's launch year.
  If you are guessing, inferring from the name, or unsure, use "low".
- Use null for "year" when you do not know it.

Answer from your existing knowledge. Do not browse, cite sources, or verify
online; this is a cheap triage pass, and every "high" answer is independently
re-checked later. Prefer "low" over spending effort.

Output the JSON array and nothing else. No tables, no evidence, no commentary:
[{"slug": "...", "year": 2024, "confidence": "high"}]`;
}

function runModel(prompt) {
  const result = spawnSync(
    'copilot',
    ['--allow-all-tools', '--no-ask-user', '--prompt', prompt],
    { encoding: 'utf8', maxBuffer: 32 * 1024 * 1024 }
  );
  if (result.error) throw result.error;
  if (result.status !== 0) {
    throw new Error(`copilot exited with code ${result.status}: ${result.stderr || ''}`);
  }
  return result.stdout || '';
}

/**
 * Models often wrap the answer in commentary that itself contains brackets, so a
 * naive first-"[" to last-"]" slice fails. Scan every array that is actually
 * balanced and keep the last one that looks like verdicts.
 */
function parseVerdicts(output) {
  const text = output.replace(/\u001b\[[0-9;]*m/g, '');
  let best = [];

  for (let i = 0; i < text.length; i += 1) {
    if (text[i] !== '[') continue;
    let depth = 0;
    let inString = false;
    let escaped = false;

    for (let j = i; j < text.length; j += 1) {
      const ch = text[j];
      if (inString) {
        if (escaped) escaped = false;
        else if (ch === '\\') escaped = true;
        else if (ch === '"') inString = false;
        continue;
      }
      if (ch === '"') inString = true;
      else if (ch === '[' || ch === '{') depth += 1;
      else if (ch === ']' || ch === '}') {
        depth -= 1;
        if (depth === 0) {
          try {
            const parsed = JSON.parse(text.slice(i, j + 1));
            if (Array.isArray(parsed) && parsed.some((v) => v && v.slug)) best = parsed;
          } catch {
            /* not JSON; keep scanning */
          }
          break;
        }
      }
    }
  }
  return best;
}

function chunkOf(list, size) {
  const out = [];
  for (let i = 0; i < list.length; i += size) out.push(list.slice(i, i + size));
  return out;
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    console.log(USAGE);
    return;
  }

  const queue = readQueue();
  const pending = queue.items.filter((item) => isEligible(item));
  const targets = Number.isFinite(args.limit) ? pending.slice(0, args.limit) : pending;

  if (targets.length === 0) {
    console.log('No eligible items to screen.');
    return;
  }

  const bySlug = new Map(targets.map((item) => [slugFor(item), item]));
  const batches = chunkOf(targets, args.chunk);
  console.log(`Screening ${targets.length} item(s) in ${batches.length} call(s).`);

  const retire = [];
  const unknown = [];
  let answered = 0;

  batches.forEach((batch, index) => {
    console.log(`  call ${index + 1}/${batches.length} (${batch.length} products)...`);
    const verdicts = parseVerdicts(runModel(buildPrompt(batch)));
    if (verdicts.length === 0) {
      console.warn('  no parsable verdicts from this call; leaving the batch pending.');
      return;
    }
    for (const verdict of verdicts) {
      const item = bySlug.get(verdict && verdict.slug);
      if (!item) continue;
      answered += 1;
      const year = Number(verdict.year);
      if (verdict.confidence === 'high' && Number.isInteger(year) && year < CUTOFF_YEAR) {
        retire.push({ item, year });
      } else if (!Number.isInteger(year)) {
        unknown.push(slugFor(item));
      }
    }
  });

  console.log(
    `\nAnswered ${answered}/${targets.length}. ` +
      `Pre-${CUTOFF_YEAR}: ${retire.length}. Unknown (left pending): ${unknown.length}.`
  );
  for (const { item, year } of retire) {
    console.log(`  ${slugFor(item)} -> ${year}`);
  }

  if (!args.execute) {
    console.log('\nDry run only. Re-run with --execute to apply.');
    return;
  }
  if (retire.length === 0) {
    console.log('\nNothing to retire.');
    return;
  }

  const now = new Date().toISOString();
  for (const { item, year } of retire) {
    const blocker =
      `Pre-screen: ${displayProduct(item)} launched in ${year}, before the ` +
      `${CUTOFF_YEAR}-01-01 launch-date rule.`;
    item.status = 'blocked';
    item.blockedAt = now;
    item.blocker = blocker;
    item.blockerKind = classifyBlocker(blocker);
  }
  writeQueue(queue);
  console.log(`\nRetired ${retire.length} item(s). Undo with review:reset -- --blocked --force.`);
}

if (require.main === module) {
  try {
    main();
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}

module.exports = { buildPrompt, parseVerdicts };
