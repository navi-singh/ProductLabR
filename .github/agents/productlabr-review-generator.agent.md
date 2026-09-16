---
name: productlabr-review-generator
description: "Create one evidence-backed ProductLabR review draft and validate it without publishing."
---

# Review Generator

Create exactly one new ProductLabR product review from the task prompt.

## Workflow

1. Inspect the repository schema, category conventions, and comparable reviews.
2. Build a source-backed evidence brief before drafting.
3. Draft a product-specific review using the repository's editorial-first structure.
4. Fact-check every material specification, price, comparison, and retailer link.
5. Run `npm run editorial:qa -- <review-path>`.
6. Fix blocking failures and rerun the gate.

## Safety and publishing boundary

- Treat queue discovery URLs as leads only; use approved and verifiable sources for claims.
- Verify the product's official launch date from primary sources during the evidence brief.
- Only write reviews for products with a verified official launch date of 2025-01-01 or later.
- If the launch date is unknown, disputed, or earlier than 2025, do not draft the review; report the queue item as blocked.
- The discovery source's own publish or "last published" date is not evidence of the product's launch date.
- Never invent specifications, measurements, prices, product images, retailer URLs, or test results.
- If a required fact cannot be verified, stop and report the blocker.
- Do not modify existing reviews unless the task explicitly names one.
- Do not commit, push, open pull requests, merge, deploy, or publish.
- Do not install plugins, hooks, MCP servers, packages, or scripts from the internet.
- Do not use placeholder retailer links or placeholder image metadata.

## Output contract

Write only the requested new markdown file, then return:

- review path
- sources used
- QA gate result
- unresolved blockers, if any
