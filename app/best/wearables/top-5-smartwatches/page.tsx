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
  title: 'Top 5 Smartwatches 2025 - Expert Reviews & Buying Guide',
  description: 'The best smartwatches tested for notifications, app ecosystems, and health monitoring. Expert-reviewed Apple Watch, Samsung Galaxy Watch, and Google Pixel Watch.',
};

interface SmartwatchEntry {
  rank: number; name: string; href: string; image: string; summary: string;
  score: number; price: string; badge?: 'best-overall' | 'best-value' | 'budget-pick';
  badgeLabel?: string;
  specs?: Record<string, string>;
}

const smartwatches: SmartwatchEntry[] = [
  {
    rank: 1,
    name: 'Apple Watch Series 10',
    href: '/articles/apple_watch_series_10',
    image: '/images/item.png',
    summary: 'Apple\'s thinnest Watch ever with a wider always-on display, watchOS 11, sleep apnea detection, and the most comprehensive smartwatch app ecosystem on any platform.',
    score: 9.3,
    price: '$399',
    badge: 'best-overall' as const,
    specs: { Display: '46mm Always-On LTPO OLED', 'Battery Life': '18hr (36hr LPM)', 'Health Sensors': 'ECG, Blood O2, Temp', OS: 'watchOS 11', 'Water Resistance': '50m' },
  },
  {
    rank: 2,
    name: 'Apple Watch Ultra 2',
    href: '/articles/apple_watch_ultra_2',
    image: '/images/item.png',
    summary: 'Apple\'s most rugged and capable Watch with 36-hour battery, brightest 2000-nit display, titanium construction, and precision dual-frequency GPS for serious athletes.',
    score: 9.4,
    price: '$799',
    badge: 'best-value' as const,
    badgeLabel: 'Best Premium',
    specs: { Display: '49mm Always-On OLED 2000 nits', 'Battery Life': '36hr (72hr LPM)', 'Health Sensors': 'ECG, Depth Gauge, Temp', OS: 'watchOS 11', 'Water Resistance': '100m' },
  },
  {
    rank: 3,
    name: 'Samsung Galaxy Watch 7',
    href: '/articles/samsung_galaxy_watch_7',
    image: '/images/item.png',
    summary: 'Best Android smartwatch with 3nm chip for improved efficiency, Galaxy AI health coaching, BioActive sensor for body composition, and excellent Samsung ecosystem integration.',
    score: 9.0,
    price: '$299',
    specs: { Display: '44mm Super AMOLED', 'Battery Life': '40hr', 'Health Sensors': 'BioActive Sensor, ECG', OS: 'Wear OS 5 / One UI Watch 6', 'Water Resistance': '5ATM' },
  },
  {
    rank: 4,
    name: 'Google Pixel Watch 3',
    href: '/articles/google_pixel_watch_3',
    image: '/images/item.png',
    summary: 'Best Wear OS experience with Fitbit health integration, FDA-cleared Loss of Pulse Detection, and deep Google Assistant support — ideal for Pixel phone users.',
    score: 8.8,
    price: '$349',
    specs: { Display: '45mm AMOLED 1000 nits', 'Battery Life': '24hr (36hr saver)', 'Health Sensors': 'ECG, SpO2, Loss of Pulse', OS: 'Wear OS 4', 'Water Resistance': '5ATM + IP68' },
  },
  {
    rank: 5,
    name: 'Samsung Galaxy Watch 6 Classic',
    href: '/articles/samsung_galaxy_watch_6_classic',
    image: '/images/item.png',
    summary: 'Premium classic-look Android smartwatch with the iconic rotating physical bezel, stainless steel construction, 40-hour battery, and Galaxy AI health features.',
    score: 8.8,
    price: '$399',
    badge: 'budget-pick' as const,
    badgeLabel: 'Best Design',
    specs: { Display: '47mm Super AMOLED 480x480', 'Battery Life': '40hr', 'Health Sensors': 'BioActive Sensor, ECG, Body Comp', OS: 'Wear OS 5', 'Water Resistance': '5ATM + IP68' },
  },
];

