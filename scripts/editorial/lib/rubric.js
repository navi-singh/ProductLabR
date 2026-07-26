'use strict';

const { GATES, SECTION_INTENTS } = require('../config');

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
const ratio = (value, target) => clamp(value / target, 0, 1);

/**
 * Deterministic 0-100 rubric mirroring the weights agreed in the editorial
 * plan. Agents use this as the objective baseline before qualitative review.
 */
const DIMENSIONS = [
  {
    id: 'depth',
    label: 'Depth & completeness',
    weight: 20,
    score: (m) => {
      const wordScore = ratio(m.words, GATES.minWords);
      const sectionScore = ratio(m.h2Count, GATES.minH2Sections);
      return wordScore * 0.7 + sectionScore * 0.3;
    },
  },
  {
    id: 'evidence',
    label: 'Accuracy & evidence density',
    weight: 20,
    score: (m) => {
      const claims = ratio(m.numericClaims, GATES.minNumericClaims);
      const perThousand = m.words > 0 ? (m.numericClaims / m.words) * 1000 : 0;
      return claims * 0.6 + ratio(perThousand, 8) * 0.4;
    },
  },
  {
    id: 'originality',
    label: 'Originality / anti-generic',
    weight: 15,
    score: (m) => {
      const phrasePenalty = clamp(m.genericPhrases.length / 4, 0, 1);
      const metaPenalty = clamp(m.metaWriting.length / 3, 0, 1);
      const similarityPenalty = clamp(
        (m.similarity.max - GATES.maxCorpusSimilarity) / (1 - GATES.maxCorpusSimilarity),
        0,
        1
      );
      return clamp(1 - Math.max(phrasePenalty, metaPenalty, similarityPenalty * 1.2), 0, 1);
    },
  },
  {
    id: 'comparison',
    label: 'Comparative buying guidance',
    weight: 10,
    score: (m) => {
      const named = ratio(m.competitors.count, GATES.minNamedCompetitors);
      return named * 0.6 + (m.sections.comparison ? 0.4 : 0);
    },
  },
  {
    id: 'useCase',
    label: 'Use-case clarity',
    weight: 10,
    score: (m) => (m.sections.audience ? 0.6 : 0) + (m.sections.verdict ? 0.4 : 0),
  },
  {
    id: 'structure',
    label: 'Structure & FAQ',
    weight: 10,
    score: (m) => {
      const intentsMet = SECTION_INTENTS.filter((intent) => m.sections[intent.id]).length;
      const structure = intentsMet / SECTION_INTENTS.length;
      const faq = ratio(m.faqPairs, GATES.minFaqPairs);
      return structure * 0.5 + faq * 0.5;
    },
  },
  {
    id: 'links',
    label: 'Link & data integrity',
    weight: 10,
    score: (m) => {
      const links = m.retailerLinks;
      if (links.total === 0) return 0;
      return links.valid / links.total;
    },
  },
  {
    id: 'compliance',
    label: 'Frontmatter & render compliance',
    weight: 5,
    score: (m) => {
      const fieldScore = m.frontmatter.missing.length === 0 ? 1 : 0;
      return fieldScore * 0.6 + (m.frontmatter.metricsValid ? 0.4 : 0);
    },
  },
];

function scoreArticle(metrics) {
  const breakdown = DIMENSIONS.map((dimension) => {
    const normalized = clamp(dimension.score(metrics), 0, 1);
    return {
      id: dimension.id,
      label: dimension.label,
      weight: dimension.weight,
      earned: Number((normalized * dimension.weight).toFixed(2)),
    };
  });

  const total = Number(breakdown.reduce((sum, d) => sum + d.earned, 0).toFixed(2));
  return { total, breakdown };
}

function priorityFor(total) {
  if (total < 55) return 'P0';
  if (total < 72) return 'P1';
  if (total < 85) return 'P2';
  return 'P3';
}

/** Rough rewrite cost so the orchestrator can sequence a backlog. */
function effortFor(metrics) {
  const wordGap = Math.max(0, GATES.minWords - metrics.words);
  if (wordGap > 900 || metrics.faqPairs === 0) return 'high';
  if (wordGap > 300 || metrics.retailerLinks.placeholder > 0) return 'medium';
  return 'low';
}

module.exports = { scoreArticle, priorityFor, effortFor, DIMENSIONS };
