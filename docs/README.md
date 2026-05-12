# ProductLabR Documentation

> Editorial product-review site built on Next.js App Router. 101 markdown reviews across 10 categories, statically exported to GitHub Pages, monetized through AdSense and affiliate links.

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

## Operational guides

These live at the repo root because they were authored before this docs tree existed. Linked here for discoverability.

- **[PRODUCTION.md](../PRODUCTION.md)** — Deployment checklist, performance targets, post-deploy validation
- **[ADSENSE_SETUP.md](../ADSENSE_SETUP.md)** — How to wire AdSense in production
- **[BEST_SECTION_README.md](../BEST_SECTION_README.md)** — Background on the "Best of" hub

## Active work

In-flight specs and plans live under `docs/superpowers/`:

- **Spec:** [Power Station Categories Design](./superpowers/specs/2025-05-06-power-station-categories-design.md)
- **Plan:** [Power Station Category Expansion](./superpowers/plans/2025-05-06-power-station-category-expansion.md)

---

## Documentation philosophy

This tree follows the [Diátaxis](https://diataxis.fr/) split between *explanation* (the audience guides), *reference* (`reference/`), and *how-to* (the operational guides above). If you add a doc, ask which quadrant it belongs in before placing it.
