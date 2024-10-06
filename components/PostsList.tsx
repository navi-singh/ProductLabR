import Image from 'next/image';
import { Posts } from '@/lib/Posts';
import { truncateText } from '@/lib/textUtil';
import { Card } from './card';
import { Post } from './ui/Post';

export const PostsList = () => {
  return (
    <div className="md:col-span-2">
      <h2 className="mb-4 text-4xl font-bold">Articles</h2>
      <p className="mb-8 text-gray-600">
        Read our objective tests and assessments of the latest products.
      </p>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {Object.entries(Posts).map(([id, post]: [string, Post]) => (
          <Card key={id} post={post} />
        ))}
      </div>
    </div>
  );
};
