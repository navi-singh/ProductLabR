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
  title: 'Best Camping Power Stations 2025 - Expert Reviews',
  description: 'Compact and lightweight power solutions for outdoor adventures. Expert tested camping power stations.',
};

interface StationEntry {
  rank: number; name: string; href: string; image: string; summary: string;
  score: number; price: string; badge?: 'best-overall' | 'best-value' | 'budget-pick';
  specs?: Record<string, string>;
}

const stations: StationEntry[] = [
  {
    rank: 1,
    name: 'EcoFlow River 2 Pro',
    href: '/articles/ecoflow_river_2_pro',
    image: '/images/item.png',
    summary: 'Perfect camping capacity with ultra-fast 70-minute charging and lightweight 17.2 lb design.',
    score: 9.1,
    price: '$599',
    badge: 'best-overall' as const,
    specs: { Capacity: '768Wh', Output: '800W', Weight: '17.2 lbs', Charging: '70 min' },
  },
  {
    rank: 2,
    name: 'Jackery Explorer 1000 v2',
    href: '/articles/jackery_explorer_1000_v2',
    image: '/images/item.png',
    summary: 'Higher capacity for longer trips with powerful output and excellent build quality.',
    score: 8.9,
    price: '$799',
    badge: 'best-value' as const,
    specs: { Capacity: '1070Wh', Output: '1500W', Weight: '23.8 lbs', Safety: 'ChargeShield 2.0' },
  },
  {
    rank: 3,
    name: 'Bluetti EB70S',
    href: '/articles/bluetti_eb70s',
    image: '/images/item.png',
    summary: 'Great value for capacity with wireless charging convenience and multiple charging options.',
    score: 8.7,
    price: '$449',
    badge: 'budget-pick' as const,
    specs: { Capacity: '716Wh', Output: '800W', Weight: '21.4 lbs', Battery: 'LiFePO4' },
  },
  {
    rank: 4,
    name: 'Goal Zero Yeti 500X',
    href: '/articles/goal_zero_yeti_500x',
    image: '/images/item.png',
    summary: 'Lightweight and portable with excellent app integration and reliable brand reputation.',
    score: 8.5,
    price: '$699',
    specs: { Capacity: '505Wh', Output: '300W', Weight: '12.9 lbs', Control: 'WiFi app' },
  },
  {
    rank: 5,
    name: 'Anker SOLIX C800',
    href: '/articles/anker_solix_c800',
    image: '/images/item.png',
    summary: 'Excellent value proposition with high surge power rating and long 5-year warranty coverage.',
    score: 8.3,
    price: '$399',
    specs: { Capacity: '768Wh', Output: '1200W', Weight: '19.8 lbs', Warranty: '5 years' },
  },
];

const quickPicks = [
  { label: 'Best Overall', name: 'EcoFlow River 2 Pro', href: '/articles/ecoflow_river_2_pro', score: 9.1, price: '$599' },
  { label: 'Best Value', name: 'Jackery Explorer 1000 v2', href: '/articles/jackery_explorer_1000_v2', score: 8.9, price: '$799' },
  { label: 'Budget Pick', name: 'Bluetti EB70S', href: '/articles/bluetti_eb70s', score: 8.7, price: '$449' },
];

export default function BestCampingPowerStations() {
  return (
    <div className="min-h-screen bg-neutral-50">
      <Breadcrumb items={[
        { label: 'Home', href: '/' },
        { label: 'Best Of', href: '/best' },
        { label: 'Power Stations', href: '/best/power-stations' },
        { label: 'Camping Power Stations' },
      ]} />

      <div className="bg-gradient-to-br from-primary to-primary-dark px-6 py-10 text-white">
        <div className="mx-auto max-w-content">
          <SectionLabel className="text-white/70">Buying Guide</SectionLabel>
          <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">Best Camping Power Stations 2025</h1>
          <p className="mt-2 max-w-2xl text-base text-white/80">
            Compact and lightweight power solutions for outdoor adventures. Tested for portability, capacity, and durability to provide reliable power outdoors.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {['Ultra-Portable', 'Weather Resistant', 'Silent Operation'].map((tag) => (
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
                {stations.map((station, i) => (
                  <div key={station.rank}>
                    <RankedProductCard {...station} />
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
              <h2 className="mb-4 text-lg font-bold text-neutral-900">Camping Power Station Guide</h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {[
                  { title: 'Essential Camping Features', items: ['Lightweight design (under 25 lbs)', 'Weather-resistant construction', 'Silent operation for peaceful camping', 'Multiple charging options (solar, car, AC)', 'LED flashlight or emergency lighting'] },
                  { title: 'Capacity Planning', items: ['Weekend trip: 500–800Wh sufficient', 'Week-long camping: 1000Wh+ recommended', 'Consider solar panels for extended trips', 'Factor in weather and usage patterns', 'Plan for emergency power reserve'] },
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
                {stations.map((station) => (
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
                <li><Link href="/best/power-stations/portable-power-stations" className="text-neutral-700 hover:text-primary hover:underline">Portable Power Stations</Link></li>
                <li><Link href="/best/power-stations/carry-on-power-stations" className="text-neutral-700 hover:text-primary hover:underline">Carry-On Power</Link></li>
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
