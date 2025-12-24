'use client';

import { Menu, Search, X } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const navigationItems = [
    { href: '/', label: 'Latest' },
    { href: '/best', label: 'Best' },
    { href: '/best/power-stations', label: 'Power Stations' },
    { href: '/best/cameras', label: 'Cameras' },
    { href: '/best/knives-tools', label: 'Tools' },
  ];

  return (
    <header className="bg-trustworthy text-white sticky top-0 z-50 shadow-md">
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleMobileMenu}
            className="md:hidden p-1 hover:bg-white/10 rounded transition-colors"
            aria-label="Toggle mobile menu"
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
          <Link href="/" className="flex items-center">
            <h1 className="text-xl md:text-2xl font-bold hover:text-gray-200 transition-colors">
              PRODUCT LAB
            </h1>
          </Link>
        </div>

        <nav className="hidden md:flex space-x-6">
          {navigationItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="hover:text-gray-300 transition-colors font-medium"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center space-x-4">
          <button
            className="p-2 hover:bg-white/10 rounded transition-colors"
            aria-label="Search"
          >
            <Search className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-trustworthy border-t border-white/10">
          <nav className="px-4 py-4 space-y-3">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block py-2 px-3 hover:bg-white/10 rounded transition-colors font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};
