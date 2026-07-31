/**
 * Single source of truth for the product taxonomy.
 *
 * Category identity was previously duplicated across five places that drifted
 * apart: the header dropdown, the homepage's hardcoded guide tiles, the
 * homepage sidebar (derived from `posts/` directory names), the `app/best/*`
 * route tree, and a hardcoded list in `app/sitemap.ts`.
 *
 * The drift was not cosmetic. The sidebar linked to `/best/{contentDir}`, but
 * the routes use a different slug for power stations, so the largest category
 * on the site — 26% of the catalogue — 404'd from the homepage. Anything that
 * needs a category name, icon, route, or its posts must read it from here.
 */
export interface Category {
  /** Route segment under /best — the canonical public identifier. */
  slug: string;
  /** Directory under posts/ holding this category's reviews. */
  contentDir: string;
  name: string;
  /** Compact label for dense surfaces such as nav and breadcrumbs. */
  shortName: string;
  icon: string;
  description: string;
}

export const CATEGORIES: Category[] = [
  {
    slug: 'power-stations',
    // Deliberately different from the slug: renaming the directory would break
    // every existing post URL, so the mapping lives here instead.
    contentDir: 'portable-power-stations',
    name: 'Portable Power Stations',
    shortName: 'Power Stations',
    icon: '⚡',
    description:
      'Battery generators for camping, RVs, van life, CPAP machines and home backup, tested for real-world capacity and recharge speed.',
  },
  {
    slug: 'headphones',
    contentDir: 'headphones',
    name: 'Headphones & Earbuds',
    shortName: 'Headphones',
    icon: '🎧',
    description:
      'Noise-cancelling headphones and wireless earbuds rated for sound quality, comfort and battery life.',
  },
  {
    slug: 'cameras',
    contentDir: 'cameras',
    name: 'Cameras & Photography',
    shortName: 'Cameras',
    icon: '📷',
    description:
      'Mirrorless, hybrid and professional bodies assessed on image quality, autofocus and video capability.',
  },
  {
    slug: 'tvs',
    contentDir: 'tvs',
    name: 'TVs',
    shortName: 'TVs',
    icon: '📺',
    description: 'OLED, QLED and budget sets measured for picture quality, gaming latency and value.',
  },
  {
    slug: 'wearables',
    contentDir: 'wearables',
    name: 'Wearables',
    shortName: 'Wearables',
    icon: '⌚',
    description: 'Smartwatches and fitness trackers judged on accuracy, battery life and app ecosystem.',
  },
  {
    slug: 'laptops',
    contentDir: 'laptops',
    name: 'Laptops',
    shortName: 'Laptops',
    icon: '💻',
    description: 'Ultrabooks, gaming laptops and MacBooks benchmarked for performance and battery life.',
  },
  {
    slug: 'monitors',
    contentDir: 'monitors',
    name: 'Monitors',
    shortName: 'Monitors',
    icon: '🖥️',
    description: '4K, ultrawide and high-refresh displays compared on colour accuracy and response time.',
  },
  {
    slug: 'gaming',
    contentDir: 'gaming',
    name: 'Gaming Gear',
    shortName: 'Gaming',
    icon: '🎮',
    description: 'Keyboards, mice and accessories tested for latency, build quality and ergonomics.',
  },
  {
    slug: 'smart-home',
    contentDir: 'smart-home',
    name: 'Smart Home',
    shortName: 'Smart Home',
    icon: '🏠',
    description: 'Robot vacuums, smart speakers and connected devices rated on automation and reliability.',
  },
  {
    slug: 'knives-tools',
    contentDir: 'knives-tools',
    name: 'Knives & Tools',
    shortName: 'Knives & Tools',
    icon: '🔪',
    description: 'Everyday-carry knives and hand tools assessed for edge retention, materials and value.',
  },
];

const BY_SLUG = new Map(CATEGORIES.map((c) => [c.slug, c]));
const BY_CONTENT_DIR = new Map(CATEGORIES.map((c) => [c.contentDir, c]));

export function getCategoryBySlug(slug: string): Category | undefined {
  return BY_SLUG.get(slug);
}

/** Resolves the category a post belongs to from its `posts/` directory name. */
export function getCategoryByContentDir(contentDir: string): Category | undefined {
  return BY_CONTENT_DIR.get(contentDir);
}

/**
 * Route for a category, accepting either identifier.
 *
 * Call this rather than interpolating `/best/${category}` — that pattern is
 * exactly what produced the 404s, because a post's category is a content
 * directory name and not always the route slug.
 */
export function categoryHref(slugOrContentDir: string): string {
  const category = BY_SLUG.get(slugOrContentDir) ?? BY_CONTENT_DIR.get(slugOrContentDir);
  return category ? `/best/${category.slug}` : '/best';
}

export function categoryLabel(slugOrContentDir: string): string {
  const category = BY_SLUG.get(slugOrContentDir) ?? BY_CONTENT_DIR.get(slugOrContentDir);
  return category ? category.name : 'Reviews';
}
