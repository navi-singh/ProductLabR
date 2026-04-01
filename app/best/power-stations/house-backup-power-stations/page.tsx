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
  title: 'Best House Backup Power Stations 2025 - Expert Reviews',
  description: 'High-capacity power stations for whole-home backup during outages. Expert tested for home integration and reliability.',
};

interface StationEntry {
  rank: number; name: string; href: string; image: string; summary: string;
  score: number; price: string; badge?: 'best-overall' | 'best-value' | 'budget-pick';
  specs?: Record<string, string>;
}

const stations: StationEntry[] = [
  {
    rank: 1,
    name: 'EcoFlow Delta Pro 3',
    href: '/articles/ecoflow_delta_pro_3',
    image: '/images/posts/delta_3_pro/EcoFlow-Delta-Pro-3.jpg',
    summary: 'Massive 4096Wh capacity with 4000W output, home integration ready, and smart grid support.',
    score: 9.2,
    price: '$3,699',
    badge: 'best-overall' as const,
    specs: { Capacity: '4096Wh', Output: '4000W', Integration: 'Smart home', Runtime: '8-24h' },
  },
  {
    rank: 2,
    name: 'Bluetti AC300 + B300',
    href: '/articles/bluetti_ac300',
    image: '/images/item.png',
    summary: 'Modular expandable design with UPS mode for seamless switching and multiple charging options.',
    score: 8.9,
    price: '$2,999',
    badge: 'best-value' as const,
    specs: { Capacity: '3072Wh', Output: '3000W', Design: 'Modular', UPS: 'Yes' },
  },
  {
    rank: 3,
    name: 'Goal Zero Yeti 6000X',
    href: '/articles/goal_zero_yeti_6000x',
    image: '/images/item.png',
    summary: 'Huge 6071Wh capacity for extended runtime with professional build quality and comprehensive app control.',
    score: 8.7,
    price: '$4,999',
    badge: 'budget-pick' as const,
    specs: { Capacity: '6071Wh', Output: '2000W', Control: 'WiFi app', Build: 'Professional' },
  },
  {
    rank: 4,
    name: 'Anker SOLIX F3800',
    href: '/articles/anker_solix_f3800',
    image: '/images/item.png',
    summary: 'Highest surge power rating with long warranty coverage and home integration ready.',
    score: 8.5,
    price: '$3,999',
    specs: { Capacity: '3840Wh', Output: '6000W surge', Battery: 'LiFePO4', Warranty: '10 years' },
  },
];

const quickPicks = [
  { label: 'Best Overall', name: 'EcoFlow Delta Pro 3', href: '/articles/ecoflow_delta_pro_3', score: 9.2, price: '$3,699' },
  { label: 'Best Value', name: 'Bluetti AC300', href: '/articles/bluetti_ac300', score: 8.9, price: '$2,999' },
  { label: 'Largest Capacity', name: 'Goal Zero Yeti 6000X', href: '/articles/goal_zero_yeti_6000x', score: 8.7, price: '$4,999' },
];

export default function BestHouseBackupPowerStations() {
  return (
    <div className="min-h-screen bg-neutral-50">
      <Breadcrumb items={[
        { label: 'Home', href: '/' },
        { label: 'Best Of', href: '/best' },
        { label: 'Power Stations', href: '/best/power-stations' },
        { label: 'House Backup' },
      ]} />

      <div className="bg-gradient-to-br from-primary to-primary-dark px-6 py-10 text-white">
        <div className="mx-auto max-w-content">
          <SectionLabel className="text-white/70">Buying Guide</SectionLabel>
          <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">Best House Backup Power Stations 2025</h1>
          <p className="mt-2 max-w-2xl text-base text-white/80">
            High-capacity power stations designed for whole-home backup during extended outages with professional-grade features and home integration capabilities.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {['3000Wh+ Capacity', 'Home Integration', 'Extended Runtime'].map((tag) => (
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
              <h2 className="mb-4 text-lg font-bold text-neutral-900">Home Backup Installation Guide</h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {[
                  { title: 'Professional Installation', items: ['Transfer switch installation required', 'Electrical panel integration', 'Proper grounding and safety systems', 'Local electrical code compliance', 'Professional electrician recommended'] },
                  { title: 'Planning Considerations', items: ['Calculate essential load requirements', 'Plan for ventilation and cooling', 'Consider expansion capabilities', 'Factor in maintenance access', 'Budget for installation costs'] },
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
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-primary">Runtime Estimates</h3>
              <div className="space-y-2 text-xs">
                {[
                  { device: 'Refrigerator', runtime: '24–48 hours' },
                  { device: 'LED Lights', runtime: '100+ hours' },
                  { device: 'WiFi Router', runtime: '200+ hours' },
                  { device: 'Sump Pump', runtime: '8–16 hours' },
                  { device: 'HVAC Fan', runtime: '12–24 hours' },
                ].map((item) => (
                  <div key={item.device} className="flex justify-between">
                    <span className="text-neutral-600">{item.device}</span>
                    <span className="font-medium text-primary">{item.runtime}</span>
                  </div>
                ))}
                <p className="mt-1 text-[10px] text-neutral-400">*Based on 3000Wh capacity</p>
              </div>
            </div>

            <AdBanner adSlot={ADSENSE_CONFIG.adSlots.sidebar} adFormat="rectangle" style={{ minHeight: 250 }} className="rounded-lg" />

            <Newsletter />
          </aside>
        </div>
      </div>
    </div>
  );
}
