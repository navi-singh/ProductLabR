export interface NavCategory {
  name: string;
  href: string;
  icon: string;
  count?: number;
}

export const NAV_CATEGORIES: NavCategory[] = [
  { name: 'Laptops',              href: '/best/laptops',          icon: '💻' },
  { name: 'TVs',                  href: '/best/tvs',              icon: '📺' },
  { name: 'Headphones & Earbuds', href: '/best/headphones',       icon: '🎧' },
  { name: 'Smartphones',          href: '/best/smartphones',      icon: '📱' },
  { name: 'Monitors',             href: '/best/monitors',         icon: '🖥️' },
  { name: 'Smart Home',           href: '/best/smart-home',       icon: '🏠' },
  { name: 'Wearables',            href: '/best/wearables',        icon: '⌚' },
  { name: 'Gaming',               href: '/best/gaming',           icon: '🎮' },
  { name: 'Cameras',              href: '/best/cameras',          icon: '📷', count: 15 },
  { name: 'Power Stations',       href: '/best/power-stations',   icon: '⚡', count: 33 },
];
