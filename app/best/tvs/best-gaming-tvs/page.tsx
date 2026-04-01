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
  title: 'Best Gaming TVs 2025 - Expert Reviews',
  description: 'Top gaming TVs tested for input lag, HDMI 2.1, VRR, and 4K/120Hz performance. Find the best TV for PS5, Xbox Series X, and PC gaming.',
};

interface TVEntry {
  rank: number; name: string; href: string; image: string; summary: string;
  score: number; price: string; badge?: 'best-overall' | 'best-value' | 'budget-pick';
  specs?: Record<string, string>;
}

const tvs: TVEntry[] = [
  {
    rank: 1,
    name: 'Samsung QN90C Neo QLED',
    href: '/best/tvs/best-gaming-tvs',
    image: '/images/item.png',
    summary: 'Elite gaming TV with 144Hz refresh rate, 4x HDMI 2.1 ports, ultra-low input lag, and blazing brightness that handles any lighting condition.',
    score: 9.2,
    price: '$1,299',
    badge: 'best-overall' as const,
    specs: { 'Refresh Rate': '144Hz', 'HDMI 2.1': '4 ports', VRR: 'FreeSync Premium Pro', 'Input Lag': '~5.8ms', Resolution: '4K UHD' },
  },
  {
    rank: 2,
    name: 'LG C4 OLED',
    href: '/best/tvs/best-gaming-tvs',
    image: '/images/item.png',
    summary: 'The best OLED for gaming with 4 HDMI 2.1 ports, G-Sync compatible, near-instant pixel response, and gorgeous picture quality.',
    score: 9.4,
    price: '$1,299',
    badge: 'best-value' as const,
    specs: { 'Refresh Rate': '120Hz', 'HDMI 2.1': '4 ports', VRR: 'G-Sync, FreeSync', 'Input Lag': '~1.3ms', Resolution: '4K UHD' },
  },
  {
    rank: 3,
    name: 'Hisense U8K',
    href: '/best/tvs/best-gaming-tvs',
    image: '/images/item.png',
    summary: 'Incredible budget gaming TV with 144Hz panel, Mini-LED backlighting, and solid VRR support that competes with TVs costing twice as much.',
    score: 8.9,
    price: '$699',
    badge: 'budget-pick' as const,
    specs: { 'Refresh Rate': '144Hz', 'HDMI 2.1': '2 ports', VRR: 'AMD FreeSync', 'Input Lag': '~12ms', Resolution: '4K UHD' },
  },
  {
    rank: 4,
    name: 'Sony X90L',
    href: '/best/tvs/best-gaming-tvs',
    image: '/images/item.png',
    summary: 'Sony\'s gaming-focused LED TV with excellent motion handling, HDMI 2.1 ports, and PlayStation-optimized Auto HDR Tone Mapping.',
    score: 8.8,
    price: '$899',
    specs: { 'Refresh Rate': '120Hz', 'HDMI 2.1': '2 ports', VRR: 'VRR, ALLM', 'Input Lag': '~8.5ms', Resolution: '4K UHD' },
  },
];

const quickPicks = [
  { label: 'Best Overall', name: 'Samsung QN90C', href: '/best/tvs/best-gaming-tvs', score: 9.2, price: '$1,299' },
  { label: 'Best OLED', name: 'LG C4 OLED', href: '/best/tvs/best-gaming-tvs', score: 9.4, price: '$1,299' },
  { label: 'Budget Pick', name: 'Hisense U8K', href: '/best/tvs/best-gaming-tvs', score: 8.9, price: '$699' },
];

export default function BestGamingTVsPage() {
  return (
    <div className="min-h-screen bg-neutral-50">
      <Breadcrumb items={[
        { label: 'Home', href: '/' },
        { label: 'Best Of', href: '/best' },
        { label: 'TVs', href: '/best/tvs' },
        { label: 'Best Gaming TVs' },
      ]} />

      <div className="bg-gradient-to-br from-primary to-primary-dark px-6 py-10 text-white">
        <div className="mx-auto max-w-content">
          <SectionLabel className="text-white/70">Buying Guide</SectionLabel>
          <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">Best Gaming TVs 2025</h1>
          <p className="mt-2 max-w-2xl text-base text-white/80">
            Top gaming TVs tested for input lag, HDMI 2.1 bandwidth, VRR compatibility, and 4K/120Hz performance with PS5, Xbox Series X, and PC.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {['Input Lag Measured', 'HDMI 2.1 Verified', 'Console & PC Tested'].map((tag) => (
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
                {tvs.map((tv, i) => (
                  <div key={tv.rank}>
                    <RankedProductCard {...tv} />
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
              <h2 className="mb-4 text-lg font-bold text-neutral-900">What Makes a Great Gaming TV?</h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {[
                  { title: 'Key Gaming Features', items: ['HDMI 2.1 for 4K/120Hz from consoles', 'Variable Refresh Rate (VRR) for smooth gameplay', 'Auto Low Latency Mode (ALLM) automatic switching', 'Input lag under 15ms in game mode', '120Hz panel minimum for fluid motion'] },
                  { title: 'Console-Specific Notes', items: ['PS5 supports 4K/120Hz on HDMI 2.1', 'Xbox Series X supports 4K/120Hz + 8K/30Hz', 'Both consoles support VRR natively', 'PC gaming benefits from G-Sync/FreeSync', 'OLED offers near-instant pixel response advantage'] },
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
                {tvs.map((tv) => (
                  <li key={tv.rank}>
                    <Link href={tv.href} className="flex items-center gap-2 text-neutral-600 hover:text-primary">
                      <span className="text-[10px] text-neutral-400">#{tv.rank}</span>
                      {tv.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-xl bg-gradient-to-br from-primary-lightest to-primary-light/20 p-4">
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-primary">Related Guides</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/best/tvs" className="text-neutral-700 hover:text-primary hover:underline">All TVs</Link></li>
                <li><Link href="/best/tvs/best-oled-tvs" className="text-neutral-700 hover:text-primary hover:underline">Best OLED TVs</Link></li>
                <li><Link href="/best/tvs/best-4k-tvs" className="text-neutral-700 hover:text-primary hover:underline">Best 4K TVs</Link></li>
                <li><Link href="/best/tvs/best-budget-tvs" className="text-neutral-700 hover:text-primary hover:underline">Best Budget TVs</Link></li>
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
