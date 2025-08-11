import Image from 'next/image';
import Link from 'next/link';
import { PostMetadata } from '../PostMetadata';
import { getPostsByCategory, getCategoryDisplayName } from '../../lib/Posts';

interface RelatedArticlesProps {
  currentArticleSlug: string;
  category?: string;
  limit?: number;
}

export default function RelatedArticles({ 
  currentArticleSlug, 
  category = 'general', 
  limit = 4 
}: RelatedArticlesProps) {
  // Get all articles from the same category
  const categoryArticles = getPostsByCategory(category);
  
  // Filter out the current article and limit the results
  const relatedArticles = categoryArticles
    .filter(article => article.slug !== currentArticleSlug)
    .slice(0, limit);

  if (relatedArticles.length === 0) {
    return null;
  }

  const categoryDisplayName = getCategoryDisplayName(category);

  return (
    <aside className="bg-white border-2 border-gray-200 rounded-2xl p-4 shadow-lg">
      <h3 className="text-xl font-bold text-gray-800 mb-4 border-b border-gray-200 pb-2">
        More {categoryDisplayName}
      </h3>
      
      <div className="space-y-4">
        {relatedArticles.map((article) => (
          <Link 
            key={article.slug} 
            href={`/articles/${article.slug}`}
            className="block group hover:bg-gray-50 rounded-lg p-2 transition-colors duration-200"
          >
            <div className="flex items-start space-x-3">
              {/* Thumbnail */}
              <div className="flex-shrink-0 w-16 h-16 relative rounded-lg overflow-hidden bg-gray-200">
                {article.image ? (
                  <Image
                    src={article.image}
                    alt={article.title}
                    fill
                    sizes="64px"
                    className="object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
                    <span className="text-gray-600 text-xs font-semibold">
                      {article.title.charAt(0)}
                    </span>
                  </div>
                )}
              </div>
              
              {/* Content */}
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-gray-800 group-hover:text-blue-600 transition-colors duration-200 line-clamp-2 leading-tight">
                  {article.title}
                </h4>
                {article.subtitle && (
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2 leading-tight">
                    {article.subtitle}
                  </p>
                )}
                {article.price && (
                  <p className="text-xs text-green-600 font-medium mt-1">
                    {article.price}
                  </p>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
      
      {/* View All Link */}
      <div className="mt-4 pt-3 border-t border-gray-200">
        <Link 
          href={`/category/${category}`}
          className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200"
        >
          View All {categoryDisplayName} →
        </Link>
      </div>
    </aside>
  );
}
