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
  alternates: { canonical: '/best/headphones' },
  title: 'Best Headphones & Earbuds 2025 - Expert Reviews & Buying Guide',
  description: 'The best headphones and wireless earbuds for every listener. Expert tested noise-cancelling headphones, gaming headsets, and true wireless earbuds.',
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
    summary: 'Industry-leading active noise cancellation with exceptional sound quality, 30-hour battery, and premium comfort for all-day wear.',
    score: 9.3,
    price: '$349',
    badge: 'best-overall' as const,
    specs: { 'Driver Size': '30mm', ANC: 'Best-in-class', Battery: '30hr', Weight: '250g', Codec: 'LDAC, AAC' },
  },
  {
    rank: 2,
    name: 'Sony WF-1000XM5',
    href: '/articles/sony_wf1000xm5',
    image: '/images/placeholder-product.svg',
    summary: 'The best true wireless earbuds with world-class ANC, hi-res audio support, and a dramatically improved compact design.',
    score: 9.3,
    price: '$279',
    badge: 'best-value' as const,
    specs: { Driver: '8.4mm', ANC: 'Industry-leading', Battery: '8hr + 24hr', 'Water Resistance': 'IPX4', Codec: 'LDAC' },
  },
  {
    rank: 3,
    name: 'Apple AirPods Pro 2',
    href: '/articles/apple_airpods_pro_2',
    image: '/images/placeholder-product.svg',
    summary: 'Apple\'s H2 chip delivers best-in-class ANC for iOS users, Personalized Spatial Audio, and seamless ecosystem integration.',
    score: 9.2,
    price: '$249',
    specs: { Chip: 'Apple H2', ANC: 'Adaptive Transparency', Battery: '6hr + 24hr', 'Water Resistance': 'IPX4', Codec: 'AAC' },
  },
  {
    rank: 4,
    name: 'Bose QuietComfort Ultra Headphones',
    href: '/articles/bose_qc_ultra_headphones',
    image: '/images/placeholder-product.svg',
    summary: 'CustomTune personalized ANC, Immersive Audio spatial sound, and a hard-shell case with Qi wireless charging at $299.',
    score: 9.2,
    price: '$299',
    specs: { Driver: '35mm TriPort', ANC: 'CustomTune', Battery: '24hr', Weight: '254g', Charging: 'USB-C + Qi' },
  },
  {
    rank: 5,
    name: 'Apple AirPods Max',
    href: '/articles/apple_airpods_max',
    image: '/images/placeholder-product.svg',
    summary: 'Apple\'s over-ear flagship with computational audio, Personalized Spatial Audio, and premium aluminum build — the ultimate for Apple ecosystem users.',
    score: 9.1,
    price: '$549',
    specs: { Chip: 'Apple H1 x2', ANC: 'Adaptive EQ', Battery: '20hr', Weight: '385g', Build: 'Aluminum + mesh' },
  },
  {
    rank: 6,
    name: 'Jabra Elite 10',
    href: '/articles/jabra_elite_10',
    image: '/images/placeholder-product.svg',
    summary: 'MultiSensor Voice technology delivers the best call quality of any earbud, with Dolby Atmos spatial audio and a comfortable open-canal ComfortFit design.',
    score: 9.0,
    price: '$249',
    specs: { Driver: '10mm', ANC: 'Adjustable', Battery: '6hr + 27hr', 'Water Resistance': 'IP57', Codec: 'LC3, AAC' },
  },
  {
    rank: 7,
    name: 'Sennheiser Momentum 4 Wireless',
    href: '/articles/sennheiser_momentum_4_wireless',
    image: '/images/placeholder-product.svg',
    summary: '60-hour best-in-class battery life with audiophile-grade 42mm drivers, aptX Adaptive codec, and a built-in Tile tracker.',
    score: 8.9,
    price: '$279',
    specs: { Driver: '42mm', ANC: 'Adaptive', Battery: '60hr', Weight: '293g', Codec: 'aptX Adaptive' },
  },
  {
    rank: 8,
    name: 'Sony WH-1000XM4',
    href: '/articles/sony_wh1000xm4',
    image: '/images/placeholder-product.svg',
    summary: 'The XM5\'s predecessor remains competitive with wider codec support (LDAC + aptX HD), compact 3-axis fold, and excellent value at its current price.',
    score: 8.9,
    price: '$248',
    specs: { Driver: '40mm', ANC: 'Dual Sensor', Battery: '30hr', Weight: '254g', Codec: 'LDAC, aptX HD' },
  },
  {
    rank: 9,
    name: 'Samsung Galaxy Buds3 Pro',
    href: '/articles/samsung_galaxy_buds3_pro',
    image: '/images/placeholder-product.svg',
    summary: 'Samsung\'s flagship earbuds with blade-style design, intelligent ANC, and deep Galaxy ecosystem integration for Android users.',
    score: 8.8,
    price: '$249',
    specs: { Driver: '10.5mm', ANC: 'Intelligent', Battery: '6hr + 15hr', 'Water Resistance': 'IPX7', Codec: 'SSC Hi-Fi' },
  },
  {
    rank: 10,
    name: 'Google Pixel Buds Pro 2',
    href: '/articles/google_pixel_buds_pro_2',
    image: '/images/placeholder-product.svg',
    summary: 'Custom Tensor A1 chip powers Gemini AI integration, Conversation Detection, and Live Translate — the most intelligent earbuds for Android users.',
    score: 8.8,
    price: '$229',
    specs: { Chip: 'Tensor A1', ANC: 'Silent Seal 2.0', Battery: '8hr + 22hr', 'Water Resistance': 'IPX4', AI: 'Gemini' },
  },
  {
    rank: 11,
    name: 'Bose QuietComfort 45',
    href: '/articles/bose_quietcomfort_45',
    image: '/images/placeholder-product.svg',
    summary: 'Classic Bose comfort and reliable ANC performance in a lightweight foldable design — still a strong choice at its reduced street price.',
    score: 8.7,
    price: '$279',
    specs: { Driver: '40mm', ANC: 'TriPort', Battery: '24hr', Weight: '238g', Codec: 'aptX, AAC' },
  },
  {
    rank: 12,
    name: 'Nothing Ear (2)',
    href: '/articles/nothing_ear_2',
    image: '/images/placeholder-product.svg',
    summary: 'Stylish transparent design with impressive ANC, LHDC 5.0 hi-res codec, and premium performance at a mid-range price.',
    score: 8.7,
    price: '$149',
    specs: { Driver: '11.6mm', ANC: 'Adaptive', Battery: '6hr + 30hr', 'Water Resistance': 'IP54', Codec: 'LHDC 5.0' },
  },
  {
    rank: 13,
    name: 'Beats Studio Pro',
    href: '/articles/beats_studio_pro',
    image: '/images/placeholder-product.svg',
    summary: '40-hour battery, USB-C lossless audio, and dual Apple Find My / Google Find My Device compatibility — the best cross-platform wireless headphone.',
    score: 8.6,
    price: '$349',
    specs: { Driver: '40mm', ANC: 'Active', Battery: '40hr', Weight: '260g', USB: 'Lossless via USB-C' },
  },
  {
    rank: 14,
    name: 'Jabra Elite 8 Active',
    href: '/articles/jabra_elite_8_active',
    image: '/images/placeholder-product.svg',
    summary: 'MIL-STD-810H military-grade durability, IP68 full waterproofing, ShakeGrip secure sport fit, and 6-mic wind-resistant call quality at $149.',
    score: 8.5,
    price: '$149',
    specs: { Durability: 'MIL-STD-810H', 'Water Resistance': 'IP68', Battery: '8hr + 32hr', Fit: 'ShakeGrip', Mics: '6-microphone' },
  },
  {
    rank: 15,
    name: 'Anker Soundcore Q45',
    href: '/articles/anker_soundcore_q45',
    image: '/images/placeholder-product.svg',
    summary: 'Exceptional value with solid ANC, 50-hour battery, and Hi-Res Audio certification at a budget-friendly $79 price point.',
    score: 8.2,
    price: '$79',
    badge: 'budget-pick' as const,
    specs: { Driver: '40mm', ANC: 'Active', Battery: '50hr', Weight: '227g', Codec: 'LDAC, AAC' },
  },
];

