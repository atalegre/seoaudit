
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Zap, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import MetricCard from './MetricCard';

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
  const lcpStatus = lcp <= 2.5 ? "good" : lcp <= 4 ? "needs-improvement" : "poor";
  const clsStatus = cls <= 0.1 ? "good" : cls <= 0.25 ? "needs-improvement" : "poor";
  const fidStatus = fid <= 100 ? "good" : fid <= 300 ? "needs-improvement" : "poor";
  
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
        <div className={cn(
          "p-4 rounded-lg border text-sm flex items-start gap-3",
          overallStatus.status === "passed" ? "bg-green-50 border-green-100 text-green-800" : 
          overallStatus.status === "failed" ? "bg-red-50 border-red-100 text-red-800" : 
          "bg-amber-50 border-amber-100 text-amber-800"
        )}>
          {overallStatus.status === "passed" ? (
            <Zap className="h-5 w-5 flex-shrink-0 mt-0.5" />
          ) : (
            <AlertTriangle className="h-5 w-5 flex-shrink-0 mt-0.5" />
          )}
          <div>
            <p className="font-medium">
              {overallStatus.status === "passed" ? "Core Web Vitals aprovados" : 
               overallStatus.status === "failed" ? "Core Web Vitals reprovados" : 
               "Core Web Vitals precisam de atenção"}
            </p>
            <p className="mt-1">{overallStatus.message}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <MetricCard
            title="LCP"
            value={`${lcp.toFixed(1)}s`}
            icon={<Zap className="h-4 w-4" />}
            description="Largest Contentful Paint: tempo até o maior elemento visível renderizar"
            status={lcpStatus}
          />
          
          <MetricCard
            title="CLS"
            value={cls.toFixed(2)}
            icon={<Zap className="h-4 w-4" />}
            description="Cumulative Layout Shift: estabilidade visual durante o carregamento"
            status={clsStatus}
          />
          
          <MetricCard
            title="FID"
            value={`${fid}ms`}
            icon={<Zap className="h-4 w-4" />}
            description="First Input Delay: tempo de resposta ao primeiro clique"
            status={fidStatus}
          />
        </div>
        
        <div className="text-xs text-gray-500 mt-2">
          <p>
            <span className="font-medium">Bom:</span> LCP ≤ 2,5s • CLS ≤ 0,1 • FID ≤ 100ms
          </p>
          <p>
            <span className="font-medium">Precisa melhorar:</span> LCP ≤ 4,0s • CLS ≤ 0,25 • FID ≤ 300ms
          </p>
          <p>
            <span className="font-medium">Ruim:</span> LCP {">"} 4,0s • CLS {">"} 0,25 • FID {">"} 300ms
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default CoreWebVitalsPanel;
