import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import RatingBadge from '@/components/article/RatingBadge';
import StarRating from '@/components/article/StarRating';

export default function BestHybridCameras() {
  const hybridCameras = [
    {
      rank: 1,
      name: 'Canon EOS R5 Mark II',
      href: '/articles/canon_eos_r5_mark_ii',
      price: '$4,299',
      rating: 9.5,
      image: '/images/item.png',
      keyFeatures: ['8K 30p video', '45MP full-frame', 'Eye Control AF', '8.5-stop IBIS'],
      pros: ['Outstanding hybrid performance', 'Advanced autofocus system', 'Professional build quality'],
      cons: ['Very expensive', 'Heat management in 8K', 'Large file sizes'],
      bestFor: 'Professional hybrid shooters needing ultimate photo and video performance'
    },
    {
      rank: 2,
      name: 'Sony A1 II',
      href: '/articles/sony_a1_ii',
      price: '$6,499',
      rating: 9.4,
      image: '/images/item.png',
      keyFeatures: ['50MP sensor', '8K 30p video', 'AI recognition AF', 'Elite performance'],
      pros: ['Exceptional speed and performance', 'High-resolution sensor', 'Advanced AI autofocus'],
      cons: ['Extremely expensive', 'Complex menu system', 'Battery life under heavy use'],
      bestFor: 'Elite professionals demanding ultimate performance in both stills and video'
    },
    {
      rank: 3,
      name: 'Nikon Z8',
      href: '/articles/nikon_z8',
      price: '$3,996',
      rating: 9.2,
      image: '/images/item.png',
      keyFeatures: ['45.7MP sensor', '8K 60p video', 'Compact pro body', '6-stop IBIS'],
      pros: ['Compact pro-grade design', 'Excellent 8K video', 'Outstanding dynamic range'],
      cons: ['Expensive', 'Limited lens selection', 'Menu complexity'],
      bestFor: 'Professional hybrid shooters wanting compact form factor with pro features'
    },
    {
      rank: 4,
      name: 'Panasonic Lumix S1R II',
      href: '/articles/panasonic_lumix_s1r_ii',
      price: '$3,699',
      rating: 8.8,
      image: '/images/item.png',
      keyFeatures: ['47.3MP sensor', '6K 30p video', 'Pro video toolkit', '6.5-stop IBIS'],
      pros: ['Professional video features', 'High resolution sensor', 'Advanced codec support'],
      cons: ['Slower autofocus', 'Limited lens ecosystem', 'Complex video menus'],
      bestFor: 'Video professionals needing high resolution stills capability'
    },
    {
      rank: 5,
      name: 'Fujifilm X-H2S',
      href: '/articles/fujifilm_xh2s',
      price: '$2,499',
      rating: 8.6,
      image: '/images/item.png',
      keyFeatures: ['26.1MP APS-C', '6.2K 30p video', 'Compact powerhouse', '7-stop IBIS'],
      pros: ['APS-C powerhouse performance', 'Excellent video specs', 'Compact form factor'],
      cons: ['APS-C vs full-frame', 'Limited low-light performance', 'Smaller lens selection'],
      bestFor: 'Hybrid creators wanting compact high-performance system'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-500 to-blue-500 text-white">
        <div className="container mx-auto px-4 py-10">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">
            Best Hybrid Cameras 2025
          </h1>
          <p className="text-lg md:text-xl mb-6 text-purple-100">
            Top cameras excelling at both photography and videography
          </p>
          <div className="flex flex-wrap gap-4">
            <span className="bg-white/20 px-4 py-2 rounded-full text-sm">
              Photo + Video Excellence
            </span>
            <span className="bg-white/20 px-4 py-2 rounded-full text-sm">
              Professional Features
            </span>
            <span className="bg-white/20 px-4 py-2 rounded-full text-sm">
              8K Video Capability
            </span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Top 5 Hybrid Cameras</h2>
              <p className="text-gray-600 mb-6">
                These cameras represent the pinnacle of hybrid performance, offering exceptional capabilities 
                for both photography and videography. Each model has been tested extensively for image quality, 
                video performance, autofocus accuracy, and overall versatility.
              </p>
            </div>

            {/* Camera Rankings */}
            <div className="space-y-8">
              {hybridCameras.map((camera) => (
                <div key={camera.rank} className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="bg-purple-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">
                        {camera.rank}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold">{camera.name}</h3>
                        <p className="text-gray-600">{camera.bestFor}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-purple-600 mb-1">{camera.price}</div>
                      <RatingBadge rating={camera.rating} />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <h4 className="font-semibold mb-2 text-green-600">Key Features</h4>
                      <ul className="space-y-1">
                        {camera.keyFeatures.map((feature, index) => (
                          <li key={index} className="text-sm text-gray-600">• {feature}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2 text-green-600">Pros</h4>
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
                      className="bg-purple-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                      Read Review →
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* Buying Guide */}
            <div className="mt-12 bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-4">Hybrid Camera Buying Guide</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-2">What Makes a Great Hybrid Camera?</h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Excellent video recording capabilities (4K/8K)</li>
                    <li>• High-resolution sensor for detailed stills</li>
                    <li>• Advanced autofocus for both photo and video</li>
                    <li>• In-body image stabilization</li>
                    <li>• Professional video features and codecs</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Consider Your Needs</h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Budget: Hybrid cameras range from $2,500-$6,500</li>
                    <li>• Primary use: More photo or video focused?</li>
                    <li>• Portability: Full-frame vs APS-C considerations</li>
                    <li>• Lens ecosystem: Available lenses for your needs</li>
                    <li>• Learning curve: Menu complexity and features</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold mb-4">Quick Comparison</h3>
              <div className="space-y-4">
                <div className="border-b pb-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Best Overall</span>
                    <span className="text-sm text-purple-600">Canon R5 Mark II</span>
                  </div>
                </div>
                <div className="border-b pb-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Best Performance</span>
                    <span className="text-sm text-purple-600">Sony A1 II</span>
                  </div>
                </div>
                <div className="border-b pb-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Best Value</span>
                    <span className="text-sm text-purple-600">Nikon Z8</span>
                  </div>
                </div>
                <div className="border-b pb-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Best for Video</span>
                    <span className="text-sm text-purple-600">Panasonic S1R II</span>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Most Compact</span>
                    <span className="text-sm text-purple-600">Fujifilm X-H2S</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-6">
              <h3 className="text-lg font-bold mb-3">Newsletter</h3>
              <p className="text-sm text-gray-600 mb-4">
                Get the latest camera reviews and photography tips delivered to your inbox.
              </p>
              <div className="space-y-3">
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <button className="w-full bg-white text-purple-600 font-semibold py-3 px-6 rounded-xl hover:bg-gray-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105">
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
