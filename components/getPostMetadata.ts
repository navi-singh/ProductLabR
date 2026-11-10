import { cache } from 'react';
import type { PostMetadata } from './PostMetadata';
import { getAllPostSlugs, getPostBySlug } from '../lib/Posts';

const getPostMetadata = cache((): PostMetadata[] =>
  getAllPostSlugs()
    .flatMap((slug) => {
      const post = getPostBySlug(slug);
      return post ? [post.metadata] : [];
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
);

export default getPostMetadata;
