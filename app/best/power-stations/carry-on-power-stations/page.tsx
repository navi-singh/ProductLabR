import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import RatingBadge from '@/components/article/RatingBadge';
import StarRating from '@/components/article/StarRating';

export default function BestCarryOnPowerStations() {
  const carryOnStations = [
    {
      rank: 1,
      name: 'Anker PowerCore 26800 PD',
      href: '/articles/anker_powercore_26800_pd',
      price: '$129',
      rating: 9.0,
      capacity: '96.48Wh',
      output: '30W PD',
      weight: '1.28 lbs',
      image: '/images/item.png',
      keyFeatures: ['96.48Wh TSA compliant', '30W Power Delivery', 'Triple device charging', 'Fast recharge'],
      pros: ['TSA approved for flights', 'Fast charging for phones/tablets', 'Excellent build quality'],
      cons: ['No AC outlet', 'Limited to USB devices', 'Premium pricing'],
      bestFor: 'Business travelers and frequent flyers'
    },
    {
      rank: 2,
      name: 'RAVPower 90W AC Power Bank',
      href: '/articles/ravpower_90w_ac',
      price: '$199',
      rating: 8.8,
      capacity: '88.8Wh',
      output: '90W AC',
      weight: '1.5 lbs',
      image: '/images/item.png',
      keyFeatures: ['88.8Wh airline safe', '90W AC outlet', 'USB-C PD 30W', 'Digital display'],
      pros: ['Actual AC outlet for laptops', 'Multiple charging options', 'Clear capacity display'],
      cons: ['Heavier than USB-only models', 'Limited AC runtime', 'Higher price point'],
      bestFor: 'Travelers needing AC power for small devices'
    },
    {
      rank: 3,
      name: 'Goal Zero Sherpa 100AC',
      href: '/articles/goal_zero_sherpa_100ac',
      price: '$299',
      rating: 8.5,
      capacity: '94.7Wh',
      output: '100W AC',
      weight: '2.0 lbs',
      image: '/images/item.png',
      keyFeatures: ['94.7Wh flight approved', '100W AC inverter', 'Wireless charging', 'Rugged design'],
      pros: ['Wireless charging convenience', 'Rugged outdoor construction', 'Reliable brand'],
      cons: ['Most expensive option', 'Heaviest in category', 'Slower USB charging'],
      bestFor: 'Outdoor professionals and adventure travelers'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
        <div className="container mx-auto px-4 py-10">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">
            Best Carry-On Power Stations 2025
          </h1>
          <p className="text-lg md:text-xl mb-6 text-purple-100">
            TSA-approved power banks for travel and airline carry-on
          </p>
          <div className="flex flex-wrap gap-4">
            <span className="bg-white/20 px-4 py-2 rounded-full text-sm">
              TSA Compliant
            </span>
            <span className="bg-white/20 px-4 py-2 rounded-full text-sm">
              Under 100Wh
            </span>
            <span className="bg-white/20 px-4 py-2 rounded-full text-sm">
              Ultra-Compact
            </span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Top 3 TSA-Approved Power Stations</h2>
              <p className="text-gray-600 mb-6">
                These compact power banks are specifically designed for air travel, meeting TSA's 
                100Wh limit for carry-on batteries. Perfect for keeping your devices charged during 
                long flights and travel days without the hassle of airport restrictions.
              </p>
            </div>

            {/* TSA Compliance Notice */}
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-8">
              <div className="flex">
                <div className="flex-shrink-0">
                  <span className="text-blue-400 text-xl">✈️</span>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800">TSA Compliance Notice</h3>
                  <div className="mt-2 text-sm text-blue-700">
                    <p>All power stations listed here are under 100Wh and approved for airline carry-on. 
                    Always check with your specific airline for any additional restrictions.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Power Station Rankings */}
            <div className="space-y-8">
              {carryOnStations.map((station) => (
                <div key={station.rank} className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="bg-purple-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">
                        {station.rank}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold">{station.name}</h3>
                        <p className="text-gray-600">{station.bestFor}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-purple-500 mb-1">{station.price}</div>
                      <RatingBadge rating={station.rating} />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-lg font-bold text-purple-500">{station.capacity}</div>
                      <div className="text-sm text-gray-600">Capacity</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-lg font-bold text-purple-500">{station.output}</div>
                      <div className="text-sm text-gray-600">Max Output</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-lg font-bold text-purple-500">{station.weight}</div>
                      <div className="text-sm text-gray-600">Weight</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-lg font-bold text-green-500">✓ TSA</div>
                      <div className="text-sm text-gray-600">Approved</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <h4 className="font-semibold mb-2 text-purple-500">Key Features</h4>
                      <ul className="space-y-1">
                        {station.keyFeatures.map((feature, index) => (
                          <li key={index} className="text-sm text-gray-600">• {feature}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2 text-purple-500">Pros</h4>
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
                      className="bg-purple-500 text-white px-8 py-3 rounded-xl font-semibold hover:bg-purple-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                      Read Review →
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* Travel Guide */}
            <div className="mt-12 bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-4">Air Travel Power Guide</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-2">TSA Regulations</h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Maximum 100Wh capacity for carry-on</li>
                    <li>• Must be in carry-on bag, not checked</li>
                    <li>• Spare batteries must be protected</li>
                    <li>• Some airlines have additional restrictions</li>
                    <li>• Always check current regulations</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Travel Tips</h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Charge fully before departure</li>
                    <li>• Bring appropriate cables for your devices</li>
                    <li>• Consider international plug adapters</li>
                    <li>• Pack in easily accessible location</li>
                    <li>• Have backup charging options</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold mb-4">Device Charging</h3>
              <div className="space-y-4">
                <div className="border-b pb-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">iPhone</span>
                    <span className="text-sm text-purple-500">6-8 charges</span>
                  </div>
                </div>
                <div className="border-b pb-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Android Phone</span>
                    <span className="text-sm text-purple-500">5-7 charges</span>
                  </div>
                </div>
                <div className="border-b pb-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">iPad</span>
                    <span className="text-sm text-purple-500">2-3 charges</span>
                  </div>
                </div>
                <div className="border-b pb-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">MacBook Air</span>
                    <span className="text-sm text-purple-500">1-1.5 charges</span>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Nintendo Switch</span>
                    <span className="text-sm text-purple-500">3-4 charges</span>
                  </div>
                </div>
              </div>
              <div className="text-xs text-gray-500 mt-3">
                *Based on 90Wh average capacity
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6">
              <h3 className="text-lg font-bold mb-3">Travel Checklist</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                  <span>Power bank fully charged</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                  <span>All charging cables packed</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                  <span>International adapters if needed</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                  <span>TSA compliance verified</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                  <span>Airline restrictions checked</span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6">
              <h3 className="text-lg font-bold mb-3">Airline Policies</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>American Airlines:</span>
                  <span className="text-green-600">✓ 100Wh</span>
                </div>
                <div className="flex justify-between">
                  <span>Delta:</span>
                  <span className="text-green-600">✓ 100Wh</span>
                </div>
                <div className="flex justify-between">
                  <span>United:</span>
                  <span className="text-green-600">✓ 100Wh</span>
                </div>
                <div className="flex justify-between">
                  <span>Southwest:</span>
                  <span className="text-green-600">✓ 100Wh</span>
                </div>
                <div className="text-xs text-gray-500 mt-2">
                  *Policies subject to change, always verify current rules
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6">
              <h3 className="text-lg font-bold mb-3">Newsletter</h3>
              <p className="text-sm text-gray-600 mb-4">
                Get travel tech tips and portable power reviews.
              </p>
              <div className="space-y-3">
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <button className="w-full bg-white text-purple-500 font-semibold py-3 px-6 rounded-xl hover:bg-gray-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105">
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
