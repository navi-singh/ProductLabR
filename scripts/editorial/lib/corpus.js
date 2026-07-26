'use strict';

const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const { POSTS_DIR } = require('../config');

const REPO_ROOT = path.resolve(__dirname, '..', '..', '..');

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(full) : [full];
  });
}

/**
 * Loads every review markdown file with parsed frontmatter and body.
 * Paths are returned repo-relative so reports stay portable.
 */
function loadCorpus(rootDir = REPO_ROOT) {
  const postsRoot = path.join(rootDir, POSTS_DIR);
  if (!fs.existsSync(postsRoot)) {
    throw new Error(`posts directory not found at ${postsRoot}`);
  }

  return walk(postsRoot)
    .filter((file) => file.endsWith('.md'))
    .map((file) => {
      const raw = fs.readFileSync(file, 'utf8');
      const parsed = matter(raw);
      const relPath = path.relative(rootDir, file);
      return {
        path: relPath,
        slug: path.basename(file, '.md'),
        category: path.relative(postsRoot, file).split(path.sep)[0],
        data: parsed.data || {},
        body: parsed.content || '',
        raw,
      };
    })
    .sort((a, b) => a.path.localeCompare(b.path));
}

/**
 * Derives the brand vocabulary from the corpus itself so competitor detection
 * stays accurate as new categories are added, with no hand-maintained list.
 * Brands are kept in their original capitalisation because several are also
 * ordinary English words.
 */
function buildBrandIndex(corpus) {
  const global = new Map();
  const byCategory = new Map();

  for (const post of corpus) {
    const title = String(post.data.title || '');
    const firstToken = title.trim().split(/[\s:,-]+/)[0];
    if (!firstToken || firstToken.length < 3 || !/^[A-Za-z][A-Za-z0-9&.]*$/.test(firstToken)) continue;

    const key = firstToken.toLowerCase();
    if (!global.has(key)) global.set(key, firstToken);

    if (!byCategory.has(post.category)) byCategory.set(post.category, new Map());
    const bucket = byCategory.get(post.category);
    if (!bucket.has(key)) bucket.set(key, firstToken);
  }

  return { global, byCategory };
}

module.exports = { loadCorpus, buildBrandIndex, REPO_ROOT };
