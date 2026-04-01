'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';

interface CategoryItem {
  name: string;
  href: string;
  count: number;
}

interface CategoryDropdownProps {
  categories: CategoryItem[];
}

export function CategoryDropdown({ categories }: CategoryDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button onClick={() => setIsOpen(!isOpen)} className="flex items-center gap-1 text-[13px] text-white/85 hover:text-white">
        All Categories
        <ChevronDown className="h-3 w-3" />
      </button>
      {isOpen && (
        <div className="absolute left-0 top-full z-50 mt-3 w-56 rounded-lg border border-neutral-200 bg-white py-2 shadow-lg">
          {categories.map((cat) => (
            <Link key={cat.href} href={cat.href} onClick={() => setIsOpen(false)} className="flex items-center justify-between px-4 py-2 text-sm text-neutral-700 hover:bg-primary-lightest">
              {cat.name}
              <span className="rounded-full bg-primary px-1.5 text-[10px] text-white">{cat.count}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
