#!/usr/bin/env node

// Moves curated candidates (approved: true in data/image-candidates.json) into
// the provenance manifest, assigning roles. Approval is this step: nothing
// reaches data/product-images.json without passing these checks.

const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const { IMAGE_POLICY, collectReviewImages } = require('./lib/image-policy');

const ROOT = path.join(__dirname, '..', '..');
const CANDIDATES_PATH = path.join(ROOT, 'data', 'image-candidates.json');
const MANIFEST_PATH = path.join(ROOT, 'data', 'product-images.json');

function parseArgs(argv) {
  const args = { dryRun: false, slug: null, candidates: CANDIDATES_PATH };
  for (let i = 2; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--dry-run') args.dryRun = true;
    else if (arg === '--slug') args.slug = argv[++i];
    else if (arg === '--candidates') args.candidates = path.resolve(argv[++i]);
    else throw new Error(`Unknown argument: ${arg}`);
  }
  return args;
}

function readPost(category, slug) {
  const postPath = path.join(ROOT, 'posts', category, `${slug}.md`);
  if (!fs.existsSync(postPath)) throw new Error(`No review found for ${category}/${slug}`);
  return matter(fs.readFileSync(postPath, 'utf8'));
}

function usedAngleNumbers(category, slug, manifestImages) {
  const numbers = manifestImages
    .filter((entry) => entry.category === category && entry.slug === slug)
    .map((entry) => Number((entry.role || '').match(/^angle(\d+)$/)?.[1] ?? 0));

  const dir = path.join(ROOT, 'public', 'images', 'posts', category, slug);
  if (fs.existsSync(dir)) {
    for (const file of fs.readdirSync(dir)) {
      const match = file.match(/_angle(\d+)\.[a-z]+$/i);
      if (match) numbers.push(Number(match[1]));
    }
  }
  return Math.max(1, ...numbers);
}

// Promoted but not yet ingested entries still count toward the per-review target.
function pendingIngestCount(category, slug, manifestImages) {
  const dir = path.join(ROOT, 'public', 'images', 'posts', category, slug);
  const files = fs.existsSync(dir)
    ? fs.readdirSync(dir).map((file) => file.replace(/\.[a-z0-9]+$/i, ''))
    : [];
  return manifestImages.filter(
    (entry) =>
      entry.category === category &&
      entry.slug === slug &&
      !entry.vendored &&
      !files.includes(`${slug}_${entry.role ?? 'main'}`),
  ).length;
}

