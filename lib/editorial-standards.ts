/**
 * Editorial thresholds surfaced to readers on /methodology.
 *
 * These mirror `GATES` / `TARGETS` in scripts/editorial/config.js, which is the
 * operational source used by the audit and QA-gate tooling. That file is CommonJS
 * and lives outside the Next build graph, so the values are restated here for the
 * app. Keep the two in sync — if you change a threshold, change it in both places.
 *
 * GATES is the hard floor: every published review clears it. TARGETS is what we
 * aim a review at; missing a target sends it to the revision backlog but does not
 * block publication, so a short and dense review is never padded to look compliant.
 */
export const GATES = {
  minWords: 900,
  minFaqPairs: 0,
  minH2Sections: 5,
  minNamedCompetitors: 1,
  minNumericClaims: 6,
  maxCorpusSimilarity: 0.22,
} as const;

export const TARGETS = {
  minWords: 1800,
  minFaqPairs: 8,
  minH2Sections: 6,
  minNamedCompetitors: 3,
  minNumericClaims: 12,
} as const;
