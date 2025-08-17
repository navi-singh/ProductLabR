import { Menu, Search } from 'lucide-react';
import Link from 'next/link';

export const Header = () => {
  return (
    <header className="bg-trustworthy text-white">
      <div className="container mx-auto flex items-center justify-between px-4 py-2">
        <div className="flex items-center space-x-4">
          <Menu className="h-6 w-6" />
          <h1 className="text-2xl font-bold">PRODUCT LAB</h1>
        </div>
        <nav className="hidden space-x-4 md:flex">
          <Link href="/" className="hover:text-gray-300">Latest</Link>
          <Link href="/best" className="hover:text-gray-300">Best</Link>
          <Link href="#" className="hover:text-gray-300">Reviews</Link>
          <Link href="#" className="hover:text-gray-300">Tech</Link>
          <Link href="#" className="hover:text-gray-300">Gadgets</Link>
          <Link href="#" className="hover:text-gray-300">Home</Link>
          <Link href="#" className="hover:text-gray-300">Topics</Link>
        </nav>
        <div className="flex items-center space-x-4">

          <Search className="h-6 w-6" />
        </div>
      </div>
    </header>
  );
};
