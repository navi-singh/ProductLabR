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
  title: 'Best OLED TVs 2025 - Expert Reviews',
  description: 'Top OLED TVs tested for picture quality, gaming performance, and value. Find the best OLED TV from LG, Sony, and Samsung.',
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
    href: '/articles/lg_c4_oled',
    image: '/images/item.png',
    summary: 'LG\'s best all-around OLED with a new MLA panel, incredible picture quality, 4 HDMI 2.1 ports, and top gaming features including G-Sync and FreeSync.',
    score: 9.4,
    price: '$1,299',
    badge: 'best-overall' as const,
    specs: { Panel: 'OLED evo (MLA)', Resolution: '4K UHD', HDR: 'Dolby Vision IQ, HDR10', 'Refresh Rate': '120Hz', Size: '48"–83"' },
  },
  {
    rank: 2,
    name: 'Sony A95L QD-OLED',
    href: '/articles/sony_a95l_qd_oled',
    image: '/images/item.png',
    summary: 'The absolute best picture quality you can buy with Sony\'s Cognitive Processor XR, QD-OLED panel, and exceptional color volume and brightness.',
    score: 9.5,
    price: '$2,499',
    badge: 'best-value' as const,
    specs: { Panel: 'QD-OLED', Resolution: '4K UHD', HDR: 'Dolby Vision, HDR10', 'Refresh Rate': '120Hz', Size: '55"–77"' },
  },
  {
    rank: 3,
    name: 'Samsung S90D QD-OLED',
    href: '/articles/samsung_s90d_qd_oled',
    image: '/images/item.png',
    summary: 'Outstanding QD-OLED performance at a more accessible price with excellent brightness, color, and Samsung\'s excellent gaming features.',
    score: 9.1,
    price: '$1,099',
    badge: 'budget-pick' as const,
    specs: { Panel: 'QD-OLED', Resolution: '4K UHD', HDR: 'HDR10+, HDR10', 'Refresh Rate': '144Hz', Size: '55"–77"' },
  },
  {
    rank: 4,
    name: 'LG B4 OLED',
    href: '/articles/lg_b4_oled',
    image: '/images/item.png',
    summary: 'Entry-level OLED that still delivers the core OLED benefits — perfect blacks, infinite contrast, and a wide color gamut — at a great price.',
    score: 9.0,
    price: '$899',
    specs: { Panel: 'OLED', Resolution: '4K UHD', HDR: 'Dolby Vision IQ, HDR10', 'Refresh Rate': '120Hz', Size: '55"–77"' },
  },
];

const quickPicks = [
  { label: 'Best Overall', name: 'LG C4 OLED', href: '/articles/lg_c4_oled', score: 9.4, price: '$1,299' },
  { label: 'Best Picture', name: 'Sony A95L QD-OLED', href: '/articles/sony_a95l_qd_oled', score: 9.5, price: '$2,499' },
  { label: 'Budget Pick', name: 'Samsung S90D', href: '/articles/samsung_s90d_qd_oled', score: 9.1, price: '$1,099' },
];

export default function BestOLEDTVsPage() {
  return (
    <div className="min-h-screen bg-neutral-50">
      <Breadcrumb items={[
        { label: 'Home', href: '/' },
        { label: 'Best Of', href: '/best' },
        { label: 'TVs', href: '/best/tvs' },
        { label: 'Best OLED TVs' },
      ]} />

      <div className="bg-gradient-to-br from-primary to-primary-dark px-6 py-10 text-white">
        <div className="mx-auto max-w-content">
          <SectionLabel className="text-white/70">Buying Guide</SectionLabel>
          <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">Best OLED TVs 2025</h1>
          <p className="mt-2 max-w-2xl text-base text-white/80">
            Top OLED TVs tested with calibrated measurements for perfect black levels, color accuracy, and HDR performance. Find the best OLED for your home.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {['Calibrated Measurements', 'Perfect Black Levels', 'Gaming Latency Tested'].map((tag) => (
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
              <h2 className="mb-4 text-lg font-bold text-neutral-900">OLED vs QD-OLED: Which Is Better?</h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {[
                  { title: 'Traditional OLED (LG/Sony)', items: ['Perfect black levels and infinite contrast', 'Excellent viewing angles', 'Lower peak brightness than QD-OLED', 'Great for dark rooms and movie watching', 'More affordable at larger sizes'] },
                  { title: 'QD-OLED (Samsung/Sony)', items: ['Brighter peak brightness for HDR highlights', 'More saturated, vibrant colors', 'Better for bright rooms than traditional OLED', 'Premium pricing for top models', 'Available in fewer size options'] },
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
                <li><Link href="/best/tvs/best-4k-tvs" className="text-neutral-700 hover:text-primary hover:underline">Best 4K TVs</Link></li>
                <li><Link href="/best/tvs/best-gaming-tvs" className="text-neutral-700 hover:text-primary hover:underline">Best Gaming TVs</Link></li>
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
