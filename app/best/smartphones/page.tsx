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
  title: 'Best Smartphones 2025 - Expert Reviews & Buying Guide',
  description: 'The best smartphones for every budget. Expert tested iPhones, Android flagships, and budget phones for performance, camera quality, and value.',
};

interface SmartphoneEntry {
  rank: number; name: string; href: string; image: string; summary: string;
  score: number; price: string; badge?: 'best-overall' | 'best-value' | 'budget-pick';
  specs?: Record<string, string>;
}

const smartphones: SmartphoneEntry[] = [
  {
    rank: 1,
    name: 'iPhone 16 Pro Max',
    href: '/best/smartphones/best-iphones',
    image: '/images/item.png',
    summary: 'Apple\'s most capable smartphone with the A18 Pro chip, camera control button, and the largest battery ever in a Pro iPhone.',
    score: 9.4,
    price: '$1,199',
    badge: 'best-overall' as const,
    specs: { Chip: 'A18 Pro', Display: '6.9" Super Retina XDR', Camera: '48MP main', Battery: '4685mAh', OS: 'iOS 18' },
  },
  {
    rank: 2,
    name: 'Samsung Galaxy S25 Ultra',
    href: '/best/smartphones/best-android-phones',
    image: '/images/item.png',
    summary: 'Samsung\'s flagship Android powerhouse with built-in S Pen, 200MP camera, and Galaxy AI features for productivity.',
    score: 9.2,
    price: '$1,299',
    badge: 'best-value' as const,
    specs: { Chip: 'Snapdragon 8 Elite', Display: '6.9" Dynamic AMOLED', Camera: '200MP main', Battery: '5000mAh', OS: 'Android 15' },
  },
  {
    rank: 3,
    name: 'Google Pixel 8a',
    href: '/best/smartphones/best-budget-phones',
    image: '/images/item.png',
    summary: 'Google\'s best value phone with flagship-level camera processing, 7 years of OS updates, and clean Android experience.',
    score: 8.9,
    price: '$499',
    badge: 'budget-pick' as const,
    specs: { Chip: 'Tensor G3', Display: '6.1" OLED', Camera: '64MP main', Battery: '4492mAh', OS: 'Android 14' },
  },
];

const quickPicks = [
  { label: 'Best Overall', name: 'iPhone 16 Pro Max', href: '/best/smartphones/best-iphones', score: 9.4, price: '$1,199' },
  { label: 'Best Android', name: 'Galaxy S25 Ultra', href: '/best/smartphones/best-android-phones', score: 9.2, price: '$1,299' },
  { label: 'Budget Pick', name: 'Google Pixel 8a', href: '/best/smartphones/best-budget-phones', score: 8.9, price: '$499' },
];

const categoryLinks = [
  { href: '/best/smartphones/best-iphones', label: 'Best iPhones', count: 4 },
  { href: '/best/smartphones/best-android-phones', label: 'Best Android Phones', count: 4 },
  { href: '/best/smartphones/best-budget-phones', label: 'Best Budget Phones', count: 4 },
];

export default function SmartphonesPage() {
  return (
    <div className="min-h-screen bg-neutral-50">
      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Best Of', href: '/best' }, { label: 'Smartphones' }]} />

      {/* Header */}
      <div className="bg-gradient-to-br from-primary to-primary-dark px-6 py-10 text-white">
        <div className="mx-auto max-w-content">
          <SectionLabel className="text-white/70">Buying Guide</SectionLabel>
          <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">Best Smartphones 2025</h1>
          <p className="mt-2 max-w-2xl text-base text-white/80">
            Expert-tested smartphones from the latest iPhone and Android flagships to the best budget picks. Find your perfect phone.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {['30+ Phones Tested', 'Camera Benchmarked', 'Battery Life Tested'].map((tag) => (
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
                {smartphones.map((phone, i) => (
                  <div key={phone.rank}>
                    <RankedProductCard {...phone} />
                    {i === 2 && (
                      <div className="mt-4">
                        <AdBanner adSlot={ADSENSE_CONFIG.adSlots.categoryBottom} adFormat="auto" className="rounded-lg" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Smartphone Categories */}
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
              <h2 className="mb-4 text-lg font-bold text-neutral-900">How We Test Smartphones</h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {[
                  { title: 'Camera Quality', desc: 'Daylight, low-light, and video testing across diverse scenes. We compare computational photography, zoom performance, and video stabilization.' },
                  { title: 'Performance', desc: 'CPU/GPU benchmark testing, multitasking, gaming, and sustained performance over time to identify thermal throttling.' },
                  { title: 'Battery & Daily Use', desc: 'Screen-on time, charging speed testing, software experience, and overall day-to-day usability assessment.' },
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
                {smartphones.map((phone) => (
                  <li key={phone.href}>
                    <Link href={phone.href} className="flex items-center gap-2 text-neutral-600 hover:text-primary">
                      <span className="text-[10px] text-neutral-400">#{phone.rank}</span>
                      {phone.name}
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
