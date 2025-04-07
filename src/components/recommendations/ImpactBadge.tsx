
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface ImpactBadgeProps {
  impact: string;
  className?: string;
}

export const getImpactColor = (impact: string) => {
  switch(impact) {
    case 'Alto':
      return "border-red-200 bg-red-100 text-red-800";
    case 'Médio':
      return "border-amber-200 bg-amber-100 text-amber-800";
    case 'Baixo':
      return "border-blue-200 bg-blue-100 text-blue-800";
    default:
      return "border-gray-200 bg-gray-100 text-gray-800";
  }
};

export const getPriorityInfo = (priority: number) => {
  if (priority >= 8) {
    return { text: "Alta", color: "border-red-200 bg-red-100 text-red-800" };
  } else if (priority >= 5) {
    return { text: "Média", color: "border-amber-200 bg-amber-100 text-amber-800" };
  } else {
    return { text: "Baixa", color: "border-blue-200 bg-blue-100 text-blue-800" };
  }
};

const ImpactBadge: React.FC<ImpactBadgeProps> = ({ impact, className }) => {
  return (
    <Badge 
      variant="outline" 
      className={cn("text-xs font-normal", getImpactColor(impact), className)}
    >
      {impact}
    </Badge>
  );
};

export default ImpactBadge;
