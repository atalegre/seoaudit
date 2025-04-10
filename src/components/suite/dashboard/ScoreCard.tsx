
import React from 'react';
import { cn } from '@/lib/utils';
import { useBreakpoint } from '@/hooks/use-mobile';
import { motion } from 'framer-motion';

interface ScoreCardProps {
  title: string;
  score: number;
  icon: React.ReactNode;
  color?: string;
  bgColor?: string;
  description?: string;
}

const ScoreCard = ({ 
  title, 
  score, 
  icon, 
  color = "text-indigo-600", 
  bgColor = "bg-indigo-50",
  description
}: ScoreCardProps) => {
  const { breakpoint } = useBreakpoint();
  const isMobile = breakpoint === 'xs' || breakpoint === 'sm';
  
  // Get gradient and text color based on score
  const getScoreGradient = () => {
    if (score >= 80) return "bg-gradient-to-r from-green-400 to-green-600";
    if (score >= 60) return "bg-gradient-to-r from-blue-400 to-blue-600";
    if (score >= 40) return "bg-gradient-to-r from-amber-400 to-amber-600";
    return "bg-gradient-to-r from-red-400 to-red-600";
  };

  // Ensure we have a valid percentage value for the progress bar width
  const progressWidth = Math.max(Math.min(score, 100), 1);

  // Determine text color based on score
  const getTextColor = () => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-blue-600';
    if (score >= 40) return 'text-amber-600';
    return 'text-red-600';
  };

  return (
    <motion.div 
      className="bg-gradient-to-br from-white to-gray-50 rounded-xl border border-gray-100 p-3 hover:shadow-md transition-shadow"
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className={cn("font-medium", isMobile ? "text-xs" : "text-sm")}>{title}</h3>
        <div className={cn("p-1.5 rounded-lg", bgColor, isMobile ? "p-1" : "p-1.5")}>
          {React.cloneElement(icon as React.ReactElement, { 
            className: cn("h-4 w-4", color, isMobile && "h-3 w-3") 
          })}
        </div>
      </div>
      
      {description && <p className={cn("text-gray-500 mb-2", isMobile ? "text-[10px]" : "text-xs")}>{description}</p>}
      
      <div className="flex flex-col">
        <span className={cn("font-bold", getTextColor(), isMobile ? "text-xl" : "text-2xl")}>{score}</span>
        <div className="mt-2 h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
          <motion.div 
            className={cn("h-full rounded-full", getScoreGradient())} 
            style={{ width: `${progressWidth}%` }}
            initial={{ width: 0 }}
            animate={{ width: `${progressWidth}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default ScoreCard;
