#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..', '..');
const POSTS_DIR = path.join(ROOT, 'posts');
const PUBLIC_DIR = path.join(ROOT, 'public');
const PLACEHOLDER = '/images/placeholder-product.svg';

function parseArgs(argv) {
  const args = { json: false, category: null };

  for (let i = 2; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--json') {
      args.json = true;
    } else if (arg === '--category') {
      args.category = argv[i + 1];
      i += 1;
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }

  return args;
}

function readFrontmatter(filePath) {
  const text = fs.readFileSync(filePath, 'utf8');
  const match = text.match(/^---\n([\s\S]*?)\n---/);
  return match ? match[1] : '';
}

function readScalar(frontmatter, key) {
  const match = frontmatter.match(new RegExp(`^${key}:\\s*["']?([^"'\\n]+)["']?\\s*$`, 'm'));
  return match ? match[1].trim() : '';
}

function existsLocalImage(src) {
  if (!src || !src.startsWith('/images/')) return true;
  return fs.existsSync(path.join(PUBLIC_DIR, src));
}

function getPosts() {
  if (!fs.existsSync(POSTS_DIR)) return [];

  return fs
    .readdirSync(POSTS_DIR, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .flatMap((dirent) => {
      const category = dirent.name;
      const categoryDir = path.join(POSTS_DIR, category);

      return fs
        .readdirSync(categoryDir)
        .filter((file) => file.endsWith('.md'))
        .map((file) => {
          const slug = file.replace(/\.md$/, '');
          const filePath = path.join(categoryDir, file);
          const frontmatter = readFrontmatter(filePath);
          const image = readScalar(frontmatter, 'image');
          const productImage = readScalar(frontmatter, 'productImage');

          return {
            category,
            slug,
            file: path.relative(ROOT, filePath),
            image,
            productImage,
            noImage: !image && !productImage,
            usesPlaceholder: image === PLACEHOLDER || productImage === PLACEHOLDER,
            missingImage: Boolean(image) && !existsLocalImage(image),
            missingProductImage: Boolean(productImage) && !existsLocalImage(productImage),
          };
        });
    });
}

// Files on disk that no manifest entry accounts for. Without a recorded
// source and licence we cannot show that we are entitled to publish them.
function unattributedFiles() {
  const manifestPath = path.join(ROOT, 'data', 'product-images.json');
  if (!fs.existsSync(manifestPath)) return [];
  const { images } = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  const known = new Set(images.map((entry) => `${entry.category}/${entry.slug}`));

  const root = path.join(PUBLIC_DIR, 'images', 'posts');
  if (!fs.existsSync(root)) return [];

  const out = [];
  const isImage = (name) => /\.(avif|gif|jpe?g|png|svg|webp)$/i.test(name);
  const walk = (dir) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (isImage(entry.name)) {
        const rel = path.relative(root, full).split(path.sep);
        if (!known.has(`${rel[0]}/${rel[1]}`)) out.push(path.relative(ROOT, full));
      }
    }
  };
  walk(root);
  return out;
}

function main() {
  const args = parseArgs(process.argv);
  let posts = getPosts();

  if (args.category) {
    posts = posts.filter((post) => post.category === args.category);
  }

  // An absent image field is the gap, not the absence of a gap. This reported
  // zero outstanding work while 133 of 149 reviews had no product photo,
  // because it only looked for a placeholder value or a broken path.
  const rows = posts.filter(
    (post) => post.noImage || post.usesPlaceholder || post.missingImage || post.missingProductImage
  );
  const unattributed = unattributedFiles();

  if (args.json) {
    console.log(
      JSON.stringify(
        {
          totalPosts: posts.length,
          needsImages: rows.length,
          noImageCount: rows.filter((post) => post.noImage).length,
          unattributedFiles: unattributed,
          placeholderCount: rows.filter((post) => post.usesPlaceholder).length,
          missingLocalFileCount: rows.filter((post) => post.missingImage || post.missingProductImage).length,
          posts: rows,
        },
        null,
        2
      )
    );
    return;
  }

  console.log(`Scanned ${posts.length} reviews.`);
  console.log(`${rows.length} reviews need product-image work.`);
  console.log(`${rows.filter((post) => post.noImage).length} have no product image at all.`);
  console.log('');

  if (unattributed.length) {
    console.log(`${unattributed.length} image files have no manifest provenance:`);
    for (const file of unattributed) console.log(`  ${file}`);
    console.log('');
  }

  for (const post of rows) {
    const reasons = [
      post.noImage ? 'no image' : null,
      post.usesPlaceholder ? 'placeholder' : null,
      post.missingImage ? 'missing image' : null,
      post.missingProductImage ? 'missing productImage' : null,
    ].filter(Boolean);

    console.log(`${post.file}  (${reasons.join(', ')})`);
  }
}

try {
  main();
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
}
