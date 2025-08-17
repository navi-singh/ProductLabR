import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import RatingBadge from '@/components/article/RatingBadge';
import StarRating from '@/components/article/StarRating';

export default function BestProfessionalPhotoCameras() {
  const professionalPhotoCameras = [
    {
      rank: 1,
      name: 'Sony A1 II',
      href: '/articles/sony_a1_ii',
      price: '$6,499',
      rating: 9.6,
      image: '/images/item.png',
      keyFeatures: ['50MP sensor', 'Ultimate stills quality', 'Speed + autofocus', 'Video chops'],
      pros: ['Ultimate stills quality with speed', 'Advanced autofocus and video capabilities', 'Professional performance'],
      cons: ['Extremely expensive', 'Complex menu system', 'Battery life under heavy use'],
      bestFor: 'Ultimate stills quality with speed, autofocus, and video capabilities'
    },
    {
      rank: 2,
      name: 'Fujifilm GFX100 II',
      href: '/articles/fujifilm_gfx100_ii',
      price: '$7,499',
      rating: 9.5,
      image: '/images/item.png',
      keyFeatures: ['102MP medium format', 'Spectacular image quality', 'Dynamic range', '8K video'],
      pros: ['Spectacular image quality and dynamic range', 'Medium format advantages', '8K video capability'],
      cons: ['Extremely expensive', 'Large file sizes', 'Limited lens selection'],
      bestFor: 'Spectacular image quality and dynamic range in medium format'
    },
    {
      rank: 3,
      name: 'Hasselblad X2D 100C',
      href: '/articles/hasselblad_x2d_100c',
      price: '$8,199',
      rating: 9.3,
      image: '/images/item.png',
      keyFeatures: ['100MP medium format', 'Leaf shutter', 'Exquisite color', 'Premium build'],
      pros: ['100MP medium format sensor', 'Leaf shutter capability', 'Exquisite color rendering'],
      cons: ['Extremely expensive', 'Limited video capabilities', 'Slow operation compared to others'],
      bestFor: '100MP, leaf shutter, exquisite color rendering'
    },
    {
      rank: 4,
      name: 'Nikon Z9',
      href: '/articles/nikon_z9',
      price: '$5,496',
      rating: 9.2,
      image: '/images/item.png',
      keyFeatures: ['45.7MP sensor', 'High-speed stills', 'Professional camera', '8K video'],
      pros: ['High-speed stills performance', 'Professional camera build', 'Excellent 8K video'],
      cons: ['Very expensive', 'Large and heavy', 'Complex feature set'],
      bestFor: 'High-speed stills performance in a professional camera'
    },
    {
      rank: 5,
      name: 'Leica M11',
      href: '/articles/leica_m11',
      price: '$8,995',
      rating: 8.8,
      image: '/images/item.png',
      keyFeatures: ['60MP rangefinder', 'Classic craftsmanship', 'Unique experience', 'Heritage'],
      pros: ['High-resolution rangefinder', 'Classic craftsmanship', 'Unique shooting experience'],
      cons: ['Extremely expensive', 'No autofocus or video', 'Manual focus only'],
      bestFor: 'High-resolution rangefinder with classic craftsmanship'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-amber-600 to-orange-600 text-white">
        <div className="container mx-auto px-4 py-10">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">
            Best Professional Photo Cameras 2025
          </h1>
          <p className="text-lg md:text-xl mb-6 text-amber-100">
            Ultimate cameras focused on delivering the highest still image quality
          </p>
          <div className="flex flex-wrap gap-4">
            <span className="bg-white/20 px-4 py-2 rounded-full text-sm">
              Still-Focused
            </span>
            <span className="bg-white/20 px-4 py-2 rounded-full text-sm">
              Maximum Resolution
            </span>
            <span className="bg-white/20 px-4 py-2 rounded-full text-sm">
              Professional Quality
            </span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Top 5 Professional Photo Cameras</h2>
              <p className="text-gray-600 mb-6">
                These cameras are specifically chosen for their exceptional still image quality, 
                resolution, dynamic range, and professional features. While some offer video capabilities, 
                their primary strength lies in delivering the absolute best photographic performance.
              </p>
            </div>

            {/* Camera Rankings */}
            <div className="space-y-8">
              {professionalPhotoCameras.map((camera) => (
                <div key={camera.rank} className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="bg-amber-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">
                        {camera.rank}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold">{camera.name}</h3>
                        <p className="text-gray-600">{camera.bestFor}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-amber-600 mb-1">{camera.price}</div>
                      <RatingBadge rating={camera.rating} />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <h4 className="font-semibold mb-2 text-amber-600">Key Features</h4>
                      <ul className="space-y-1">
                        {camera.keyFeatures.map((feature, index) => (
                          <li key={index} className="text-sm text-gray-600">• {feature}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2 text-amber-600">Pros</h4>
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
                      className="bg-amber-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-amber-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                      Read Review →
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* Photography Guide */}
            <div className="mt-12 bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-4">Professional Photography Guide</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-2">What Makes a Great Photo Camera?</h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• High resolution for detailed prints</li>
                    <li>• Excellent dynamic range and color depth</li>
                    <li>• Superior low-light performance</li>
                    <li>• Precise autofocus for critical sharpness</li>
                    <li>• Professional build quality and reliability</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Photography Specializations</h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Portrait: Medium format for ultimate quality</li>
                    <li>• Landscape: High resolution and dynamic range</li>
                    <li>• Commercial: Professional features and reliability</li>
                    <li>• Fine Art: Maximum image quality and color</li>
                    <li>• Street: Compact rangefinders for discretion</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold mb-4">Photography Specialties</h3>
              <div className="space-y-4">
                <div className="border-b pb-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Best Overall</span>
                    <span className="text-sm text-amber-600">Sony A1 II</span>
                  </div>
                </div>
                <div className="border-b pb-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Highest Resolution</span>
                    <span className="text-sm text-amber-600">GFX100 II</span>
                  </div>
                </div>
                <div className="border-b pb-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Best Color</span>
                    <span className="text-sm text-amber-600">Hasselblad X2D</span>
                  </div>
                </div>
                <div className="border-b pb-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Best Speed</span>
                    <span className="text-sm text-amber-600">Nikon Z9</span>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Most Unique</span>
                    <span className="text-sm text-amber-600">Leica M11</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6">
              <h3 className="text-lg font-bold mb-3">Resolution Comparison</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span>Fujifilm GFX100 II:</span>
                  <span className="font-bold">102MP</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span>Hasselblad X2D 100C:</span>
                  <span className="font-bold">100MP</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span>Leica M11:</span>
                  <span className="font-bold">60MP</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span>Sony A1 II:</span>
                  <span className="font-bold">50MP</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span>Nikon Z9:</span>
                  <span className="font-bold">45.7MP</span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6">
              <h3 className="text-lg font-bold mb-3">Newsletter</h3>
              <p className="text-sm text-gray-600 mb-4">
                Get professional photography tips and camera reviews.
              </p>
              <div className="space-y-3">
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                <button className="w-full bg-white text-amber-600 font-semibold py-3 px-6 rounded-xl hover:bg-gray-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105">
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
