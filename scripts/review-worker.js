#!/usr/bin/env node
'use strict';

const { spawn, spawnSync } = require('child_process');

const MAX_CAPTURED_OUTPUT = 200_000;
const fs = require('fs');
const path = require('path');

const {
  REPO_ROOT,
  classifyBlocker,
  displayProduct,
  findEligible,
  readQueue,
  resetItem,
  slugFor,
  staleClaims,
  writeQueue,
} = require('./lib/queue-core');

const USAGE = `Generate ProductLabR reviews from the review queue.

  npm run review:worker -- [options]

  --execute              Actually run. Without it, the worker only reports what it would do.
  --count <n>            Generate n reviews in one batch (default 1).
  --all                  Work through every eligible queue item.
  --category <name>      Restrict to a single category.
  --slug <slug>          Target one specific queue item, e.g. to retry it.
  --stop-on-error        Abort the batch on the first failure (default: keep going).
  --help                 Show this message.

Each successful review is committed locally. Nothing is ever pushed.
Products launched before 2025-01-01 are refused by design; see npm run review:status.`;

function parseArgs(argv) {
  const args = { execute: false, count: 1, category: null, slug: null, stopOnError: false, help: false };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--help' || arg === '-h') args.help = true;
    else if (arg === '--execute') args.execute = true;
    else if (arg === '--stop-on-error') args.stopOnError = true;
    else if (arg === '--count') args.count = Number(argv[++i]);
    else if (arg === '--all') args.count = Infinity;
    else if (arg === '--category') args.category = argv[++i];
    else if (arg === '--slug') args.slug = argv[++i];
  }
  if (args.help) return args;
  if (args.count !== Infinity && (!Number.isInteger(args.count) || args.count < 1)) {
    throw new Error('--count must be a positive integer.');
  }
  return args;
}

/** Nested runs work, but they share the outer session's approvals and quota. */
function warnIfNested() {
  const nested = ['COPILOT_AGENT_SESSION_ID', 'COPILOT_CLI', 'COPILOT_LOADER_PID'].find(
    (key) => process.env[key]
  );
  if (nested) {
    console.warn(
      `Warning: ${nested} is set, so this is running inside an existing Copilot ` +
        'session. Nested runs work but share that session\'s approvals and quota.'
    );
  }
}

function buildPrompt(item) {
  const slug = slugFor(item);
  const product = displayProduct(item);
  return `Create one new ProductLabR review for "${product}" in "${item.category}".

Queue slug: ${slug}
Discovery URL: ${item.sourceUrl || 'none'}

Verify the product's official launch date from primary sources as part of the evidence brief.
Only continue if that launch date is 2025-01-01 or later; if it is earlier or cannot be verified, stop and report the blocker.
Do not treat the discovery URL's publish date as evidence of the launch date.

Use the repository's evidence brief, draft, editorial review, fact-check, and QA workflow.
Use the discovery URL only as a lead; do not copy its article text.
Use only approved, verifiable sources. Do not invent facts, testing, prices, images, links, or specifications.
Write only posts/${item.category}/${slug}.md.
Run npm run editorial:qa -- posts/${item.category}/${slug}.md.
Do not commit, push, open a pull request, merge, deploy, or publish.

You are already the review generator; never call the skill tool for "review-generator".
Do not stop until either posts/${item.category}/${slug}.md exists and passes the QA gate,
or you have a concrete blocker to report. Do not end the session with no file and no blocker.`;
}

function runCopilot(prompt) {
  return new Promise((resolve, reject) => {
    const child = spawn(
      'copilot',
      [
        '--agent',
        'productlabr-review-generator',
        '--add-dir',
        REPO_ROOT,
        '--allow-all-tools',
        '--allow-all-paths',
        '--allow-all-urls',
        '--no-ask-user',
        '--prompt',
        prompt,
        '--mode',
        'autopilot',
        '--max-autopilot-continues',
        '5',
      ],
      { cwd: REPO_ROOT, stdio: ['inherit', 'pipe', 'pipe'] }
    );

    let output = '';
    const tee = (stream, sink) => {
      stream.setEncoding('utf8');
      stream.on('data', (chunk) => {
        output += chunk;
        if (output.length > MAX_CAPTURED_OUTPUT) {
          output = output.slice(-MAX_CAPTURED_OUTPUT);
        }
        sink.write(chunk);
      });
    };
    tee(child.stdout, process.stdout);
    tee(child.stderr, process.stderr);

    child.once('error', reject);
    child.once('close', (code, signal) => {
      if (signal) reject(new Error(`Copilot stopped with signal ${signal}.`));
      else if (code !== 0) reject(new Error(`Copilot exited with code ${code}.`));
      else resolve(output);
    });
  });
}

/** Pull the agent's own stated reason out of its transcript, so a failed run
 *  reports why it stopped instead of only that the file is missing. */
