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
  title: 'Best Monitors 2025 - Expert Reviews & Buying Guide',
  description: 'The best monitors for gaming, work, and creative professionals. Expert tested 4K, ultrawide, and gaming monitors with calibrated measurements.',
};

interface MonitorEntry {
  rank: number; name: string; href: string; image: string; summary: string;
  score: number; price: string; badge?: 'best-overall' | 'best-value' | 'budget-pick';
  specs?: Record<string, string>;
}

const monitors: MonitorEntry[] = [
  {
    rank: 1,
    name: 'LG 27GP950-B UltraGear',
    href: '/articles/lg_27gp950b',
    image: '/images/item.png',
    summary: 'Brilliant 4K 144Hz Nano IPS panel with HDMI 2.1 support for both PC and console gaming at top resolution and speed.',
    score: 9.2,
    price: '$799',
    badge: 'best-overall' as const,
    specs: { Panel: 'Nano IPS', Resolution: '4K UHD', 'Refresh Rate': '144Hz', 'Response Time': '1ms GTG', HDR: 'DisplayHDR 600' },
  },
  {
    rank: 2,
    name: 'Dell U2723D UltraSharp',
    href: '/articles/dell_u2723d',
    image: '/images/item.png',
    summary: 'Professional-grade IPS Black panel with exceptional color accuracy and wide color gamut coverage for creative work.',
    score: 9.2,
    price: '$599',
    badge: 'best-value' as const,
    specs: { Panel: 'IPS Black', Resolution: 'QHD 2560x1440', 'Color Accuracy': 'Delta E < 2', Ports: 'Thunderbolt 4', Size: '27"' },
  },
  {
    rank: 3,
    name: 'AOC 24G2SP',
    href: '/articles/aoc_24g2sp',
    image: '/images/item.png',
    summary: 'An outstanding budget gaming monitor with fast IPS panel, 165Hz refresh rate, and accurate colors at an unbeatable price.',
    score: 8.6,
    price: '$199',
    badge: 'budget-pick' as const,
    specs: { Panel: 'IPS', Resolution: '1080p FHD', 'Refresh Rate': '165Hz', 'Response Time': '1ms MPRT', HDR: 'No' },
  },
];

const quickPicks = [
  { label: 'Best Gaming', name: 'LG 27GP950-B', href: '/articles/lg_27gp950b', score: 9.2, price: '$799' },
  { label: 'Best for Work', name: 'Dell U2723D', href: '/articles/dell_u2723d', score: 9.2, price: '$599' },
  { label: 'Budget Pick', name: 'AOC 24G2SP', href: '/articles/aoc_24g2sp', score: 8.6, price: '$199' },
];

const categoryLinks = [
  { href: '/best/monitors/best-gaming-monitors', label: 'Best Gaming Monitors', count: 4 },
  { href: '/best/monitors/best-4k-monitors', label: 'Best 4K Monitors', count: 4 },
  { href: '/best/monitors/best-ultrawide-monitors', label: 'Best Ultrawide Monitors', count: 4 },
];

export default function MonitorsPage() {
  return (
    <div className="min-h-screen bg-neutral-50">
      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Best Of', href: '/best' }, { label: 'Monitors' }]} />

      {/* Header */}
      <div className="bg-gradient-to-br from-primary to-primary-dark px-6 py-10 text-white">
        <div className="mx-auto max-w-content">
          <SectionLabel className="text-white/70">Buying Guide</SectionLabel>
          <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">Best Monitors 2025</h1>
          <p className="mt-2 max-w-2xl text-base text-white/80">
            Expert-tested monitors for gaming, productivity, and professional creative work. From high-refresh gaming panels to color-accurate 4K displays.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {['25+ Monitors Tested', 'Calibrated Color Measurements', 'Gaming Benchmarks'].map((tag) => (
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
                {monitors.map((monitor, i) => (
                  <div key={monitor.rank}>
                    <RankedProductCard {...monitor} />
                    {i === 2 && (
                      <div className="mt-4">
                        <AdBanner adSlot={ADSENSE_CONFIG.adSlots.categoryBottom} adFormat="auto" className="rounded-lg" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Monitor Categories */}
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
              <h2 className="mb-4 text-lg font-bold text-neutral-900">How We Test Monitors</h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {[
                  { title: 'Display Accuracy', desc: 'Colorimeter measurements of color accuracy, gamut coverage, uniformity, and brightness levels out-of-box and post-calibration.' },
                  { title: 'Gaming Performance', desc: 'Response time measurements, motion blur testing, VRR testing, and input lag benchmarks at various refresh rates.' },
                  { title: 'Ergonomics & Build', desc: 'Stand adjustability range, panel tilt and swivel, port selection, cable management, and overall build quality assessment.' },
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
                {monitors.map((monitor) => (
                  <li key={`${monitor.href}-${monitor.rank}`}>
                    <Link href={monitor.href} className="flex items-center gap-2 text-neutral-600 hover:text-primary">
                      <span className="text-[10px] text-neutral-400">#{monitor.rank}</span>
                      {monitor.name}
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
