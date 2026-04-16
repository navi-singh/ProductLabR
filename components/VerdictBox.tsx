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

function getBarColor(score: number): string {
  if (score >= 8) return '#16a34a'; /* green-600 */
  if (score >= 6) return '#2563eb'; /* blue-600 */
  return '#f59e0b'; /* amber-500 */
}

export function VerdictBox({ overallScore, verdict, metrics }: VerdictBoxProps) {
  const displayScore = overallScore / 10;

  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-featured">
      {/* Score + verdict */}
      <div className="flex items-start gap-5">
        <ScoreBadge score={displayScore} size="lg" showLabel />
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-neutral-900">Our Verdict</h3>
          <p className="mt-1 text-[13px] leading-relaxed text-neutral-500">{verdict}</p>
        </div>
      </div>

      {/* Metric breakdown — all metrics, wrap into rows of 2 on mobile / 4 on desktop */}
      {metrics.length > 0 && (
        <div className="mt-4 border-t border-neutral-100 pt-4">
          <div className="grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-4">
            {metrics.map((metric) => (
              <div key={metric.name}>
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-[11px] text-neutral-400">{metric.name}</span>
                  <span className="text-xs font-bold text-neutral-800">{metric.score.toFixed(1)}</span>
                </div>
                <div className="h-2.5 rounded-full bg-neutral-200">
                  <div
                    className="h-2.5 rounded-full transition-all duration-700 ease-out"
                    style={{
                      width: `${(metric.score / 10) * 100}%`,
                      backgroundColor: getBarColor(metric.score),
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
