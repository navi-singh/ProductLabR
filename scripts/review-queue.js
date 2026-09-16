#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const {
  REPO_ROOT,
  displayProduct,
  findEligible,
  findItem,
  isEligible,
  readQueue,
  resetItem,
  slugFor,
  staleClaims,
  writeQueue,
} = require('./lib/queue-core');

function buildPrompt(item) {
  const slug = slugFor(item);
  const sourceNotes = item.sourceNotes
    ? `\nApproved source notes:\n${item.sourceNotes}\n`
    : '';

  return `Create a new ProductLabR review for "${displayProduct(item)}" in category "${item.category}".

Queue slug: ${slug}
${item.brief ? `Editorial brief: ${item.brief}\n` : ''}${sourceNotes}
Follow the repository's Brief -> Draft/Rewrite -> Editorial Reviewer -> Fact-check -> QA Gate workflow.
Verify the product's official launch date from primary sources. Only proceed if it is 2025-01-01 or later; if it is earlier or cannot be verified, mark the queue item as blocked and report the evidence needed.
Do not treat the discovery URL's publish date as evidence of the launch date.
Use only approved, verifiable sources. Do not invent specifications, prices, measurements, images, retailer URLs, or test results.
Write the review to posts/${item.category}/${slug}.md only after the evidence is sufficient.
Run npm run editorial:qa -- posts/${item.category}/${slug}.md and fix all blocking failures.
Do not commit, push, open a pull request, or publish/deploy anything.
If critical facts or approved sources are missing, stop and report the blocker instead of guessing.`;
}

function printNext(queue, category, asPrompt) {
  const item = findEligible(queue, category);
  if (!item) {
    console.error(
      category
        ? `No pending review is available in "${category}".`
        : 'No pending review is available.'
    );
    process.exitCode = 1;
    return;
  }

  console.log(
    asPrompt
      ? buildPrompt(item)
      : JSON.stringify({ ...item, slug: slugFor(item) }, null, 2)
  );
}

function requireItem(queue, slug) {
  const item = findItem(queue, slug);
  if (!item) throw new Error(`No queue item found for slug "${slug}".`);
  return item;
}

function claim(queue, slug) {
  const item = requireItem(queue, slug);
  if ((item.status || 'pending') !== 'pending') {
    throw new Error(`Queue item "${slug}" is already ${item.status}.`);
  }
  item.status = 'in_progress';
  item.claimedAt = new Date().toISOString();
  writeQueue(queue);
  console.log(JSON.stringify(item, null, 2));
}

function complete(queue, slug, reviewPath) {
  const item = requireItem(queue, slug);
  if (reviewPath && !fs.existsSync(path.join(REPO_ROOT, reviewPath))) {
    throw new Error(`Review file does not exist: ${reviewPath}`);
  }
  item.status = 'completed';
  item.completedAt = new Date().toISOString();
  if (reviewPath) item.reviewPath = reviewPath;
  writeQueue(queue);
  console.log(JSON.stringify(item, null, 2));
}

/** Return a single item, all blocked items, or all stale claims to pending. */
function reset(queue, { slug, blocked, stale, force }) {
  let targets;
  let skipped = 0;
  if (slug) targets = [requireItem(queue, slug)];
  else if (blocked) {
    targets = queue.items.filter((i) => i.status === 'blocked');
    if (!force) {
      const before = targets.length;
      targets = targets.filter((i) => i.blockerKind !== 'launch-date');
      skipped = before - targets.length;
    }
  } else if (stale) targets = staleClaims(queue);
  else throw new Error('reset requires --slug <slug>, --blocked, or --stale.');

  if (skipped) {
    console.log(
      `Skipped ${skipped} item(s) blocked on the 2025 launch-date rule; ` +
        'retrying them cannot succeed. Use --force to override.'
    );
  }
  if (targets.length === 0) {
    console.log('Nothing to reset.');
    return;
  }
  targets.forEach(resetItem);
  writeQueue(queue);
  console.log(`Reset ${targets.length} item(s): ${targets.map(slugFor).join(', ')}`);
}

function status(queue) {
  const counts = {};
  for (const item of queue.items) {
    const key = item.status || 'pending';
    counts[key] = (counts[key] || 0) + 1;
  }
  const eligible = queue.items.filter((i) => isEligible(i)).length;
  console.log(`total:    ${queue.items.length}`);
  for (const [key, value] of Object.entries(counts).sort()) {
    console.log(`${`${key}:`.padEnd(10)}${value}`);
  }
  console.log(`eligible: ${eligible}`);

  const blocked = queue.items.filter((i) => i.status === 'blocked');
  if (blocked.length) {
    console.log('\nblocked:');
    for (const item of blocked) {
      const kind = item.blockerKind === 'launch-date' ? ' [launch-date, permanent]' : '';
      console.log(`  ${slugFor(item)}${kind}: ${item.blocker || 'no reason recorded'}`);
    }
  }
}

function main() {
  const args = process.argv.slice(2);
  const command = args[0] || 'next';
  const valueFor = (flag) => {
    const index = args.indexOf(flag);
    return index === -1 ? null : args[index + 1];
  };

  const queue = readQueue();

  if (command === 'next') return printNext(queue, valueFor('--category'), args.includes('--prompt'));
  if (command === 'status') return status(queue);
  if (command === 'claim') {
    const slug = valueFor('--slug');
    if (!slug) throw new Error('claim requires --slug <slug>.');
    return claim(queue, slug);
  }
  if (command === 'complete') {
    const slug = valueFor('--slug');
    if (!slug) throw new Error('complete requires --slug <slug>.');
    return complete(queue, slug, valueFor('--path'));
  }
  if (command === 'reset') {
    return reset(queue, {
      slug: valueFor('--slug'),
      blocked: args.includes('--blocked'),
      stale: args.includes('--stale'),
      force: args.includes('--force'),
    });
  }
  throw new Error(
    `Unknown command "${command}". Use next, status, claim, complete, or reset.`
  );
}

try {
  main();
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
