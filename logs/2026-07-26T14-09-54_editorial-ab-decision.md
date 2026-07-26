# Editorial A/B experiment — decision record

Date: 2026-07-26
Plan of record: `logs/2026-07-26T13-39-13.472-07-00_editorial-review-plan.md`
Status: **Decided — Arm A (editorial-first) wins. Adopt as the production method.**

---

## 1. What was built

A deterministic editorial toolchain now lives in `scripts/editorial/`, wired into npm:

| Command | Purpose |
| --- | --- |
| `npm run editorial:audit` | Scores every article 0–100 against the rubric and ranks the remediation backlog |
| `npm run editorial:report` | Same, plus timestamped markdown + JSON reports into `logs/` |
| `npm run editorial:qa` | Hard publish gate for one/many articles; exit code 1 on any blocking failure |
| `npm run editorial:fix-links` | Replaces placeholder retailer links with real retailer search URLs |
| `npm run editorial:pilot` | Selects and arm-assigns the A/B pilot set |
| `npm run editorial:compare` | Scores the two arms against their recorded baselines |

The gate is the contract the `.github/agents/*` chain consumes: it emits
`status`, `checks`, `blocking_failures`, `auto_fixable` and `recommended_next_agent`.

### Hard gates enforced
word count ≥ 1800 · all 7 section intents present · ≥ 8 FAQ pairs · no placeholder or
non-HTTPS retailer links · required frontmatter complete · `ratingBreakdown` parseable ·
no templated filler phrases · corpus similarity ≤ 0.22 · **no process/meta language** ·
**ratings and title must not contradict the spec sheet**

The last two gates were added *as a direct result of* defects the blind review caught.

---

## 2. Baseline (127 articles)

| Metric | Before | After link fix | After pilot | After rollout |
| --- | --- | --- | --- | --- |
| Mean rubric score | 73.1 | 81.1 | 82.8 | **85.3** |
| Articles passing all gates | 0 | 0 | 6 | **17** |
| P0 (critical) | 5 | 1 | 0 | **0** |
| P1 | 64 | 18 | 7 | **0** |
| Articles with placeholder links | 102 | 0 | 0 | **0** |
| Meta-writing leaks | — | — | 6 | **0** |
| Spec/rating contradictions | 1 | 1 | 1 | **0** |
| Near-duplicate articles | 23 | 23 | 23 | **19** |

Worst categories at baseline were **smart-home (58.8)**, **cameras (62.4)** and
**headphones (68.1)** — note this contradicts the original plan's line-count proxy,
which had pointed at laptops/monitors. The pilot was re-based on this rubric evidence.

---

## 3. The A/B experiment

Six worst-scoring articles, alternated down the ranked list to balance difficulty
(Arm A baseline mean 58.9, Arm B 62.9).

* **Arm A — editorial-first.** Work like a senior human editor: read the source, form a
  thesis, write in a distinctive opinionated voice, weave comparison and buyer guidance
  into the narrative.
* **Arm B — pipeline-first.** Explicit staged pipeline per article: structured Brief
  (fact table, claim map, competitor set, buyer profile) → Draft → QA loop.

### Deterministic result — a tie

| Arm | Baseline → Final | Gates | Mean words | Mean FAQ |
| --- | --- | --- | --- | --- |
| A | 58.87 → 99.69 (+40.82) | 3/3 | 2451 | 8 |
| B | 62.88 → 99.56 (+36.68) | 3/3 | 2559 | 9 |

Both arms cleared every hard gate. **The rubric saturates once the gates pass, so it
cannot discriminate craft.** This is the single most important methodological finding:
the deterministic score is a *floor*, not a measure of quality.

### Blind qualitative tie-break — Arm A wins decisively

A reviewer scored all six articles blind on five machine-uncheckable criteria
(voice, buyer utility, evidence quality, comparative insight, flow/FAQ value), with the
mechanical criteria explicitly excluded.

| Arm | Articles | Mean score /50 |
| --- | --- | --- |
| **A** | knife 42, Leica 39, Echo 4th 34 | **38.3** |
| B | Echo Dot 33, Bose 31, Canon 24 | 29.3 |

