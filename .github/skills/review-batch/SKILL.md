---
name: review-batch
description: Generate several Verdict Hound reviews at once, optionally as a new category. Fans out one review-generator agent per product in parallel, then serially ingests images, runs batch QA, wires any new category, and validates. Use when asked to review a list of products, add a category of reviews, or "create reviews for these N products". For a single review, use the review-generator agent directly.
---

# Review batch: N products → parallel agents → batch gates

You are the coordinator. Product agents write reviews; you own every shared file,
every gate, and the final integration. Never let two agents write the same file.

## 1. Intake (no agents yet)

1. Collect the product list and target category. Restate it as a table:
   product, slug, category, status (`new` / `exists, skip` / `unconfirmed`).
   - Check `posts/*/<slug>.md` for existing reviews; never overwrite one.
   - Keep products that do not fit the category in their natural one
     (e.g. a gimbal vlog camera stays in `cameras`, not `action-cameras`).
   - Mark products that cannot be confirmed by an official source as
     `unconfirmed`; they need a source check before drafting.
   - Reclassify confirmed products as `new`; report and skip those that remain
     unconfirmed.
2. Work in a dedicated worktree and branch (`nmehrok/add<Category>`), not in the
   main checkout. Separate batches get separate worktrees.
3. Fix the **scoring contract** before fan-out: exactly six metric names for the
   category, quality metric first and Value last, reused verbatim by every
   review. Reuse an existing category's names when one fits. Exception: a
   product that is a class of its own (e.g. an interchangeable-lens action
   camera) may get its own six names, still quality first and Value last; agree
   them up front and pass them in that product's prompt only.
4. Create `/tmp/review-batch/<batch-id>/` and record the plan in the session
   SQL `todos` table, one todo per product.

## 2. Fan out product agents

Launch one review generator agent (`review-generator` or
`productlabr-review-generator`, whichever the runtime registers) per `new`
product with `mode: background`, at most 5 running at once. Do not poll; start
the category wiring (step 4) while they run. Each prompt must include the
following, verbatim where shown:

```text
BATCH MODE — product: <name>; slug: <slug>; category: <category>.
In the repository, write only posts/<category>/<slug>.md.
Scoring contract (use these six names verbatim, in order): <m1>…<m6>.
Do NOT edit data/product-images.json, data/image-exceptions.json,
data/image-candidates.json, lib/, app/, or any other review, and do NOT run
images:promote, images:ingest, images:place, or editorial:audit.
Instead write accepted image candidates to
/tmp/review-batch/<batch-id>/<slug>.candidates.json as
{"reviews":[{"category":"<category>","slug":"<slug>","product":"<name>","candidates":[...]}]}.
Each candidate needs id, kind (product|lifestyle), sourceTier
(free|press|product-page), HTTPS sourceUrl, sourcePage, sourceName, license,
credit, descriptive alt, and approved: true. Use only verifiably reusable
exact-model images. If none exist, write a one-sentence reason to
/tmp/review-batch/<batch-id>/<slug>.no-image.txt instead. If fewer than three
exist, explain the shortfall in your result.
Run `npm run editorial:qa -- posts/<category>/<slug>.md` until it passes.
Return: path written, QA result, image outcome, sources used, open doubts.
```

Add any facts you already verified (official URLs, launch dates, known specs)
so the agent does not redo that research.

## 3. Serial image pass (coordinator only)

For each finished slug with a candidates file, in order (fix any issue the dry
run reports first):

```bash
node scripts/images/promote-image-candidates.js --slug <slug> --candidates /tmp/review-batch/<batch-id>/<slug>.candidates.json --dry-run
node scripts/images/promote-image-candidates.js --slug <slug> --candidates /tmp/review-batch/<batch-id>/<slug>.candidates.json
npm run images:ingest -- --slug <slug>
node scripts/images/place-body-images.js --slug <slug>
```

For a slug with a no-image file, skip those commands. If neither outcome file
exists, obtain it before continuing. For a review below the image minimum, add
a `data/image-exceptions.json` entry under `reviews[slug]` with the specific
reason and today's `flaggedAt`. Never invent or reuse another model's image.

## 4. Wire a new category (skip for an existing one)

Model the change on commit `4788a37` (generic `/best/[category]` route) or
`0ae3ad8` (custom guide page):

- `lib/taxonomy.ts` category entry and `lib/Posts.ts` display name;
- hub link with a live `getPostsByCategory('<category>').length` count;
- one short placement note in `docs/for-content-editors.md`.

Edit only the lines you add; do not run Prettier over existing files.

## 5. Batch gates

1. Contract check: every review uses the six names agreed for it (shared or
   agreed exception).
2. `npm run editorial:qa -- --category <category>` and `npm run editorial:audit`.
3. Spot-check sources for every `unconfirmed` product and any surprising claim.
4. `npx tsc --noEmit` and targeted ESLint for touched code.
5. One `code-review` agent over the whole diff, not one per review.
6. Fix real failures by revising content, never by loosening gates.

Then stop and hand over: table of reviews (score, image outcome, doubts), gate
results, and how to preview (`npm run dev`, `/best/<category>`).

## 6. When the user asks to commit

Follow the repo and user commit rules: add source coverage for the reviews. For
a new category, model `e2e/<category>-source.spec.ts` on
`e2e/action-cameras-source.spec.ts` and register it in
`playwright.source.config.ts`; for an existing category, extend its coverage as
needed. Run `npm run test:build` and the source suite, then commit with a
Conventional Commit and the Co-authored-by trailer. Push only with explicit
approval. When two batch branches land together, push one, rebase the other, and
resolve the `lib/taxonomy.ts`, hub link,
`playwright.source.config.ts`, docs and `data/image-exceptions.json` conflicts
by keeping both sides.

Clean up `/tmp/review-batch/<batch-id>/` when done.
