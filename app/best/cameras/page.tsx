import { Metadata } from 'next';
import Link from 'next/link';
import { Card } from '@/components/card';
import RatingBadge from '@/components/article/RatingBadge';

export const metadata: Metadata = {
  title: 'Best Cameras 2025 - Expert Reviews & Buying Guide',
  description: 'The best cameras for photography and videography. Expert tested mirrorless, DSLR, and hybrid cameras for professionals and enthusiasts.',
};

interface Camera {
  id: string;
  name: string;
  title: string;
  image: string;
  sensor: string;
  video: string;
  price: string;
  rating: number;
  pros: string[];
  cons: string[];
  bestFor: string;
  href: string;
  badge?: string;
}

const cameras: Camera[] = [
  {
    id: 'lumix-s5-ii',
    name: 'Panasonic Lumix S5 II',
    title: 'Best Hybrid Camera Overall',
    image: '/images/posts/lumix_s5ii.webp',
    sensor: '24.2MP Full-Frame',
    video: '6K 30p, 4K 60p',
    price: '$1,999',
    rating: 4.6,
    pros: ['Phase-detection autofocus breakthrough', '6K video recording', 'Outstanding IBIS', 'Weather-sealed build'],
    cons: ['AF trails Sony/Canon', 'Limited lens ecosystem', 'Complex menu system'],
    bestFor: 'Content creators, hybrid shooters, video professionals',
    href: '/articles/lumix_s5_ii',
    badge: 'Editor\'s Choice'
  },
  {
    id: 'sony-a7r-v',
    name: 'Sony α7R V',
    title: 'Best High-Resolution Camera',
    image: '/images/item.png',
    sensor: '61MP Full-Frame',
    video: '8K 24p, 4K 60p',
    price: '$3,898',
    rating: 4.5,
    pros: ['Highest resolution in class', 'Advanced AI autofocus', 'Excellent stabilization', 'Professional build quality'],
    cons: ['Very expensive', 'Large file sizes', 'Battery life could be better'],
    bestFor: 'Professional photographers, high-resolution needs',
    href: '/articles/sony_7r_v'
  },
  {
    id: 'canon-r6-mark-ii',
    name: 'Canon EOS R6 Mark II',
    title: 'Best Action Camera',
    image: '/images/item.png',
    sensor: '24.2MP Full-Frame',
    video: '4K 60p, 6K RAW',
    price: '$2,499',
    rating: 4.4,
    pros: ['Excellent autofocus performance', 'Great low-light capabilities', 'Professional video features', 'Reliable build quality'],
    cons: ['Limited resolution compared to competitors', 'Premium pricing', 'Menu system complexity'],
    bestFor: 'Action photography, video production',
    href: '/articles/canon_eos_r6_mark_ii'
  }
];

const cameraTypes = [
  {
    type: 'Mirrorless Cameras',
    description: 'Compact, versatile cameras with electronic viewfinders and excellent video capabilities.',
    examples: 'Sony α7 series, Canon R series, Panasonic S series'
  },
  {
    type: 'DSLR Cameras', 
    description: 'Traditional cameras with optical viewfinders, excellent battery life, and extensive lens selections.',
    examples: 'Canon EOS 5D, Nikon D850, Pentax K-1'
  },
  {
    type: 'Action Cameras',
    description: 'Ultra-compact, rugged cameras designed for extreme sports and adventure recording.',
    examples: 'GoPro Hero series, DJI Action series, Insta360'
  },
  {
    type: 'Cinema Cameras',
    description: 'Professional video-focused cameras with advanced recording capabilities and modular designs.',
    examples: 'Blackmagic Design, RED cameras, Canon Cinema EOS'
  }
];

const buyingFactors = [
  {
    title: 'Sensor Size',
    description: 'Larger sensors capture more light and provide better image quality, especially in low light.',
    recommendation: 'Full-frame for professionals, APS-C for enthusiasts'
  },
  {
    title: 'Autofocus System',
    description: 'Modern phase-detection systems are essential for fast, accurate focusing in photos and video.',
    recommendation: 'Hybrid AF with subject detection'
  },
  {
    title: 'Video Capabilities',
    description: 'Consider resolution, frame rates, recording formats, and stabilization for video work.',
    recommendation: '4K 60p minimum for serious video'
  },
  {
    title: 'Lens Ecosystem',
    description: 'Available lenses determine your creative possibilities and future upgrade paths.',
    recommendation: 'Established systems offer more choices'
  }
];

