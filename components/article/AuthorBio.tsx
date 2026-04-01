interface AuthorBioProps {
  authorBio: string;
  authorName?: string;
}

export function AuthorBio({ authorBio, authorName }: AuthorBioProps) {
  const initials = authorName
    ? authorName.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : 'PL';

  return (
    <div className="mt-6 flex items-center gap-3.5 rounded-xl bg-primary-lightest/50 p-4">
      <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary-dark text-sm font-semibold text-white">
        {initials}
      </div>
      <div>
        {authorName && <div className="text-[13px] font-semibold text-neutral-900">{authorName}</div>}
        <p className="text-xs leading-relaxed text-neutral-500">{authorBio}</p>
      </div>
    </div>
  );
}
