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
  title: 'Best 4K Monitors 2025 - Expert Reviews',
  description: 'Top 4K monitors tested for color accuracy, professional workflows, and productivity. Find the best 4K monitor for creative work and everyday use.',
};

interface MonitorEntry {
  rank: number; name: string; href: string; image: string; summary: string;
  score: number; price: string; badge?: 'best-overall' | 'best-value' | 'budget-pick';
  specs?: Record<string, string>;
}

const monitors: MonitorEntry[] = [
  {
    rank: 1,
    name: 'LG 27UK850-W',
    href: '/articles/lg_27uk850w',
    image: '/images/item.png',
    summary: 'Excellent all-around 4K monitor with wide color gamut, USB-C connectivity, and accurate factory calibration for creative professionals.',
    score: 9.1,
    price: '$699',
    badge: 'best-overall' as const,
    specs: { Panel: 'IPS', Resolution: '4K UHD (3840x2160)', 'Color Accuracy': '99% sRGB', Ports: 'USB-C, HDMI 2.0, DP 1.2', Size: '27"' },
  },
  {
    rank: 2,
    name: 'Dell U2723D UltraSharp',
    href: '/articles/dell_u2723d',
    image: '/images/item.png',
    summary: 'Professional-grade IPS Black panel with stunning deep blacks, factory calibration, Thunderbolt 4 hub, and wide color gamut coverage.',
    score: 9.2,
    price: '$599',
    badge: 'best-value' as const,
    specs: { Panel: 'IPS Black', Resolution: 'QHD (2560x1440)', 'Color Accuracy': 'Delta E < 2', Ports: 'Thunderbolt 4, USB-C', Size: '27"' },
  },
  {
    rank: 3,
    name: 'ViewSonic VP2768a-4K',
    href: '/articles/viewsonic_vp2768a_4k',
    image: '/images/item.png',
    summary: 'Factory-calibrated 4K professional monitor with hardware color calibration support, wide gamut, and excellent ergonomics at a fair price.',
    score: 8.8,
    price: '$449',
    badge: 'budget-pick' as const,
    specs: { Panel: 'IPS', Resolution: '4K UHD (3840x2160)', 'Color Accuracy': '100% sRGB, 99% Adobe RGB', Ports: 'USB-C, HDMI, DP', Size: '27"' },
  },
  {
    rank: 4,
    name: 'BenQ PD2725U',
    href: '/articles/benq_pd2725u',
    image: '/images/item.png',
    summary: 'Designer-focused 4K monitor with hot key controller, thunderbolt 3, and excellent color science targeting graphic design and photography workflows.',
    score: 9.0,
    price: '$699',
    specs: { Panel: 'IPS', Resolution: '4K UHD (3840x2160)', 'Color Accuracy': '100% sRGB, 95% DCI-P3', Ports: 'Thunderbolt 3, USB-C', Size: '27"' },
  },
];

const quickPicks = [
  { label: 'Best Overall', name: 'LG 27UK850-W', href: '/articles/lg_27uk850w', score: 9.1, price: '$699' },
  { label: 'Best for Work', name: 'Dell U2723D', href: '/articles/dell_u2723d', score: 9.2, price: '$599' },
  { label: 'Budget Pick', name: 'ViewSonic VP2768a-4K', href: '/articles/viewsonic_vp2768a_4k', score: 8.8, price: '$449' },
];

export default function Best4KMonitorsPage() {
  return (
    <div className="min-h-screen bg-neutral-50">
      <Breadcrumb items={[
        { label: 'Home', href: '/' },
        { label: 'Best Of', href: '/best' },
        { label: 'Monitors', href: '/best/monitors' },
        { label: 'Best 4K Monitors' },
      ]} />

      <div className="bg-gradient-to-br from-primary to-primary-dark px-6 py-10 text-white">
        <div className="mx-auto max-w-content">
          <SectionLabel className="text-white/70">Buying Guide</SectionLabel>
          <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">Best 4K Monitors 2025</h1>
          <p className="mt-2 max-w-2xl text-base text-white/80">
            Top 4K monitors tested with colorimeter measurements for accuracy, gamut coverage, and professional workflow suitability for designers and photographers.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {['Factory Calibration Verified', 'Color Gamut Measured', 'Professional Workflow Tested'].map((tag) => (
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
                {monitors.map((monitor, i) => (
                  <div key={monitor.rank}>
                    <RankedProductCard {...monitor} />
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
              <h2 className="mb-4 text-lg font-bold text-neutral-900">How We Test 4K Monitors</h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {[
                  { title: 'Color Accuracy Testing', items: ['Delta E measurements before and after calibration', 'sRGB, Adobe RGB, and DCI-P3 gamut coverage', 'White point accuracy at D65 standard', 'Gamma curve tracking across luminance levels', 'Uniformity testing across all monitor zones'] },
                  { title: 'Professional Workflow Needs', items: ['Photo editing: sRGB and Adobe RGB coverage key', 'Video: DCI-P3 or Rec. 2020 HDR support', 'Design: Wide gamut + accurate white balance', 'USB-C/Thunderbolt for laptop connectivity', 'Ergonomics: Height, tilt, swivel, pivot'] },
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
                {monitors.map((monitor) => (
                  <li key={monitor.rank}>
                    <Link href={monitor.href} className="flex items-center gap-2 text-neutral-600 hover:text-primary">
                      <span className="text-[10px] text-neutral-400">#{monitor.rank}</span>
                      {monitor.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-xl bg-gradient-to-br from-primary-lightest to-primary-light/20 p-4">
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-primary">Related Guides</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/best/monitors" className="text-neutral-700 hover:text-primary hover:underline">All Monitors</Link></li>
                <li><Link href="/best/monitors/best-gaming-monitors" className="text-neutral-700 hover:text-primary hover:underline">Best Gaming Monitors</Link></li>
                <li><Link href="/best/monitors/best-ultrawide-monitors" className="text-neutral-700 hover:text-primary hover:underline">Best Ultrawide Monitors</Link></li>
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
