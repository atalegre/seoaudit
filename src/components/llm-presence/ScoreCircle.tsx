
import React from 'react';

interface ScoreCircleProps {
  score: number;
}

const ScoreCircle: React.FC<ScoreCircleProps> = ({ score }) => {
  const getScoreColor = (score: number) => {
    if (score > 70) return '#8B5CF6'; // Purple for high scores
    if (score > 40) return '#f59e0b'; // Amber for medium scores
    return '#ef4444'; // Red for low scores
  };

  return (
    <div className="mb-6 flex justify-center">
      <div className="w-32 h-32 relative flex items-center justify-center">
        <svg className="w-full h-full" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="transparent"
            stroke="#e2e8f0"
            strokeWidth="8"
          />
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="transparent"
            stroke={getScoreColor(score)}
            strokeWidth="8"
            strokeDasharray={`${score * 2.83} ${283 - score * 2.83}`}
            strokeLinecap="round"
            transform="rotate(-90 50 50)"
          />
        </svg>
        <span className="absolute text-3xl font-bold">{score}%</span>
      </div>
    </div>
  );
};

export default ScoreCircle;
