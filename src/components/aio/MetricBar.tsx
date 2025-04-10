
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { useBreakpoint } from '@/hooks/use-mobile';

interface MetricBarProps {
  title: string;
  score: number;
  description: string;
}

const MetricBar: React.FC<MetricBarProps> = ({ title, score, description }) => {
  const { breakpoint } = useBreakpoint();
  const isMobile = breakpoint === 'xs' || breakpoint === 'sm';
  
  const getProgressGradient = (score: number) => {
    if (score >= 80) return "bg-gradient-to-r from-green-400 to-green-600";
    if (score >= 60) return "bg-gradient-to-r from-amber-400 to-amber-600";
    return "bg-gradient-to-r from-red-400 to-red-600";
  };
  
  const getIcon = (score: number) => {
    const iconSize = isMobile ? 3 : 4;
    if (score >= 80) return <CheckCircle className={`h-${iconSize} w-${iconSize} text-green-600`} />;
    if (score >= 60) return <AlertCircle className={`h-${iconSize} w-${iconSize} text-amber-600`} />;
    return <AlertCircle className={`h-${iconSize} w-${iconSize} text-red-600`} />;
  };
  
  const getTextColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-amber-600";
    return "text-red-600";
  };
  
  return (
    <div className="mb-3 bg-gradient-to-br from-white to-gray-50 p-2.5 md:p-3 rounded-xl border border-gray-100 shadow-sm">
      <div className="flex justify-between items-center mb-1">
        <div className="flex items-center gap-1 md:gap-1.5">
          {getIcon(score)}
          <span className={cn("font-medium", isMobile ? "text-xs" : "text-sm")}>{title}</span>
        </div>
        <span className={cn("font-semibold", getTextColor(score), isMobile ? "text-xs" : "text-sm")}>{score}%</span>
      </div>
      <Progress 
        value={score} 
        className="h-1.5 md:h-2 bg-gray-100" 
        indicatorClassName={getProgressGradient(score)} 
      />
      <p className={cn("text-gray-500 mt-1", isMobile ? "text-[10px]" : "text-xs")}>{description}</p>
    </div>
  );
};

export default MetricBar;
