# Plan — Commit editorial toolchain and article rewrites, push to `origin/main`

_Captured 2026-07-26T15-28-00 per `.github/instructions/basic.md`._

## Goal

Land the full editorial-quality workstream on `main`: the deterministic audit/QA toolchain, the
corpus-wide retailer link repair, 17 rewritten reviews, updated agent profiles, and the A/B
decision record.

## Starting state

| Item | Value |
| --- | --- |
| Branch | `main` (tracking `origin/main`) |
| Already unpushed | `60c37f4 docs(instructions): add plan-log capture rule` |
| Modified (tracked) | 125 |
| Untracked | `scripts/editorial/` + 7 files in `logs/` |
| Open PRs | none |
| Validation | `type-check` clean, `build` succeeds (183 pages) |

The 125 modified files decompose exactly, as computed from the diffs:

```
  4  .github/agents/*.agent.md
  1  package.json
103  posts/**/*.md   (retailer-link frontmatter only)
 17  posts/**/*.md   (substantive rewrites)
```

## Decisions taken

1. **Five commits, not one.** A mechanical link fix across 103 files and 17 hand-rewritten
   articles have different review and revert characteristics, so entangling them would make both
   harder to reason about later.
2. **Ordering: tooling and rules before the content they govern.** The gates that justify the
   rewrites should be readable in history before the rewrites themselves.
3. **The two ~460KB `*_editorial-audit.json` metric dumps are gitignored.** They are fully
   regenerable via `npm run editorial:audit`. The small `pilot-assignment` and `ab-results` JSON
   files stay tracked because the decision record cites them as evidence.

## Commit sequence

| # | Commit | Contents |
| --- | --- | --- |
| 1 | `feat(editorial): add deterministic audit and QA gate toolchain` | `scripts/editorial/`, `package.json` |
| 2 | `docs(agents): align editorial agent profiles with QA tooling` | 4 × `.github/agents/*.agent.md` |
| 3 | `fix(posts): replace placeholder retailer links with real search URLs` | 103 posts |
| 4 | `feat(posts): rewrite 17 reviews to publication standard` | 17 posts |
| 5 | `docs(logs): record editorial A/B decision and audit reports` | `logs/`, `.gitignore`, this plan |

## Push

Re-run `npm run type-check` and `npm run build` immediately before pushing so the pushed tree is
verified rather than assumed, then `git push origin main` and confirm
`git log --oneline origin/main..HEAD` is empty.

## Risks noted at plan time

- Pushing to `main` triggers `.github/workflows/nextjs.yml`, deploying all 17 rewritten articles
  to GitHub Pages immediately.
- The pre-existing unpushed commit `60c37f4` is carried along by the same push.
- Tests and documentation updates are deliberately out of scope; they are deferred until an
  explicit request to create or update a PR.

## Outcome

Recorded in the commit history and in
`logs/2026-07-26T14-09-54_editorial-ab-decision.md`.
