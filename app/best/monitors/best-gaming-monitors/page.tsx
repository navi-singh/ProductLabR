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
  title: 'Best Gaming Monitors 2025 - Expert Reviews',
  description: 'Top gaming monitors tested for refresh rate, response time, color accuracy, and HDR. Find the best 1080p, 1440p, and 4K gaming monitors.',
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
    summary: 'The best all-around gaming monitor with a 4K 144Hz Nano IPS panel, HDMI 2.1 port, G-Sync compatibility, and excellent color accuracy.',
    score: 9.2,
    price: '$799',
    badge: 'best-overall' as const,
    specs: { Panel: 'Nano IPS', Resolution: '4K UHD (3840x2160)', 'Refresh Rate': '144Hz (160Hz OC)', 'Response Time': '1ms GTG', HDR: 'DisplayHDR 600' },
  },
  {
    rank: 2,
    name: 'Samsung Odyssey G7',
    href: '/articles/samsung_odyssey_g7',
    image: '/images/item.png',
    summary: 'Outstanding 1440p 240Hz QLED gaming monitor with 1000R curve, VA panel deep blacks, and excellent contrast for immersive gaming.',
    score: 9.0,
    price: '$649',
    badge: 'best-value' as const,
    specs: { Panel: 'QLED VA', Resolution: '1440p QHD', 'Refresh Rate': '240Hz', 'Response Time': '1ms GTG', HDR: 'DisplayHDR 600' },
  },
  {
    rank: 3,
    name: 'AOC 24G2SP',
    href: '/articles/aoc_24g2sp',
    image: '/images/item.png',
    summary: 'The best budget gaming monitor with a fast 165Hz IPS panel, accurate colors out-of-box, and AMD FreeSync Premium for butter-smooth gameplay.',
    score: 8.6,
    price: '$199',
    badge: 'budget-pick' as const,
    specs: { Panel: 'IPS', Resolution: '1080p FHD', 'Refresh Rate': '165Hz', 'Response Time': '1ms MPRT', HDR: 'No' },
  },
  {
    rank: 4,
    name: 'ASUS ROG Swift PG279QM',
    href: '/articles/asus_rog_swift_pg279qm',
    image: '/images/item.png',
    summary: 'High-end 1440p 240Hz IPS gaming monitor with G-Sync Ultimate, wide color gamut coverage, and ASUS ROG styling for the premium gaming setup.',
    score: 9.1,
    price: '$899',
    specs: { Panel: 'Fast IPS', Resolution: '1440p QHD', 'Refresh Rate': '240Hz', 'Response Time': '1ms GTG', HDR: 'DisplayHDR 400' },
  },
];

const quickPicks = [
  { label: 'Best Overall', name: 'LG 27GP950-B', href: '/articles/lg_27gp950b', score: 9.2, price: '$799' },
  { label: 'Best Value', name: 'Samsung Odyssey G7', href: '/articles/samsung_odyssey_g7', score: 9.0, price: '$649' },
  { label: 'Budget Pick', name: 'AOC 24G2SP', href: '/articles/aoc_24g2sp', score: 8.6, price: '$199' },
];

export default function BestGamingMonitorsPage() {
  return (
    <div className="min-h-screen bg-neutral-50">
      <Breadcrumb items={[
        { label: 'Home', href: '/' },
        { label: 'Best Of', href: '/best' },
        { label: 'Monitors', href: '/best/monitors' },
        { label: 'Best Gaming Monitors' },
      ]} />

      <div className="bg-gradient-to-br from-primary to-primary-dark px-6 py-10 text-white">
        <div className="mx-auto max-w-content">
          <SectionLabel className="text-white/70">Buying Guide</SectionLabel>
          <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">Best Gaming Monitors 2025</h1>
          <p className="mt-2 max-w-2xl text-base text-white/80">
            Top gaming monitors tested with measured response times, refresh rate accuracy, and color performance for 1080p, 1440p, and 4K gaming.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {['Response Time Measured', 'High Refresh Rate Verified', 'G-Sync & FreeSync Tested'].map((tag) => (
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

            <div className="rounded-xl bg-gradient-to-br from-primary-lightest to-primary-light/20 p-6">
              <SectionLabel>Methodology</SectionLabel>
              <h2 className="mb-4 text-lg font-bold text-neutral-900">1080p vs 1440p vs 4K Gaming</h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {[
                  { title: 'Choosing Your Resolution', items: ['1080p: Best for competitive gaming (high FPS, fast response)', '1440p: Sweet spot for image quality and performance', '4K: Best visuals, needs powerful GPU (RTX 4070+ or RX 7900 XT+)', '27-inch and below: 1440p is the sweet spot', '32-inch and above: Consider 4K for pixel density'] },
                  { title: 'Refresh Rate Guide', items: ['60Hz: Minimum for casual gaming', '144Hz: Major improvement in smoothness — recommended', '165–240Hz: Best for competitive FPS games', '360Hz+: For pro-level competitive players only', 'VRR (G-Sync/FreeSync) eliminates screen tearing'] },
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
                {monitors.map((monitor) => (
                  <li key={monitor.rank}>
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
                <li><Link href="/best/monitors" className="text-neutral-700 hover:text-primary hover:underline">All Monitors</Link></li>
                <li><Link href="/best/monitors/best-4k-monitors" className="text-neutral-700 hover:text-primary hover:underline">Best 4K Monitors</Link></li>
                <li><Link href="/best/monitors/best-ultrawide-monitors" className="text-neutral-700 hover:text-primary hover:underline">Best Ultrawide Monitors</Link></li>
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
