import { Metadata } from 'next';
import Link from 'next/link';
import { Card } from '@/components/card';
import RatingBadge from '@/components/article/RatingBadge';

export const metadata: Metadata = {
  title: 'Best Portable Power Stations 2025 - Expert Reviews & Buying Guide',
  description: 'The best portable power stations for camping, home backup, and off-grid adventures. Expert tested for capacity, reliability, and value.',
};

interface PowerStation {
  id: string;
  name: string;
  title: string;
  image: string;
  capacity: string;
  output: string;
  weight: string;
  price: string;
  rating: number;
  pros: string[];
  cons: string[];
  bestFor: string;
  href: string;
  badge?: string;
}

const powerStations: PowerStation[] = [
  {
    id: 'ecoflow-delta-pro-3',
    name: 'EcoFlow Delta Pro 3',
    title: 'Best Overall Portable Power Station',
    image: '/images/posts/delta_3_pro/EcoFlow-Delta-Pro-3.jpg',
    capacity: '4096Wh',
    output: '4000W',
    weight: '113.5 lbs',
    price: '$3,699',
    rating: 4.9,
    pros: ['Massive 4096Wh capacity', '4000W output powers any appliance', '50-minute fast charging', '10ms UPS mode'],
    cons: ['Very heavy at 113.5 lbs', 'Expensive', 'Bulky for car camping'],
    bestFor: 'Home backup, RV life, professional use',
          href: '/articles/ecoflow_delta_pro_3',
    badge: 'Editor\'s Choice'
  },
  {
    id: 'ecoflow-delta-3-plus',
    name: 'EcoFlow Delta 3 Plus',
    title: 'Best Compact High-Capacity Station',
    image: '/images/posts/delta_3_pro/EcoFlow-Delta-Pro-3.jpg',
    capacity: '1024Wh',
    output: '1800W',
    weight: '24 lbs',
    price: '$799',
    rating: 4.7,
    pros: ['Excellent capacity-to-weight ratio', 'Fast charging', 'UPS capability', 'Portable design'],
    cons: ['Lower output than larger units', 'Limited expansion'],
    bestFor: 'Camping, emergency backup, job sites',
          href: '/articles/ecoflow_delta_3_plus'
  },
  {
    id: 'anker-solix-c1000',
    name: 'Anker Solix C1000',
    title: 'Best Budget Portable Power Station',
    image: '/images/item.png',
    capacity: '1056Wh',
    output: '1800W',
    weight: '26.6 lbs',
    price: '$499',
    rating: 4.5,
    pros: ['Excellent value for money', 'Reliable brand', 'Good capacity', 'Multiple charging options'],
    cons: ['Basic features', 'Slower charging', 'Limited app functionality'],
    bestFor: 'Budget-conscious users, basic backup needs',
          href: '/articles/anker_solix_c1000'
  },
  {
    id: 'bluetti-ac180',
    name: 'Bluetti AC180',
    title: 'Best for Solar Charging',
    image: '/images/posts/bluetti_ac180/AC180_main.webp',
    capacity: '1152Wh',
    output: '1800W',
    weight: '35.3 lbs',
    price: '$699',
    rating: 4.6,
    pros: ['Excellent solar charging', 'LiFePO4 battery', 'Good build quality', 'Wireless charging pad'],
    cons: ['Heavier than competitors', 'App needs improvement'],
    bestFor: 'Solar enthusiasts, off-grid camping',
          href: '/articles/bluetti_ac_180'
  },
  {
    id: 'jackery-explorer-1000-v2',
    name: 'Jackery Explorer 1000 V2',
    title: 'Best for Ease of Use',
    image: '/images/item.png',
    capacity: '1070Wh',
    output: '1500W',
    weight: '23.8 lbs',
    price: '$799',
    rating: 4.4,
    pros: ['User-friendly design', 'Reliable performance', 'Good brand reputation', 'Comprehensive warranty'],
    cons: ['Lower output power', 'Premium pricing', 'Basic app features'],
    bestFor: 'Beginners, reliable backup power',
          href: '/articles/jackery_explorer_1000_v2'
  },
  {
    id: 'ecoflow-river-2-pro',
    name: 'EcoFlow River 2 Pro',
    title: 'Best Ultra-Compact Station',
    image: '/images/item.png',
    capacity: '768Wh',
    output: '800W',
    weight: '17.4 lbs',
    price: '$429',
    rating: 4.3,
    pros: ['Ultra-portable design', 'Fast charging', 'Good value', 'Multiple charging ports'],
    cons: ['Lower capacity', 'Limited high-power usage'],
    bestFor: 'Light camping, car trips, mobile work',
          href: '/articles/ecoflow_river_2_pro'
  },
  {
    id: 'ecoflow-delta-3',
    name: 'EcoFlow Delta 3',
    title: 'Best Mid-Range Option',
    image: '/images/item.png',
    capacity: '1024Wh',
    output: '1800W',
    weight: '23.6 lbs',
    price: '$599',
    rating: 4.5,
    pros: ['Balanced specs', 'Good value', 'Fast charging', 'Compact design'],
    cons: ['No expansion capability', 'Basic app features compared to Pro models'],
    bestFor: 'Most users, balanced needs',
          href: '/articles/ecoflow_delta_3'
  }
];

const quickSpecs = [
  { label: 'Capacity Range', value: '768Wh - 4096Wh' },
  { label: 'Output Range', value: '800W - 4000W' },
  { label: 'Weight Range', value: '17.4 - 113.5 lbs' },
  { label: 'Price Range', value: '$429 - $3,699' }
];

