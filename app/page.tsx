import { PostsList } from '@/components/PostsList';
import { Top10Popular } from '@/components/Top10Popular';
import { OptimizedImage } from '@/components/OptimizedImage';
import AdBanner from '@/components/ads/AdBanner';
import ResponsiveAd from '@/components/ads/ResponsiveAd';
import { ADSENSE_CONFIG } from '@/lib/adsense-config';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Product Lab - Expert Reviews You Can Trust',
  description: 'Expert reviews of power stations, cameras, and tech gear. Professional testing and honest comparisons to help you make informed buying decisions.'
};


export default function Home() {
  const trendingCategories = [
    { title: 'Best Power Stations', href: '/best/power-stations', isActive: true },
    { title: 'Best Cameras', href: '/best/cameras' },
    { title: 'Best Home Backup', href: '/best/power-stations/house-backup-power-stations' },
    { title: 'Expert Insights', href: '/best' }
  ];

  const categoryFeaturedProducts = [
    {
      title: 'Power Stations & Portable Power',
      subtitle: 'Portable Power Stations, House Backup Systems, Camping Power or see all in Power Stations',
      image: '/images/posts/delta_3_pro/EcoFlow-Delta-Pro-3.jpg',
      featuredProducts: [
        {
          title: 'Best Portable Power Stations',
          description: 'The best portable power solutions for camping, home backup, and off-grid adventures.',
          href: '/best/power-stations/portable-power-stations',
          image: '/images/posts/bluetti_ac180/AC180_main.webp'
        },
        {
          title: 'Best House Backup Power',
          description: 'High-capacity power stations designed for whole-home backup during outages.',
          href: '/best/power-stations/house-backup-power-stations',
          image: '/images/posts/delta_3_pro/EcoFlow-Delta-Pro-3.jpg'
        },
        {
          title: 'Best Camping Power Stations',
          description: 'Compact and lightweight power solutions perfect for outdoor adventures.',
          href: '/best/power-stations/camping-power-stations',
          image: '/images/item.png'
        }
      ]
    },
    {
      title: 'Cameras & Photography',
      subtitle: 'Hybrid Cameras, Professional Cameras, Budget Options or see all in Cameras',
      image: '/images/posts/lumix_s5ii.webp',
      featuredProducts: [
        {
          title: 'Best Hybrid Cameras',
          description: 'Top cameras excelling at both photography and videography with 8K video capability.',
          href: '/best/cameras/hybrid-cameras',
          image: '/images/posts/lumix_s5ii.webp'
        },
        {
          title: 'Best Professional Cameras',
          description: 'Flagship cameras delivering ultimate performance for professional work.',
          href: '/best/cameras/professional-cameras',
          image: '/images/item.png'
        },
        {
          title: 'Best Budget Hybrid Cameras',
          description: 'Professional photo and video performance without breaking the bank.',
          href: '/best/cameras/hybrid-cameras-under-3000',
          image: '/images/item.png'
        }
      ]
    }
  ];

  return (
    <div className="flex min-h-screen flex-col">
      {/* Trending Section at Top */}
      <section className="bg-gradient-to-r from-trustworthy/5 to-purple-500/5 border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex items-center overflow-x-auto py-4">
            <span className="text-sm font-semibold text-gray-600 mr-6 whitespace-nowrap">
              TRENDING
            </span>
            <div className="flex space-x-1">
              {trendingCategories.map((category) => (
                <Link
                  key={category.title}
                  href={category.href}
                  className={`px-6 py-3 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                    category.isActive
                      ? 'bg-trustworthy text-white shadow-md'
                      : 'text-gray-600 hover:text-trustworthy hover:bg-white/50'
                  }`}
                >
                  {category.title}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <main className="container mx-auto flex-grow px-4 py-8">
        {/* Hero Section */}
        <section className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 text-gray-800">
            Reviews You Can Rely On
          </h1>
          <p className="text-xl text-gray-700 max-w-2xl mx-auto mb-4 font-medium">
            Professional. Thorough. Powered by Testing.
          </p>
          <p className="text-lg text-gray-600 max-w-4xl mx-auto mb-8 leading-relaxed">
            Product Lab is founded on the principle of honest, objective reviews. Our experts test thousands of products each year using thoughtful test plans that bring out key performance differences between competing products. We provide comprehensive testing and detailed analysis to help you make informed purchasing decisions.
          </p>
          <Link 
            href="/best" 
            className="inline-block bg-purple-500 text-white px-8 py-3 rounded-xl font-semibold hover:bg-purple-600 transition-colors shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            Explore Best Products
          </Link>
        </section>

        {/* TOP HOME AD */}
        <ResponsiveAd 
          mobileAdSlot={ADSENSE_CONFIG.adSlots.homeHeaderMobile}
          desktopAdSlot={ADSENSE_CONFIG.adSlots.homeHeaderDesktop}
          className="mb-8 text-center"
        />

        {/* Category Sections */}
        {categoryFeaturedProducts.map((category, categoryIndex) => (
          <section key={category.title} className="mb-12">
            <div className="border-b border-gray-200 pb-3 mb-6">
              <h2 className="text-3xl font-bold text-gray-800">{category.title}</h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {category.featuredProducts.map((product, productIndex) => (
                <Link key={product.title} href={product.href} className="group">
                  <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden">
                    <div className="relative h-36 overflow-hidden bg-gray-100">
                      <OptimizedImage 
                        src={product.image} 
                        alt={`${product.title} - Expert review and comparison`}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        priority={categoryIndex === 0 && productIndex === 0}
                      />
                      {productIndex === 0 && (
                        <div className="absolute top-2 left-2 bg-purple-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                          Top Pick
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-gray-800 mb-2 group-hover:text-purple-600 transition-colors">
                        {product.title}
                      </h3>
                      <p className="text-gray-600 text-xs leading-relaxed">
                        {product.description}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* AD BETWEEN CATEGORIES - After first category */}
            {categoryIndex === 0 && (
              <AdBanner 
                adSlot={ADSENSE_CONFIG.adSlots.homeBetweenCategories}
                adFormat="rectangle"
                className="my-8 text-center"
              />
            )}
          </section>
        ))}


        {/* Latest Reviews Sidebar */}
        <section>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-3">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Recent Product Reviews</h2>
              <PostsList />
            </div>
            <aside className="space-y-8">
              <Top10Popular />
            </aside>
        </div>
        </section>
      </main>
    </div>
  );
}
