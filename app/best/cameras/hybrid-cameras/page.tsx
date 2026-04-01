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
  title: 'Best Hybrid Cameras 2025 - Expert Reviews',
  description: 'Top cameras excelling at both photography and videography. Expert tested hybrid cameras for professionals and content creators.',
};

interface CamEntry {
  rank: number; name: string; href: string; image: string; summary: string;
  score: number; price: string; badge?: 'best-overall' | 'best-value' | 'budget-pick';
  specs?: Record<string, string>;
}

const cameras: CamEntry[] = [
  {
    rank: 1,
    name: 'Canon EOS R5 Mark II',
    href: '/articles/canon_eos_r5_mark_ii',
    image: '/images/item.png',
    summary: 'Outstanding hybrid performance with 8K 30p video, 45MP full-frame, Eye Control AF, and 8.5-stop IBIS.',
    score: 9.5,
    price: '$4,299',
    badge: 'best-overall' as const,
    specs: { Sensor: '45MP Full-Frame', Video: '8K 30p', IBIS: '8.5-stop', AF: 'Eye Control' },
  },
  {
    rank: 2,
    name: 'Sony A1 II',
    href: '/articles/sony_a1_ii',
    image: '/images/item.png',
    summary: 'Exceptional speed and performance with 50MP sensor, 8K 30p video, and elite AI recognition autofocus.',
    score: 9.4,
    price: '$6,499',
    badge: 'best-value' as const,
    specs: { Sensor: '50MP Full-Frame', Video: '8K 30p', AF: 'AI recognition', Speed: 'Elite' },
  },
  {
    rank: 3,
    name: 'Nikon Z8',
    href: '/articles/nikon_z8',
    image: '/images/item.png',
    summary: 'Compact pro-grade design with excellent 8K video, outstanding dynamic range, and 45.7MP sensor.',
    score: 9.2,
    price: '$3,996',
    badge: 'budget-pick' as const,
    specs: { Sensor: '45.7MP Full-Frame', Video: '8K 60p', IBIS: '6-stop', Form: 'Compact Pro' },
  },
  {
    rank: 4,
    name: 'Panasonic Lumix S1R II',
    href: '/articles/panasonic_lumix_s1r_ii',
    image: '/images/item.png',
    summary: 'Professional video features with high resolution 47.3MP sensor and advanced codec support.',
    score: 8.8,
    price: '$3,699',
    specs: { Sensor: '47.3MP Full-Frame', Video: '6K 30p', IBIS: '6.5-stop', Codecs: 'Pro' },
  },
  {
    rank: 5,
    name: 'Fujifilm X-H2S',
    href: '/articles/fujifilm_xh2s',
    image: '/images/item.png',
    summary: 'APS-C powerhouse performance with excellent video specs and compact form factor.',
    score: 8.6,
    price: '$2,499',
    specs: { Sensor: '26.1MP APS-C', Video: '6.2K 30p', IBIS: '7-stop', Form: 'Compact' },
  },
];

const quickPicks = [
  { label: 'Best Overall', name: 'Canon R5 Mark II', href: '/articles/canon_eos_r5_mark_ii', score: 9.5, price: '$4,299' },
  { label: 'Best Value', name: 'Sony A1 II', href: '/articles/sony_a1_ii', score: 9.4, price: '$6,499' },
  { label: 'Budget Pick', name: 'Nikon Z8', href: '/articles/nikon_z8', score: 9.2, price: '$3,996' },
];

export default function BestHybridCameras() {
  return (
    <div className="min-h-screen bg-neutral-50">
      <Breadcrumb items={[
        { label: 'Home', href: '/' },
        { label: 'Best Of', href: '/best' },
        { label: 'Cameras', href: '/best/cameras' },
        { label: 'Hybrid Cameras' },
      ]} />

      <div className="bg-gradient-to-br from-primary to-primary-dark px-6 py-10 text-white">
        <div className="mx-auto max-w-content">
          <SectionLabel className="text-white/70">Buying Guide</SectionLabel>
          <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">Best Hybrid Cameras 2025</h1>
          <p className="mt-2 max-w-2xl text-base text-white/80">
            Top cameras excelling at both photography and videography. Tested extensively for image quality, video performance, and overall versatility.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {['Photo + Video Excellence', 'Professional Features', '8K Video Capability'].map((tag) => (
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
              <h2 className="mb-4 text-lg font-bold text-neutral-900">How We Test Hybrid Cameras</h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {[
                  { title: 'What Makes a Great Hybrid Camera?', items: ['Excellent video recording capabilities (4K/8K)', 'High-resolution sensor for detailed stills', 'Advanced autofocus for both photo and video', 'In-body image stabilization', 'Professional video features and codecs'] },
                  { title: 'Consider Your Needs', items: ['Budget: Hybrid cameras range from $2,500–$6,500', 'Primary use: More photo or video focused?', 'Portability: Full-frame vs APS-C considerations', 'Lens ecosystem: Available lenses for your needs', 'Learning curve: Menu complexity and features'] },
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
                <li><Link href="/best/cameras/hybrid-cameras-under-3000" className="text-neutral-700 hover:text-primary hover:underline">Hybrid Under $3,000</Link></li>
                <li><Link href="/best/cameras/professional-cameras" className="text-neutral-700 hover:text-primary hover:underline">Professional Cameras</Link></li>
                <li><Link href="/best/cameras/professional-photo-cameras" className="text-neutral-700 hover:text-primary hover:underline">Professional Photo</Link></li>
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
