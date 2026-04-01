import { cn } from '@/lib/utils';

interface ScoreBadgeProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

function getScoreLabel(score: number): string {
  if (score >= 9) return 'Excellent';
  if (score >= 8) return 'Great';
  if (score >= 7) return 'Good';
  if (score >= 6) return 'Average';
  return 'Below Average';
}

export function ScoreBadge({ score, size = 'sm', showLabel = false, className }: ScoreBadgeProps) {
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'h-16 w-16 text-2xl',
  };

  if (size === 'lg') {
    return (
      <div className={cn('flex flex-col items-center', className)}>
        <div className={cn('flex items-center justify-center rounded-xl bg-primary font-bold text-white', sizeClasses.lg)}>
          {score.toFixed(1)}
        </div>
        {showLabel && (
          <span className="mt-1 text-xs font-semibold text-primary">{getScoreLabel(score)}</span>
        )}
      </div>
    );
  }

  return (
    <span className={cn('inline-flex items-center gap-1.5 rounded bg-primary font-semibold text-white', sizeClasses[size], className)}>
      {score.toFixed(1)}
      {showLabel && <span className="text-white/80">{getScoreLabel(score)}</span>}
    </span>
  );
}