function extractBlocker(output) {
  const lines = (output || '')
    .replace(/\u001b\[[0-9;]*m/g, '')
    .split('\n')
    .map((line) => line.replace(/^[\s│└●*-]+/, '').trim())
    .filter(Boolean);

  const stated = lines.find((line) => /^\**\s*(blocked|blocker)\b/i.test(line));
  if (stated) return stated.replace(/\*\*/g, '').slice(0, 300);

  const reason = lines.find((line) =>
    /(could not|cannot|unable to) (be )?(verif|establish|confirm|find)/i.test(line)
  );
  return reason ? reason.replace(/\*\*/g, '').slice(0, 300) : '';
}

/** The agent is asked to run the gate; this verifies it actually passed. */
function assertQaGatePasses(relativePath) {
  const result = spawnSync(
    process.execPath,
    [path.join(REPO_ROOT, 'scripts', 'editorial', 'qa-gate.js'), relativePath],
    { cwd: REPO_ROOT, encoding: 'utf8' }
  );
  if (result.status !== 0) {
    const failures = (result.stdout || '')
      .split('\n')
      .filter((line) => line.includes('FAIL'))
      .map((line) => line.trim())
      .join('; ');
    throw new Error(
      `Editorial QA gate failed for ${relativePath}${failures ? `: ${failures}` : '.'}`
    );
  }
}

function git(args) {
  const result = spawnSync('git', args, { cwd: REPO_ROOT, encoding: 'utf8' });
  if (result.error) throw result.error;
  if (result.status !== 0) {
    throw new Error(
      `git ${args[0]} failed: ${(result.stderr || result.stdout || '').trim()}`
    );
  }
  return (result.stdout || '').trim();
}

/**
 * Stage only the paths this run owns, so unrelated work already in the tree is
 * never swept into a generated review commit.
 */
function commitRun(item, slug) {
  const paths = [
    path.posix.join('posts', item.category, `${slug}.md`),
    path.posix.join('public', 'images', 'posts', item.category, slug),
    path.posix.join('data', 'review-queue.json'),
    path.posix.join('data', 'product-images.json'),
  ].filter((rel) => fs.existsSync(path.join(REPO_ROOT, rel)));

  git(['add', '--', ...paths]);

  if (!git(['diff', '--cached', '--name-only'])) {
    console.log('Nothing to commit.');
    return;
  }

  const subject = `feat(${item.category}): add ${displayProduct(item)} review`;
  const body = [
    'Generated by npm run review:worker from the review queue.',
    '',
    `Queue slug: ${slug}`,
    item.sourceUrl ? `Discovery lead: ${item.sourceUrl}` : null,
    '',
    'Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>',
  ]
    .filter((line) => line !== null)
    .join('\n');

  git(['commit', '-m', subject, '-m', body]);
  console.log(`Committed ${git(['rev-parse', '--short', 'HEAD'])}: ${subject}`);
}

function reclaimStale(queue) {
  const stale = staleClaims(queue);
  for (const item of stale) {
    console.log(`Reclaiming stale claim: ${slugFor(item)}`);
    resetItem(item);
  }
  if (stale.length) writeQueue(queue);
}

async function processOne(item, queue) {
  const slug = slugFor(item);
  const reviewPath = path.join(REPO_ROOT, 'posts', item.category, `${slug}.md`);
  const relativePath = path.relative(REPO_ROOT, reviewPath);

  item.status = 'in_progress';
  item.claimedAt = new Date().toISOString();
  writeQueue(queue);

  let succeeded = false;
  try {
    const output = await runCopilot(buildPrompt(item));
    if (!fs.existsSync(reviewPath)) {
      const reason = extractBlocker(output);
      throw new Error(
        `Copilot completed without creating ${relativePath}.` +
          (reason ? ` Reported reason: ${reason}` : '')
      );
    }
    assertQaGatePasses(relativePath);
    item.status = 'completed';
    item.completedAt = new Date().toISOString();
    item.reviewPath = relativePath;
    succeeded = true;
  } catch (error) {
    item.status = 'blocked';
    item.blockedAt = new Date().toISOString();
    item.blocker = error.message;
    item.blockerKind = classifyBlocker(error.message);
    throw error;
  } finally {
    writeQueue(queue);
  }

  // Commit after the queue is flushed so the status update lands in the same commit.
  if (succeeded) commitRun(item, slug);
}

async function main() {
  const args = parseArgs(process.argv.slice(2));

  if (args.help) {
    console.log(USAGE);
    return;
  }

  if (!args.execute) {
    const queue = readQueue();
    const item = findEligible(queue, args.category, args.slug);
    if (!item) {
      console.log(
        'No eligible review: needs an allowed category, pending status, and no existing file.'
      );
      return;
    }
    console.log(
      JSON.stringify(
        { slug: slugFor(item), product: displayProduct(item), prompt: buildPrompt(item) },
        null,
        2
      )
    );
    console.log('\nDry run only. Re-run with --execute to start Copilot.');
    return;
  }

  warnIfNested();
  reclaimStale(readQueue());
  const results = { completed: [], blocked: [] };

  for (let done = 0; done < args.count; done += 1) {
    const queue = readQueue();
    const item = findEligible(queue, args.category, args.slug);
    if (!item) {
      console.log(`\nNo further eligible reviews after ${done} attempt(s).`);
      break;
    }
    const slug = slugFor(item);
    const label = args.count === Infinity ? `${done + 1}` : `${done + 1}/${args.count}`;
    console.log(`\n=== [${label}] ${slug} ===`);
    try {
      await processOne(item, queue);
      results.completed.push(slug);
    } catch (error) {
      console.error(`Blocked: ${error.message}`);
      results.blocked.push(slug);
      // One bad item should not abandon the rest of the batch.
      if (args.stopOnError) break;
    }
  }

  console.log(
    `\nDone. ${results.completed.length} completed, ${results.blocked.length} blocked.`
  );
  if (results.completed.length) console.log(`  completed: ${results.completed.join(', ')}`);
  if (results.blocked.length) {
    console.log(`  blocked:   ${results.blocked.join(', ')}`);
    console.log('  retry with: npm run review:reset -- --blocked');
    process.exitCode = 1;
  }
}

if (require.main === module) {
  main().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}

module.exports = { assertQaGatePasses, buildPrompt, commitRun, extractBlocker };
