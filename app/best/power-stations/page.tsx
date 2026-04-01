import { Metadata } from 'next';
import Link from 'next/link';
import { Breadcrumb } from '@/components/Breadcrumb';
import { SectionLabel } from '@/components/SectionLabel';
import { Newsletter } from '@/components/Newsletter';
import AdBanner from '@/components/ads/AdBanner';
import { ADSENSE_CONFIG } from '@/lib/adsense-config';

export const metadata: Metadata = {
  title: 'Best Power Stations 2025 - Expert Reviews & Buying Guides',
  description: 'Expert-tested portable power solutions for every need and budget. From camping power stations to whole-home backup systems.',
};

const powerStationCategories = [
  {
    title: 'Portable Power Stations',
    description: 'Versatile power stations for camping, emergencies, and outdoor activities',
    href: '/best/power-stations/portable-power-stations',
    count: 7,
    priceRange: '$299 – $3,999',
    features: ['500Wh – 3000Wh capacity', 'Multiple output ports', 'Solar charging', 'Portable design'],
  },
  {
    title: 'House Backup Power Stations',
    description: 'High-capacity units for whole-home backup during outages',
    href: '/best/power-stations/house-backup-power-stations',
    count: 4,
    priceRange: '$2,999 – $8,999',
    features: ['3000Wh+ capacity', 'Home integration', 'Transfer switches', 'Extended runtime'],
  },
  {
    title: 'Camping Power Stations',
    description: 'Compact and lightweight power solutions for outdoor adventures',
    href: '/best/power-stations/camping-power-stations',
    count: 5,
    priceRange: '$199 – $1,499',
    features: ['200Wh – 1000Wh capacity', 'Ultra-portable', 'Weather resistant', 'Silent operation'],
  },
  {
    title: 'Carry-On Power Stations',
    description: 'TSA-approved power banks for travel and airline carry-on',
    href: '/best/power-stations/carry-on-power-stations',
    count: 3,
    priceRange: '$99 – $399',
    features: ['Under 100Wh capacity', 'TSA compliant', 'Compact design', 'Fast charging'],
  },
];

export default function PowerStationsHub() {
  return (
    <div className="min-h-screen bg-neutral-50">
      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Best Of', href: '/best' }, { label: 'Power Stations' }]} />

      <div className="bg-gradient-to-br from-primary to-primary-dark px-6 py-10 text-white">
        <div className="mx-auto max-w-content">
          <SectionLabel className="text-white/70">Buying Guide</SectionLabel>
          <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">Best Power Stations 2025</h1>
          <p className="mt-2 max-w-2xl text-base text-white/80">
            Expert-tested portable power solutions for every need and budget. 19+ models tested for performance, reliability, and value.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {['19+ Models Tested', 'Real-World Performance', 'All Budgets Covered'].map((tag) => (
              <span key={tag} className="rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs text-white/90">{tag}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-content px-4 py-8 sm:px-6">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[7fr_3fr]">
          <main className="space-y-6">
            <div>
              <SectionLabel>Categories</SectionLabel>
              <div className="space-y-4">
                {powerStationCategories.map((category) => (
                  <div key={category.title} className="rounded-xl border border-neutral-200 bg-white p-5">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div className="flex-1">
                        <h2 className="text-base font-bold text-neutral-900">{category.title}</h2>
                        <p className="mt-1 text-[13px] text-neutral-500">{category.description}</p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {category.features.map((feature) => (
                            <span key={feature} className="rounded-full bg-primary-lightest px-2.5 py-0.5 text-[11px] font-medium text-primary">{feature}</span>
                          ))}
                        </div>
                      </div>
                      <div className="flex flex-col items-start gap-2 sm:items-end">
                        <div className="text-xs text-neutral-400">{category.priceRange}</div>
                        <div className="text-xs text-neutral-400">{category.count} models reviewed</div>
                        <Link href={category.href} className="inline-flex items-center rounded-md bg-primary px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-primary-dark">
                          View Guide →
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <AdBanner adSlot={ADSENSE_CONFIG.adSlots.categoryBottom} adFormat="auto" className="rounded-lg" />

            <div className="rounded-xl bg-gradient-to-br from-primary-lightest to-primary-light/20 p-6">
              <SectionLabel>Buying Guide</SectionLabel>
              <h2 className="mb-4 text-lg font-bold text-neutral-900">How to Choose the Right Power Station</h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {[
                  {
                    title: 'Capacity Considerations',
                    items: ['Under 500Wh: Phones, tablets, small devices', '500–1000Wh: Laptops, lights, small appliances', '1000–2000Wh: Refrigerators, power tools, camping', '2000Wh+: Home backup, large appliances'],
                  },
                  {
                    title: 'Key Features to Consider',
                    items: ['Output ports (AC, USB-C, DC, wireless)', 'Charging speed and methods', 'Weight and portability', 'Battery chemistry (LiFePO4 vs Li-ion)', 'Warranty and customer support'],
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
                {powerStationCategories.map((cat) => (
                  <li key={cat.href}>
                    <Link href={cat.href} className="text-neutral-600 hover:text-primary hover:underline">{cat.title}</Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-xl bg-gradient-to-br from-primary-lightest to-primary-light/20 p-4">
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-primary">Quick Finder</h3>
              <div className="space-y-2 text-sm">
                {[
                  { label: 'Budget Pick', value: 'Under $500' },
                  { label: 'Best Overall', value: '$1,000–$2,000' },
                  { label: 'Home Backup', value: '$3,000+' },
                  { label: 'Travel Friendly', value: 'Under 100Wh' },
                ].map((item) => (
                  <div key={item.label} className="flex justify-between">
                    <span className="text-neutral-600">{item.label}</span>
                    <span className="font-medium text-primary">{item.value}</span>
                  </div>
                ))}
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
