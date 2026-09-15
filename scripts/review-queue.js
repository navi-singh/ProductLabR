#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const REPO_ROOT = path.join(__dirname, '..');
const QUEUE_PATH = path.join(REPO_ROOT, 'data', 'review-queue.json');
const POSTS_PATH = path.join(REPO_ROOT, 'posts');
const ALLOWED_CATEGORIES = new Set([
  'portable-power-stations',
  'smart-generators',
]);
const MIN_LAUNCH_DATE = '2025-01-01';

function readQueue() {
  const queue = JSON.parse(fs.readFileSync(QUEUE_PATH, 'utf8'));
  if (!queue || !Array.isArray(queue.items)) {
    throw new Error('data/review-queue.json must contain an items array.');
  }
  return queue;
}

function writeQueue(queue) {
  fs.writeFileSync(QUEUE_PATH, `${JSON.stringify(queue, null, 2)}\n`);
}

function normalizeSlug(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
}

function isExcludedProduct(item) {
  return /(?:^|_)(?:best|testing|guide|comparison|revisit|bundle|mount|charger|kit|ground|split|bike|cooler|fridge|battery|inverter|panel|transfer|accessory)(?:_|$)/i.test(
    `${item.slug || normalizeSlug(item.product)}`
  );
}

function validateItem(item, index) {
  if (!item || typeof item !== 'object') {
    throw new Error(`Queue item ${index + 1} must be an object.`);
  }
  for (const field of ['category', 'product']) {
    if (typeof item[field] !== 'string' || item[field].trim() === '') {
      throw new Error(`Queue item ${index + 1} is missing "${field}".`);
    }
  }
}

function isExistingReview(item) {
  const slug = item.slug || normalizeSlug(item.product);
  return fs.existsSync(path.join(POSTS_PATH, item.category, `${slug}.md`));
}

function nextItem(queue, category) {
  return queue.items.find((item) => {
    validateItem(item, queue.items.indexOf(item));
    return (
      ALLOWED_CATEGORIES.has(item.category) &&
      !isExcludedProduct(item) &&
      (!category || item.category === category) &&
      (item.status || 'pending') === 'pending' &&
      typeof item.launchDate === 'string' &&
      item.launchDate >= MIN_LAUNCH_DATE &&
      !isExistingReview(item)
    );
  });
}

function buildPrompt(item) {
  const slug = item.slug || normalizeSlug(item.product);
  const launchDate = item.launchDate || 'not verified';
  const sourceNotes = item.sourceNotes
    ? `\nApproved source notes:\n${item.sourceNotes}\n`
    : '';

  return `Create a new ProductLabR review for "${item.product}" in category "${item.category}".

Queue slug: ${slug}
Verified product launch date: ${launchDate}
${item.brief ? `Editorial brief: ${item.brief}\n` : ''}${sourceNotes}

Follow the repository's Brief -> Draft/Rewrite -> Editorial Reviewer -> Fact-check -> QA Gate workflow.
Only proceed if the product's official launch date is 2025-01-01 or later. If it cannot be verified, mark the queue item as blocked and report the evidence needed.
Use only approved, verifiable sources. Do not invent specifications, prices, measurements, images, retailer URLs, or test results.
Write the review to posts/${item.category}/${slug}.md only after the evidence is sufficient.
Run npm run editorial:qa -- posts/${item.category}/${slug}.md and fix all blocking failures.
Do not commit, push, open a pull request, or publish/deploy anything.
If critical facts or approved sources are missing, stop and report the blocker instead of guessing.`;
}

function printNext(queue, category, asPrompt) {
  const item = nextItem(queue, category);
  if (!item) {
    console.error(
      category
        ? `No pending review is available in "${category}".`
        : 'No pending review is available.'
    );
    process.exitCode = 1;
    return;
  }

  const output = asPrompt
    ? buildPrompt(item)
    : JSON.stringify(
        { ...item, slug: item.slug || normalizeSlug(item.product) },
        null,
        2
      );
  console.log(output);
}

function claim(queue, slug) {
  const item = queue.items.find(
    (candidate) =>
      (candidate.slug || normalizeSlug(candidate.product)) === slug
  );
  if (!item) throw new Error(`No queue item found for slug "${slug}".`);
  if ((item.status || 'pending') !== 'pending') {
    throw new Error(`Queue item "${slug}" is already ${item.status}.`);
  }
  item.status = 'in_progress';
  item.claimedAt = new Date().toISOString();
  writeQueue(queue);
  console.log(JSON.stringify(item, null, 2));
}

function complete(queue, slug, reviewPath) {
  const item = queue.items.find(
    (candidate) =>
      (candidate.slug || normalizeSlug(candidate.product)) === slug
  );
  if (!item) throw new Error(`No queue item found for slug "${slug}".`);
  if (reviewPath && !fs.existsSync(path.join(REPO_ROOT, reviewPath))) {
    throw new Error(`Review file does not exist: ${reviewPath}`);
  }
  item.status = 'completed';
  item.completedAt = new Date().toISOString();
  if (reviewPath) item.reviewPath = reviewPath;
  writeQueue(queue);
  console.log(JSON.stringify(item, null, 2));
}

function main() {
  const args = process.argv.slice(2);
  const command = args[0] || 'next';
  const categoryIndex = args.indexOf('--category');
  const category =
    categoryIndex === -1 ? null : args[categoryIndex + 1];
  const prompt = args.includes('--prompt');
  const slugIndex = args.indexOf('--slug');
  const slug = slugIndex === -1 ? null : args[slugIndex + 1];
  const reviewPathIndex = args.indexOf('--path');
  const reviewPath =
    reviewPathIndex === -1 ? null : args[reviewPathIndex + 1];
  const queue = readQueue();

  if (command === 'next') return printNext(queue, category, prompt);
  if (command === 'claim') {
    if (!slug) throw new Error('claim requires --slug <slug>.');
    return claim(queue, slug);
  }
  if (command === 'complete') {
    if (!slug) throw new Error('complete requires --slug <slug>.');
    return complete(queue, slug, reviewPath);
  }
  throw new Error(`Unknown command "${command}". Use next, claim, or complete.`);
}

try {
  main();
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
