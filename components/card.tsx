import Image from 'next/image';
import { truncateText } from '@/lib/textUtil';
import { Post } from './ui/Post';

export const Card = ({ post }: { post: Post }) => {
  return (
    <div>
      <article className="border-b p-4 hover:bg-white hover:shadow-lg">
        <Image
          src={post.image}
          alt={post.title}
          width={400}
          height={300}
          className="mb-4 h-48 w-full object-cover"
        />
        <h3 className="mb-2 text-2xl font-bold">{post.title}</h3>
        <p className="mb-2 text-gray-600">{truncateText(post.description, 30)}... </p>
        <span className="text-gray-500">{post.date}</span>
      </article>
    </div>
  );
};
