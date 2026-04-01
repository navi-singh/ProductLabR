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
  title: 'Best Wireless Earbuds 2025 - Expert Reviews',
  description: 'Top wireless earbuds tested for sound quality, ANC, battery life, and comfort. Find the best true wireless earbuds for any budget.',
};

interface EarbudEntry {
  rank: number; name: string; href: string; image: string; summary: string;
  score: number; price: string; badge?: 'best-overall' | 'best-value' | 'budget-pick';
  specs?: Record<string, string>;
}

const earbuds: EarbudEntry[] = [
  {
    rank: 1,
    name: 'Sony WF-1000XM5',
    href: '/best/headphones/best-wireless-earbuds',
    image: '/images/item.png',
    summary: 'The best true wireless earbuds overall with industry-leading ANC, hi-res audio support via LDAC, and a dramatic redesign with a smaller, more comfortable fit.',
    score: 9.3,
    price: '$279',
    badge: 'best-overall' as const,
    specs: { Driver: '8.4mm', ANC: 'Industry-leading', Battery: '8hr + 24hr case', 'Water Resistance': 'IPX4', Codec: 'LDAC, AAC, SBC' },
  },
  {
    rank: 2,
    name: 'Apple AirPods Pro 2',
    href: '/best/headphones/best-wireless-earbuds',
    image: '/images/item.png',
    summary: 'Best earbuds for iPhone users with best-in-class ANC, Transparency mode, personalized spatial audio, and seamless Apple ecosystem integration.',
    score: 9.2,
    price: '$249',
    badge: 'best-value' as const,
    specs: { Driver: 'Custom Apple', ANC: 'Adaptive', Battery: '6hr + 30hr case', 'Water Resistance': 'IPX4', Codec: 'AAC, SBC' },
  },
  {
    rank: 3,
    name: 'Nothing Ear (2)',
    href: '/best/headphones/best-wireless-earbuds',
    image: '/images/item.png',
    summary: 'Distinctive transparent design with surprisingly strong ANC, hi-res audio support, and excellent sound quality at a mid-range price.',
    score: 8.7,
    price: '$149',
    badge: 'budget-pick' as const,
    specs: { Driver: '11.6mm', ANC: 'Adaptive', Battery: '6hr + 30hr case', 'Water Resistance': 'IP54', Codec: 'LHDC 5.0, AAC' },
  },
  {
    rank: 4,
    name: 'Samsung Galaxy Buds3 Pro',
    href: '/best/headphones/best-wireless-earbuds',
    image: '/images/item.png',
    summary: 'Redesigned blade-style fit with strong ANC, intelligent ambient mode, and excellent integration with Samsung Galaxy devices.',
    score: 8.8,
    price: '$249',
    specs: { Driver: '10mm + 5.3mm', ANC: 'Intelligent', Battery: '6hr + 24hr case', 'Water Resistance': 'IPX7', Codec: 'SSC UHQ, AAC' },
  },
];

const quickPicks = [
  { label: 'Best Overall', name: 'Sony WF-1000XM5', href: '/best/headphones/best-wireless-earbuds', score: 9.3, price: '$279' },
  { label: 'Best for iPhone', name: 'Apple AirPods Pro 2', href: '/best/headphones/best-wireless-earbuds', score: 9.2, price: '$249' },
  { label: 'Budget Pick', name: 'Nothing Ear (2)', href: '/best/headphones/best-wireless-earbuds', score: 8.7, price: '$149' },
];

export default function BestWirelessEarbudsPage() {
  return (
    <div className="min-h-screen bg-neutral-50">
      <Breadcrumb items={[
        { label: 'Home', href: '/' },
        { label: 'Best Of', href: '/best' },
        { label: 'Headphones', href: '/best/headphones' },
        { label: 'Best Wireless Earbuds' },
      ]} />

      <div className="bg-gradient-to-br from-primary to-primary-dark px-6 py-10 text-white">
        <div className="mx-auto max-w-content">
          <SectionLabel className="text-white/70">Buying Guide</SectionLabel>
          <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">Best Wireless Earbuds 2025</h1>
          <p className="mt-2 max-w-2xl text-base text-white/80">
            Top true wireless earbuds tested extensively for sound quality, ANC effectiveness, battery life, and comfort for all-day wear.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {['ANC Performance Measured', 'Sound Quality Rated', 'Battery Life Tested'].map((tag) => (
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
                {earbuds.map((earbud, i) => (
                  <div key={earbud.rank}>
                    <RankedProductCard {...earbud} />
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
              <h2 className="mb-4 text-lg font-bold text-neutral-900">How We Test Wireless Earbuds</h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {[
                  { title: 'What to Look For', items: ['ANC quality in office, plane, and street environments', 'Sound signature: balanced vs bass-heavy vs bright', 'Eartip fit and long-wear comfort', 'Codec support: LDAC for hi-res, AAC for iPhone', 'Water resistance rating for workouts'] },
                  { title: 'Battery Life Reality', items: ['Manufacturer claims vs real-world usage', 'ANC-on vs ANC-off battery difference', 'Case charging speed matters too', 'Wireless charging case is worth the premium', 'Fast charge: 10 min = 1–2 hour top-up'] },
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
                {earbuds.map((earbud) => (
                  <li key={earbud.rank}>
                    <Link href={earbud.href} className="flex items-center gap-2 text-neutral-600 hover:text-primary">
                      <span className="text-[10px] text-neutral-400">#{earbud.rank}</span>
                      {earbud.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-xl bg-gradient-to-br from-primary-lightest to-primary-light/20 p-4">
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-primary">Related Guides</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/best/headphones" className="text-neutral-700 hover:text-primary hover:underline">All Headphones</Link></li>
                <li><Link href="/best/headphones/best-noise-cancelling-headphones" className="text-neutral-700 hover:text-primary hover:underline">Best Noise-Cancelling</Link></li>
                <li><Link href="/best/headphones/best-gaming-headsets" className="text-neutral-700 hover:text-primary hover:underline">Best Gaming Headsets</Link></li>
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
