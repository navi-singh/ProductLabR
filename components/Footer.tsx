import Link from 'next/link';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: 'Categories',
      links: [
        { href: '/best/power-stations', label: 'Power Stations' },
        { href: '/best/cameras', label: 'Cameras' },
        { href: '/best/knives-tools', label: 'Tools & Knives' },
      ],
    },
    {
      title: 'Reviews',
      links: [
        { href: '/best', label: 'Best Products' },
        { href: '/', label: 'Latest Reviews' },
        { href: '/best/power-stations/portable-power-stations', label: 'Portable Power' },
        { href: '/best/cameras/hybrid-cameras', label: 'Hybrid Cameras' },
      ],
    },
    {
      title: 'Company',
      links: [
        { href: '/about', label: 'About Us' },
        { href: '/contact', label: 'Contact' },
        { href: '/privacy', label: 'Privacy Policy' },
        { href: '/terms', label: 'Terms of Service' },
      ],
    },
  ];

  return (
    <footer className="bg-gray-900 text-white mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="md:col-span-1">
            <h3 className="text-xl font-bold mb-4">PRODUCT LAB</h3>
            <p className="text-gray-400 text-sm leading-relaxed mb-4">
              Professional product reviews you can trust. We test products thoroughly to bring you honest, detailed recommendations.
            </p>
            <div className="text-sm text-gray-500">
              <p>© {currentYear} Product Lab</p>
              <p>All rights reserved</p>
            </div>
          </div>

          {/* Footer Links */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h4 className="font-semibold mb-4 text-gray-200">{section.title}</h4>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-gray-400 hover:text-white transition-colors text-sm"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            Product Lab provides comprehensive product reviews and testing insights to help you make informed decisions.
          </p>
        </div>
      </div>
    </footer>
  );
};
