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
  title: 'Best TVs 2025 - Expert Reviews & Buying Guide',
  description: 'The best TVs for every room and budget. Expert tested OLED, QLED, and 4K TVs for home theater, gaming, and everyday viewing.',
};

interface TVEntry {
  rank: number; name: string; href: string; image: string; summary: string;
  score: number; price: string; badge?: 'best-overall' | 'best-value' | 'budget-pick';
  specs?: Record<string, string>;
}

const tvs: TVEntry[] = [
  {
    rank: 1,
    name: 'LG C4 OLED',
    href: '/best/tvs/best-oled-tvs',
    image: '/images/item.png',
    summary: 'Stunning OLED picture quality with perfect blacks, near-infinite contrast, and class-leading gaming features with 4x HDMI 2.1.',
    score: 9.4,
    price: '$1,299',
    badge: 'best-overall' as const,
    specs: { Panel: 'OLED evo', Resolution: '4K', HDR: 'Dolby Vision IQ', 'Refresh Rate': '120Hz', Size: '55"–83"' },
  },
  {
    rank: 2,
    name: 'Samsung QN90C Neo QLED',
    href: '/best/tvs/best-gaming-tvs',
    image: '/images/item.png',
    summary: 'Exceptional brightness and detail with Mini-LED backlighting, making it ideal for bright rooms and competitive gaming.',
    score: 9.2,
    price: '$1,299',
    badge: 'best-value' as const,
    specs: { Panel: 'Neo QLED', Resolution: '4K', HDR: 'HDR10+', 'Refresh Rate': '144Hz', Size: '43"–98"' },
  },
  {
    rank: 3,
    name: 'Hisense U8K',
    href: '/best/tvs/best-budget-tvs',
    image: '/images/item.png',
    summary: 'Incredible value with Mini-LED panel, high peak brightness, and solid gaming specs at a fraction of premium TV prices.',
    score: 8.9,
    price: '$699',
    badge: 'budget-pick' as const,
    specs: { Panel: 'Mini-LED QLED', Resolution: '4K', HDR: 'Dolby Vision', 'Refresh Rate': '144Hz', Size: '55"–85"' },
  },
];

const quickPicks = [
  { label: 'Best Overall', name: 'LG C4 OLED', href: '/best/tvs/best-oled-tvs', score: 9.4, price: '$1,299' },
  { label: 'Best Gaming', name: 'Samsung QN90C', href: '/best/tvs/best-gaming-tvs', score: 9.2, price: '$1,299' },
  { label: 'Budget Pick', name: 'Hisense U8K', href: '/best/tvs/best-budget-tvs', score: 8.9, price: '$699' },
];

const categoryLinks = [
  { href: '/best/tvs/best-oled-tvs', label: 'Best OLED TVs', count: 4 },
  { href: '/best/tvs/best-4k-tvs', label: 'Best 4K TVs', count: 4 },
  { href: '/best/tvs/best-gaming-tvs', label: 'Best Gaming TVs', count: 4 },
  { href: '/best/tvs/best-budget-tvs', label: 'Best Budget TVs', count: 4 },
];

export default function TVsPage() {
  return (
    <div className="min-h-screen bg-neutral-50">
      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Best Of', href: '/best' }, { label: 'TVs' }]} />

      {/* Header */}
      <div className="bg-gradient-to-br from-primary to-primary-dark px-6 py-10 text-white">
        <div className="mx-auto max-w-content">
          <SectionLabel className="text-white/70">Buying Guide</SectionLabel>
          <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">Best TVs 2025</h1>
          <p className="mt-2 max-w-2xl text-base text-white/80">
            Expert-tested televisions for home theater, gaming, and everyday use. From OLED to Mini-LED, we find the best picture for every budget.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {['25+ TVs Tested', 'Calibrated Measurements', 'Gaming Latency Tested'].map((tag) => (
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

            {/* TV Categories */}
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
              <h2 className="mb-4 text-lg font-bold text-neutral-900">How We Test TVs</h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {[
                  { title: 'Picture Quality', desc: 'Calibrated measurements of peak brightness, contrast ratio, color volume, and HDR tone mapping across multiple content types.' },
                  { title: 'Gaming Performance', desc: 'Input lag measurements, VRR support testing, HDMI 2.1 bandwidth, and 4K/120Hz compatibility across next-gen consoles.' },
                  { title: 'Smart Features', desc: 'OS responsiveness, app availability, voice assistant integration, and long-term software support assessment.' },
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
                {tvs.map((tv) => (
                  <li key={tv.href}>
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
