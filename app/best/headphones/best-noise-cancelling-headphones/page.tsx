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
  title: 'Best Noise-Cancelling Headphones 2025 - Expert Reviews',
  description: 'Top noise-cancelling headphones tested for ANC quality, sound, comfort, and battery life. Find the best over-ear headphones for travel and work.',
};

interface HeadphoneEntry {
  rank: number; name: string; href: string; image: string; summary: string;
  score: number; price: string; badge?: 'best-overall' | 'best-value' | 'budget-pick';
  specs?: Record<string, string>;
}

const headphones: HeadphoneEntry[] = [
  {
    rank: 1,
    name: 'Sony WH-1000XM5',
    href: '/articles/sony_wh1000xm5',
    image: '/images/item.png',
    summary: 'The benchmark for noise-cancelling headphones with best-in-class ANC, premium sound quality, 30-hour battery, and a sleek redesigned chassis.',
    score: 9.3,
    price: '$349',
    badge: 'best-overall' as const,
    specs: { 'Driver Size': '30mm', 'ANC Rating': 'Best-in-class', Battery: '30hr (ANC on)', Weight: '250g', Codec: 'LDAC, AAC, SBC' },
  },
  {
    rank: 2,
    name: 'Bose QuietComfort 45',
    href: '/articles/bose_quietcomfort_45',
    image: '/images/item.png',
    summary: 'Legendary Bose comfort with outstanding noise cancellation, balanced sound signature, and best-in-class plush earcup padding for long travel.',
    score: 9.0,
    price: '$329',
    badge: 'best-value' as const,
    specs: { 'Driver Size': '40mm', 'ANC Rating': 'Excellent', Battery: '24hr (ANC on)', Weight: '238g', Codec: 'AAC, SBC' },
  },
  {
    rank: 3,
    name: 'Anker Soundcore Q45',
    href: '/articles/anker_soundcore_q45',
    image: '/images/item.png',
    summary: 'Exceptional budget ANC headphones with LDAC support, adaptive noise cancellation, and 50-hour battery at an almost unbelievable $79 price.',
    score: 8.4,
    price: '$79',
    badge: 'budget-pick' as const,
    specs: { 'Driver Size': '40mm', 'ANC Rating': 'Good', Battery: '50hr (ANC on)', Weight: '253g', Codec: 'LDAC, AAC, SBC' },
  },
  {
    rank: 4,
    name: 'Apple AirPods Max',
    href: '/articles/apple_airpods_max',
    image: '/images/item.png',
    summary: 'Apple\'s premium over-ear headphones with stunning build quality, exceptional transparency mode, and seamless Apple device integration.',
    score: 8.9,
    price: '$549',
    specs: { 'Driver Size': '40mm Apple', 'ANC Rating': 'Excellent', Battery: '20hr (ANC on)', Weight: '385g', Codec: 'AAC, SBC' },
  },
];

const quickPicks = [
  { label: 'Best Overall', name: 'Sony WH-1000XM5', href: '/articles/sony_wh1000xm5', score: 9.3, price: '$349' },
  { label: 'Best Comfort', name: 'Bose QuietComfort 45', href: '/articles/bose_quietcomfort_45', score: 9.0, price: '$329' },
  { label: 'Budget Pick', name: 'Anker Soundcore Q45', href: '/articles/anker_soundcore_q45', score: 8.4, price: '$79' },
];

export default function BestNoiseCancellingPage() {
  return (
    <div className="min-h-screen bg-neutral-50">
      <Breadcrumb items={[
        { label: 'Home', href: '/' },
        { label: 'Best Of', href: '/best' },
        { label: 'Headphones', href: '/best/headphones' },
        { label: 'Best Noise-Cancelling' },
      ]} />

      <div className="bg-gradient-to-br from-primary to-primary-dark px-6 py-10 text-white">
        <div className="mx-auto max-w-content">
          <SectionLabel className="text-white/70">Buying Guide</SectionLabel>
          <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">Best Noise-Cancelling Headphones 2025</h1>
          <p className="mt-2 max-w-2xl text-base text-white/80">
            Top over-ear headphones tested for noise cancellation effectiveness, sound quality, comfort, and battery life for travel, work, and commuting.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {['ANC Measured in dB', 'Long-Wear Comfort Tested', 'Real-World Travel Testing'].map((tag) => (
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
                {headphones.map((hp, i) => (
                  <div key={hp.rank}>
                    <RankedProductCard {...hp} />
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
              <h2 className="mb-4 text-lg font-bold text-neutral-900">How We Test Noise-Cancelling Headphones</h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {[
                  { title: 'ANC Testing Environments', items: ['Airplane cabin during long-haul flights', 'Open-plan office with ambient noise', 'City street and public transport', 'Home HVAC/appliance noise reduction', 'Low, mid, and high-frequency attenuation'] },
                  { title: 'What Else Matters', items: ['Transparency/pass-through mode quality', 'Call quality with microphone testing', 'Wear comfort over 4+ hour sessions', 'Multipoint pairing for multiple devices', 'Touch controls and companion app quality'] },
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
                {headphones.map((hp) => (
                  <li key={hp.rank}>
                    <Link href={hp.href} className="flex items-center gap-2 text-neutral-600 hover:text-primary">
                      <span className="text-[10px] text-neutral-400">#{hp.rank}</span>
                      {hp.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-xl bg-gradient-to-br from-primary-lightest to-primary-light/20 p-4">
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-primary">Related Guides</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/best/headphones" className="text-neutral-700 hover:text-primary hover:underline">All Headphones</Link></li>
                <li><Link href="/best/headphones/best-wireless-earbuds" className="text-neutral-700 hover:text-primary hover:underline">Best Wireless Earbuds</Link></li>
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
