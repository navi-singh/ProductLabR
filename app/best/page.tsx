import { Metadata } from 'next';
import Link from 'next/link';
import { Breadcrumb } from '@/components/Breadcrumb';
import { SectionLabel } from '@/components/SectionLabel';
import { Newsletter } from '@/components/Newsletter';
import { OptimizedImage } from '@/components/OptimizedImage';

export const metadata: Metadata = {
  title: 'Best Products 2025 - Expert Reviews & Buying Guides | Product Lab',
  description: 'Discover the best products of 2025 with our expert reviews and comprehensive buying guides. From cameras to power stations, we test and review the top products.',
};

const bestProducts = [
  {
    id: 'portable-power-stations',
    title: 'Best Portable Power Stations 2025',
    description: 'The top-rated portable power stations for camping, home backup, and off-grid adventures. Expert tested for capacity, reliability, and value.',
    image: '/images/posts/delta_3_pro/EcoFlow-Delta-Pro-3.jpg',
    category: 'Power & Energy',
    priceRange: '$199 – $3,699',
    href: '/best/power-stations',
    badge: "Editor's Choice",
  },
  {
    id: 'cameras',
    title: 'Best Cameras 2025',
    description: 'Professional cameras, mirrorless systems, and content creation tools. Comprehensive testing for image quality, features, and performance.',
    image: '/images/posts/lumix_s5ii.webp',
    category: 'Cameras',
    priceRange: '$599 – $3,499',
    href: '/best/cameras',
  },
];

const quickCategories = [
  { name: 'Power Stations', count: 19, href: '/best/power-stations' },
  { name: 'Cameras', count: 15, href: '/best/cameras' },
  { name: 'Tech Gadgets', count: 0, href: '/best/tech-gadgets' },
  { name: 'Home & Garden', count: 0, href: '/best/home-garden' },
  { name: 'Outdoor Gear', count: 0, href: '/best/outdoor-gear' },
];

export default function BestPage() {
  return (
    <div className="min-h-screen bg-neutral-50">
      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Best Of' }]} />

      {/* Header */}
      <div className="bg-gradient-to-br from-primary to-primary-dark px-6 py-10 text-white">
        <div className="mx-auto max-w-content">
          <SectionLabel className="text-white/70">Buying Guides</SectionLabel>
          <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">Best Products of 2025</h1>
          <p className="mt-2 max-w-2xl text-base text-white/80">
            Expert-tested reviews and comprehensive buying guides. We put products through rigorous testing to help you make the best decisions.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {['25+ Products Tested', 'Independent Reviews', 'Updated Monthly'].map((tag) => (
              <span key={tag} className="rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs text-white/90">{tag}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-content px-4 py-8 sm:px-6">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[7fr_3fr]">
          {/* Main Content */}
          <main className="space-y-10">
            {/* Featured Categories */}
            <section>
              <SectionLabel>Featured Categories</SectionLabel>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                {bestProducts.map((product) => (
                  <Link key={product.id} href={product.href} className="group rounded-xl border border-neutral-200 bg-white overflow-hidden hover:shadow-md transition-shadow">
                    <div className="relative h-48 w-full overflow-hidden bg-neutral-100">
                      <OptimizedImage
                        src={product.image}
                        alt={product.title}
                        fill
                        sizes="(max-width: 640px) 100vw, 50vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {product.badge && (
                        <span className="absolute left-3 top-3 rounded-full bg-accent px-2.5 py-0.5 text-[11px] font-semibold text-white">
                          {product.badge}
                        </span>
                      )}
                    </div>
                    <div className="p-5">
                      <div className="text-[11px] font-semibold uppercase tracking-wide text-primary">{product.category}</div>
                      <h2 className="mt-1 text-base font-bold text-neutral-900 group-hover:text-primary transition-colors">{product.title}</h2>
                      <p className="mt-1.5 text-[13px] leading-relaxed text-neutral-500 line-clamp-2">{product.description}</p>
                      <div className="mt-3 flex items-center justify-between">
                        <span className="text-xs font-semibold text-neutral-700">{product.priceRange}</span>
                        <span className="text-xs font-semibold text-primary group-hover:underline">View Guide →</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>

            {/* How We Test Section */}
            <section>
              <SectionLabel>Our Process</SectionLabel>
              <div className="rounded-xl bg-gradient-to-br from-primary-lightest to-primary-light/20 p-6">
                <h2 className="mb-5 text-lg font-bold text-neutral-900">How We Test</h2>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                  {[
                    {
                      title: 'Real-World Testing',
                      desc: 'We put every product through extensive real-world scenarios to test performance, durability, and usability.',
                    },
                    {
                      title: 'Data-Driven Analysis',
                      desc: 'Our reviews include benchmarks, measurements, and quantitative analysis to provide objective insights.',
                    },
                    {
                      title: 'Expert Opinion',
                      desc: 'Our team of experts provides professional insights and recommendations based on years of experience.',
                    },
                  ].map((item) => (
                    <div key={item.title} className="rounded-lg bg-white p-4">
                      <h3 className="mb-1.5 text-sm font-semibold text-neutral-900">{item.title}</h3>
                      <p className="text-xs leading-relaxed text-neutral-500">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </main>

          {/* Sidebar */}
          <aside className="space-y-5">
            <div className="rounded-xl border border-neutral-200 bg-white p-4">
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-primary">Browse Categories</h3>
              <ul className="space-y-1">
                {quickCategories.map((cat) => (
                  <li key={cat.name}>
                    <Link
                      href={cat.href}
                      className="flex items-center justify-between rounded-md px-3 py-2 text-sm hover:bg-primary-lightest"
                    >
                      <span className="font-medium text-neutral-700">{cat.name}</span>
                      {cat.count > 0 && (
                        <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-[11px] text-neutral-500">{cat.count}</span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-xl border border-neutral-200 bg-white p-4">
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-primary">Recent Updates</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-[11px] text-neutral-400">Jan 15, 2025</p>
                  <Link href="/best/power-stations" className="text-primary hover:underline">Updated: Best Portable Power Stations</Link>
                </div>
                <div>
                  <p className="text-[11px] text-neutral-400">Jan 10, 2025</p>
                  <Link href="/best/cameras" className="text-primary hover:underline">New: Best Cameras Guide</Link>
                </div>
              </div>
            </div>

            <Newsletter title="Stay Updated" description="Get notified when we publish new reviews and buying guides." />
          </aside>
        </div>
      </div>
    </div>
  );
}
