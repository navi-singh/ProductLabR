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
  title: 'Best Hybrid Cameras Under $3,000 2025 - Expert Reviews',
  description: 'Professional photo and video performance without breaking the bank. Expert tested hybrid cameras under $3,000.',
};

interface CamEntry {
  rank: number; name: string; href: string; image: string; summary: string;
  score: number; price: string; badge?: 'best-overall' | 'best-value' | 'budget-pick';
  specs?: Record<string, string>;
}

const cameras: CamEntry[] = [
  {
    rank: 1,
    name: 'Sony A7 IV',
    href: '/articles/sony_a7_iv',
    image: '/images/item.png',
    summary: 'Balanced photo/video performance with excellent value proposition and reliable Real-time Eye AF.',
    score: 9.0,
    price: '$2,498',
    badge: 'best-overall' as const,
    specs: { Sensor: '33MP Full-Frame', Video: '4K 60p', AF: 'Real-time Eye', IBIS: '5.5-stop' },
  },
  {
    rank: 2,
    name: 'Nikon Z6 III',
    href: '/articles/nikon_z6_iii',
    image: '/images/item.png',
    summary: 'Excellent hybrid specifications with 6K internal recording and outstanding 8-stop stabilization.',
    score: 8.9,
    price: '$2,499',
    badge: 'best-value' as const,
    specs: { Sensor: '24.5MP Full-Frame', Video: '6K 60p', AF: '273-point', IBIS: '8-stop' },
  },
  {
    rank: 3,
    name: 'Canon EOS R6 Mark II',
    href: '/articles/canon_r6_mark_ii',
    image: '/images/item.png',
    summary: 'Excellent autofocus performance with great low-light capabilities and professional video features.',
    score: 8.8,
    price: '$2,499',
    badge: 'budget-pick' as const,
    specs: { Sensor: '24.2MP Full-Frame', Video: '4K 60p', AF: 'Dual Pixel II', IBIS: '8-stop' },
  },
  {
    rank: 4,
    name: 'Panasonic Lumix S5 II',
    href: '/articles/lumix_s5_ii',
    image: '/images/item.png',
    summary: '6K video recording with excellent stabilization and full-frame sensor at an approachable price.',
    score: 8.6,
    price: '$1,999',
    specs: { Sensor: '24.2MP Full-Frame', Video: '6K', AF: 'Phase Detection', IBIS: 'Yes' },
  },
  {
    rank: 5,
    name: 'Panasonic Lumix S1 II',
    href: '/articles/panasonic_lumix_s1_ii',
    image: '/images/item.png',
    summary: 'High-quality 8K video in a versatile single body solution for video-focused creators.',
    score: 8.5,
    price: '$2,799',
    specs: { Sensor: '24.2MP Full-Frame', Video: '8K 30p', AF: 'DFD', IBIS: '6.5-stop' },
  },
];

const quickPicks = [
  { label: 'Best Overall', name: 'Sony A7 IV', href: '/articles/sony_a7_iv', score: 9.0, price: '$2,498' },
  { label: 'Best Value', name: 'Nikon Z6 III', href: '/articles/nikon_z6_iii', score: 8.9, price: '$2,499' },
  { label: 'Budget Pick', name: 'Panasonic S5 II', href: '/articles/lumix_s5_ii', score: 8.6, price: '$1,999' },
];

export default function BestHybridCamerasUnder3000() {
  return (
    <div className="min-h-screen bg-neutral-50">
      <Breadcrumb items={[
        { label: 'Home', href: '/' },
        { label: 'Best Of', href: '/best' },
        { label: 'Cameras', href: '/best/cameras' },
        { label: 'Hybrid Under $3,000' },
      ]} />

      <div className="bg-gradient-to-br from-primary to-primary-dark px-6 py-10 text-white">
        <div className="mx-auto max-w-content">
          <SectionLabel className="text-white/70">Buying Guide</SectionLabel>
          <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">Best Hybrid Cameras Under $3,000</h1>
          <p className="mt-2 max-w-2xl text-base text-white/80">
            Professional photo and video performance without breaking the bank. Each model offers professional features and outstanding capabilities under $3,000.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {['Budget-Friendly', '4K/6K Video', 'Full-Frame Sensors'].map((tag) => (
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
                {cameras.map((cam, i) => (
                  <div key={cam.rank}>
                    <RankedProductCard {...cam} />
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
              <h2 className="mb-4 text-lg font-bold text-neutral-900">Budget Hybrid Camera Guide</h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {[
                  { title: 'What to Look For Under $3,000', items: ['4K video recording at minimum', 'Full-frame sensor for better low-light', 'In-body image stabilization', 'Reliable autofocus system', 'Good battery life for extended shooting'] },
                  { title: 'Budget Considerations', items: ['Factor in lens costs for new systems', 'Consider used/refurbished options', 'Look for bundle deals with accessories', 'Check for seasonal sales and promotions', 'Evaluate upgrade path for future needs'] },
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
                {cameras.map((cam) => (
                  <li key={cam.href}>
                    <Link href={cam.href} className="flex items-center gap-2 text-neutral-600 hover:text-primary">
                      <span className="text-[10px] text-neutral-400">#{cam.rank}</span>
                      {cam.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-xl bg-gradient-to-br from-primary-lightest to-primary-light/20 p-4">
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-primary">Related Guides</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/best/cameras" className="text-neutral-700 hover:text-primary hover:underline">All Cameras</Link></li>
                <li><Link href="/best/cameras/hybrid-cameras" className="text-neutral-700 hover:text-primary hover:underline">Best Hybrid Cameras</Link></li>
                <li><Link href="/best/cameras/professional-cameras" className="text-neutral-700 hover:text-primary hover:underline">Professional Cameras</Link></li>
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
