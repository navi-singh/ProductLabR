#!/usr/bin/env node

// Finds candidate product images for reviews below the image target and writes
// them to data/image-candidates.json for curation. Nothing here touches posts or
// the manifest: approving candidates and running images:promote does that.
//
// Source priority (agreed policy): free-licensed (Wikimedia Commons) first, then
// manufacturer press kits (added by hand with sourceTier "press"), then the
// manufacturer's own product page.

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const { IMAGE_POLICY, collectReviewImages, loadImageExceptions } = require('./lib/image-policy');

const ROOT = path.join(__dirname, '..', '..');
const POSTS_DIR = path.join(ROOT, 'posts');
const CANDIDATES_PATH = path.join(ROOT, 'data', 'image-candidates.json');
// slug -> [{ brand, url }]: better product pages for reviews whose retailerLinks
// point at a search page or a site without structured product data.
const SOURCE_PAGES_PATH = path.join(ROOT, 'data', 'image-source-pages.json');
const USER_AGENT = 'ProductLabR image discovery (editorial review site; contact via site)';

const RETAILER_HOSTS =
  /(^|\.)(amazon|walmart|bestbuy|homedepot|lowes|target|ebay|costco|newegg|bhphotovideo|thesolarlab|adorama|rei|crutchfield)\./i;
const FREE_LICENSE = /^(cc0|cc[ -]by(-sa)?[ -]\d|public domain|pd\b)/i;
const SOURCE_TIER_ORDER = { free: 0, press: 1, 'product-page': 2 };

function parseArgs(argv) {
  const args = {
    slug: null,
    category: null,
    url: null,
    below: IMAGE_POLICY.minPerReview,
    maxPerSource: 12,
    wikimedia: true,
    dryRun: false,
    candidates: CANDIDATES_PATH,
  };

  for (let i = 2; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--slug') args.slug = argv[++i];
    else if (arg === '--category') args.category = argv[++i];
    else if (arg === '--url') args.url = argv[++i];
    else if (arg === '--below') args.below = Number(argv[++i]);
    else if (arg === '--max-per-source') args.maxPerSource = Number(argv[++i]);
    else if (arg === '--no-wikimedia') args.wikimedia = false;
    else if (arg === '--dry-run') args.dryRun = true;
    else if (arg === '--candidates') args.candidates = path.resolve(argv[++i]);
    else throw new Error(`Unknown argument: ${arg}`);
  }

  if (args.url && !args.slug) throw new Error('--url requires --slug');
  return args;
}

function productName(title) {
  return String(title || '')
    .split(':')[0]
    .replace(/\s+Review$/i, '')
    .trim();
}

function candidateId(sourceUrl) {
  return crypto.createHash('sha1').update(normalizeUrl(sourceUrl)).digest('hex').slice(0, 10);
}

