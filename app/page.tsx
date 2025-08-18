import { PostsList } from '@/components/PostsList';
// import { Newsletter } from '@/components/Newsletter';
import { Top10Popular } from '@/components/Top10Popular';
import Link from 'next/link';
import fs from "fs";

const getPostMetadata = () => {
  // This function is unused in this component - PostsList handles metadata
  // Keeping for backward compatibility but functionality moved to PostsList
  return [];
}

export default function Home() {
  const trendingCategories = [
    { title: 'Best Power Stations', href: '/best/power-stations', isActive: true },
    { title: 'Best Cameras', href: '/best/cameras' },
    { title: 'Best Tools & Knives', href: '/best/knives-tools' },
    { title: 'Best Home Backup', href: '/best/power-stations/house-backup-power-stations' },
    { title: 'Expert Insights', href: '/best' }
  ];

  return (
    <div className="flex min-h-screen flex-col">
      {/* Trending Section at Top */}
      <section className="bg-gradient-to-r from-trustworthy/5 to-purple-500/5 border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex items-center overflow-x-auto py-4">
            <span className="text-sm font-semibold text-gray-600 mr-6 whitespace-nowrap">
              TRENDING
            </span>
            <div className="flex space-x-1">
              {trendingCategories.map((category, index) => (
                <Link
                  key={category.title}
                  href={category.href}
                  className={`px-6 py-3 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                    category.isActive
                      ? 'bg-trustworthy text-white shadow-md'
                      : 'text-gray-600 hover:text-trustworthy hover:bg-white/50'
                  }`}
                >
                  {category.title}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <main className="container mx-auto flex-grow px-4 py-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <PostsList />
          <aside className="space-y-8">
            {/* <Newsletter /> */}
            <Link href="/review" className="cursor-pointer text-purple-500 hover:text-purple-700">
              Click here to review McDonald&apos;s
            </Link>
            <Top10Popular />
          </aside>
        </div>
      </main>
    </div>
  );
}
