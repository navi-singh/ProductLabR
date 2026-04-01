# Product Lab — Editorial Redesign Spec

## Overview

A holistic UI/UX redesign of Product Lab, transforming it from a functional but generic product review site into a clean, editorial-grade publication. The redesign covers every reader-facing page while keeping the existing Next.js 15 + Tailwind CSS stack and markdown-based content workflow.

**Goals:**
- Professional, trustworthy editorial design (Wirecutter/Consumer Reports aesthetic)
- Scalable to many product categories (cameras, power stations, audio, home, outdoor, etc.)
- AdSense-ready with tasteful, non-intrusive placements that prioritize reader experience
- Stronger brand identity built on the existing blue (#007ACC) foundation

**Non-goals:**
- CMS migration (markdown workflow stays)
- User accounts, comments, or social features
- Database or backend changes

---

## 1. Design System & Brand Identity

### Color Palette

| Token | Value | Usage |
|-------|-------|-------|
| `primary` | #007ACC | Brand, links, headings, score badges |
| `primary-dark` | #005C99 | Nav gradient end, hover states |
| `primary-darker` | #003D66 | Text emphasis on dark backgrounds |
| `primary-light` | #B3D9FF | Subtle backgrounds, borders |
| `primary-lightest` | #E6F2FF | Hero gradient, section washes |
| `accent` | #E87B35 | CTAs (buy buttons, subscribe), award badges, rank numbers |
| `neutral-50` | #f9fafb | Page background |
| `neutral-100` | #f3f4f6 | Card backgrounds, input fields |
| `neutral-200` | #e5e7eb | Borders, dividers |
| `neutral-500` | #6b7280 | Secondary text |
| `neutral-700` | #374151 | Body text |
| `neutral-900` | #111827 | Headlines, primary text |
| `success` | #059669 | Budget pick badges, pros |
| `success-light` | #f0fdf4 | Pros background |
| `error` | #991b1b | Cons text |
| `error-light` | #fef2f2 | Cons background |

### Typography

- **Font family:** Inter (with system font fallback stack)
- **Headlines:** 28px (h1), 20px (h2), 16px (h3) — weight 700, tight letter-spacing (-0.5px on h1)
- **Body text:** 14.5px, line-height 1.8, color neutral-700
- **Captions/labels:** 11-12px, uppercase with letter-spacing 1-2px for section labels
- **Score badges:** 13px bold white on primary background

### Spacing & Layout

- Base grid: 4px
- Content max-width: 1280px, centered
- Page grid: `7fr / 3fr` (article + sidebar) — approximately 70%/30%
- Card padding: 16-20px
- Section gap: 24px
- Border radius: 6-8px for cards, 10px for featured elements, 5px for badges

### Shadows & Elevation

- Cards at rest: none (rely on borders)
- Cards on hover: `0 2px 8px rgba(0,0,0,0.06)` — subtle lift
- Featured elements (verdict box): `0 1px 4px rgba(0,0,0,0.04)`

### Component Library

All existing components will be refactored to use the design tokens above. Key components:

- **ScoreBadge:** Compact pill — blue rounded rectangle with white score number + label (e.g., "9.2 Excellent")
- **ReviewCard:** Horizontal layout — image left, category + title + excerpt + score + date right. Blue-tinted image placeholder, hover state with light blue background
- **ProductCard:** For category pages — image + award badge + title + summary + score + price + buy CTA + specs strip
- **BuyButton:** Orange (#E87B35) primary CTA for retailer links, white secondary for alternatives
- **SectionLabel:** Uppercase, letter-spaced, with blue bar accent before text
- **Breadcrumb:** `Home › Category › Subcategory › Page` with blue links
- **VerdictBox:** Score badge + written verdict + 4 metric progress bars
- **ProsCons:** Side-by-side green/red tinted cards
- **SpecsTable:** Collapsible, 2-column grid with gray labels and dark values
- **QuickPicks:** 3-column grid of "Best Overall / Best Value / Budget Pick" summary cards
- **NewsletterCard:** Blue gradient background with email input and orange subscribe button
- **AuthorBio:** Avatar circle + name + credentials on light blue background

---

## 2. Header / Navigation

### Desktop (>768px)

- **Background:** Blue gradient (`linear-gradient(135deg, #007ACC, #005C99)`)
- **Left:** "PRODUCT LAB" in white, bold, 16px with 0.5px letter-spacing
- **Center-left:** Category links in white (85% opacity), 13px — Cameras, Power Stations, Audio, "All Categories" dropdown
- **Right:** Search input — semi-transparent white background (`rgba(255,255,255,0.15)`) with white placeholder text
- **Active category:** White underline (2px border-bottom)
- **Sticky:** Yes, z-50

### Mobile (<768px)

- **Compact:** Logo left, hamburger right
- **Menu:** Full-screen overlay with category links, search at top
- **Search:** Prominent at top of mobile menu

### "All Categories" Dropdown

- Clean flyout with category names + review counts
- Groups by product type
- Scales as new categories are added

---

## 3. Home Page

### Hero Section — Editor's Pick

- **Background:** Gradient from `#E6F2FF` to page background (`#f9fafb`)
- **Label:** "Editor's Pick" with orange dot accent, uppercase
- **Layout:** 2-column — title + subtitle + score badge + "Read review →" left, product image right
- **Image container:** White background, subtle blue shadow, rounded corners
- **Purpose:** Gives the site editorial authority, features best current review

### Latest Reviews Section

- **Section label:** "Latest Reviews" with blue bar accent
- **Layout:** Vertical list of horizontal review cards
- **Card structure:** 120px image left | category label + title + excerpt + score badge + date right
- **Image placeholders:** Blue gradient tint (`#f0f7ff → #e6f2ff`)
- **Hover:** Light blue background wash (`#f8fbff`)
- **Count:** Show 5-8 most recent reviews

### Ad Placement — Mid-page

- One leaderboard (728x90) between Latest Reviews and Best Of sections
- Dashed border, light gray background — clearly separated from content
- No ads above the fold or in the hero

### Best Of Guides Section

- **Section label:** "Best Of Guides" with blue bar accent
- **Layout:** 2x2 grid of guide cards
- **Card structure:** Left color border (alternating blue/orange) + "Updated [date]" + guide title + product count + arrow
- **Purpose:** Drives traffic to high-value category/SEO pages

### Sidebar (right column, 30%)

- **Trending:** Blue-tinted card (`#f0f7ff`) with numbered list (orange numbers), top 5 posts
- **Ad:** One 300x250 rectangle below trending
- **Newsletter:** Blue gradient card with email input and orange "Subscribe" CTA
- **Categories:** Light blue rows with blue count badges

### Footer

- **Background:** Dark (`#111827`)
- **Layout:** 4-column on desktop, single column on mobile
- **Columns:** Categories (links to each), Best Of (guide links), Company (About, Contact, Privacy, Terms), Brand info
- **Bottom bar:** Copyright + "Expert product reviews you can trust" tagline
- **Color:** White text, gray secondary text, blue links on hover

---

## 4. Review / Article Page

### Breadcrumbs

- Full path: `Home › Category › Subcategory › Product Name`
- White background, below nav, separated by border
- All segments linked except current page

### Article Header

- **Background:** Same blue gradient wash as home hero
- **Badge:** "Review" pill (blue bg, white text) + category name
- **Title:** 28px bold, max-width 780px
- **Subtitle:** 15px, neutral-500
- **Meta:** Author name (bold), updated date, reading time

### Verdict Box (top of article content)

- White card with subtle shadow
- **Left:** Large score badge (64px square, blue, rounded-12px) with label below ("Excellent", "Great", etc.)
- **Right:** "Our Verdict" heading + 2-3 sentence summary
- **Bottom:** 4-column score breakdown with progress bars (blue fill on gray track) + numeric scores
- **Purpose:** Readers get the answer immediately — the rest of the article supports it

### Product Image

- Full-width within the article column
- White background, rounded corners, subtle border
- Responsive — scales down on mobile

### Buy Box

- White card, full article width
- **Left:** Large price, "Best price across retailers" subtitle
- **Right:** Orange primary CTA ("Buy at Amazon") + gray secondary CTA ("B&H Photo")
- **Purpose:** Primary revenue driver — prominent but editorial, not ad-like

### Pros / Cons

- Side-by-side cards (50/50 on desktop, stacked on mobile)
- **Pros:** Green tint (`#f0fdf4`) with green border, checkmark prefix
- **Cons:** Red tint (`#fef2f2`) with red border, X prefix
- Bulleted lists, 13px text

### Article Content

- Clean typography: 14.5px body, 1.8 line-height
- H2 headings: 20px bold with blue bottom border (2px)
- Generous spacing between sections
- Images: full article width with rounded corners
- Blockquotes: left blue border, light background
- Code blocks: dark background with syntax highlighting (if needed)

### Specs Table

- Collapsible by default ("Full Specifications" header + "Expand" toggle)
- 2-column grid: 140px gray labels, fluid dark values
- Alternating row dividers
- Expands inline — no modal or separate page

### Mid-article Ad

- One responsive ad unit between content sections (typically after section 2-3)
- Same dashed-border treatment as home page
- This is the highest-performing ad position

### Sidebar (sticky)

- **Table of Contents:** White card, lists all H2 sections, current section highlighted with blue left border. Sticky positioning — follows scroll.
- **Ad:** One 300x250 rectangle below TOC
- **Related Reviews:** 3-4 related products from same category, showing title + score

### Author Bio

- Light blue background card at bottom of article
- Avatar circle (initials, blue gradient) + name + 1-line bio
- Links to author's other reviews (future enhancement)

---

## 5. Category / "Best" Pages

### Page Header

- Same blue gradient wash, breadcrumbs, badge ("Best Of" pill)
- Title: "The Best [Category] for [Year]"
- Subtitle: testing methodology summary (how many tested)
- Meta: author, last updated date, product count

### Quick Picks Bar

- White card at top of content area
- 3-column grid: "Best Overall", "Best Value", "Budget Pick"
- Each cell: orange label + product name + score + price
- Light blue background with blue border
- **Purpose:** Gives the answer immediately for scanners

### Ranked Product Cards

- Vertical list of product cards, numbered
- **Card structure:**
  - Left: 180x140px product image
  - Right: Award badge (orange/blue/green) + rank number + product name (18px bold) + summary + score badge + price + buy CTA + "Read Review" link
  - Bottom: Key specs strip (4-5 category-specific fields)
- **#1 card:** Orange left border (4px) to highlight top pick
- **Other cards:** Standard border, no accent
- Award badge colors: Orange = Best Overall, Blue = Best Value, Green = Budget Pick

### How We Test Section

- Blue-tinted card at bottom of product list
- Explains testing methodology for this category
- Link to full methodology page
- **Purpose:** E-E-A-T signal for Google, builds reader trust

### Sidebar

- **Jump To:** Quick nav listing all ranked products, current highlighted
- **Related Guides:** Links to sibling category pages (cross-linking)
- **Ad:** One 300x250 rectangle
- **Newsletter:** Category-specific CTA ("Get camera deals")

### Ad Placement

- One responsive ad after product #3 (between cards)
- One sidebar rectangle
- No ads above Quick Picks

---

## 6. Ad Strategy (AdSense)

### Principles

1. Reader experience first — ads never interrupt the editorial flow
2. No ads above the fold on any page
3. Clean visual separation — dashed borders, light backgrounds
4. Maximum 2-3 ad units per page
5. Buy buttons are revenue-generating but feel editorial, not ad-like

### Placements by Page

| Page | Placement | Format | Position |
|------|-----------|--------|----------|
| Home | Between sections | Leaderboard 728x90 | After Latest Reviews |
| Home | Sidebar | Rectangle 300x250 | Below Trending |
| Article | Mid-article | Responsive in-article | After section 2-3 |
| Article | Sidebar | Rectangle 300x250 | Below TOC |
| Category | Between products | Responsive in-content | After product #3 |
| Category | Sidebar | Rectangle 300x250 | Below Jump To |

### Mobile Ad Adjustments

- Leaderboard replaced with mobile banner (320x50)
- Sidebar ads move inline between content sections
- Maximum 2 ad units on mobile per page
- Interstitials: never (damages UX and SEO)

---

## 7. Mobile Design

### Responsive Breakpoints

- **Desktop:** >1024px — full grid layout with sidebar
- **Tablet:** 768-1024px — sidebar collapses below main content
- **Mobile:** <768px — single column, stacked layout

### Mobile-Specific Adaptations

- **Nav:** Compact logo + hamburger, full-screen overlay menu
- **Hero:** Stacked (image below text), smaller title (22px)
- **Review cards:** Image on top, content below (stacked)
- **Product cards (category):** Image on top, full width. Specs strip wraps to 2x2 grid
- **Pros/Cons:** Stacked vertically instead of side-by-side
- **Verdict box:** Score badge above text, breakdown bars stack to 2x2
- **Buy box:** Buttons stack full-width
- **Sidebar content:** Moves below main content — TOC becomes a collapsible dropdown at the top of the article
- **Quick Picks:** Horizontal scroll instead of 3-column grid

### Touch Targets

- All interactive elements minimum 44x44px
- Adequate spacing between tappable items
- Buy buttons full-width on mobile for easy tapping

---

## 8. New Dependencies

| Package | Purpose | Justification |
|---------|---------|---------------|
| `framer-motion` | Subtle page/component animations | Smooth transitions for collapsible specs, mobile menu, hover states |
| `inter` (via `next/font`) | Typography upgrade | Clean, professional sans-serif — loaded optimally via Next.js |

No other new dependencies. The existing stack (Tailwind, Shadcn, Radix, Lucide) covers everything else.

---

## 9. SEO Considerations

- **Breadcrumbs:** Structured data (JSON-LD) for all interior pages
- **Article schema:** Product review structured data on every review page
- **Category pages:** ItemList schema for ranked product lists
- **Core Web Vitals:** Font preloading (Inter), image optimization (already in place), minimal layout shift
- **Internal linking:** Related Reviews, Related Guides, category cross-links, breadcrumbs all strengthen the link graph
- **"How We Test" pages:** E-E-A-T signal — demonstrates expertise and process

---

## 10. Components to Create or Refactor

### New Components

| Component | Page(s) | Description |
|-----------|---------|-------------|
| `Breadcrumb` | Article, Category | Full navigation path with linked segments |
| `VerdictBox` | Article | Score + summary + breakdown bars |
| `BuyBox` | Article | Price + retailer CTAs |
| `QuickPicks` | Category | 3-column best/value/budget summary |
| `ProductCard` | Category | Ranked product with image, badge, specs strip |
| `TableOfContents` | Article | Sticky sidebar TOC with scroll tracking |
| `SectionLabel` | All | Uppercase label with blue bar accent |
| `SpecsTableCollapsible` | Article | Expandable specs with toggle |
| `SearchBar` | Header | Client-side search — filters posts by title/category from pre-loaded metadata (no search index needed at current scale) |
| `CategoryDropdown` | Header | "All Categories" flyout menu |
| `AwardBadge` | Category | Color-coded award labels |

### Components to Refactor

| Component | Changes |
|-----------|---------|
| `Header` | Blue gradient background, new nav structure, search, category dropdown |
| `Footer` | Dark theme, 4-column layout, better link organization |
| `PostPreview` / `PostsList` | Replace with horizontal ReviewCard layout |
| `Top10Popular` | Restyle as blue-tinted Trending card with orange numbers |
| `Newsletter` | Blue gradient card with orange CTA |
| `ScoreCard` | Refactor into VerdictBox with progress bars |
| `ProsCons` | Green/red tinted cards with better spacing |
| `ProductSpecs` | Collapsible version with expand/collapse toggle |
| `ArticleContent` | Updated typography, heading styles with blue borders |
| `OptimizedImage` | Blue-tinted fallback instead of gray |
| `AdBanner` / `ResponsiveAd` | Updated placement logic per ad strategy |
| `RelatedArticles` | Compact sidebar format with score badges |
| `AuthorBio` | Avatar + credentials on light blue background |

---

## 11. Pages to Update

| Page | File(s) | Scope |
|------|---------|-------|
| Home | `app/page.tsx` | Full layout rewrite — hero, latest reviews, best of, sidebar |
| Article | `app/articles/[slug]/page.tsx`, `articlePage.tsx` | Breadcrumbs, verdict box, buy box, TOC, new typography |
| Best Hub | `app/best/page.tsx` | Align with new design system |
| Category pages | `app/best/cameras/**`, `app/best/power-stations/**` | Quick picks, product cards, how we test, jump-to sidebar |
| Layout | `app/layout.tsx` | Inter font, updated header/footer |
| Error/404 | `app/error.tsx`, `app/not-found.tsx` | Align with new brand styling |

---

## 12. Design Token Implementation

All colors, spacing, typography, and shadow values will be defined as:

1. **CSS custom properties** in `styles/theme.css` — single source of truth
2. **Tailwind config extensions** in `tailwind.config.ts` — maps to CSS variables
3. **No hardcoded values** in components — always reference tokens

This ensures consistent styling and makes future theme changes trivial.
