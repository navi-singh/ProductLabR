'use strict';

/**
 * Single source of truth for review-queue shape, eligibility, and slug rules.
 *
 * review-queue.js (manual) and review-worker.js (automated) both consume this so
 * their notions of "what is eligible" cannot drift apart.
 */

const fs = require('fs');
const path = require('path');

const REPO_ROOT = path.join(__dirname, '..', '..');
const QUEUE_PATH = path.join(REPO_ROOT, 'data', 'review-queue.json');
const POSTS_DIR = path.join(REPO_ROOT, 'posts');

const ALLOWED_CATEGORIES = new Set([
  'portable-power-stations',
  'smart-generators',
]);

// Source articles that are not a single-product review (round-ups, guides, re-reviews).
const ROUNDUP_RE = new RegExp(
  [
    '(?:^|_)(?:best|guide|comparison|revisit|vs)(?:_|$)',
    '(?:^|_)testing_\\d',
    '_power_stations(?:_|$)',
  ].join('|'),
  'i'
);

// Hardware that is not a power station or generator.
const NON_PRODUCT_RE =
  /(?:^|_)(?:mount|charger|kit|ground|split|bike|cooler|fridge|battery|inverter|panel|transfer|accessory)(?:_|$)/i;

// An in_progress claim older than this is assumed dead and is reclaimable.
const STALE_CLAIM_MS = 6 * 60 * 60 * 1000;

function normalizeSlug(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
}

function slugFor(item) {
  return item.slug || normalizeSlug(item.product);
}

function isExcluded(item) {
  const slug = slugFor(item);
  return ROUNDUP_RE.test(slug) || NON_PRODUCT_RE.test(slug);
}

/**
 * "Testing the Anker F3800" is a review of the Anker F3800, not of a product
 * called "Testing the Anker F3800". Strip the editorial framing for the prompt.
 */
function displayProduct(item) {
  return String(item.product || '')
    .replace(/^\s*testing\s+the\s+/i, '')
    .replace(/\s+review$/i, '')
    .trim();
}

function hasReview(item) {
  return fs.existsSync(path.join(POSTS_DIR, item.category, `${slugFor(item)}.md`));
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

function readQueue() {
  const queue = JSON.parse(fs.readFileSync(QUEUE_PATH, 'utf8'));
  if (!queue || !Array.isArray(queue.items)) {
    throw new Error('data/review-queue.json must contain an items array.');
  }
  queue.items.forEach(validateItem);
  return queue;
}

function writeQueue(queue) {
  fs.writeFileSync(QUEUE_PATH, `${JSON.stringify(queue, null, 2)}\n`);
}

function findItem(queue, slug) {
  return queue.items.find((item) => slugFor(item) === slug);
}

/**
 * Deliberately does NOT gate on a source date. The only date the source exposes
 * is a site-wide CMS republish stamp, so it cannot establish product recency;
 * the agent verifies the product's real launch date during the brief step.
 */
function isEligible(item, category) {
  return (
    ALLOWED_CATEGORIES.has(item.category) &&
    !isExcluded(item) &&
    (!category || item.category === category) &&
    (item.status || 'pending') === 'pending' &&
    !hasReview(item)
  );
}

function findEligible(queue, category, slug) {
  if (slug) {
    return queue.items.find(
      (item) => slugFor(item) === slug && isEligible(item, category)
    );
  }
  return queue.items.find((item) => isEligible(item, category));
}

/** Return in_progress items whose claim is old enough to assume the run died. */
function staleClaims(queue, now = Date.now()) {
  return queue.items.filter(
    (item) =>
      item.status === 'in_progress' &&
      (!item.claimedAt || now - Date.parse(item.claimedAt) > STALE_CLAIM_MS)
  );
}

/**
 * A launch-date block is permanent: the product simply predates the 2025 cutoff, so
 * retrying it only burns another full research run. Everything else is transient.
 */
function classifyBlocker(message) {
  return /launch date|2025-01-01/i.test(message || '') ? 'launch-date' : 'error';
}

function resetItem(item) {
  item.status = 'pending';
  delete item.claimedAt;
  delete item.completedAt;
  delete item.blockedAt;
  delete item.blocker;
  delete item.blockerKind;
  delete item.reviewPath;
  return item;
}

module.exports = {
  ALLOWED_CATEGORIES,
  classifyBlocker,
  POSTS_DIR,
  QUEUE_PATH,
  REPO_ROOT,
  STALE_CLAIM_MS,
  displayProduct,
  findEligible,
  findItem,
  hasReview,
  isEligible,
  isExcluded,
  normalizeSlug,
  readQueue,
  resetItem,
  slugFor,
  staleClaims,
  writeQueue,
};
