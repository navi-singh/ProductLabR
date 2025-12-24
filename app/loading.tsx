export default function Loading() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Trending Section Skeleton */}
      <section className="bg-gradient-to-r from-trustworthy/5 to-purple-500/5 border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex items-center py-4">
            <div className="h-4 w-20 bg-gray-300 rounded mr-6 animate-pulse"></div>
            <div className="flex space-x-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-10 w-32 bg-gray-300 rounded-lg animate-pulse"></div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <main className="container mx-auto flex-grow px-4 py-8">
        {/* Hero Section Skeleton */}
        <section className="text-center mb-12">
          <div className="h-12 w-96 bg-gray-300 rounded mx-auto mb-4 animate-pulse"></div>
          <div className="h-6 w-full max-w-3xl bg-gray-300 rounded mx-auto mb-2 animate-pulse"></div>
          <div className="h-6 w-2/3 bg-gray-300 rounded mx-auto animate-pulse"></div>
        </section>

        {/* Category Sections Skeleton */}
        {[1, 2, 3].map((section) => (
          <section key={section} className="mb-16">
            <div className="border-b border-gray-200 pb-4 mb-8">
              <div className="h-8 w-64 bg-gray-300 rounded mb-2 animate-pulse"></div>
              <div className="h-4 w-full bg-gray-300 rounded animate-pulse"></div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((card) => (
                <div key={card} className="bg-white rounded-xl shadow-lg overflow-hidden">
                  <div className="h-48 bg-gray-300 animate-pulse"></div>
                  <div className="p-6">
                    <div className="h-6 w-full bg-gray-300 rounded mb-3 animate-pulse"></div>
                    <div className="h-4 w-full bg-gray-300 rounded mb-2 animate-pulse"></div>
                    <div className="h-4 w-2/3 bg-gray-300 rounded animate-pulse"></div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </main>
    </div>
  );
}
