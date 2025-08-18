import Link from 'next/link';

import RatingBadge from '@/components/article/RatingBadge';
import StarRating from '@/components/article/StarRating';

export default function BestHybridCamerasUnder3000() {
  const affordableHybridCameras = [
    {
      rank: 1,
      name: 'Sony A7 IV',
      href: '/articles/sony_a7_iv',
      price: '$2,498',
      rating: 9.0,
      image: '/images/item.png',
      keyFeatures: ['33MP full-frame', '4K 60p video', 'Real-time Eye AF', '5.5-stop IBIS'],
      pros: ['Balanced photo/video performance', 'Excellent value proposition', 'Reliable autofocus'],
      cons: ['Menu system complexity', 'Rolling shutter in video', 'Limited 4K recording time'],
      bestFor: 'Enthusiasts and semi-professionals seeking versatility'
    },
    {
      rank: 2,
      name: 'Nikon Z6 III',
      href: '/articles/nikon_z6_iii',
      price: '$2,499',
      rating: 8.9,
      image: '/images/item.png',
      keyFeatures: ['24.5MP sensor', '6K 60p video', '273-point AF', '8-stop IBIS'],
      pros: ['Excellent hybrid specifications', '6K internal recording', 'Outstanding stabilization'],
      cons: ['Lower resolution than competitors', 'Limited lens selection', 'Menu learning curve'],
      bestFor: 'Hybrid shooters prioritizing video capabilities'
    },
    {
      rank: 3,
      name: 'Canon EOS R6 Mark II',
      href: '/articles/canon_r6_mark_ii',
      price: '$2,499',
      rating: 8.8,
      image: '/images/item.png',
      keyFeatures: ['24.2MP sensor', '4K 60p video', 'Dual Pixel AF II', '8-stop IBIS'],
      pros: ['Excellent autofocus performance', 'Great low-light capabilities', 'Professional video features'],
      cons: ['Limited resolution', 'Premium pricing', 'Menu system complexity'],
      bestFor: 'Professional photographers and videographers'
    },
    {
      rank: 4,
      name: 'Panasonic Lumix S5 II',
      href: '/articles/lumix_s5_ii',
      price: '$1,999',
      rating: 8.6,
      image: '/images/item.png',
      keyFeatures: ['24.2MP sensor', '6K video', 'Phase detection AF', 'Full-frame hybrid'],
      pros: ['6K video recording', 'Excellent stabilization', 'Full-frame at great price'],
      cons: ['Slower autofocus than competitors', 'Limited lens ecosystem', 'Menu complexity'],
      bestFor: 'Budget-conscious hybrid shooters'
    },
    {
      rank: 5,
      name: 'Panasonic Lumix S1 II',
      href: '/articles/panasonic_lumix_s1_ii',
      price: '$2,799',
      rating: 8.5,
      image: '/images/item.png',
      keyFeatures: ['24.2MP sensor', '8K 30p video', 'DFD autofocus', '6.5-stop IBIS'],
      pros: ['High-quality 8K video', 'Versatile single body solution', 'Professional video features'],
      cons: ['Slower autofocus performance', 'Limited lens ecosystem', 'Complex menu system'],
      bestFor: 'Video-focused creators needing 8K capability'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-trustworthy/10 to-purple-500/10 bg-gray-50 text-gray-800">
        <div className="container mx-auto px-4 py-10">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">
            Best Hybrid Cameras Under $3,000
          </h1>
          <p className="text-lg md:text-xl mb-6 text-gray-600">
            Professional photo and video performance without breaking the bank
          </p>
          <div className="flex flex-wrap gap-4">
            <span className="bg-white/80 px-4 py-2 rounded-full text-sm border border-gray-200 text-gray-700">
              Budget-Friendly
            </span>
            <span className="bg-white/80 px-4 py-2 rounded-full text-sm border border-gray-200 text-gray-700">
              4K/6K Video
            </span>
            <span className="bg-white/80 px-4 py-2 rounded-full text-sm border border-gray-200 text-gray-700">
              Full-Frame Sensors
            </span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Top 5 Affordable Hybrid Cameras</h2>
              <p className="text-gray-600 mb-6">
                These cameras prove you don't need to spend a fortune to get excellent hybrid performance. 
                Each model offers professional features, high-quality video recording, and outstanding 
                still image capabilities at prices under $3,000.
              </p>
            </div>

            {/* Camera Rankings */}
            <div className="space-y-8">
              {affordableHybridCameras.map((camera) => (
                <div key={camera.rank} className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="bg-purple-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">
                        {camera.rank}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold">{camera.name}</h3>
                        <p className="text-gray-600">{camera.bestFor}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-purple-500 mb-1">{camera.price}</div>
                      <RatingBadge rating={camera.rating} />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <h4 className="font-semibold mb-2 text-purple-500">Key Features</h4>
                      <ul className="space-y-1">
                        {camera.keyFeatures.map((feature, index) => (
                          <li key={index} className="text-sm text-gray-600">• {feature}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2 text-purple-500">Pros</h4>
                      <ul className="space-y-1">
                        {camera.pros.map((pro, index) => (
                          <li key={index} className="text-sm text-gray-600">+ {pro}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <StarRating rating={camera.rating} />
                    <Link 
                      href={camera.href}
                                              className="bg-purple-500 text-white px-8 py-3 rounded-xl font-semibold hover:bg-purple-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                      Read Review →
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* Value Guide */}
            <div className="mt-12 bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-4">Budget Hybrid Camera Guide</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-2">What to Look For Under $3,000</h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• 4K video recording at minimum</li>
                    <li>• Full-frame sensor for better low-light</li>
                    <li>• In-body image stabilization</li>
                    <li>• Reliable autofocus system</li>
                    <li>• Good battery life for extended shooting</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Budget Considerations</h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Factor in lens costs for new systems</li>
                    <li>• Consider used/refurbished options</li>
                    <li>• Look for bundle deals with accessories</li>
                    <li>• Check for seasonal sales and promotions</li>
                    <li>• Evaluate upgrade path for future needs</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold mb-4">Price Comparison</h3>
              <div className="space-y-4">
                <div className="border-b pb-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Best Value</span>
                    <span className="text-sm text-green-600">Sony A7 IV</span>
                  </div>
                </div>
                <div className="border-b pb-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Best Video</span>
                    <span className="text-sm text-green-600">Nikon Z6 III</span>
                  </div>
                </div>
                <div className="border-b pb-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Best AF</span>
                    <span className="text-sm text-green-600">Canon R6 Mark II</span>
                  </div>
                </div>
                <div className="border-b pb-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Budget Pick</span>
                    <span className="text-sm text-green-600">Panasonic S5 II</span>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">8K Capable</span>
                    <span className="text-sm text-green-600">Panasonic S1 II</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl p-6">
              <h3 className="text-lg font-bold mb-3">Budget Calculator</h3>
              <p className="text-sm text-gray-600 mb-4">
                Don't forget to budget for essential accessories and lenses.
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Camera Body:</span>
                  <span className="font-medium">$2,000-$2,800</span>
                </div>
                <div className="flex justify-between">
                  <span>Essential Lens:</span>
                  <span className="font-medium">$500-$1,200</span>
                </div>
                <div className="flex justify-between">
                  <span>Memory Cards:</span>
                  <span className="font-medium">$100-$200</span>
                </div>
                <div className="flex justify-between">
                  <span>Extra Batteries:</span>
                  <span className="font-medium">$100-$150</span>
                </div>
                <div className="border-t pt-2 mt-2 flex justify-between font-bold">
                  <span>Total Budget:</span>
                  <span>$2,700-$4,350</span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl p-6">
              <h3 className="text-lg font-bold mb-3">Newsletter</h3>
              <p className="text-sm text-gray-600 mb-4">
                Get budget camera deals and reviews delivered to your inbox.
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
