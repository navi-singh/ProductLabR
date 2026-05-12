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
  title: 'Best Power Stations for CPAP Machines 2025',
  description: 'Best power stations for CPAP machines — quiet, reliable, and with enough capacity for overnight use.',
};

export default function ForCpapPage() {
  const stations = getStationsByFeature('cpap');
  const quickPicks = getQuickPicks(stations);

  return (
    <div className="min-h-screen bg-neutral-50">
      <Breadcrumb items={[
        { label: 'Home', href: '/' },
        { label: 'Best Of', href: '/best' },
        { label: 'Power Stations', href: '/best/power-stations' },
        { label: 'For CPAP' },
      ]} />

      <div className="bg-gradient-to-br from-primary to-primary-dark px-6 py-10 text-white">
        <div className="mx-auto max-w-content">
          <SectionLabel className="text-white/70">Buying Guide</SectionLabel>
          <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">Best Power Stations for CPAP Machines 2025</h1>
          <p className="mt-2 max-w-2xl text-base text-white/80">
            Quiet, reliable power stations with enough capacity for multiple nights of CPAP use — expert tested for sleep therapy dependability.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {['CPAP Compatible', '500–1500Wh', 'Quiet Operation'].map((tag) => (
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
              <h2 className="mb-4 text-lg font-bold text-neutral-900">Choosing a Power Station for Your CPAP</h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {[
                  {
                    title: 'How Many Nights Per Charge?',
                    items: [
                      'Average CPAP draws 30–60W (45W is a good estimate)',
                      '1,000Wh ÷ 45W = ~22 hours = 2–3 nights of 8-hour sessions',
                      'DC mode (12V) is 20–30% more efficient than AC mode',
                      'Humidifier adds 15–30W — budget accordingly',
                    ],
                  },
                  {
                    title: 'DC Mode vs AC Mode for CPAP',
                    items: [
                      'DC mode bypasses the inverter for better efficiency',
                      'Most CPAP machines accept 12V DC input via adapter',
                      'AC mode is simpler but wastes 15–25% energy in conversion',
                      'Units with dedicated DC ports are preferred for CPAP users',
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
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-primary">CPAP Runtime Table</h3>
              <div className="space-y-2 text-xs text-neutral-600">
                <p>CPAP machines draw <strong>30–60W on average</strong> (use 45W as your estimate).</p>
                <div className="mt-2 space-y-1">
                  <p><strong>500Wh</strong> → 8–16 nights (8-hr sessions, no humidifier)</p>
                  <p><strong>1,000Wh</strong> → 16–33 nights</p>
                  <p><strong>1,500Wh</strong> → 25–50 nights</p>
                </div>
                <p className="mt-2">Use DC mode when available to extend runtime by 20–30%.</p>
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
