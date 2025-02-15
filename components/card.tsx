
import Link from 'next/link';
import { PostMetadata } from './PostMetadata';
/**
Card to display a title and small info about the article
*/
export const Card = ({ post }: { post: PostMetadata }) => {
  return (
    <div>
      <Link href = {`/articles/${post.slug}`}>
      <div key={post.slug}
      className="p-4 border rounded-lg shadow-md h-48 flex flex-col justify-between"
    >
            <h2 className="mb-2 text-2xl font-bold hover:underline line-clamp-2">{post.title}</h2>
            <p className="mb-2 text-gray-600 line-clamp-3">{post.subtitle}</p>
      {/* <article className="border p-4 border-slate-200 rounded-lg hover:bg-white hover:shadow-lg"> */}
        {/* <h3 className="mb-2 text-2xl font-bold hover:underline">{post.title}</h3>
        <p className="mb-2 text-gray-600">{truncateTextByCharacters(post.title, post.subtitle, 120)} ... </p> */}
      {/* </article> */}
      </div>
      </Link>
    </div>
  );
};