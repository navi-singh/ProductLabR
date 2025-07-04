import React from 'react';

interface AuthorBioProps {
  authorBio: string;
}

export default function AuthorBio({ authorBio }: AuthorBioProps) {
  return (
    <footer className="mt-12 border-t pt-6 text-sm text-slate-500">
      <div className="font-semibold mb-1">About the author</div>
      <div>{authorBio}</div>
    </footer>
  );
}
