'use strict';

const {
  GATES,
  REQUIRED_FRONTMATTER,
  SECTION_INTENTS,
  GENERIC_PHRASES,
  META_WRITING_PATTERNS,
} = require('../config');

const SHINGLE_SIZE = 6;

function normalizeWords(text) {
  return text
    .toLowerCase()
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(Boolean);
}

function shingles(text) {
  const words = normalizeWords(text);
  const set = new Set();
  for (let i = 0; i + SHINGLE_SIZE <= words.length; i += 1) {
    set.add(words.slice(i, i + SHINGLE_SIZE).join(' '));
  }
  return set;
}

function jaccard(a, b) {
  if (a.size === 0 || b.size === 0) return 0;
  let intersection = 0;
  const [small, large] = a.size <= b.size ? [a, b] : [b, a];
  for (const item of small) {
    if (large.has(item)) intersection += 1;
  }
  return intersection / (a.size + b.size - intersection);
}

function countWords(body) {
  return normalizeWords(body).length;
}

function extractH2(body) {
  return (body.match(/^##\s+(.+)$/gm) || []).map((h) => h.replace(/^##\s+/, '').trim());
}

/** Intent matching spans H2 and H3: FAQ blocks are conventionally authored at H3. */
function extractHeadings(body) {
  return (body.match(/^#{2,3}\s+(.+)$/gm) || []).map((h) => h.replace(/^#{2,3}\s+/, '').trim());
}

function matchSectionIntents(headings) {
  const matched = {};
  for (const intent of SECTION_INTENTS) {
    matched[intent.id] = headings.some((h) => intent.pattern.test(h));
  }
  return matched;
}

/**
 * FAQ pairs are authored in a few shapes across the corpus, so count question
 * markers rather than assuming one convention.
 */
function countFaqPairs(body) {
  const boldQ = (body.match(/^\s*\*\*Q[:.]/gim) || []).length;
  const headingQ = (body.match(/^#{3,4}\s+.*\?\s*$/gm) || []).length;
  const boldQuestion = (body.match(/^\s*\*\*.+\?\*\*\s*$/gm) || []).length;
  return Math.max(boldQ, headingQ, boldQuestion);
}

function analyzeRetailerLinks(data) {
  const links = data.retailerLinks;
  const result = { total: 0, placeholder: 0, insecure: 0, valid: 0, entries: [] };
  if (!links || typeof links !== 'object') return result;

  for (const [retailer, url] of Object.entries(links)) {
    const value = String(url || '').trim();
    result.total += 1;
    result.entries.push({ retailer, url: value });
    if (!value || value === '#' || value.startsWith('#')) {
      result.placeholder += 1;
    } else if (!/^https:\/\//i.test(value)) {
      result.insecure += 1;
    } else {
      result.valid += 1;
    }
  }
  return result;
}

/** Numbers carrying a unit or qualifier are the evidence backbone of a review. */
function countNumericClaims(body) {
  const pattern =
    /\b\d[\d,.]*\s?(wh|w|kwh|mah|hz|khz|ghz|mhz|ms|nits|cd\/m|ppi|pa|rpm|lbs?|kg|g|mm|cm|in(?:ches)?|"|hours?|hrs?|min(?:utes?)?|%|k|mp|fps|bit|db|tb|gb|mb|\$|usd)\b/gi;
  return (body.match(pattern) || []).length;
}

/**
 * Brand tokens that are also ordinary English words. Matching these would
 * produce phantom competitors, so they only count when clearly used as a brand.
 */
const AMBIGUOUS_BRANDS = new Set(['nothing', 'beats', 'polar', 'direct', 'the', 'best', 'new']);

// Sentence-initial and section-heading words that look like proper nouns but aren't brands.
const NON_BRAND_TOKENS = new Set([
  'The', 'This', 'That', 'These', 'Those', 'It', 'If', 'In', 'On', 'At', 'For', 'But', 'And', 'Or',
  'You', 'Your', 'We', 'Our', 'They', 'There', 'Here', 'What', 'When', 'Where', 'Which', 'While',
  'Against', 'Both', 'Every', 'Most', 'More', 'Less', 'Best', 'Better', 'Good', 'Great', 'Unlike',
  'Compared', 'Versus', 'Alternatives', 'Comparison', 'Competitive', 'How', 'Why', 'Who', 'Should',
  'A', 'An', 'Its', 'His', 'Her', 'My', 'Then', 'Than', 'Still', 'Yet', 'So', 'Because', 'Buyers',
  'Around', 'Small', 'Large', 'Many', 'Some', 'Other', 'Another', 'Plenty', 'Both', 'Even', 'Only',
  'That', 'With', 'Without', 'After', 'Before', 'During', 'Between', 'Under', 'Over', 'Across',
]);

/** Returns the body text under the competitive-comparison heading, if present. */
function comparisonSection(body) {
  const lines = body.split(/\r?\n/);
  const intent = SECTION_INTENTS.find((s) => s.id === 'comparison');
  let start = -1;
  for (let i = 0; i < lines.length; i += 1) {
    const heading = lines[i].match(/^#{2,3}\s+(.+)$/);
    if (heading && intent.pattern.test(heading[1])) {
      start = i + 1;
      break;
    }
  }
  if (start === -1) return '';
  let end = start;
  while (end < lines.length && !/^##\s+/.test(lines[end])) end += 1;
  return lines.slice(start, end).join('\n');
}

/**
 * Finds capitalised product names inside the comparison section. This catches
 * rivals that are absent from the corpus (thin categories have no peer brands
 * to match against), which corpus-derived matching alone would miss.
 */
function properNounCandidates(text, ownBrand) {
  const pattern = /\b[A-Z][a-zA-Z]+(?:\s+(?:[A-Z][a-zA-Z0-9]*|\d+[A-Za-z]*))+\b/g;
  const found = new Set();
  for (const match of text.match(pattern) || []) {
    const first = match.split(/\s+/)[0];
    if (NON_BRAND_TOKENS.has(first)) continue;
    if (first.toLowerCase() === ownBrand) continue;
    found.add(first);
  }
  return found;
}

/**
 * Counts distinct rival brands named in the body. Detection prefers brands from
 * the article's own category so a knife review is not credited for mentioning a
 * camera maker; it widens to the full corpus only when the category is too
 * small to supply a meaningful peer set, and is supplemented by proper nouns
 * found in the comparison section.
 */
function countNamedCompetitors(body, ownBrand, brandIndex, category) {
  const categoryBrands = brandIndex.byCategory.get(category);
  const useCategory = categoryBrands && categoryBrands.size >= 4;
  const candidates = useCategory ? categoryBrands : brandIndex.global;

  const found = new Set();
  for (const [key, display] of candidates) {
    if (key === ownBrand || AMBIGUOUS_BRANDS.has(key)) continue;
    const escaped = display.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    // Case-sensitive: brand names appear capitalised in prose.
    if (new RegExp(`\\b${escaped}\\b`).test(body)) found.add(display);
  }

  for (const candidate of properNounCandidates(comparisonSection(body), ownBrand)) {
    found.add(candidate);
  }

  return { count: found.size, brands: [...found].sort(), scope: useCategory ? 'category' : 'corpus' };
}

function countGenericPhrases(body) {
  const lowered = body.toLowerCase();
  const hits = [];
  for (const phrase of GENERIC_PHRASES) {
    if (lowered.includes(phrase)) hits.push(phrase);
  }
  return hits;
}

/** Finds sentences that narrate the writing process instead of the product. */
function findMetaWriting(body) {
  const hits = [];
  const lines = body.split(/\r?\n/);
  lines.forEach((line, index) => {
    for (const pattern of META_WRITING_PATTERNS) {
      const match = line.match(pattern);
      if (match) {
        hits.push({ line: index + 1, phrase: match[0] });
        break;
      }
    }
  });
  return hits;
}

function checkFrontmatter(data) {
  const missing = REQUIRED_FRONTMATTER.filter((key) => {
    const value = data[key];
    if (value === undefined || value === null || value === '') return true;
    if (Array.isArray(value) && value.length === 0) return true;
    return false;
  });

  const metrics = data.ratingBreakdown && data.ratingBreakdown.metrics;
  const metricsValid =
    Array.isArray(metrics) &&
    metrics.length >= 3 &&
    metrics.every(
      (m) => m && typeof m.name === 'string' && typeof m.score === 'number' && m.score >= 0 && m.score <= 10
    );

  return { missing, metricsValid, metricCount: Array.isArray(metrics) ? metrics.length : 0 };
}

/**
 * Flags rating metrics that score a capability the spec sheet says the product
 * does not have (e.g. scoring "Video Capabilities" 9.0 when specs read
 * "No video recording"), plus titles advertising an absent capability.
 */
function findSpecRatingContradictions(data) {
  const contradictions = [];
  const specs = data.specs && typeof data.specs === 'object' ? data.specs : {};
  const metrics = (data.ratingBreakdown && data.ratingBreakdown.metrics) || [];
  const absent = /^\s*(no\b|none\b|not\b|n\/a\b)/i;
  // "No software required" or "None needed" describe convenience, not a missing feature.
  const notAnAbsence = /\b(required|needed|necessary|included\s+free)\b/i;

  const absentFeatures = Object.entries(specs)
    .filter(([, value]) => absent.test(String(value)) && !notAnAbsence.test(String(value)))
    .map(([key, value]) => ({ key, keyword: key.toLowerCase(), value: String(value) }));

  for (const metric of metrics) {
    if (!metric || typeof metric.name !== 'string') continue;
    const name = metric.name.toLowerCase();
    for (const feature of absentFeatures) {
      if (name.includes(feature.keyword) && Number(metric.score) > 0) {
        contradictions.push(
          `rated "${metric.name}" ${metric.score}/10 but specs say ${feature.key}: "${feature.value}"`
        );
      }
    }
  }

  const title = String(data.title || '').toLowerCase();
  for (const feature of absentFeatures) {
    if (title.includes(feature.keyword)) {
      contradictions.push(`title advertises "${feature.key}" but specs say "${feature.value}"`);
    }
  }

  return contradictions;
}

/**
 * Computes every measurable signal for one article. Similarity requires the
 * whole corpus, so callers pass a prepared shingle map.
 */
function analyzeArticle(post, context) {
  const { brandIndex, shingleMap } = context;
  const body = post.body;
  const headings = extractH2(body);
  const allHeadings = extractHeadings(body);
  const ownBrand = String(post.data.title || '')
    .trim()
    .split(/[\s:,-]+/)[0]
    .toLowerCase();

  let maxSimilarity = 0;
  let nearestNeighbor = null;
  const own = shingleMap.get(post.path);
  if (own) {
    for (const [otherPath, otherShingles] of shingleMap) {
      if (otherPath === post.path) continue;
      const score = jaccard(own, otherShingles);
      if (score > maxSimilarity) {
        maxSimilarity = score;
        nearestNeighbor = otherPath;
      }
    }
  }

  const competitors = countNamedCompetitors(body, ownBrand, brandIndex, post.category);
  const genericHits = countGenericPhrases(body);

  return {
    path: post.path,
    slug: post.slug,
    category: post.category,
    title: post.data.title || post.slug,
    words: countWords(body),
    lines: post.raw.split(/\r?\n/).length,
    h2Count: headings.length,
    headings,
    sections: matchSectionIntents(allHeadings),
    faqPairs: countFaqPairs(body),
    retailerLinks: analyzeRetailerLinks(post.data),
    numericClaims: countNumericClaims(body),
    competitors,
    genericPhrases: genericHits,
    metaWriting: findMetaWriting(body),
    similarity: { max: Number(maxSimilarity.toFixed(4)), nearest: nearestNeighbor },
    frontmatter: checkFrontmatter(post.data),
    contradictions: findSpecRatingContradictions(post.data),
  };
}

function analyzeCorpus(corpus, brandIndex) {
  const shingleMap = new Map();
  for (const post of corpus) {
    shingleMap.set(post.path, shingles(post.body));
  }
  return corpus.map((post) => analyzeArticle(post, { brandIndex, shingleMap }));
}

module.exports = { analyzeCorpus, analyzeArticle, shingles, jaccard, GATES };
