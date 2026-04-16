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
  title: 'Best Gaming Peripherals 2025 - Expert Reviews & Buying Guide',
  description: 'The best gaming keyboards, mice, and headsets for competitive and casual gaming. Expert tested for performance, latency, and value.',
};

interface ProductEntry {
  rank: number; name: string; href: string; image: string; summary: string;
  score: number; price: string; badge?: 'best-overall' | 'best-value' | 'budget-pick';
  specs?: Record<string, string>;
}

const products: ProductEntry[] = [
  {
    rank: 1,
    name: 'Logitech G Pro X Superlight 2',
    href: '/articles/logitech_g_pro_x_superlight_2',
    image: '/images/item.png',
    summary: 'The gold standard for competitive gaming mice — ultra-lightweight at 60g, HERO 2 sensor, and near-zero click latency.',
    score: 9.4,
    price: '$159',
    badge: 'best-overall' as const,
    specs: { Sensor: 'HERO 2', DPI: '100–32,000', Weight: '60g', Wireless: 'LIGHTSPEED 2.4GHz', 'Polling Rate': '2000Hz' },
  },
  {
    rank: 2,
    name: 'SteelSeries Apex Pro',
    href: '/articles/steelseries_apex_pro',
    image: '/images/item.png',
    summary: 'Revolutionary adjustable actuation OmniPoint 2.0 switches let you customize the feel per-key for ultimate competitive advantage.',
    score: 9.2,
    price: '$179',
    badge: 'best-value' as const,
    specs: { 'Switch Type': 'OmniPoint 2.0', 'Form Factor': 'TKL', Lighting: 'Per-key RGB', Wireless: 'No', 'Polling Rate': '8000Hz' },
  },
  {
    rank: 3,
    name: 'Redragon M711 Cobra',
    href: '/articles/redragon_m711_cobra',
    image: '/images/item.png',
    summary: 'An incredible budget gaming mouse with solid sensor, programmable buttons, and RGB lighting that punches well above its price.',
    score: 8.3,
    price: '$25',
    badge: 'budget-pick' as const,
    specs: { Sensor: 'Pixart PMW3325', DPI: '200–10,000', Weight: '130g', Wireless: 'No', 'Polling Rate': '1000Hz' },
  },
];

const quickPicks = [
  { label: 'Best Mouse', name: 'Logitech G Pro X Superlight 2', href: '/articles/logitech_g_pro_x_superlight_2', score: 9.4, price: '$159' },
  { label: 'Best Keyboard', name: 'SteelSeries Apex Pro', href: '/articles/steelseries_apex_pro', score: 9.2, price: '$179' },
  { label: 'Budget Pick', name: 'Redragon M711 Cobra', href: '/articles/redragon_m711_cobra', score: 8.3, price: '$25' },
];

const categoryLinks = [
  { href: '/best/gaming/best-gaming-keyboards', label: 'Best Gaming Keyboards', count: 4 },
  { href: '/best/gaming/best-gaming-mice', label: 'Best Gaming Mice', count: 4 },
  { href: '/best/gaming/best-gaming-headsets', label: 'Best Gaming Headsets', count: 4 },
];

export default function GamingPage() {
  return (
    <div className="min-h-screen bg-neutral-50">
      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Best Of', href: '/best' }, { label: 'Gaming' }]} />

      {/* Header */}
      <div className="bg-gradient-to-br from-primary to-primary-dark px-6 py-10 text-white">
        <div className="mx-auto max-w-content">
          <SectionLabel className="text-white/70">Buying Guide</SectionLabel>
          <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">Best Gaming Peripherals 2025</h1>
          <p className="mt-2 max-w-2xl text-base text-white/80">
            Expert-tested gaming keyboards, mice, and headsets for every type of gamer. From top-tier competitive gear to budget-friendly setups.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {['50+ Peripherals Tested', 'Latency Benchmarked', 'Competitive Player Tested'].map((tag) => (
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

            {/* Gaming Categories */}
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
              <h2 className="mb-4 text-lg font-bold text-neutral-900">How We Test Gaming Peripherals</h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {[
                  { title: 'Performance Metrics', desc: 'Input latency measurements, sensor tracking accuracy, actuation force testing, and polling rate verification under gaming conditions.' },
                  { title: 'Competitive Gaming', desc: 'Real-world testing in competitive titles to evaluate responsiveness, precision, and any advantages in fast-paced scenarios.' },
                  { title: 'Build & Ergonomics', desc: 'Long-session comfort testing, grip style suitability, durability testing, and cable/wireless connection stability assessment.' },
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
