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
  alternates: { canonical: '/best/headphones/top-5-wireless-headphones' },
  title: 'Top 5 Wireless Headphones 2025 - Best Over-Ear Headphones Ranked',
  description: 'The best wireless over-ear headphones ranked by our experts. Sony XM5, Bose QuietComfort Ultra, Sennheiser Momentum 4, and more — tested and ranked.',
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
    image: '/images/placeholder-product.svg',
    summary: 'Industry-leading ANC with LDAC hi-res audio, 30-hour battery, and a redesigned driver for the best wireless over-ear experience available.',
    score: 9.3,
    price: '$349',
    badge: 'best-overall' as const,
    specs: { 'Driver': '30mm', ANC: 'Best-in-class', Battery: '30hr', Weight: '250g', Codec: 'LDAC, AAC' },
  },
  {
    rank: 2,
    name: 'Bose QuietComfort Ultra Headphones',
    href: '/articles/bose_qc_ultra_headphones',
    image: '/images/placeholder-product.svg',
    summary: 'CustomTune personalized ANC calibrates noise cancellation to your ear shape, with Immersive Audio spatial sound and a compact hard-shell case.',
    score: 9.2,
    price: '$299',
    badge: 'best-value' as const,
    specs: { 'Driver': '35mm TriPort', ANC: 'CustomTune', Battery: '24hr', Weight: '254g', Charging: 'USB-C + Qi' },
  },
  {
    rank: 3,
    name: 'Sennheiser Momentum 4 Wireless',
    href: '/articles/sennheiser_momentum_4_wireless',
    image: '/images/placeholder-product.svg',
    summary: '60-hour industry-leading battery life with audiophile-grade 42mm drivers, aptX Adaptive, and a built-in Tile tracker for the ultimate endurance headphone.',
    score: 8.9,
    price: '$279',
    specs: { 'Driver': '42mm', ANC: 'Adaptive', Battery: '60hr', Weight: '293g', Codec: 'aptX Adaptive' },
  },
  {
    rank: 4,
    name: 'Sony WH-1000XM4',
    href: '/articles/sony_wh1000xm4',
    image: '/images/placeholder-product.svg',
    summary: 'The XM5\'s predecessor still competes strongly — wider codec support (LDAC + aptX HD), compact 3-axis fold, and 30-hour battery at a lower street price.',
    score: 8.9,
    price: '$248',
    specs: { 'Driver': '40mm', ANC: 'Dual Sensor', Battery: '30hr', Weight: '254g', Codec: 'LDAC, aptX HD' },
  },
  {
    rank: 5,
    name: 'Beats Studio Pro',
    href: '/articles/beats_studio_pro',
    image: '/images/placeholder-product.svg',
    summary: '40-hour battery, USB-C lossless audio, and compatibility with both Apple Find My and Google Find My Device make it the best cross-platform wireless headphone.',
    score: 8.6,
    price: '$349',
    badge: 'budget-pick' as const,
    specs: { 'Driver': '40mm', ANC: 'Active', Battery: '40hr', Weight: '260g', USB: 'Lossless via USB-C' },
  },
];

const quickPicks = [
  { label: 'Best Overall', name: 'Sony WH-1000XM5', href: '/articles/sony_wh1000xm5', score: 9.3, price: '$349' },
  { label: 'Best Value', name: 'Bose QuietComfort Ultra', href: '/articles/bose_qc_ultra_headphones', score: 9.2, price: '$299' },
  { label: 'Budget Pick', name: 'Beats Studio Pro', href: '/articles/beats_studio_pro', score: 8.6, price: '$349' },
];

export default function TopWirelessHeadphonesPage() {
  return (
    <div className="min-h-screen bg-neutral-50">
      <Breadcrumb items={[
        { label: 'Home', href: '/' },
        { label: 'Best Of', href: '/best' },
        { label: 'Headphones', href: '/best/headphones' },
        { label: 'Top 5 Wireless Headphones' },
      ]} />

      <div className="bg-gradient-to-br from-primary to-primary-dark px-6 py-10 text-white">
        <div className="mx-auto max-w-content">
          <SectionLabel className="text-white/70">Buying Guide</SectionLabel>
          <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">Top 5 Wireless Headphones 2025</h1>
          <p className="mt-2 max-w-2xl text-base text-white/80">
            The best over-ear wireless headphones ranked by ANC performance, sound quality, battery life, and value. Expert-tested to help you find the perfect pair.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {['ANC Measured', '30–60hr Battery', '$248 – $349'].map((tag) => (
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
              <h2 className="mb-4 text-lg font-bold text-neutral-900">How We Test Wireless Headphones</h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {[
                  { title: 'ANC Measurement', desc: 'We use calibrated measurement equipment to quantify noise attenuation in dB across the frequency spectrum — not just subjective impressions.' },
                  { title: 'Battery Rundown Tests', desc: 'Each headphone is played continuously at 70 dB SPL with ANC enabled until shutdown, giving real-world battery numbers rather than rated specs.' },
                  { title: 'Extended Wear Testing', desc: 'Our reviewers wear each headphone for multiple 3–6 hour sessions to evaluate comfort, clamping force, and heat buildup over time.' },
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
                {headphones.map((hp) => (
                  <li key={hp.href}>
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
                <li><Link href="/best/headphones/top-5-earbuds" className="text-neutral-700 hover:text-primary hover:underline">Top 5 Wireless Earbuds</Link></li>
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
