#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const REPO_ROOT = path.join(__dirname, '..');
const POSTS_DIR = path.join(REPO_ROOT, 'posts');
const QUEUE_PATH = path.join(REPO_ROOT, 'data', 'review-queue.json');
const DEFAULT_SITEMAP = 'https://www.thesolarlab.com/sitemap.xml';

function normalize(value) {
  return value
    .toLowerCase()
    .replace(/(?:^|[-_])(?:gen|generation)[-_](\d+)(?=[-_]|$)/g, '_$1')
    .replace(/(?:-review|-full-system|-power-station)$/g, '')
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
}

function titleFromSlug(slug) {
  return slug
    .replace(/-review$/i, '')
    .split('-')
    .filter(Boolean)
    .map((part) => (/^\d+$/.test(part) ? part : part[0].toUpperCase() + part.slice(1)))
    .join(' ');
}

function isComparisonSlug(slug) {
  return /(?:^|-)(?:vs|versus)(?:-|$)/i.test(slug);
}

function isNonProductSlug(slug) {
  return /(?:^|-)(?:best|top|complete|guide|how|testing|comparison|revisit|bundle|mount|charger|kit|ground|split|bike|cooler|fridge|battery|inverter|panel|transfer|accessory)(?:-|$)/i.test(slug);
}

function categoryForSlug(slug) {
  if (/(?:generator)/i.test(slug)) return 'smart-generators';
  return 'portable-power-stations';
}

function readQueue() {
  const queue = JSON.parse(fs.readFileSync(QUEUE_PATH, 'utf8'));
  if (!queue || !Array.isArray(queue.items)) {
    throw new Error('data/review-queue.json must contain an items array.');
  }
  return queue;
}

function existingReviewKeys() {
  const keys = new Set();
  for (const category of fs.readdirSync(POSTS_DIR, { withFileTypes: true })) {
    if (!category.isDirectory()) continue;
    for (const file of fs.readdirSync(path.join(POSTS_DIR, category.name))) {
      if (file.endsWith('.md')) keys.add(normalize(file.slice(0, -3)));
    }
  }
  return keys;
}

async function fetchText(url) {
  const response = await fetch(url, {
    headers: { 'user-agent': 'ProductLabR-review-discovery/1.0' },
  });
  if (!response.ok) throw new Error(`Failed to fetch ${url}: HTTP ${response.status}`);
  return response.text();
}

function parseReviewUrls(xml) {
  return [...xml.matchAll(/<loc>(https:\/\/www\.thesolarlab\.com\/review\/[^<]+)<\/loc>/g)]
    .map((match) => match[1])
    .filter((url) => {
      const slug = url.split('/').pop();
      return !isComparisonSlug(slug) && !isNonProductSlug(slug);
    });
}

async function main() {
  const sitemapUrl = process.argv[2] || DEFAULT_SITEMAP;
  const xml = await fetchText(sitemapUrl);
  const reviewUrls = parseReviewUrls(xml);
  const existing = existingReviewKeys();
  const queue = readQueue();
  const queued = new Set(
    queue.items.map((item) => normalize(item.slug || item.product))
  );
  const discovered = [];

  for (const sourceUrl of reviewUrls) {
    const sourceSlug = sourceUrl.split('/').pop();
    const key = normalize(sourceSlug);
    if (!key || existing.has(key) || queued.has(key)) continue;

    const product = titleFromSlug(sourceSlug);
    const category = categoryForSlug(sourceSlug);
    if (!['portable-power-stations', 'smart-generators'].includes(category)) {
      continue;
    }
    queue.items.push({
      category,
      product,
      slug: key,
      sourceUrl,
      launchDate: null,
      launchDateStatus: 'needs_verification',
      brief: `Use the source URL only as a discovery lead. Build an independent evidence brief from approved primary and reputable secondary sources before drafting.`,
      status: 'pending',
    });
    queued.add(key);
    discovered.push({ category, product, slug: key, sourceUrl });
  }

  fs.writeFileSync(QUEUE_PATH, `${JSON.stringify(queue, null, 2)}\n`);
  console.log(JSON.stringify({
    sitemapUrl,
    reviewUrlsFound: reviewUrls.length,
    newQueueItems: discovered.length,
    items: discovered,
  }, null, 2));
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
