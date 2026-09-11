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
  alternates: { canonical: '/best/tvs/top-5-budget-tvs' },
  title: 'Top 5 Budget TVs 2025 - Best TVs Under $800',
  description: 'The best budget TVs under $800 for 2025. Expert-tested 4K televisions that deliver maximum performance per dollar from TCL, Hisense, and Vizio.',
};

interface TVEntry {
  rank: number; name: string; href: string; image?: string; summary: string;
  score: number; price: string; badge?: 'best-overall' | 'best-value' | 'budget-pick';
  specs?: Record<string, string>;
}

const tvs: TVEntry[] = [
  {
    rank: 1,
    name: 'Hisense U8K',
    href: '/articles/hisense_u8k',
    summary: 'The best TV under $700 — Mini-LED panel with outstanding brightness, solid local dimming, 144Hz gaming, and Google TV at a price that embarrasses premium competitors.',
    score: 8.9,
    price: '$699',
    badge: 'best-overall' as const,
    specs: { Panel: 'Mini-LED ULED', Resolution: '4K UHD', HDR: 'Dolby Vision, HDR10', 'Refresh Rate': '144Hz', Size: '55"–85"' },
  },
  {
    rank: 2,
    name: 'TCL QM8',
    href: '/articles/tcl_qm8',
    summary: '5,000-zone Mini-LED backlighting and 2,000 nits peak brightness at $749 makes the QM8 the best value in television — specifications that rivaled flagship TVs just two years ago.',
    score: 9.0,
    price: '$749',
    badge: 'best-value' as const,
    specs: { Panel: 'Mini-LED QLED', Resolution: '4K UHD', HDR: 'Dolby Vision IQ, HDR10+', 'Refresh Rate': '144Hz', Size: '55"–85"' },
  },
  {
    rank: 3,
    name: 'Hisense U7N',
    href: '/articles/hisense_u7n',
    summary: 'Mini-LED brightness and Google TV at $549 — the U7N delivers 1,500 nits, three HDMI 2.1 ports, and 144Hz for first-time 4K TV buyers or households with strict budgets.',
    score: 8.7,
    price: '$549',
    specs: { Panel: 'Mini-LED ULED', Resolution: '4K UHD', HDR: 'Dolby Vision IQ, HDR10+', 'Refresh Rate': '144Hz', Size: '55"–85"' },
  },
  {
    rank: 4,
    name: 'Vizio P-Series Quantum X',
    href: '/articles/vizio_p_series_quantum_x',
    summary: 'A 65-inch panel with 3,000 nits peak brightness and all four HDMI 2.1 ports for $799 — the Vizio Quantum X is the raw display performance leader at this price point.',
    score: 8.7,
    price: '$799',
    specs: { Panel: 'Full-Array QLED', Resolution: '4K UHD', HDR: 'Dolby Vision, HDR10+', 'Refresh Rate': '120Hz', Size: '65"–85"' },
  },
  {
    rank: 5,
    name: 'TCL S5 2024',
    href: '/articles/tcl_s5_2024',
    summary: 'Google TV and Dolby Vision at $299 — the TCL S5 is the definitive recommendation for bedrooms, guest rooms, and households that need a capable 4K TV on a tight budget.',
    score: 8.2,
    price: '$299',
    badge: 'budget-pick' as const,
    specs: { Panel: 'Direct LED', Resolution: '4K UHD', HDR: 'Dolby Vision, HDR10', 'Refresh Rate': '60Hz', Size: '43"–65"' },
  },
];

const quickPicks = [
  { label: 'Best Overall', name: 'Hisense U8K', href: '/articles/hisense_u8k', score: 8.9, price: '$699' },
  { label: 'Best Value', name: 'TCL QM8', href: '/articles/tcl_qm8', score: 9.0, price: '$749' },
  { label: 'Budget Pick', name: 'TCL S5 2024', href: '/articles/tcl_s5_2024', score: 8.2, price: '$299' },
];

const relatedGuides = [
  { href: '/best/tvs', label: 'All Best TVs' },
  { href: '/best/tvs/top-5-oled-tvs', label: 'Top 5 OLED TVs' },
  { href: '/best/tvs/best-gaming-tvs', label: 'Best Gaming TVs' },
];

export default function Top5BudgetTVsPage() {
  return (
    <div className="min-h-screen bg-neutral-50">
      <Breadcrumb items={[
        { label: 'Home', href: '/' },
        { label: 'Best Of', href: '/best' },
        { label: 'TVs', href: '/best/tvs' },
        { label: 'Top 5 Budget TVs' },
      ]} />

      <div className="bg-gradient-to-br from-primary to-primary-dark px-6 py-10 text-white">
        <div className="mx-auto max-w-content">
          <SectionLabel className="text-white/70">Buying Guide</SectionLabel>
          <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">Top 5 Budget TVs 2025</h1>
          <p className="mt-2 max-w-2xl text-base text-white/80">
            The best TVs under $800 — expert-tested 4K televisions that maximize picture quality, smart features, and gaming performance per dollar. No compromises where it counts.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {['Under $800', 'Mini-LED Picks', 'Google TV Included'].map((tag) => (
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
              <h2 className="mb-4 text-lg font-bold text-neutral-900">What to Look for in a Budget TV</h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {[
                  {
                    title: 'Panel Technology',
                    desc: 'Mini-LED local dimming is the biggest quality upgrade available in budget TVs — it separates bright highlights from dark areas far better than direct LED without local dimming.',
                  },
                  {
                    title: 'Smart Platform',
                    desc: 'Google TV offers the widest app library and best voice control. Roku OS is reliable and simple. Avoid proprietary platforms with limited app support and slow updates.',
                  },
                  {
                    title: 'Gaming Specs',
                    desc: 'If gaming matters, prioritize HDMI 2.1 ports and 120Hz panels. VRR support for adaptive sync is a nice addition. 60Hz panels are adequate for casual gaming only.',
                  },
                ].map((item) => (
                  <div key={item.title}>
                    <h3 className="mb-1 text-sm font-semibold text-primary">{item.title}</h3>
                    <p className="text-xs leading-relaxed text-neutral-600">{item.desc}</p>
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
                {relatedGuides.map((guide) => (
                  <li key={guide.href}>
                    <Link href={guide.href} className="text-neutral-700 hover:text-primary hover:underline">{guide.label}</Link>
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
