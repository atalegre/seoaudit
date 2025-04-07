
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Zap, Clock, MousePointer, Layers } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import type { PageInsightsData } from '@/utils/api/pageInsights/types';
import MetricCard from './MetricCard';

interface DevicePerformancePanelProps {
  data: PageInsightsData;
  deviceType: 'desktop' | 'mobile';
}

const DevicePerformancePanel: React.FC<DevicePerformancePanelProps> = ({ data, deviceType }) => {
  // Função para determinar a cor do status baseado no valor
  const getScoreColor = (score: number) => {
    if (score >= 90) return "bg-green-500";
    if (score >= 50) return "bg-amber-500";
    return "bg-red-500";
  };

  // Função para formatar o tempo em segundos
  const formatTime = (timeInSeconds: number) => {
    return `${timeInSeconds.toFixed(1)}s`;
  };

  // Dados convertidos para exibição
  const performanceScore = Math.round(data.performanceScore);
  const fcpTime = deviceType === 'desktop' ? data.loadTimeDesktop : data.loadTimeMobile;
  const lcpTime = data.lcp;
  const clsValue = data.cls;
  const fidValue = data.fid;
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-primary" />
          Performance {deviceType === 'desktop' ? 'Desktop' : 'Mobile'}
        </CardTitle>
        <CardDescription>
          Métricas de performance técnica baseadas no Google PageSpeed Insights
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium">Performance Score</h3>
            <span className={cn(
              "text-sm font-medium",
              performanceScore >= 90 ? "text-green-600" : 
              performanceScore >= 50 ? "text-amber-600" : 
              "text-red-600"
            )}>
              {performanceScore}/100
            </span>
          </div>
          <Progress 
            value={performanceScore} 
            className="h-2"
            indicatorClassName={getScoreColor(performanceScore)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <MetricCard
            title="First Contentful Paint"
            value={formatTime(fcpTime)}
            icon={<Clock className="h-4 w-4" />}
            description="Tempo até o primeiro conteúdo aparecer"
            status={fcpTime <= 1 ? "good" : fcpTime <= 2.5 ? "needs-improvement" : "poor"}
          />
          
          <MetricCard
            title="Largest Contentful Paint"
            value={formatTime(lcpTime)}
            icon={<Layers className="h-4 w-4" />}
            description="Tempo até o maior conteúdo aparecer"
            status={lcpTime <= 2.5 ? "good" : lcpTime <= 4 ? "needs-improvement" : "poor"}
          />
          
          <MetricCard
            title="Cumulative Layout Shift"
            value={clsValue.toFixed(2)}
            icon={<Layers className="h-4 w-4" />}
            description="Estabilidade de layout (movimentos inesperados)"
            status={clsValue <= 0.1 ? "good" : clsValue <= 0.25 ? "needs-improvement" : "poor"}
          />
          
          <MetricCard
            title="First Input Delay"
            value={`${fidValue}ms`}
            icon={<MousePointer className="h-4 w-4" />}
            description="Tempo até a interatividade"
            status={fidValue <= 100 ? "good" : fidValue <= 300 ? "needs-improvement" : "poor"}
          />
          
          {/* Adicione outros métricas aqui como Speed Index e Time to Interactive */}
        </div>
      </CardContent>
    </Card>
  );
};

export default DevicePerformancePanel;
