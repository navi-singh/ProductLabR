#!/usr/bin/env node
'use strict';

/**
 * Replaces placeholder ("#") retailer links with real, verifiable retailer
 * search URLs derived from the product title.
 *
 *   node scripts/editorial/fix-links.js              # dry run
 *   node scripts/editorial/fix-links.js --write      # apply
 *   node scripts/editorial/fix-links.js --category smart-home --write
 *
 * Policy: we never invent product-detail URLs. Marketplace search URLs are a
 * pattern already used elsewhere in the corpus and always resolve. Brand-direct
 * placeholders whose official URL cannot be verified are dropped rather than
 * guessed, and the entry is topped up with a known marketplace instead.
 */

const fs = require('fs');
const path = require('path');

const { loadCorpus, REPO_ROOT } = require('./lib/corpus');

// Retailers whose public search endpoint is stable and verifiable.
const SEARCH_URL = {
  Amazon: (q) => `https://www.amazon.com/s?k=${encodeURIComponent(q)}`,
  BestBuy: (q) => `https://www.bestbuy.com/site/searchpage.jsp?st=${encodeURIComponent(q)}`,
  Walmart: (q) => `https://www.walmart.com/search?q=${encodeURIComponent(q)}`,
  Target: (q) => `https://www.target.com/s?searchTerm=${encodeURIComponent(q)}`,
  BHPhoto: (q) => `https://www.bhphotovideo.com/c/search?q=${encodeURIComponent(q)}`,
  Adorama: (q) => `https://www.adorama.com/l/?searchinfo=${encodeURIComponent(q)}`,
  Newegg: (q) => `https://www.newegg.com/p/pl?d=${encodeURIComponent(q)}`,
  Ebay: (q) => `https://www.ebay.com/sch/i.html?_nkw=${encodeURIComponent(q)}`,
  REI: (q) => `https://www.rei.com/search?q=${encodeURIComponent(q)}`,
};

// Order used to top an article back up to the minimum link count.
const FALLBACK_ORDER = ['Amazon', 'BestBuy', 'Walmart'];
const MIN_LINKS = 3;

// Category-aware preference so camera reviews get a camera retailer.
const CATEGORY_PREFERRED = {
  cameras: ['Amazon', 'BHPhoto', 'Adorama'],
  laptops: ['Amazon', 'BestBuy', 'Newegg'],
  monitors: ['Amazon', 'BestBuy', 'Newegg'],
  gaming: ['Amazon', 'BestBuy', 'Newegg'],
  'knives-tools': ['Amazon', 'REI', 'Walmart'],
};

function isPlaceholder(url) {
  const value = String(url || '').trim();
  return value === '' || value.startsWith('#');
}

/**
 * Builds a search query from the slug, which is a clean product identifier
 * corpus-wide. Titles are editorial and often lead with a hook rather than the
 * product name, so they are only a fallback.
 */
