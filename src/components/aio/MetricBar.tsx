
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { AlertCircle, CheckCircle } from 'lucide-react';

interface MetricBarProps {
  title: string;
  score: number;
  description: string;
}

const MetricBar: React.FC<MetricBarProps> = ({ title, score, description }) => {
  const getColor = (score: number) => {
    if (score >= 80) return "bg-green-500";
    if (score >= 60) return "bg-amber-500";
    return "bg-red-500";
  };
  
  const getIcon = (score: number) => {
    if (score >= 80) return <CheckCircle className="h-4 w-4 text-green-600" />;
    if (score >= 60) return <AlertCircle className="h-4 w-4 text-amber-600" />;
    return <AlertCircle className="h-4 w-4 text-red-600" />;
  };
  
  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-1">
        <div className="flex items-center gap-1.5">
          {getIcon(score)}
          <span className="font-medium text-sm">{title}</span>
        </div>
        <span className="text-sm font-medium">{score}%</span>
      </div>
      <Progress value={score} className={cn("h-2", getColor(score))} />
      <p className="text-xs text-gray-500 mt-1">{description}</p>
    </div>
  );
};

export default MetricBar;
