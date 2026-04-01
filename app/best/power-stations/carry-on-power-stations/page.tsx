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
  title: 'Best Carry-On Power Stations 2025 - TSA Approved',
  description: 'TSA-approved power banks for travel and airline carry-on. Under 100Wh and flight-ready.',
};

interface StationEntry {
  rank: number; name: string; href: string; image: string; summary: string;
  score: number; price: string; badge?: 'best-overall' | 'best-value' | 'budget-pick';
  specs?: Record<string, string>;
}

const stations: StationEntry[] = [
  {
    rank: 1,
    name: 'Anker PowerCore 26800 PD',
    href: '/articles/anker_powercore_26800_pd',
    image: '/images/item.png',
    summary: 'TSA approved for flights with 30W Power Delivery, triple device charging, and fast recharge.',
    score: 9.0,
    price: '$129',
    badge: 'best-overall' as const,
    specs: { Capacity: '96.48Wh', Output: '30W PD', Weight: '1.28 lbs', TSA: 'Approved' },
  },
  {
    rank: 2,
    name: 'RAVPower 90W AC Power Bank',
    href: '/articles/ravpower_90w_ac',
    image: '/images/item.png',
    summary: 'Actual AC outlet for laptops with multiple charging options and a clear capacity display.',
    score: 8.8,
    price: '$199',
    badge: 'best-value' as const,
    specs: { Capacity: '88.8Wh', Output: '90W AC', Weight: '1.5 lbs', Display: 'Digital' },
  },
  {
    rank: 3,
    name: 'Goal Zero Sherpa 100AC',
    href: '/articles/goal_zero_sherpa_100ac',
    image: '/images/item.png',
    summary: 'Wireless charging convenience with rugged outdoor construction and reliable brand reputation.',
    score: 8.5,
    price: '$299',
    badge: 'budget-pick' as const,
    specs: { Capacity: '94.7Wh', Output: '100W AC', Weight: '2.0 lbs', Wireless: 'Yes' },
  },
];

const quickPicks = [
  { label: 'Best Overall', name: 'Anker PowerCore 26800', href: '/articles/anker_powercore_26800_pd', score: 9.0, price: '$129' },
  { label: 'Best Value', name: 'RAVPower 90W AC', href: '/articles/ravpower_90w_ac', score: 8.8, price: '$199' },
  { label: 'Premium Pick', name: 'Goal Zero Sherpa 100AC', href: '/articles/goal_zero_sherpa_100ac', score: 8.5, price: '$299' },
];

export default function BestCarryOnPowerStations() {
  return (
    <div className="min-h-screen bg-neutral-50">
      <Breadcrumb items={[
        { label: 'Home', href: '/' },
        { label: 'Best Of', href: '/best' },
        { label: 'Power Stations', href: '/best/power-stations' },
        { label: 'Carry-On Power' },
      ]} />

      <div className="bg-gradient-to-br from-primary to-primary-dark px-6 py-10 text-white">
        <div className="mx-auto max-w-content">
          <SectionLabel className="text-white/70">Buying Guide</SectionLabel>
          <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">Best Carry-On Power Stations 2025</h1>
          <p className="mt-2 max-w-2xl text-base text-white/80">
            TSA-approved power banks meeting the 100Wh limit for carry-on batteries. Perfect for keeping devices charged during long flights without airport restrictions.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {['TSA Compliant', 'Under 100Wh', 'Ultra-Compact'].map((tag) => (
              <span key={tag} className="rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs text-white/90">{tag}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-content px-4 py-8 sm:px-6">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[7fr_3fr]">
          <main className="space-y-6">
            <QuickPicks picks={quickPicks} />

            {/* TSA notice */}
            <div className="rounded-lg border border-primary-light bg-primary-lightest/60 px-4 py-3 text-sm text-primary">
              <strong>TSA Compliance Notice:</strong> All power stations listed here are under 100Wh and approved for airline carry-on. Always check with your specific airline for any additional restrictions.
            </div>

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
              <h2 className="mb-4 text-lg font-bold text-neutral-900">Air Travel Power Guide</h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {[
                  { title: 'TSA Regulations', items: ['Maximum 100Wh capacity for carry-on', 'Must be in carry-on bag, not checked', 'Spare batteries must be protected', 'Some airlines have additional restrictions', 'Always check current regulations'] },
                  { title: 'Travel Tips', items: ['Charge fully before departure', 'Bring appropriate cables for your devices', 'Consider international plug adapters', 'Pack in easily accessible location', 'Have backup charging options'] },
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
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-primary">Device Charges (90Wh avg)</h3>
              <div className="space-y-2 text-xs">
                {[
                  { device: 'iPhone', charges: '6–8 charges' },
                  { device: 'Android Phone', charges: '5–7 charges' },
                  { device: 'iPad', charges: '2–3 charges' },
                  { device: 'MacBook Air', charges: '1–1.5 charges' },
                  { device: 'Nintendo Switch', charges: '3–4 charges' },
                ].map((item) => (
                  <div key={item.device} className="flex justify-between">
                    <span className="text-neutral-600">{item.device}</span>
                    <span className="font-medium text-primary">{item.charges}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl bg-gradient-to-br from-primary-lightest to-primary-light/20 p-4">
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-primary">Related Guides</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/best/power-stations" className="text-neutral-700 hover:text-primary hover:underline">All Power Stations</Link></li>
                <li><Link href="/best/power-stations/portable-power-stations" className="text-neutral-700 hover:text-primary hover:underline">Portable Power Stations</Link></li>
                <li><Link href="/best/power-stations/camping-power-stations" className="text-neutral-700 hover:text-primary hover:underline">Camping Power Stations</Link></li>
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
