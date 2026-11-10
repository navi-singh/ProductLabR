import type { ReactNode } from 'react';
import { notFound } from 'next/navigation';
import { isCategoryPublished } from './taxonomy';

export function createCategoryLayout(category: string) {
  return function CategoryLayout({ children }: { children: ReactNode }) {
    if (!isCategoryPublished(category)) notFound();
    return children;
  };
}
