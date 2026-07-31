'use strict';

/**
 * Shared configuration for the editorial audit + QA gate toolchain.
 * Thresholds here are the contract referenced by the agent profiles in
 * .github/agents/ and by the A/B experiment plan in logs/.
 */

const POSTS_DIR = 'posts';

// Hard gate thresholds. Changing these changes publish readiness.
// These are also published to readers on /methodology — keep lib/editorial-standards.ts in sync.
const GATES = {
  minWords: 1800,
  minFaqPairs: 8,
  minH2Sections: 6,
  minNamedCompetitors: 3,
  minNumericClaims: 12,
  maxCorpusSimilarity: 0.22,
  maxGenericPhraseHits: 2,
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
const SECTION_INTENTS = [
  { id: 'intro', label: 'Introduction / overview', pattern: /introduction|overview|what is|first look/i },
  {
    id: 'design',
    label: 'Design & build',
    pattern: /design|build|hardware|unboxing|ergonomic|display|setup/i,
  },
  {
    id: 'performance',
    label: 'Performance / real-world testing',
    pattern: /performance|testing|real[- ]world|benchmark|battery|cleaning|picture quality|image quality|sound|speed/i,
  },
  {
    id: 'comparison',
    label: 'Competitive comparison',
    pattern: /vs\.?\s|versus|compet|comparison|alternatives|compared|how it stacks/i,
  },
  {
    id: 'audience',
    label: 'Who should buy',
    pattern: /who should|who it'?s for|ideal for|best for|should you buy/i,
  },
  { id: 'verdict', label: 'Verdict', pattern: /verdict|conclusion|bottom line|final thoughts/i },
  { id: 'faq', label: 'FAQ', pattern: /faq|frequently asked|common questions/i },
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
  REQUIRED_FRONTMATTER,
  SECTION_INTENTS,
  GENERIC_PHRASES,
  META_WRITING_PATTERNS,
  PILOT_CATEGORIES,
};
