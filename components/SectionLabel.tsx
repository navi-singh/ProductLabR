interface SectionLabelProps {
  children: React.ReactNode;
  className?: string;
}

export function SectionLabel({ children, className = '' }: SectionLabelProps) {
  return (
    <div
      className={`mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.1em] text-primary ${className}`}
    >
      <span className="h-[3px] w-6 rounded-full bg-accent" />
      {children}
    </div>
  );
}
