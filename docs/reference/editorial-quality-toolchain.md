# Reference — Editorial Quality Toolchain

Deterministic editorial tooling lives in `scripts/editorial/`. It audits the 149-review corpus, ranks remediation work, gates publish readiness, and gives the agent chain a stable machine-readable contract.

> **Important:** the rubric is a **quality floor, not a craft score**. Once an article clears the hard gates, scores cluster near 100 and cannot rank two publishable drafts. Use human/editorial review for voice, flow, judgment, and usefulness.

## System map

```
posts/<category>/<slug>.md
        │
        ▼
scripts/editorial/lib/corpus.js
  loadCorpus() + buildBrandIndex()
        │
        ▼
scripts/editorial/lib/metrics.js
  measurable article signals + near-duplicate detection
        │
        ├── lib/rubric.js  → 0-100 score, priority band, effort
        └── lib/gates.js   → pass/fail contract + recommended_next_agent
        │
        ▼
CLIs in scripts/editorial/*.js + .github/agents/*.agent.md
```

## Commands

| Command | Use |
|---|---|
| `npm run editorial:audit` | Audit the whole corpus, sorted worst first. |
| `npm run editorial:audit -- --category tvs --limit 10` | Audit one category and show the worst 10. |
| `npm run editorial:report` | Audit and write timestamped markdown + JSON reports into `logs/`. |
| `npm run editorial:qa -- posts/<category>/<slug>.md` | Gate one article. Exits `1` on any blocking failure. |
| `npm run editorial:qa -- --all --json` | Emit the gate contract for the whole corpus. Useful for CI wiring. |
| `npm run editorial:fix-links` | Dry-run replacement of placeholder retailer links. |
| `npm run editorial:fix-links -- --category cameras --write` | Apply link replacements for one category. |
| `npm run editorial:pilot -- --size 6 --write` | Select and arm-assign an A/B pilot set. |
| `npm run editorial:compare -- --report` | Re-score the latest pilot assignment and write comparison data. |

## Source files

| File | Responsibility |
|---|---|
| `scripts/editorial/config.js` | Single source of truth for the hard floor (`GATES`) and the editorial aspiration (`TARGETS`), plus required frontmatter, section intents, generic phrases, meta-writing patterns, and pilot defaults. |
| `scripts/editorial/lib/corpus.js` | Walks `posts/`, parses frontmatter with `gray-matter`, returns repo-relative paths, and derives global + per-category brand indexes. |
| `scripts/editorial/lib/metrics.js` | Counts words, headings, FAQ pairs, links, numeric claims, competitors, generic phrases, meta-writing, spec/rating contradictions, and 6-gram Jaccard corpus similarity. |
| `scripts/editorial/lib/rubric.js` | Computes the deterministic 0–100 score across eight weighted dimensions, assigns priority bands, and estimates rewrite effort. Scores against `TARGETS`, not `GATES`, so an article that clears the floor can still be ranked for revision. |
| `scripts/editorial/lib/gates.js` | Runs 12 publish checks and emits the stable pass/fail contract consumed by agents. |
| `scripts/editorial/audit.js` | Whole-corpus or filtered audit; optional markdown + JSON report output. |
| `scripts/editorial/qa-gate.js` | Hard publish gate for one file, one category, or the whole corpus. |
| `scripts/editorial/fix-links.js` | Replaces `#` retailer links with verifiable retailer search URLs; never invents product-detail URLs. |
| `scripts/editorial/select-pilot.js` | Selects the worst eligible articles and alternates them across A/B arms. |
| `scripts/editorial/compare-arms.js` | Re-audits assigned articles and compares final scores against recorded baselines. |

## Gate contract

`qa-gate.js` returns an object with:

| Field | Meaning |
|---|---|
| `status` | `pass` only when there are zero blocking failures. |
| `checks` | Full list of check results with `id`, `label`, `status`, `detail`, `blocking`, and `autoFixable`. |
| `blocking_failures` | Check IDs that block publication. |
| `advisory_failures` | Non-blocking check IDs. |
| `auto_fixable` | Failed checks a tool can safely fix. |
| `recommended_next_agent` | Suggested reroute: usually `draft-rewrite`, `editorial-reviewer`, or `brief`. |

### Blocking checks

> **Gates are a floor, not an aspiration.** `GATES` is published to readers on
> `/methodology` as a promise that *every* article clears it, so it must describe
> what the corpus actually meets. `TARGETS` holds the higher numbers we aim at;
> missing a target lowers the rubric score and queues the article for revision
> but never blocks publication. Raising `GATES` without first raising the corpus
> makes the public claim false — see the `editorial-gate` e2e spec, which fails
> the build in exactly that case.

