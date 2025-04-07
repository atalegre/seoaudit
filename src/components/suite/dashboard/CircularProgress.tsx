
import React from 'react';
import { cn } from '@/lib/utils';

interface CircularProgressProps {
  value: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  bgColor?: string;
  className?: string;
  children?: React.ReactNode;
}

const CircularProgress = ({
  value,
  size = 120,
  strokeWidth = 8,
  color = "stroke-primary",
  bgColor = "stroke-gray-200",
  className,
  children
}: CircularProgressProps) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div 
      className={cn("relative inline-flex items-center justify-center", className)}
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="rotate-[-90deg]">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          className={bgColor}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className={cn(color, "transition-all duration-1000 ease-out")}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        {children || (
          <span className="text-2xl font-bold">{value}</span>
        )}
      </div>
    </div>
  );
};

export default CircularProgress;