Unprompted, the reviewer split the six into two stylistic groups and **its
"critic-led argument pieces" group was exactly Arm A output**, while its "templated
spec-to-buyer guides" group was dominated by Arm B. The arms were genuinely
distinguishable by craft alone.

**Decision: adopt Arm A (editorial-first) as the production method.**

---

## 4. Defects the experiment exposed

1. **Process language leaked into published prose** — all six articles narrated their own
   production ("the frontmatter lists…", "the previous draft noted…"). Invisible to the
   rubric, obvious to a reader. → Now blocked by the `no_meta_writing` gate.
2. **Ratings contradicting the spec sheet** — `posts/cameras/leica_m11.md` scored
   "Video Capabilities" 9.0 and "Autofocus Performance" 8.0 on a camera whose own specs
   read "No video recording" and "Manual focus rangefinder", and the title advertised
   video. → Now blocked by the `spec_rating_consistency` gate.
3. **Copy-pasted rating criteria** — `posts/knives-tools/anso_aros_knife.md` graded a
   folding knife on "Water Resistance", "Breathability" and "Comfort and Mobility",
   inherited from an unrelated jacket review. Fixed during the pilot.
4. **Near-duplicate articles** — 23 of 127 exceed the similarity gate, concentrated in
   cameras (13) and portable-power-stations (10). `nikon_z8` and `nikon_z9` are **87.5%
   identical**. This is a duplicate-content and credibility risk and is the largest single
   remaining defect.
5. **Gate-gaming** — agents optimised the advisory competitor check by name-dropping
   irrelevant brands. Competitor detection is now category-scoped with proper-noun
   extraction restricted to the comparison section.

---

## 5. Adopted production method

Use the Arm A editorial-first prompt, plus the one element of Arm B that measurably
helped: **Arm B's Brief stage kept claims grounded and surfaced competitor gaps early**.

1. **Audit** — `npm run editorial:audit` to rank the backlog.
2. **Brief** — extract fact table, claim map, competitor set, buyer profile (from Arm B).
3. **Draft** — editorial-first, thesis before spec sheet, distinctive voice (from Arm A).
4. **QA** — `npm run editorial:qa <file>` until PASS with zero warnings.
5. **Blind review** — periodic qualitative sampling, since the rubric cannot see craft.

### Non-negotiable rules for writers and agents
- Never invent specs, prices or measurements; ground every claim in the article's own
  frontmatter or established fact.
- Never let the reader see the machinery: no "frontmatter", no "the previous draft".
- State plainly who should **not** buy the product.
- FAQ answers must resolve unanswered purchase anxieties, not restate the body.

---

## 6. Rollout so far

The adopted method was applied to 11 further articles in three parallel tranches,
bringing the total rewritten to **17**:

| Tranche | Articles | Result |
| --- | --- | --- |
| Pilot (A/B) | knife, Leica M11, Echo 4th, Echo Dot 5th, Canon R6 II, Bose QC Ultra | 6/6 pass |
| smart-home | Roomba Combo j9+, Nest Audio, RoboVac 11S, Dreame L20 Ultra | 4/4 pass |
| audio + gaming | AirPods Pro 2, Jabra Elite 8 Active, Redragon K552, HomePod mini | 4/4 pass |
| cameras (de-dup) | Nikon Z8, Nikon Z9, Sony A7 IV | 3/3 pass |

The camera tranche targeted the duplicate-content defect directly:
**Nikon Z8 vs Z9 similarity fell from 0.875 to 0.0072.**

A third contradictory rating metric was also found and fixed during rollout
(Eufy RoboVac 11S), confirming defect class 3 is systemic rather than isolated.

## 7. Next actions

1. Continue remediation worst-first: **TVs (78.2)**, monitors (80.1), laptops (82.1),
   gaming (83.2) are now the weakest categories.
2. De-duplicate the remaining 19 near-identical articles, concentrated in
   portable-power-stations.
3. Consider wiring `npm run editorial:qa -- --all` into CI once the backlog clears,
   so no article can regress below the gate.
4. Re-run a blind craft review after the next tranche — the deterministic rubric
   cannot detect the quality regressions that matter most.
