export interface NavCategory {
  name: string;
  href: string;
  icon: string;
  count: number;
}

export const NAV_CATEGORIES: NavCategory[] = [
  { name: 'Laptops',              href: '/best/laptops',          icon: '💻', count: 0  },
  { name: 'TVs',                  href: '/best/tvs',              icon: '📺', count: 0  },
  { name: 'Headphones & Earbuds', href: '/best/headphones',       icon: '🎧', count: 0  },
  { name: 'Smartphones',          href: '/best/smartphones',      icon: '📱', count: 0  },
  { name: 'Monitors',             href: '/best/monitors',         icon: '🖥️', count: 0  },
  { name: 'Smart Home',           href: '/best/smart-home',       icon: '🏠', count: 0  },
  { name: 'Wearables',            href: '/best/wearables',        icon: '⌚', count: 0  },
  { name: 'Gaming',               href: '/best/gaming',           icon: '🎮', count: 0  },
  { name: 'Cameras',              href: '/best/cameras',          icon: '📷', count: 15 },
  { name: 'Power Stations',       href: '/best/power-stations',   icon: '⚡', count: 33 },
];
