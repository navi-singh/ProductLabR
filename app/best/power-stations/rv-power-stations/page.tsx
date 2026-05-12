import { Metadata } from 'next';
import { Breadcrumb } from '@/components/Breadcrumb';
import { SectionLabel } from '@/components/SectionLabel';
import { QuickPicks } from '@/components/QuickPicks';
import { RankedProductCard } from '@/components/RankedProductCard';
import { Newsletter } from '@/components/Newsletter';
import AdBanner from '@/components/ads/AdBanner';
import { ADSENSE_CONFIG } from '@/lib/adsense-config';
import { getStationsByFeature, getQuickPicks } from '@/lib/power-station-data';

export const metadata: Metadata = {
  title: 'Best Power Stations for RV 2025 — 30A & Solar Ready',
  description: 'Top-rated power stations with 30A RV outlets and solar charging. Expert tested for RV and trailer use.',
};

export default function RvPowerStationsPage() {
  const stations = getStationsByFeature('30a-rv');
  const quickPicks = getQuickPicks(stations);

  return (
    <div className="min-h-screen bg-neutral-50">
      <Breadcrumb items={[
        { label: 'Home', href: '/' },
        { label: 'Best Of', href: '/best' },
        { label: 'Power Stations', href: '/best/power-stations' },
        { label: 'RV Power Stations' },
      ]} />

      <div className="bg-gradient-to-br from-primary to-primary-dark px-6 py-10 text-white">
        <div className="mx-auto max-w-content">
          <SectionLabel className="text-white/70">Buying Guide</SectionLabel>
          <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">Best Power Stations for RV 2025</h1>
          <p className="mt-2 max-w-2xl text-base text-white/80">
            Power stations with genuine 30A RV outlets and solar charging — expert tested for full-time RV and trailer use.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {['30A RV Outlet', 'Solar Ready', 'High Capacity'].map((tag) => (
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
                {stations.map((station, i) => (
                  <div key={station.slug}>
                    <RankedProductCard
                      rank={i + 1}
                      name={station.title}
                      href={`/articles/${station.slug}`}
                      image={station.image}
                      summary={station.subtitle}
                      score={station.score}
                      specs={station.specs}
                    />
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
              <SectionLabel>Buying Guide</SectionLabel>
              <h2 className="mb-4 text-lg font-bold text-neutral-900">Choosing a Power Station for Your RV</h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {[
                  {
                    title: '30A vs 50A Service',
                    items: [
                      'Most RVs use 30A (3,600W) service',
                      '50A RVs need 240V split-phase',
                      'Check outlet type: TT-30 (30A) vs NEMA 14-50 (50A)',
                      'Inverter must exceed 3,600W to fully support 30A loads',
                    ],
                  },
                  {
                    title: 'Solar for RV Use',
                    items: [
                      '800W+ solar input recommended for full-day use',
                      'Dual solar ports allow mixed panel configurations',
                      'MPPT charge controllers maximize efficiency',
                      'Budget 200W of panels per 1,000Wh of battery capacity',
                    ],
                  },
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
                {stations.slice(0, 8).map((s, i) => (
                  <li key={s.slug}>
                    <a href={`#rank-${i + 1}`} className="text-neutral-600 hover:text-primary">
                      #{i + 1} {s.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-xl bg-gradient-to-br from-primary-lightest to-primary-light/20 p-4">
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-primary">30A vs 50A Guide</h3>
              <div className="space-y-2 text-xs text-neutral-600">
                <p><strong>30A (TT-30):</strong> 120V single-phase, 3,600W max. Used by most travel trailers and smaller Class C/B motorhomes.</p>
                <p><strong>50A (NEMA 14-50):</strong> 240V split-phase, 12,000W max. Required for large Class A motorhomes with multiple AC units.</p>
                <p>Verify your RV&apos;s shore power cord before purchasing — the pedestal outlet type determines which service you need.</p>
              </div>
            </div>

            <AdBanner adSlot={ADSENSE_CONFIG.adSlots.sidebar} adFormat="rectangle" style={{ minHeight: 250 }} className="rounded-lg" />

            <Newsletter />
          </aside>
        </div>
      </div>
    </div>
  );
}
