import fs from 'fs';
import path from 'path';
import { getCategoryBySlug } from './taxonomy';

// Slugs are lower-cased, so brand capitalisation has to be restored explicitly.
const BRAND_CASING: Record<string, string> = {
  ecoflow: 'EcoFlow',
  anker: 'Anker',
  solix: 'SOLIX',
  bluetti: 'Bluetti',
  jackery: 'Jackery',
  vs: 'vs',
  tv: 'TV',
  oled: 'OLED',
  qled: 'QLED',
  usb: 'USB',
  gen2: 'Gen 2',
};

function prettify(segment: string): string {
  return segment
    .split('-')
    .map((word) => BRAND_CASING[word] ?? word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export interface Comparison {
  href: string;
  title: string;
  categorySlug: string;
  categoryName: string;
}

/**
 * Discovers `app/best/<category>/compare/<slug>` routes from the route tree.
 *
 * Comparisons were previously reachable only from inside a single category
 * page, so the ones we already publish had no shared entry point and almost no
 * internal links pointing at them. Deriving them keeps the hub honest as more
 * comparisons are added.
 */
export function getComparisons(): Comparison[] {
  const bestDir = path.join(process.cwd(), 'app', 'best');
  const comparisons: Comparison[] = [];

  for (const categoryEntry of fs.readdirSync(bestDir, { withFileTypes: true })) {
    if (!categoryEntry.isDirectory() || categoryEntry.name.startsWith('[')) continue;

    const compareDir = path.join(bestDir, categoryEntry.name, 'compare');
    if (!fs.existsSync(compareDir)) continue;

    const category = getCategoryBySlug(categoryEntry.name);

    for (const entry of fs.readdirSync(compareDir, { withFileTypes: true })) {
      if (!entry.isDirectory()) continue;
      if (!fs.existsSync(path.join(compareDir, entry.name, 'page.tsx'))) continue;

      comparisons.push({
        href: `/best/${categoryEntry.name}/compare/${entry.name}`,
        title: prettify(entry.name),
        categorySlug: categoryEntry.name,
        categoryName: category?.shortName ?? prettify(categoryEntry.name),
      });
    }
  }

  return comparisons.sort((a, b) => a.title.localeCompare(b.title));
}
