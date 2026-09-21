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
  if (score >= 7) return 'bg-emerald-700';
  if (score >= 5) return 'bg-amber-500';
  return 'bg-red-600';
}

export function ScoreBadge({ score, size = 'sm', showLabel = false, className }: ScoreBadgeProps) {
  const bgClass = getScoreBgClass(score);
  const displayScore = (score / 2).toFixed(1);

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
            'flex items-center justify-center rounded-lg font-extrabold text-white shadow-sm ring-1 ring-white/40',
            bgClass,
            sizeClasses.lg,
          )}
          style={{ fontVariantNumeric: 'tabular-nums' }}
        >
          {displayScore}
        </div>
        {showLabel && (
          <span className="mt-1.5 text-[11px] font-bold uppercase tracking-[0.08em] text-neutral-500">
            {getScoreLabel(score)}
          </span>
        )}
      </div>
    );
  }

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded font-bold text-white shadow-sm',
        bgClass,
        sizeClasses[size],
        className,
      )}
      style={{ fontVariantNumeric: 'tabular-nums' }}
    >
      {displayScore}
      {showLabel && (
        <span className="text-[0.7em] font-semibold text-white/80">{getScoreLabel(score)}</span>
      )}
    </span>
  );
}
