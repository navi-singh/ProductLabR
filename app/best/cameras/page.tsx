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
  title: 'Best Cameras 2025 - Expert Reviews & Buying Guide',
  description: 'The best cameras for photography and videography. Expert tested mirrorless, DSLR, and hybrid cameras for professionals and enthusiasts.',
};

const cameras = [
  {
    rank: 1,
    name: 'Panasonic Lumix S5 II',
    href: '/articles/lumix_s5_ii',
    image: '/images/posts/lumix_s5ii.webp',
    summary: 'Phase-detection autofocus breakthrough with 6K video, outstanding IBIS, and weather-sealed build.',
    score: 9.2,
    price: '$1,999',
    badge: 'best-overall' as const,
    specs: { Sensor: '24.2MP Full-Frame', Video: '6K 30p, 4K 60p', IBIS: 'Yes', AF: 'Phase-detection' },
  },
  {
    rank: 2,
    name: 'Sony α7R V',
    href: '/articles/sony_7r_v',
    image: '/images/item.png',
    summary: 'Highest resolution in class with 61MP sensor, advanced AI autofocus, and excellent stabilization.',
    score: 9.0,
    price: '$3,898',
    badge: 'best-value' as const,
    specs: { Sensor: '61MP Full-Frame', Video: '8K 24p, 4K 60p', IBIS: 'Yes', AF: 'AI-powered' },
  },
  {
    rank: 3,
    name: 'Canon EOS R6 Mark II',
    href: '/articles/canon_eos_r6_mark_ii',
    image: '/images/item.png',
    summary: 'Excellent autofocus performance with great low-light capabilities and professional video features.',
    score: 8.8,
    price: '$2,499',
    badge: 'budget-pick' as const,
    specs: { Sensor: '24.2MP Full-Frame', Video: '4K 60p, 6K RAW', IBIS: 'Yes', AF: 'Dual Pixel II' },
  },
];

const quickPicks = [
  { label: 'Best Overall', name: 'Lumix S5 II', href: '/articles/lumix_s5_ii', score: 9.2, price: '$1,999' },
  { label: 'Best Value', name: 'Sony α7R V', href: '/articles/sony_7r_v', score: 9.0, price: '$3,898' },
  { label: 'Budget Pick', name: 'Canon R6 Mark II', href: '/articles/canon_eos_r6_mark_ii', score: 8.8, price: '$2,499' },
];

const categoryLinks = [
  { href: '/best/cameras/hybrid-cameras', label: 'Best Hybrid Cameras', count: 5 },
  { href: '/best/cameras/hybrid-cameras-under-3000', label: 'Hybrid Under $3,000', count: 5 },
  { href: '/best/cameras/professional-cameras', label: 'Professional Cameras', count: 4 },
  { href: '/best/cameras/professional-photo-cameras', label: 'Professional Photo', count: 5 },
];

export default function CamerasPage() {
  return (
    <div className="min-h-screen bg-neutral-50">
      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Best Of', href: '/best' }, { label: 'Cameras' }]} />

      {/* Header */}
      <div className="bg-gradient-to-br from-primary to-primary-dark px-6 py-10 text-white">
        <div className="mx-auto max-w-content">
          <SectionLabel className="text-white/70">Buying Guide</SectionLabel>
          <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">Best Cameras 2025</h1>
          <p className="mt-2 max-w-2xl text-base text-white/80">
            Expert-tested cameras for photography and videography. From mirrorless to cinema cameras, we help you find the perfect tool for your creative vision.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {['15+ Cameras Tested', 'Real-World Testing', 'Professional Reviews'].map((tag) => (
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

            {/* Camera Categories */}
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
              <h2 className="mb-4 text-lg font-bold text-neutral-900">How We Test Cameras</h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {[
                  { title: 'Image Quality', desc: 'Resolution, dynamic range, color accuracy, and low-light performance across various shooting conditions.' },
                  { title: 'Performance', desc: 'Autofocus speed and accuracy, burst shooting, battery life, and handling in real-world scenarios.' },
                  { title: 'Video Capabilities', desc: 'Recording quality, stabilization, autofocus during video, and professional features like log recording.' },
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
