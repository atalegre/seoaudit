
import React from 'react';
import { getScoreColorClass } from './utils';
import CircularProgress from '@/components/suite/dashboard/CircularProgress';

interface ScoreCircleProps {
  score: number;
}

const ScoreCircle: React.FC<ScoreCircleProps> = ({ score }) => {
  const colorClass = getScoreColorClass(score);
  
  return (
    <div className="flex flex-col items-center justify-center mb-6">
      <CircularProgress
        value={score}
        size={120}
        color={colorClass.replace('text-', 'stroke-')}
        thickness={8}
      >
        <div className="flex flex-col items-center justify-center">
          <span className={`text-2xl font-bold ${colorClass}`}>{score}%</span>
          <span className="text-xs text-muted-foreground">Presença</span>
        </div>
      </CircularProgress>
    </div>
  );
};

export default ScoreCircle;
