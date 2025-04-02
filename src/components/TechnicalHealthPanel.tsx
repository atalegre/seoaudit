
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Zap, Smartphone, Lock, Image, Check, AlertCircle, AlertTriangle, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface MetricItemProps {
  title: string;
  value: string | number;
  status: 'success' | 'warning' | 'error' | 'neutral';
  icon: React.ReactNode;
  description?: string;
}

const MetricItem: React.FC<MetricItemProps> = ({ 
  title, 
  value, 
  status, 
  icon,
  description 
}) => {
  const statusColor = {
    success: "text-green-500",
    warning: "text-amber-500",
    error: "text-red-500",
    neutral: "text-blue-500",
  };
  
  const statusBg = {
    success: "bg-green-50",
    warning: "bg-amber-50",
    error: "bg-red-50",
    neutral: "bg-blue-50",
  };
  
  const statusIcon = {
    success: <Check className="h-4 w-4 text-green-500" />,
    warning: <AlertCircle className="h-4 w-4 text-amber-500" />,
    error: <X className="h-4 w-4 text-red-500" />,
    neutral: <AlertTriangle className="h-4 w-4 text-blue-500" />,
  };
  
  return (
    <div className="flex items-center gap-3 p-3 rounded-lg border">
      <div className={cn("p-2 rounded-full", statusBg[status])}>
        {icon}
      </div>
      <div className="flex-grow">
        <div className="flex justify-between items-center">
          <h4 className="text-sm font-medium">{title}</h4>
          <div className="flex items-center gap-1">
            {statusIcon[status]}
            <span className={cn("text-sm font-medium", statusColor[status])}>
              {value}
            </span>
          </div>
        </div>
        {description && (
          <p className="text-xs text-gray-500 mt-1">{description}</p>
        )}
      </div>
    </div>
  );
};

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
}

const TechnicalHealthPanel: React.FC<TechnicalHealthPanelProps> = ({
  loadTimeDesktop,
  loadTimeMobile,
  mobileFriendly,
  security,
  imageOptimization,
  performanceScore,
  lcp = 2.5,
  cls = 0.25,
  fid = 100
}) => {
  // Helper function to determine speed status
  const getSpeedStatus = (seconds: number) => {
    if (seconds <= 2) return 'success';
    if (seconds <= 4) return 'warning';
    return 'error';
  };
  
  // Helper function for web vital status
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
  
  // Helper function to format mobile friendly status
  const getMobileFriendlyText = () => {
    return mobileFriendly ? 'Sim' : 'Não';
  };
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-medium flex items-center gap-2">
            <Zap className="h-5 w-5 text-orange-500" />
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
            value={getMobileFriendlyText()}
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
        
        <div className="mt-2">
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
      </CardContent>
    </Card>
  );
};

export default TechnicalHealthPanel;
