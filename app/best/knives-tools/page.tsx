import { Metadata } from 'next';
import Link from 'next/link';
import { Card } from '@/components/card';
import RatingBadge from '@/components/article/RatingBadge';

export const metadata: Metadata = {
  title: 'Best Knives & Tools 2025 - Expert Reviews & Buying Guide',
  description: 'The best knives, multi-tools, and EDC gear. Expert tested for durability, functionality, and craftsmanship.',
};

interface Tool {
  id: string;
  name: string;
  title: string;
  image: string;
  type: string;
  material: string;
  price: string;
  rating: number;
  pros: string[];
  cons: string[];
  bestFor: string;
  href: string;
  badge?: string;
}

const tools: Tool[] = [
  {
    id: 'anso-aros-knife',
    name: 'Anso Aros Knife',
    title: 'Best Premium EDC Knife',
    image: '/images/item.png',
    type: 'Folding Knife',
    material: 'Premium Steel',
    price: '$299',
    rating: 4.7,
    pros: ['Exceptional build quality', 'Premium materials', 'Perfect ergonomics', 'Collector quality'],
    cons: ['Premium pricing', 'Limited availability', 'Requires maintenance'],
    bestFor: 'EDC enthusiasts, collectors, premium users',
          href: '/articles/anso_aros_knife',
    badge: 'Editor\'s Choice'
  }
];

const toolCategories = [
  {
    type: 'EDC Knives',
    description: 'Everyday carry knives designed for daily use, balancing functionality with portability.',
    examples: 'Benchmade, Spyderco, Chris Reeve'
  },
  {
    type: 'Multi-Tools',
    description: 'Versatile tools combining multiple functions in a compact, portable package.',
    examples: 'Leatherman, Victorinox, Gerber'
  },
  {
    type: 'Fixed Blade Knives',
    description: 'Robust knives for outdoor activities, camping, and heavy-duty tasks.',
    examples: 'Ka-Bar, Morakniv, ESEE'
  },
  {
    type: 'Tactical Gear',
    description: 'Professional-grade tools designed for law enforcement, military, and serious users.',
    examples: 'Cold Steel, SOG, Zero Tolerance'
  }
];

const buyingFactors = [
  {
    title: 'Steel Quality',
    description: 'The steel type determines edge retention, corrosion resistance, and ease of sharpening.',
    recommendation: 'S30V, CPM-154, or VG-10 for premium performance'
  },
  {
    title: 'Handle Ergonomics',
    description: 'Comfort and grip security are crucial for safe and effective use during extended periods.',
    recommendation: 'Test grip comfort and texture for your hand size'
  },
  {
    title: 'Build Quality',
    description: 'Construction quality affects durability, reliability, and long-term performance.',
    recommendation: 'Look for solid lockup and smooth action'
  },
  {
    title: 'Intended Use',
    description: 'Match the tool to your specific needs - EDC, outdoor work, collecting, or professional use.',
    recommendation: 'Choose specialized tools for specific applications'
  }
];

