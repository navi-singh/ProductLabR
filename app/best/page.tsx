import { Metadata } from 'next';
import Link from 'next/link';
import { Card } from '@/components/card';
import RatingBadge from '@/components/article/RatingBadge';

export const metadata: Metadata = {
  title: 'Best Products 2025 - Expert Reviews & Buying Guides | Product Lab',
  description: 'Discover the best products of 2025 with our expert reviews and comprehensive buying guides. From cameras to power stations, we test and review the top products.',
};

interface BestProduct {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  rating: number;
  priceRange: string;
  href: string;
  badge?: string;
}

const bestProducts: BestProduct[] = [
  {
    id: 'portable-power-stations',
    title: 'Best Portable Power Stations 2025',
    description: 'The top-rated portable power stations for camping, home backup, and off-grid adventures. Expert tested for capacity, reliability, and value.',
    image: '/images/posts/delta_3_pro/EcoFlow-Delta-Pro-3.jpg',
    category: 'Power & Energy',
    rating: 4.8,
    priceRange: '$199 - $3,699',
    href: '/best/power-stations',
    badge: 'Editor\'s Choice'
  },
  {
    id: 'cameras',
    title: 'Best Cameras 2025',
    description: 'Professional cameras, mirrorless systems, and content creation tools. Comprehensive testing for image quality, features, and performance.',
    image: '/images/posts/lumix_s5ii.webp',
    category: 'Cameras',
    rating: 4.7,
    priceRange: '$599 - $3,499',
    href: '/best/cameras'
  }
];

const quickCategories = [
  { name: 'Power Stations', count: 19, href: '/best/power-stations' },
  { name: 'Cameras', count: 15, href: '/best/cameras' },
  { name: 'Tech Gadgets', count: 0, href: '/best/tech-gadgets' },
  { name: 'Home & Garden', count: 0, href: '/best/home-garden' },
  { name: 'Outdoor Gear', count: 0, href: '/best/outdoor-gear' }
];

export default function BestPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-trustworthy/10 to-purple-500/10 bg-gray-50 text-gray-800">
        <div className="container mx-auto px-4 py-10">
          <div className="max-w-4xl">
            <h1 className="text-3xl md:text-5xl font-bold mb-4">
              Best Products of 2025
            </h1>
            <p className="text-lg md:text-xl mb-6 text-gray-600">
              Expert-tested reviews and comprehensive buying guides. We put products through rigorous testing to help you make the best decisions.
            </p>
            <div className="flex flex-wrap gap-4">
              <div className="bg-white/80 backdrop-blur-sm rounded-lg px-4 py-2 border border-gray-200">
                <span className="text-sm text-gray-700">25+ Products Tested</span>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-lg px-4 py-2 border border-gray-200">
                <span className="text-sm text-gray-700">Independent Reviews</span>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-lg px-4 py-2 border border-gray-200">
                <span className="text-sm text-gray-700">Updated Monthly</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Featured Categories */}
            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-8">Featured Categories</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {bestProducts.map((product) => (
                  <Card key={product.id} className="group cursor-pointer overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                    <Link href={product.href}>
                      <div className="relative">
                        <img 
                          src={product.image} 
                          alt={product.title}
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        {product.badge && (
                          <div className="absolute top-3 left-3 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                            {product.badge}
                          </div>
                        )}
                        <div className="absolute top-3 right-3">
                          <RatingBadge rating={product.rating} />
                        </div>
                      </div>
                      <div className="p-6">
                        <div className="text-sm text-blue-600 font-semibold mb-2">{product.category}</div>
                        <h3 className="text-xl font-bold mb-3 group-hover:text-blue-600 transition-colors">
                          {product.title}
                        </h3>
                        <p className="text-gray-600 mb-4 line-clamp-3">{product.description}</p>
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-semibold text-gray-800">{product.priceRange}</span>
                          <span className="text-blue-600 font-semibold group-hover:underline">
                            View Guide →
                          </span>
                        </div>
                      </div>
                    </Link>
                  </Card>
                ))}
              </div>
            </section>

            {/* How We Test Section */}
            <section className="mb-12">
              <div className="bg-white rounded-lg shadow-lg p-8">
                <h2 className="text-3xl font-bold mb-6">How We Test</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Real-World Testing</h3>
                    <p className="text-gray-600">We put every product through extensive real-world scenarios to test performance, durability, and usability.</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Data-Driven Analysis</h3>
                    <p className="text-gray-600">Our reviews include benchmarks, measurements, and quantitative analysis to provide objective insights.</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Expert Opinion</h3>
                    <p className="text-gray-600">Our team of experts provides professional insights and recommendations based on years of experience.</p>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-6 space-y-6">
              {/* Quick Navigation */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-semibold mb-4">Browse Categories</h3>
                <div className="space-y-2">
                  {quickCategories.map((category) => (
                    <Link
                      key={category.name}
                      href={category.href}
                      className="flex justify-between items-center p-3 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <span className="font-medium">{category.name}</span>
                      <span className="text-sm bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                        {category.count}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Recent Updates */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-semibold mb-4">Recent Updates</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Jan 15, 2025</p>
                    <Link href="/best/power-stations" className="text-blue-600 hover:underline">
                      Updated: Best Portable Power Stations
                    </Link>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Jan 10, 2025</p>
                    <Link href="/best/cameras" className="text-blue-600 hover:underline">
                      New: Best Cameras Guide
                    </Link>
                  </div>
                </div>
              </div>

              {/* Newsletter Signup */}
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white">
                <h3 className="text-xl font-semibold mb-2">Stay Updated</h3>
                <p className="text-blue-100 mb-4">Get notified when we publish new reviews and buying guides.</p>
                <button className="w-full bg-white text-purple-500 font-semibold py-3 px-6 rounded-xl hover:bg-gray-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