const quickPicks = [
  { label: 'Best Overall', name: 'Sony WH-1000XM5', href: '/articles/sony_wh1000xm5', score: 9.3, price: '$349' },
  { label: 'Best Earbuds', name: 'Sony WF-1000XM5', href: '/articles/sony_wf1000xm5', score: 9.3, price: '$279' },
  { label: 'Budget Pick', name: 'Anker Soundcore Q45', href: '/articles/anker_soundcore_q45', score: 8.2, price: '$79' },
];

const categoryLinks = [
  { href: '/best/headphones/top-5-wireless-headphones', label: 'Top 5 Wireless Headphones', count: 5 },
  { href: '/best/headphones/top-5-earbuds', label: 'Top 5 Earbuds', count: 5 },
  { href: '/best/headphones/best-noise-cancelling-headphones', label: 'Best Noise-Cancelling', count: 8 },
];

export default function HeadphonesPage() {
  return (
    <div className="min-h-screen bg-neutral-50">
      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Best Of', href: '/best' }, { label: 'Headphones' }]} />

      {/* Header */}
      <div className="bg-gradient-to-br from-primary to-primary-dark px-6 py-10 text-white">
        <div className="mx-auto max-w-content">
          <SectionLabel className="text-white/70">Buying Guide</SectionLabel>
          <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">Best Headphones & Earbuds 2025</h1>
          <p className="mt-2 max-w-2xl text-base text-white/80">
            Expert-tested headphones and earbuds for audiophiles, commuters, gamers, and everyday listeners. Find the perfect pair for your lifestyle.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {['30+ Products Tested', 'ANC Performance Measured', 'Sound Quality Rated'].map((tag) => (
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

            {/* Headphone Categories */}
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
              <h2 className="mb-4 text-lg font-bold text-neutral-900">How We Test Headphones</h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {[
                  { title: 'Sound Quality', desc: 'Frequency response, soundstage, detail retrieval, and tonal balance across genres of music and content types.' },
                  { title: 'ANC Performance', desc: 'Measured noise attenuation across low, mid, and high frequencies in real-world environments like planes and offices.' },
                  { title: 'Comfort & Build', desc: 'Long-wear comfort assessment, build quality, eartip fit (earbuds), clamping force, and materials durability.' },
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
                {headphones.map((hp) => (
                  <li key={`${hp.href}-${hp.rank}`}>
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
