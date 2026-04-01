import Link from 'next/link';
import getPostMetadata from './getPostMetadata';

export function Top10Popular() {
  const posts = getPostMetadata().slice(0, 5);

  return (
    <div className="rounded-xl border border-primary-light bg-gradient-to-b from-primary-lightest to-neutral-50 p-4">
      <h3 className="mb-3 text-xs font-semibold uppercase tracking-widest text-primary">Trending</h3>
      <ol className="space-y-0">
        {posts.map((post, i) => (
          <li key={post.slug} className="flex gap-2 border-b border-primary/10 py-2 last:border-0">
            <span className="text-sm font-bold text-accent">{i + 1}</span>
            <Link href={`/articles/${post.slug}`} className="text-[13px] text-neutral-700 hover:text-primary">{post.title}</Link>
          </li>
        ))}
      </ol>
    </div>
  );
}
