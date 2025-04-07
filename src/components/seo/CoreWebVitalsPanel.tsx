
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Zap } from 'lucide-react';
import WebVitalsGrid from './web-vitals/WebVitalsGrid';
import StatusBadge from './web-vitals/StatusBadge';
import WebVitalsLegend from './web-vitals/WebVitalsLegend';
import { MetricStatus } from './MetricCard';

interface CoreWebVitalsPanelProps {
  lcp: number;
  cls: number;
  fid: number;
}

const CoreWebVitalsPanel: React.FC<CoreWebVitalsPanelProps> = ({ 
  lcp, 
  cls, 
  fid
}) => {
  // Analisar o status dos Core Web Vitals
  const lcpStatus: MetricStatus = lcp <= 2.5 ? "good" : lcp <= 4 ? "needs-improvement" : "poor";
  const clsStatus: MetricStatus = cls <= 0.1 ? "good" : cls <= 0.25 ? "needs-improvement" : "poor";
  const fidStatus: MetricStatus = fid <= 100 ? "good" : fid <= 300 ? "needs-improvement" : "poor";
  
  // Determinar o status geral dos Core Web Vitals
  const getOverallStatus = () => {
    if (lcpStatus === "good" && clsStatus === "good" && fidStatus === "good") {
      return { status: "passed", message: "Todos os Core Web Vitals passam nos critérios do Google." };
    } else if (lcpStatus === "poor" || clsStatus === "poor" || fidStatus === "poor") {
      return { status: "failed", message: "Um ou mais Core Web Vitals não atendem aos critérios mínimos do Google." };
    } else {
      return { status: "needs-improvement", message: "Core Web Vitals precisam de melhorias para atender aos critérios do Google." };
    }
  };

  const overallStatus = getOverallStatus();
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-primary" />
          Core Web Vitals
        </CardTitle>
        <CardDescription>
          Métricas essenciais de experiência do usuário que o Google usa como sinais de ranking
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <StatusBadge 
          status={overallStatus.status}
          message={overallStatus.message}
        />
        
        <WebVitalsGrid 
          lcp={lcp}
          cls={cls}
          fid={fid}
          lcpStatus={lcpStatus}
          clsStatus={clsStatus}
          fidStatus={fidStatus}
        />
        
        <WebVitalsLegend />
      </CardContent>
    </Card>
  );
};

export default CoreWebVitalsPanel;
