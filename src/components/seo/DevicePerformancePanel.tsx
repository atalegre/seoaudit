
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Gauge, Clock, Rocket } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { PageInsightsData } from '@/utils/api/pageInsights/types';
import { useIsMobile } from '@/hooks/use-mobile';

interface DevicePerformancePanelProps {
  data: PageInsightsData;
  deviceType: 'desktop' | 'mobile';
}

const DevicePerformancePanel: React.FC<DevicePerformancePanelProps> = ({ 
  data,
  deviceType
}) => {
  const isMobile = useIsMobile();
  
  // Function to determine color based on score
  const getScoreColor = (score: number) => {
    if (score >= 90) return "bg-green-500";
    if (score >= 50) return "bg-amber-500";
    return "bg-red-500";
  };
  
  // Function to format time values with proper units - with proper type checking
  const formatTime = (time: number | string | undefined | null) => {
    // Handle undefined or null values
    if (time === undefined || time === null) {
      return '0ms';
    }
    
    // Convert to number if it's a string
    const timeNum = typeof time === 'string' ? parseFloat(time) : time;
    
    // Guard against NaN or invalid values
    if (isNaN(timeNum)) {
      return '0ms';
    }
    
    if (timeNum < 1) return `${Math.round(timeNum * 1000)}ms`;
    return `${timeNum.toFixed(1)}s`;
  };

  // Safety check - if data is incomplete, display a fallback UI
  if (!data) {
    return (
      <Card>
        <CardHeader className="pb-2 md:pb-4">
          <CardTitle className="flex items-center gap-2 text-base md:text-lg">
            <Gauge className="h-4 w-4 md:h-5 md:w-5 text-primary" />
            Performance {deviceType === 'desktop' ? 'Desktop' : 'Mobile'}
          </CardTitle>
          <CardDescription className="text-xs md:text-sm">
            Dados incompletos ou indisponíveis
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-4 text-center">
            <p className="text-sm text-muted-foreground">Os dados de performance não estão disponíveis.</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  // Ensure all required numeric properties exist with defaults
  const performanceScore = data.performanceScore ?? 0;
  const fcp = data.fcp ?? 0;
  const lcp = data.lcp ?? 0;
  const tbt = data.tbt ?? 0;
  const cls = data.cls ?? 0;
  const speedIndex = data.speedIndex ?? 0;
  const tti = data.tti ?? 0;
  
  return (
    <Card>
      <CardHeader className="pb-2 md:pb-4">
        <CardTitle className="flex items-center gap-2 text-base md:text-lg">
          <Gauge className="h-4 w-4 md:h-5 md:w-5 text-primary" />
          Performance {deviceType === 'desktop' ? 'Desktop' : 'Mobile'}
        </CardTitle>
        <CardDescription className="text-xs md:text-sm">
          Métricas de velocidade e desempenho do site para {deviceType === 'desktop' ? 'desktop' : 'dispositivos móveis'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 md:space-y-6">
        {/* Overall Performance Score */}
        <div className="space-y-1 md:space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs md:text-sm font-medium">Performance Score</span>
            <span className={cn(
              "text-xs md:text-sm font-bold",
              performanceScore >= 90 ? "text-green-600" : 
              performanceScore >= 50 ? "text-amber-600" : 
              "text-red-600"
            )}>
              {performanceScore}/100
            </span>
          </div>
          <Progress 
            value={performanceScore} 
            className="h-1.5 md:h-2" 
            indicatorClassName={getScoreColor(performanceScore)} 
          />
        </div>
        
        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-1 md:gap-2 text-xs md:text-sm font-medium">
                <Clock className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
                First Contentful Paint
              </div>
              <span className="text-xs md:text-sm font-medium">{formatTime(fcp)}</span>
            </div>
            <Progress 
              value={Math.max(0, 100 - (fcp * 25))} 
              className="h-1 md:h-1.5" 
              indicatorClassName={getScoreColor(Math.max(0, 100 - (fcp * 25)))} 
            />
          </div>
          
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-1 md:gap-2 text-xs md:text-sm font-medium">
                <Clock className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
                Largest Contentful Paint
              </div>
              <span className="text-xs md:text-sm font-medium">{formatTime(lcp)}</span>
            </div>
            <Progress 
              value={Math.max(0, 100 - (lcp * 20))} 
              className="h-1 md:h-1.5" 
              indicatorClassName={getScoreColor(Math.max(0, 100 - (lcp * 20)))} 
            />
          </div>
          
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-1 md:gap-2 text-xs md:text-sm font-medium">
                <Clock className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
                Total Blocking Time
              </div>
              <span className="text-xs md:text-sm font-medium">{formatTime(tbt/1000)}</span>
            </div>
            <Progress 
              value={Math.max(0, 100 - (tbt / 5))} 
              className="h-1 md:h-1.5" 
              indicatorClassName={getScoreColor(Math.max(0, 100 - (tbt / 5)))} 
            />
          </div>
          
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-1 md:gap-2 text-xs md:text-sm font-medium">
                <Rocket className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
                Speed Index
              </div>
              <span className="text-xs md:text-sm font-medium">{formatTime(speedIndex)}</span>
            </div>
            <Progress 
              value={Math.max(0, 100 - (speedIndex * 15))} 
              className="h-1 md:h-1.5" 
              indicatorClassName={getScoreColor(Math.max(0, 100 - (speedIndex * 15)))} 
            />
          </div>
          
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-1 md:gap-2 text-xs md:text-sm font-medium">
                <Clock className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
                Time to Interactive
              </div>
              <span className="text-xs md:text-sm font-medium">{formatTime(tti)}</span>
            </div>
            <Progress 
              value={Math.max(0, 100 - (tti * 12))} 
              className="h-1 md:h-1.5" 
              indicatorClassName={getScoreColor(Math.max(0, 100 - (tti * 12)))} 
            />
          </div>
          
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-1 md:gap-2 text-xs md:text-sm font-medium">
                <Clock className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
                Cumulative Layout Shift
              </div>
              <span className="text-xs md:text-sm font-medium">{cls !== undefined ? cls.toFixed(3) : '0.000'}</span>
            </div>
            <Progress 
              value={Math.max(0, 100 - (cls * 400))} 
              className="h-1 md:h-1.5" 
              indicatorClassName={getScoreColor(Math.max(0, 100 - (cls * 400)))} 
            />
          </div>
        </div>
        
        <div className="pt-1 md:pt-2 text-[10px] md:text-xs text-muted-foreground">
          <p>Valores menores são melhores. Métricas baseadas no Lighthouse e nos Core Web Vitals.</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default DevicePerformancePanel;
