import { Metadata } from 'next';
import { Breadcrumb } from '@/components/Breadcrumb';
import { SectionLabel } from '@/components/SectionLabel';
import { QuickPicks } from '@/components/QuickPicks';
import { RankedProductCard } from '@/components/RankedProductCard';
import { Newsletter } from '@/components/Newsletter';
import AdBanner from '@/components/ads/AdBanner';
import { ADSENSE_CONFIG } from '@/lib/adsense-config';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Best MacBooks 2025 - Expert Reviews',
  description: 'Top MacBooks tested for performance, battery life, and value. Find the best MacBook for creative professionals, students, and power users.',
};

interface MacBookEntry {
  rank: number; name: string; href: string; image: string; summary: string;
  score: number; price: string; badge?: 'best-overall' | 'best-value' | 'budget-pick';
  specs?: Record<string, string>;
}

const macbooks: MacBookEntry[] = [
  {
    rank: 1,
    name: 'MacBook Pro 14-inch M4 Pro',
    href: '/best/laptops/macbooks',
    image: '/images/item.png',
    summary: 'The best all-around MacBook with extraordinary M4 Pro performance, a stunning Liquid Retina XDR display, and all-day battery in a compact form.',
    score: 9.5,
    price: '$1,999',
    badge: 'best-overall' as const,
    specs: { Chip: 'Apple M4 Pro', RAM: '24GB unified', SSD: '512GB', Display: '14.2" Liquid Retina XDR', 'Battery Life': '22hr' },
  },
  {
    rank: 2,
    name: 'MacBook Air M3',
    href: '/best/laptops/macbooks',
    image: '/images/item.png',
    summary: 'The perfect everyday MacBook — fanless design, stunning 15-inch display option, exceptional battery life, and M3 performance for most tasks.',
    score: 9.3,
    price: '$1,099',
    badge: 'best-value' as const,
    specs: { Chip: 'Apple M3', RAM: '8GB unified', SSD: '256GB', Display: '13.6" Liquid Retina', 'Battery Life': '18hr' },
  },
  {
    rank: 3,
    name: 'MacBook Pro 16-inch M4 Max',
    href: '/best/laptops/macbooks',
    image: '/images/item.png',
    summary: 'The ultimate MacBook for power users and creative professionals needing maximum compute for video editing, 3D rendering, and ML workloads.',
    score: 9.4,
    price: '$3,499',
    badge: 'best-overall' as const,
    specs: { Chip: 'Apple M4 Max', RAM: '48GB unified', SSD: '1TB', Display: '16.2" Liquid Retina XDR', 'Battery Life': '24hr' },
  },
];

const quickPicks = [
  { label: 'Best Overall', name: 'MacBook Pro 14" M4 Pro', href: '/best/laptops/macbooks', score: 9.5, price: '$1,999' },
  { label: 'Best Value', name: 'MacBook Air M3', href: '/best/laptops/macbooks', score: 9.3, price: '$1,099' },
  { label: 'Pro Pick', name: 'MacBook Pro 16" M4 Max', href: '/best/laptops/macbooks', score: 9.4, price: '$3,499' },
];

export default function MacBooksPage() {
  return (
    <div className="min-h-screen bg-neutral-50">
      <Breadcrumb items={[
        { label: 'Home', href: '/' },
        { label: 'Best Of', href: '/best' },
        { label: 'Laptops', href: '/best/laptops' },
        { label: 'MacBooks' },
      ]} />

      <div className="bg-gradient-to-br from-primary to-primary-dark px-6 py-10 text-white">
        <div className="mx-auto max-w-content">
          <SectionLabel className="text-white/70">Buying Guide</SectionLabel>
          <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">Best MacBooks 2025</h1>
          <p className="mt-2 max-w-2xl text-base text-white/80">
            Expert-tested MacBooks powered by Apple silicon. From the lightweight Air to the pro-grade MacBook Pro, find the right Mac for your work.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {['Apple Silicon Performance', 'Battery Life Leaders', 'Display Quality Tested'].map((tag) => (
              <span key={tag} className="rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs text-white/90">{tag}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-content px-4 py-8 sm:px-6">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[7fr_3fr]">
          <main className="space-y-6">
            <QuickPicks picks={quickPicks} />

            <div>
              <SectionLabel>Ranked List</SectionLabel>
              <div className="space-y-4">
                {macbooks.map((mac, i) => (
                  <div key={mac.rank}>
                    <RankedProductCard {...mac} />
                    {i === 2 && (
                      <div className="mt-4">
                        <AdBanner adSlot={ADSENSE_CONFIG.adSlots.categoryBottom} adFormat="auto" className="rounded-lg" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl bg-gradient-to-br from-primary-lightest to-primary-light/20 p-6">
              <SectionLabel>Methodology</SectionLabel>
              <h2 className="mb-4 text-lg font-bold text-neutral-900">Which MacBook Should You Buy?</h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {[
                  { title: 'MacBook Air vs Pro', items: ['Air: Fanless, lighter, great for everyday use', 'Pro: Active cooling, better for sustained workloads', 'Air has enough power for most users (web, office, creative)', 'Pro worth it for video editing, coding, heavy apps', 'MagSafe charging and more ports on Pro'] },
                  { title: 'How Much RAM?', items: ['8GB: Fine for basic tasks and web browsing', '16GB: Recommended for most professional users', '24GB: Video editors and developers working with large files', '36GB+: ML engineers, heavy virtual machines, huge projects', 'RAM is soldered — choose wisely at purchase'] },
                ].map((section) => (
                  <div key={section.title}>
                    <h3 className="mb-2 text-sm font-semibold text-primary">{section.title}</h3>
                    <ul className="space-y-1">
                      {section.items.map((item) => (
                        <li key={item} className="text-xs text-neutral-600">• {item}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </main>

          <aside className="space-y-5">
            <div className="rounded-xl border border-neutral-200 bg-white p-4">
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-primary">Jump To</h3>
              <ul className="space-y-2 text-sm">
                {macbooks.map((mac) => (
                  <li key={mac.rank}>
                    <Link href={mac.href} className="flex items-center gap-2 text-neutral-600 hover:text-primary">
                      <span className="text-[10px] text-neutral-400">#{mac.rank}</span>
                      {mac.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-xl bg-gradient-to-br from-primary-lightest to-primary-light/20 p-4">
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-primary">Related Guides</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/best/laptops" className="text-neutral-700 hover:text-primary hover:underline">All Laptops</Link></li>
                <li><Link href="/best/laptops/gaming-laptops" className="text-neutral-700 hover:text-primary hover:underline">Best Gaming Laptops</Link></li>
                <li><Link href="/best/laptops/best-laptops-under-1000" className="text-neutral-700 hover:text-primary hover:underline">Best Under $1,000</Link></li>
                <li><Link href="/best/laptops/ultrabooks" className="text-neutral-700 hover:text-primary hover:underline">Best Ultrabooks</Link></li>
              </ul>
            </div>

            <AdBanner adSlot={ADSENSE_CONFIG.adSlots.sidebar} adFormat="rectangle" style={{ minHeight: 250 }} className="rounded-lg" />

            <Newsletter />
          </aside>
        </div>
      </div>
    </div>
  );
}