export default function CamerasPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-trustworthy/10 to-purple-500/10 bg-gray-50 text-gray-800">
        <div className="container mx-auto px-4 py-10">
          <div className="max-w-4xl">
            <div className="flex items-center mb-4">
              <Link href="/best" className="text-gray-600 hover:text-gray-800 mr-2">Best Products</Link>
              <span className="text-gray-500">›</span>
              <span className="ml-2">Cameras</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold mb-4">
              Best Cameras 2025
            </h1>
            <p className="text-lg md:text-xl mb-6 text-gray-600">
              Expert-tested cameras for photography and videography. From mirrorless to cinema cameras, we help you find the perfect tool for your creative vision.
            </p>
            <div className="flex flex-wrap gap-4">
              <div className="bg-white/80 backdrop-blur-sm rounded-lg px-4 py-2 border border-gray-200">
                <span className="text-sm text-gray-700">15+ Cameras Tested</span>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-lg px-4 py-2 border border-gray-200">
                <span className="text-sm text-gray-700">Real-World Testing</span>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-lg px-4 py-2 border border-gray-200">
                <span className="text-sm text-gray-700">Professional Reviews</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Camera Categories */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Camera Categories</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Explore our comprehensive camera reviews organized by category and use case
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link href="/best/cameras/hybrid-cameras" className="group">
              <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-6 hover:shadow-lg transition-all duration-300 group-hover:scale-105">
                <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-white font-bold text-xl">📸</span>
                </div>
                <h3 className="text-xl font-bold mb-2">Best Hybrid Cameras</h3>
                <p className="text-gray-600 text-sm mb-3">Top cameras excelling at both photography and videography</p>
                <div className="text-purple-600 font-semibold text-sm">5 cameras reviewed →</div>
              </div>
            </Link>
            
            <Link href="/best/cameras/hybrid-cameras-under-3000" className="group">
              <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl p-6 hover:shadow-lg transition-all duration-300 group-hover:scale-105">
                <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-white font-bold text-xl">💰</span>
                </div>
                <h3 className="text-xl font-bold mb-2">Hybrid Under $3,000</h3>
                <p className="text-gray-600 text-sm mb-3">Professional photo and video performance on a budget</p>
                <div className="text-green-600 font-semibold text-sm">5 cameras reviewed →</div>
              </div>
            </Link>
            
            <Link href="/best/cameras/professional-cameras" className="group">
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 hover:shadow-lg transition-all duration-300 group-hover:scale-105">
                <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-white font-bold text-xl">🏆</span>
                </div>
                <h3 className="text-xl font-bold mb-2">Professional Cameras</h3>
                <p className="text-gray-600 text-sm mb-3">Flagship cameras delivering ultimate performance</p>
                <div className="text-gray-800 font-semibold text-sm">4 cameras reviewed →</div>
              </div>
            </Link>
            
            <Link href="/best/cameras/professional-photo-cameras" className="group">
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6 hover:shadow-lg transition-all duration-300 group-hover:scale-105">
                <div className="w-12 h-12 bg-amber-600 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-white font-bold text-xl">📷</span>
                </div>
                <h3 className="text-xl font-bold mb-2">Professional Photo</h3>
                <p className="text-gray-600 text-sm mb-3">Ultimate cameras focused on still image quality</p>
                <div className="text-amber-600 font-semibold text-sm">5 cameras reviewed →</div>
              </div>
            </Link>
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
              <p className="text-gray-600 mb-8">Our top camera picks based on extensive testing across different categories and use cases.</p>
              
              <div className="space-y-6">
                {cameras.map((camera, index) => (
                  <Card key={camera.id} className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                    <div className="flex flex-col md:flex-row">
                      <div className="md:w-1/3 relative">
                        <img 
                          src={camera.image} 
                          alt={camera.name}
                          className="w-full h-48 md:h-full object-cover"
                        />
                        {camera.badge && (
                          <div className="absolute top-3 left-3 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                            {camera.badge}
                          </div>
                        )}
                        <div className="absolute top-3 right-3">
                          <div className="bg-white text-purple-600 px-2 py-1 rounded-full text-sm font-bold">
                            #{index + 1}
                          </div>
                        </div>
                      </div>
                      
                      <div className="md:w-2/3 p-6">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-2xl font-bold">{camera.title}</h3>
                          <RatingBadge rating={camera.rating} />
                        </div>
                        
                        <h4 className="text-xl text-gray-700 mb-4">{camera.name}</h4>
                        
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                          <div>
                            <div className="text-sm text-gray-500">Sensor</div>
                            <div className="font-semibold">{camera.sensor}</div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-500">Video</div>
                            <div className="font-semibold">{camera.video}</div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-500">Price</div>
                            <div className="font-semibold text-purple-600">{camera.price}</div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <h5 className="font-semibold text-green-600 mb-1">Pros:</h5>
                            <ul className="text-sm text-gray-600 space-y-1">
                              {camera.pros.slice(0, 2).map((pro, i) => (
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
                              {camera.cons.slice(0, 2).map((con, i) => (
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
                            <div className="text-sm font-semibold">{camera.bestFor}</div>
                          </div>
                          <Link 
                            href={camera.href}
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

              {/* More Reviews Notice */}
              <div className="mt-8 bg-blue-50 border-l-4 border-blue-400 p-6 rounded-r-lg">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-blue-700">
                      <strong>More camera reviews in development!</strong> We're currently testing Fujifilm X-T5, Nikon Z9, and other top cameras. 
                      <Link href="#newsletter" className="underline ml-1">Subscribe to get notified</Link> when new reviews are published.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Camera Types Guide */}
            <section className="mb-12">
              <div className="bg-white rounded-lg shadow-lg p-8">
                <h2 className="text-3xl font-bold mb-6">Camera Types Explained</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {cameraTypes.map((type) => (
                    <div key={type.type} className="border-l-4 border-purple-500 pl-4">
                      <h3 className="text-xl font-semibold mb-2">{type.type}</h3>
                      <p className="text-gray-600 mb-3">{type.description}</p>
                      <div className="text-sm text-purple-600 font-medium">Examples: {type.examples}</div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Buying Guide */}
            <section className="mb-12">
              <div className="bg-white rounded-lg shadow-lg p-8">
                <h2 className="text-3xl font-bold mb-6">How to Choose the Right Camera</h2>
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
                    <h3 className="text-xl font-semibold mb-3">Image Quality</h3>
                    <p className="text-gray-300">Resolution, dynamic range, color accuracy, and low-light performance across various shooting conditions.</p>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-3">Performance</h3>
                    <p className="text-gray-300">Autofocus speed and accuracy, burst shooting, battery life, and handling in real-world scenarios.</p>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-3">Video Capabilities</h3>
                    <p className="text-gray-300">Recording quality, stabilization, autofocus during video, and professional features like log recording.</p>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-6 space-y-6">
              {/* Camera Finder Tool */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-semibold mb-4">Camera Finder</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Budget Range</label>
                    <select className="w-full border border-gray-300 rounded-md px-3 py-2">
                      <option>Under $1,000</option>
                      <option>$1,000 - $2,000</option>
                      <option>$2,000 - $3,000</option>
                      <option>$3,000+</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Primary Use</label>
                    <select className="w-full border border-gray-300 rounded-md px-3 py-2">
                      <option>Photography</option>
                      <option>Video/Content Creation</option>
                      <option>Both Photo & Video</option>
                      <option>Professional Work</option>
                    </select>
                  </div>
                  <button className="w-full bg-purple-500 text-white py-3 px-6 rounded-xl font-semibold hover:bg-purple-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105">
                    Find My Camera
                  </button>
                </div>
              </div>

              {/* Popular Guides */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-semibold mb-4">Popular Guides</h3>
                <div className="space-y-3">
                  <Link href="#" className="block text-blue-600 hover:underline text-sm">
                    Best Cameras for Beginners
                  </Link>
                  <Link href="#" className="block text-blue-600 hover:underline text-sm">
                    Mirrorless vs DSLR Guide
                  </Link>
                  <Link href="#" className="block text-blue-600 hover:underline text-sm">
                    Best Lenses for Each System
                  </Link>
                  <Link href="#" className="block text-blue-600 hover:underline text-sm">
                    Camera Settings Cheat Sheet
                  </Link>
                </div>
              </div>

              {/* Newsletter */}
              <div id="newsletter" className="bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg shadow-lg p-6 text-white">
                <h3 className="text-xl font-semibold mb-2">Camera Reviews</h3>
                <p className="text-purple-100 mb-4">Get notified about new camera reviews, comparisons, and buying guides.</p>
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
