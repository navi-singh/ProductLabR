import { Posts } from '@/lib/Posts';

export const Top10Popular = () => {
  return (
    <div>
      <h3 className="mb-4 text-xl font-bold">TOP 10 Popular</h3>
      <ul className="space-y-4">
        {Object.entries(Posts).map(([id, post], index) => (
          <li key={index} className="flex items-start space-x-2">
            <span className="text-2xl font-bold text-gray-300">{index + 1}</span>
            <p className="font-medium">{post.title}</p>
            <p className="font-medium">{id}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};
