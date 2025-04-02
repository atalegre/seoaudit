
import React from 'react';
import { Check, AlertCircle, AlertTriangle, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface MetricItemProps {
  title: string;
  value: string | number;
  status: 'success' | 'warning' | 'error' | 'neutral';
  icon: React.ReactNode;
  description?: string;
}

// Componente otimizado separado para reduzir re-renderizações
const MetricItem = React.memo(({ 
  title, 
  value, 
  status, 
  icon,
  description 
}: MetricItemProps) => {
  const statusColor = {
    success: "text-green-500",
    warning: "text-amber-500",
    error: "text-red-500",
    neutral: "text-blue-500",
  };
  
  const statusBg = {
    success: "bg-green-50",
    warning: "bg-amber-50",
    error: "bg-red-50",
    neutral: "bg-blue-50",
  };
  
  const statusIcon = {
    success: <Check className="h-4 w-4 text-green-500" />,
    warning: <AlertCircle className="h-4 w-4 text-amber-500" />,
    error: <X className="h-4 w-4 text-red-500" />,
    neutral: <AlertTriangle className="h-4 w-4 text-blue-500" />,
  };
  
  return (
    <div className="flex items-center gap-3 p-3 rounded-lg border">
      <div className={cn("p-2 rounded-full", statusBg[status])}>
        {icon}
      </div>
      <div className="flex-grow">
        <div className="flex justify-between items-center">
          <h4 className="text-sm font-medium">{title}</h4>
          <div className="flex items-center gap-1">
            {statusIcon[status]}
            <span className={cn("text-sm font-medium", statusColor[status])}>
              {value}
            </span>
          </div>
        </div>
        {description && (
          <p className="text-xs text-gray-500 mt-1">{description}</p>
        )}
      </div>
    </div>
  );
});

MetricItem.displayName = 'MetricItem';

export default MetricItem;
