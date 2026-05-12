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

**Updated color role usage:**

| Token | Where it's used |
|---|---|
| `--primary` (#007ACC) | Header bg, score badges 8.0–8.9, active nav indicators, links |
| `--accent` (#E87B35) | Score badges ≥9.0, all primary CTA buttons, award badges, Editor's Pick dot, TrustBar checkmarks |
| `--primary-lightest` | Card hover surface tint, selected chip bg, trending widget bg |
| `--success` | "In Stock" states only — not score badges |

**Score badge color rule:** ≥9.0 = accent orange, 8.x = primary blue, 7.x = amber, <7 = neutral gray. Green is no longer used for scores.

## Typography

Two families, both Google Fonts with `display: swap`.

| Family | Role | Typical sizes |
|---|---|---|
| **Playfair Display** (`--font-display`) | Editorial headings (article titles, hero headlines, section H2s) | 20px, 32px |
| **Inter** (`--font-sans`) | Body, UI, metadata, captions | 11px, 14px, 15px |

### Type scale — 5 roles (use these, nothing else)

The site enforces a 5-role type system via Tailwind component utilities defined in `styles/global.css`. **Do not introduce new arbitrary `text-[Npx]` sizes.** Map every text element to one of these roles:

| Class | Font | Size / Weight | Use |
|---|---|---|---|
| `.type-display` | Playfair Display | 32px / 800 | Hero `<h1>`, article titles |
| `.type-headline` | Playfair Display | 20px / 700 | Section headings, card H2s |
| `.type-title` | Inter | 15px / 600 | Product names in cards, CTA text |
| `.type-body` | Inter | 14px / 400 | Descriptions, summaries, prose |
| `.type-label` | Inter | 11px / 600 + uppercase + 0.06em tracking | Badges, metadata, dates, category chips |

In practice: `<h1 className="type-display text-neutral-900">`, `<span className="type-label text-primary">`, etc. Color is always added separately — the role classes only set font, size, weight, and line-height.

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

## State layers (MD3 interaction model)

All interactive card surfaces use `.state-layer` (or `.state-layer-light` for amber/colored surfaces). These classes are defined in `styles/global.css` and replace ad-hoc hover background-color changes:

- **Hover:** `opacity-[0.06]` primary-colored overlay + `translate-y(-0.5px)` lift + `shadow-card-hover`
- **Active/pressed:** `opacity-[0.10]` overlay, no lift

Apply `.state-layer` to any new card or interactive surface. Note that `overflow-hidden` is baked in — child `box-shadow` and overflow dropdowns will be clipped.

## Mobile navigation

On `< md` breakpoints, the `MobileBottomNav` component renders a fixed bottom bar with 4 tabs: Home, Best Of, Search (disabled placeholder), Categories. Categories opens a slide-up sheet. Design new mobile entry points as additional tabs here, not as hamburger expansions.

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
