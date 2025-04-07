
import React from 'react';
import { CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export type MetricStatus = 'good' | 'needs-improvement' | 'poor';

interface MetricCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  description: string;
  status: MetricStatus;
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  icon,
  description,
  status
}) => {
  const statusConfig = {
    good: {
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-100",
      icon: <CheckCircle className="h-4 w-4 text-green-600" />
    },
    'needs-improvement': {
      color: "text-amber-600",
      bgColor: "bg-amber-50",
      borderColor: "border-amber-100",
      icon: <AlertTriangle className="h-4 w-4 text-amber-600" />
    },
    poor: {
      color: "text-red-600",
      bgColor: "bg-red-50",
      borderColor: "border-red-100",
      icon: <XCircle className="h-4 w-4 text-red-600" />
    }
  };

  const { color, bgColor, borderColor, icon: statusIcon } = statusConfig[status];

  return (
    <div className={cn(
      "border rounded-lg p-4 flex flex-col",
      borderColor
    )}>
      <div className="flex justify-between items-start mb-2">
        <div className={cn("p-2 rounded-full", bgColor)}>
          {icon}
        </div>
        {statusIcon}
      </div>
      <h3 className="text-sm font-medium mt-1">{title}</h3>
      <span className={cn("text-lg font-bold", color)}>{value}</span>
      <p className="text-xs text-gray-500 mt-1">{description}</p>
    </div>
  );
};

export default MetricCard;