function searchQuery(post) {
  const fromSlug = post.slug.replace(/[_-]+/g, ' ').replace(/\s+/g, ' ').trim();
  if (fromSlug) return fromSlug;
  return String(post.data.title || '')
    .replace(/\breview\b/gi, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/** True when a URL is one this script previously generated, so --force can refresh it. */
function isGeneratedSearchUrl(url) {
  return /^https:\/\/www\.(amazon\.com\/s\?k=|bestbuy\.com\/site\/searchpage\.jsp\?st=|walmart\.com\/search\?q=|target\.com\/s\?searchTerm=|bhphotovideo\.com\/c\/search\?q=|adorama\.com\/l\/\?searchinfo=|newegg\.com\/p\/pl\?d=|ebay\.com\/sch\/i\.html\?_nkw=|rei\.com\/search\?q=)/.test(
    String(url || '')
  );
}

function resolveRetailer(name) {
  if (SEARCH_URL[name]) return name;
  const compact = name.replace(/\s+/g, '');
  if (SEARCH_URL[compact]) return compact;
  const alias = {
    'B&HPhoto': 'BHPhoto',
    BH: 'BHPhoto',
    eBay: 'Ebay',
    BestBuyStore: 'BestBuy',
  }[compact];
  return alias || null;
}

function rewriteLinks(post, force = false) {
  const links =
    post.data.retailerLinks && typeof post.data.retailerLinks === 'object' ? post.data.retailerLinks : {};

  const query = searchQuery(post);
  const next = {};
  const dropped = [];
  let changed = false;

  for (const [name, url] of Object.entries(links)) {
    const regenerate = isPlaceholder(url) || (force && isGeneratedSearchUrl(url));
    if (!regenerate) {
      next[name] = String(url);
      continue;
    }
    const resolved = resolveRetailer(name);
    if (resolved) {
      const built = SEARCH_URL[resolved](query);
      if (built !== String(url)) changed = true;
      next[resolved] = built;
    } else {
      dropped.push(name);
      changed = true;
    }
  }

  const preferred = CATEGORY_PREFERRED[post.category] || FALLBACK_ORDER;
  for (const name of preferred) {
    if (Object.keys(next).length >= MIN_LINKS) break;
    if (!next[name]) {
      next[name] = SEARCH_URL[name](query);
      changed = true;
    }
  }

  return changed ? { next, dropped, query } : null;
}

function serializeLinks(links) {
  const lines = ['retailerLinks:'];
  for (const [name, url] of Object.entries(links)) {
    const key = /^[A-Za-z][A-Za-z0-9]*$/.test(name) ? name : `"${name}"`;
    lines.push(`  ${key}: "${url}"`);
  }
  return lines.join('\n');
}

/**
 * Splices the new block into the raw file so untouched frontmatter keys keep
 * their original formatting, comments and ordering.
 */
function applyToRaw(raw, links) {
  const lines = raw.split(/\r?\n/);
  const replacement = serializeLinks(links).split('\n');
  const start = lines.findIndex((l) => /^retailerLinks:\s*$/.test(l));

  if (start === -1) {
    // No block yet: insert just above ratingBreakdown, else at end of frontmatter.
    const anchor = lines.findIndex((l) => /^ratingBreakdown:\s*$/.test(l));
    if (anchor > 0) {
      return [...lines.slice(0, anchor), ...replacement, ...lines.slice(anchor)].join('\n');
    }
    const fmEnd = lines.indexOf('---', 1);
    if (fmEnd === -1) return null;
    return [...lines.slice(0, fmEnd), ...replacement, ...lines.slice(fmEnd)].join('\n');
  }

  let end = start + 1;
  while (end < lines.length && (/^\s+\S/.test(lines[end]) || lines[end].trim() === '')) {
    if (lines[end].trim() === '' && end + 1 < lines.length && !/^\s+\S/.test(lines[end + 1])) break;
    end += 1;
  }

  return [...lines.slice(0, start), ...replacement, ...lines.slice(end)].join('\n');
}

function main() {
  const argv = process.argv.slice(2);
  const write = argv.includes('--write');
  const force = argv.includes('--force');
  const categoryIndex = argv.indexOf('--category');
  const category = categoryIndex >= 0 ? argv[categoryIndex + 1] : null;

  const corpus = loadCorpus(REPO_ROOT).filter((p) => (category ? p.category === category : true));

  let updated = 0;
  const allDropped = new Set();

  for (const post of corpus) {
    const result = rewriteLinks(post, force);
    if (!result) continue;

    const nextRaw = applyToRaw(post.raw, result.next);
    if (!nextRaw) {
      console.error(`  !! could not locate retailerLinks block in ${post.path}`);
      continue;
    }

    updated += 1;
    result.dropped.forEach((d) => allDropped.add(d));
    console.log(`${write ? 'fixed ' : 'would fix '}${post.path}  (query: "${result.query}")`);
    for (const [name, url] of Object.entries(result.next)) {
      console.log(`    ${name}: ${url}`);
    }
    if (result.dropped.length) console.log(`    dropped unverifiable: ${result.dropped.join(', ')}`);

    if (write) fs.writeFileSync(path.join(REPO_ROOT, post.path), nextRaw, 'utf8');
  }

  console.log('');
  console.log(`${write ? 'Updated' : 'Would update'} ${updated} of ${corpus.length} articles.`);
  if (allDropped.size) {
    console.log(`Dropped brand-direct retailers (no verifiable URL): ${[...allDropped].sort().join(', ')}`);
  }
  if (!write) console.log('Dry run only. Re-run with --write to apply.');
}

main();
