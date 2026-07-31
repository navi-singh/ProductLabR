import Link from 'next/link';
import { CATEGORIES } from '@/lib/taxonomy';

// Guide routes are curated rather than derived: these are the highest-intent
// entry points, not simply the first guides in the tree.
const BEST_OF_LINKS = [
  { label: 'Best Gaming Laptops', href: '/best/laptops/gaming-laptops' },
  { label: 'Best OLED TVs', href: '/best/tvs/best-oled-tvs' },
  { label: 'Best Wireless Earbuds', href: '/best/headphones/best-wireless-earbuds' },
  { label: 'Best Smartwatches', href: '/best/wearables/best-smartwatches' },
  { label: 'Best Hybrid Cameras', href: '/best/cameras/hybrid-cameras' },
  { label: 'Best Portable Power Stations', href: '/best/power-stations/portable-power-stations' },
  { label: 'Best Camping Power Stations', href: '/best/power-stations/camping-power-stations' },
];

const COMPANY_LINKS = [
  { label: 'About', href: '/about' },
  { label: 'How we test', href: '/methodology' },
  { label: 'Affiliate disclosure', href: '/disclosure' },
  { label: 'Privacy policy', href: '/privacy' },
  { label: 'All reviews', href: '/reviews' },
  { label: 'Comparisons', href: '/compare' },
];

export function Footer() {
  return (
    <footer className="mt-16 bg-neutral-900 pb-20 text-white md:pb-0">
      <div className="mx-auto max-w-content px-4 py-12 sm:px-6">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link href="/" className="text-base font-bold tracking-wide">PRODUCT LAB</Link>
            <p className="mt-3 text-sm leading-relaxed text-neutral-400">
              Independent product reviews scored against a fixed rubric, so you can tell which
              trade-off you are actually buying.
            </p>
            <p className="mt-3 text-xs leading-relaxed text-neutral-500">
              Reader-supported: we may earn a commission on purchases made through links on this
              site.
            </p>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-neutral-300">Categories</h3>
            <ul className="space-y-2">
              {CATEGORIES.map((category) => (
                <li key={category.slug}>
                  <Link href={`/best/${category.slug}`} className="text-sm text-neutral-400 hover:text-primary-light">
                    {category.shortName}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-neutral-300">Best Of</h3>
            <ul className="space-y-2">
              {BEST_OF_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-neutral-400 hover:text-primary-light">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-neutral-300">Company</h3>
            <ul className="space-y-2">
              {COMPANY_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-neutral-400 hover:text-primary-light">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-10 border-t border-neutral-800 pt-6 text-center text-xs text-neutral-500">
          © {new Date().getFullYear()} Product Lab. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
