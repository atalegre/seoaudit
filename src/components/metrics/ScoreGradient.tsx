
import React from 'react';

const ScoreGradient: React.FC = () => {
  return (
    <svg width="0" height="0" className="absolute">
      <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#0EA5E9" />
        <stop offset="50%" stopColor="#8B5CF6" />
        <stop offset="100%" stopColor="#F97316" />
      </linearGradient>
    </svg>
  );
};

export default ScoreGradient;
