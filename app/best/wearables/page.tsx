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
  title: 'Best Wearables 2025 - Expert Reviews & Buying Guide',
  description: 'The best smartwatches and fitness trackers for health monitoring and everyday use. Expert tested Apple Watch, Samsung Galaxy Watch, and Garmin.',
};

interface WearableEntry {
  rank: number; name: string; href: string; image: string; summary: string;
  score: number; price: string; badge?: 'best-overall' | 'best-value' | 'budget-pick';
  specs?: Record<string, string>;
}

const wearables: WearableEntry[] = [
  {
    rank: 1,
    name: 'Apple Watch Series 10',
    href: '/best/wearables/best-smartwatches',
    image: '/images/item.png',
    summary: 'Apple\'s thinnest and lightest Watch ever with a larger display, faster charging, and comprehensive health monitoring features.',
    score: 9.3,
    price: '$399',
    badge: 'best-overall' as const,
    specs: { Display: '46mm Always-On OLED', 'Battery Life': '18hr', 'Health Sensors': 'ECG, Blood Oxygen', OS: 'watchOS 11', 'Water Resistance': '50m' },
  },
  {
    rank: 2,
    name: 'Samsung Galaxy Watch 7',
    href: '/best/wearables/best-smartwatches',
    image: '/images/item.png',
    summary: 'Best Android smartwatch with advanced health tracking, Galaxy AI features, and excellent integration with Samsung phones.',
    score: 9.0,
    price: '$299',
    badge: 'best-value' as const,
    specs: { Display: '44mm Super AMOLED', 'Battery Life': '40hr', 'Health Sensors': 'BioActive Sensor', OS: 'Wear OS 5', 'Water Resistance': '5ATM' },
  },
  {
    rank: 3,
    name: 'Amazfit GTR 4',
    href: '/best/wearables/best-fitness-trackers',
    image: '/images/item.png',
    summary: 'Exceptional battery life paired with comprehensive fitness and health tracking at a budget-friendly price point.',
    score: 8.4,
    price: '$149',
    badge: 'budget-pick' as const,
    specs: { Display: '46mm AMOLED', 'Battery Life': '14 days', 'Health Sensors': 'SpO2, ECG', OS: 'Zepp OS', 'Water Resistance': '5ATM' },
  },
];

const quickPicks = [
  { label: 'Best Overall', name: 'Apple Watch Series 10', href: '/best/wearables/best-smartwatches', score: 9.3, price: '$399' },
  { label: 'Best Android', name: 'Samsung Galaxy Watch 7', href: '/best/wearables/best-smartwatches', score: 9.0, price: '$299' },
  { label: 'Budget Pick', name: 'Amazfit GTR 4', href: '/best/wearables/best-fitness-trackers', score: 8.4, price: '$149' },
];

const categoryLinks = [
  { href: '/best/wearables/best-smartwatches', label: 'Best Smartwatches', count: 4 },
  { href: '/best/wearables/best-fitness-trackers', label: 'Best Fitness Trackers', count: 4 },
];

export default function WearablesPage() {
  return (
    <div className="min-h-screen bg-neutral-50">
      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Best Of', href: '/best' }, { label: 'Wearables' }]} />

      {/* Header */}
      <div className="bg-gradient-to-br from-primary to-primary-dark px-6 py-10 text-white">
        <div className="mx-auto max-w-content">
          <SectionLabel className="text-white/70">Buying Guide</SectionLabel>
          <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">Best Wearables 2025</h1>
          <p className="mt-2 max-w-2xl text-base text-white/80">
            Expert-tested smartwatches and fitness trackers for health monitoring, sports tracking, and everyday connected convenience.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {['20+ Wearables Tested', 'Health Accuracy Verified', 'Battery Life Measured'].map((tag) => (
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
                {wearables.map((wearable, i) => (
                  <div key={wearable.rank}>
                    <RankedProductCard {...wearable} />
                    {i === 2 && (
                      <div className="mt-4">
                        <AdBanner adSlot={ADSENSE_CONFIG.adSlots.categoryBottom} adFormat="auto" className="rounded-lg" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Wearables Categories */}
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
              <h2 className="mb-4 text-lg font-bold text-neutral-900">How We Test Wearables</h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {[
                  { title: 'Health Accuracy', desc: 'Heart rate, SpO2, and sleep tracking accuracy compared against medical-grade reference devices over multiple weeks.' },
                  { title: 'Battery Life', desc: 'Real-world battery testing in always-on display mode, workout tracking mode, and standard daily use.' },
                  { title: 'Software & Features', desc: 'Companion app quality, third-party app ecosystem, notification handling, and smartphone compatibility assessment.' },
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
                {wearables.map((wearable) => (
                  <li key={`${wearable.href}-${wearable.rank}`}>
                    <Link href={wearable.href} className="flex items-center gap-2 text-neutral-600 hover:text-primary">
                      <span className="text-[10px] text-neutral-400">#{wearable.rank}</span>
                      {wearable.name}
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
