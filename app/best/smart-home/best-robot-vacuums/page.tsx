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
  title: 'Best Robot Vacuums 2025 - Expert Reviews',
  description: 'Top robot vacuums tested for suction power, navigation, mopping, and pet hair. Find the best robot vacuum for your home and floor type.',
};

interface VacuumEntry {
  rank: number; name: string; href: string; image: string; summary: string;
  score: number; price: string; badge?: 'best-overall' | 'best-value' | 'budget-pick';
  specs?: Record<string, string>;
}

const vacuums: VacuumEntry[] = [
  {
    rank: 1,
    name: 'Roborock S8 MaxV Ultra',
    href: '/articles/roborock_s8_maxv_ultra',
    image: '/images/item.png',
    summary: 'The most capable robot vacuum available with 10,000Pa suction, sonic mopping, self-emptying dock, and Reactive AI 3.0 obstacle avoidance.',
    score: 9.4,
    price: '$1,599',
    badge: 'best-overall' as const,
    specs: { Suction: '10,000 Pa', Mop: 'Sonic vibration', 'Auto-Empty': 'Yes (auto wash too)', Battery: '180 min', Navigation: 'ReactiveAI 3.0' },
  },
  {
    rank: 2,
    name: 'iRobot Roomba Combo j9+',
    href: '/articles/irobot_roomba_combo_j9_plus',
    image: '/images/item.png',
    summary: 'Best robot vacuum for pet hair with powerful suction, retractable mop that lifts on carpets, and excellent iRobot OS mapping and automation.',
    score: 9.1,
    price: '$1,099',
    badge: 'best-value' as const,
    specs: { Suction: '10× Power Boost', Mop: 'Retractable pad', 'Auto-Empty': 'Yes', Battery: '75 min', Navigation: 'PrecisionVision' },
  },
  {
    rank: 3,
    name: 'Eufy RoboVac 11S',
    href: '/articles/eufy_robovac_11s',
    image: '/images/item.png',
    summary: 'Ultra-slim 2.85-inch profile fits under most furniture, whisper-quiet operation, and reliable cleaning on hard floors at an unbeatable price.',
    score: 8.3,
    price: '$199',
    badge: 'budget-pick' as const,
    specs: { Suction: '1300 Pa', Mop: 'No', 'Auto-Empty': 'No', Battery: '100 min', Navigation: 'Gyroscope (no mapping)' },
  },
  {
    rank: 4,
    name: 'Dreame L20 Ultra',
    href: '/articles/dreame_l20_ultra',
    image: '/images/item.png',
    summary: 'Impressive all-in-one robot vacuum and mop with 7,000Pa suction, hot water mop washing, and excellent LiDAR navigation at a competitive price.',
    score: 9.2,
    price: '$1,299',
    specs: { Suction: '7,000 Pa', Mop: 'Hot water wash', 'Auto-Empty': 'Yes', Battery: '210 min', Navigation: 'LiDAR + AI' },
  },
];

const quickPicks = [
  { label: 'Best Overall', name: 'Roborock S8 MaxV Ultra', href: '/articles/roborock_s8_maxv_ultra', score: 9.4, price: '$1,599' },
  { label: 'Best for Pet Hair', name: 'iRobot Roomba Combo j9+', href: '/articles/irobot_roomba_combo_j9_plus', score: 9.1, price: '$1,099' },
  { label: 'Budget Pick', name: 'Eufy RoboVac 11S', href: '/articles/eufy_robovac_11s', score: 8.3, price: '$199' },
];

export default function BestRobotVacuumsPage() {
  return (
    <div className="min-h-screen bg-neutral-50">
      <Breadcrumb items={[
        { label: 'Home', href: '/' },
        { label: 'Best Of', href: '/best' },
        { label: 'Smart Home', href: '/best/smart-home' },
        { label: 'Best Robot Vacuums' },
      ]} />

      <div className="bg-gradient-to-br from-primary to-primary-dark px-6 py-10 text-white">
        <div className="mx-auto max-w-content">
          <SectionLabel className="text-white/70">Buying Guide</SectionLabel>
          <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">Best Robot Vacuums 2025</h1>
          <p className="mt-2 max-w-2xl text-base text-white/80">
            Top robot vacuums tested across all floor types for suction performance, navigation accuracy, mopping quality, and obstacle avoidance.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {['Multi-Floor Type Testing', 'Pet Hair Performance', 'Navigation Accuracy Rated'].map((tag) => (
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
                {vacuums.map((vacuum, i) => (
                  <div key={vacuum.rank}>
                    <RankedProductCard {...vacuum} />
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
              <h2 className="mb-4 text-lg font-bold text-neutral-900">How We Test Robot Vacuums</h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {[
                  { title: 'Cleaning Performance', items: ['Hard floor debris pickup efficiency', 'Carpet deep cleaning with fine and coarse debris', 'Pet hair tangle resistance on brush roll', 'Corner and edge cleaning performance', 'Mopping wetness and scrubbing effectiveness'] },
                  { title: 'Navigation & Usability', items: ['Mapping accuracy and zone assignment', 'Obstacle avoidance (cables, pet waste, small objects)', 'Multi-floor map storage', 'App quality and scheduling features', 'Base station auto-emptying and washing'] },
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
                {vacuums.map((vacuum) => (
                  <li key={vacuum.rank}>
                    <Link href={vacuum.href} className="flex items-center gap-2 text-neutral-600 hover:text-primary">
                      <span className="text-[10px] text-neutral-400">#{vacuum.rank}</span>
                      {vacuum.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-xl bg-gradient-to-br from-primary-lightest to-primary-light/20 p-4">
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-primary">Related Guides</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/best/smart-home" className="text-neutral-700 hover:text-primary hover:underline">All Smart Home</Link></li>
                <li><Link href="/best/smart-home/best-smart-speakers" className="text-neutral-700 hover:text-primary hover:underline">Best Smart Speakers</Link></li>
                <li><Link href="/best/smart-home/best-video-doorbells" className="text-neutral-700 hover:text-primary hover:underline">Best Video Doorbells</Link></li>
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
