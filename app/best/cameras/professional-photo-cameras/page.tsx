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
  title: 'Best Professional Photo Cameras 2025 - Expert Reviews',
  description: 'Ultimate cameras focused on delivering the highest still image quality. Expert tested professional photo cameras.',
};

interface CamEntry {
  rank: number; name: string; href: string; image: string; summary: string;
  score: number; price: string; badge?: 'best-overall' | 'best-value' | 'budget-pick';
  specs?: Record<string, string>;
}

const cameras: CamEntry[] = [
  {
    rank: 1,
    name: 'Sony A1 II',
    href: '/articles/sony_a1_ii',
    image: '/images/item.png',
    summary: 'Ultimate stills quality with speed, advanced autofocus and video capabilities, and 50MP professional performance.',
    score: 9.6,
    price: '$6,499',
    badge: 'best-overall' as const,
    specs: { Sensor: '50MP Full-Frame', Video: '8K 30p', AF: 'AI recognition', Speed: 'Elite' },
  },
  {
    rank: 2,
    name: 'Fujifilm GFX100 II',
    href: '/articles/fujifilm_gfx100_ii',
    image: '/images/item.png',
    summary: 'Spectacular image quality and dynamic range in medium format with 102MP sensor and 8K video.',
    score: 9.5,
    price: '$7,499',
    badge: 'best-value' as const,
    specs: { Sensor: '102MP Medium Format', Video: '8K 30p', IBIS: '8-stop', Format: 'Medium Format' },
  },
  {
    rank: 3,
    name: 'Hasselblad X2D 100C',
    href: '/articles/hasselblad_x2d_100c',
    image: '/images/item.png',
    summary: '100MP medium format sensor with leaf shutter capability and exquisite color rendering.',
    score: 9.3,
    price: '$8,199',
    badge: 'budget-pick' as const,
    specs: { Sensor: '100MP Medium Format', Shutter: 'Leaf', Color: 'Exceptional', Build: 'Premium' },
  },
  {
    rank: 4,
    name: 'Nikon Z9',
    href: '/articles/nikon_z9',
    image: '/images/item.png',
    summary: 'High-speed stills performance in a professional camera with excellent 8K video.',
    score: 9.2,
    price: '$5,496',
    specs: { Sensor: '45.7MP Full-Frame', Video: '8K 60p', Build: 'Rugged Pro', Speed: 'High-speed' },
  },
  {
    rank: 5,
    name: 'Leica M11',
    href: '/articles/leica_m11',
    image: '/images/item.png',
    summary: 'High-resolution rangefinder with classic craftsmanship and a unique shooting experience.',
    score: 8.8,
    price: '$8,995',
    specs: { Sensor: '60MP Full-Frame', Type: 'Rangefinder', Focus: 'Manual', Heritage: 'Classic' },
  },
];

const quickPicks = [
  { label: 'Best Overall', name: 'Sony A1 II', href: '/articles/sony_a1_ii', score: 9.6, price: '$6,499' },
  { label: 'Best Resolution', name: 'Fujifilm GFX100 II', href: '/articles/fujifilm_gfx100_ii', score: 9.5, price: '$7,499' },
  { label: 'Best Color', name: 'Hasselblad X2D 100C', href: '/articles/hasselblad_x2d_100c', score: 9.3, price: '$8,199' },
];

export default function BestProfessionalPhotoCameras() {
  return (
    <div className="min-h-screen bg-neutral-50">
      <Breadcrumb items={[
        { label: 'Home', href: '/' },
        { label: 'Best Of', href: '/best' },
        { label: 'Cameras', href: '/best/cameras' },
        { label: 'Professional Photo Cameras' },
      ]} />

      <div className="bg-gradient-to-br from-primary to-primary-dark px-6 py-10 text-white">
        <div className="mx-auto max-w-content">
          <SectionLabel className="text-white/70">Buying Guide</SectionLabel>
          <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">Best Professional Photo Cameras 2025</h1>
          <p className="mt-2 max-w-2xl text-base text-white/80">
            Ultimate cameras focused on delivering the highest still image quality. Specifically chosen for exceptional resolution, dynamic range, and professional features.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {['Still-Focused', 'Maximum Resolution', 'Professional Quality'].map((tag) => (
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
              <h2 className="mb-4 text-lg font-bold text-neutral-900">Professional Photography Guide</h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {[
                  { title: 'What Makes a Great Photo Camera?', items: ['High resolution for detailed prints', 'Excellent dynamic range and color depth', 'Superior low-light performance', 'Precise autofocus for critical sharpness', 'Professional build quality and reliability'] },
                  { title: 'Photography Specializations', items: ['Portrait: Medium format for ultimate quality', 'Landscape: High resolution and dynamic range', 'Commercial: Professional features and reliability', 'Fine Art: Maximum image quality and color', 'Street: Compact rangefinders for discretion'] },
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
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-primary">Resolution Comparison</h3>
              <div className="space-y-2 text-xs">
                {[
                  { name: 'Fujifilm GFX100 II', mp: '102MP' },
                  { name: 'Hasselblad X2D', mp: '100MP' },
                  { name: 'Leica M11', mp: '60MP' },
                  { name: 'Sony A1 II', mp: '50MP' },
                  { name: 'Nikon Z9', mp: '45.7MP' },
                ].map((item) => (
                  <div key={item.name} className="flex justify-between">
                    <span className="text-neutral-600 truncate">{item.name}</span>
                    <span className="ml-2 font-bold text-neutral-800">{item.mp}</span>
                  </div>
                ))}
              </div>
            </div>

            <AdBanner adSlot={ADSENSE_CONFIG.adSlots.sidebar} adFormat="rectangle" style={{ minHeight: 250 }} className="rounded-lg" />

            <Newsletter />
          </aside>
        </div>
      </div>
    </div>
  );
}
