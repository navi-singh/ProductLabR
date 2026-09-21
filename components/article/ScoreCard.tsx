import React from 'react';
import { cn } from '@/lib/utils';
import { StarIcon } from '../../lib/icons';

const SCORE_SCALE = 10;
const STAR_SCALE = 5;
const SCORE_DECIMAL_PLACES = 1;

export interface ScoreMetric {
  name: string;
  score: number;
}

export interface ScoreCardProps {
  calculatedOverallScore: number;
  metrics: ScoreMetric[];
}

// Both the overall score and each metric bar display on a 5-point scale so the
// single rating shown here doesn't conflict with a separate 10-point figure
// elsewhere on the page.
const formatStarScore = (score: number): string =>
  (score / (SCORE_SCALE * 2)).toFixed(SCORE_DECIMAL_PLACES);
const metricStarScore = (score: number): string => (score / 2).toFixed(SCORE_DECIMAL_PLACES);
const metricWidth = (score: number): number => Math.max(0, Math.min(100, score * 10));

const normalizedScore = (score: number): number => score / SCORE_SCALE;

const verdictLabel = (score: number): string => {
  const normalized = normalizedScore(score);
  if (normalized >= 8) return 'Great Choice';
  if (normalized >= 7) return 'Recommended';
  if (normalized >= 5) return 'Mixed';
  return 'Avoid';
};

const verdictSubtext = (score: number): string => {
  const normalized = normalizedScore(score);
  if (normalized >= 8) return 'Outstanding performance';
  if (normalized >= 7) return 'Great choice';
  if (normalized >= 5) return 'Some trade-offs';
  return 'Room for improvement';
};

const verdictIcon = (score: number): string => {
  const normalized = normalizedScore(score);
  if (normalized >= 8) return '⭐';
  if (normalized >= 7) return '👍';
  if (normalized >= 5) return '👌';
  return '⚠️';
};

const scoreTone = (score: number) => {
  if (score >= 7) {
    return {
      panel: 'bg-green-900',
      scoreText: 'text-white',
      labelText: 'text-green-100',
      pill: 'bg-white/15 text-green-100',
      starFilled: 'text-amber-300',
      starEmpty: 'text-white/25',
      bar: 'bg-emerald-600',
      valueText: 'text-emerald-700',
    };
  }
  if (score >= 5) {
    return {
      panel: 'bg-amber-600',
      scoreText: 'text-white',
      labelText: 'text-amber-50',
      pill: 'bg-white/18 text-white',
      starFilled: 'text-white',
      starEmpty: 'text-white/25',
      bar: 'bg-amber-500',
      valueText: 'text-amber-700',
    };
  }
  return {
    panel: 'bg-red-700',
    scoreText: 'text-white',
    labelText: 'text-red-50',
    pill: 'bg-white/18 text-white',
    starFilled: 'text-white',
    starEmpty: 'text-white/25',
    bar: 'bg-red-600',
    valueText: 'text-red-700',
  };
};

const StarRow = ({
  rating,
  filledClass,
  emptyClass,
}: {
  rating: number;
  filledClass: string;
  emptyClass: string;
}) => (
  <div className="flex items-center gap-0.5" aria-hidden="true">
    {Array.from({ length: STAR_SCALE }).map((_, i) => {
      const fillPercentage = Math.max(0, Math.min(100, (rating - i) * 100));
      return (
        <div key={i} className="relative h-4 w-4">
          <StarIcon className={cn('absolute inset-0 h-full w-full', emptyClass)} />
          <div
            className="absolute inset-0 overflow-hidden"
            style={{
              clipPath: `polygon(0 0, ${fillPercentage}% 0, ${fillPercentage}% 100%, 0 100%)`,
            }}
          >
            <StarIcon className={cn('h-full w-full', filledClass)} />
          </div>
        </div>
      );
    })}
  </div>
);

const MetricBar = ({ metric }: { metric: ScoreMetric }) => {
  const tone = scoreTone(metric.score);

  return (
    <div className="grid grid-cols-[minmax(92px,150px)_1fr_42px] items-center gap-3 rounded-lg bg-neutral-50 px-3 py-1.5">
      <div className="text-[11px] font-bold uppercase tracking-[0.06em] text-neutral-500">
        {metric.name}
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-neutral-200" aria-hidden="true">
        <div
          className={cn('h-full rounded-full', tone.bar)}
          style={{ width: `${metricWidth(metric.score)}%` }}
        />
      </div>
      <div className={cn('text-right text-sm font-extrabold tabular-nums', tone.valueText)}>
        {metricStarScore(metric.score)}
      </div>
    </div>
  );
};

const ScoreCard: React.FC<ScoreCardProps> = ({ calculatedOverallScore, metrics }) => {
  if (metrics.length === 0) return null;

  const overallScore = normalizedScore(calculatedOverallScore);
  const tone = scoreTone(overallScore);
  const starRating = overallScore / 2;

  return (
    <section
      className="rounded-xl border border-neutral-200 bg-white p-4 shadow-featured"
      aria-label="Product score card"
    >
      <div className="grid gap-4 md:grid-cols-[200px_1fr]">
        <div className={cn('flex flex-col justify-center rounded-xl p-5 text-white', tone.panel)}>
          <span className={cn('text-[11px] font-bold uppercase tracking-[0.1em]', tone.labelText)}>
            Product Lab Rating
          </span>
          <span
            className={cn(
              'mt-1 text-5xl font-extrabold tabular-nums leading-none',
              tone.scoreText,
            )}
          >
            {formatStarScore(calculatedOverallScore)}
          </span>
          <span className={cn('mt-1 text-xs font-semibold', tone.labelText)}>out of 5</span>
          <div className="mt-2">
            <StarRow rating={starRating} filledClass={tone.starFilled} emptyClass={tone.starEmpty} />
          </div>
          <span
            className={cn(
              'mt-3 inline-flex w-fit items-center gap-2 rounded-lg px-3 py-2',
              tone.pill,
            )}
          >
            <span className="text-lg leading-none" aria-hidden="true">
              {verdictIcon(calculatedOverallScore)}
            </span>
            <span className="flex flex-col leading-tight">
              <span className="text-sm font-bold">{verdictLabel(calculatedOverallScore)}</span>
              <span className="text-[11px] font-semibold opacity-80">
                {verdictSubtext(calculatedOverallScore)}
              </span>
            </span>
          </span>
        </div>

        <div className="space-y-1.5">
          {metrics.map((metric) => (
            <MetricBar key={metric.name} metric={metric} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ScoreCard;
