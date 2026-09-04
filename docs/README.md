# ProductLabR Documentation

> Editorial product-review site built on Next.js App Router. 149 markdown reviews across 11 categories, statically exported to GitHub Pages, monetized through AdSense and affiliate links.

This documentation is organized by **who you are** and **what you're trying to do** — pick the entry point that matches your role.

---

## Start here

| If you are a… | Read this | You'll learn |
|---|---|---|
| 🧭 **First-time visitor** | [overview.md](./overview.md) | What the product is, how it makes money, what's on the roadmap |
| 📊 **Product Manager** | [for-product-managers.md](./for-product-managers.md) | Information architecture, category strategy, monetization model, success metrics |
| 💻 **Developer** | [for-developers.md](./for-developers.md) | Local setup, routing, data layer, deployment, contribution workflow |
| 🎨 **Designer** | [for-designers.md](./for-designers.md) | Design tokens, typography, component anatomy, motion language |
| ✍️ **Content editor** | [for-content-editors.md](./for-content-editors.md) | How to write a review, frontmatter schema, image rules, publishing |

## Reference

Deep technical references — open when you need exact field names, route paths, or component props.

- **[architecture.md](./architecture.md)** — System architecture, data flow, rendering model
- **[reference/content-schema.md](./reference/content-schema.md)** — Full frontmatter schema for `posts/*.md`
- **[reference/components.md](./reference/components.md)** — Component catalog with props
- **[reference/routes.md](./reference/routes.md)** — Complete route map
- **[reference/editorial-quality-toolchain.md](./reference/editorial-quality-toolchain.md)** — Editorial audit, QA gates, A/B decision, and agent chain
- **[reference/playwright-e2e.md](./reference/playwright-e2e.md)** — Playwright UI tests, production mode, and browser-only bug patterns

## Operational guides

These live at the repo root because they were authored before this docs tree existed. Linked here for discoverability.

- **[PRODUCTION.md](../PRODUCTION.md)** — Deployment checklist, performance targets, post-deploy validation
- **[ADSENSE_SETUP.md](../ADSENSE_SETUP.md)** — How to wire AdSense in production
- **[BEST_SECTION_README.md](../BEST_SECTION_README.md)** — Background on the "Best of" hub

## Active work

Specs and plans live under `docs/superpowers/`. Completed work is kept for reference.

| Status | Doc | What it covers |
|---|---|---|
| ✅ Shipped | [UI Redesign Spec](./superpowers/specs/2026-05-11-ui-redesign-material-design.md) | MD3 alignment — type scale, color roles, hero, cards, mobile nav |
| ✅ Shipped | [UI Redesign Plan](./superpowers/plans/2026-05-11-ui-redesign-material-design.md) | 12-task implementation plan for the UI redesign |
| 📋 Planned | [Power Station Categories Design](./superpowers/specs/2025-05-06-power-station-categories-design.md) | 7 new sub-category pages + comparisons + finder quiz |
| 📋 Planned | [Power Station Category Expansion](./superpowers/plans/2025-05-06-power-station-category-expansion.md) | Implementation plan for the category expansion |
| 📝 Current | [September 2026 Context](./context/context_2026_09_03.md) | Current inventory, architecture, and worktree context |

---

## Documentation philosophy

This tree follows the [Diátaxis](https://diataxis.fr/) split between *explanation* (the audience guides), *reference* (`reference/`), and *how-to* (the operational guides above). If you add a doc, ask which quadrant it belongs in before placing it.
