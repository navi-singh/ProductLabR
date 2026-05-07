import { Metadata } from 'next';
import { Breadcrumb } from '@/components/Breadcrumb';
import { SectionLabel } from '@/components/SectionLabel';
import { QuickPicks } from '@/components/QuickPicks';
import { RankedProductCard } from '@/components/RankedProductCard';
import { Newsletter } from '@/components/Newsletter';
import AdBanner from '@/components/ads/AdBanner';
import { ADSENSE_CONFIG } from '@/lib/adsense-config';
import { getStationsUnderPrice, getQuickPicks } from '@/lib/power-station-data';

export const metadata: Metadata = {
  title: 'Best Portable Power Stations Under $1,000 (2025)',
  description: 'Top-rated portable power stations under $1,000 — mid-range units offering the best value per dollar.',
};

export default function Under1000Page() {
  const stations = getStationsUnderPrice(1000);
  const quickPicks = getQuickPicks(stations);

  return (
    <div className="min-h-screen bg-neutral-50">
      <Breadcrumb items={[
        { label: 'Home', href: '/' },
        { label: 'Best Of', href: '/best' },
        { label: 'Power Stations', href: '/best/power-stations' },
        { label: 'Under $1,000' },
      ]} />

      <div className="bg-gradient-to-br from-primary to-primary-dark px-6 py-10 text-white">
        <div className="mx-auto max-w-content">
          <SectionLabel className="text-white/70">Buying Guide</SectionLabel>
          <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">Best Portable Power Stations Under $1,000</h1>
          <p className="mt-2 max-w-2xl text-base text-white/80">
            Top-rated mid-range power stations offering the best value per dollar — expert tested for real-world camping, backup, and off-grid use.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {['Under $1,000', 'Mid-Range', 'Best Value'].map((tag) => (
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
              <h2 className="mb-4 text-lg font-bold text-neutral-900">Choosing a Power Station Under $1,000</h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {[
                  {
                    title: '1kWh vs 2kWh — What\'s the Right Size?',
                    items: [
                      '1kWh powers a fridge for ~6 hours or laptop for ~10 charges',
                      '2kWh doubles runtime and handles more simultaneous loads',
                      '2kWh units typically weigh 40–55 lbs vs 20–30 lbs for 1kWh',
                      'Most buyers at this budget land in the 1–1.5kWh sweet spot',
                    ],
                  },
                  {
                    title: 'Key Specs to Prioritize',
                    items: [
                      'Solar input: 600W+ for meaningful off-grid charging',
                      'LiFePO4 chemistry for 3,000+ cycle lifespan',
                      'USB-C 100W+ for laptop fast charging',
                      '5+ AC outlets for multi-device setups',
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
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-primary">Capacity Guide</h3>
              <div className="space-y-2 text-xs text-neutral-600">
                <p><strong>500Wh:</strong> Weekend camping trip. Charges phones, runs a fan, powers a small light.</p>
                <p><strong>1,000Wh:</strong> Extended camping or day-long outages. Runs a mini-fridge for ~6 hours.</p>
                <p><strong>2,000Wh:</strong> Home backup essentials. Powers a refrigerator, lights, and device charging overnight.</p>
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
