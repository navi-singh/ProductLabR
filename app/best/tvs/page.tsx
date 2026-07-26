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
    href: '/articles/lg_c4_oled',
    image: '/images/item.png',
    summary: 'Stunning OLED picture quality with perfect blacks, near-infinite contrast, and class-leading gaming features with 4x HDMI 2.1.',
    score: 9.4,
    price: '$1,299',
    badge: 'best-overall' as const,
    specs: { Panel: 'WOLED evo', Resolution: '4K', HDR: 'Dolby Vision IQ', 'Refresh Rate': '120Hz', Size: '48"–97"' },
  },
  {
    rank: 2,
    name: 'Sony A95L QD-OLED',
    href: '/articles/sony_a95l_qd_oled',
    image: '/images/item.png',
    summary: "Sony's QD-OLED flagship delivers the best color volume available on any consumer TV — quantum dot brightness meets OLED perfect blacks for the ultimate picture quality.",
    score: 9.3,
    price: '$2,499',
    badge: 'best-value' as const,
    specs: { Panel: 'QD-OLED', Resolution: '4K', HDR: 'Dolby Vision, HDR10', 'Refresh Rate': '120Hz', Size: '55"–77"' },
  },
  {
    rank: 3,
    name: 'Sony Bravia 9',
    href: '/articles/sony_bravia_9',
    image: '/images/item.png',
    summary: "Sony's flagship Mini-LED TV with Cognitive Processor XR, Bravia Acoustic Multi-Audio panel speaker system, and best-in-class PS5 integration.",
    score: 9.3,
    price: '$2,499',
    specs: { Panel: 'Mini-LED', Resolution: '4K', HDR: 'Dolby Vision, HDR10', 'Refresh Rate': '120Hz', Size: '65"–85"' },
  },
  {
    rank: 4,
    name: 'Samsung S90D QD-OLED',
    href: '/articles/samsung_s90d_qd_oled',
    image: '/images/item.png',
    summary: 'Outstanding QD-OLED picture at a more accessible price with excellent brightness, 144Hz gaming, and Samsung\'s comprehensive gaming features.',
    score: 9.1,
    price: '$1,399',
    specs: { Panel: 'QD-OLED', Resolution: '4K', HDR: 'HDR10+, HDR10', 'Refresh Rate': '144Hz', Size: '55"–77"' },
  },
  {
    rank: 5,
    name: 'TCL QM8',
    href: '/articles/tcl_qm8',
    image: '/images/item.png',
    summary: '5,000-zone Mini-LED backlighting and 2,000 nits peak brightness at $749 — the most compelling value proposition in televisions in 2024.',
    score: 9.0,
    price: '$749',
    specs: { Panel: 'Mini-LED QLED', Resolution: '4K', HDR: 'Dolby Vision IQ, HDR10+', 'Refresh Rate': '144Hz', Size: '55"–85"' },
  },
  {
    rank: 6,
    name: 'Samsung QN90C Neo QLED',
    href: '/articles/samsung_qn90c',
    image: '/images/item.png',
    summary: 'Exceptional brightness and detail with Mini-LED backlighting, making it ideal for bright rooms and competitive gaming.',
    score: 8.9,
    price: '$1,299',
    specs: { Panel: 'Neo QLED', Resolution: '4K', HDR: 'HDR10+', 'Refresh Rate': '144Hz', Size: '43"–98"' },
  },
  {
    rank: 7,
    name: 'Hisense U8K',
    href: '/articles/hisense_u8k',
    image: '/images/item.png',
    summary: 'Incredible value with Mini-LED panel, high peak brightness, and solid gaming specs at a fraction of premium TV prices.',
    score: 8.9,
    price: '$699',
    specs: { Panel: 'Mini-LED ULED', Resolution: '4K', HDR: 'Dolby Vision', 'Refresh Rate': '144Hz', Size: '55"–85"' },
  },
  {
    rank: 8,
    name: 'LG B4 OLED',
    href: '/articles/lg_b4_oled',
    image: '/images/item.png',
    summary: 'The most affordable way to own a true OLED TV — perfect blacks, infinite contrast, and excellent picture quality without the C4 premium price.',
    score: 8.9,
    price: '$899',
    specs: { Panel: 'WOLED', Resolution: '4K', HDR: 'Dolby Vision IQ, HDR10', 'Refresh Rate': '120Hz', Size: '55"–77"' },
  },
  {
    rank: 9,
    name: 'Samsung QN85D Neo QLED',
    href: '/articles/samsung_qn85d',
    image: '/images/item.png',
    summary: 'Samsung\'s Mini-LED sweet spot — Quantum Matrix Technology, 144Hz gaming, and an optional matte anti-reflection finish at a price that undercuts the flagship QN90D.',
    score: 8.9,
    price: '$1,099',
    specs: { Panel: 'Neo QLED', Resolution: '4K', HDR: 'HDR10+', 'Refresh Rate': '144Hz', Size: '55"–98"' },
  },
  {
    rank: 10,
    name: 'Sony X90L',
    href: '/articles/sony_x90l',
    image: '/images/item.png',
    summary: "Sony's accessible premium — Cognitive Processor XR picture quality, full PS5 integration, and Dolby Vision at $1,099.",
    score: 8.7,
    price: '$1,099',
    specs: { Panel: 'Full-Array LED', Resolution: '4K', HDR: 'Dolby Vision, HDR10', 'Refresh Rate': '120Hz', Size: '55"–85"' },
  },
  {
    rank: 11,
    name: 'Hisense U7N',
    href: '/articles/hisense_u7n',
    image: '/images/item.png',
    summary: 'The best TV under $600 — Mini-LED ULED with 1,500 nits, 144Hz, three HDMI 2.1 ports, Dolby Vision IQ, and Google TV at an extraordinary price.',
    score: 8.7,
    price: '$549',
    specs: { Panel: 'Mini-LED ULED', Resolution: '4K', HDR: 'Dolby Vision IQ, HDR10+', 'Refresh Rate': '144Hz', Size: '55"–85"' },
  },
  {
    rank: 12,
    name: 'Vizio P-Series Quantum X',
    href: '/articles/vizio_p_series_quantum_x',
    image: '/images/item.png',
    summary: '3,000 nits peak brightness, 792 local dimming zones, and all four HDMI 2.1 ports at $799 — the raw display performance leader at this price.',
    score: 8.7,
    price: '$799',
    specs: { Panel: 'Full-Array QLED', Resolution: '4K', HDR: 'Dolby Vision, HDR10+', 'Refresh Rate': '120Hz', Size: '65"–85"' },
  },
  {
    rank: 13,
    name: 'LG QNED90',
    href: '/articles/lg_qned90',
    image: '/images/item.png',
    summary: 'Four HDMI 2.1 ports, 144Hz, and webOS 24 at $699 — the most gaming-capable TV under $750 and the best way to get LG\'s platform without OLED prices.',
    score: 8.6,
    price: '$699',
    specs: { Panel: 'QNED Mini-LED', Resolution: '4K', HDR: 'Dolby Vision IQ, HDR10', 'Refresh Rate': '144Hz', Size: '55"–86"' },
  },
  {
    rank: 14,
    name: 'Samsung The Frame 2024',
    href: '/articles/samsung_the_frame_2024',
    image: '/images/item.png',
    summary: 'Art Mode displays museum-quality artwork when not watching — a nearly flush wall mount and customizable bezels make this the only TV designed as room décor.',
    score: 8.5,
    price: '$999',
    specs: { Panel: 'QLED', Resolution: '4K', HDR: 'HDR10+', 'Refresh Rate': '120Hz', Size: '32"–85"' },
  },
  {
    rank: 15,
    name: 'TCL S5 2024',
    href: '/articles/tcl_s5_2024',
    image: '/images/item.png',
    summary: 'Google TV and Dolby Vision at $299 — the best entry-level 4K TV for bedrooms, guest rooms, and anyone who needs a solid smart TV on a strict budget.',
    score: 8.2,
    price: '$299',
    badge: 'budget-pick' as const,
    specs: { Panel: 'Direct LED', Resolution: '4K', HDR: 'Dolby Vision, HDR10', 'Refresh Rate': '60Hz', Size: '43"–65"' },
  },
];

const quickPicks = [
  { label: 'Best Overall', name: 'LG C4 OLED', href: '/articles/lg_c4_oled', score: 9.4, price: '$1,299' },
  { label: 'Best Value', name: 'TCL QM8', href: '/articles/tcl_qm8', score: 9.0, price: '$749' },
  { label: 'Budget Pick', name: 'TCL S5 2024', href: '/articles/tcl_s5_2024', score: 8.2, price: '$299' },
];

const categoryLinks = [
  { href: '/best/tvs/top-5-oled-tvs', label: 'Top 5 OLED TVs', count: 5 },
  { href: '/best/tvs/top-5-budget-tvs', label: 'Top 5 Budget TVs', count: 5 },
  { href: '/best/tvs/best-gaming-tvs', label: 'Best Gaming TVs', count: 6 },
  { href: '/best/tvs/best-4k-tvs', label: 'Best 4K TVs', count: 10 },
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
