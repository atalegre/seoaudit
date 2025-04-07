
import React from 'react';
import { CheckCircle, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MetaTagItemProps {
  title: string;
  content: string;
  contentLength: number;
  minLength: number;
  maxLength: number;
}

const MetaTagItem = ({ 
  title, 
  content, 
  contentLength, 
  minLength, 
  maxLength 
}: MetaTagItemProps) => {
  const getStatus = () => {
    if (contentLength < minLength) return "warning";
    if (contentLength > maxLength) return "warning";
    return "success";
  };

  const status = getStatus();

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm">{title} ({contentLength} caracteres)</span>
        <div className={cn(
          "flex items-center gap-1",
          status === "success" ? "text-green-600" : "text-amber-600"
        )}>
          {status === "success" ? (
            <CheckCircle className="h-4 w-4" />
          ) : (
            <AlertTriangle className="h-4 w-4" />
          )}
        </div>
      </div>
      <div className="text-sm p-2 bg-muted rounded border">
        {content}
      </div>
      {status === "warning" && (
        <p className="text-xs text-amber-600 mt-1">
          {contentLength < minLength ? 
            `${title} é muito curto. Recomendado: ${minLength}-${maxLength} caracteres.` : 
            `${title} é muito longo. Recomendado: até ${maxLength} caracteres.`}
        </p>
      )}
    </div>
  );
};

export default MetaTagItem;
