#!/usr/bin/env node

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const { IMAGE_POLICY } = require('./lib/image-policy');

const ROOT = path.join(__dirname, '..', '..');
const DEFAULT_MANIFEST = path.join(ROOT, 'data', 'product-images.json');
const MAX_IMAGE_BYTES = 12 * 1024 * 1024;

const MIME_EXTENSIONS = new Map([
  ['image/avif', 'avif'],
  ['image/jpeg', 'jpg'],
  ['image/png', 'png'],
  ['image/webp', 'webp'],
]);

function parseArgs(argv) {
  const args = {
    manifest: DEFAULT_MANIFEST,
    dryRun: false,
    force: false,
    slug: null,
    category: null,
  };

  for (let i = 2; i < argv.length; i += 1) {
    const arg = argv[i];

    if (arg === '--manifest') {
      args.manifest = path.resolve(argv[i + 1]);
      i += 1;
    } else if (arg === '--dry-run') {
      args.dryRun = true;
    } else if (arg === '--force') {
      args.force = true;
    } else if (arg === '--slug') {
      args.slug = argv[i + 1];
      i += 1;
    } else if (arg === '--category') {
      args.category = argv[i + 1];
      i += 1;
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }

  return args;
}

function loadManifest(manifestPath) {
  const parsed = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  const images = Array.isArray(parsed) ? parsed : parsed.images;

  if (!Array.isArray(images)) {
    throw new Error(`Manifest must be an array or an object with an "images" array: ${manifestPath}`);
  }

  return images;
}

// `vendored` entries document the provenance of files already committed to the
// repo whose original download URL was never recorded. They exist so the
// attribution report can account for those files; there is nothing to fetch.
function isVendored(entry) {
  return entry.vendored === true;
}

function assertSafeEntry(entry, index) {
  const location = `manifest entry ${index + 1}`;
  const required = ['category', 'slug', 'sourceUrl', 'sourceName', 'license', 'credit'];

  for (const field of required) {
    if (!entry[field] || typeof entry[field] !== 'string') {
      throw new Error(`${location} is missing required string field "${field}"`);
    }
  }

  const sourceUrl = new URL(entry.sourceUrl);
  if (sourceUrl.protocol !== 'https:') {
    throw new Error(`${location} sourceUrl must use https: ${entry.sourceUrl}`);
  }

  if (entry.role && !/^[a-z0-9-]+$/i.test(entry.role)) {
    throw new Error(`${location} role must contain only letters, numbers, and dashes`);
  }

  if (!/^[a-z0-9]+(?:[_-][a-z0-9]+)*$/i.test(entry.slug)) {
    throw new Error(`${location} has invalid slug: ${entry.slug}`);
  }
}

function getExtensionFromUrl(sourceUrl) {
  const pathname = new URL(sourceUrl).pathname.toLowerCase();
  const match = pathname.match(/\.([a-z0-9]+)$/);
  if (!match) return null;

  const extension = match[1] === 'jpeg' ? 'jpg' : match[1];
  return ['avif', 'jpg', 'png', 'webp'].includes(extension) ? extension : null;
}

function getExtension(contentType, sourceUrl) {
  const mediaType = contentType.split(';')[0].trim().toLowerCase();
  return MIME_EXTENSIONS.get(mediaType) ?? getExtensionFromUrl(sourceUrl);
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Wikimedia throttles bursts hard. Back off and retry rather than aborting a
// whole manifest run partway through.
async function fetchWithBackoff(entry) {
  const attempts = 5;

  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    const response = await fetch(entry.sourceUrl, {
      headers: {
        Accept: 'image/avif,image/webp,image/png,image/jpeg;q=0.9,*/*;q=0.8',
        'User-Agent': 'ProductLabR image ingestion (approved-source manifest)',
      },
      redirect: 'follow',
    });

    if (response.ok) return response;
    if (response.status !== 429 || attempt === attempts) {
      throw new Error(`Failed to download ${entry.sourceUrl}: ${response.status} ${response.statusText}`);
    }

    const waitMs = 15000 * attempt;
    console.log(`Rate limited, retrying in ${waitMs / 1000}s: ${entry.sourceUrl}`);
    await sleep(waitMs);
  }

  throw new Error(`Failed to download ${entry.sourceUrl}`);
}

async function downloadImage(entry) {
  const response = await fetchWithBackoff(entry);

  const contentLength = Number(response.headers.get('content-length') ?? 0);
  if (contentLength > MAX_IMAGE_BYTES) {
    throw new Error(`Image exceeds ${MAX_IMAGE_BYTES} bytes: ${entry.sourceUrl}`);
  }

  const contentType = response.headers.get('content-type') ?? '';
  const extension = getExtension(contentType, entry.sourceUrl);
  if (!extension) {
    throw new Error(`Unsupported or missing image content type "${contentType}" for ${entry.sourceUrl}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  if (buffer.length > MAX_IMAGE_BYTES) {
    throw new Error(`Downloaded image exceeds ${MAX_IMAGE_BYTES} bytes: ${entry.sourceUrl}`);
  }

  return { buffer, extension };
}

// Standardise every ingested image: WebP, capped width, no EXIF/GPS metadata
// (sharp drops it unless asked to keep it), and stepped-down quality until the
// file fits the page-weight budget.
async function processImage(buffer, entry) {
  const image = sharp(buffer, { failOn: 'error' }).rotate();
  const { width = 0, height = 0 } = await image.metadata();
  if (Math.max(width, height) < IMAGE_POLICY.minSourceLongEdge) {
    throw new Error(`Image is ${width}x${height}; long edge must be >= ${IMAGE_POLICY.minSourceLongEdge}px: ${entry.sourceUrl}`);
  }

  const resized = image.resize({ width: IMAGE_POLICY.maxOutputWidth, withoutEnlargement: true });
  let output;
  for (const quality of [82, 74, 66, 58, 50]) {
    output = await resized.clone().webp({ quality }).toBuffer();
    if (output.length <= IMAGE_POLICY.targetOutputBytes) break;
  }
  return output;
}

const HASH_SIZE = 16;

// 256-bit difference hash on the background-trimmed subject; without the trim,
// small products on flat studio backgrounds hash nearly identically.
async function differenceHash(input) {
  const flat = await sharp(input).flatten({ background: '#ffffff' }).toBuffer();
  const subject = await sharp(flat).trim({ threshold: 20 }).toBuffer().catch(() => flat);
  const pixels = await sharp(subject)
    .greyscale()
    .resize(HASH_SIZE + 1, HASH_SIZE, { fit: 'fill' })
    .raw()
    .toBuffer();
  let bits = '';
  for (let row = 0; row < HASH_SIZE; row += 1) {
    for (let col = 0; col < HASH_SIZE; col += 1) {
      const i = row * (HASH_SIZE + 1) + col;
      bits += pixels[i] > pixels[i + 1] ? '1' : '0';
    }
  }
  return bits;
}

function hammingDistance(a, b) {
  let distance = 0;
  for (let i = 0; i < a.length; i += 1) if (a[i] !== b[i]) distance += 1;
  return distance;
}

const NEAR_DUPLICATE_BITS = 24;
const IMAGE_FILE = /\.(avif|jpe?g|png|webp)$/i;

function sha256(buffer) {
  return crypto.createHash('sha256').update(buffer).digest('hex');
}

function buildHashIndex() {
  const root = path.join(ROOT, 'public', 'images', 'posts');
  const index = new Map();
  if (!fs.existsSync(root)) return index;
  const walk = (dir) => {
    for (const dirent of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, dirent.name);
      if (dirent.isDirectory()) walk(full);
      else if (IMAGE_FILE.test(dirent.name)) index.set(sha256(fs.readFileSync(full)), path.relative(ROOT, full));
    }
  };
  walk(root);
  return index;
}

async function assertNotDuplicate(output, outputDir, outputPath, hashIndex) {
  const existing = hashIndex.get(sha256(output));
  if (existing && path.join(ROOT, existing) !== outputPath) {
    throw new Error(`Byte-identical to ${existing}`);
  }

  if (!fs.existsSync(outputDir)) return;
  const hash = await differenceHash(output);
  for (const file of fs.readdirSync(outputDir)) {
    const full = path.join(outputDir, file);
    if (!IMAGE_FILE.test(file) || full === outputPath) continue;
    if (hammingDistance(hash, await differenceHash(full)) <= NEAR_DUPLICATE_BITS) {
      throw new Error(`Near-duplicate of ${path.relative(ROOT, full)}`);
    }
  }
}

function findExistingRoleFile(outputDir, slug, role) {
  if (!fs.existsSync(outputDir)) return null;
  const file = fs.readdirSync(outputDir).find((name) => name.replace(/\.[a-z0-9]+$/i, '') === `${slug}_${role}`);
  return file ? path.join(outputDir, file) : null;
}

function quoteYaml(value) {
  return JSON.stringify(value);
}

function upsertFrontmatterField(frontmatter, key, value) {
  const line = `${key}: ${quoteYaml(value)}`;
  const fieldRe = new RegExp(`^${key}:.*$`, 'm');

  if (fieldRe.test(frontmatter)) {
    return frontmatter.replace(fieldRe, line);
  }

  return `${frontmatter.trimEnd()}\n${line}`;
}

function updatePostFrontmatter(postPath, fields) {
  const text = fs.readFileSync(postPath, 'utf8');
  const match = text.match(/^---\n([\s\S]*?)\n---/);

  if (!match) {
    throw new Error(`Missing YAML frontmatter: ${path.relative(ROOT, postPath)}`);
  }

  let frontmatter = match[1];
  for (const [key, value] of Object.entries(fields)) {
    frontmatter = upsertFrontmatterField(frontmatter, key, value);
  }

  return text.replace(/^---\n[\s\S]*?\n---/, `---\n${frontmatter}\n---`);
}

// Appends a non-primary angle/gallery photo as a YAML list item under a
// `gallery:` frontmatter key, creating the key if it doesn't exist yet.
function appendGalleryImage(postPath, image) {
  const text = fs.readFileSync(postPath, 'utf8');
  const match = text.match(/^---\n([\s\S]*?)\n---/);

  if (!match) {
    throw new Error(`Missing YAML frontmatter: ${path.relative(ROOT, postPath)}`);
  }

  const frontmatter = match[1];
  const lines = frontmatter.split('\n');
  const itemLines = [
    `  - src: ${quoteYaml(image.src)}`,
    `    credit: ${quoteYaml(image.credit)}`,
    `    source: ${quoteYaml(image.source)}`,
    `    license: ${quoteYaml(image.license)}`,
    ...(image.alt ? [`    alt: ${quoteYaml(image.alt)}`] : []),
  ];

  const galleryLineIndex = lines.findIndex((line) => /^gallery:\s*$/.test(line));

  if (galleryLineIndex === -1) {
    lines.push('gallery:', ...itemLines);
  } else {
    let insertAt = galleryLineIndex + 1;
    while (insertAt < lines.length && /^\s+\S/.test(lines[insertAt])) {
      insertAt += 1;
    }

    // Re-ingesting the same role must refresh the entry in place, not stack a
    // second copy of the same image onto the gallery.
    const existingAt = lines.findIndex(
      (line, i) =>
        i > galleryLineIndex && i < insertAt && line.trim() === `- src: ${quoteYaml(image.src)}`
    );

    if (existingAt === -1) {
      lines.splice(insertAt, 0, ...itemLines);
    } else {
      let end = existingAt + 1;
      while (end < insertAt && !/^\s*-\s/.test(lines[end])) end += 1;
      lines.splice(existingAt, end - existingAt, ...itemLines);
    }
  }

  const updatedFrontmatter = lines.join('\n');
  fs.writeFileSync(
    postPath,
    text.replace(/^---\n[\s\S]*?\n---/, `---\n${updatedFrontmatter}\n---`)
  );
}

async function ingestEntry(entry, index, args, hashIndex) {
  assertSafeEntry(entry, index);

  const role = entry.role ?? 'main';
  const postPath = path.join(ROOT, 'posts', entry.category, `${entry.slug}.md`);
  if (!fs.existsSync(postPath)) {
    throw new Error(`No review found for ${entry.category}/${entry.slug}`);
  }

  const fileName = `${entry.slug}_${role}.webp`;
  const outputDir = path.join(ROOT, 'public', 'images', 'posts', entry.category, entry.slug);
  const outputPath = path.join(outputDir, fileName);
  const publicPath = `/images/posts/${entry.category}/${entry.slug}/${fileName}`;

  // Already-ingested roles are the normal case on a re-run, not an error.
  const existingFile = findExistingRoleFile(outputDir, entry.slug, role);
  if (existingFile && !args.force) {
    return { skipped: true };
  }

  if (!args.dryRun) {
    await args.throttle();
    const { buffer } = await downloadImage(entry);
    const output = await processImage(buffer, entry);
    await assertNotDuplicate(output, outputDir, existingFile ?? outputPath, hashIndex);

    fs.mkdirSync(outputDir, { recursive: true });
    if (existingFile && existingFile !== outputPath) {
      fs.unlinkSync(existingFile);
      // Re-point gallery and inline references at the new .webp so a forced
      // refresh never leaves the post linking to the deleted file.
      const oldPublicPath = `/images/posts/${entry.category}/${entry.slug}/${path.basename(existingFile)}`;
      fs.writeFileSync(postPath, fs.readFileSync(postPath, 'utf8').split(oldPublicPath).join(publicPath));
    }
    fs.writeFileSync(outputPath, output);
    hashIndex.set(sha256(output), path.relative(ROOT, outputPath));

    if (entry.updateFrontmatter !== false) {
      if (role === 'main') {
        const updated = updatePostFrontmatter(postPath, {
          image: publicPath,
          productImage: publicPath,
          imageCredit: entry.credit,
          imageSource: entry.sourceName,
          imageLicense: entry.license,
          ...(entry.alt ? { imageAlt: entry.alt } : {}),
        });
        fs.writeFileSync(postPath, updated);
      } else {
        appendGalleryImage(postPath, {
          src: publicPath,
          credit: entry.credit,
          source: entry.sourceName,
          license: entry.license,
          alt: entry.alt,
        });
      }
    }
  }

  return {
    review: path.relative(ROOT, postPath),
    image: path.relative(ROOT, outputPath),
    publicPath,
    source: entry.sourceName,
    dryRun: args.dryRun,
  };
}

async function main() {
  const args = parseArgs(process.argv);
  const allEntries = loadManifest(args.manifest);
  const vendoredCount = allEntries.filter(isVendored).length;
  const entries = allEntries
    .filter((entry) => !isVendored(entry))
    .filter((entry) => !args.slug || entry.slug === args.slug)
    .filter((entry) => !args.category || entry.category === args.category);

  if (vendoredCount > 0) {
    console.log(`Skipping ${vendoredCount} vendored entr${vendoredCount === 1 ? 'y' : 'ies'} (already in the repo, nothing to download).`);
  }

  if (entries.length === 0) {
    console.log(`No downloadable images listed in ${path.relative(ROOT, args.manifest)}.`);
    console.log('Add approved image URLs to the manifest, then rerun this command.');
    return;
  }

  const hashIndex = args.dryRun ? new Map() : buildHashIndex();
  const results = [];
  const failures = [];
  let skipped = 0;
  let fetched = false;
  // Space out real downloads so a large manifest does not trip Wikimedia's
  // burst throttle.
  args.throttle = async () => {
    if (fetched) await sleep(2500);
    fetched = true;
  };
  for (let i = 0; i < entries.length; i += 1) {
    try {
      const result = await ingestEntry(entries[i], i, args, hashIndex);
      if (result.skipped) {
        skipped += 1;
        continue;
      }
      results.push(result);
    } catch (error) {
      // A single stubborn URL (e.g. sustained 429s) must not abort the rest
      // of a large manifest; record it and keep going.
      failures.push({ entry: entries[i], message: error instanceof Error ? error.message : String(error) });
      console.error(`Skipped entry ${i + 1} (${entries[i].slug}/${entries[i].role ?? 'main'}): ${error instanceof Error ? error.message : error}`);
    }
  }

  for (const result of results) {
    const action = result.dryRun ? 'Would write' : 'Wrote';
    console.log(`${action} ${result.image} -> ${result.review} (${result.source})`);
  }

  if (skipped > 0) console.log(`Skipped ${skipped} entr${skipped === 1 ? 'y' : 'ies'} already on disk (use --force to refresh).`);

  if (failures.length > 0) {
    console.log(`\n${failures.length} entr${failures.length === 1 ? 'y' : 'ies'} failed and were skipped:`);
    for (const failure of failures) {
      console.log(`  ${failure.entry.slug}/${failure.entry.role ?? 'main'}: ${failure.message}`);
    }
    process.exitCode = 1;
  }
}

if (require.main === module) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  });
}

module.exports = { differenceHash, hammingDistance, NEAR_DUPLICATE_BITS };
