import { truncateText } from '@/lib/textUtil';

import Link from 'next/link';
import { PostMetadata } from './PostMetadata';
/**
Card to display a title and small info about the article
*/
export const Card = ({ post }: { post: PostMetadata }) => {
  return (
    <div>
      <Link href = {`/articles/${post.slug}`} className='hover:underline'>
      <article className="border-b p-4 hover:bg-white hover:shadow-lg">
        {/* <Image
          alt={post.title}
          width={400}
          height={300}
          className="mb-4 h-48 w-full object-cover"
        /> */}
        <h3 className="mb-2 text-2xl font-bold">{post.title}</h3>
        <p className="mb-2 text-gray-600">{truncateText(post.subtitle, 30)}... </p>
      </article>
      </Link>
    </div>
  );
};