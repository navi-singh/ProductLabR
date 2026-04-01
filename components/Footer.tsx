import Link from 'next/link';

const footerSections = [
  {
    title: 'Categories',
    links: [
      { label: 'Laptops', href: '/best/laptops' },
      { label: 'TVs', href: '/best/tvs' },
      { label: 'Headphones & Earbuds', href: '/best/headphones' },
      { label: 'Smartphones', href: '/best/smartphones' },
      { label: 'Monitors', href: '/best/monitors' },
      { label: 'Smart Home', href: '/best/smart-home' },
      { label: 'Wearables', href: '/best/wearables' },
      { label: 'Gaming', href: '/best/gaming' },
      { label: 'Cameras', href: '/best/cameras' },
      { label: 'Power Stations', href: '/best/power-stations' },
    ],
  },
  {
    title: 'Best Of',
    links: [
      { label: 'Best Gaming Laptops', href: '/best/laptops/gaming-laptops' },
      { label: 'Best OLED TVs', href: '/best/tvs/best-oled-tvs' },
      { label: 'Best Wireless Earbuds', href: '/best/headphones/best-wireless-earbuds' },
      { label: 'Best Smartwatches', href: '/best/wearables/best-smartwatches' },
      { label: 'Best Hybrid Cameras', href: '/best/cameras/hybrid-cameras' },
      { label: 'Best Pro Cameras', href: '/best/cameras/professional-cameras' },
      { label: 'Best Portable Power Stations', href: '/best/power-stations/portable-power-stations' },
      { label: 'Best Camping Power Stations', href: '/best/power-stations/camping-power-stations' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', href: '/about' },
      { label: 'Contact', href: '/contact' },
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Use', href: '/terms' },
    ],
  },
];

export function Footer() {
  return (
    <footer className="mt-16 bg-neutral-900 text-white">
      <div className="mx-auto max-w-content px-4 py-12 sm:px-6">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link href="/" className="text-base font-bold tracking-wide">PRODUCT LAB</Link>
            <p className="mt-3 text-sm leading-relaxed text-neutral-400">
              Expert product reviews you can trust. Professional testing and honest comparisons to help you make informed buying decisions.
            </p>
          </div>
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-neutral-300">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-neutral-400 hover:text-primary-light">{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-10 border-t border-neutral-800 pt-6 text-center text-xs text-neutral-500">
          © {new Date().getFullYear()} Product Lab. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
