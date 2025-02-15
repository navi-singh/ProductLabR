import { Card } from './card';
import getPostMetadata from './getPostMetadata';

export const PostsList = () => {
  const postMetadata = getPostMetadata();
  const postPreviews = postMetadata.map((post) => (
    <div>
        <Card key={post.slug} post={post} />
    </div>
  ));

  return (
    <div className="md:col-span-2">
      <h2 className="mb-4 text-4xl font-bold">Articles</h2>
      <p className="mb-8 text-gray-600">
        Read our objective tests and assessments of the latest products.
      </p>
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          {postPreviews}
      </div>
    </div>
  );
};