| Check | Threshold / rule |
|---|---|
| `word_count` | Body has at least `GATES.minWords` (900) words. Target is 1,800. |
| `section_intents` | The four `required: true` intents are present: intro, design, performance, verdict. Comparison, audience and FAQ are scored targets, not blockers. Matched by intent, not exact heading. |
| `faq_pairs` | Not a blocking gate (`GATES.minFaqPairs` is 0). A question count is the easiest metric on the page to game, and an FAQ bolted on to clear a threshold helps nobody; the target of 8 still drives the backlog. |
| `retailer_links` | At least one retailer link and no placeholder or non-HTTPS links. |
| `frontmatter` | Required frontmatter fields are present. |
| `rating_breakdown` | `ratingBreakdown.metrics` has at least 3 scored metrics from 0–10. |
| `anti_generic` | No more than 2 templated filler phrase hits. |
| `spec_rating_consistency` | Ratings and title do not contradict the article's own spec sheet. |
| `no_meta_writing` | Reader-facing prose contains no process language such as `frontmatter` or `previous draft`. |
| `corpus_similarity` | Max 6-gram Jaccard similarity against any other article is at most 0.22. |

### Advisory checks

| Check | Threshold / rule |
|---|---|
| `named_competitors` | At least 3 competing products or brands named in the comparison section. |
| `numeric_claims` | At least 12 measured or numeric claims. |

## Rubric

`lib/rubric.js` computes a deterministic 0–100 score from eight dimensions:

| Dimension | Weight |
|---|---:|
| Depth & completeness | 20 |
| Accuracy & evidence density | 20 |
| Originality / anti-generic | 15 |
| Comparative buying guidance | 10 |
| Use-case clarity | 10 |
| Structure & FAQ | 10 |
| Link & data integrity | 10 |
| Frontmatter & render compliance | 5 |

Priority bands are `P0 < 55`, `P1 < 72`, `P2 < 85`, and `P3 >= 85`.

Do not use this score to choose between two gate-passing drafts. The A/B experiment showed why: Arm A and Arm B both reached ~99.6 and passed every gate, but blind qualitative review still separated them decisively.

## A/B decision record

The canonical record is [`logs/2026-07-26T14-09-54_editorial-ab-decision.md`](../../logs/2026-07-26T14-09-54_editorial-ab-decision.md). Do not duplicate it in full; link to it when discussing the experiment.

Key conclusions:

| Metric | Result |
|---|---|
| Mean rubric score | 73.1 baseline → 85.3 after rollout. |
| Articles passing all gates | 0 baseline → 17 after rollout. |
| Placeholder `#` retailer links | 102 → 0 after `editorial:fix-links`. |
| Nikon Z8/Z9 near-duplicate similarity | 0.875 → 0.0072 after targeted rewrites. |
| A/B deterministic result | Tie: both arms passed all gates and scored ~99.6. |
| A/B qualitative result | Arm A, the editorial-first method, won 38.3/50 vs. 29.3/50. |

Defects found by blind review became permanent gates: process/meta-writing leaks and ratings/title claims that contradict specs. The experiment also exposed copied rating criteria, near-duplicate articles, and gate-gaming in competitor mentions.

## Adopted production method

Use Arm A's editorial-first writing method, preceded by Arm B's brief stage:

1. **Audit** — run `npm run editorial:audit` and work worst-first.
2. **Brief** — build a fact table, claim map, competitor set, buyer profile, and open questions.
3. **Draft** — write the review as a critic-led argument, thesis before spec sheet.
4. **QA** — run `npm run editorial:qa -- <file>` until there are no blocking or advisory failures.
5. **Blind review** — periodically sample gate-passing work for craft, because the rubric cannot see it.

Non-negotiable rules:

- Never invent specs, prices, measurements, or benchmark figures.
- Never let readers see the machinery: no `frontmatter`, `previous draft`, or process narration.
- State who should not buy the product.
- FAQ answers must resolve purchase anxieties, not restate the body.

## Agent profiles

Permanent editorial profiles live in `.github/agents/`.

| Profile | Role in the chain |
|---|---|
| `audit.agent.md` | Runs the deterministic audit, reports scores, defects, effort, priority, and recommended next agent. |
| `brief.agent.md` | Produces the evidence packet: fact table, claim map, competitor set, buyer profile, and open questions. |
| `draft-rewrite.agent.md` | Writes the editorial-first draft or rewrite from the evidence brief and existing markdown. |
| `editorial-reviewer.agent.md` | Reviews narrative flow, product specificity, buyer utility, tradeoffs, and tone. |
| `fact-check.agent.md` | Classifies claims as confirmed, disputed, or unsupported and blocks critical factual uncertainty. |
| `qa-gate.agent.md` | Runs `npm run editorial:qa` and returns deterministic pass/fail output. |
| `editorial-orchestrator.agent.md` | Coordinates the chain, applies the adopted method, and makes final `pass` / `revise` / `block` decisions. |

The chain is:

```
Audit → Brief → Draft/Rewrite → Editorial Reviewer → Fact-check → QA Gate → Orchestrator decision
```

`planner.agent.md` is a general implementation-planning profile and is not part of the editorial remediation chain.