function validateCandidate(candidate, product) {
  const problems = [];
  const alt = String(candidate.alt || '').trim();
  if (alt.length < 12) problems.push('alt text missing or too short');
  else if (alt.toLowerCase() === product.toLowerCase())
    problems.push('alt text only repeats the product name');
  if (/[[\]()"\n]/.test(alt))
    problems.push('alt text must not contain brackets, parentheses, quotes, or newlines');
  if (!['product', 'lifestyle'].includes(candidate.kind))
    problems.push(`kind must be "product" or "lifestyle"`);
  if (!['free', 'press', 'product-page'].includes(candidate.sourceTier))
    problems.push('unknown sourceTier');
  for (const field of ['sourceUrl', 'sourcePage', 'sourceName', 'license', 'credit']) {
    if (!candidate[field]) problems.push(`missing ${field}`);
  }
  try {
    if (new URL(candidate.sourceUrl).protocol !== 'https:')
      problems.push('sourceUrl must be https');
  } catch {
    problems.push('invalid sourceUrl');
  }
  return problems;
}

function promoteReview(review, manifestImages, args) {
  const post = readPost(review.category, review.slug);
  const current =
    collectReviewImages(post.data, post.content).length +
    pendingIngestCount(review.category, review.slug, manifestImages);
  const hasHero =
    Boolean(post.data.productImage || post.data.image) ||
    manifestImages.some(
      (e) =>
        e.category === review.category && e.slug === review.slug && (e.role ?? 'main') === 'main',
    );

  const pending = review.candidates.filter((c) => c.approved && !c.promoted);
  if (pending.length === 0) return { promoted: [], problems: [] };

  const problems = [];
  const valid = pending.filter((candidate) => {
    const issues = validateCandidate(candidate, review.product);
    if (issues.length) problems.push(`${candidate.id}: ${issues.join(', ')}`);
    return issues.length === 0;
  });

  const lifestyleAlready = review.candidates.filter(
    (c) => c.promoted && c.kind === 'lifestyle',
  ).length;
  let lifestyleBudget = Math.max(0, IMAGE_POLICY.maxLifestylePerReview - lifestyleAlready);
  const room = Math.max(0, IMAGE_POLICY.targetPerReview - current);

  // A designated main shot leads; otherwise the first approved clean product shot does.
  const ordered = [...valid].sort((a, b) => (b.role === 'main') - (a.role === 'main'));
  const selected = [];
  for (const candidate of ordered) {
    if (selected.length >= room) {
      problems.push(
        `${candidate.id}: skipped, review already at target of ${IMAGE_POLICY.targetPerReview}`,
      );
      continue;
    }
    if (candidate.kind === 'lifestyle') {
      if (lifestyleBudget === 0) {
        problems.push(
          `${candidate.id}: skipped, only ${IMAGE_POLICY.maxLifestylePerReview} lifestyle image allowed`,
        );
        continue;
      }
      lifestyleBudget -= 1;
    }
    selected.push(candidate);
  }

  if (!hasHero && selected.length && selected[0].kind === 'lifestyle') {
    const productShot = selected.findIndex((c) => c.kind === 'product');
    if (productShot > 0) selected.unshift(...selected.splice(productShot, 1));
  }

  let nextAngle = usedAngleNumbers(review.category, review.slug, manifestImages) + 1;
  const promoted = selected.map((candidate, index) => {
    const role = !hasHero && index === 0 ? 'main' : `angle${nextAngle++}`;
    const entry = {
      category: review.category,
      slug: review.slug,
      role,
      sourceUrl: candidate.sourceUrl,
      sourcePage: candidate.sourcePage,
      sourceName: candidate.sourceName,
      sourceTier: candidate.sourceTier,
      license: candidate.license,
      credit: candidate.credit,
      alt: candidate.alt.trim(),
    };
    if (!args.dryRun) {
      candidate.promoted = true;
      candidate.role = role;
    }
    return entry;
  });

  return { promoted, problems };
}

function main() {
  const args = parseArgs(process.argv);
  if (!fs.existsSync(args.candidates)) {
    console.log(
      `No ${path.relative(ROOT, args.candidates)} yet. Run npm run images:discover first.`,
    );
    return;
  }

  const candidatesFile = JSON.parse(fs.readFileSync(args.candidates, 'utf8'));
  const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));

  let total = 0;
  let problemCount = 0;
  const touched = [];
  for (const review of candidatesFile.reviews) {
    if (args.slug && review.slug !== args.slug) continue;
    const { promoted, problems } = promoteReview(review, manifest.images, args);

    for (const problem of problems) console.log(`  ${review.slug} ${problem}`);
    problemCount += problems.length;
    if (promoted.length === 0) continue;

    manifest.images.push(...promoted);
    total += promoted.length;
    touched.push(review.slug);
    for (const entry of promoted) {
      console.log(
        `${args.dryRun ? 'Would promote' : 'Promoted'} ${review.category}/${review.slug} ${entry.role} (${entry.sourceTier}) ${entry.sourceUrl}`,
      );
    }
  }

  if (!args.dryRun && total > 0) {
    fs.writeFileSync(MANIFEST_PATH, `${JSON.stringify(manifest, null, 2)}\n`);
    fs.writeFileSync(args.candidates, `${JSON.stringify(candidatesFile, null, 2)}\n`);
  }

  console.log(
    `${args.dryRun ? 'Would promote' : 'Promoted'} ${total} image(s) across ${touched.length} review(s); ${problemCount} issue(s).`,
  );
  if (total > 0 && !args.dryRun) {
    console.log('Next: npm run images:ingest && npm run images:place');
  }
}

if (require.main === module) {
  try {
    main();
  } catch (error) {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

module.exports = { validateCandidate };
