import { ScoreBadge } from './ScoreBadge';

interface Metric {
  name: string;
  score: number;
}

interface VerdictBoxProps {
  overallScore: number;
  verdict: string;
  metrics: Metric[];
}

export function VerdictBox({ overallScore, verdict, metrics }: VerdictBoxProps) {
  const displayScore = overallScore / 10;

  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-featured">
      <div className="flex items-start gap-5">
        <ScoreBadge score={displayScore} size="lg" showLabel />
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-neutral-900">Our Verdict</h3>
          <p className="mt-1 text-[13px] leading-relaxed text-neutral-500">{verdict}</p>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3 border-t border-neutral-100 pt-4 sm:grid-cols-4">
        {metrics.slice(0, 4).map((metric) => (
          <div key={metric.name}>
            <div className="text-[11px] text-neutral-400">{metric.name}</div>
            <div className="mt-1 flex items-center gap-1.5">
              <div className="h-1 flex-1 rounded-full bg-neutral-200">
                <div className="h-1 rounded-full bg-primary" style={{ width: `${(metric.score / 10) * 100}%` }} />
              </div>
              <span className="text-xs font-semibold text-neutral-700">{metric.score.toFixed(1)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
