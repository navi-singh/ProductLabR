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
  title: 'Best Solar Generators 2025 — Top Portable Solar Power Stations',
  description: 'Best solar generators with high-input charging for off-grid and emergency power. Expert tested for real-world solar performance.',
};

export default function SolarGeneratorsPage() {
  const solar = getStationsByFeature('solar');
  const kits = getStationsByFeature('solar-kit');
  const stations = [...solar, ...kits].filter((s, i, arr) => arr.findIndex((x) => x.slug === s.slug) === i);
  const quickPicks = getQuickPicks(stations);

  return (
    <div className="min-h-screen bg-neutral-50">
      <Breadcrumb items={[
        { label: 'Home', href: '/' },
        { label: 'Best Of', href: '/best' },
        { label: 'Power Stations', href: '/best/power-stations' },
        { label: 'Solar Generators' },
      ]} />

      <div className="bg-gradient-to-br from-primary to-primary-dark px-6 py-10 text-white">
        <div className="mx-auto max-w-content">
          <SectionLabel className="text-white/70">Buying Guide</SectionLabel>
          <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">Best Solar Generators 2025</h1>
          <p className="mt-2 max-w-2xl text-base text-white/80">
            Solar generators with high-input charging for off-grid and emergency power — expert tested for real-world solar performance and reliability.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {['800W+ Solar Input', 'Off-Grid Ready', 'LiFePO4 Battery'].map((tag) => (
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
                      price={station.price}
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
              <h2 className="mb-4 text-lg font-bold text-neutral-900">Choosing the Best Solar Generator</h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {[
                  {
                    title: 'How to Size Your Solar Array',
                    items: [
                      'Match panel wattage to solar input rating',
                      '200W panels per 1,000Wh battery is a good starting point',
                      'Factor in your daily energy consumption',
                      'Add 20% buffer for cloudy days and inefficiencies',
                    ],
                  },
                  {
                    title: 'MPPT vs PWM Charge Controllers',
                    items: [
                      'MPPT is 20-30% more efficient than PWM',
                      'All units on this list use MPPT controllers',
                      'PWM only makes sense for small systems under 200W',
                      'MPPT handles varying panel voltages better',
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
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-primary">Solar Sizing Rule of Thumb</h3>
              <div className="space-y-2 text-xs text-neutral-600">
                <p>Plan <strong>200W of solar panels per 1,000Wh of battery capacity</strong> as a baseline.</p>
                <p>Example: a 2,000Wh generator pairs well with 400W of panels to fully recharge in 5–6 peak sun hours.</p>
                <p>Add 20% extra panel capacity to account for shading, angle, and seasonal variation.</p>
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
