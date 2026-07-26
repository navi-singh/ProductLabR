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
  title: 'Top 5 Wireless Earbuds 2025 - Best True Wireless Earbuds Ranked',
  description: 'The best true wireless earbuds ranked by our experts. Sony WF-1000XM5, AirPods Pro 2, Jabra Elite 10, and more — expert-tested and ranked.',
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
    href: '/articles/sony_wf1000xm5',
    image: '/images/item.png',
    summary: 'World-class ANC, LDAC hi-res audio, and a dramatically more compact design than the XM4 — the best true wireless earbuds available in 2025.',
    score: 9.3,
    price: '$279',
    badge: 'best-overall' as const,
    specs: { 'Driver': '8.4mm', ANC: 'Industry-leading', Battery: '8hr + 24hr', 'Water': 'IPX4', Codec: 'LDAC' },
  },
  {
    rank: 2,
    name: 'Apple AirPods Pro 2',
    href: '/articles/apple_airpods_pro_2',
    image: '/images/item.png',
    summary: 'H2 chip powers best-in-class ANC for Apple users, Personalized Spatial Audio, and seamless iPhone/iPad/Mac integration with 6-hour battery.',
    score: 9.2,
    price: '$249',
    badge: 'best-value' as const,
    specs: { 'Chip': 'Apple H2', ANC: 'Adaptive Transparency', Battery: '6hr + 24hr', 'Water': 'IPX4', Codec: 'AAC' },
  },
  {
    rank: 3,
    name: 'Jabra Elite 10',
    href: '/articles/jabra_elite_10',
    image: '/images/item.png',
    summary: 'Best call quality earbuds on the market via MultiSensor Voice technology, Dolby Atmos spatial audio, and an ergonomic open-canal ComfortFit design.',
    score: 9.0,
    price: '$249',
    specs: { 'Driver': '10mm', ANC: 'Adjustable', Battery: '6hr + 27hr', 'Water': 'IP57', Codec: 'LC3, AAC' },
  },
  {
    rank: 4,
    name: 'Google Pixel Buds Pro 2',
    href: '/articles/google_pixel_buds_pro_2',
    image: '/images/item.png',
    summary: 'Tensor A1 chip enables Gemini AI integration, Conversation Detection, and Live Translate — the most intelligent earbuds available for Android users.',
    score: 8.8,
    price: '$229',
    specs: { 'Chip': 'Tensor A1', ANC: 'Silent Seal 2.0', Battery: '8hr + 22hr', 'Water': 'IPX4', AI: 'Gemini' },
  },
  {
    rank: 5,
    name: 'Nothing Ear (2)',
    href: '/articles/nothing_ear_2',
    image: '/images/item.png',
    summary: 'Distinctive transparent design with impressive ANC, LHDC 5.0 codec support, and premium performance at a significantly lower price than flagship competitors.',
    score: 8.7,
    price: '$149',
    badge: 'budget-pick' as const,
    specs: { 'Driver': '11.6mm', ANC: 'Adaptive', Battery: '6hr + 30hr', 'Water': 'IP54', Codec: 'LHDC 5.0' },
  },
];

const quickPicks = [
  { label: 'Best Overall', name: 'Sony WF-1000XM5', href: '/articles/sony_wf1000xm5', score: 9.3, price: '$279' },
  { label: 'Best Value', name: 'Apple AirPods Pro 2', href: '/articles/apple_airpods_pro_2', score: 9.2, price: '$249' },
  { label: 'Budget Pick', name: 'Nothing Ear (2)', href: '/articles/nothing_ear_2', score: 8.7, price: '$149' },
];

export default function TopEarbudsPage() {
  return (
    <div className="min-h-screen bg-neutral-50">
      <Breadcrumb items={[
        { label: 'Home', href: '/' },
        { label: 'Best Of', href: '/best' },
        { label: 'Headphones', href: '/best/headphones' },
        { label: 'Top 5 Earbuds' },
      ]} />

      <div className="bg-gradient-to-br from-primary to-primary-dark px-6 py-10 text-white">
        <div className="mx-auto max-w-content">
          <SectionLabel className="text-white/70">Buying Guide</SectionLabel>
          <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">Top 5 Wireless Earbuds 2025</h1>
          <p className="mt-2 max-w-2xl text-base text-white/80">
            The best true wireless earbuds ranked by sound quality, ANC performance, battery life, and fit. Tested across commutes, workouts, and work sessions.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {['ANC Measured', '6–8hr Earbud Battery', '$149 – $279'].map((tag) => (
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
                {earbuds.map((eb, i) => (
                  <div key={eb.rank}>
                    <RankedProductCard {...eb} />
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
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {[
                  { title: 'Fit & Seal Testing', desc: 'We test each earbud across multiple ear shapes and sizes using included and aftermarket tips to evaluate seal quality and passive isolation baseline.' },
                  { title: 'ANC & Transparency', desc: 'Measured attenuation in dB across the frequency range using calibrated equipment, plus transparency mode naturalness rated across multiple listeners.' },
                  { title: 'Call Quality Panels', desc: 'We conduct call quality tests with a panel of remote listeners rating clarity, naturalness, and background noise suppression in three different noise environments.' },
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
                {earbuds.map((eb) => (
                  <li key={eb.href}>
                    <Link href={eb.href} className="flex items-center gap-2 text-neutral-600 hover:text-primary">
                      <span className="text-[10px] text-neutral-400">#{eb.rank}</span>
                      {eb.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-xl bg-gradient-to-br from-primary-lightest to-primary-light/20 p-4">
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-primary">Related Guides</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/best/headphones" className="text-neutral-700 hover:text-primary hover:underline">All Headphones</Link></li>
                <li><Link href="/best/headphones/top-5-wireless-headphones" className="text-neutral-700 hover:text-primary hover:underline">Top 5 Wireless Headphones</Link></li>
                <li><Link href="/best/headphones/best-noise-cancelling-headphones" className="text-neutral-700 hover:text-primary hover:underline">Best Noise-Cancelling</Link></li>
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
