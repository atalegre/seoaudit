
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Gauge, Clock, Rocket } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { PageInsightsData } from '@/utils/api/pageInsights/types';

interface DevicePerformancePanelProps {
  data: PageInsightsData;
  deviceType: 'desktop' | 'mobile';
}

const DevicePerformancePanel: React.FC<DevicePerformancePanelProps> = ({ 
  data,
  deviceType
}) => {
  // Function to determine color based on score
  const getScoreColor = (score: number) => {
    if (score >= 90) return "bg-green-500";
    if (score >= 50) return "bg-amber-500";
    return "bg-red-500";
  };
  
  // Function to format time values with proper units - with proper type checking
  const formatTime = (time: number | string) => {
    // Convert to number if it's a string
    const timeNum = typeof time === 'string' ? parseFloat(time) : time;
    
    // Guard against NaN or invalid values
    if (isNaN(timeNum) || timeNum === undefined || timeNum === null) {
      return '0ms';
    }
    
    if (timeNum < 1) return `${Math.round(timeNum * 1000)}ms`;
    return `${timeNum.toFixed(1)}s`;
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Gauge className="h-5 w-5 text-primary" />
          Performance {deviceType === 'desktop' ? 'Desktop' : 'Mobile'}
        </CardTitle>
        <CardDescription>
          Métricas de velocidade e desempenho do site para {deviceType === 'desktop' ? 'desktop' : 'dispositivos móveis'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Performance Score */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Performance Score</span>
            <span className={cn(
              "text-sm font-bold",
              data.performanceScore >= 90 ? "text-green-600" : 
              data.performanceScore >= 50 ? "text-amber-600" : 
              "text-red-600"
            )}>
              {data.performanceScore}/100
            </span>
          </div>
          <Progress 
            value={data.performanceScore} 
            className="h-2" 
            indicatorClassName={getScoreColor(data.performanceScore)} 
          />
        </div>
        
        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Clock className="h-4 w-4 text-muted-foreground" />
                First Contentful Paint
              </div>
              <span className="text-sm font-medium">{formatTime(data.fcp)}</span>
            </div>
            <Progress 
              value={Math.max(0, 100 - (data.fcp * 25))} 
              className="h-1.5" 
              indicatorClassName={getScoreColor(Math.max(0, 100 - (data.fcp * 25)))} 
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Clock className="h-4 w-4 text-muted-foreground" />
                Largest Contentful Paint
              </div>
              <span className="text-sm font-medium">{formatTime(data.lcp)}</span>
            </div>
            <Progress 
              value={Math.max(0, 100 - (data.lcp * 20))} 
              className="h-1.5" 
              indicatorClassName={getScoreColor(Math.max(0, 100 - (data.lcp * 20)))} 
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Clock className="h-4 w-4 text-muted-foreground" />
                Total Blocking Time
              </div>
              <span className="text-sm font-medium">{formatTime(data.tbt/1000)}</span>
            </div>
            <Progress 
              value={Math.max(0, 100 - (data.tbt / 5))} 
              className="h-1.5" 
              indicatorClassName={getScoreColor(Math.max(0, 100 - (data.tbt / 5)))} 
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Rocket className="h-4 w-4 text-muted-foreground" />
                Speed Index
              </div>
              <span className="text-sm font-medium">{formatTime(data.speedIndex)}</span>
            </div>
            <Progress 
              value={Math.max(0, 100 - (data.speedIndex * 15))} 
              className="h-1.5" 
              indicatorClassName={getScoreColor(Math.max(0, 100 - (data.speedIndex * 15)))} 
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Clock className="h-4 w-4 text-muted-foreground" />
                Time to Interactive
              </div>
              <span className="text-sm font-medium">{formatTime(data.tti)}</span>
            </div>
            <Progress 
              value={Math.max(0, 100 - (data.tti * 12))} 
              className="h-1.5" 
              indicatorClassName={getScoreColor(Math.max(0, 100 - (data.tti * 12)))} 
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Clock className="h-4 w-4 text-muted-foreground" />
                Cumulative Layout Shift
              </div>
              <span className="text-sm font-medium">{data.cls.toFixed(3)}</span>
            </div>
            <Progress 
              value={Math.max(0, 100 - (data.cls * 400))} 
              className="h-1.5" 
              indicatorClassName={getScoreColor(Math.max(0, 100 - (data.cls * 400)))} 
            />
          </div>
        </div>
        
        <div className="pt-2 text-xs text-muted-foreground">
          <p>Valores menores são melhores. Métricas baseadas no Lighthouse e nos Core Web Vitals.</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default DevicePerformancePanel;
