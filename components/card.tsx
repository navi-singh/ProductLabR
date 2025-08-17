
import Link from 'next/link';
import Image from 'next/image';
import { PostMetadata } from './PostMetadata';
import { ReactNode } from 'react';

/**
Card to display a title and small info about the article
*/
export const Card = ({ post, className, children }: { 
  post?: PostMetadata; 
  className?: string; 
  children?: ReactNode; 
}) => {
  // If post is provided, use the original card layout
  if (post) {
    return (
      <div>
        <Link href={`/articles/${post.slug}`}>
          <div key={post.slug} className="p-4 border rounded-lg shadow-md flex flex-col items-center">
            {post.image && (
              <div className="w-full mb-3">
                <Image
                  src={post.image}
                  alt={post.title}
                  width={240}
                  height={160}
                  className="w-full h-40 object-cover rounded-2xl"
                  unoptimized={true}
                />
              </div>
            )}
            <div className="w-full flex-1 flex flex-col justify-between items-start">
              <h2 className="mb-2 text-xl font-bold hover:underline w-full">
                {post.title}
              </h2>
            </div>
          </div>
        </Link>
      </div>
    );
  }

  // If no post, use as a generic container (for best pages)
  return (
    <div className={className}>
      {children}
    </div>
  );
};