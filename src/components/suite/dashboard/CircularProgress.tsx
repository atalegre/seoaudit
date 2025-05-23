
import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { useBreakpoint } from '@/hooks/use-mobile';
import { motion } from 'framer-motion';

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
  const { breakpoint } = useBreakpoint();
  const [isVisible, setIsVisible] = useState(false);
  
  // Adjust size for mobile
  const responsiveSize = (() => {
    switch (breakpoint) {
      case 'xs': return size * 0.7;
      case 'sm': return size * 0.8;
      case 'md': return size * 0.9;
      default: return size;
    }
  })();
  
  // Adjust thickness for smaller sizes
  const responsiveThickness = responsiveSize < 100 ? Math.max(5, thickness * 0.75) : thickness;
  
  // Ensure value is between 0 and 100
  const safeValue = Math.min(100, Math.max(0, value));
  
  // Calculate SVG parameters
  const radius = (responsiveSize - responsiveThickness) / 2;
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

  // Set visible when component mounts
  useEffect(() => {
    setIsVisible(true);
  }, []);
  
  return (
    <div className="relative" style={{ width: responsiveSize, height: responsiveSize }}>
      <svg 
        className="w-full h-full transform -rotate-90 drop-shadow-sm"
        viewBox={`0 0 ${responsiveSize} ${responsiveSize}`}
      >
        {/* Background circle */}
        <circle
          cx={responsiveSize / 2}
          cy={responsiveSize / 2}
          r={radius}
          fill="none"
          strokeWidth={responsiveThickness}
          className={cn(bgColor)}
        />
        
        {/* Progress circle */}
        <motion.circle
          cx={responsiveSize / 2}
          cy={responsiveSize / 2}
          r={radius}
          fill="none"
          strokeWidth={responsiveThickness}
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: isVisible ? strokeDashoffset : circumference }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          strokeLinecap="round"
          className={cn(circleColor)}
        />
      </svg>
      
      {/* Center content */}
      {children && (
        <motion.div 
          className="absolute inset-0 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          {children}
        </motion.div>
      )}
    </div>
  );
};

export default CircularProgress;