const quickPicks = [
  { label: 'Best Overall', name: 'Apple Watch Series 10', href: '/articles/apple_watch_series_10', score: 9.3, price: '$399' },
  { label: 'Best Premium', name: 'Apple Watch Ultra 2', href: '/articles/apple_watch_ultra_2', score: 9.4, price: '$799' },
  { label: 'Best Design', name: 'Samsung Galaxy Watch 6 Classic', href: '/articles/samsung_galaxy_watch_6_classic', score: 8.8, price: '$399' },
];

export default function Top5SmartwatchesPage() {
  return (
    <div className="min-h-screen bg-neutral-50">
      <Breadcrumb items={[
        { label: 'Home', href: '/' },
        { label: 'Best Of', href: '/best' },
        { label: 'Wearables', href: '/best/wearables' },
        { label: 'Top 5 Smartwatches' },
      ]} />

      <div className="bg-gradient-to-br from-primary to-primary-dark px-6 py-10 text-white">
        <div className="mx-auto max-w-content">
          <SectionLabel className="text-white/70">Buying Guide</SectionLabel>
          <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">Top 5 Smartwatches 2025</h1>
          <p className="mt-2 max-w-2xl text-base text-white/80">
            The best smartwatches tested for notification handling, app ecosystem quality, health monitoring accuracy, and seamless smartphone integration for iOS and Android users.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {['Smart Notifications', 'App Ecosystem', 'Health Monitoring'].map((tag) => (
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
                {smartwatches.map((watch, i) => (
                  <div key={watch.rank}>
                    <RankedProductCard {...watch} />
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
              <h2 className="mb-4 text-lg font-bold text-neutral-900">How We Test Smartwatches</h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {[
                  { title: 'App Ecosystem', desc: 'Third-party app availability, quality, and consistency evaluated across key categories: navigation, fitness, productivity, and payments.' },
                  { title: 'Notification Handling', desc: 'Notification display quality, reply functionality, and dismissal reliability tested across iOS and Android with all major messaging apps.' },
                  { title: 'Health Accuracy', desc: 'Heart rate, SpO2, ECG, and sleep staging accuracy compared against reference-grade clinical devices and validated sensors over multiple weeks.' },
                ].map((item) => (
                  <div key={item.title}>
                    <h3 className="mb-1 text-sm font-semibold text-primary">{item.title}</h3>
                    <p className="text-xs leading-relaxed text-neutral-600">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-neutral-200 bg-white p-6">
              <SectionLabel>Related Guides</SectionLabel>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {[
                  { href: '/best/wearables', label: 'All Best Wearables', desc: '15 top picks' },
                  { href: '/best/wearables/top-5-fitness-watches', label: 'Top 5 Fitness Watches', desc: '5 reviewed' },
                  { href: '/best/wearables/best-fitness-trackers', label: 'Best Fitness Trackers', desc: '6 reviewed' },
                ].map((link) => (
                  <Link key={link.href} href={link.href} className="flex items-center justify-between rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-3 hover:border-primary hover:bg-primary-lightest">
                    <span className="text-sm font-semibold text-neutral-800">{link.label}</span>
                    <span className="text-xs text-neutral-400">{link.desc} →</span>
                  </Link>
                ))}
              </div>
            </div>
          </main>

          <aside className="space-y-5">
            <div className="rounded-xl border border-neutral-200 bg-white p-4">
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-primary">Jump To</h3>
              <ul className="space-y-2 text-sm">
                {smartwatches.map((watch) => (
                  <li key={`${watch.href}-${watch.rank}`}>
                    <Link href={watch.href} className="flex items-center gap-2 text-neutral-600 hover:text-primary">
                      <span className="text-[10px] text-neutral-400">#{watch.rank}</span>
                      {watch.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-xl bg-gradient-to-br from-primary-lightest to-primary-light/20 p-4">
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-primary">Quick Picks</h3>
              <ul className="space-y-3 text-sm">
                {quickPicks.map((pick) => (
                  <li key={pick.href}>
                    <Link href={pick.href} className="block hover:text-primary">
                      <span className="block text-[10px] font-semibold uppercase tracking-wider text-primary">{pick.label}</span>
                      <span className="text-neutral-700 hover:underline">{pick.name}</span>
                      <span className="ml-1 text-xs text-neutral-400">{pick.price}</span>
                    </Link>
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
