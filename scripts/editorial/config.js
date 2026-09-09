'use strict';

/**
 * Shared configuration for the editorial audit + QA gate toolchain.
 * Thresholds here are the contract referenced by the agent profiles in
 * .github/agents/ and by the A/B experiment plan in logs/.
 */

const POSTS_DIR = 'posts';

// Hard gate thresholds: the floor every published review must clear. These are
// published to readers on /methodology as a promise, so they describe what the
// corpus actually meets — not an aspiration. Keep lib/editorial-standards.ts in sync.
const GATES = {
  minWords: 900,
  minFaqPairs: 0,
  minH2Sections: 5,
  minNamedCompetitors: 1,
  minNumericClaims: 6,
  maxCorpusSimilarity: 0.22,
  maxGenericPhraseHits: 2,
};

// Editorial targets: what we aim a review at, used to prioritise the revision
// backlog. Missing a target lowers an article's score but does not block it,
// so a short, dense review is not forced to pad itself to look compliant.
const TARGETS = {
  minWords: 1800,
  minFaqPairs: 8,
  minH2Sections: 6,
  minNamedCompetitors: 3,
  minNumericClaims: 12,
};

// Required frontmatter keys for a publishable review.
const REQUIRED_FRONTMATTER = [
  'title',
  'subtitle',
  'date',
  'price',
  'productImage',
  'specs',
  'pros',
  'cons',
  'retailerLinks',
  'ratingBreakdown',
];

/**
 * Section intents rather than literal headings: articles across categories use
 * different wording for the same job, so we match on purpose, not on title.
 */
// `required: true` intents are part of the hard publish gate. The rest are
// editorial targets: they carry weight in the rubric and drive the revision
// backlog, but a review is not blocked for lacking a bolt-on FAQ heading.
const SECTION_INTENTS = [
  { id: 'intro', label: 'Introduction / overview', required: true, pattern: /introduction|overview|what is|first look/i },
  {
    id: 'design',
    label: 'Design & build',
    required: true,
    pattern: /design|build|hardware|unboxing|ergonomic|display|setup|audio|speaker|panel|comfort|clicks|buttons|remote/i,
  },
  {
    id: 'performance',
    label: 'Performance / real-world testing',
    required: true,
    pattern:
      /performance|testing|real[- ]world|benchmark|battery|cleaning|picture quality|image quality|sound|speed|sensor|tracking|latency|response time|refresh|color accuracy|display quality|gaming|connectivity|productivity/i,
  },
  {
    id: 'comparison',
    label: 'Competitive comparison',
    required: false,
    pattern: /vs\.?\s|versus|compet|comparison|alternatives|compared|how it stacks/i,
  },
  {
    id: 'audience',
    label: 'Who should buy',
    required: false,
    pattern: /who should|who it'?s for|ideal for|best for|should you buy/i,
  },
  { id: 'verdict', label: 'Verdict', required: true, pattern: /verdict|conclusion|bottom line|final thoughts/i },
  { id: 'faq', label: 'FAQ', required: false, pattern: /faq|frequently asked|common questions/i },
];

/**
 * Phrases lifted from scripts/research-agent.js template output. Their presence
 * is a direct signal of machine-templated filler prose.
 */
const GENERIC_PHRASES = [
  'represents a compelling entry',
  'this comprehensive review is based on extensive hands-on testing',
  'through comprehensive testing and analysis',
  'comprehensive review explores every aspect',
  'demonstrates solid engineering execution',
  'careful attention to protection and presentation',
  'the physical construction quality becomes immediately apparent',
  'real-world testing across multiple scenarios reveals',
  'emerges as a well-engineered solution',
  'value proposition analysis requires consideration',
  'extended use experience reveals important usability factors',
  'balances capacity, performance, and value',
  'without unnecessary complexity',
];

// Categories targeted first by the remediation plan (weakest by audit).
const PILOT_CATEGORIES = ['laptops', 'monitors', 'smart-home'];

/**
 * Process language that must never reach a reader. These leak in when a draft
 * is generated from an existing file and the writer narrates its own sources.
 */
const META_WRITING_PATTERNS = [
  /\bfrontmatter\b/i,
  /\b(?:the\s+)?(?:previous|original|existing|prior|earlier)\s+(?:draft|review|version|notes|claims)\b/i,
  /\bthis\s+(?:rewrite|revision|article\s+should\s+not\s+invent)\b/i,
  /\b(?:the\s+)?same\s+draft\b/i,
  /\bprior\s+review\s+notes\b/i,
  /\bspec\s+(?:sheet\s+)?claim\s+supports\b/i,
  /\bthe\s+supported\s+claim\s+is\b/i,
  /\bdoes\s+not\s+provide\s+lab\s+(?:hit\s+rates|numbers)\b/i,
];

module.exports = {
  POSTS_DIR,
  GATES,
  TARGETS,
  REQUIRED_FRONTMATTER,
  SECTION_INTENTS,
  GENERIC_PHRASES,
  META_WRITING_PATTERNS,
  PILOT_CATEGORIES,
};
