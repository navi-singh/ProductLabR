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
  title: 'Best Laptops Under $1,000 2025 - Expert Reviews',
  description: 'Top laptops under $1,000 tested for performance, battery life, and build quality. Get the best value for your money.',
};

interface LaptopEntry {
  rank: number; name: string; href: string; image: string; summary: string;
  score: number; price: string; badge?: 'best-overall' | 'best-value' | 'budget-pick';
  specs?: Record<string, string>;
}

const laptops: LaptopEntry[] = [
  {
    rank: 1,
    name: 'Acer Aspire 5 (2024)',
    href: '/articles/acer_aspire_5',
    image: '/images/item.png',
    summary: 'Outstanding all-around laptop under $700 with a powerful Ryzen 7 processor, sharp 1080p IPS display, and excellent battery life.',
    score: 8.8,
    price: '$649',
    badge: 'best-overall' as const,
    specs: { CPU: 'AMD Ryzen 7 7730U', RAM: '16GB DDR4', Storage: '512GB SSD', Display: '15.6" FHD IPS', Battery: '11hr' },
  },
  {
    rank: 2,
    name: 'HP Pavilion 15',
    href: '/articles/hp_pavilion_15',
    image: '/images/item.png',
    summary: 'Great everyday laptop with a solid Intel processor, fast SSD storage, and a quality display in a slim, premium-feeling chassis.',
    score: 8.5,
    price: '$599',
    badge: 'best-value' as const,
    specs: { CPU: 'Intel Core i5-1335U', RAM: '8GB DDR4', Storage: '256GB SSD', Display: '15.6" FHD IPS', Battery: '9hr' },
  },
  {
    rank: 3,
    name: 'Lenovo IdeaPad 3i',
    href: '/best/laptops/best-laptops-under-1000',
    image: '/images/item.png',
    summary: 'Reliable budget laptop for students and light users with dependable performance, good keyboard, and long battery life under $450.',
    score: 8.2,
    price: '$449',
    badge: 'budget-pick' as const,
    specs: { CPU: 'Intel Core i3-1215U', RAM: '8GB DDR4', Storage: '256GB SSD', Display: '15.6" FHD TN', Battery: '10hr' },
  },
  {
    rank: 4,
    name: 'Dell Inspiron 15 3000',
    href: '/articles/dell_inspiron_15_3000',
    image: '/images/item.png',
    summary: 'Dependable Dell everyday laptop with solid build quality, good keyboard, and a bright display perfect for office and school work.',
    score: 8.0,
    price: '$549',
    specs: { CPU: 'Intel Core i5-1135G7', RAM: '8GB DDR4', Storage: '256GB SSD', Display: '15.6" FHD', Battery: '8hr' },
  },
];

const quickPicks = [
  { label: 'Best Overall', name: 'Acer Aspire 5', href: '/articles/acer_aspire_5', score: 8.8, price: '$649' },
  { label: 'Best Value', name: 'HP Pavilion 15', href: '/articles/hp_pavilion_15', score: 8.5, price: '$599' },
  { label: 'Budget Pick', name: 'Lenovo IdeaPad 3i', href: '/best/laptops/best-laptops-under-1000', score: 8.2, price: '$449' },
];

export default function LaptopsUnder1000Page() {
  return (
    <div className="min-h-screen bg-neutral-50">
      <Breadcrumb items={[
        { label: 'Home', href: '/' },
        { label: 'Best Of', href: '/best' },
        { label: 'Laptops', href: '/best/laptops' },
        { label: 'Best Under $1,000' },
      ]} />

      <div className="bg-gradient-to-br from-primary to-primary-dark px-6 py-10 text-white">
        <div className="mx-auto max-w-content">
          <SectionLabel className="text-white/70">Buying Guide</SectionLabel>
          <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">Best Laptops Under $1,000 (2025)</h1>
          <p className="mt-2 max-w-2xl text-base text-white/80">
            Top-value laptops that deliver excellent everyday performance without breaking the bank. Tested for students, professionals, and casual users.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {['Real-World Performance', 'Battery Life Tested', 'Student Picks Included'].map((tag) => (
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
              <h2 className="mb-4 text-lg font-bold text-neutral-900">How We Choose Budget Laptops</h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {[
                  { title: 'What to Look For Under $1,000', items: ['8GB RAM minimum (16GB preferred for future-proofing)', 'SSD storage — avoid spinning hard drives', 'IPS display for better viewing angles and color', 'Intel 12th/13th Gen or AMD Ryzen 6000+ series CPU', 'USB-C charging for versatility'] },
                  { title: 'Common Trade-offs', items: ['Thinner bezels and premium materials cost more', 'Dedicated GPU often absent at this price', 'Touchscreens add cost over non-touch equivalents', 'Webcam quality is usually basic at budget prices', 'Thunderbolt 4 less common; look for USB 4'] },
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
                <li><Link href="/best/laptops/gaming-laptops" className="text-neutral-700 hover:text-primary hover:underline">Best Gaming Laptops</Link></li>
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
