#!/usr/bin/env node

// Distributes a review's `gallery` images into the article body, placing each
// one under a section where a photo actually helps the reader (design, build,
// unboxing, display) rather than dumping them all in one strip.

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..', '..');
const POSTS_DIR = path.join(ROOT, 'posts');

// Sections where a product photo earns its place, best first. A reader looking
// at "Design & Build" wants to see the thing; a reader in "FAQ" does not.
const PREFERRED_SECTIONS = [
  /unboxing|first impressions/i,
  /design|build|hardware|aesthetic/i,
  /display|screen|picture quality/i,
  /comfort|fit|wearing|ergonomic/i,
  /sound quality|audio|performance|everyday use/i,
  /features|connectivity|software|interface/i,
];

// Sections that should never receive a photo: they are text verdicts, and an
// image there reads as filler.
const EXCLUDED_SECTIONS = /verdict|conclusion|faq|frequently asked|who should buy|who it's for|bottom line|competitive/i;

function parseArgs(argv) {
  const args = { dryRun: false, slug: null, force: false };

  for (let i = 2; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--dry-run') args.dryRun = true;
    else if (arg === '--force') args.force = true;
    else if (arg === '--slug') {
      args.slug = argv[i + 1];
      i += 1;
    } else throw new Error(`Unknown argument: ${arg}`);
  }

  return args;
}

function splitFrontmatter(text) {
  const match = text.match(/^---\n([\s\S]*?)\n---\n?/);
  if (!match) return null;
  return { frontmatter: match[1], body: text.slice(match[0].length) };
}

// The gallery block is simple, machine-generated YAML, so a targeted reader
// avoids pulling a YAML parser into a plain Node script.
function readGallery(frontmatter) {
  const lines = frontmatter.split('\n');
  const start = lines.findIndex((line) => /^gallery:\s*$/.test(line));
  if (start === -1) return [];

  const images = [];
  let current = null;

  for (let i = start + 1; i < lines.length; i += 1) {
    const line = lines[i];
    if (!/^\s+\S/.test(line)) break;

    const itemMatch = line.match(/^\s*-\s*src:\s*"(.*)"\s*$/);
    if (itemMatch) {
      if (current) images.push(current);
      current = { src: itemMatch[1] };
      continue;
    }

    const fieldMatch = line.match(/^\s+(credit|source|license):\s*"(.*)"\s*$/);
    if (fieldMatch && current) current[fieldMatch[1]] = fieldMatch[2];
  }

  if (current) images.push(current);
  return images;
}

function readTitle(frontmatter) {
  const match = frontmatter.match(/^title:\s*"(.*)"\s*$/m);
  return match ? match[1] : '';
}

// Product name for alt text: the part of the headline before the marketing
// colon, e.g. "Apple AirPods Max: Premium Build..." -> "Apple AirPods Max".
function productName(title) {
  return title.split(':')[0].replace(/\s+Review$/i, '').trim();
}

function buildCaption(image) {
  const parts = [];
  if (image.credit) parts.push(image.credit);
  if (image.source) parts.push(image.source);
  const attribution = parts.join(' / ');
  return image.license ? `${attribution} (${image.license})` : attribution;
}

