import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import RatingBadge from '@/components/article/RatingBadge';
import StarRating from '@/components/article/StarRating';

export default function BestHouseBackupPowerStations() {
  const houseBackupStations = [
    {
      rank: 1,
      name: 'EcoFlow Delta Pro 3',
      href: '/articles/ecoflow_delta_pro_3',
      price: '$3,699',
      rating: 9.2,
      capacity: '4096Wh',
      output: '4000W',
      image: '/images/posts/delta_3_pro/EcoFlow-Delta-Pro-3.jpg',
      keyFeatures: ['4096Wh expandable capacity', '4000W AC output', 'Home integration ready', 'Smart home panel'],
      pros: ['Massive capacity for whole-home backup', 'Professional installation support', 'Smart grid integration'],
      cons: ['Very expensive', 'Requires professional setup', 'Heavy unit'],
      bestFor: 'Whole-home backup power during extended outages'
    },
    {
      rank: 2,
      name: 'Bluetti AC300 + B300',
      href: '/articles/bluetti_ac300',
      price: '$2,999',
      rating: 8.9,
      capacity: '3072Wh',
      output: '3000W',
      image: '/images/item.png',
      keyFeatures: ['Modular battery system', '3000W pure sine wave', 'UPS functionality', 'Solar ready'],
      pros: ['Modular expandable design', 'UPS mode for seamless switching', 'Multiple charging options'],
      cons: ['Complex setup', 'Expensive to expand', 'Multiple units to manage'],
      bestFor: 'Modular home backup with expansion flexibility'
    },
    {
      rank: 3,
      name: 'Goal Zero Yeti 6000X',
      href: '/articles/goal_zero_yeti_6000x',
      price: '$4,999',
      rating: 8.7,
      capacity: '6071Wh',
      output: '2000W',
      image: '/images/item.png',
      keyFeatures: ['6071Wh massive capacity', 'WiFi app control', 'Tank battery expansion', 'Professional grade'],
      pros: ['Huge capacity for extended runtime', 'Professional build quality', 'Comprehensive app control'],
      cons: ['Extremely expensive', 'Lower output power', 'Very heavy'],
      bestFor: 'Extended outages requiring maximum runtime'
    },
    {
      rank: 4,
      name: 'Anker SOLIX F3800',
      href: '/articles/anker_solix_f3800',
      price: '$3,999',
      rating: 8.5,
      capacity: '3840Wh',
      output: '6000W',
      image: '/images/item.png',
      keyFeatures: ['3840Wh LiFePO4 battery', '6000W surge power', 'Home panel integration', '10-year warranty'],
      pros: ['Highest surge power rating', 'Long warranty coverage', 'Home integration ready'],
      cons: ['Premium pricing', 'Limited availability', 'Complex installation'],
      bestFor: 'High-power appliances and whole-home integration'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 py-10">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">
            Best House Backup Power Stations 2025
          </h1>
          <p className="text-lg md:text-xl mb-6 text-blue-100">
            High-capacity power stations for whole-home backup during outages
          </p>
          <div className="flex flex-wrap gap-4">
            <span className="bg-white/20 px-4 py-2 rounded-full text-sm">
              3000Wh+ Capacity
            </span>
            <span className="bg-white/20 px-4 py-2 rounded-full text-sm">
              Home Integration
            </span>
            <span className="bg-white/20 px-4 py-2 rounded-full text-sm">
              Extended Runtime
            </span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Top 4 House Backup Power Stations</h2>
              <p className="text-gray-600 mb-6">
                These high-capacity power stations are designed for whole-home backup during extended 
                outages. Each model offers professional-grade features, home integration capabilities, 
                and the capacity to power essential appliances for hours or days.
              </p>
            </div>

            {/* Power Station Rankings */}
            <div className="space-y-8">
              {houseBackupStations.map((station) => (
                <div key={station.rank} className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">
                        {station.rank}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold">{station.name}</h3>
                        <p className="text-gray-600">{station.bestFor}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-blue-600 mb-1">{station.price}</div>
                      <RatingBadge rating={station.rating} />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-lg font-bold text-blue-600">{station.capacity}</div>
                      <div className="text-sm text-gray-600">Capacity</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-lg font-bold text-blue-600">{station.output}</div>
                      <div className="text-sm text-gray-600">AC Output</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-lg font-bold text-blue-600">8-24h</div>
                      <div className="text-sm text-gray-600">Runtime</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-lg font-bold text-blue-600">LiFePO4</div>
                      <div className="text-sm text-gray-600">Battery</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <h4 className="font-semibold mb-2 text-blue-600">Key Features</h4>
                      <ul className="space-y-1">
                        {station.keyFeatures.map((feature, index) => (
                          <li key={index} className="text-sm text-gray-600">• {feature}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2 text-blue-600">Pros</h4>
                      <ul className="space-y-1">
                        {station.pros.map((pro, index) => (
                          <li key={index} className="text-sm text-gray-600">+ {pro}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <StarRating rating={station.rating} />
                    <Link 
                      href={station.href}
                      className="bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                      Read Review →
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* Installation Guide */}
            <div className="mt-12 bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-4">Home Backup Installation Guide</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-2">Professional Installation</h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Transfer switch installation required</li>
                    <li>• Electrical panel integration</li>
                    <li>• Proper grounding and safety systems</li>
                    <li>• Local electrical code compliance</li>
                    <li>• Professional electrician recommended</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Planning Considerations</h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Calculate essential load requirements</li>
                    <li>• Plan for ventilation and cooling</li>
                    <li>• Consider expansion capabilities</li>
                    <li>• Factor in maintenance access</li>
                    <li>• Budget for installation costs</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold mb-4">Runtime Calculator</h3>
              <div className="space-y-4">
                <div className="border-b pb-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Refrigerator</span>
                    <span className="text-sm text-blue-600">24-48 hours</span>
                  </div>
                </div>
                <div className="border-b pb-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">LED Lights</span>
                    <span className="text-sm text-blue-600">100+ hours</span>
                  </div>
                </div>
                <div className="border-b pb-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">WiFi Router</span>
                    <span className="text-sm text-blue-600">200+ hours</span>
                  </div>
                </div>
                <div className="border-b pb-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Sump Pump</span>
                    <span className="text-sm text-blue-600">8-16 hours</span>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">HVAC Fan</span>
                    <span className="text-sm text-blue-600">12-24 hours</span>
                  </div>
                </div>
              </div>
              <div className="text-xs text-gray-500 mt-3">
                *Based on 3000Wh capacity with typical usage
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6">
              <h3 className="text-lg font-bold mb-3">Installation Cost</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Power Station:</span>
                  <span className="font-medium">$3,000-$5,000</span>
                </div>
                <div className="flex justify-between">
                  <span>Transfer Switch:</span>
                  <span className="font-medium">$500-$1,500</span>
                </div>
                <div className="flex justify-between">
                  <span>Installation:</span>
                  <span className="font-medium">$1,000-$3,000</span>
                </div>
                <div className="flex justify-between">
                  <span>Permits:</span>
                  <span className="font-medium">$100-$500</span>
                </div>
                <div className="border-t pt-2 mt-2 flex justify-between font-bold">
                  <span>Total Investment:</span>
                  <span>$4,600-$10,000</span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6">
              <h3 className="text-lg font-bold mb-3">Newsletter</h3>
              <p className="text-sm text-gray-600 mb-4">
                Get home backup power tips and product updates.
              </p>
              <div className="space-y-3">
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button className="w-full bg-white text-blue-600 font-semibold py-3 px-6 rounded-xl hover:bg-gray-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
