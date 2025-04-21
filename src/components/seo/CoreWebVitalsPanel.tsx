
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CoreWebVitalsPanelProps {
  lcp?: number;
  cls?: number;
  fid?: number;
}

const CoreWebVitalsPanel: React.FC<CoreWebVitalsPanelProps> = ({
  lcp = 0,
  cls = 0,
  fid = 0
}) => {
  // Helper functions to determine status
  const getLcpStatus = (seconds: number) => {
    if (seconds <= 2.5) return 'success';
    if (seconds <= 4) return 'warning';
    return 'error';
  };
  
  const getClsStatus = (value: number) => {
    if (value <= 0.1) return 'success';
    if (value <= 0.25) return 'warning';
    return 'error';
  };
  
  const getFidStatus = (ms: number) => {
    if (ms <= 100) return 'success';
    if (ms <= 300) return 'warning';
    return 'error';
  };
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base md:text-lg">
          <Zap className="h-4 w-4 md:h-5 md:w-5 text-primary" />
          Core Web Vitals
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 border rounded-lg">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">LCP</h3>
              <span className={cn(
                "px-2 py-0.5 text-xs rounded-full",
                getLcpStatus(lcp) === 'success' ? "bg-green-100 text-green-800" :
                getLcpStatus(lcp) === 'warning' ? "bg-yellow-100 text-yellow-800" :
                "bg-red-100 text-red-800"
              )}>
                {(lcp || 0).toFixed(1)}s
              </span>
            </div>
            <p className="mt-2 text-xs text-gray-500">
              Largest Contentful Paint: tempo até o maior elemento visível renderizar
            </p>
          </div>
          
          <div className="p-4 border rounded-lg">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">CLS</h3>
              <span className={cn(
                "px-2 py-0.5 text-xs rounded-full",
                getClsStatus(cls) === 'success' ? "bg-green-100 text-green-800" :
                getClsStatus(cls) === 'warning' ? "bg-yellow-100 text-yellow-800" :
                "bg-red-100 text-red-800"
              )}>
                {(cls || 0).toFixed(2)}
              </span>
            </div>
            <p className="mt-2 text-xs text-gray-500">
              Cumulative Layout Shift: estabilidade visual durante o carregamento
            </p>
          </div>
          
          <div className="p-4 border rounded-lg">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">FID</h3>
              <span className={cn(
                "px-2 py-0.5 text-xs rounded-full",
                getFidStatus(fid) === 'success' ? "bg-green-100 text-green-800" :
                getFidStatus(fid) === 'warning' ? "bg-yellow-100 text-yellow-800" :
                "bg-red-100 text-red-800"
              )}>
                {fid || 0}ms
              </span>
            </div>
            <p className="mt-2 text-xs text-gray-500">
              First Input Delay: tempo de resposta ao primeiro clique
            </p>
          </div>
        </div>
        
        <div className="mt-2 text-xs text-gray-500">
          <p>Os Core Web Vitals são métricas importantes para avaliar a experiência do usuário e são utilizadas pelo Google como fator de ranking.</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default CoreWebVitalsPanel;
