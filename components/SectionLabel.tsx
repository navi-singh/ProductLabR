interface SectionLabelProps {
  children: React.ReactNode;
  className?: string;
}

export function SectionLabel({ children, className = '' }: SectionLabelProps) {
  return (
    <div
      className={`mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-primary ${className}`}
    >
      <span className="h-[3px] w-5 rounded-full bg-primary" />
      {children}
    </div>
  );
}
