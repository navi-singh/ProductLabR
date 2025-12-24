import { PostsList } from '@/components/PostsList';
// import { Newsletter } from '@/components/Newsletter';
import { Top10Popular } from '@/components/Top10Popular';
import Link from 'next/link';
import fs from "fs";

const getPostMetadata = () => {
  // This function is unused in this component - PostsList handles metadata
  // Keeping for backward compatibility but functionality moved to PostsList
  return [];
}

export default function Home() {
  const trendingCategories = [
    { title: 'Best Power Stations', href: '/best/power-stations', isActive: true },
    { title: 'Best Cameras', href: '/best/cameras' },
    { title: 'Best Tools & Knives', href: '/best/knives-tools' },
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
    },
    {
      title: 'Tools & Knives',
      subtitle: 'Premium Tools, Professional Knives or see all in Tools & Knives',
      image: '/images/item.png',
      featuredProducts: [
        {
          title: 'Best Professional Knives',
          description: 'High-quality knives and tools for professionals and enthusiasts.',
          href: '/best/knives-tools',
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
              {trendingCategories.map((category, index) => (
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
          <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8">
            Product Lab reviews are <em>ad-free</em> and entirely reader-supported. 
            When you purchase through links on our site, we may earn an affiliate commission, which helps support our testing.
          </p>
        </section>

        {/* Category Sections */}
        {categoryFeaturedProducts.map((category, categoryIndex) => (
          <section key={category.title} className="mb-16">
            <div className="border-b border-gray-200 pb-4 mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">{category.title}</h2>
              <p className="text-gray-600">{category.subtitle}</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {category.featuredProducts.map((product, productIndex) => (
                <Link key={product.title} href={product.href} className="group">
                  <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                    <div className="relative h-48 overflow-hidden">
                      <img 
                        src={product.image} 
                        alt={product.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {productIndex === 0 && (
                        <div className="absolute top-3 left-3 bg-purple-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                          Top Pick
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-purple-600 transition-colors">
                        {product.title}
                      </h3>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {product.description}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ))}

        {/* Ad-free Independence Section */}
        <section className="bg-gradient-to-r from-trustworthy/5 to-purple-500/5 rounded-xl p-8 mb-12">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Ad-free. Influence-free. Powered by Testing.
            </h2>
            <p className="text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Product Lab is founded on the principle of honest, objective reviews. Our experts test thousands of products each year using thoughtful test plans that bring out key performance differences between competing products. And, to assure complete independence, we buy all the products we test ourselves. No cherry-picked units sent by manufacturers. No sponsored content. No ads. Just real, honest, side-by-side testing and comparison.
            </p>
            <Link 
              href="/best" 
              className="inline-block mt-6 bg-purple-500 text-white px-8 py-3 rounded-xl font-semibold hover:bg-purple-600 transition-colors"
            >
              Learn More
            </Link>
          </div>
        </section>

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