function findSections(body) {
  const lines = body.split('\n');
  const sections = [];

  lines.forEach((line, index) => {
    const match = line.match(/^##\s+(.*)$/);
    if (match) sections.push({ heading: match[1].trim(), lineIndex: index });
  });

  return sections;
}

// An image belongs after the section's opening prose, not jammed between the
// heading and its first sentence.
function findInsertLine(lines, section, nextSection) {
  const limit = nextSection ? nextSection.lineIndex : lines.length;
  let paragraphEnds = 0;

  for (let i = section.lineIndex + 1; i < limit; i += 1) {
    const line = lines[i].trim();
    const isBlank = line === '';
    const prev = i > 0 ? lines[i - 1].trim() : '';

    if (isBlank && prev !== '' && !prev.startsWith('#')) {
      paragraphEnds += 1;
      // After the first full paragraph the reader has context for the photo.
      if (paragraphEnds >= 1) return i;
    }
  }

  return -1;
}

function rankSections(sections) {
  const ranked = [];

  sections.forEach((section, index) => {
    if (EXCLUDED_SECTIONS.test(section.heading)) return;
    if (/^introduction$/i.test(section.heading)) return;

    const priority = PREFERRED_SECTIONS.findIndex((re) => re.test(section.heading));
    if (priority === -1) return;

    ranked.push({ ...section, index, priority });
  });

  ranked.sort((a, b) => a.priority - b.priority || a.index - b.index);
  return ranked;
}

function placeImages(postPath, args) {
  const text = fs.readFileSync(postPath, 'utf8');
  const parts = splitFrontmatter(text);
  if (!parts) return null;

  const gallery = readGallery(parts.frontmatter);
  if (gallery.length === 0) return null;

  const name = productName(readTitle(parts.frontmatter));

  const alreadyPlaced = gallery.filter((image) => parts.body.includes(image.src));
  if (alreadyPlaced.length > 0 && !args.force) {
    return { postPath, skipped: true, reason: 'body already references gallery images' };
  }

  const lines = parts.body.split('\n');
  const sections = findSections(lines.join('\n'));
  const candidates = rankSections(sections);

  // Pick the best-suited sections by relevance, then restore document order so
  // the gallery reads front-to-back rather than jumping around the article.
  const targets = candidates
    .slice(0, gallery.length)
    .sort((a, b) => a.index - b.index);

  const placements = [];
  targets.forEach((target, i) => {
    const image = gallery[i];
    if (!image) return;

    const nextSection = sections[target.index + 1];
    const insertLine = findInsertLine(lines, target, nextSection);
    if (insertLine === -1) return;

    placements.push({ insertLine, image, heading: target.heading });
  });

  if (placements.length === 0) {
    return { postPath, skipped: true, reason: 'no suitable section found' };
  }

  // Insert from the bottom up so earlier line indexes stay valid.
  placements.sort((a, b) => b.insertLine - a.insertLine);

  for (const placement of placements) {
    const caption = buildCaption(placement.image);
    const block = [
      '',
      `![${name}](${placement.image.src})`,
      '',
      `*${caption}*`,
    ];
    lines.splice(placement.insertLine, 0, ...block);
  }

  const updatedBody = lines.join('\n');
  const updated = `---\n${parts.frontmatter}\n---\n${updatedBody}`;

  if (!args.dryRun) fs.writeFileSync(postPath, updated);

  return {
    postPath,
    placed: placements
      .slice()
      .sort((a, b) => a.insertLine - b.insertLine)
      .map((p) => ({ heading: p.heading, src: p.image.src })),
  };
}

function collectPosts(slug) {
  const results = [];
  const categories = fs
    .readdirSync(POSTS_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name);

  for (const category of categories) {
    const dir = path.join(POSTS_DIR, category);
    for (const file of fs.readdirSync(dir)) {
      if (!file.endsWith('.md')) continue;
      if (slug && file !== `${slug}.md`) continue;
      results.push(path.join(dir, file));
    }
  }

  return results;
}

function main() {
  const args = parseArgs(process.argv);
  const posts = collectPosts(args.slug);

  let changed = 0;
  for (const postPath of posts) {
    const result = placeImages(postPath, args);
    if (!result) continue;

    const relative = path.relative(ROOT, postPath);
    if (result.skipped) {
      console.log(`Skipped ${relative}: ${result.reason}`);
      continue;
    }

    changed += 1;
    const verb = args.dryRun ? 'Would place' : 'Placed';
    for (const placement of result.placed) {
      console.log(`${verb} ${placement.src} under "${placement.heading}" in ${relative}`);
    }
  }

  console.log(`${args.dryRun ? 'Would update' : 'Updated'} ${changed} review(s).`);
}

main();
