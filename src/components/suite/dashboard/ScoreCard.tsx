
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from '@/lib/utils';

interface ScoreCardProps {
  title: string;
  score: number;
  icon: React.ReactNode;
  color?: string;
  bgColor?: string;
}

const ScoreCard = ({ 
  title, 
  score, 
  icon, 
  color = "text-primary", 
  bgColor = "bg-primary/10" 
}: ScoreCardProps) => {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="p-4 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="flex items-end justify-between">
          <span className="text-2xl font-bold">{score}</span>
          <div className={cn("p-2 rounded-md", bgColor)}>
            {React.cloneElement(icon as React.ReactElement, { 
              className: cn("h-5 w-5", color) 
            })}
          </div>
        </div>
        <div className="mt-4 h-2 w-full bg-gray-100 rounded-full overflow-hidden">
          <div 
            className={cn("h-full transition-all duration-500", color.replace('text-', 'bg-'))} 
            style={{ width: `${score}%` }}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default ScoreCard;
