#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

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

async function ingestEntry(entry, index, args) {
  assertSafeEntry(entry, index);

  const role = entry.role ?? 'main';
  const postPath = path.join(ROOT, 'posts', entry.category, `${entry.slug}.md`);
  if (!fs.existsSync(postPath)) {
    throw new Error(`No review found for ${entry.category}/${entry.slug}`);
  }

  const { buffer, extension } = args.dryRun
    ? { buffer: null, extension: getExtensionFromUrl(entry.sourceUrl) ?? 'webp' }
    : await downloadImage(entry);

  const fileName = `${entry.slug}_${role}.${extension}`;
  const outputDir = path.join(ROOT, 'public', 'images', 'posts', entry.category, entry.slug);
  const outputPath = path.join(outputDir, fileName);
  const publicPath = `/images/posts/${entry.category}/${entry.slug}/${fileName}`;

  if (fs.existsSync(outputPath) && !args.force) {
    throw new Error(`Refusing to overwrite existing file without --force: ${path.relative(ROOT, outputPath)}`);
  }

  if (!args.dryRun) {
    fs.mkdirSync(outputDir, { recursive: true });
    fs.writeFileSync(outputPath, buffer);

    if (entry.updateFrontmatter !== false) {
      if (role === 'main') {
        const updated = updatePostFrontmatter(postPath, {
          image: publicPath,
          productImage: publicPath,
          imageCredit: entry.credit,
          imageSource: entry.sourceName,
          imageLicense: entry.license,
        });
        fs.writeFileSync(postPath, updated);
      } else {
        appendGalleryImage(postPath, {
          src: publicPath,
          credit: entry.credit,
          source: entry.sourceName,
          license: entry.license,
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
  const entries = loadManifest(args.manifest);

  if (entries.length === 0) {
    console.log(`No images listed in ${path.relative(ROOT, args.manifest)}.`);
    console.log('Add approved image URLs to the manifest, then rerun this command.');
    return;
  }

  const results = [];
  for (let i = 0; i < entries.length; i += 1) {
    // Space out real downloads so a large manifest does not trip Wikimedia's
    // burst throttle.
    if (i > 0 && !args.dryRun) await sleep(2500);
    results.push(await ingestEntry(entries[i], i, args));
  }

  for (const result of results) {
    const action = result.dryRun ? 'Would write' : 'Wrote';
    console.log(`${action} ${result.image} -> ${result.review} (${result.source})`);
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
