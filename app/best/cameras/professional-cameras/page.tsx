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
  title: 'Best Professional Cameras 2025 - Expert Reviews',
  description: 'Flagship cameras delivering ultimate performance for professional photographers and videographers.',
};

interface CamEntry {
  rank: number; name: string; href: string; image: string; summary: string;
  score: number; price: string; badge?: 'best-overall' | 'best-value' | 'budget-pick';
  specs?: Record<string, string>;
}

const cameras: CamEntry[] = [
  {
    rank: 1,
    name: 'Nikon Z9',
    href: '/articles/nikon_z9',
    image: '/images/item.png',
    summary: 'Flagship hybrid performance with rugged professional build and excellent 8K video quality.',
    score: 9.6,
    price: '$5,496',
    badge: 'best-overall' as const,
    specs: { Sensor: '45.7MP Full-Frame', Video: '8K 60p', Build: 'Rugged Pro', Form: 'Flagship' },
  },
  {
    rank: 2,
    name: 'Sony A1 II',
    href: '/articles/sony_a1_ii',
    image: '/images/item.png',
    summary: 'High-resolution 50MP sensor with exceptional speed and performance, plus advanced AI autofocus.',
    score: 9.4,
    price: '$6,499',
    badge: 'best-value' as const,
    specs: { Sensor: '50MP Full-Frame', Video: '8K 30p', AF: 'AI recognition', Speed: 'Elite' },
  },
  {
    rank: 3,
    name: 'Canon EOS R5 Mark II',
    href: '/articles/canon_eos_r5_mark_ii',
    image: '/images/item.png',
    summary: 'Outstanding hybrid performance with advanced autofocus including Eye Control and professional build.',
    score: 9.5,
    price: '$4,299',
    badge: 'budget-pick' as const,
    specs: { Sensor: '45MP Full-Frame', Video: '8K 30p', AF: 'Eye Control', IBIS: '8.5-stop' },
  },
  {
    rank: 4,
    name: 'Fujifilm GFX100 II',
    href: '/articles/fujifilm_gfx100_ii',
    image: '/images/item.png',
    summary: 'Medium-format excellence with 102MP incredible resolution and 8K video capability.',
    score: 9.3,
    price: '$7,499',
    specs: { Sensor: '102MP Medium Format', Video: '8K 30p', IBIS: '8-stop', Format: 'Medium Format' },
  },
];

const quickPicks = [
  { label: 'Best Overall', name: 'Nikon Z9', href: '/articles/nikon_z9', score: 9.6, price: '$5,496' },
  { label: 'Best Value', name: 'Canon R5 Mark II', href: '/articles/canon_eos_r5_mark_ii', score: 9.5, price: '$4,299' },
  { label: 'Highest Res', name: 'Fujifilm GFX100 II', href: '/articles/fujifilm_gfx100_ii', score: 9.3, price: '$7,499' },
];

export default function BestProfessionalCameras() {
  return (
    <div className="min-h-screen bg-neutral-50">
      <Breadcrumb items={[
        { label: 'Home', href: '/' },
        { label: 'Best Of', href: '/best' },
        { label: 'Cameras', href: '/best/cameras' },
        { label: 'Professional Cameras' },
      ]} />

      <div className="bg-gradient-to-br from-primary to-primary-dark px-6 py-10 text-white">
        <div className="mx-auto max-w-content">
          <SectionLabel className="text-white/70">Buying Guide</SectionLabel>
          <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">Best Professional Cameras 2025</h1>
          <p className="mt-2 max-w-2xl text-base text-white/80">
            Flagship cameras delivering ultimate performance for professional photographers and videographers who demand the highest quality.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {['Flagship Performance', 'Professional Build', 'Ultimate Quality'].map((tag) => (
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
              <h2 className="mb-4 text-lg font-bold text-neutral-900">Professional Camera Guide</h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {[
                  { title: 'Professional Requirements', items: ['Weather sealing and rugged construction', 'Dual memory card slots for redundancy', 'Professional video codecs and formats', 'Advanced autofocus with subject tracking', 'High-resolution sensors for detailed work'] },
                  { title: 'Investment Considerations', items: ['Professional cameras are long-term investments', 'Consider total system cost including lenses', 'Factor in insurance and maintenance costs', 'Evaluate upgrade cycles and resale value', 'Consider rental options for specific projects'] },
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
                <li><Link href="/best/cameras/professional-photo-cameras" className="text-neutral-700 hover:text-primary hover:underline">Professional Photo Cameras</Link></li>
                <li><Link href="/best/cameras/hybrid-cameras-under-3000" className="text-neutral-700 hover:text-primary hover:underline">Hybrid Under $3,000</Link></li>
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
