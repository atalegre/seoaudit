
import React from 'react';
import { Zap, AlertTriangle } from 'lucide-react';
import MetricItem from './MetricItem';
import { cn } from '@/lib/utils';

interface CoreWebVitalsSectionProps {
  lcp: number;
  cls: number;
  fid: number;
}

const CoreWebVitalsSection = React.memo(({ lcp, cls, fid }: CoreWebVitalsSectionProps) => {
  // Helper functions para status
  const getLcpStatus = (seconds: number) => 
    seconds <= 2.5 ? 'success' : seconds <= 4 ? 'warning' : 'error';
  
  const getClsStatus = (value: number) => 
    value <= 0.1 ? 'success' : value <= 0.25 ? 'warning' : 'error';
  
  const getFidStatus = (ms: number) => 
    ms <= 100 ? 'success' : ms <= 300 ? 'warning' : 'error';
    
  return (
    <div className="mt-2 optimized-rendering">
      <h4 className="text-xs font-medium uppercase text-gray-500 mb-2">Core Web Vitals</h4>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <MetricItem 
          title="LCP" 
          value={`${lcp.toFixed(1)}s`}
          status={getLcpStatus(lcp)}
          icon={<Zap className={cn("h-4 w-4", getLcpStatus(lcp) === 'success' ? "text-green-500" : 
                                       getLcpStatus(lcp) === 'warning' ? "text-amber-500" : "text-red-500")} />}
          description="Largest Contentful Paint"
        />
        <MetricItem 
          title="CLS" 
          value={cls.toFixed(2)}
          status={getClsStatus(cls)}
          icon={<AlertTriangle className={cn("h-4 w-4", getClsStatus(cls) === 'success' ? "text-green-500" : 
                                               getClsStatus(cls) === 'warning' ? "text-amber-500" : "text-red-500")} />}
          description="Cumulative Layout Shift"
        />
        <MetricItem 
          title="FID" 
          value={`${fid}ms`}
          status={getFidStatus(fid)}
          icon={<AlertTriangle className={cn("h-4 w-4", getFidStatus(fid) === 'success' ? "text-green-500" : 
                                               getFidStatus(fid) === 'warning' ? "text-amber-500" : "text-red-500")} />}
          description="First Input Delay"
        />
      </div>
    </div>
  );
});

CoreWebVitalsSection.displayName = 'CoreWebVitalsSection';

export default CoreWebVitalsSection;
