#!/usr/bin/env node

// Distributes a review's `gallery` images into the article body, placing each
// one under a section where a photo actually helps the reader (design, build,
// unboxing, display) rather than dumping them all in one strip.

const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

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
const EXCLUDED_SECTIONS =
  /verdict|conclusion|faq|frequently asked|who should buy|who it's for|bottom line|competitive/i;

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

// Product name for alt text: the part of the headline before the marketing
// colon, e.g. "Apple AirPods Max: Premium Build..." -> "Apple AirPods Max".
function productName(title) {
  return title
    .split(':')[0]
    .replace(/\s+Review$/i, '')
    .trim();
}

function buildCaption(image) {
  const parts = [];
  const credit = image.credit || '';
  const source = image.source || '';
  if (credit && !source.toLowerCase().includes(credit.toLowerCase())) parts.push(credit);
  if (source) parts.push(source);
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

// Candidate insert points within a section: the end of each prose paragraph,
// skipping spots inside lists or right after another image's caption.
function paragraphEnds(lines, section, nextSection) {
  const limit = nextSection ? nextSection.lineIndex : lines.length;
  const ends = [];
  for (let i = section.lineIndex + 1; i < limit; i += 1) {
    if (lines[i].trim() !== '') continue;
    const prev = lines[i - 1].trim();
    if (prev === '' || prev.startsWith('#') || prev.startsWith('|')) continue;
    if (/^!\[|^\*[^*].*\*$/.test(prev)) continue;
    const next = lines.slice(i + 1, limit).find((line) => line.trim() !== '') || '';
    const isList = (line) => /^\s*([-*+]|\d+\.)\s/.test(line);
    if (isList(prev) && isList(next)) continue;
    ends.push(i);
  }
  return ends;
}

function sectionHasImage(lines, section, nextSection) {
  const limit = nextSection ? nextSection.lineIndex : lines.length;
  return lines.slice(section.lineIndex + 1, limit).some((line) => /^!\[/.test(line.trim()));
}

// Every eligible section, preferred topics first; sections that already show a
// photo go last so images spread across the article.
function rankSections(sections, lines) {
  const ranked = [];

  sections.forEach((section, index) => {
    if (EXCLUDED_SECTIONS.test(section.heading)) return;
    if (/^introduction$/i.test(section.heading)) return;

    const preferred = PREFERRED_SECTIONS.findIndex((re) => re.test(section.heading));
    const priority = preferred === -1 ? PREFERRED_SECTIONS.length : preferred;
    const hasImage = sectionHasImage(lines, section, sections[index + 1]);
    ranked.push({ ...section, index, priority, hasImage });
  });

  ranked.sort((a, b) => a.hasImage - b.hasImage || a.priority - b.priority || a.index - b.index);
  return ranked;
}

// Round-robin over ranked sections; a section's second image goes further down
// its prose so two photos never sit back to back.
function planPlacements(lines, sections, images) {
  const ranked = rankSections(sections, lines)
    .map((section) => ({
      ...section,
      ends: paragraphEnds(lines, section, sections[section.index + 1]),
    }))
    .filter((section) => section.ends.length > 0);
  if (ranked.length === 0) return [];

  const perSection = new Map();
  const slots = [];
  for (let round = 0; slots.length < images.length && round < 10; round += 1) {
    for (const section of ranked) {
      if (slots.length >= images.length) break;
      const used = perSection.get(section.index) || [];
      const step = Math.max(1, Math.floor(section.ends.length / (used.length + 2)));
      const insertLine = section.ends.find(
        (line, i) => i >= used.length * step && !used.some((u) => Math.abs(u - line) < 3),
      );
      if (insertLine === undefined) continue;
      used.push(insertLine);
      perSection.set(section.index, used);
      slots.push({ insertLine, heading: section.heading });
    }
  }

  slots.sort((a, b) => a.insertLine - b.insertLine);
  return slots.map((slot, i) => ({ ...slot, image: images[i] }));
}

function placeImages(postPath, args) {
  const text = fs.readFileSync(postPath, 'utf8');
  const parts = splitFrontmatter(text);
  if (!parts) return null;

  const { data } = matter(text);
  const gallery = (Array.isArray(data.gallery) ? data.gallery : []).filter(
    (image) => image && image.src,
  );
  if (gallery.length === 0) return null;

  const name = productName(String(data.title || ''));
  const pending = args.force ? gallery : gallery.filter((image) => !parts.body.includes(image.src));
  if (pending.length === 0) return null;

  const lines = parts.body.split('\n');
  const placements = planPlacements(lines, findSections(parts.body), pending);

  if (placements.length === 0) {
    return { postPath, skipped: true, reason: 'no suitable section found' };
  }

  // Insert from the bottom up so earlier line indexes stay valid.
  for (const placement of [...placements].sort((a, b) => b.insertLine - a.insertLine)) {
    const caption = buildCaption(placement.image);
    const block = [
      '',
      `![${placement.image.alt || name}](${placement.image.src})`,
      '',
      `*${caption}*`,
    ];
    lines.splice(placement.insertLine, 0, ...block);
  }

  const updated = `---\n${parts.frontmatter}\n---\n${lines.join('\n')}`;
  if (!args.dryRun) fs.writeFileSync(postPath, updated);

  return {
    postPath,
    unplaced: pending.length - placements.length,
    placed: placements.map((p) => ({ heading: p.heading, src: p.image.src })),
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
    if (result.unplaced) console.log(`  ${result.unplaced} image(s) still unplaced in ${relative}`);
  }

  console.log(`${args.dryRun ? 'Would update' : 'Updated'} ${changed} review(s).`);
}

if (require.main === module) main();

module.exports = { buildCaption, planPlacements };
