/**
 * Editorial thresholds surfaced to readers on /methodology.
 *
 * These mirror `GATES` in scripts/editorial/config.js, which is the operational
 * source used by the audit and QA-gate tooling. That file is CommonJS and lives
 * outside the Next build graph, so the values are restated here for the app.
 * Keep the two in sync — if you change a gate, change it in both places.
 */
export const GATES = {
  minWords: 1800,
  minFaqPairs: 8,
  minH2Sections: 6,
  minNamedCompetitors: 3,
  minNumericClaims: 12,
  maxCorpusSimilarity: 0.22,
} as const;
