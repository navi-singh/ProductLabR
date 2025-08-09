'use client';

import React from 'react';

interface ArticleContentProps {
  content: string;
}

export default function ArticleContent({ content }: ArticleContentProps) {
  return (
    <article className="prose prose-lg max-w-none mb-8">
      <div 
        className="text-gray-700 leading-relaxed prose-img:mx-auto prose-img:max-w-xl prose-img:rounded-xl"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </article>
  );
}
