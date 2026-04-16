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
  title: 'Best Gaming Laptops 2025 - Expert Reviews',
  description: 'Top gaming laptops tested for performance, thermals, and display quality. Find the best gaming laptop for your budget and needs.',
};

interface LaptopEntry {
  rank: number; name: string; href: string; image: string; summary: string;
  score: number; price: string; badge?: 'best-overall' | 'best-value' | 'budget-pick';
  specs?: Record<string, string>;
}

const laptops: LaptopEntry[] = [
  {
    rank: 1,
    name: 'ASUS ROG Strix G16 (2024)',
    href: '/articles/asus_rog_strix_g16',
    image: '/images/item.png',
    summary: 'Best-in-class gaming performance with Intel Core i9-14900HX, RTX 4080, and a stunning 240Hz QHD display with excellent cooling.',
    score: 9.1,
    price: '$1,499',
    badge: 'best-overall' as const,
    specs: { CPU: 'Intel Core i9-14900HX', GPU: 'RTX 4080', RAM: '16GB DDR5', Storage: '1TB NVMe', Display: '16" QHD 240Hz' },
  },
  {
    rank: 2,
    name: 'Razer Blade 15',
    href: '/articles/razer_blade_15',
    image: '/images/item.png',
    summary: 'Premium gaming laptop in an ultra-thin aluminum chassis with top-tier specs, excellent build quality, and a beautiful 240Hz OLED display.',
    score: 8.9,
    price: '$2,499',
    badge: 'best-value' as const,
    specs: { CPU: 'Intel Core i9-13950HX', GPU: 'RTX 4080', RAM: '16GB DDR5', Storage: '1TB NVMe', Display: '15.6" QHD 240Hz OLED' },
  },
  {
    rank: 3,
    name: 'Lenovo Legion 5 Pro',
    href: '/articles/lenovo_legion_5_pro',
    image: '/images/item.png',
    summary: 'Exceptional value gaming laptop with AMD Ryzen processor, RTX 4070, and a brilliant 165Hz QHD display at under $1,100.',
    score: 8.7,
    price: '$1,099',
    badge: 'budget-pick' as const,
    specs: { CPU: 'AMD Ryzen 7 7745HX', GPU: 'RTX 4070', RAM: '16GB DDR5', Storage: '512GB NVMe', Display: '16" QHD 165Hz' },
  },
  {
    rank: 4,
    name: 'MSI Titan GT77 HX',
    href: '/articles/msi_titan_gt77_hx',
    image: '/images/item.png',
    summary: 'Desktop-grade performance in a laptop with the flagship RTX 4090, top-end Intel CPU, and a massive 17.3-inch UHD display.',
    score: 8.5,
    price: '$2,299',
    specs: { CPU: 'Intel Core i9-13980HX', GPU: 'RTX 4090', RAM: '32GB DDR5', Storage: '2TB NVMe', Display: '17.3" UHD 144Hz' },
  },
];

const quickPicks = [
  { label: 'Best Overall', name: 'ASUS ROG Strix G16', href: '/articles/asus_rog_strix_g16', score: 9.1, price: '$1,499' },
  { label: 'Best Premium', name: 'Razer Blade 15', href: '/articles/razer_blade_15', score: 8.9, price: '$2,499' },
  { label: 'Budget Pick', name: 'Lenovo Legion 5 Pro', href: '/articles/lenovo_legion_5_pro', score: 8.7, price: '$1,099' },
];

export default function GamingLaptopsPage() {
  return (
    <div className="min-h-screen bg-neutral-50">
      <Breadcrumb items={[
        { label: 'Home', href: '/' },
        { label: 'Best Of', href: '/best' },
        { label: 'Laptops', href: '/best/laptops' },
        { label: 'Gaming Laptops' },
      ]} />

      <div className="bg-gradient-to-br from-primary to-primary-dark px-6 py-10 text-white">
        <div className="mx-auto max-w-content">
          <SectionLabel className="text-white/70">Buying Guide</SectionLabel>
          <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">Best Gaming Laptops 2025</h1>
          <p className="mt-2 max-w-2xl text-base text-white/80">
            Top gaming laptops tested for real-world gaming performance, thermals, display quality, and battery life. Find your perfect gaming rig.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {['High-FPS Gaming Tested', 'Thermal Benchmarks', 'Battery Life Measured'].map((tag) => (
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

            <div className="rounded-xl bg-gradient-to-br from-primary-lightest to-primary-light/20 p-6">
              <SectionLabel>Methodology</SectionLabel>
              <h2 className="mb-4 text-lg font-bold text-neutral-900">How We Choose Gaming Laptops</h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {[
                  { title: 'What Makes a Great Gaming Laptop?', items: ['Powerful dedicated GPU (RTX 4070 or better)', 'High refresh rate display (144Hz minimum)', 'Effective thermal management under sustained load', 'Adequate RAM (16GB DDR5 minimum)', 'Fast NVMe storage for quick load times'] },
                  { title: 'Consider Your Needs', items: ['Budget: Gaming laptops range from $900–$3,500+', 'Portability vs performance trade-offs', 'Display size: 15" portable vs 17" desktop replacement', 'Battery: Gaming laptops average 3–5 hours', 'GPU tier: RTX 4060/4070 for most, 4080/4090 for max'] },
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
                {laptops.map((laptop) => (
                  <li key={laptop.rank}>
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
                <li><Link href="/best/laptops" className="text-neutral-700 hover:text-primary hover:underline">All Laptops</Link></li>
                <li><Link href="/best/laptops/best-laptops-under-1000" className="text-neutral-700 hover:text-primary hover:underline">Best Laptops Under $1,000</Link></li>
                <li><Link href="/best/laptops/macbooks" className="text-neutral-700 hover:text-primary hover:underline">Best MacBooks</Link></li>
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
