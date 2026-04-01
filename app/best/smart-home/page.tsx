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
  title: 'Best Smart Home Devices 2025 - Expert Reviews & Buying Guide',
  description: 'The best smart home devices for robot vacuums, smart speakers, and video doorbells. Expert tested and reviewed for performance and value.',
};

interface ProductEntry {
  rank: number; name: string; href: string; image: string; summary: string;
  score: number; price: string; badge?: 'best-overall' | 'best-value' | 'budget-pick';
  specs?: Record<string, string>;
}

const products: ProductEntry[] = [
  {
    rank: 1,
    name: 'Roborock S8 MaxV Ultra',
    href: '/best/smart-home/best-robot-vacuums',
    image: '/images/item.png',
    summary: 'The ultimate robot vacuum and mop combo with self-emptying base, sonic mopping, and advanced obstacle avoidance using dual cameras.',
    score: 9.4,
    price: '$1,599',
    badge: 'best-overall' as const,
    specs: { Suction: '10,000 Pa', Mop: 'Sonic Vibration', 'Auto-Empty': 'Yes', Battery: '180 min', Navigation: 'ReactiveAI 3.0' },
  },
  {
    rank: 2,
    name: 'Amazon Echo (4th Gen)',
    href: '/best/smart-home/best-smart-speakers',
    image: '/images/item.png',
    summary: 'Best-sounding Echo yet with a spherical design, built-in Zigbee hub, and seamless integration across the entire Amazon ecosystem.',
    score: 8.8,
    price: '$99',
    badge: 'best-value' as const,
    specs: { 'Speaker Driver': '3.0" woofer', 'Smart Assistant': 'Alexa', Connectivity: 'Wi-Fi, Bluetooth', Audio: 'Dolby processing', Hub: 'Zigbee built-in' },
  },
  {
    rank: 3,
    name: 'Eufy RoboVac 11S',
    href: '/best/smart-home/best-robot-vacuums',
    image: '/images/item.png',
    summary: 'Ultra-slim, quiet robot vacuum that delivers reliable cleaning on hard floors and carpets at a budget-friendly price.',
    score: 8.3,
    price: '$199',
    badge: 'budget-pick' as const,
    specs: { Suction: '1300 Pa', Mop: 'No', 'Auto-Empty': 'No', Battery: '100 min', Navigation: 'Gyroscope' },
  },
];

const quickPicks = [
  { label: 'Best Robot Vacuum', name: 'Roborock S8 MaxV Ultra', href: '/best/smart-home/best-robot-vacuums', score: 9.4, price: '$1,599' },
  { label: 'Best Smart Speaker', name: 'Amazon Echo (4th Gen)', href: '/best/smart-home/best-smart-speakers', score: 8.8, price: '$99' },
  { label: 'Budget Pick', name: 'Eufy RoboVac 11S', href: '/best/smart-home/best-robot-vacuums', score: 8.3, price: '$199' },
];

const categoryLinks = [
  { href: '/best/smart-home/best-robot-vacuums', label: 'Best Robot Vacuums', count: 4 },
  { href: '/best/smart-home/best-smart-speakers', label: 'Best Smart Speakers', count: 4 },
  { href: '/best/smart-home/best-video-doorbells', label: 'Best Video Doorbells', count: 4 },
];

export default function SmartHomePage() {
  return (
    <div className="min-h-screen bg-neutral-50">
      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Best Of', href: '/best' }, { label: 'Smart Home' }]} />

      {/* Header */}
      <div className="bg-gradient-to-br from-primary to-primary-dark px-6 py-10 text-white">
        <div className="mx-auto max-w-content">
          <SectionLabel className="text-white/70">Buying Guide</SectionLabel>
          <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">Best Smart Home Devices 2025</h1>
          <p className="mt-2 max-w-2xl text-base text-white/80">
            Expert-tested smart home technology from robot vacuums to smart speakers and video doorbells. Make your home smarter and more efficient.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {['40+ Devices Tested', 'Real Home Testing', 'Smart Ecosystem Reviews'].map((tag) => (
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
                {products.map((product, i) => (
                  <div key={product.rank}>
                    <RankedProductCard {...product} />
                    {i === 2 && (
                      <div className="mt-4">
                        <AdBanner adSlot={ADSENSE_CONFIG.adSlots.categoryBottom} adFormat="auto" className="rounded-lg" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Smart Home Categories */}
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
              <h2 className="mb-4 text-lg font-bold text-neutral-900">How We Test Smart Home Devices</h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {[
                  { title: 'Real-World Performance', desc: 'We test robot vacuums on multiple floor types, smart speakers in real acoustic environments, and doorbells in varying lighting.' },
                  { title: 'Smart Home Integration', desc: 'Compatibility with Amazon Alexa, Google Home, Apple HomeKit, and Matter protocol for seamless multi-device households.' },
                  { title: 'App & Setup Experience', desc: 'Initial setup ease, companion app quality, automation features, and long-term reliability over weeks of use.' },
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
                {products.map((product) => (
                  <li key={`${product.href}-${product.rank}`}>
                    <Link href={product.href} className="flex items-center gap-2 text-neutral-600 hover:text-primary">
                      <span className="text-[10px] text-neutral-400">#{product.rank}</span>
                      {product.name}
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
