import getPostMetadata from './getPostMetadata';

export const Top10Popular = () => {
  const posts = getPostMetadata();
  
  return (
    <div>
      <h3 className="mb-4 text-xl font-bold">TOP 10 Popular</h3>
      <ul className="space-y-4">
        {posts.slice(0, 10).map((post, index) => (
          <li key={post.slug} className="flex items-start space-x-2">
            <span className="text-2xl font-bold text-gray-300">{index + 1}</span>
            <p className="font-medium">{post.title}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};
