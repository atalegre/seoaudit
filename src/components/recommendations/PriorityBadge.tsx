
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { getPriorityInfo } from './ImpactBadge';

interface PriorityBadgeProps {
  priority: number;
  className?: string;
}

const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority, className }) => {
  const priorityInfo = getPriorityInfo(priority);
  
  return (
    <Badge 
      variant="outline" 
      className={cn("text-xs font-normal", priorityInfo.color, className)}
    >
      {priorityInfo.text}
    </Badge>
  );
};

export default PriorityBadge;