function normalizeUrl(url) {
  const parsed = new URL(url);
  parsed.search = '';
  parsed.hash = '';
  return parsed.toString();
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function fetchText(url) {
  for (let attempt = 1; ; attempt += 1) {
    const response = await fetch(url, {
      headers: { 'User-Agent': USER_AGENT, Accept: 'text/html,application/json;q=0.9,*/*;q=0.8' },
      redirect: 'follow',
      signal: AbortSignal.timeout(20000),
    });
    if (response.ok) return { text: await response.text(), finalUrl: response.url };
    if (response.status !== 429 || attempt === 4) {
      throw new Error(`${response.status} ${response.statusText} for ${url}`);
    }
    await sleep(10000 * attempt);
  }
}

function loadReviews(args) {
  const out = [];
  for (const category of fs.readdirSync(POSTS_DIR)) {
    const dir = path.join(POSTS_DIR, category);
    if (!fs.statSync(dir).isDirectory()) continue;
    if (args.category && category !== args.category) continue;

    for (const file of fs.readdirSync(dir)) {
      if (!file.endsWith('.md')) continue;
      const slug = file.replace(/\.md$/, '');
      if (args.slug && slug !== args.slug) continue;

      const parsed = matter(fs.readFileSync(path.join(dir, file), 'utf8'));
      out.push({
        category,
        slug,
        product: productName(parsed.data.title) || slug,
        retailerLinks: parsed.data.retailerLinks || {},
        imageCount: collectReviewImages(parsed.data, parsed.content).length,
        hasHero: Boolean(parsed.data.productImage || parsed.data.image),
      });
    }
  }
  return out;
}

// Manufacturer product pages are the non-retailer links that point at a real
// product page rather than a site search.
function loadSourcePages() {
  if (!fs.existsSync(SOURCE_PAGES_PATH)) return {};
  return JSON.parse(fs.readFileSync(SOURCE_PAGES_PATH, 'utf8')).pages || {};
}

function manufacturerPages(review, overrideUrl, sourcePages) {
  if (overrideUrl) return [{ brand: hostBrand(overrideUrl, review.product), url: overrideUrl }];
  const configured = sourcePages[review.slug];
  if (configured && configured.length) {
    return configured.map((page) => ({
      brand: page.brand || hostBrand(page.url, review.product),
      url: page.url,
    }));
  }

  return Object.entries(review.retailerLinks)
    .filter(([, url]) => {
      try {
        const parsed = new URL(url);
        if (RETAILER_HOSTS.test(parsed.hostname)) return false;
        return !/\/search\b|[?&](q|k|st)=/i.test(parsed.pathname + parsed.search);
      } catch {
        return false;
      }
    })
    .map(([brand, url]) => ({ brand, url }));
}

// Prefer the product name's leading word when the host contains it (ca.ecoflow.com -> EcoFlow).
function hostBrand(url, product = '') {
  const host = new URL(url).hostname.toLowerCase();
  const lead = String(product).split(/\s+/)[0];
  if (lead.length > 2 && host.includes(lead.toLowerCase())) return lead;
  const parts = new URL(url).hostname.split('.');
  const sld =
    parts.length > 2 && /^(co|com)$/.test(parts.at(-2)) ? parts.at(-3) : parts.at(-2) || parts[0];
  return sld.replace(/^\w/, (c) => c.toUpperCase());
}

function productPageCandidate(page, image) {
  return {
    sourceTier: 'product-page',
    sourceUrl: image.src,
    sourcePage: page.url,
    sourceName: `${page.brand} product page`,
    license: 'Manufacturer product image',
    credit: page.brand,
    width: image.width ?? null,
    height: image.height ?? null,
    sourceAlt: image.alt || '',
  };
}

async function discoverShopify(page, maxPerSource) {
  const parsed = new URL(page.url);
  if (!/\/products\/[^/]+/.test(parsed.pathname)) return null;

  const jsonUrl = `${parsed.origin}${parsed.pathname.replace(/\/$/, '')}.json`;
  let data;
  try {
    data = JSON.parse((await fetchText(jsonUrl)).text);
  } catch {
    return null;
  }
  if (!data.product || !Array.isArray(data.product.images)) return null;

  return data.product.images
    .slice(0, maxPerSource)
    .map((image) => productPageCandidate(page, image));
}

function readJsonLdImages(html) {
  const images = [];
  for (const block of html.matchAll(
    /<script[^>]+application\/ld\+json[^>]*>([\s\S]*?)<\/script>/gi,
  )) {
    let parsed;
    try {
      parsed = JSON.parse(block[1].trim());
    } catch {
      continue;
    }
    const nodes = [parsed].flat().flatMap((node) => (node && node['@graph']) || [node]);
    for (const node of nodes) {
      if (!node || !/Product/i.test(String(node['@type']))) continue;
      for (const image of [node.image].flat().filter(Boolean)) {
        images.push(typeof image === 'string' ? image : image.url || image.contentUrl);
      }
    }
  }
  return images.filter(Boolean);
}

function readOgImages(html) {
  return [
    ...html.matchAll(
      /<meta[^>]+property=["']og:image(?::secure_url)?["'][^>]*content=["']([^"']+)["']/gi,
    ),
  ].map((match) => match[1]);
}

async function discoverHtml(page, maxPerSource) {
  const { text, finalUrl } = await fetchText(page.url);
  const urls = [...readJsonLdImages(text), ...readOgImages(text)]
    .map((src) => {
      try {
        return new URL(src.replace(/&amp;/g, '&'), finalUrl).toString();
      } catch {
        return null;
      }
    })
    .filter((src) => src && src.startsWith('https:'));

  return [...new Set(urls)]
    .slice(0, maxPerSource)
    .map((src) => productPageCandidate(page, { src }));
}

function stripHtml(value) {
  return String(value || '')
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

async function discoverWikimedia(review, maxPerSource) {
  const params = new URLSearchParams({
    action: 'query',
    format: 'json',
    generator: 'search',
    gsrnamespace: '6',
    gsrsearch: `${review.product} filetype:bitmap`,
    gsrlimit: String(maxPerSource),
    prop: 'imageinfo',
    iiprop: 'url|size|mime|extmetadata',
  });

  // Commons throttles bursts of API searches; pace them.
  await sleep(2000);
  const { text } = await fetchText(`https://commons.wikimedia.org/w/api.php?${params}`);
  const pages = Object.values(JSON.parse(text).query?.pages ?? {});

  return pages
    .map((page) => {
      const info = page.imageinfo?.[0];
      if (!info || !/^image\/(jpeg|png|webp)$/.test(info.mime)) return null;
      const meta = info.extmetadata || {};
      const license = stripHtml(meta.LicenseShortName?.value);
      if (!FREE_LICENSE.test(license)) return null;
      return {
        sourceTier: 'free',
        sourceUrl: info.url,
        sourcePage: info.descriptionurl,
        sourceName: 'Wikimedia Commons',
        license,
        credit: stripHtml(meta.Artist?.value) || 'Wikimedia Commons contributor',
        width: info.width,
        height: info.height,
        sourceAlt: page.title.replace(/^File:/, ''),
      };
    })
    .filter(Boolean);
}

function tooSmall(candidate) {
  if (!candidate.width || !candidate.height) return false;
  return Math.max(candidate.width, candidate.height) < IMAGE_POLICY.minSourceLongEdge;
}

async function discoverForReview(review, args) {
  const found = [];
  const errors = [];

  if (args.wikimedia) {
    try {
      found.push(...(await discoverWikimedia(review, args.maxPerSource)));
    } catch (error) {
      errors.push(`wikimedia: ${error.message}`);
    }
  }

  for (const page of manufacturerPages(review, args.url, args.sourcePages)) {
    try {
      const shopify = await discoverShopify(page, args.maxPerSource);
      const pageImages = shopify ?? (await discoverHtml(page, args.maxPerSource));
      if (pageImages.length === 0) errors.push(`${page.url}: no structured product images`);
      found.push(...pageImages);
    } catch (error) {
      errors.push(`${page.url}: ${error.message}`);
    }
  }

  const seen = new Set();
  const candidates = found
    .filter((candidate) => !tooSmall(candidate))
    .filter((candidate) => {
      const key = normalizeUrl(candidate.sourceUrl);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .sort((a, b) => SOURCE_TIER_ORDER[a.sourceTier] - SOURCE_TIER_ORDER[b.sourceTier])
    .map((candidate) => ({
      id: candidateId(candidate.sourceUrl),
      ...candidate,
      kind: 'product',
      alt: '',
      approved: false,
    }));

  return { candidates, errors };
}

function loadCandidatesFile(candidatesPath) {
  if (!fs.existsSync(candidatesPath)) return { reviews: [] };
  return JSON.parse(fs.readFileSync(candidatesPath, 'utf8'));
}

// Re-running discovery must not throw away curation already done on a review.
function mergeCuration(previous, next) {
  if (!previous) return next;
  const curated = new Map(previous.candidates.map((candidate) => [candidate.id, candidate]));
  next.candidates = next.candidates.map((candidate) => {
    const old = curated.get(candidate.id);
    if (!old) return candidate;
    const { kind, alt, approved, role, promoted } = old;
    return { ...candidate, kind, alt, approved, role, promoted };
  });
  const nextIds = new Set(next.candidates.map((candidate) => candidate.id));
  const kept = previous.candidates.filter(
    (candidate) =>
      !nextIds.has(candidate.id) && (candidate.manual || candidate.approved || candidate.promoted),
  );
  next.candidates.push(...kept);
  return next;
}

async function main() {
  const args = parseArgs(process.argv);
  args.sourcePages = loadSourcePages();
  const exceptions = loadImageExceptions();
  const reviews = loadReviews(args)
    .filter((review) => args.slug || review.imageCount < args.below)
    .filter((review) => args.slug || !exceptions[review.slug])
    .sort((a, b) => a.imageCount - b.imageCount || a.slug.localeCompare(b.slug));

  if (reviews.length === 0) {
    console.log('No reviews match.');
    return;
  }

  const file = loadCandidatesFile(args.candidates);
  const byKey = new Map(file.reviews.map((entry) => [`${entry.category}/${entry.slug}`, entry]));

  for (const review of reviews) {
    const { candidates, errors } = await discoverForReview(review, args);
    const key = `${review.category}/${review.slug}`;
    const entry = mergeCuration(byKey.get(key), {
      category: review.category,
      slug: review.slug,
      product: review.product,
      currentImages: review.imageCount,
      hasHero: review.hasHero,
      needed: Math.max(0, IMAGE_POLICY.targetPerReview - review.imageCount),
      discoveredAt: new Date().toISOString().slice(0, 10),
      errors,
      candidates,
    });
    byKey.set(key, entry);

    const tiers = candidates.reduce(
      (acc, c) => ({ ...acc, [c.sourceTier]: (acc[c.sourceTier] || 0) + 1 }),
      {},
    );
    console.log(
      `${key}: ${review.imageCount} images, ${candidates.length} candidates ${JSON.stringify(tiers)}${
        errors.length ? `  [${errors.join('; ')}]` : ''
      }`,
    );
  }

  const output = {
    note: 'Curate: set approved=true, write a specific alt, set kind to "product" or "lifestyle" (max 1 lifestyle), optionally role "main". Then run npm run images:promote.',
    reviews: [...byKey.values()].sort((a, b) =>
      `${a.category}/${a.slug}`.localeCompare(`${b.category}/${b.slug}`),
    ),
  };

  if (args.dryRun) {
    console.log(`Dry run: would write ${path.relative(ROOT, args.candidates)}`);
  } else {
    fs.writeFileSync(args.candidates, `${JSON.stringify(output, null, 2)}\n`);
    console.log(
      `Wrote ${path.relative(ROOT, args.candidates)} (${output.reviews.length} reviews).`,
    );
  }
}

if (require.main === module) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  });
}

module.exports = { hostBrand, manufacturerPages, mergeCuration, readJsonLdImages, readOgImages };
