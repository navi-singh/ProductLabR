import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import RatingBadge from '@/components/article/RatingBadge';
import StarRating from '@/components/article/StarRating';

export default function BestProfessionalCameras() {
  const professionalCameras = [
    {
      rank: 1,
      name: 'Nikon Z9',
      href: '/articles/nikon_z9',
      price: '$5,496',
      rating: 9.6,
      image: '/images/item.png',
      keyFeatures: ['45.7MP sensor', '8K 60p video', 'Flagship hybrid', 'Rugged build'],
      pros: ['Flagship hybrid performance', 'Rugged professional build', 'Excellent 8K video quality'],
      cons: ['Very expensive', 'Large and heavy', 'Complex feature set'],
      bestFor: 'Professional photographers and videographers demanding flagship performance'
    },
    {
      rank: 2,
      name: 'Sony A1 II',
      href: '/articles/sony_a1_ii',
      price: '$6,499',
      rating: 9.4,
      image: '/images/item.png',
      keyFeatures: ['50MP sensor', '8K 30p video', 'Elite performance', 'AI recognition AF'],
      pros: ['High-resolution 50MP sensor', 'Exceptional speed and performance', 'Advanced AI autofocus'],
      cons: ['Extremely expensive', 'Complex menu system', 'Battery life under heavy use'],
      bestFor: 'Elite professionals demanding ultimate all-around performance'
    },
    {
      rank: 3,
      name: 'Canon EOS R5 Mark II',
      href: '/articles/canon_eos_r5_mark_ii',
      price: '$4,299',
      rating: 9.5,
      image: '/images/item.png',
      keyFeatures: ['45MP sensor', '8K 30p video', 'Eye Control AF', 'Hybrid powerhouse'],
      pros: ['Outstanding hybrid performance', 'Advanced autofocus with Eye Control', 'Professional build'],
      cons: ['Very expensive', 'Heat management in 8K', 'Large file sizes'],
      bestFor: 'Hybrid powerhouse for demanding professional users'
    },
    {
      rank: 4,
      name: 'Fujifilm GFX100 II',
      href: '/articles/fujifilm_gfx100_ii',
      price: '$7,499',
      rating: 9.3,
      image: '/images/item.png',
      keyFeatures: ['102MP medium format', '8K 30p video', 'Medium format excellence', '8-stop IBIS'],
      pros: ['Medium-format excellence', '102MP incredible resolution', '8K video capability'],
      cons: ['Extremely expensive', 'Large file sizes', 'Limited lens selection'],
      bestFor: 'Professional photographers demanding ultimate quality and resolution'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-gray-800 to-black text-white">
        <div className="container mx-auto px-4 py-10">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">
            Best Professional Cameras 2025
          </h1>
          <p className="text-lg md:text-xl mb-6 text-gray-300">
            Flagship cameras delivering ultimate performance for professional work
          </p>
          <div className="flex flex-wrap gap-4">
            <span className="bg-white/20 px-4 py-2 rounded-full text-sm">
              Flagship Performance
            </span>
            <span className="bg-white/20 px-4 py-2 rounded-full text-sm">
              Professional Build
            </span>
            <span className="bg-white/20 px-4 py-2 rounded-full text-sm">
              Ultimate Quality
            </span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Top 4 Professional Cameras</h2>
              <p className="text-gray-600 mb-6">
                These cameras represent the absolute pinnacle of camera technology, designed for 
                professional photographers and videographers who demand the highest performance, 
                build quality, and feature sets available today.
              </p>
            </div>

            {/* Camera Rankings */}
            <div className="space-y-8">
              {professionalCameras.map((camera) => (
                <div key={camera.rank} className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="bg-gray-800 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">
                        {camera.rank}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold">{camera.name}</h3>
                        <p className="text-gray-600">{camera.bestFor}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-800 mb-1">{camera.price}</div>
                      <RatingBadge rating={camera.rating} />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <h4 className="font-semibold mb-2 text-gray-800">Key Features</h4>
                      <ul className="space-y-1">
                        {camera.keyFeatures.map((feature, index) => (
                          <li key={index} className="text-sm text-gray-600">• {feature}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2 text-gray-800">Pros</h4>
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
                      className="bg-gray-800 text-white px-8 py-3 rounded-xl font-semibold hover:bg-gray-900 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                      Read Review →
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* Professional Guide */}
            <div className="mt-12 bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-4">Professional Camera Guide</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-2">Professional Requirements</h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Weather sealing and rugged construction</li>
                    <li>• Dual memory card slots for redundancy</li>
                    <li>• Professional video codecs and formats</li>
                    <li>• Advanced autofocus with subject tracking</li>
                    <li>• High-resolution sensors for detailed work</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Investment Considerations</h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Professional cameras are long-term investments</li>
                    <li>• Consider total system cost including lenses</li>
                    <li>• Factor in insurance and maintenance costs</li>
                    <li>• Evaluate upgrade cycles and resale value</li>
                    <li>• Consider rental options for specific projects</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold mb-4">Professional Features</h3>
              <div className="space-y-4">
                <div className="border-b pb-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Best Overall</span>
                    <span className="text-sm text-gray-800">Nikon Z9</span>
                  </div>
                </div>
                <div className="border-b pb-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Highest Resolution</span>
                    <span className="text-sm text-gray-800">GFX100 II</span>
                  </div>
                </div>
                <div className="border-b pb-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Best Speed</span>
                    <span className="text-sm text-gray-800">Sony A1 II</span>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Best Hybrid</span>
                    <span className="text-sm text-gray-800">Canon R5 Mark II</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6">
              <h3 className="text-lg font-bold mb-3">Professional Services</h3>
              <p className="text-sm text-gray-600 mb-4">
                Professional camera support and services for working photographers.
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-gray-800 rounded-full"></span>
                  <span>Extended warranty programs</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-gray-800 rounded-full"></span>
                  <span>Priority repair services</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-gray-800 rounded-full"></span>
                  <span>Loaner equipment programs</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-gray-800 rounded-full"></span>
                  <span>Professional training workshops</span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6">
              <h3 className="text-lg font-bold mb-3">Newsletter</h3>
              <p className="text-sm text-gray-600 mb-4">
                Get professional camera news and industry insights.
              </p>
              <div className="space-y-3">
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                />
                <button className="w-full bg-white text-gray-800 font-semibold py-3 px-6 rounded-xl hover:bg-gray-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105">
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
