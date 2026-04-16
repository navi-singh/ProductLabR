import { Metadata } from 'next';
import Link from 'next/link';
import { Breadcrumb } from '@/components/Breadcrumb';
import { SectionLabel } from '@/components/SectionLabel';
import { QuickPicks } from '@/components/QuickPicks';
import { RankedProductCard } from '@/components/RankedProductCard';
import { Newsletter } from '@/components/Newsletter';
import AdBanner from '@/components/ads/AdBanner';
import { ADSENSE_CONFIG } from '@/lib/adsense-config';

export const metadata: Metadata = {
  title: 'Best Laptops 2025 - Expert Reviews & Buying Guide',
  description: 'The best laptops for every need. Expert tested gaming laptops, ultrabooks, MacBooks, and budget laptops for professionals and students.',
};

interface LaptopEntry {
  rank: number; name: string; href: string; image: string; summary: string;
  score: number; price: string; badge?: 'best-overall' | 'best-value' | 'budget-pick';
  specs?: Record<string, string>;
}

const laptops: LaptopEntry[] = [
  {
    rank: 1,
    name: 'MacBook Pro 14-inch M4 Pro',
    href: '/articles/macbook_pro_14_m4_pro',
    image: '/images/item.png',
    summary: 'Apple silicon powerhouse with incredible performance, all-day battery life, and a stunning Liquid Retina XDR display.',
    score: 9.5,
    price: '$1,999',
    badge: 'best-overall' as const,
    specs: { Chip: 'M4 Pro', RAM: '24GB', SSD: '512GB', Display: '14.2" Liquid Retina XDR', Battery: '22hr' },
  },
  {
    rank: 2,
    name: 'ASUS ROG Strix G16 (2024)',
    href: '/articles/asus_rog_strix_g16',
    image: '/images/item.png',
    summary: 'Top-tier gaming performance with the latest Intel CPU, RTX 4080, and a blazing-fast 240Hz QHD display.',
    score: 9.1,
    price: '$1,499',
    badge: 'best-value' as const,
    specs: { CPU: 'Intel Core i9-14900HX', GPU: 'RTX 4080', RAM: '16GB DDR5', Storage: '1TB NVMe', Display: '16" QHD 240Hz' },
  },
  {
    rank: 3,
    name: 'Acer Aspire 5 (2024)',
    href: '/articles/acer_aspire_5',
    image: '/images/item.png',
    summary: 'Outstanding value for everyday computing with solid performance, a sharp display, and long battery life under $700.',
    score: 8.8,
    price: '$649',
    badge: 'budget-pick' as const,
    specs: { CPU: 'AMD Ryzen 7 7730U', RAM: '16GB', Storage: '512GB SSD', Display: '15.6" FHD IPS', Battery: '11hr' },
  },
];

const quickPicks = [
  { label: 'Best Overall', name: 'MacBook Pro 14" M4 Pro', href: '/articles/macbook_pro_14_m4_pro', score: 9.5, price: '$1,999' },
  { label: 'Best Gaming', name: 'ASUS ROG Strix G16', href: '/articles/asus_rog_strix_g16', score: 9.1, price: '$1,499' },
  { label: 'Budget Pick', name: 'Acer Aspire 5', href: '/articles/acer_aspire_5', score: 8.8, price: '$649' },
];

const categoryLinks = [
  { href: '/best/laptops/gaming-laptops', label: 'Best Gaming Laptops', count: 4 },
  { href: '/best/laptops/best-laptops-under-1000', label: 'Best Laptops Under $1,000', count: 4 },
  { href: '/best/laptops/macbooks', label: 'Best MacBooks', count: 3 },
  { href: '/best/laptops/ultrabooks', label: 'Best Ultrabooks', count: 4 },
];

export default function LaptopsPage() {
  return (
    <div className="min-h-screen bg-neutral-50">
      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Best Of', href: '/best' }, { label: 'Laptops' }]} />

      {/* Header */}
      <div className="bg-gradient-to-br from-primary to-primary-dark px-6 py-10 text-white">
        <div className="mx-auto max-w-content">
          <SectionLabel className="text-white/70">Buying Guide</SectionLabel>
          <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">Best Laptops 2025</h1>
          <p className="mt-2 max-w-2xl text-base text-white/80">
            Expert-tested laptops for every budget and use case. From powerhouse gaming rigs to thin ultrabooks and Apple silicon MacBooks.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {['20+ Laptops Tested', 'Real-World Benchmarks', 'Battery Life Tested'].map((tag) => (
              <span key={tag} className="rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs text-white/90">{tag}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-content px-4 py-8 sm:px-6">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[7fr_3fr]">
          {/* Main Column */}
          <main className="space-y-6">
            <QuickPicks picks={quickPicks} />

            <div>
              <SectionLabel>Top Picks</SectionLabel>
              <div className="space-y-4">
                {laptops.map((laptop, i) => (
                  <div key={laptop.rank}>
                    <RankedProductCard {...laptop} />
                    {i === 2 && (
                      <div className="mt-4">
                        <AdBanner adSlot={ADSENSE_CONFIG.adSlots.categoryBottom} adFormat="auto" className="rounded-lg" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Laptop Categories */}
            <div className="rounded-xl border border-neutral-200 bg-white p-6">
              <SectionLabel>Explore by Category</SectionLabel>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {categoryLinks.map((cat) => (
                  <Link key={cat.href} href={cat.href} className="flex items-center justify-between rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-3 hover:border-primary hover:bg-primary-lightest">
                    <span className="text-sm font-semibold text-neutral-800">{cat.label}</span>
                    <span className="text-xs text-neutral-400">{cat.count} reviewed →</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* How We Test */}
            <div className="rounded-xl bg-gradient-to-br from-primary-lightest to-primary-light/20 p-6">
              <SectionLabel>Methodology</SectionLabel>
              <h2 className="mb-4 text-lg font-bold text-neutral-900">How We Test Laptops</h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {[
                  { title: 'Performance', desc: 'CPU/GPU benchmarks, thermal management, and sustained performance under heavy workloads including gaming and creative tasks.' },
                  { title: 'Battery Life', desc: 'Real-world battery testing across web browsing, video streaming, and productivity tasks to find true all-day runtime.' },
                  { title: 'Build & Display', desc: 'Screen quality, color accuracy, keyboard comfort, trackpad responsiveness, and overall build quality assessments.' },
                ].map((item) => (
                  <div key={item.title}>
                    <h3 className="mb-1 text-sm font-semibold text-primary">{item.title}</h3>
                    <p className="text-xs leading-relaxed text-neutral-600">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </main>

          {/* Sidebar */}
          <aside className="space-y-5">
            <div className="rounded-xl border border-neutral-200 bg-white p-4">
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-primary">Jump To</h3>
              <ul className="space-y-2 text-sm">
                {laptops.map((laptop) => (
                  <li key={laptop.href}>
                    <Link href={laptop.href} className="flex items-center gap-2 text-neutral-600 hover:text-primary">
                      <span className="text-[10px] text-neutral-400">#{laptop.rank}</span>
                      {laptop.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-xl bg-gradient-to-br from-primary-lightest to-primary-light/20 p-4">
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-primary">Related Guides</h3>
              <ul className="space-y-2 text-sm">
                {categoryLinks.map((cat) => (
                  <li key={cat.href}>
                    <Link href={cat.href} className="text-neutral-700 hover:text-primary hover:underline">{cat.label}</Link>
                  </li>
                ))}
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
