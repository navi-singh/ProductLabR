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
  alternates: { canonical: '/best/power-stations/top-5-portable-power-stations' },
  title: 'Top 5 Portable Power Stations 2025 - Tightly Curated Expert Picks',
  description: 'The five best portable power stations rigorously tested for camping, home backup, and off-grid use. Our tightest curated list.',
};

interface StationEntry {
  rank: number; name: string; href: string; image?: string; summary: string;
  score: number; price: string; badge?: 'best-overall' | 'best-value' | 'budget-pick';
  specs?: Record<string, string>;
}

const powerStations: StationEntry[] = [
  {
    rank: 1,
    name: 'EcoFlow Delta Pro 3',
    href: '/articles/ecoflow_delta_pro_3',
    image: '/images/posts/portable-power-stations/ecoflow_delta_pro_3/ecoflow_delta_pro_3_main.webp',
    summary: 'Massive 4096Wh capacity with 4000W AC output, 50-minute fast charging, and 10ms UPS mode — the ultimate home backup station.',
    score: 9.8,
    price: '$3,699',
    badge: 'best-overall' as const,
    specs: { Capacity: '4096Wh', Output: '4000W', Weight: '113.5 lbs', Charging: '50 min to 80%' },
  },
  {
    rank: 2,
    name: 'EcoFlow Delta 3 Plus',
    href: '/articles/ecoflow_delta_3_plus',
    summary: 'Sweet spot of portability and performance — 1024Wh with 2400W output, X-Stream 1-hour charging, and UPS mode.',
    score: 9.4,
    price: '$799',
    badge: 'best-value' as const,
    specs: { Capacity: '1024Wh', Output: '2400W', Weight: '24 lbs', UPS: 'Yes (30ms)' },
  },
  {
    rank: 3,
    name: 'Bluetti AC180',
    href: '/articles/bluetti_ac180',
    image: '/images/posts/portable-power-stations/bluetti_ac180/AC180_1.jpg',
    summary: 'LiFePO4 chemistry for 3500+ cycle longevity, excellent solar input, wireless charging pad, and solid 1800W output.',
    score: 9.2,
    price: '$699',
    specs: { Capacity: '1152Wh', Output: '1800W', Weight: '35.3 lbs', Battery: 'LiFePO4' },
  },
  {
    rank: 4,
    name: 'Anker Solix C1000',
    href: '/articles/anker_solix_c1000',
    summary: 'Excellent value from a trusted brand with 1056Wh, 1800W output, and fast solar + AC charging in a durable package.',
    score: 9.0,
    price: '$499',
    specs: { Capacity: '1056Wh', Output: '1800W', Weight: '26.6 lbs', Brand: 'Anker' },
  },
  {
    rank: 5,
    name: 'Jackery Explorer 1000 V2',
    href: '/articles/jackery_explorer_1000_v2',
    summary: 'The most user-friendly pick with one-button operation, handle design, and Jackery\'s trusted brand and warranty.',
    score: 8.8,
    price: '$799',
    badge: 'budget-pick' as const,
    specs: { Capacity: '1070Wh', Output: '1500W', Weight: '23.8 lbs', Design: 'Beginner-friendly' },
  },
];

const quickPicks = [
  { label: 'Best Overall', name: 'EcoFlow Delta Pro 3', href: '/articles/ecoflow_delta_pro_3', score: 9.8, price: '$3,699' },
  { label: 'Best Value', name: 'EcoFlow Delta 3 Plus', href: '/articles/ecoflow_delta_3_plus', score: 9.4, price: '$799' },
  { label: 'Most User-Friendly', name: 'Jackery Explorer 1000 V2', href: '/articles/jackery_explorer_1000_v2', score: 8.8, price: '$799' },
];

export default function Top5PortablePowerStationsPage() {
  return (
    <div className="min-h-screen bg-neutral-50">
      <Breadcrumb items={[
        { label: 'Home', href: '/' },
        { label: 'Best Of', href: '/best' },
        { label: 'Power Stations', href: '/best/power-stations' },
        { label: 'Top 5 Portable Power Stations' },
      ]} />

      <div className="bg-gradient-to-br from-primary to-primary-dark px-6 py-10 text-white">
        <div className="mx-auto max-w-content">
          <SectionLabel className="text-white/70">Buying Guide</SectionLabel>
          <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">Top 5 Portable Power Stations 2025</h1>
          <p className="mt-2 max-w-2xl text-base text-white/80">
            The five best portable power stations rigorously tested for camping, home backup, and off-grid use. Our tightest curated list.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {['1024Wh – 4096Wh', '1500W – 4000W Output', '$499 – $3,699'].map((tag) => (
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
                {powerStations.map((station, i) => (
                  <div key={station.rank}>
                    <RankedProductCard {...station} />
                    {i === 1 && (
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
              <h2 className="mb-4 text-lg font-bold text-neutral-900">How We Test Portable Power Stations</h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {[
                  { title: 'Capacity Testing', desc: 'We measure actual usable capacity, charge/discharge cycles, and real-world runtime with common devices.' },
                  { title: 'Performance Analysis', desc: 'Output consistency, surge handling, charging speeds, and thermal management under various loads.' },
                  { title: 'Real-World Use', desc: 'Extended camping trips, home backup scenarios, and professional job site applications.' },
                ].map((item) => (
                  <div key={item.title}>
                    <h3 className="mb-1 text-sm font-semibold text-primary">{item.title}</h3>
                    <p className="text-xs leading-relaxed text-neutral-600">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </main>

          <aside className="space-y-5">
            <div className="rounded-xl border border-neutral-200 bg-white p-4">
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-primary">Jump To</h3>
              <ul className="space-y-2 text-sm">
                {powerStations.map((station) => (
                  <li key={station.href}>
                    <Link href={station.href} className="flex items-center gap-2 text-neutral-600 hover:text-primary">
                      <span className="text-[10px] text-neutral-400">#{station.rank}</span>
                      {station.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-xl bg-gradient-to-br from-primary-lightest to-primary-light/20 p-4">
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-primary">Related Guides</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/best/power-stations" className="text-neutral-700 hover:text-primary hover:underline">All Power Stations</Link></li>
                <li><Link href="/best/power-stations/portable-power-stations" className="text-neutral-700 hover:text-primary hover:underline">All Portable Stations</Link></li>
                <li><Link href="/best/power-stations/camping-power-stations" className="text-neutral-700 hover:text-primary hover:underline">Best for Camping</Link></li>
                <li><Link href="/best/power-stations/house-backup-power-stations" className="text-neutral-700 hover:text-primary hover:underline">House Backup</Link></li>
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
