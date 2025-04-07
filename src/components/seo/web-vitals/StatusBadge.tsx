
import React from 'react';
import { cn } from '@/lib/utils';
import { Zap, AlertTriangle } from 'lucide-react';

export type StatusType = 'passed' | 'failed' | 'needs-improvement';

interface StatusBadgeProps {
  status: StatusType;
  message: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, message }) => {
  return (
    <div className={cn(
      "p-4 rounded-lg border text-sm flex items-start gap-3",
      status === "passed" ? "bg-green-50 border-green-100 text-green-800" : 
      status === "failed" ? "bg-red-50 border-red-100 text-red-800" : 
      "bg-amber-50 border-amber-100 text-amber-800"
    )}>
      {status === "passed" ? (
        <Zap className="h-5 w-5 flex-shrink-0 mt-0.5" />
      ) : (
        <AlertTriangle className="h-5 w-5 flex-shrink-0 mt-0.5" />
      )}
      <div>
        <p className="font-medium">
          {status === "passed" ? "Core Web Vitals aprovados" : 
           status === "failed" ? "Core Web Vitals reprovados" : 
           "Core Web Vitals precisam de atenção"}
        </p>
        <p className="mt-1">{message}</p>
      </div>
    </div>
  );
};

export default StatusBadge;
