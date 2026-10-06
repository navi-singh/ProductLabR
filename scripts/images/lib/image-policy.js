'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..', '..', '..');
const EXCEPTIONS_PATH = path.join(ROOT, 'data', 'image-exceptions.json');

const IMAGE_POLICY = {
  targetPerReview: 5,
  minPerReview: 3,
  maxLifestylePerReview: 1,
  minSourceLongEdge: 800,
  maxOutputWidth: 1600,
  targetOutputBytes: 300 * 1024,
};

// Unique image paths a reader sees on the review: hero, gallery, and inline body images.
function collectReviewImages(data, body) {
  const srcs = new Set();
  const hero = data.productImage || data.image;
  if (hero) srcs.add(hero);
  for (const item of Array.isArray(data.gallery) ? data.gallery : []) {
    if (item && item.src) srcs.add(item.src);
  }
  for (const match of String(body || '').matchAll(/!\[[^\]]*\]\(([^)\s]+)/g)) {
    srcs.add(match[1]);
  }
  return [...srcs];
}

let exceptionsCache = null;

function loadImageExceptions() {
  if (exceptionsCache) return exceptionsCache;
  exceptionsCache = fs.existsSync(EXCEPTIONS_PATH)
    ? JSON.parse(fs.readFileSync(EXCEPTIONS_PATH, 'utf8')).reviews || {}
    : {};
  return exceptionsCache;
}

module.exports = { IMAGE_POLICY, collectReviewImages, loadImageExceptions, EXCEPTIONS_PATH };
