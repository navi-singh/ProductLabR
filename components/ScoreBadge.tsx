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

function getScoreBgClass(score: number): string {
  if (score >= 9.0) return 'bg-accent';     // was bg-green-600
  if (score >= 8.0) return 'bg-primary';    // was bg-blue-600
  if (score >= 7.0) return 'bg-amber-500';
  return 'bg-neutral-500';
}

export function ScoreBadge({ score, size = 'sm', showLabel = false, className }: ScoreBadgeProps) {
  const bgClass = getScoreBgClass(score);

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'h-16 w-16 text-3xl',
  };

  if (size === 'lg') {
    return (
      <div className={cn('flex flex-col items-center', className)}>
        <div
          className={cn(
            'flex items-center justify-center rounded-xl font-bold text-white ring-2 ring-offset-1 ring-white/40',
            bgClass,
            sizeClasses.lg,
          )}
          style={{ fontVariantNumeric: 'tabular-nums' }}
        >
          {score.toFixed(1)}
        </div>
        {showLabel && (
          <span className="mt-1.5 text-xs font-semibold uppercase tracking-wide text-neutral-500">
            {getScoreLabel(score)}
          </span>
        )}
      </div>
    );
  }

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded font-semibold text-white',
        bgClass,
        sizeClasses[size],
        className,
      )}
      style={{ fontVariantNumeric: 'tabular-nums' }}
    >
      {score.toFixed(1)}
      {showLabel && (
        <span className="text-white/80 text-[0.7em] font-medium">{getScoreLabel(score)}</span>
      )}
    </span>
  );
}
