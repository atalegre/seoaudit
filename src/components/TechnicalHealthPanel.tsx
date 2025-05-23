
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Zap, Smartphone, Lock, Image } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import MetricItem from './metrics/MetricItem';
import CoreWebVitalsSection from './metrics/CoreWebVitalsSection';
import AlertBanner from './metrics/AlertBanner';

interface TechnicalHealthPanelProps {
  loadTimeDesktop: number;
  loadTimeMobile: number;
  mobileFriendly: boolean;
  security: boolean;
  imageOptimization: number;
  performanceScore: number;
  lcp?: number;
  cls?: number;
  fid?: number;
  className?: string;
}

// Removido React.memo para simplificar renderização
const TechnicalHealthPanel = ({
  loadTimeDesktop,
  loadTimeMobile,
  mobileFriendly,
  security,
  imageOptimization,
  performanceScore,
  lcp = 2.5,
  cls = 0.25,
  fid = 100,
  className
}: TechnicalHealthPanelProps) => {
  // Função simplificada para status
  const getSpeedStatus = (seconds: number) => 
    seconds <= 2 ? 'success' : seconds <= 4 ? 'warning' : 'error';

  // Textos pré-definidos sem cálculos dinâmicos
  const mobileFriendlyText = mobileFriendly ? 'Sim' : 'Não';
  
  return (
    <Card className={cn("border-blue-100", className)}>
      <CardHeader className="pb-2 border-b border-blue-50">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-medium flex items-center gap-2">
            <Zap className="h-5 w-5 text-blue-500" />
            Saúde Técnica do Site
          </CardTitle>
          <Badge 
            variant="outline" 
            className={cn(
              "px-2 py-0.5",
              performanceScore >= 80 ? "bg-green-50 text-green-700 border-green-200" :
              performanceScore >= 60 ? "bg-amber-50 text-amber-700 border-amber-200" :
              "bg-red-50 text-red-700 border-red-200"
            )}
          >
            {performanceScore}%
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-4 grid gap-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <MetricItem 
            title="Carregamento Desktop" 
            value={`${loadTimeDesktop.toFixed(1)}s`}
            status={getSpeedStatus(loadTimeDesktop)}
            icon={<Zap className={cn("h-4 w-4", loadTimeDesktop <= 2 ? "text-green-500" : 
                                       loadTimeDesktop <= 4 ? "text-amber-500" : "text-red-500")} />}
            description={loadTimeDesktop <= 2 ? "Excelente tempo de resposta" : 
                         loadTimeDesktop <= 4 ? "Tempo de resposta aceitável" : "Tempo de resposta lento"}
          />
          <MetricItem 
            title="Carregamento Mobile" 
            value={`${loadTimeMobile.toFixed(1)}s`}
            status={getSpeedStatus(loadTimeMobile)}
            icon={<Smartphone className={cn("h-4 w-4", loadTimeMobile <= 2 ? "text-green-500" : 
                                         loadTimeMobile <= 4 ? "text-amber-500" : "text-red-500")} />}
            description={loadTimeMobile <= 2 ? "Rápido em dispositivos móveis" : 
                         loadTimeMobile <= 4 ? "Aceitável em dispositivos móveis" : "Lento em dispositivos móveis"}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <MetricItem 
            title="Adaptável para Mobile" 
            value={mobileFriendlyText}
            status={mobileFriendly ? 'success' : 'error'}
            icon={<Smartphone className={cn("h-4 w-4", mobileFriendly ? "text-green-500" : "text-red-500")} />}
            description={mobileFriendly ? "Site otimizado para dispositivos móveis" : "Site não adaptado para visualização móvel"}
          />
          <MetricItem 
            title="Segurança HTTPS" 
            value={security ? "Seguro" : "Inseguro"}
            status={security ? 'success' : 'error'}
            icon={<Lock className={cn("h-4 w-4", security ? "text-green-500" : "text-red-500")} />}
            description={security ? "Conexão segura estabelecida" : "Site sem proteção HTTPS"}
          />
        </div>
        
        <MetricItem 
          title="Otimização de Imagens" 
          value={`${imageOptimization}%`}
          status={imageOptimization >= 70 ? 'success' : imageOptimization >= 40 ? 'warning' : 'error'}
          icon={<Image className={cn("h-4 w-4", 
                           imageOptimization >= 70 ? "text-green-500" : 
                           imageOptimization >= 40 ? "text-amber-500" : "text-red-500")} />}
          description={imageOptimization >= 70 ? "Imagens bem otimizadas" : 
                       imageOptimization >= 40 ? "Otimização parcial de imagens" : "Imagens sem otimização adequada"}
        />
        
        {loadTimeMobile > 4 && (
          <AlertBanner 
            condition={true}
            message="Tempo de carregamento acima de 4s em mobile"
            type="warning"
          />
        )}
        
        {/* Componente simplificado sem métricas de web vitals detalhadas */}
        <div className="mt-2 border border-gray-100 rounded-md p-3 bg-gray-50">
          <h3 className="text-sm font-medium mb-2">Core Web Vitals</h3>
          <p className="text-xs text-gray-500">Métricas de desempenho simplificadas para melhorar o tempo de carregamento</p>
        </div>
      </CardContent>
    </Card>
  );
};

TechnicalHealthPanel.displayName = 'TechnicalHealthPanel';

export default TechnicalHealthPanel;
