import { cn } from '@/lib/utils';

interface AwardBadgeProps {
  type: 'best-overall' | 'best-value' | 'budget-pick';
  className?: string;
}

const badgeConfig = {
  'best-overall': { label: 'BEST OVERALL', bg: 'bg-accent', text: 'text-white' },
  'best-value': { label: 'BEST VALUE', bg: 'bg-primary', text: 'text-white' },
  'budget-pick': { label: 'BUDGET PICK', bg: 'bg-success', text: 'text-white' },
};

export function AwardBadge({ type, className }: AwardBadgeProps) {
  const config = badgeConfig[type];
  return (
    <span className={cn('inline-block rounded px-1.5 py-0.5 text-[10px] font-semibold', config.bg, config.text, className)}>
      {config.label}
    </span>
  );
}
