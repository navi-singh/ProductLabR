import Link from 'next/link';

import RatingBadge from '@/components/article/RatingBadge';
import StarRating from '@/components/article/StarRating';

export default function BestCampingPowerStations() {
  const campingStations = [
    {
      rank: 1,
      name: 'EcoFlow River 2 Pro',
      href: '/articles/ecoflow_river_2_pro',
      price: '$599',
      rating: 9.1,
      capacity: '768Wh',
      output: '800W',
      weight: '17.2 lbs',
      image: '/images/item.png',
      keyFeatures: ['768Wh LiFePO4 battery', '800W AC output', 'Fast 70min charging', 'X-Stream technology'],
      pros: ['Perfect camping capacity', 'Ultra-fast charging', 'Lightweight and portable'],
      cons: ['Limited to smaller appliances', 'No wireless charging', 'Price premium'],
      bestFor: 'Car camping and weekend outdoor adventures'
    },
    {
      rank: 2,
      name: 'Jackery Explorer 1000 v2',
      href: '/articles/jackery_explorer_1000_v2',
      price: '$799',
      rating: 8.9,
      capacity: '1070Wh',
      output: '1500W',
      weight: '23.8 lbs',
      image: '/images/item.png',
      keyFeatures: ['1070Wh capacity', '1500W output', 'ChargeShield 2.0', 'Emergency SOS'],
      pros: ['Higher capacity for longer trips', 'Powerful output for larger devices', 'Excellent build quality'],
      cons: ['Heavier than competitors', 'Slower charging speed', 'Premium pricing'],
      bestFor: 'Extended camping trips requiring more power'
    },
    {
      rank: 3,
      name: 'Bluetti EB70S',
      href: '/articles/bluetti_eb70s',
      price: '$449',
      rating: 8.7,
      capacity: '716Wh',
      output: '800W',
      weight: '21.4 lbs',
      image: '/images/item.png',
      keyFeatures: ['716Wh LiFePO4 battery', '800W pure sine wave', 'Wireless charging pad', 'LED flashlight'],
      pros: ['Great value for capacity', 'Wireless charging convenience', 'Multiple charging options'],
      cons: ['Heavier than expected', 'Fan can be noisy', 'Limited warranty'],
      bestFor: 'Budget-conscious campers wanting good capacity'
    },
    {
      rank: 4,
      name: 'Goal Zero Yeti 500X',
      href: '/articles/goal_zero_yeti_500x',
      price: '$699',
      rating: 8.5,
      capacity: '505Wh',
      output: '300W',
      weight: '12.9 lbs',
      image: '/images/item.png',
      keyFeatures: ['505Wh lithium battery', '300W AC inverter', 'WiFi app control', 'Boulder solar ready'],
      pros: ['Lightweight and portable', 'Excellent app integration', 'Reliable brand reputation'],
      cons: ['Lower output power', 'Expensive for capacity', 'Limited AC outlets'],
      bestFor: 'Ultralight camping and backpacking'
    },
    {
      rank: 5,
      name: 'Anker SOLIX C800',
      href: '/articles/anker_solix_c800',
      price: '$399',
      rating: 8.3,
      capacity: '768Wh',
      output: '1200W',
      weight: '19.8 lbs',
      image: '/images/item.png',
      keyFeatures: ['768Wh LiFePO4 battery', '1200W SurgePad', 'HyperFlash charging', '5-year warranty'],
      pros: ['Excellent value proposition', 'High surge power rating', 'Long warranty coverage'],
      cons: ['Newer brand in power stations', 'Limited service network', 'Basic app features'],
      bestFor: 'Value-focused campers wanting reliable power'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-trustworthy/10 to-purple-500/10 bg-gray-50 text-gray-800">
        <div className="container mx-auto px-4 py-10">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">
            Best Camping Power Stations 2025
          </h1>
          <p className="text-lg md:text-xl mb-6 text-gray-600">
            Compact and lightweight power solutions for outdoor adventures
          </p>
          <div className="flex flex-wrap gap-4">
            <span className="bg-white/80 px-4 py-2 rounded-full text-sm border border-gray-200 text-gray-700">
              Ultra-Portable
            </span>
            <span className="bg-white/80 px-4 py-2 rounded-full text-sm border border-gray-200 text-gray-700">
              Weather Resistant
            </span>
            <span className="bg-white/80 px-4 py-2 rounded-full text-sm border border-gray-200 text-gray-700">
              Silent Operation
            </span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Top 5 Camping Power Stations</h2>
              <p className="text-gray-600 mb-6">
                These compact power stations are specifically chosen for camping and outdoor use. 
                They balance portability, capacity, and durability to provide reliable power for 
                your outdoor adventures without weighing you down.
              </p>
            </div>

            {/* Power Station Rankings */}
            <div className="space-y-8">
              {campingStations.map((station) => (
                <div key={station.rank} className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="bg-orange-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">
                        {station.rank}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold">{station.name}</h3>
                        <p className="text-gray-600">{station.bestFor}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-orange-500 mb-1">{station.price}</div>
                      <RatingBadge rating={station.rating} />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-lg font-bold text-orange-500">{station.capacity}</div>
                      <div className="text-sm text-gray-600">Capacity</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-lg font-bold text-orange-500">{station.output}</div>
                      <div className="text-sm text-gray-600">AC Output</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-lg font-bold text-orange-500">{station.weight}</div>
                      <div className="text-sm text-gray-600">Weight</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-lg font-bold text-orange-500">LiFePO4</div>
                      <div className="text-sm text-gray-600">Battery</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <h4 className="font-semibold mb-2 text-orange-500">Key Features</h4>
                      <ul className="space-y-1">
                        {station.keyFeatures.map((feature, index) => (
                          <li key={index} className="text-sm text-gray-600">• {feature}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2 text-orange-500">Pros</h4>
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

            {/* Camping Guide */}
            <div className="mt-12 bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-4">Camping Power Station Guide</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-2">Essential Camping Features</h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Lightweight design (under 25 lbs)</li>
                    <li>• Weather-resistant construction</li>
                    <li>• Silent operation for peaceful camping</li>
                    <li>• Multiple charging options (solar, car, AC)</li>
                    <li>• LED flashlight or emergency lighting</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Capacity Planning</h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Weekend trip: 500-800Wh sufficient</li>
                    <li>• Week-long camping: 1000Wh+ recommended</li>
                    <li>• Consider solar panels for extended trips</li>
                    <li>• Factor in weather and usage patterns</li>
                    <li>• Plan for emergency power reserve</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold mb-4">Camping Power Needs</h3>
              <div className="space-y-4">
                <div className="border-b pb-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Phone Charging</span>
                    <span className="text-sm text-orange-500">50+ charges</span>
                  </div>
                </div>
                <div className="border-b pb-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">LED Lantern</span>
                    <span className="text-sm text-orange-500">80+ hours</span>
                  </div>
                </div>
                <div className="border-b pb-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Portable Fridge</span>
                    <span className="text-sm text-orange-500">12-24 hours</span>
                  </div>
                </div>
                <div className="border-b pb-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Laptop</span>
                    <span className="text-sm text-orange-500">8-12 charges</span>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Electric Cooler</span>
                    <span className="text-sm text-orange-500">8-16 hours</span>
                  </div>
                </div>
              </div>
              <div className="text-xs text-gray-500 mt-3">
                *Based on 700Wh average capacity
              </div>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-6">
              <h3 className="text-lg font-bold mb-3">Camping Checklist</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                  <span>Power station fully charged</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                  <span>Solar panel for recharging</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                  <span>Car charging cable</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                  <span>Device charging cables</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                  <span>Weather protection cover</span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-6">
              <h3 className="text-lg font-bold mb-3">Newsletter</h3>
              <p className="text-sm text-gray-600 mb-4">
                Get camping power tips and outdoor gear reviews.
              </p>
              <div className="space-y-3">
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
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