const buyingFactors = [
  {
    title: 'Capacity (Wh)',
    description: 'Determines runtime. Calculate your device power consumption to choose the right size.',
    recommendation: '1000Wh+ for most users'
  },
  {
    title: 'Output Power (W)',
    description: 'Maximum power delivery. Must exceed your highest-draw device requirements.',
    recommendation: '1500W+ for appliances'
  },
  {
    title: 'Portability',
    description: 'Weight and size matter for transport. Consider your mobility needs.',
    recommendation: 'Under 25 lbs for frequent transport'
  },
  {
    title: 'Charging Speed',
    description: 'Fast charging reduces downtime. Look for 1-2 hour full charge times.',
    recommendation: '80% in under 1 hour'
  }
];

export default function PortablePowerStationsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-trustworthy/10 to-purple-500/10 bg-gray-50 text-gray-800">
        <div className="container mx-auto px-4 py-10">
          <div className="max-w-4xl">
            <div className="flex items-center mb-4">
              <Link href="/best" className="text-green-200 hover:text-white mr-2">Best Products</Link>
              <span className="text-green-200">›</span>
              <span className="ml-2">Portable Power Stations</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold mb-4">
              Best Portable Power Stations 2025
            </h1>
            <p className="text-lg md:text-xl mb-6 text-gray-600">
              Expert-tested power stations for camping, home backup, and off-grid adventures. We've tested over 40 models to bring you the definitive buying guide.
            </p>
            <div className="flex flex-wrap gap-4">
              {quickSpecs.map((spec) => (
                <div key={spec.label} className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
                  <div className="text-sm text-gray-600">{spec.label}</div>
                  <div className="font-semibold">{spec.value}</div>
                </div>
              ))}
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
              <p className="text-gray-600 mb-8">Want the best right now? Here are our top picks based on extensive testing.</p>
              
              <div className="space-y-6">
                {powerStations.map((station, index) => (
                  <Card key={station.id} className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                    <div className="flex flex-col md:flex-row">
                      <div className="md:w-1/3 relative">
                        <img 
                          src={station.image} 
                          alt={station.name}
                          className="w-full h-48 md:h-full object-cover"
                        />
                        {station.badge && (
                          <div className="absolute top-3 left-3 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                            {station.badge}
                          </div>
                        )}
                        <div className="absolute top-3 right-3">
                          <div className="bg-white text-purple-500 px-2 py-1 rounded-full text-sm font-bold">
                            #{index + 1}
                          </div>
                        </div>
                      </div>
                      
                      <div className="md:w-2/3 p-6">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-2xl font-bold">{station.title}</h3>
                          <RatingBadge rating={station.rating} />
                        </div>
                        
                        <h4 className="text-xl text-gray-700 mb-4">{station.name}</h4>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                          <div>
                            <div className="text-sm text-gray-500">Capacity</div>
                            <div className="font-semibold">{station.capacity}</div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-500">Output</div>
                            <div className="font-semibold">{station.output}</div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-500">Weight</div>
                            <div className="font-semibold">{station.weight}</div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-500">Price</div>
                            <div className="font-semibold text-green-600">{station.price}</div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <h5 className="font-semibold text-green-600 mb-1">Pros:</h5>
                            <ul className="text-sm text-gray-600 space-y-1">
                              {station.pros.slice(0, 2).map((pro, i) => (
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
                              {station.cons.slice(0, 2).map((con, i) => (
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
                            <div className="text-sm font-semibold">{station.bestFor}</div>
                          </div>
                          <Link 
                            href={station.href}
                            className="bg-purple-500 text-white px-8 py-3 rounded-xl font-semibold hover:bg-purple-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                          >
                            Read Review →
                          </Link>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </section>

            {/* Buying Guide */}
            <section className="mb-12">
              <div className="bg-white rounded-lg shadow-lg p-8">
                <h2 className="text-3xl font-bold mb-6">How to Choose the Right Portable Power Station</h2>
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
                    <h3 className="text-xl font-semibold mb-3">Capacity Testing</h3>
                    <p className="text-gray-300">We measure actual usable capacity, charge/discharge cycles, and real-world runtime with common devices.</p>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-3">Performance Analysis</h3>
                    <p className="text-gray-300">Output consistency, surge handling, charging speeds, and thermal management under various loads.</p>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-3">Real-World Use</h3>
                    <p className="text-gray-300">Extended camping trips, home backup scenarios, and professional job site applications.</p>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-6 space-y-6">
              {/* Table of Contents */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-semibold mb-4">Jump to:</h3>
                <div className="space-y-2">
                  <a href="#quick-list" className="block text-blue-600 hover:underline">The Quick List</a>
                  <a href="#buying-guide" className="block text-blue-600 hover:underline">Buying Guide</a>
                  <a href="#testing" className="block text-blue-600 hover:underline">How We Test</a>
                  <a href="#faqs" className="block text-blue-600 hover:underline">FAQs</a>
                </div>
              </div>

              {/* Popular Comparisons */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-semibold mb-4">Popular Comparisons</h3>
                <div className="space-y-3">
                  <Link href="#" className="block text-blue-600 hover:underline text-sm">
                    EcoFlow vs Bluetti vs Jackery
                  </Link>
                  <Link href="#" className="block text-blue-600 hover:underline text-sm">
                    Delta Pro 3 vs Jackery 3000 Pro
                  </Link>
                  <Link href="#" className="block text-blue-600 hover:underline text-sm">
                    Best for Home Backup
                  </Link>
                  <Link href="#" className="block text-blue-600 hover:underline text-sm">
                    Solar Power Station Guide
                  </Link>
                </div>
              </div>

              {/* Newsletter */}
              <div className="bg-gradient-to-r from-green-500 to-blue-500 rounded-lg shadow-lg p-6 text-white">
                <h3 className="text-xl font-semibold mb-2">Power Station Updates</h3>
                <p className="text-green-100 mb-4">Get notified about new reviews, deals, and buying guides.</p>
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
