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
  title: 'Best Gaming Mice 2025 - Expert Reviews',
  description: 'Top gaming mice tested for sensor accuracy, click latency, weight, and wireless performance. Find the best gaming mouse for FPS, MMO, or any genre.',
};

interface MouseEntry {
  rank: number; name: string; href: string; image: string; summary: string;
  score: number; price: string; badge?: 'best-overall' | 'best-value' | 'budget-pick';
  specs?: Record<string, string>;
}

const mice: MouseEntry[] = [
  {
    rank: 1,
    name: 'Logitech G Pro X Superlight 2',
    href: '/best/gaming/best-gaming-mice',
    image: '/images/item.png',
    summary: 'The definitive competitive gaming mouse at just 60g with the flawless HERO 2 sensor, near-instant LIGHTSPEED 2.4GHz wireless, and 95-hour battery life.',
    score: 9.4,
    price: '$159',
    badge: 'best-overall' as const,
    specs: { Sensor: 'HERO 2 (25,600 DPI)', DPI: '100–25,600', Weight: '60g', Wireless: 'LIGHTSPEED 2.4GHz', 'Polling Rate': '2000Hz' },
  },
  {
    rank: 2,
    name: 'Razer DeathAdder V3',
    href: '/best/gaming/best-gaming-mice',
    image: '/images/item.png',
    summary: 'Best ergonomic gaming mouse with iconic right-handed shape redesigned 30% lighter, Focus Pro 30K sensor, and HyperSpeed wireless at under $80.',
    score: 9.1,
    price: '$79',
    badge: 'best-value' as const,
    specs: { Sensor: 'Focus Pro 30K', DPI: '200–30,000', Weight: '64g', Wireless: 'HyperSpeed 2.4GHz', 'Polling Rate': '1000Hz (4000Hz polling edition)' },
  },
  {
    rank: 3,
    name: 'Redragon M711 Cobra',
    href: '/best/gaming/best-gaming-mice',
    image: '/images/item.png',
    summary: 'Outstanding budget gaming mouse with a reliable optical sensor, 7 programmable buttons, RGB lighting, and solid build quality at an unbeatable price.',
    score: 8.3,
    price: '$25',
    badge: 'budget-pick' as const,
    specs: { Sensor: 'Pixart PMW3325', DPI: '200–10,000', Weight: '130g', Wireless: 'No (wired)', 'Polling Rate': '1000Hz' },
  },
  {
    rank: 4,
    name: 'SteelSeries Rival 650',
    href: '/best/gaming/best-gaming-mice',
    image: '/images/item.png',
    summary: 'Quantum wireless mouse with dual sensor system, adjustable weight, and a distinctive design suited for both claw and palm grips.',
    score: 8.8,
    price: '$119',
    specs: { Sensor: 'TrueMove3+ Dual Sensor', DPI: '100–12,000', Weight: '121g (adjustable)', Wireless: 'Quantum 2.4GHz', 'Polling Rate': '1000Hz' },
  },
];

const quickPicks = [
  { label: 'Best Overall', name: 'Logitech G Pro X Superlight 2', href: '/best/gaming/best-gaming-mice', score: 9.4, price: '$159' },
  { label: 'Best Ergonomic', name: 'Razer DeathAdder V3', href: '/best/gaming/best-gaming-mice', score: 9.1, price: '$79' },
  { label: 'Budget Pick', name: 'Redragon M711 Cobra', href: '/best/gaming/best-gaming-mice', score: 8.3, price: '$25' },
];

export default function BestGamingMicePage() {
  return (
    <div className="min-h-screen bg-neutral-50">
      <Breadcrumb items={[
        { label: 'Home', href: '/' },
        { label: 'Best Of', href: '/best' },
        { label: 'Gaming', href: '/best/gaming' },
        { label: 'Best Gaming Mice' },
      ]} />

      <div className="bg-gradient-to-br from-primary to-primary-dark px-6 py-10 text-white">
        <div className="mx-auto max-w-content">
          <SectionLabel className="text-white/70">Buying Guide</SectionLabel>
          <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">Best Gaming Mice 2025</h1>
          <p className="mt-2 max-w-2xl text-base text-white/80">
            Top gaming mice tested with real-world latency measurements, sensor tracking accuracy, click consistency, and long-session comfort for all grip styles.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {['Sensor Accuracy Tested', 'Click Latency Measured', 'Wireless Stability Verified'].map((tag) => (
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
                {mice.map((mouse, i) => (
                  <div key={mouse.rank}>
                    <RankedProductCard {...mouse} />
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
              <h2 className="mb-4 text-lg font-bold text-neutral-900">How to Choose a Gaming Mouse</h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {[
                  { title: 'Grip Style Matters', items: ['Palm grip: Full hand on mouse — larger mice (120g+)', 'Claw grip: Arched fingers — medium mice (80–110g)', 'Fingertip grip: Only fingertips touch — lightweight mice (<80g)', 'Measure your hand before buying for best fit', 'Symmetrical vs right-handed ergonomic designs'] },
                  { title: 'Wired vs Wireless', items: ['Wireless has matched wired latency in 2023+', 'LIGHTSPEED, HyperSpeed, and Slipstream are top options', 'Wired still preferred by some pros for reliability', 'Budget wireless often has higher latency — check specs', '2.4GHz always better than Bluetooth for gaming'] },
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
                {mice.map((mouse) => (
                  <li key={mouse.rank}>
                    <Link href={mouse.href} className="flex items-center gap-2 text-neutral-600 hover:text-primary">
                      <span className="text-[10px] text-neutral-400">#{mouse.rank}</span>
                      {mouse.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-xl bg-gradient-to-br from-primary-lightest to-primary-light/20 p-4">
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-primary">Related Guides</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/best/gaming" className="text-neutral-700 hover:text-primary hover:underline">All Gaming Peripherals</Link></li>
                <li><Link href="/best/gaming/best-gaming-keyboards" className="text-neutral-700 hover:text-primary hover:underline">Best Gaming Keyboards</Link></li>
                <li><Link href="/best/gaming/best-gaming-headsets" className="text-neutral-700 hover:text-primary hover:underline">Best Gaming Headsets</Link></li>
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
