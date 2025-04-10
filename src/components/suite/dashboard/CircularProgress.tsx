
import React from 'react';
import { cn } from '@/lib/utils';

interface CircularProgressProps {
  value: number;
  size?: number;
  color?: string;
  bgColor?: string;
  thickness?: number;
  children?: React.ReactNode;
}

const CircularProgress: React.FC<CircularProgressProps> = ({
  value,
  size = 120,
  color = 'stroke-indigo-500',
  bgColor = 'stroke-indigo-100',
  thickness = 8,
  children
}) => {
  // Ensure value is between 0 and 100
  const safeValue = Math.min(100, Math.max(0, value));
  
  // Calculate SVG parameters
  const radius = (size - thickness) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (safeValue / 100) * circumference;
  
  // Get color based on value
  const getColorClass = (value: number) => {
    if (value >= 80) return 'stroke-green-500';
    if (value >= 60) return 'stroke-blue-500';
    if (value >= 40) return 'stroke-amber-500';
    return 'stroke-red-500';
  };

  // Use dynamic color if not specified
  const circleColor = color === 'stroke-indigo-500' ? getColorClass(safeValue) : color;
  
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg 
        className="w-full h-full transform -rotate-90 drop-shadow-sm"
        viewBox={`0 0 ${size} ${size}`}
      >
        {/* Background gradient */}
        <defs>
          <linearGradient id="circleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" className="stop-color-start" />
            <stop offset="100%" className="stop-color-end" />
          </linearGradient>
        </defs>
        
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={thickness}
          className={cn(bgColor)}
        />
        
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={thickness}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className={cn('transition-all ease-in-out duration-1000', circleColor)}
        />
      </svg>
      
      {/* Center content */}
      {children && (
        <div className="absolute inset-0 flex items-center justify-center">
          {children}
        </div>
      )}
    </div>
  );
};

export default CircularProgress;
