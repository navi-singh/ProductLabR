
import Link from 'next/link';
import Image from 'next/image';
import { PostMetadata } from './PostMetadata';

/**
Card to display a title and small info about the article
*/
export const Card = ({ post }: { post: PostMetadata }) => {
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
};