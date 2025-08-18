import Link from 'next/link';


export default function PowerStationsHub() {
  const powerStationCategories = [
    {
      title: 'Portable Power Stations',
      description: 'Versatile power stations for camping, emergencies, and outdoor activities',
      href: '/best/power-stations/portable-power-stations',
      count: 7,
      priceRange: '$299 - $3,999',
      icon: '🔋',
      color: 'from-green-500 to-blue-500',
      features: ['500Wh - 3000Wh capacity', 'Multiple output ports', 'Solar charging', 'Portable design']
    },
    {
      title: 'House Backup Power Stations',
      description: 'High-capacity units for whole-home backup during outages',
      href: '/best/power-stations/house-backup-power-stations',
      count: 4,
      priceRange: '$2,999 - $8,999',
      icon: '🏠',
      color: 'from-blue-500 to-purple-500',
      features: ['3000Wh+ capacity', 'Home integration', 'Transfer switches', 'Extended runtime']
    },
    {
      title: 'Camping Power Stations',
      description: 'Compact and lightweight power solutions for outdoor adventures',
      href: '/best/power-stations/camping-power-stations',
      count: 5,
      priceRange: '$199 - $1,499',
      icon: '⛺',
      color: 'from-orange-500 to-red-500',
      features: ['200Wh - 1000Wh capacity', 'Ultra-portable', 'Weather resistant', 'Silent operation']
    },
    {
      title: 'Carry-On Power Stations',
      description: 'TSA-approved power banks for travel and airline carry-on',
      href: '/best/power-stations/carry-on-power-stations',
      count: 3,
      priceRange: '$99 - $399',
      icon: '✈️',
      color: 'from-purple-500 to-pink-500',
      features: ['Under 100Wh capacity', 'TSA compliant', 'Compact design', 'Fast charging']
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-trustworthy/10 to-purple-500/10 bg-gray-50 text-gray-800">
        <div className="container mx-auto px-4 py-10">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">
            Best Power Stations 2025
          </h1>
          <p className="text-lg md:text-xl mb-6 text-gray-600">
            Expert-tested portable power solutions for every need and budget
          </p>
          <div className="flex flex-wrap gap-4">
            <span className="bg-white/80 px-4 py-2 rounded-full text-sm border border-gray-200 text-gray-700">
              19+ Models Tested
            </span>
            <span className="bg-white/80 px-4 py-2 rounded-full text-sm border border-gray-200 text-gray-700">
              Real-World Performance
            </span>
            <span className="bg-white/80 px-4 py-2 rounded-full text-sm border border-gray-200 text-gray-700">
              All Budgets Covered
            </span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Power Station Categories</h2>
              <p className="text-gray-600 mb-6">
                Choose the right power station category based on your specific needs, from portable camping 
                solutions to whole-home backup systems. Each category has been carefully curated and tested 
                for different use cases and power requirements.
              </p>
            </div>

            {/* Category Cards */}
            <div className="space-y-8">
              {powerStationCategories.map((category) => (
                <div key={category.title} className="bg-white rounded-xl shadow-lg overflow-hidden">
                  <div className={`bg-gradient-to-r ${category.color} p-6 text-white`}>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="text-4xl">{category.icon}</div>
                      <div>
                        <h3 className="text-2xl font-bold">{category.title}</h3>
                        <p className="text-white/90">{category.description}</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm">
                      <span className="bg-white/20 px-3 py-1 rounded-full">
                        {category.count} models reviewed
                      </span>
                      <span className="bg-white/20 px-3 py-1 rounded-full">
                        {category.priceRange}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div>
                        <h4 className="font-semibold mb-2">Key Features</h4>
                        <ul className="space-y-1">
                          {category.features.map((feature, index) => (
                            <li key={index} className="text-sm text-gray-600">• {feature}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Best For</h4>
                        <ul className="space-y-1 text-sm text-gray-600">
                          {category.title === 'Portable Power Stations' && (
                            <>
                              <li>• Camping and RV trips</li>
                              <li>• Emergency backup power</li>
                              <li>• Outdoor events and work</li>
                              <li>• Off-grid living</li>
                            </>
                          )}
                          {category.title === 'House Backup Power Stations' && (
                            <>
                              <li>• Whole-home power backup</li>
                              <li>• Extended outages</li>
                              <li>• Critical appliances</li>
                              <li>• Grid independence</li>
                            </>
                          )}
                          {category.title === 'Camping Power Stations' && (
                            <>
                              <li>• Backpacking trips</li>
                              <li>• Car camping</li>
                              <li>• Photography expeditions</li>
                              <li>• Festival camping</li>
                            </>
                          )}
                          {category.title === 'Carry-On Power Stations' && (
                            <>
                              <li>• Air travel</li>
                              <li>• Business trips</li>
                              <li>• Daily commuting</li>
                              <li>• Emergency phone charging</li>
                            </>
                          )}
                        </ul>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <Link 
                        href={category.href}
                        className="bg-purple-500 text-white px-8 py-3 rounded-xl font-semibold hover:bg-purple-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                      >
                        View {category.count} Models →
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Buying Guide */}
            <div className="mt-12 bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-4">Power Station Buying Guide</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-2">Capacity Considerations</h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• <strong>Under 500Wh:</strong> Phones, tablets, small devices</li>
                    <li>• <strong>500-1000Wh:</strong> Laptops, lights, small appliances</li>
                    <li>• <strong>1000-2000Wh:</strong> Refrigerators, power tools, camping</li>
                    <li>• <strong>2000Wh+:</strong> Home backup, large appliances</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Key Features to Consider</h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Output ports (AC, USB-C, DC, wireless)</li>
                    <li>• Charging speed and methods</li>
                    <li>• Weight and portability</li>
                    <li>• Battery chemistry (LiFePO4 vs Li-ion)</li>
                    <li>• Warranty and customer support</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold mb-4">Quick Finder</h3>
              <div className="space-y-4">
                <div className="border-b pb-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Budget Pick</span>
                    <span className="text-sm text-green-600">Under $500</span>
                  </div>
                </div>
                <div className="border-b pb-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Best Overall</span>
                    <span className="text-sm text-green-600">$1,000-$2,000</span>
                  </div>
                </div>
                <div className="border-b pb-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Home Backup</span>
                    <span className="text-sm text-green-600">$3,000+</span>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Travel Friendly</span>
                    <span className="text-sm text-green-600">Under 100Wh</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl p-6">
              <h3 className="text-lg font-bold mb-3">Power Calculator</h3>
              <p className="text-sm text-gray-600 mb-4">
                Estimate how long a power station will run your devices.
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Smartphone (10W):</span>
                  <span className="font-medium">50+ hours</span>
                </div>
                <div className="flex justify-between">
                  <span>Laptop (65W):</span>
                  <span className="font-medium">8-15 hours</span>
                </div>
                <div className="flex justify-between">
                  <span>Mini Fridge (60W):</span>
                  <span className="font-medium">8-16 hours</span>
                </div>
                <div className="flex justify-between">
                  <span>LED Light (10W):</span>
                  <span className="font-medium">50-100 hours</span>
                </div>
                <div className="text-xs text-gray-500 mt-2">
                  *Based on 1000Wh capacity with 85% efficiency
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl p-6">
              <h3 className="text-lg font-bold mb-3">Newsletter</h3>
              <p className="text-sm text-gray-600 mb-4">
                Get power station deals and energy independence tips.
              </p>
              <div className="space-y-3">
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
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
