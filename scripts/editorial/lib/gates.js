'use strict';

const { GATES, SECTION_INTENTS } = require('../config');

/**
 * Hard, non-negotiable publish gates. Output shape matches the contract the
 * qa-gate agent profile declares, so agent and CLI results are interchangeable.
 */
function runGates(metrics) {
  const checks = [];

  const add = (id, label, passed, detail, blocking = true, autoFixable = false) => {
    checks.push({ id, label, status: passed ? 'pass' : 'fail', detail, blocking, autoFixable });
  };

  add(
    'word_count',
    `Body >= ${GATES.minWords} words`,
    metrics.words >= GATES.minWords,
    `${metrics.words} words`
  );

  const missingIntents = SECTION_INTENTS.filter(
    (intent) => intent.required && !metrics.sections[intent.id]
  );
  add(
    'section_intents',
    'All required section intents present',
    missingIntents.length === 0,
    missingIntents.length ? `missing: ${missingIntents.map((i) => i.id).join(', ')}` : 'all present'
  );

  add(
    'faq_pairs',
    `>= ${GATES.minFaqPairs} FAQ question/answer pairs`,
    metrics.faqPairs >= GATES.minFaqPairs,
    `${metrics.faqPairs} pairs`
  );

  const links = metrics.retailerLinks;
  add(
    'retailer_links',
    'No placeholder or non-HTTPS retailer links',
    links.total > 0 && links.placeholder === 0 && links.insecure === 0,
    `${links.total} links, ${links.placeholder} placeholder, ${links.insecure} insecure`,
    true,
    links.placeholder > 0
  );

  add(
    'frontmatter',
    'Required frontmatter fields present',
    metrics.frontmatter.missing.length === 0,
    metrics.frontmatter.missing.length ? `missing: ${metrics.frontmatter.missing.join(', ')}` : 'complete',
    true,
    true
  );

  add(
    'rating_breakdown',
    'ratingBreakdown parseable with >= 3 scored metrics',
    metrics.frontmatter.metricsValid,
    `${metrics.frontmatter.metricCount} metrics`,
    true,
    true
  );

  add(
    'anti_generic',
    `<= ${GATES.maxGenericPhraseHits} templated filler phrases`,
    metrics.genericPhrases.length <= GATES.maxGenericPhraseHits,
    metrics.genericPhrases.length ? metrics.genericPhrases.join(' | ') : 'none'
  );

  add(
    'spec_rating_consistency',
    'Ratings and title do not contradict the spec sheet',
    metrics.contradictions.length === 0,
    metrics.contradictions.join(' | ') || 'consistent'
  );

  add(
    'no_meta_writing',
    'No process/meta language visible to readers',
    metrics.metaWriting.length === 0,
    metrics.metaWriting.length
      ? metrics.metaWriting.map((h) => `line ${h.line}: "${h.phrase}"`).join(' | ')
      : 'clean'
  );

  add(
    'corpus_similarity',
    `Max corpus similarity <= ${GATES.maxCorpusSimilarity}`,
    metrics.similarity.max <= GATES.maxCorpusSimilarity,
    `${metrics.similarity.max}${metrics.similarity.nearest ? ` vs ${metrics.similarity.nearest}` : ''}`
  );

  add(
    'named_competitors',
    `>= ${GATES.minNamedCompetitors} named competing products`,
    metrics.competitors.count >= GATES.minNamedCompetitors,
    `${metrics.competitors.brands.join(', ') || 'none'} [${metrics.competitors.scope}-scoped]`,
    false
  );

  add(
    'numeric_claims',
    `>= ${GATES.minNumericClaims} measured/numeric claims`,
    metrics.numericClaims >= GATES.minNumericClaims,
    `${metrics.numericClaims} claims`,
    false
  );

  const blockingFailures = checks.filter((c) => c.status === 'fail' && c.blocking);
  const advisoryFailures = checks.filter((c) => c.status === 'fail' && !c.blocking);

  let recommendedNextAgent = null;
  if (blockingFailures.some((c) => ['word_count', 'section_intents', 'faq_pairs'].includes(c.id))) {
    recommendedNextAgent = 'draft-rewrite';
  } else if (blockingFailures.some((c) => ['anti_generic', 'corpus_similarity', 'no_meta_writing'].includes(c.id))) {
    recommendedNextAgent = 'editorial-reviewer';
  } else if (blockingFailures.length > 0) {
    recommendedNextAgent = 'brief';
  } else if (advisoryFailures.length > 0) {
    recommendedNextAgent = 'editorial-reviewer';
  }

  return {
    path: metrics.path,
    status: blockingFailures.length === 0 ? 'pass' : 'fail',
    checks,
    blocking_failures: blockingFailures.map((c) => c.id),
    advisory_failures: advisoryFailures.map((c) => c.id),
    auto_fixable: checks.filter((c) => c.status === 'fail' && c.autoFixable).map((c) => c.id),
    recommended_next_agent: recommendedNextAgent,
  };
}

module.exports = { runGates };
