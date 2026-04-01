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
  title: 'Best Smartwatches 2025 - Expert Reviews',
  description: 'Top smartwatches tested for health tracking, battery life, and app ecosystem. Find the best Apple Watch, Samsung Galaxy Watch, or Garmin for your needs.',
};

interface WatchEntry {
  rank: number; name: string; href: string; image: string; summary: string;
  score: number; price: string; badge?: 'best-overall' | 'best-value' | 'budget-pick';
  specs?: Record<string, string>;
}

const watches: WatchEntry[] = [
  {
    rank: 1,
    name: 'Apple Watch Series 10',
    href: '/best/wearables/best-smartwatches',
    image: '/images/item.png',
    summary: 'Apple\'s thinnest Watch ever with a wider always-on display, faster charge, sleep apnea detection, and the most comprehensive health suite on any smartwatch.',
    score: 9.3,
    price: '$399',
    badge: 'best-overall' as const,
    specs: { Display: '46mm Always-On LTPO OLED', 'Battery Life': '18hr (AoD on)', 'Health Sensors': 'ECG, Blood O2, Temp', OS: 'watchOS 11', 'Water Resistance': '50m / IP6X' },
  },
  {
    rank: 2,
    name: 'Samsung Galaxy Watch 7',
    href: '/best/wearables/best-smartwatches',
    image: '/images/item.png',
    summary: 'Best Android smartwatch with 3nm chip for improved efficiency, advanced body composition analysis, and Galaxy AI-powered health coaching.',
    score: 9.0,
    price: '$299',
    badge: 'best-value' as const,
    specs: { Display: '44mm Super AMOLED', 'Battery Life': '40hr (typical)', 'Health Sensors': 'BioActive Sensor, ECG', OS: 'Wear OS 5 / One UI Watch 6', 'Water Resistance': '5ATM + IP68' },
  },
  {
    rank: 3,
    name: 'Amazfit GTR 4',
    href: '/best/wearables/best-smartwatches',
    image: '/images/item.png',
    summary: 'Exceptional two-week battery life with SpO2, ECG, comprehensive sports tracking, and Alexa built-in at a budget-friendly price that challenges pricier rivals.',
    score: 8.4,
    price: '$149',
    badge: 'budget-pick' as const,
    specs: { Display: '46mm AMOLED', 'Battery Life': '14 days (typical)', 'Health Sensors': 'SpO2, ECG, BioTracker 4.0', OS: 'Zepp OS 2.1', 'Water Resistance': '5ATM' },
  },
  {
    rank: 4,
    name: 'Garmin Forerunner 265',
    href: '/best/wearables/best-smartwatches',
    image: '/images/item.png',
    summary: 'Best smartwatch for runners with Garmin\'s unmatched training analytics, GPS accuracy, multi-sport tracking, and 15-day battery life.',
    score: 9.1,
    price: '$449',
    specs: { Display: '46mm AMOLED', 'Battery Life': '15 days / 20hr GPS', 'Health Sensors': 'HRV, SpO2, Training Readiness', OS: 'Garmin OS', 'Water Resistance': '5ATM' },
  },
];

const quickPicks = [
  { label: 'Best Overall', name: 'Apple Watch Series 10', href: '/best/wearables/best-smartwatches', score: 9.3, price: '$399' },
  { label: 'Best Android', name: 'Samsung Galaxy Watch 7', href: '/best/wearables/best-smartwatches', score: 9.0, price: '$299' },
  { label: 'Budget Pick', name: 'Amazfit GTR 4', href: '/best/wearables/best-smartwatches', score: 8.4, price: '$149' },
];

export default function BestSmartwatchesPage() {
  return (
    <div className="min-h-screen bg-neutral-50">
      <Breadcrumb items={[
        { label: 'Home', href: '/' },
        { label: 'Best Of', href: '/best' },
        { label: 'Wearables', href: '/best/wearables' },
        { label: 'Best Smartwatches' },
      ]} />

      <div className="bg-gradient-to-br from-primary to-primary-dark px-6 py-10 text-white">
        <div className="mx-auto max-w-content">
          <SectionLabel className="text-white/70">Buying Guide</SectionLabel>
          <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">Best Smartwatches 2025</h1>
          <p className="mt-2 max-w-2xl text-base text-white/80">
            Top smartwatches tested for health sensor accuracy, battery life, app ecosystem quality, and overall daily usability for all types of users.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {['Health Accuracy Verified', 'Battery Life Measured', 'iOS & Android Tested'].map((tag) => (
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
                {watches.map((watch, i) => (
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
              <h2 className="mb-4 text-lg font-bold text-neutral-900">Apple Watch vs Samsung vs Garmin</h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {[
                  { title: 'Choose Based on Your Phone', items: ['Apple Watch: Only works with iPhone — best iOS experience', 'Galaxy Watch: Best with Samsung phones, works with Android', 'Garmin: Works with both iOS and Android equally well', 'Amazfit: Cross-platform with decent Zepp app', 'Pixel Watch: Best with Google Pixel phones'] },
                  { title: 'What the Health Features Track', items: ['Heart rate: All watches, accuracy varies', 'ECG: Apple Watch, Samsung, some Garmin', 'Blood oxygen (SpO2): Most modern smartwatches', 'Sleep stages and HRV: Garmin most advanced', 'Crash/fall detection: Apple Watch best implemented'] },
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
                {watches.map((watch) => (
                  <li key={watch.rank}>
                    <Link href={watch.href} className="flex items-center gap-2 text-neutral-600 hover:text-primary">
                      <span className="text-[10px] text-neutral-400">#{watch.rank}</span>
                      {watch.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-xl bg-gradient-to-br from-primary-lightest to-primary-light/20 p-4">
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-primary">Related Guides</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/best/wearables" className="text-neutral-700 hover:text-primary hover:underline">All Wearables</Link></li>
                <li><Link href="/best/wearables/best-fitness-trackers" className="text-neutral-700 hover:text-primary hover:underline">Best Fitness Trackers</Link></li>
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
