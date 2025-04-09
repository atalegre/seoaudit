
import React from 'react';
import { cn } from '@/lib/utils';

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
  // Helper function to get the background color class from text color class
  const getBackgroundColorFromText = (textColor: string): string => {
    // Extract color name and shade from text color
    const match = textColor.match(/text-([a-z]+)-(\d+)/);
    if (match) {
      const [_, colorName, shade] = match;
      return `bg-${colorName}-${shade}`;
    }
    
    // Fallback for non-matching patterns
    return textColor.replace('text-', 'bg-');
  };

  return (
    <div className="bg-white rounded-lg border border-gray-100 p-4 hover:shadow-sm transition-shadow">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium">{title}</h3>
        <div className={cn("p-2 rounded-md", bgColor)}>
          {React.cloneElement(icon as React.ReactElement, { 
            className: cn("h-4 w-4", color) 
          })}
        </div>
      </div>
      
      {description && <p className="text-xs text-muted-foreground mb-2">{description}</p>}
      
      <div className="flex flex-col">
        <span className="text-2xl font-bold">{score}</span>
        <div className="mt-2 h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
          <div 
            className={cn("h-full rounded-full transition-all duration-500", getBackgroundColorFromText(color))} 
            style={{ width: `${Math.max(score, 1)}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default ScoreCard;
