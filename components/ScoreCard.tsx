import React from 'react';

export interface ScoreMetric {
  name: string;
  score: number;
}

export interface ScoreCardProps {
  calculatedOverallScore: number;
  metrics: ScoreMetric[];
}

export default function ScoreCard({calculatedOverallScore, metrics }: ScoreCardProps) {

  return (
    <div className="flex flex-col md:flex-row bg-white p-2 rounded-md shadow-md w-full">
      {/* Overall Score */}
      <div className="flex flex-col items-center justify-center bg-green-700 text-white p-2 rounded-md w-full md:w-1/4 mb-3 md:mb-0">
        <span className="text-4xl font-bold">{calculatedOverallScore/10}</span>
        <span className="text-xs uppercase tracking-wider mt-1">Overall Score</span>
      </div>

      {/* Metrics */}
      <div className="flex-1 md:pl-6 space-y-2 w-full">
        {metrics.map((metric) => (
          <div key={metric.name} className="flex items-center">
            <div className="w-1/2 text-sm text-gray-700">{metric.name}</div>
            <div className="flex-1 mx-3 h-2 bg-gray-300 rounded-full">
              <div
                className="h-2 bg-green-700 rounded-full"
                style={{ width: `${(metric.score / 10) * 100}%` }}
              ></div>
            </div>
            <div className="w-8 text-sm font-bold text-gray-800">{metric.score.toFixed(1)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
