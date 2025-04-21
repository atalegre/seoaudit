
import React from 'react';
import MetricCard from '../MetricCard';
import { Zap } from 'lucide-react';
import { MetricStatus } from '../MetricCard';

interface WebVitalsGridProps {
  lcp: number;
  cls: number;
  fid: number;
  lcpStatus: MetricStatus;
  clsStatus: MetricStatus;
  fidStatus: MetricStatus;
}

const WebVitalsGrid: React.FC<WebVitalsGridProps> = ({
  lcp = 0,
  cls = 0,
  fid = 0,
  lcpStatus = 'neutral',
  clsStatus = 'neutral',
  fidStatus = 'neutral'
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <MetricCard
        title="LCP"
        value={`${(lcp || 0).toFixed(1)}s`}
        icon={<Zap className="h-4 w-4" />}
        description="Largest Contentful Paint: tempo até o maior elemento visível renderizar"
        status={lcpStatus}
      />
      
      <MetricCard
        title="CLS"
        value={(cls || 0).toFixed(2)}
        icon={<Zap className="h-4 w-4" />}
        description="Cumulative Layout Shift: estabilidade visual durante o carregamento"
        status={clsStatus}
      />
      
      <MetricCard
        title="FID"
        value={`${fid || 0}ms`}
        icon={<Zap className="h-4 w-4" />}
        description="First Input Delay: tempo de resposta ao primeiro clique"
        status={fidStatus}
      />
    </div>
  );
};

export default WebVitalsGrid;