export default function KnivesToolsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
        <div className="container mx-auto px-4 py-10">
          <div className="max-w-4xl">
            <div className="flex items-center mb-4">
              <Link href="/best" className="text-orange-200 hover:text-white mr-2">Best Products</Link>
              <span className="text-orange-200">›</span>
              <span className="ml-2">Knives & Tools</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold mb-4">
              Best Knives & Tools 2025
            </h1>
            <p className="text-lg md:text-xl mb-6 text-orange-100">
              Expert-tested knives, multi-tools, and EDC gear. We evaluate durability, functionality, and craftsmanship to help you find the perfect tools.
            </p>
            <div className="flex flex-wrap gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
                <span className="text-sm">20+ Tools Tested</span>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
                <span className="text-sm">Durability Testing</span>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
                <span className="text-sm">Expert Reviews</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Quick List */}
            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-2">The Quick List</h2>
              <p className="text-gray-600 mb-8">Our top picks based on extensive testing and real-world use.</p>
              
              <div className="space-y-6">
                {tools.map((tool, index) => (
                  <Card key={tool.id} className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                    <div className="flex flex-col md:flex-row">
                      <div className="md:w-1/3 relative">
                        <img 
                          src={tool.image} 
                          alt={tool.name}
                          className="w-full h-48 md:h-full object-cover"
                        />
                        {tool.badge && (
                          <div className="absolute top-3 left-3 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                            {tool.badge}
                          </div>
                        )}
                        <div className="absolute top-3 right-3">
                          <div className="bg-white text-orange-600 px-2 py-1 rounded-full text-sm font-bold">
                            #{index + 1}
                          </div>
                        </div>
                      </div>
                      
                      <div className="md:w-2/3 p-6">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-2xl font-bold">{tool.title}</h3>
                          <RatingBadge rating={tool.rating} />
                        </div>
                        
                        <h4 className="text-xl text-gray-700 mb-4">{tool.name}</h4>
                        
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                          <div>
                            <div className="text-sm text-gray-500">Type</div>
                            <div className="font-semibold">{tool.type}</div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-500">Material</div>
                            <div className="font-semibold">{tool.material}</div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-500">Price</div>
                            <div className="font-semibold text-orange-600">{tool.price}</div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <h5 className="font-semibold text-green-600 mb-1">Pros:</h5>
                            <ul className="text-sm text-gray-600 space-y-1">
                              {tool.pros.slice(0, 2).map((pro, i) => (
                                <li key={i} className="flex items-start">
                                  <span className="text-green-500 mr-1">✓</span>
                                  {pro}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <h5 className="font-semibold text-red-600 mb-1">Cons:</h5>
                            <ul className="text-sm text-gray-600 space-y-1">
                              {tool.cons.slice(0, 2).map((con, i) => (
                                <li key={i} className="flex items-start">
                                  <span className="text-red-500 mr-1">✗</span>
                                  {con}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-sm text-gray-500 mb-1">Best For:</div>
                            <div className="text-sm font-semibold">{tool.bestFor}</div>
                          </div>
                          <Link 
                            href={tool.href}
                            className="bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                          >
                            Read Review →
                          </Link>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Coming Soon Notice */}
              <div className="mt-8 bg-orange-50 border-l-4 border-orange-400 p-6 rounded-r-lg">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-orange-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-orange-700">
                      <strong>More tool reviews coming soon!</strong> We're currently testing Benchmade Bugout, Leatherman Wave+, Spyderco PM2, and other top knives and multi-tools. 
                      <Link href="#newsletter" className="underline ml-1">Subscribe to get notified</Link> when new reviews are published.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Tool Categories Guide */}
            <section className="mb-12">
              <div className="bg-white rounded-lg shadow-lg p-8">
                <h2 className="text-3xl font-bold mb-6">Tool Categories Explained</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {toolCategories.map((category) => (
                    <div key={category.type} className="border-l-4 border-orange-500 pl-4">
                      <h3 className="text-xl font-semibold mb-2">{category.type}</h3>
                      <p className="text-gray-600 mb-3">{category.description}</p>
                      <div className="text-sm text-orange-600 font-medium">Examples: {category.examples}</div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Buying Guide */}
            <section className="mb-12">
              <div className="bg-white rounded-lg shadow-lg p-8">
                <h2 className="text-3xl font-bold mb-6">How to Choose the Right Knife or Tool</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {buyingFactors.map((factor) => (
                    <div key={factor.title} className="border-l-4 border-blue-500 pl-4">
                      <h3 className="text-xl font-semibold mb-2">{factor.title}</h3>
                      <p className="text-gray-600 mb-2">{factor.description}</p>
                      <div className="text-sm font-semibold text-blue-600">{factor.recommendation}</div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Testing Methodology */}
            <section className="mb-12">
              <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white rounded-lg p-8">
                <h2 className="text-3xl font-bold mb-6">Our Testing Process</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <h3 className="text-xl font-semibold mb-3">Durability Testing</h3>
                    <p className="text-gray-300">Edge retention, lock strength, material quality, and long-term reliability under various conditions.</p>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-3">Performance Analysis</h3>
                    <p className="text-gray-300">Cutting performance, ergonomics, action smoothness, and practical functionality in real-world tasks.</p>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-3">Real-World Use</h3>
                    <p className="text-gray-300">Extended EDC testing, outdoor applications, professional use scenarios, and maintenance requirements.</p>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-6 space-y-6">
              {/* Steel Guide */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-semibold mb-4">Steel Guide</h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <div className="font-semibold text-orange-600">S30V</div>
                    <div className="text-gray-600">Excellent edge retention, premium stainless</div>
                  </div>
                  <div>
                    <div className="font-semibold text-orange-600">VG-10</div>
                    <div className="text-gray-600">Good balance of properties, easy to sharpen</div>
                  </div>
                  <div>
                    <div className="font-semibold text-orange-600">CPM-154</div>
                    <div className="text-gray-600">High performance, corrosion resistant</div>
                  </div>
                  <div>
                    <div className="font-semibold text-orange-600">D2</div>
                    <div className="text-gray-600">Excellent hardness, requires care</div>
                  </div>
                </div>
              </div>

              {/* Popular Brands */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-semibold mb-4">Popular Brands</h3>
                <div className="space-y-3">
                  <Link href="#" className="block text-blue-600 hover:underline text-sm">
                    Benchmade Guide
                  </Link>
                  <Link href="#" className="block text-blue-600 hover:underline text-sm">
                    Spyderco Reviews
                  </Link>
                  <Link href="#" className="block text-blue-600 hover:underline text-sm">
                    Leatherman Multi-Tools
                  </Link>
                  <Link href="#" className="block text-blue-600 hover:underline text-sm">
                    Chris Reeve Knives
                  </Link>
                </div>
              </div>

              {/* Newsletter */}
              <div id="newsletter" className="bg-gradient-to-r from-orange-500 to-red-500 rounded-lg shadow-lg p-6 text-white">
                <h3 className="text-xl font-semibold mb-2">Tool Reviews</h3>
                <p className="text-orange-100 mb-4">Get notified about new knife and tool reviews, comparisons, and buying guides.</p>
                <button className="w-full bg-white text-orange-600 font-semibold py-3 px-6 rounded-xl hover:bg-gray-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105">
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
