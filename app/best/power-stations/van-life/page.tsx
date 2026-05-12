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
  title: 'Best Power Stations for Van Life 2025',
  description: 'Best power stations for van life — compact, solar-capable, and under 30 lbs. Expert tested for life on the road.',
};

export default function VanLifePage() {
  const stations = getStationsByFeature('van-life');
  const quickPicks = getQuickPicks(stations);

  return (
    <div className="min-h-screen bg-neutral-50">
      <Breadcrumb items={[
        { label: 'Home', href: '/' },
        { label: 'Best Of', href: '/best' },
        { label: 'Power Stations', href: '/best/power-stations' },
        { label: 'Van Life' },
      ]} />

      <div className="bg-gradient-to-br from-primary to-primary-dark px-6 py-10 text-white">
        <div className="mx-auto max-w-content">
          <SectionLabel className="text-white/70">Buying Guide</SectionLabel>
          <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">Best Power Stations for Van Life 2025</h1>
          <p className="mt-2 max-w-2xl text-base text-white/80">
            Compact, solar-capable power stations under 30 lbs — expert tested for life on the road, off-grid adventures, and full-time van dwelling.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {['Under 30 lbs', 'Solar Capable', 'Compact'].map((tag) => (
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
              <h2 className="mb-4 text-lg font-bold text-neutral-900">Choosing a Power Station for Van Life</h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {[
                  {
                    title: 'How to Size for Van Life',
                    items: [
                      'Calculate daily watt-hours: add up all device loads × hours used',
                      'Typical van setup: 800–1,500Wh per day',
                      'Size battery to 2–3 days of use without solar',
                      'Plan solar to cover daily use + 20% for inefficiencies',
                    ],
                  },
                  {
                    title: 'Solar vs Shore Power Strategy',
                    items: [
                      'Solar handles daily use in good sun conditions',
                      'Shore power (campground hookups) fills gaps on cloudy days',
                      'DC-DC charging from alternator supplements both',
                      '400–800W of solar covers most van life daily needs',
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
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-primary">Van Power Budget</h3>
              <div className="space-y-1.5 text-xs text-neutral-600">
                <p>Typical daily van power draw:</p>
                <div className="mt-1 space-y-0.5">
                  <p>Fridge: <strong>50W</strong> × 24h = 1,200Wh</p>
                  <p>Lights: <strong>20W</strong> × 5h = 100Wh</p>
                  <p>Laptop: <strong>60W</strong> × 4h = 240Wh</p>
                  <p>Misc: <strong>20W</strong> × 5h = 100Wh</p>
                </div>
                <p className="mt-2 font-medium">Total: ~1,050Wh/day. Size your battery to 2,000–3,000Wh for 2–3 days of autonomy.</p>
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
