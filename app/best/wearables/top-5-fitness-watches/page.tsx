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
  alternates: { canonical: '/best/wearables/top-5-fitness-watches' },
  title: 'Top 5 Fitness Watches 2025 - Expert Reviews & Buying Guide',
  description: 'The best fitness watches tested for GPS accuracy, health sensors, and training analytics. Expert-reviewed Garmin Fenix, Forerunner, Polar, and Fitbit.',
};

interface FitnessWatchEntry {
  rank: number; name: string; href: string; image?: string; summary: string;
  score: number; price: string; badge?: 'best-overall' | 'best-value' | 'budget-pick';
  specs?: Record<string, string>;
}

const fitnessWatches: FitnessWatchEntry[] = [
  {
    rank: 1,
    name: 'Garmin Fenix 7 Pro',
    href: '/articles/garmin_fenix_7_pro',
    summary: 'The benchmark for serious outdoor athletes — unmatched training analytics, built-in topographic maps, solar charging, and up to 22-day battery life.',
    score: 9.3,
    price: '$599',
    badge: 'best-overall' as const,
    specs: { Display: '47mm MIP + LED Flashlight', 'Battery Life': '18 days (22 Solar)', 'Health Sensors': 'HRV, SpO2, Training Readiness', GPS: 'Multi-band', 'Water Resistance': '100m' },
  },
  {
    rank: 2,
    name: 'Garmin Forerunner 265',
    href: '/articles/garmin_forerunner_265',
    summary: 'Best AMOLED fitness watch for runners — Training Readiness, Race Predictor, 13-day battery, and Garmin\'s full training analytics in a vibrant color display.',
    score: 9.0,
    price: '$449',
    badge: 'best-value' as const,
    specs: { Display: '46mm AMOLED', 'Battery Life': '13 days / 20hr GPS', 'Health Sensors': 'HRV, SpO2, Training Readiness', GPS: 'Multi-band', 'Water Resistance': '5ATM' },
  },
  {
    rank: 3,
    name: 'Garmin Forerunner 955',
    href: '/articles/garmin_forerunner_955',
    summary: 'Best triathlon watch under $500 — dedicated multi-sport transition mode, Race Predictor, Training Readiness, and 20-hour multi-band GPS for long-course events.',
    score: 9.1,
    price: '$499',
    specs: { Display: '46mm MIP', 'Battery Life': '15 days / 20hr GPS', 'Health Sensors': 'HRV, SpO2, Training Readiness', GPS: 'Multi-band', 'Water Resistance': '5ATM' },
  },
  {
    rank: 4,
    name: 'Polar Ignite 3',
    href: '/articles/polar_ignite_3',
    summary: 'Ultralight AMOLED fitness watch with FitSpark AI workout guidance, Nightly Recharge recovery metrics, and Hill Splitter for trail runners at an accessible price.',
    score: 8.5,
    price: '$299',
    specs: { Display: '43mm AMOLED 416x416', 'Battery Life': '5 days / 30hr GPS', 'Health Sensors': 'HRV, SpO2, Skin Temp', GPS: 'GPS/GLONASS/Galileo', Weight: '35g' },
  },
  {
    rank: 5,
    name: 'Fitbit Charge 6',
    href: '/articles/fitbit_charge_6',
    summary: 'Best budget fitness tracker with on-device GPS, ECG, Google Wallet NFC, and 7-day battery in a slim, comfortable band for casual health monitoring.',
    score: 8.5,
    price: '$159',
    badge: 'budget-pick' as const,
    specs: { Display: '0.86-inch AMOLED band', 'Battery Life': '7 days', 'Health Sensors': 'ECG, SpO2, cEDA Stress', GPS: 'Built-in GPS', Payments: 'Google Wallet NFC' },
  },
];

const quickPicks = [
  { label: 'Best Overall', name: 'Garmin Fenix 7 Pro', href: '/articles/garmin_fenix_7_pro', score: 9.3, price: '$599' },
  { label: 'Best Value', name: 'Garmin Forerunner 265', href: '/articles/garmin_forerunner_265', score: 9.0, price: '$449' },
  { label: 'Budget Pick', name: 'Fitbit Charge 6', href: '/articles/fitbit_charge_6', score: 8.5, price: '$159' },
];

export default function Top5FitnessWatchesPage() {
  return (
    <div className="min-h-screen bg-neutral-50">
      <Breadcrumb items={[
        { label: 'Home', href: '/' },
        { label: 'Best Of', href: '/best' },
        { label: 'Wearables', href: '/best/wearables' },
        { label: 'Top 5 Fitness Watches' },
      ]} />

      <div className="bg-gradient-to-br from-primary to-primary-dark px-6 py-10 text-white">
        <div className="mx-auto max-w-content">
          <SectionLabel className="text-white/70">Buying Guide</SectionLabel>
          <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">Top 5 Fitness Watches 2025</h1>
          <p className="mt-2 max-w-2xl text-base text-white/80">
            The best GPS sports watches tested for tracking accuracy, training load analysis, heart rate monitoring, and real-world athletic performance across running, cycling, and triathlon.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {['GPS Tracking', 'Heart Rate Monitoring', 'Training Load Analysis'].map((tag) => (
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
                {fitnessWatches.map((watch, i) => (
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
              <h2 className="mb-4 text-lg font-bold text-neutral-900">How We Test Fitness Watches</h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {[
                  { title: 'GPS Accuracy', desc: 'Route traces compared against reference-grade GPS devices across urban, trail, and open-terrain environments over multiple weeks of real-world testing.' },
                  { title: 'Training Metrics', desc: 'Heart rate zone accuracy validated against chest strap reference devices during interval, tempo, and long endurance efforts. VO2 Max and Training Readiness scores tracked longitudinally.' },
                  { title: 'Battery Life', desc: 'Real-world battery testing in standard smartwatch mode, continuous GPS mode, and multi-band GPS mode. Solar charging benefit measured under controlled outdoor conditions.' },
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
                  { href: '/best/wearables/top-5-smartwatches', label: 'Top 5 Smartwatches', desc: '5 reviewed' },
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
                {fitnessWatches.map((watch) => (
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
