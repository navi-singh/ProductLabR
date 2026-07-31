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
  alternates: { canonical: '/best/tvs/top-5-oled-tvs' },
  title: 'Top 5 OLED TVs 2025 - Best OLED Televisions Ranked',
  description: 'The top 5 OLED TVs for 2025. Expert-tested LG, Sony, and Samsung OLED panels ranked by picture quality, gaming performance, and value.',
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
    summary: 'The definitive OLED TV for most buyers — perfect blacks, near-infinite contrast, all four HDMI 2.1 ports, and ~1.2ms input lag make it the benchmark for every competing television.',
    score: 9.4,
    price: '$1,299',
    badge: 'best-overall' as const,
    specs: { Panel: 'WOLED evo', Resolution: '4K UHD', HDR: 'Dolby Vision IQ, HDR10', 'Refresh Rate': '120Hz', Size: '48"–97"' },
  },
  {
    rank: 2,
    name: 'Sony A95L QD-OLED',
    href: '/articles/sony_a95l_qd_oled',
    image: '/images/item.png',
    summary: "Sony's QD-OLED flagship combines perfect OLED blacks with quantum dot brightness for the best color volume available on any consumer display — the pinnacle of TV picture quality.",
    score: 9.3,
    price: '$2,499',
    badge: 'best-value' as const,
    specs: { Panel: 'QD-OLED', Resolution: '4K UHD', HDR: 'Dolby Vision, HDR10', 'Refresh Rate': '120Hz', Size: '55"–77"' },
  },
  {
    rank: 3,
    name: 'Samsung S90D QD-OLED',
    href: '/articles/samsung_s90d_qd_oled',
    image: '/images/item.png',
    summary: 'QD-OLED performance at a more accessible price — Samsung combines its QD-OLED panel with the best gaming features in the industry, including 144Hz and comprehensive VRR support.',
    score: 9.1,
    price: '$1,399',
    specs: { Panel: 'QD-OLED', Resolution: '4K UHD', HDR: 'HDR10+, HDR10', 'Refresh Rate': '144Hz', Size: '55"–77"' },
  },
  {
    rank: 4,
    name: 'LG B4 OLED',
    href: '/articles/lg_b4_oled',
    image: '/images/item.png',
    summary: 'The most affordable way to own a true OLED TV — perfect blacks, infinite contrast, and excellent picture quality without the premium price of the C4 or G4 series.',
    score: 8.9,
    price: '$899',
    specs: { Panel: 'WOLED', Resolution: '4K UHD', HDR: 'Dolby Vision IQ, HDR10', 'Refresh Rate': '120Hz', Size: '55"–77"' },
  },
  {
    rank: 5,
    name: 'Sony X90L',
    href: '/articles/sony_x90l',
    image: '/images/item.png',
    summary: "Sony's upper-mid-range LED TV delivers excellent picture processing, PS5 integration, and Dolby Vision at a price point that makes it the most accessible premium Sony.",
    score: 8.7,
    price: '$1,099',
    specs: { Panel: 'Full-Array LED', Resolution: '4K UHD', HDR: 'Dolby Vision, HDR10', 'Refresh Rate': '120Hz', Size: '55"–85"' },
  },
];

const quickPicks = [
  { label: 'Best Overall', name: 'LG C4 OLED', href: '/articles/lg_c4_oled', score: 9.4, price: '$1,299' },
  { label: 'Best Picture', name: 'Sony A95L QD-OLED', href: '/articles/sony_a95l_qd_oled', score: 9.3, price: '$2,499' },
  { label: 'Budget Pick', name: 'LG B4 OLED', href: '/articles/lg_b4_oled', score: 8.9, price: '$899' },
];

const relatedGuides = [
  { href: '/best/tvs', label: 'All Best TVs' },
  { href: '/best/tvs/top-5-budget-tvs', label: 'Top 5 Budget TVs' },
  { href: '/best/tvs/best-gaming-tvs', label: 'Best Gaming TVs' },
];

export default function Top5OLEDTVsPage() {
  return (
    <div className="min-h-screen bg-neutral-50">
      <Breadcrumb items={[
        { label: 'Home', href: '/' },
        { label: 'Best Of', href: '/best' },
        { label: 'TVs', href: '/best/tvs' },
        { label: 'Top 5 OLED TVs' },
      ]} />

      <div className="bg-gradient-to-br from-primary to-primary-dark px-6 py-10 text-white">
        <div className="mx-auto max-w-content">
          <SectionLabel className="text-white/70">Buying Guide</SectionLabel>
          <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">Top 5 OLED TVs 2025</h1>
          <p className="mt-2 max-w-2xl text-base text-white/80">
            The best OLED televisions for perfect black levels, infinite contrast, and cinematic picture quality. Expert-tested and ranked for home theater, gaming, and everyday viewing.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {['Perfect Black Levels', 'Infinite Contrast', 'True 4K HDR'].map((tag) => (
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
              <h2 className="mb-4 text-lg font-bold text-neutral-900">OLED vs QD-OLED: Which Technology Wins?</h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {[
                  {
                    title: 'Traditional OLED (LG WOLED)',
                    items: [
                      'Perfect black levels with pixel-level off switching',
                      'Infinite contrast ratio in all content types',
                      'Excellent viewing angles with minimal off-axis shift',
                      'Lower peak brightness — ideal for dark rooms',
                      'Available in larger sizes (up to 97") at lower cost',
                    ],
                  },
                  {
                    title: 'QD-OLED (Samsung / Sony)',
                    items: [
                      'Higher peak brightness than traditional OLED',
                      'Superior color volume — wider gamut at high brightness',
                      'Better performance in partially-lit rooms',
                      'More saturated, vibrant color rendering',
                      'Premium pricing and limited to 55"–77" sizes',
                    ],
                  },
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
