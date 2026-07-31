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
  title: 'Best Wearables 2025 - Expert Reviews & Buying Guide',
  description: 'The best smartwatches and fitness trackers for health monitoring and everyday use. Expert tested Apple Watch, Samsung Galaxy Watch, and Garmin.',
};

interface WearableEntry {
  rank: number; name: string; href: string; image: string; summary: string;
  score: number; price: string; badge?: 'best-overall' | 'best-value' | 'budget-pick';
  specs?: Record<string, string>;
}

const wearables: WearableEntry[] = [
  {
    rank: 1,
    name: 'Apple Watch Ultra 2',
    href: '/articles/apple_watch_ultra_2',
    image: '/images/item.png',
    summary: 'Apple\'s most rugged and capable Watch with 36-hour battery, brightest 2000-nit display, titanium construction, and precision dual-frequency GPS for serious athletes and adventurers.',
    score: 9.4,
    price: '$799',
    badge: 'best-overall' as const,
    specs: { Display: '49mm Always-On OLED 2000 nits', 'Battery Life': '36hr (72hr LPM)', 'Health Sensors': 'ECG, Depth Gauge, Temp', OS: 'watchOS 11', 'Water Resistance': '100m' },
  },
  {
    rank: 2,
    name: 'Apple Watch Series 10',
    href: '/articles/apple_watch_series_10',
    image: '/images/item.png',
    summary: 'Apple\'s thinnest and lightest Watch ever with a larger always-on display, watchOS 11, sleep apnea detection, and the most comprehensive smartwatch app ecosystem.',
    score: 9.3,
    price: '$399',
    badge: 'best-value' as const,
    specs: { Display: '46mm Always-On OLED', 'Battery Life': '18hr (36hr LPM)', 'Health Sensors': 'ECG, Blood Oxygen, Temp', OS: 'watchOS 11', 'Water Resistance': '50m' },
  },
  {
    rank: 3,
    name: 'Garmin Fenix 7 Pro',
    href: '/articles/garmin_fenix_7_pro',
    image: '/images/item.png',
    summary: 'The benchmark for serious outdoor athletes — unmatched training analytics, built-in topographic maps, LED flashlight, solar charging, and up to 22-day battery life.',
    score: 9.3,
    price: '$599',
    specs: { Display: '47mm MIP + Flashlight', 'Battery Life': '18 days (22 Solar)', 'Health Sensors': 'HRV, SpO2, Training Readiness', OS: 'Garmin OS', 'Water Resistance': '100m' },
  },
  {
    rank: 4,
    name: 'Garmin Forerunner 955',
    href: '/articles/garmin_forerunner_955',
    image: '/images/item.png',
    summary: 'Best triathlon watch under $500 — dedicated multi-sport mode, Race Predictor, Training Readiness, and 20-hour multi-band GPS for long-course events.',
    score: 9.1,
    price: '$499',
    specs: { Display: '46mm MIP', 'Battery Life': '15 days / 20hr GPS', 'Health Sensors': 'HRV, SpO2, Training Readiness', OS: 'Garmin OS', 'Water Resistance': '5ATM' },
  },
  {
    rank: 5,
    name: 'Samsung Galaxy Watch 7',
    href: '/articles/samsung_galaxy_watch_7',
    image: '/images/item.png',
    summary: 'Best mainstream Android smartwatch with 3nm chip, Galaxy AI health coaching, BioActive sensor body composition analysis, and excellent Samsung ecosystem integration.',
    score: 9.0,
    price: '$299',
    specs: { Display: '44mm Super AMOLED', 'Battery Life': '40hr', 'Health Sensors': 'BioActive Sensor, ECG', OS: 'Wear OS 5', 'Water Resistance': '5ATM' },
  },
  {
    rank: 6,
    name: 'Garmin Forerunner 265',
    href: '/articles/garmin_forerunner_265',
    image: '/images/item.png',
    summary: 'Best AMOLED running watch — Training Readiness, Race Predictor, 13-day battery, and Garmin\'s full training analytics platform in a vibrant color display.',
    score: 9.0,
    price: '$449',
    specs: { Display: '46mm AMOLED', 'Battery Life': '13 days / 20hr GPS', 'Health Sensors': 'HRV, SpO2, Training Readiness', OS: 'Garmin OS', 'Water Resistance': '5ATM' },
  },
  {
    rank: 7,
    name: 'Garmin Venu 3',
    href: '/articles/garmin_venu_3',
    image: '/images/item.png',
    summary: 'Garmin\'s premium lifestyle watch with stunning 14-day AMOLED battery, industry-leading sleep coaching, Body Battery, and first-ever wheelchair activity profiles.',
    score: 8.9,
    price: '$449',
    specs: { Display: '45mm AMOLED 454x454', 'Battery Life': '14 days (10 AOD)', 'Health Sensors': 'HRV, SpO2, Sleep Coach', OS: 'Garmin OS', 'Water Resistance': '5ATM' },
  },
  {
    rank: 8,
    name: 'Google Pixel Watch 3',
    href: '/articles/google_pixel_watch_3',
    image: '/images/item.png',
    summary: 'Best Wear OS experience with Fitbit health integration, FDA-cleared Loss of Pulse Detection, and deep Google Assistant support for Android users.',
    score: 8.8,
    price: '$349',
    specs: { Display: '45mm AMOLED 1000 nits', 'Battery Life': '24hr (36hr saver)', 'Health Sensors': 'ECG, SpO2, Loss of Pulse', OS: 'Wear OS 4', 'Water Resistance': '5ATM' },
  },
  {
    rank: 9,
    name: 'Samsung Galaxy Watch 6 Classic',
    href: '/articles/samsung_galaxy_watch_6_classic',
    image: '/images/item.png',
    summary: 'Premium Android smartwatch with iconic rotating physical bezel, stainless steel construction, Galaxy AI features, body composition measurement, and 40-hour battery.',
    score: 8.8,
    price: '$399',
    specs: { Display: '47mm Super AMOLED 480x480', 'Battery Life': '40hr', 'Health Sensors': 'BioActive, ECG, Body Comp', OS: 'Wear OS 5', 'Water Resistance': '5ATM' },
  },
  {
    rank: 10,
    name: 'Polar Ignite 3',
    href: '/articles/polar_ignite_3',
    image: '/images/item.png',
    summary: 'Ultralight 35g AMOLED sports watch with FitSpark AI workout guidance, Nightly Recharge recovery metrics, and Hill Splitter for runners and cyclists.',
    score: 8.5,
    price: '$299',
    specs: { Display: '43mm AMOLED 416x416', 'Battery Life': '5 days / 30hr GPS', 'Health Sensors': 'HRV, SpO2, Skin Temp', OS: 'Polar OS', Weight: '35g' },
  },
  {
    rank: 11,
    name: 'Fitbit Charge 6',
    href: '/articles/fitbit_charge_6',
    image: '/images/item.png',
    summary: 'Best slim fitness tracker — 7-day battery, ECG, on-device GPS, Google Wallet NFC, and Google Maps integration in a lightweight band at $159.',
    score: 8.5,
    price: '$159',
    specs: { Display: '0.86-inch AMOLED band', 'Battery Life': '7 days', 'Health Sensors': 'ECG, SpO2, cEDA Stress', GPS: 'Built-in', Payments: 'Google Wallet' },
  },
  {
    rank: 12,
    name: 'Withings ScanWatch 2',
    href: '/articles/withings_scanwatch_2',
    image: '/images/item.png',
    summary: 'Medical-grade ECG and respiratory health monitoring inside a classic analog watch design with sapphire crystal and an extraordinary 30-day battery.',
    score: 8.4,
    price: '$349',
    specs: { Display: 'Hybrid analog + OLED subdial', 'Battery Life': '30 days', 'Health Sensors': 'ECG, SpO2, Respiratory Scan', GPS: 'Connected', Case: 'Sapphire crystal' },
  },
  {
    rank: 13,
    name: 'Fitbit Sense 2',
    href: '/articles/fitbit_sense_2',
    image: '/images/item.png',
    summary: 'Best holistic health smartwatch for stress monitoring — continuous electrodermal activity sensing, ECG, sleep staging, Google Wallet, and built-in GPS.',
    score: 8.3,
    price: '$249',
    specs: { Display: '40.5mm AMOLED 336x336', 'Battery Life': '6 days', 'Health Sensors': 'cEDA Stress, ECG, SpO2, Temp', GPS: 'Built-in', Payments: 'Google Wallet' },
  },
  {
    rank: 14,
    name: 'Huawei Watch GT 4',
    href: '/articles/huawei_watch_gt_4',
    image: '/images/item.png',
    summary: 'Exceptional 14-day AMOLED battery, comprehensive health tracking including ECG and body composition, and stylish design at a $199 price point no competitor matches.',
    score: 8.3,
    price: '$199',
    specs: { Display: '46mm AMOLED 466x466', 'Battery Life': '14 days', 'Health Sensors': 'ECG, SpO2, Body Comp, Temp', OS: 'HarmonyOS', 'Water Resistance': '5ATM' },
  },
  {
    rank: 15,
    name: 'Amazfit GTR 4',
    href: '/articles/amazfit_gtr_4',
    image: '/images/item.png',
    summary: 'Exceptional two-week battery life with SpO2, ECG, comprehensive sports tracking, and Alexa built-in at a budget-friendly price that challenges pricier rivals.',
    score: 8.4,
    price: '$149',
    badge: 'budget-pick' as const,
    specs: { Display: '46mm AMOLED', 'Battery Life': '14 days', 'Health Sensors': 'SpO2, ECG', OS: 'Zepp OS', 'Water Resistance': '5ATM' },
  },
];

