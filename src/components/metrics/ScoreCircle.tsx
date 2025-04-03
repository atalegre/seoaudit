
import React from 'react';
import { cn } from '@/lib/utils';

interface ScoreCircleProps {
  score: number;
  label: string;
  colorClass: string;
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
}

const ScoreCircle: React.FC<ScoreCircleProps> = ({ score, label, colorClass, size = 'md', icon }) => {
  const radius = size === 'lg' ? 42 : size === 'md' ? 38 : 30;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;
  
  const sizeClasses = {
    sm: "w-20 h-20",
    md: "w-28 h-28", 
    lg: "w-36 h-36"
  };
  
  const textSizeClasses = {
    sm: "text-xl",
    md: "text-3xl",
    lg: "text-4xl"
  };
  
  return (
    <div className="flex flex-col items-center justify-center">
      <div className={cn("relative flex items-center justify-center", sizeClasses[size])}>
        <svg className="w-full h-full" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r={radius + 2}
            fill="transparent"
            stroke="#e2e8f0"
            strokeWidth="4"
          />
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="transparent"
            stroke={colorClass}
            strokeWidth="6"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            style={{ transform: "rotate(-90deg)", transformOrigin: "center" }}
          />
        </svg>
        <div className="absolute flex flex-col items-center justify-center">
          {icon && <div className="mb-1 opacity-70">{icon}</div>}
          <span className={cn("font-bold", textSizeClasses[size])}>{score}</span>
        </div>
      </div>
      <span className={cn("mt-2 font-medium", size === 'lg' ? 'text-base' : 'text-sm')}>{label}</span>
    </div>
  );
};

export default ScoreCircle;
