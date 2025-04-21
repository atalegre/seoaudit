
import React from 'react';
import MetricCard from '../MetricCard';
import { Zap } from 'lucide-react';
import { MetricStatus } from '../MetricCard';
import { safeNumber, safeToFixed } from '@/utils/dataChecks';

interface WebVitalsGridProps {
  lcp?: number;
  cls?: number;
  fid?: number;
  lcpStatus?: MetricStatus;
  clsStatus?: MetricStatus;
  fidStatus?: MetricStatus;
}

const WebVitalsGrid: React.FC<WebVitalsGridProps> = ({
  lcp = 0,
  cls = 0,
  fid = 0,
  lcpStatus = 'poor',
  clsStatus = 'poor',
  fidStatus = 'poor'
}) => {
  // Safely handle numeric values
  const safeLcp = safeNumber(lcp, 0);
  const safeCls = safeNumber(cls, 0);
  const safeFid = safeNumber(fid, 0);

  // Ensure status values match the MetricStatus type
  const getLcpStatus = (): MetricStatus => {
    if (lcpStatus === 'good' || lcpStatus === 'needs-improvement' || lcpStatus === 'poor') {
      return lcpStatus;
    }
    return safeLcp <= 2.5 ? 'good' : safeLcp <= 4 ? 'needs-improvement' : 'poor';
  };

  const getClsStatus = (): MetricStatus => {
    if (clsStatus === 'good' || clsStatus === 'needs-improvement' || clsStatus === 'poor') {
      return clsStatus;
    }
    return safeCls <= 0.1 ? 'good' : safeCls <= 0.25 ? 'needs-improvement' : 'poor';
  };

  const getFidStatus = (): MetricStatus => {
    if (fidStatus === 'good' || fidStatus === 'needs-improvement' || fidStatus === 'poor') {
      return fidStatus;
    }
    return safeFid <= 100 ? 'good' : safeFid <= 300 ? 'needs-improvement' : 'poor';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <MetricCard
        title="LCP"
        value={`${safeToFixed(safeLcp, 1)}s`}
        icon={<Zap className="h-4 w-4" />}
        description="Largest Contentful Paint: tempo até o maior elemento visível renderizar"
        status={getLcpStatus()}
      />
      
      <MetricCard
        title="CLS"
        value={safeToFixed(safeCls, 2)}
        icon={<Zap className="h-4 w-4" />}
        description="Cumulative Layout Shift: estabilidade visual durante o carregamento"
        status={getClsStatus()}
      />
      
      <MetricCard
        title="FID"
        value={`${Math.round(safeFid)}ms`}
        icon={<Zap className="h-4 w-4" />}
        description="First Input Delay: tempo de resposta ao primeiro clique"
        status={getFidStatus()}
      />
    </div>
  );
};

export default WebVitalsGrid;
