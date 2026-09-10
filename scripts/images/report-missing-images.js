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
            usesPlaceholder: image === PLACEHOLDER || productImage === PLACEHOLDER,
            missingImage: !existsLocalImage(image),
            missingProductImage: !existsLocalImage(productImage),
          };
        });
    });
}

function main() {
  const args = parseArgs(process.argv);
  let posts = getPosts();

  if (args.category) {
    posts = posts.filter((post) => post.category === args.category);
  }

  const rows = posts.filter((post) => post.usesPlaceholder || post.missingImage || post.missingProductImage);

  if (args.json) {
    console.log(
      JSON.stringify(
        {
          totalPosts: posts.length,
          needsImages: rows.length,
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
  console.log('');

  for (const post of rows) {
    const reasons = [
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
