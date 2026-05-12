# For Designers

The visual and interaction system behind ProductLabR — tokens, type, components, and motion — written so you can design *with* the system, not against it.

## Design language

Editorial, magazine-inspired, restrained. Reference points: TechRadar, Wirecutter, The Verge — confident typography, generous whitespace, a single accent color used sparingly, and product photography that's allowed to breathe.

## Color tokens

Defined in `styles/theme.css` as HSL CSS variables. Use them through Tailwind utilities (e.g. `bg-primary`, `text-neutral-700`), never as hex literals in components.

| Token | Value | Use |
|---|---|---|
| `--primary` | `hsl(204 100% 40%)` ≈ `#007ACC` | Links, primary buttons, score highlights |
| `--primary-dark` | `#005C99` | Primary hover/pressed |
| `--primary-darker` | `#003D66` | Primary active / focused background |
| `--primary-light` | `#B3D9FF` | Subtle highlights, table emphasis |
| `--primary-lightest` | `#E6F2FF` | Hero gradients, callout backgrounds |
| `--accent` | `hsl(24 79% 56%)` ≈ `#E87B35` | Award badges, single-point emphasis |
| `--neutral-50 → 900` | warm grays | Body text, borders, surfaces |
| `--success` / `--error` | semantic | Pros/cons, validation states |

**Rule of thumb:** the accent orange is the loudest color in the system. Limit it to one element per viewport (typically an award badge or a CTA). Everything else lives in primary blue + neutral grays.

## Typography

Two families, both Google Fonts with `display: swap`.

| Family | Role | Typical sizes |
|---|---|---|
| **Playfair Display** (`--font-display`) | Editorial headings (article titles, hero headlines, section H2s) | 28–56px |
| **Inter** (`--font-sans`) | Body, UI, metadata, captions | 13–17px |

**Article-body type** (`.article-body` in `styles/global.css`):

- Body: **15px / 1.8** line height
- H2: **20px** semibold, **2px blue underline**, anchor-linkable, `scroll-margin-top: 5rem` so deep-links don't hide under the sticky header
- H3: **17px** semibold
- Links: primary blue with underline offset (no hover color shift — only weight)
- Code: light gray surface, monospace
- Blockquote: light blue surface, left border in primary

When designing new content components, **match `.article-body` rhythm** so they sit naturally inside reviews.

## Spacing & layout

- Tailwind's default spacing scale (4px base). Stick to it — don't introduce arbitrary `mt-[13px]`.
- **Max content width:** `--max-width: 1280px`. The home and best hubs use `lg:grid-cols-[7fr_3fr]` (content / sidebar).
- **Article columns:** narrower body (~720px) for readability; sidebars hug the right rail on `lg+`.
- **Section rhythm:** vertical gaps usually `gap-8` (32px) on desktop, `gap-6` (24px) on mobile.

## Radii, shadows, borders

- `--radius: 0.5rem` (8px) → Tailwind `rounded-md`. `rounded-lg` and `rounded-sm` derive from it.
- `shadow.card-hover` and `shadow.featured` are defined in `tailwind.config.ts` — use these instead of inventing custom shadows.
- Borders are usually `border-neutral-200` at rest, `border-primary-light` on hover/active.

## Component anatomy

The components below are the visual building blocks. Full props in [reference/components.md](./reference/components.md); design-relevant anatomy here.

### `RankedProductCard`

The workhorse of category pages.

```
┌──────────────────────────────────────────────┐
│  #1   [Award Badge — orange or blue]         │  ← rank chip top-left
│ ┌──────────┐                                 │
│ │          │   Product Name (Playfair, 20px) │
│ │  image   │   1-line summary (Inter, 14px)  │
│ │          │   Score 9.2 · $1,099            │
│ └──────────┘                                 │
│                  [Buy Now →]   (stretched)   │
└──────────────────────────────────────────────┘
```

- **Whole card is clickable** (stretched link). The Buy button morphs on hover.
- **Lift + shadow on hover** — see commits `48b962d`, `11a141b`. Subtle: 2–4px translate, slight shadow bloom. Don't exaggerate.
- Badge color: `best-overall` uses accent orange; `best-value` and `budget-pick` use blue variants.

### `ScoreCard` / `ScoreBadge`

- Big circular badge with the 0–10 score.
- Color ramp: ≥9 = primary, 7–8.9 = primary-light, <7 = neutral.
- Pairs with `StarRating` (0–5 derived) for at-a-glance comprehension.

### `ComparisonCard`

Side-by-side, two-column grid. Winning rows (e.g. higher capacity) get a **primary-light background tint** — never a heavy fill. Verdict box sits below the spec table.

### `PowerStationQuiz`

Three sequential questions with emoji icons. Submit is disabled until all three are answered. On submit, routes to one of the seven sub-category pages via a deterministic matrix in `getRoute()`.

Design rules:
- Keep options visually balanced — no option should feel like the obvious "right answer."
- Icons are decorative; never the only signifier (label is always present).
- Final CTA uses primary fill, not accent.

### `Newsletter`

Single input + button. Inline validation only; never a modal.

### `AdBanner`

In dev, shows a **labeled gray placeholder** at the configured size. In prod, the real AdSense unit. Design around the *placeholder* dimensions so layouts don't shift when ads load (CLS budget is tight — target < 0.1).

## Motion

Framer Motion is installed but used **sparingly**. The aesthetic is editorial, not playful.

- **Card hover:** transform + shadow, 150–200ms, ease-out.
- **Page transitions:** none. Static export + GitHub Pages = no SPA transitions.
- **Quiz step transitions:** fade + slight slide if added; keep under 250ms.
- **Reduced motion:** respect `prefers-reduced-motion`. Any new motion needs a `@media (prefers-reduced-motion: reduce)` fallback.

## Imagery

- **Product shots on white/transparent** preferred. Lifestyle imagery only for hero blocks.
- All images go through `OptimizedImage` → Next.js Image → WebP/AVIF. Provide an explicit width/height to prevent CLS.
- **Remote domains** are whitelisted (S3, Bob Vila, Future CDN). New domains require a code change.
- **Hero images** typically 16:9 or 3:2. Cards use 4:3.

## Accessibility

This is a hard requirement, not aspirational. The site targets **Lighthouse Accessibility > 95**.

- **Color contrast:** body text on white must clear 4.5:1. Primary blue on white passes; light blues don't — never use `--primary-lightest` for text.
- **Focus rings:** visible. Don't suppress the default outline unless you replace it with an equally visible one.
- **Semantic HTML:** headings in order; lists are `<ul>`/`<ol>`; buttons are `<button>` not styled `<div>`s.
- **Alt text:** every product image needs descriptive alt; decorative icons use `aria-hidden`.
- **Tap targets:** ≥44×44px on mobile.

## How to propose a design change

1. Sketch in Figma against the **token list above** — if your design needs a new token, that's a system-level decision, call it out.
2. Reference existing components by name when handing off. If the change extends an existing component (new variant), add it via `class-variance-authority` rather than forking the component.
3. Note any motion timings and reduced-motion fallbacks in the spec.
4. For new content patterns, propose them as a markdown-renderable construct first — if it can't be expressed in markdown + frontmatter, the editorial workflow gets harder.

## Where to go next

- **Component catalog (props):** [reference/components.md](./reference/components.md)
- **Live tokens:** `styles/theme.css`, `tailwind.config.ts`
- **PM context (why these patterns exist):** [for-product-managers.md](./for-product-managers.md)
