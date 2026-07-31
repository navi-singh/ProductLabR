import { CATEGORIES } from './taxonomy';

export interface NavCategory {
  name: string;
  href: string;
  icon: string;
  count?: number;
}

/**
 * Derived from the taxonomy so navigation can never drift from the routes or
 * omit categories. This previously listed four of the ten categories by hand,
 * leaving six reachable only through search or the homepage sidebar.
 */
export const NAV_CATEGORIES: NavCategory[] = CATEGORIES.map((category) => ({
  name: category.shortName,
  href: `/best/${category.slug}`,
  icon: category.icon,
}));
