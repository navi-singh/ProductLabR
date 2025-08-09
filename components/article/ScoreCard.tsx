import React from 'react';

// Constants for better maintainability
const SCORE_SCALE = 10;
const SCORE_DECIMAL_PLACES = 1;

// Color scheme constants
const COLORS = {
  primary: 'bg-green-700',
  primaryText: 'text-white',
  secondary: 'bg-gray-300',
  text: {
    primary: 'text-gray-800',
    secondary: 'text-gray-700',
  },
} as const;

// Style constants
const STYLES = {
  container: 'flex justify-center w-full',
  card: 'flex flex-col md:flex-row bg-white p-2 rounded-xl w-full max-w-4xl shadow-sm',
  overallSection: 'flex flex-col items-center justify-center text-white p-2 rounded-xl w-full md:w-1/4 mb-3 md:mb-0',
  metricsSection: 'flex-1 md:pl-6 space-y-2 w-full font-bold',
} as const;

/**
 * Interface for individual score metrics
 */
export interface ScoreMetric {
  /** Name of the metric being measured */
  name: string;
  /** Score value (typically 0-10) */
  score: number;
}

/**
 * Props for the ScoreCard component
 */
export interface ScoreCardProps {
  /** Overall calculated score (typically 0-100, will be divided by 10 for display) */
  calculatedOverallScore: number;
  /** Array of individual metrics with their scores */
  metrics: ScoreMetric[];
}

/**
 * Formats a score for display
 */
const formatScore = (score: number): string => {
  return (score / SCORE_SCALE).toFixed(SCORE_DECIMAL_PLACES);
};

/**
 * Calculates the percentage width for progress bars
 */
const calculateProgressWidth = (score: number): number => {
  return (score / SCORE_SCALE) * 100;
};

/**
 * OverallScore subcomponent for displaying the main score
 */
interface OverallScoreProps {
  score: number;
}

const OverallScore: React.FC<OverallScoreProps> = ({ score }) => (
  <div 
    className={`${STYLES.overallSection} ${COLORS.primary} ${COLORS.primaryText}`}
    role="region"
    aria-label="Overall Score"
  >
    <span 
      className="text-4xl font-bold"
      aria-label={`Overall score: ${formatScore(score)} out of ${SCORE_SCALE}`}
    >
      {formatScore(score)}
    </span>
    <span className="text-xs uppercase tracking-wider mt-1">
      Overall Score
    </span>
  </div>
);

/**
 * MetricBar subcomponent for individual metric display
 */
interface MetricBarProps {
  metric: ScoreMetric;
}

const MetricBar: React.FC<MetricBarProps> = ({ metric }) => (
  <div 
    className="flex items-center justify-between"
    role="group"
    aria-label={`${metric.name} score`}
  >
    <div className={`w-1/2 text-md ${COLORS.text.secondary} text-right`}>
      {metric.name}
    </div>
    
    <div className="flex-1 mx-3 h-2 bg-gray-300 rounded-full relative">
      <div
        className={`h-2 ${COLORS.primary} rounded-full transition-all duration-300 ease-in-out`}
        style={{ width: `${calculateProgressWidth(metric.score)}%` }}
        role="progressbar"
        aria-valuenow={metric.score}
        aria-valuemin={0}
        aria-valuemax={SCORE_SCALE}
        aria-label={`${metric.name} progress`}
      />
    </div>
    
    <div className={`w-8 text-sm font-bold ${COLORS.text.primary}`}>
      {metric.score.toFixed(SCORE_DECIMAL_PLACES)}
    </div>
  </div>
);

/**
 * ScoreCard component for displaying overall scores and individual metrics
 */
const ScoreCard: React.FC<ScoreCardProps> = ({ 
  calculatedOverallScore, 
  metrics 
}) => {
  return (
    <div className={STYLES.container}>
      <article 
        className={STYLES.card}
        role="region"
        aria-label="Product Score Card"
      >
        <OverallScore score={calculatedOverallScore} />
        
        <section 
          className={STYLES.metricsSection}
          aria-label="Individual Metrics"
        >
          {metrics.map((metric) => (
            <MetricBar 
              key={metric.name} 
              metric={metric} 
            />
          ))}
        </section>
      </article>
    </div>
  );
};

export default ScoreCard;
