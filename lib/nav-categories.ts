export interface NavCategory {
  name: string;
  href: string;
  icon: string;
  count?: number;
}

export const NAV_CATEGORIES: NavCategory[] = [
  { name: 'Power Stations',       href: '/best/power-stations',   icon: '⚡' },
  { name: 'Headphones & Earbuds', href: '/best/headphones',       icon: '🎧' },
  { name: 'TVs',                  href: '/best/tvs',              icon: '📺' },
  { name: 'Wearables',            href: '/best/wearables',        icon: '⌚' },
];