const quickPicks = [
  { label: 'Best Overall', name: 'Apple Watch Ultra 2', href: '/articles/apple_watch_ultra_2', score: 9.4, price: '$799' },
  { label: 'Best Value', name: 'Apple Watch Series 10', href: '/articles/apple_watch_series_10', score: 9.3, price: '$399' },
  { label: 'Budget Pick', name: 'Amazfit GTR 4', href: '/articles/amazfit_gtr_4', score: 8.4, price: '$149' },
];

const categoryLinks = [
  { href: '/best/wearables/top-5-fitness-watches', label: 'Top 5 Fitness Watches', count: 5 },
  { href: '/best/wearables/top-5-smartwatches', label: 'Top 5 Smartwatches', count: 5 },
];

export default function WearablesPage() {
  return (
    <div className="min-h-screen bg-neutral-50">
      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Best Of', href: '/best' }, { label: 'Wearables' }]} />

      {/* Header */}
      <div className="bg-gradient-to-br from-primary to-primary-dark px-6 py-10 text-white">
        <div className="mx-auto max-w-content">
          <SectionLabel className="text-white/70">Buying Guide</SectionLabel>
          <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">Best Wearables 2025</h1>
          <p className="mt-2 max-w-2xl text-base text-white/80">
            Expert-tested smartwatches and fitness trackers for health monitoring, sports tracking, and everyday connected convenience.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {['20+ Wearables Tested', 'Health Accuracy Verified', 'Battery Life Measured'].map((tag) => (
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
                {wearables.map((wearable, i) => (
                  <div key={wearable.rank}>
                    <RankedProductCard {...wearable} />
                    {i === 2 && (
                      <div className="mt-4">
                        <AdBanner adSlot={ADSENSE_CONFIG.adSlots.categoryBottom} adFormat="auto" className="rounded-lg" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Wearables Categories */}
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
              <h2 className="mb-4 text-lg font-bold text-neutral-900">How We Test Wearables</h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {[
                  { title: 'Health Accuracy', desc: 'Heart rate, SpO2, and sleep tracking accuracy compared against medical-grade reference devices over multiple weeks.' },
                  { title: 'Battery Life', desc: 'Real-world battery testing in always-on display mode, workout tracking mode, and standard daily use.' },
                  { title: 'Software & Features', desc: 'Companion app quality, third-party app ecosystem, notification handling, and smartphone compatibility assessment.' },
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
                {wearables.map((wearable) => (
                  <li key={`${wearable.href}-${wearable.rank}`}>
                    <Link href={wearable.href} className="flex items-center gap-2 text-neutral-600 hover:text-primary">
                      <span className="text-[10px] text-neutral-400">#{wearable.rank}</span>
                      {wearable.name}
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
