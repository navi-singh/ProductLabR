import { PostsList } from '@/components/PostsList';
import { Newsletter } from '@/components/Newsletter';
import { Top10Popular } from '@/components/Top10Popular';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="container mx-auto flex-grow px-4 py-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <PostsList />
          <aside className="space-y-8">
            <Newsletter />
            <Link href="/review" className="cursor-pointer text-blue-500 hover:text-blue-700">
              Click here to review McDonald's
            </Link>
            <Top10Popular />
          </aside>
        </div>
      </main>
    </div>
  );
}
