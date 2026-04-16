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
  title: 'Best Gaming Keyboards 2025 - Expert Reviews',
  description: 'Top gaming keyboards tested for switch feel, polling rate, build quality, and features. Find the best mechanical gaming keyboard for any budget.',
};

interface KeyboardEntry {
  rank: number; name: string; href: string; image: string; summary: string;
  score: number; price: string; badge?: 'best-overall' | 'best-value' | 'budget-pick';
  specs?: Record<string, string>;
}

const keyboards: KeyboardEntry[] = [
  {
    rank: 1,
    name: 'Corsair K100 RGB',
    href: '/articles/corsair_k100_rgb',
    image: '/images/item.png',
    summary: 'The flagship gaming keyboard with optical-mechanical switches, 44-zone RGB, 8000Hz polling rate, and a premium aluminum frame for the ultimate setup.',
    score: 9.1,
    price: '$229',
    badge: 'best-overall' as const,
    specs: { 'Switch Type': 'OPX Optical-Mechanical', 'Form Factor': 'Full-size', Lighting: '44-zone RGB', Wireless: 'No', 'Polling Rate': '8000Hz' },
  },
  {
    rank: 2,
    name: 'Logitech G915 TKL',
    href: '/articles/logitech_g915_tkl',
    image: '/images/item.png',
    summary: 'Best wireless gaming keyboard with ultra-thin low-profile switches, 40-hour battery life, and simultaneous wireless + Bluetooth connectivity.',
    score: 9.0,
    price: '$199',
    badge: 'best-value' as const,
    specs: { 'Switch Type': 'GL Clicky/Tactile/Linear', 'Form Factor': 'TKL (80%)', Lighting: 'Per-key RGB', Wireless: 'LIGHTSPEED 2.4GHz + BT', 'Polling Rate': '1000Hz' },
  },
  {
    rank: 3,
    name: 'Redragon K552',
    href: '/articles/redragon_k552',
    image: '/images/item.png',
    summary: 'Best-value gaming keyboard with solid Outemu mechanical switches, RGB backlighting, and a compact TKL layout at an incredibly affordable price.',
    score: 8.4,
    price: '$35',
    badge: 'budget-pick' as const,
    specs: { 'Switch Type': 'Outemu Blue/Red/Brown', 'Form Factor': 'TKL (80%)', Lighting: 'Rainbow RGB', Wireless: 'No', 'Polling Rate': '1000Hz' },
  },
  {
    rank: 4,
    name: 'SteelSeries Apex Pro',
    href: '/articles/steelseries_apex_pro',
    image: '/images/item.png',
    summary: 'Unique adjustable actuation per-key switch technology lets you set the ideal response depth for every key, with an 8000Hz polling rate.',
    score: 9.2,
    price: '$179',
    specs: { 'Switch Type': 'OmniPoint 2.0 Magnetic', 'Form Factor': 'TKL or Full', Lighting: 'Per-key RGB', Wireless: 'No (TKL: yes)', 'Polling Rate': '8000Hz' },
  },
];

const quickPicks = [
  { label: 'Best Overall', name: 'Corsair K100 RGB', href: '/articles/corsair_k100_rgb', score: 9.1, price: '$229' },
  { label: 'Best Wireless', name: 'Logitech G915 TKL', href: '/articles/logitech_g915_tkl', score: 9.0, price: '$199' },
  { label: 'Budget Pick', name: 'Redragon K552', href: '/articles/redragon_k552', score: 8.4, price: '$35' },
];

export default function BestGamingKeyboardsPage() {
  return (
    <div className="min-h-screen bg-neutral-50">
      <Breadcrumb items={[
        { label: 'Home', href: '/' },
        { label: 'Best Of', href: '/best' },
        { label: 'Gaming', href: '/best/gaming' },
        { label: 'Best Gaming Keyboards' },
      ]} />

      <div className="bg-gradient-to-br from-primary to-primary-dark px-6 py-10 text-white">
        <div className="mx-auto max-w-content">
          <SectionLabel className="text-white/70">Buying Guide</SectionLabel>
          <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">Best Gaming Keyboards 2025</h1>
          <p className="mt-2 max-w-2xl text-base text-white/80">
            Top gaming keyboards tested for switch feel, actuation consistency, polling rate accuracy, and build quality for competitive and casual gaming.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {['Switch Actuation Tested', 'Polling Rate Verified', 'Long-Session Comfort Rated'].map((tag) => (
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
                {keyboards.map((keyboard, i) => (
                  <div key={keyboard.rank}>
                    <RankedProductCard {...keyboard} />
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
              <h2 className="mb-4 text-lg font-bold text-neutral-900">Choosing Your Gaming Switch</h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {[
                  { title: 'Switch Types Explained', items: ['Linear (Red): Smooth keystroke, quiet, good for gaming', 'Tactile (Brown): Bump at actuation, versatile gaming/typing', 'Clicky (Blue): Audible click + tactile bump — loud', 'Optical: Faster actuation, no debounce delay', 'Magnetic (Hall Effect): Most precise, adjustable actuation'] },
                  { title: 'Form Factor Guide', items: ['Full-size (100%): Number pad + all keys, most common', 'TKL (80%): No numpad, more mouse space on desk', '75%: Compact TKL with arrow keys still present', '65%: Minimal layout for competitive mouse movement', '60%: Smallest, no function row — high learning curve'] },
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
                {keyboards.map((keyboard) => (
                  <li key={keyboard.rank}>
                    <Link href={keyboard.href} className="flex items-center gap-2 text-neutral-600 hover:text-primary">
                      <span className="text-[10px] text-neutral-400">#{keyboard.rank}</span>
                      {keyboard.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-xl bg-gradient-to-br from-primary-lightest to-primary-light/20 p-4">
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-primary">Related Guides</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/best/gaming" className="text-neutral-700 hover:text-primary hover:underline">All Gaming Peripherals</Link></li>
                <li><Link href="/best/gaming/best-gaming-mice" className="text-neutral-700 hover:text-primary hover:underline">Best Gaming Mice</Link></li>
                <li><Link href="/best/gaming/best-gaming-headsets" className="text-neutral-700 hover:text-primary hover:underline">Best Gaming Headsets</Link></li>
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
